/* ==========================================================
   INSTRUMENTAÇÃO TEMPORÁRIA · js/instrument.js  (TRACE)
   ==========================================================
   Diagnóstico do "sumiço/recarregamento" no iPhone.

   REGRAS DESTA CAMADA:
   · NENHUMA mudança de comportamento, layout ou arquitetura.
   · NÃO toca em motion.js / app.js / style.css.
   · Só ativa com ?trace=1 na URL — visita normal não muda NADA.
   · Reversível: apagar a <script> do index.html + este arquivo.

   O que prova cada sequência (ver entrega ao final da sessão):
   reload        → pagehide → pageshow(persisted=false) → load → INIT...
   restauração   → pageshow(persisted=true)  (sem load)
   reset do VM   → VIEW_CHANGE →home SEM pagehide/load e SEM INIT
   viewport      → RESIZE/visualViewport com delta grande
   stall/repaint → heartbeat para (gap) SEM pagehide; ou FPS colapsa
   scroll código → SCROLL_TO/SCROLL_INTO_VIEW com caller de app.js
   ========================================================== */
(function(global){
  'use strict';

  var ACTIVE = /[?&]trace=1(\b|$)/.test(global.location.search);
  if(!ACTIVE) return; /* carga normal: zero efeito no site */

  var doc = document;
  var SK = '__trace';                 /* prefixo do sessionStorage */
  var BUF = [];                       /* anel em memória (últimos 120) */
  var RING = [];                      /* persistido (últimos 60) */
  var beat = null;                    /* último batimento (Date.now) */
  var lastClick = null;               /* {ts, kind} do último clique de nav */
  var initCounts = {};                /* INIT por módulo */
  var listeners = {};                 /* addEventListener por tipo */
  var rafTotal = 0, fpsWin = 0, fps = null, fpsBase = performance.now();
  var lastScrollY = null, scrollIdle = 0;
  var persistTimer = null;
  var loads = 0;
  var ui = null;                      /* overlay (chip + painel) */

  /* ——————————————————————————————————————————————
     utilitários
     —————————————————————————————————————————————— */
  function p2(n){ return (n<10?'0':'')+n; }
  function p3(n){ return (n<100?'0':'')+(n<10?'0':'')+n; }
  function stamp(){ var d=new Date(); return p2(d.getHours())+':'+p2(d.getMinutes())+':'+p2(d.getSeconds())+'.'+p3(d.getMilliseconds()); }
  function monot(){ return '+'+((performance.now()/1000)).toFixed(2)+'s'; }

  function activeView(){
    var el = doc.querySelector('.views .view.active');
    if(!el) return '(NENHUMA)';
    return el.getAttribute('data-view') || el.id || '?';
  }

  /* snapshot completo — o que todo log carrega junto */
  function snap(){
    var vv = global.visualViewport;
    return {
      v: doc.visibilityState,
      iw: global.innerWidth, ih: global.innerHeight,
      vw: vv?vv.width:null, vh: vv?vv.height:null,
      sy: global.scrollY, view: activeView(),
      ch: doc.documentElement.clientHeight
    };
  }

  function fmtSnap(s){
    return '{v:'+s.v+',iw:'+s.iw+',ih:'+s.ih+',vw:'+s.vw+',vh:'+s.vh+',sy:'+s.sy+',view:'+s.view+',ch:'+s.ch+',h:'+global.location.href.slice(0,60)+'}';
  }

  function stackLine(skip){
    try{ var e = new Error(); }
    catch(err){ return ''; }
    return (e.stack||'').split('\n').slice(skip, skip+2).join(' → ').trim();
  }

  function tagClass(el){
    var out = el.tagName ? el.tagName.toLowerCase() : String(el);
    if(el.className && typeof el.className === 'string'){
      out += '.'+el.className.split(/\s+/).slice(0,3).join('.');
    } else if(el.getAttribute && el.getAttribute('data-view')) {
      out += '[data-view='+el.getAttribute('data-view')+']';
    }
    return out.slice(0, 60);
  }

  /* ——————————————————————————————————————————————
     log → console + anel + overlay + persistência
     —————————————————————————————————————————————— */
  function log(type, detail, opts){
    opts = opts || {};
    var s = snap();
    var l = stamp()+' '+monot()+' '+type+' '+(detail||'')+' '+fmtSnap(s);
    BUF.push(l); if(BUF.length>120) BUF.shift();
    RING.push({t: Date.now(), l: l});
    if(RING.length>60) RING.shift();
    /* BEAT só aparece no console de forma esparsa (a cada 3) */
    if(type !== 'BEAT' || (RING.length % 3) === 0) console.log(l);
    if(ui) ui.render();
    if(opts.force){ persist(); }
    else schedulePersist();
  }

  function schedulePersist(){
    if(persistTimer) return;
    persistTimer = setTimeout(function(){
      persistTimer = null;
      persist();
    }, 800);
  }

  function persist(){
    try{
      var ring = JSON.stringify(RING);
      var beatJ = beat ? JSON.stringify(beat) : null;
      var initJ = JSON.stringify(initCounts);
      var t = stamp()+' '+monot();
      sessionStorage.setItem(SK+'_beat', t+'|'+(beatJ||''));
      sessionStorage.setItem(SK+'_ring', ring);
      sessionStorage.setItem(SK+'_init', initJ);
      sessionStorage.setItem(SK+'_loads', String(loads));
    }catch(e){ /* armazenamento indisponível: segue sem persistir */ }
  }

  function readPersist(key){
    try{ return sessionStorage.getItem(SK+'_'+key); }
    catch(e){ return null; }
  }

  /* ——————————————————————————————————————————————
     1 · CICLO DE VIDA
     —————————————————————————————————————————————— */
  global.addEventListener('load', function(){
    loads = (parseInt(readPersist('loads'),10)||0) + 1;
    /* análise de continuidade entre o load anterior e este */
    var prevBeat = readPersist('beat');
    var gap = 0;
    if(prevBeat){
      try{
        var b = JSON.parse(prevBeat.split('|')[1]||'null');
        if(b) gap = Math.round((Date.now()-b.t)/1000);
      }catch(e){}
    }
    log('LOAD', '#'+loads+(gap>0?' · gap desde último heartbeat: '+gap+'s':'')+' · INITIAL_VIEW='+activeView(), {force:true});
    global.setTimeout(function(){
      auditCanvas();
      log('AUDIT', 'inits='+JSON.stringify(initCounts)+' listeners='+JSON.stringify(listeners));
    }, 1200);
  });

  global.addEventListener('pageshow', function(e){
    log('PAGESHOW', 'persisted='+e.persisted+(e.persisted ? ' ← RESTAURAÇÃO (bfcache/volta de aba), NÃO é reload' : ' ← novo load/navegação'), {force:true});
  });

  global.addEventListener('pagehide', function(e){
    log('PAGEHIDE', 'persisted='+e.persisted+' ← documento está saindo (reload? navegação? fechar aba?)', {force:true});
  });

  global.addEventListener('beforeunload', function(){
    log('BEFOREUNLOAD', 'documento será descarregado', {force:true});
  });

  doc.addEventListener('visibilitychange', function(){
    log('VISIBILITY', 'state='+doc.visibilityState+(doc.hidden?' ← aba/atividade oculta (Safari pode pausar rAF aqui)':''), {force: doc.hidden});
  });

  global.addEventListener('popstate', function(){
    log('NAV_URL', 'popstate → '+global.location.href);
  });

  global.addEventListener('hashchange', function(){
    log('NAV_URL', 'hashchange → '+global.location.href);
  });

  /* pushState/replaceState programáticos (navegação por código) */
  ['pushState','replaceState'].forEach(function(m){
    var orig = global.history[m];
    global.history[m] = function(){
      log('NAV_URL', m+' → '+arguments[2]+' · caller: '+stackLine(2));
      return orig.apply(this, arguments);
    };
  });

  /* ——————————————————————————————————————————————
     2 · VIEW MANAGER — captura REAL pelo DOM
     (o closure de app.js chama open() internamente, então o
     caminho confiável é observar as classes no DOM)
     —————————————————————————————————————————————— */
  doc.addEventListener('click', function(e){
    var t = e.target;
    var nav = t.closest ? t.closest('.app-nav [data-view]') : null;
    var link = t.closest ? t.closest('[data-view-link]') : null;
    if(nav || link){
      var kind = nav ? 'nav:'+nav.getAttribute('data-view') : 'link:'+link.getAttribute('data-view-link');
      lastClick = {ts: performance.now(), kind: kind};
      log('CLICK', kind);
    }
  }, true);

  var viewsRoot = doc.querySelector('.views');
  if(viewsRoot && 'MutationObserver' in global){
    var fromView = activeView();
    new MutationObserver(function(muts){
      var now = performance.now();
      var activeEls = viewsRoot.querySelectorAll('.view.active');
      var toView = activeView();
      /* 1) estado anormal: nenhuma view ativa OU mais de uma */
      if(activeEls.length === 0){
        log('VIEW_STATE_EMPTY', 'NENHUMA view ativa no DOM ← conteúdo "sumiu" sem troca de view');
        return;
      }
      if(activeEls.length > 1){
        log('VIEW_STATE_MULTIPLE', activeEls.length+' views ativas simultâneas');
        return;
      }
      if(toView !== fromView){
        var reason = '?';
        if(lastClick && (now-lastClick.ts) < 1500) reason = lastClick.kind;
        log('VIEW_CHANGE', 'from:'+fromView+' → to:'+toView+' · reason:'+reason+(toView==='home' ? '  ← HOME ESCOLHIDA DE NOVO' : ''));
        fromView = toView;
      }
    }).observe(viewsRoot, {attributes:true, attributeFilter:['class','aria-hidden'], subtree:false});
  }

  /* ——————————————————————————————————————————————
     3 · SCROLL — só eventos relevantes
     —————————————————————————————————————————————— */
  doc.addEventListener('scroll', function(){
    var y = global.scrollY;
    var now = performance.now();
    var h = global.innerHeight;

    if(!scrollIdle || (now-scrollIdle) > 700){
      log('SCROLL', 'início y='+y);
      scrollIdle = now;
    }
    else if(y === 0 && lastScrollY !== 0){
      log('SCROLL', 'RETORNO a 0 (topo)');
      scrollIdle = now;
    }
    else if(lastScrollY !== null && h && Math.abs(y-lastScrollY) > h*0.5){
      log('SCROLL_JUMP', 'salto abrupto: '+lastScrollY+' → '+y);
    }
    lastScrollY = y;
  }, {passive:true});

  /* scrollIntoView (inclui behavior:'smooth' do app.js/updateNav) */
  var oSIV = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(opts){
    log('SCROLL_INTO_VIEW', JSON.stringify(opts)+' → <'+tagClass(this)+'> · caller: '+stackLine(2));
    return oSIV.apply(this, arguments);
  };

  /* window.scrollTo / window.scroll — app.js chama scrollTo(0,0) */
  ['scrollTo','scroll'].forEach(function(m){
    var orig = global[m];
    global[m] = function(){
      var a = Array.prototype.slice.call(arguments).map(function(v){
        return typeof v === 'object' ? JSON.stringify(v) : v;
      }).join(',');
      log('SCROLL_TO', m+'('+a+') · caller: '+stackLine(2));
      return orig.apply(global, arguments);
    };
  });

  /* ——————————————————————————————————————————————
     4 · VIEWPORT (Safari barra de endereço → deltas)
     —————————————————————————————————————————————— */
  var lastVP = {ih: null, vh: null, ch: null};
  function vpDelta(){
    var s = snap();
    var d = {
      ih: s.ih-(lastVP.ih===null?s.ih:lastVP.ih),
      vh: s.vh-(lastVP.vh===null?s.vh:lastVP.vh),
      ch: s.ch-(lastVP.ch===null?s.ch:lastVP.ch)
    };
    lastVP = {ih:s.ih, vh:s.vh, ch:s.ch};
    return d;
  }

  global.addEventListener('resize', function(){
    var d = vpDelta();
    log('RESIZE', 'Δ innerHeight='+d.ih+' · Δ visualViewport.height='+d.vh+' · Δ clientHeight='+d.ch
      + (Math.abs(d.ih)>25||Math.abs(d.vh)>25 ? '  ← MUDANÇA GRANDE DE VIEWPORT (barra de endereço?)' : ''));
  });

  global.addEventListener('orientationchange', function(){
    log('ORIENTATION', 'angle='+(global.orientation||'?')+' · '+global.innerWidth+'×'+global.innerHeight);
  });

  if(global.visualViewport){
    global.visualViewport.addEventListener('resize', function(){
      var d = vpDelta();
      log('VV_RESIZE', 'visualViewport.height='+global.visualViewport.height+' (Δ '+(lastVP&&lastVP.vh!=null?d.vh:'?')+') · scrollTo='+global.scrollY);
      lastVP = {ih: global.innerHeight, vh: global.visualViewport.height, ch: doc.documentElement.clientHeight};
    });

    /* ——— barra de endereço do Safari: a animação de colapsar/expandir
       é visível por ESTE evento (visualViewport.scroll, com offsetTop
       variando), que pode disparar sozinho — sem resize — em iOS 16+.
       Throttling: no máximo 1 log a cada 300ms; só loga quando a
       posição realmente mudou (offsetTop ou offsetLeft). offsetTop
       negativo = barra colapsada; 0 = barra expandida. Só o
       instrument.js escuta isto — nenhum código de produção. ——— */
    var lastVV = {ot: null, ol: null};
    var lastVVLog = 0;
    global.visualViewport.addEventListener('scroll', function(){
      var vv = global.visualViewport;
      var now = performance.now();
      var changed = vv.offsetTop !== lastVV.ot || vv.offsetLeft !== lastVV.ol;
      lastVV = {ot: vv.offsetTop, ol: vv.offsetLeft};
      if(!changed) return;
      if(now - lastVVLog < 300) return;
      lastVVLog = now;
      log('VV_SCROLL', 'offsetTop='+vv.offsetTop.toFixed(1)+' · offsetLeft='+vv.offsetLeft.toFixed(1)+' · height='+vv.height.toFixed(1)
        + (vv.offsetTop < 0 ? '  ← barra colapsada (viewport maior que a área visível)' : ''));
    }, {passive:true});
  }

  /* ——————————————————————————————————————————————
     5 · ERROS (sem mascarar: nada de preventDefault)
     —————————————————————————————————————————————— */
  global.addEventListener('error', function(e){
    log('ERROR', (e.message||'?')+' @ '+e.filename+':'+e.lineno+':'+e.colno, {force:true});
  }, true);

  global.addEventListener('unhandledrejection', function(e){
    var r = e.reason;
    log('UNHANDLED_REJECTION', (r && r.stack ? r.stack : String(r)).slice(0, 300), {force:true});
  });

  /* ——————————————————————————————————————————————
     6 · INICIALIZAÇÕES — quantas vezes cada sistema roda
     —————————————————————————————————————————————— */
  function wrapModule(name, obj, methods){
    var out = {};
    for(var k in obj){ out[k] = obj[k]; }
    methods.forEach(function(m){
      if(typeof obj[m] !== 'function') return;
      out[m] = function(){
        initCounts[name+'.'+m] = (initCounts[name+'.'+m]||0)+1;
        var n = initCounts[name+'.'+m];
        log('INIT', name+'.'+m+' #'+n+(n>1 ? '  ← INICIALIZOU '+n+' VEZES' : ''));
        return obj[m].apply(this, arguments);
      };
    });
    return out;
  }

  function hookPending(name, methods){
    var cur = null, set = false;
    Object.defineProperty(global, name, {
      configurable: true,
      get: function(){ return cur; },
      set: function(v){
        if(set) log('MODULE', name+' REDEFINIDO (2ª definição no mesmo documento)');
        set = true;
        cur = wrapModule(name, v, methods);
      }
    });
  }

  /* já existentes (vêm do motion.js, carregado antes) */
  if(global.HubMotion) global.HubMotion = wrapModule('HubMotion', global.HubMotion, ['init','setStatic','setRunning']);

  /* definidos depois deste arquivo rodar (vêm do app.js) — o setter
     intercepta a atribuição e embrulha ANTES do bootstrap chamar init() */
  hookPending('ViewManager', ['init']);
  hookPending('HubDust', ['init','resize']);
  hookPending('HubReveal', ['init']);
  hookPending('HubBreathe', ['init']);
  hookPending('HubLightbox', ['init']);
  hookPending('HubInteractions', ['init']);

  /* ——————————————————————————————————————————————
     7 · LISTENERS repetidos + CANVAS + rAF
     —————————————————————————————————————————————— */
  var origAddEL = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, fn, opts){
    listeners[type] = (listeners[type]||0)+1;
    if(listeners[type] === 1){
      log('LISTENER', type+' no <'+tagClass(this)+'> (1º) · caller: '+stackLine(2));
    }
    return origAddEL.call(this, type, fn, opts);
  };

  var origRAF = global.requestAnimationFrame;
  global.requestAnimationFrame = function(cb){
    rafTotal++; fpsWin++;
    if(rafTotal === 1) log('RAF', 'primeira chamada — loop de renderização iniciado');
    return origRAF.call(global, cb);
  };

  /* amostra de fps a cada 2s; loga a cada 10s e imediatamente se cair */
  var fpsSamples = 0;
  setInterval(function(){
    var now = performance.now();
    var dt = (now-fpsBase)/1000;
    fps = dt>0 ? fpsWin/dt : null;
    fpsWin = 0; fpsBase = now;
    fpsSamples++;
    if(fps !== null && (fps < 20 || fpsSamples % 5 === 0)){
      log('FPS', (fps<20 ? 'COLAPSO DE QUADROS ' : '')+fps.toFixed(1)+' fps (rAF total: '+rafTotal+')');
    }
  }, 2000);

  function auditCanvas(){
    var canvases = doc.querySelectorAll('canvas');
    var ids = [];
    for(var i=0;i<canvases.length;i++){
      ids.push('#'+canvases[i].id+' ('+canvases[i].width+'×'+canvases[i].height+')');
    }
    log('CANVAS', 'total='+canvases.length+(canvases.length>1 ? '  ← MAIS DE UM CANVAS' : '')+' ['+ids.join(', ')+']');
  }

  /* ——————————————————————————————————————————————
     8 · BATIMENTO — prova de vida (persistido para o load seguinte)
     —————————————————————————————————————————————— */
  function heartbeat(){
    beat = {
      t: Date.now(),
      sy: global.scrollY,
      view: activeView(),
      ih: global.innerHeight,
      vh: global.visualViewport ? global.visualViewport.height : null
    };
    log('BEAT', 'viva · scrollY='+beat.sy+' · view='+beat.view);
  }
  setInterval(heartbeat, 5000);
  global.addEventListener('pagehide', persist);
  global.addEventListener('beforeunload', persist);
  doc.addEventListener('visibilitychange', function(){ if(doc.hidden) persist(); });

  /* ——————————————————————————————————————————————
     OVERLAY — painel diagnóstico flutuante (só com ?trace=1)
     —————————————————————————————————————————————— */
  var panelVisible = true;
  ui = {
    el: null, chip: null, body: null, footer: null,
    build: function(){
      var self = this;
      this.chip = doc.createElement('div');
      this.chip.textContent = '● TRACE';
      this.chip.style.cssText = 'position:fixed;top:8px;right:8px;z-index:999999;background:rgba(10,20,35,.9);color:#ffd36b;font:600 11px/1 Menlo,Consolas,monospace;padding:6px 9px;border-radius:4px;border:1px solid rgba(255,255,255,.18);letter-spacing:.08em;cursor:pointer;-webkit-user-select:none;user-select:none;';
      this.chip.addEventListener('click', function(){ self.toggle(); });

      this.el = doc.createElement('div');
      this.el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:999998;width:min(430px,calc(100vw - 16px));max-height:42vh;overflow:hidden;background:rgba(10,20,35,.93);color:#cfe0f5;font:10.5px/1.5 Menlo,Consolas,monospace;padding:7px 9px;border:1px solid rgba(255,255,255,.16);border-radius:6px;box-sizing:border-box;pointer-events:none;white-space:pre-wrap;word-break:break-all;';
      this.el.innerHTML = '<div style="color:#ffd36b;letter-spacing:.06em;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">TRACE — instrumentação temporária<span id="__trace_x" style="pointer-events:auto;cursor:pointer;padding:2px 6px;color:#fff;">✕</span></div><div id="__trace_body"></div><div id="__trace_foot" style="color:#8fa5c4;margin-top:4px;"></div>';
      this.body = this.el.querySelector('#__trace_body');
      this.footer = this.el.querySelector('#__trace_foot');
      this.el.querySelector('#__trace_x').addEventListener('click', function(){ self.hide(); });

      doc.body.appendChild(this.chip);
      doc.body.appendChild(this.el);
    },
    toggle: function(){
      panelVisible = !panelVisible;
      this.el.style.display = panelVisible ? '' : 'none';
    },
    hide: function(){
      panelVisible = false;
      this.el.style.display = 'none';
    },
    render: function(){
      if(!this.el) this.build();
      if(!panelVisible) return;
      var tail = BUF.slice(-12).reverse().join('\n');
      var beatAge = beat ? Math.round((Date.now()-beat.t)/1000)+'s atrás' : '—';
      this.body.textContent = tail;
      this.footer.textContent = 'load #'+loads+' · beat '+beatAge+' · fps '+(fps!==null?fps.toFixed(1):'?')+' · view: '+activeView();
    }
  };
  ui.render();

  /* ——————————————————————————————————————————————
     API — para marcar momentos à mão no console:
       __TRACE.mark('agora vou rolar a Demo');
       __TRACE.summary();
     —————————————————————————————————————————————— */
  global.__TRACE = {
    mark: function(msg){ log('MARK', String(msg), {force:true}); },
    summary: function(){
      console.log('[TRACE] loads='+loads+' inits='+JSON.stringify(initCounts)+' listeners='+JSON.stringify(listeners)+' rafTotal='+rafTotal);
      console.log('[TRACE] últimos eventos:');
      BUF.slice(-25).forEach(function(l){ console.log('  '+l); });
    },
    buffer: BUF
  };

  log('TRACE_ON', 'instrumentação ativa (remover depois: tag do index.html + js/instrument.js)', {force:true});
})(window);
