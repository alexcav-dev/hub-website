/* ==========================================================
   DIAGNÓSTICO PERSISTENTE DE RECARGA · js/crash-diagn.js
   ==========================================================
   SPRINT "INVESTIGAÇÃO FINAL" (v3) — NÃO é correção: é instrumento.
   O objetivo é distinguir, no PRÓXIMO reload do iPhone, entre:
     A) navegação/reload real (quem iniciou?)
     B) WebContent morto + aba restaurada pelo Safari
     C) restauração bfcache (pageshow.persisted=true, sem documento novo)
     D) o próprio aplicativo reinicializando (INIT 2× no MESMO doc)
     E) sem documento novo (apenas repaint/viewport stall)

   O que este instrumento REGISTRA (nada altera o comportamento):
   · bootId — identificador único por documento carregado;
   · n — contador de cargas (sessionStorage; espelho em localStorage);
   · NAV — performance.getEntriesByType('navigation')[0] completo:
     type, redirectCount, activationStart, domInteractive,
     domContentLoadedEventEnd, loadEventEnd, transferSize,
     encodedBodySize, decodedBodySize (o que a API oferecer);
   · referrer + URL completa + timeOrigin — para reconstruir a
     timeline entre boots (quem veio de onde, quanto tempo passou);
   · visibilidade final da sessão anterior (document.hidden);
   · INIT counters POR DOCUMENTO de 7 sistemas
     (ViewManager/HubMotion/HubDust/HubReveal/HubBreathe/
      HubInteractions/HubLightbox) — se qualquer um disparar 2×
      com o MESMO bootId, é o próprio aplicativo (CASE D);
   · página: pageshow(persisted)/pagehide/beforeunload/visibilitychange/
     freeze/resume/unload (registrados sempre que o Safari disparar);
   · VIEW_INIT / VIEW_CHANGE(from→to, reason) / VIEW_COMPLETE
     — via MutationObserver no .views (sempre ligado, barato);
   · anel de eventos (48) + espelho localStorage sobrevivente ao kill;
   · arquivo de boots (localStorage, 48 registros).

   Consumo: ~150-300B por heartbeat (2s) + 1 gravação por evento.
   Remoção depois do diagnóstico: <script> do index.html + este arquivo.
   ========================================================== */
(function(global){
  'use strict';

  var K = '__hub_crash';
  var LK = '__hub_crash_live';    /* espelho que sobrevive ao kill */
  var AK = '__hub_crash_arch';    /* arquivo de boots (localStorage) */
  var DOC = global.document;
  var SS = null, LS = null;
  try{ SS = global.sessionStorage; }catch(e){ SS = null; }
  try{ LS = global.localStorage;  }catch(e){ LS = null; }
  var tab = Math.random().toString(36).slice(2, 10);   /* id desta aba */
  var TS = Date.now();                                  /* boot (relógio real) */

  /* ————— BOOT ID: identificador único deste documento ————— */
  var bootId = Math.random().toString(36).slice(2, 8) + TS.toString(36);

  /* ————— NAVEGAÇÃO: entry completa (o que a API oferecer) ————— */
  var NAV = null;
  try{
    var navs = global.performance && global.performance.getEntriesByType
      ? global.performance.getEntriesByType('navigation') : [];
    if(navs.length){
      NAV = {
        type:            navs[0].type                    || null,
        redirectCount:   navs[0].redirectCount           !== undefined ? navs[0].redirectCount           : null,
        activationStart: navs[0].activationStart         !== undefined ? navs[0].activationStart         : null,
        domInteractive:  navs[0].domInteractive          !== undefined ? navs[0].domInteractive          : null,
        dcl:             navs[0].domContentLoadedEventEnd !== undefined ? navs[0].domContentLoadedEventEnd : null,
        load:            navs[0].loadEventEnd            !== undefined ? navs[0].loadEventEnd            : null,
        transfer:        navs[0].transferSize            !== undefined ? navs[0].transferSize            : null,
        encoded:         navs[0].encodedBodySize         !== undefined ? navs[0].encodedBodySize         : null,
        decoded:         navs[0].decodedBodySize         !== undefined ? navs[0].decodedBodySize         : null
      };
    }
  }catch(e){ NAV = null; }
  var navType = NAV && NAV.type ? NAV.type : '?';

  var REFERRER = (function(){ try{ return DOC.referrer || ''; }catch(e){ return ''; } })();
  var HREF = (function(){ try{ return global.location.href || ''; }catch(e){ return ''; } })();
  var ULA = (function(){
    try{
      var l = global.location;
      return {
        path: l.pathname.length <= 90 ? l.pathname : l.pathname.slice(0, 87) + '…',
        qlen: (l.search || '').length,
        hash: l.hash || ''
      };
    }catch(e){ return { path:'?', qlen:0, hash:'' }; }
  })();

  /* escala temporal: timeOrigin do documento (quando suportado) */
  var TPO = null;
  try{
    if(global.performance && typeof global.performance.timeOrigin === 'number'){
      TPO = global.performance.timeOrigin;
    }
  }catch(e){ TPO = null; }

  var BUF = 120;                   /* anel de eventos (≈4 min com BEATs de 2s) */
  var prev = null;
  try{ prev = JSON.parse(SS ? SS.getItem(K) : 'null') || null; }catch(e){ prev = null; }

  /* feature detection: document.wasDiscarded (Safari: na maioria não existe) */
  var SWD = 'unsupported';
  try{ if('wasDiscarded' in DOC) SWD = DOC.wasDiscarded ? 'true' : 'false'; }catch(e){ SWD = 'unsupported'; }

  /* a sessão rodou com instrumentação? (separar produção normal de ?trace=1) */
  var TRACE_ON = /[?&]trace=1(?:\b|$)|[?&]perf=[abcd](?:\b|$)/.test(global.location.search);

  var n = 1;
  if(prev && typeof prev.n === 'number') n = prev.n + 1;

  var state = {
    n: n,                      /* contador de cargas */
    id: bootId,                /* bootId deste documento */
    h: 0,                      /* último heartbeat (ms) */
    e: 'boot',                 /* último evento conhecido */
    t: TS,                     /* quando esse evento ocorreu */
    c: 0,                      /* 1 = saída limpa | 0 = sem aviso */
    v: global.innerWidth,
    vv: global.innerHeight,
    vw: null,                  /* view ativa (ex.: HOME) */
    vis: DOC.hidden ? 'H' : 'V',
    vs: (DOC.visibilityState || '?'),   /* visibilityState (visible/hidden/etc.) */
    swd: SWD,                  /* document.wasDiscarded */
    tr: TRACE_ON ? 1 : 0,      /* 1 = sessão rodou com ?trace=1 */
    fsp: null,                 /* persisted do 1º pageshow deste documento */
    nav: navType,
    refer: REFERRER.slice(0, 300),
    href: HREF.slice(0, 400),
    last: []                   /* anel "evento@ts[:extra]" */
  };

  /* ————— VIEW ATUAL (1 query do DOM) ————— */
  function readView(){
    try{
      var el = DOC.querySelector('.views .view.active[data-view]');
      return el ? (el.getAttribute('data-view') || '?').toUpperCase() : null;
    }catch(e){ return null; }
  }
  state.vw = readView();

  /* ————— espelho mínimo em localStorage (não morre com o processo) ————— */
  function mirror(){
    try{
      if(LS) LS.setItem(LK, JSON.stringify({
        n: state.n, id: state.id, h: state.h, e: state.e, t: state.t,
        c: state.c, v: state.v, vv: state.vv, vw: state.vw,
        nav: state.nav, refer: state.refer, vis: state.vis, tab: tab
      }));
    }catch(e){}
  }
  function save(){
    try{ if(SS) SS.setItem(K, JSON.stringify(state)); }catch(e){}
    mirror();
  }
  function mark(ev, extra){
    var now = Date.now();
    state.t = now;
    state.e = ev;
    if(!state.last) state.last = [];
    state.last.push(ev + '@' + now + (extra ? ':' + extra : ''));
    if(state.last.length > BUF) state.last.shift();
    save();
  }

  /* ————— formatador compartilhado (banner/report) ————— */
  function fmt(ms){
    if(typeof ms !== 'number' || !isFinite(ms) || ms < 0) return '—';
    return (ms / 1000).toFixed(1).replace('.', ',') + 's';
  }

  /* ————— formatadores de timeline forense ————— */
  function p2x(x){ return (x < 10 ? '0' : '') + x; }
  function fmtClock(ms){
    var d = new Date(ms);
    return p2x(d.getHours()) + ':' + p2x(d.getMinutes()) + ':' + p2x(d.getSeconds()) +
      '.' + (d.getMilliseconds() < 100 ? '0' : '') + (d.getMilliseconds() < 10 ? '0' : '') + d.getMilliseconds();
  }
  function tlLine(x){   /* "ev@ts[:extra]" → "14:06:12.340 · ev · extra" */
    if(typeof x !== 'string') return String(x);
    var i = x.indexOf('@');
    if(i <= 0) return x;
    var ev = x.slice(0, i);
    var rest = x.slice(i + 1);
    var c = rest.indexOf(':');
    var ts = c > 0 ? rest.slice(0, c) : rest;
    var ex = c > 0 ? rest.slice(c + 1) : '';
    var t = /^\d+$/.test(ts) ? fmtClock(Number(ts)) : ts;
    return t + (ex ? ' · ' : '') + ev + (ex ? ' · ' + ex : '');
  }
  function firstPageshow(list){
    if(!list) return null;
    for(var i = 0; i < list.length; i++){
      if(list[i].indexOf('pageshow@') === 0){
        return list[i].indexOf(':P') >= 0 ? 'P' : 'R';
      }
    }
    return null;
  }

  /* ————— contadores de INIT por documento —————
     Se um módulo chama init() 2× com o MESMO bootId → CASE D. */
  var initCounts = {};
  function markInit(name, method){
    var key = name + '.' + (method || 'init');
    initCounts[key] = (initCounts[key] || 0) + 1;
    var k = initCounts[key];
    mark('INIT', key + '#' + k + (k > 1 ? ' ← 2ª INICIALIZAÇÃO NO MESMO DOC' : ''));
  }
  function hookInit(name, methods){
    var existing = global[name];       /* valor real ANTES do accessor */
    var live = existing;               /* leituras devolvem o objeto de verdade */
    var defined = !!existing;
    try{
      Object.defineProperty(global, name, {
        configurable: true,
        get: function(){ return live; },
        set: function(v){
          live = v;
          if(!v) return;
          if(defined) mark('WARN', name + ' reatribuído neste documento');
          defined = true;
          wrap(v);
        }
      });
      if(existing) wrap(existing);     /* módulo já presente (motion.js) */
    }catch(e){}
    function wrap(v){
      (methods || []).forEach(function(m){
        if(typeof v[m] !== 'function') return;
        var orig = v[m];
        v[m] = function(){
          markInit(name, m);
          return orig.apply(this, arguments);
        };
      });
    }
  }
  hookInit('HubMotion',     ['init']);
  hookInit('HubInteractions',['init']);
  hookInit('ViewManager',   ['init', 'open']);
  hookInit('HubDust',       ['init']);
  hookInit('HubReveal',     ['init']);
  hookInit('HubBreathe',    ['init']);
  hookInit('HubLightbox',   ['init']);

  /* ————— eventos de vida/morte do documento ————— */
  global.addEventListener('beforeunload', function(){
    state.c = 1;               /* saída normal: reload/navegação */
    mark('beforeunload');
  });

  global.addEventListener('pagehide', function(ev){
    mark('pagehide', ev.persisted ? 'P' : 'R');
  }, true);

  global.addEventListener('pageshow', function(ev){
    if(state.fsp === null) state.fsp = ev.persisted ? 'P' : 'R';
    mark('pageshow', ev.persisted ? 'P' : 'R');
  }, true);

  global.addEventListener('visibilitychange', function(){
    state.vis = DOC.hidden ? 'H' : 'V';
    state.vs = (DOC.visibilityState || '?');
    mark('vis' + ':' + state.vis, state.vs);
  }, true);

  /* ciclo de vida puro — feature detection: se o Safari não dispara,
     simplesmente nunca chega a marcar */
  try{ global.addEventListener('freeze', function(){ mark('freeze'); }); }catch(e){}
  try{ global.addEventListener('resume', function(){ mark('resume'); }); }catch(e){}
  try{ global.addEventListener('unload',  function(){ mark('unload');  }); }catch(e){}

  /* resize / visualViewport — dedupe 300ms; nomes EXPLÍCITOS no anel
     (antes: mark(ev,...) gravava "[object Event]" — bug desta sprint). */
  var VVD = 0;
  function onResize(kind){
    var now = Date.now();
    if(now - VVD < 300) return;
    VVD = now;
    mark(kind, global.innerWidth + 'x' + global.innerHeight +
      ' · vis=' + DOC.visibilityState +
      ' · vv=' + (global.visualViewport
        ? Math.round(global.visualViewport.width) + 'x' + Math.round(global.visualViewport.height)
        : 'n/a'));
  }
  global.addEventListener('resize', function(){ onResize('resize'); }, true);
  if(global.visualViewport){
    global.visualViewport.addEventListener('resize', function(){ onResize('vvresize'); }, true);
    global.visualViewport.addEventListener('scroll', function(){ onResize('vvscroll'); }, true);
  }

  /* ————— view tracking (SEMPRE LIGADO, leve) —————
     lastClick só alimenta o "reason" no trail log. */
  var lastClick = null;
  DOC.addEventListener('click', function(e){
    var t = e.target;
    var nb = t.closest ? t.closest('.app-nav [data-view]') : null;
    var lk = t.closest ? t.closest('[data-view-link]') : null;
    if(nb || lk){
      lastClick = {
        ts:   Date.now(),
        kind: nb ? 'click:' + nb.getAttribute('data-view')
                 : 'click-link:' + lk.getAttribute('data-view-link')
      };
      mark('CLICK', lastClick.kind);
    }
  }, true);

  var viewsRoot = DOC.querySelector('.views');
  if(viewsRoot && global.MutationObserver){
    try{
      var fromView = readView();
      mark('VIEW_INIT', (fromView || '?') + ' · boot=' + n + '·' + bootId);
      var viewDoneTimer = null;
      new global.MutationObserver(function(){
        var toView = readView();
        if(!toView) return;
        if(toView !== fromView){
          var reason = lastClick && (Date.now() - lastClick.ts) < 1500
            ? lastClick.kind : 'unknown';
          mark('VIEW_CHANGE', 'from:' + (fromView || '?') + ' → to:' + toView + ' · reason=' + reason);
          fromView = toView;
          if(viewDoneTimer) clearTimeout(viewDoneTimer);
          viewDoneTimer = global.setTimeout(function(){
            viewDoneTimer = null;
            mark('VIEW_COMPLETE', 'view=' + toView);
          }, 400);
        }
      }).observe(viewsRoot, {subtree:true, attributeFilter:['class']});
    }catch(e){}
  }

  /* ————— heartbeat (2s) — BEATs agora vão para o ANEL, dando a
     timeline completa até o desaparecimento do documento ————— */
  global.setInterval(function(){
    var vw = readView();
    if(vw && vw !== state.vw){ state.vw = vw; }
    mark('BEAT', vw || '');
  }, 2000);

  /* ————— BOOT: reconstrução da timeline com a sessão anterior ————— */
  var reloaded  = !!(prev && typeof prev.n === 'number' && prev.n >= 1);
  var quietKill = reloaded && !(prev.c === 1);

  var arch = [];
  try{ arch = JSON.parse(LS ? LS.getItem(AK) : 'null') || []; }catch(e){ arch = []; }
  var lastArch = arch.length ? arch[arch.length-1] : null;
  var prevTab = lastArch ? lastArch.tab : null;

  /* mesma aba, arquivo existe, session vazia → processo reiniciado
     de verdade. OBS.: "storage apagado: não" NÃO prova vida do
     processo — só indica que o sessionStorage sobreviveu ao
     reinício (comportamento de aba restaurada do Safari). */
  var storageWiped = !prev && !!lastArch && lastArch.tab === tab;

  var prevReport = null;
  if(prev){
    prevReport = {
      n:      prev.n,
      id:     prev.id || '?',
      nav:    prev.nav || '?',
      e:      prev.e || '?',
      t:      prev.t || 0,
      h:      typeof prev.h === 'number' ? prev.h : 0,
      c:      (typeof prev.c === 'number' ? prev.c : -1),
      vw:     prev.vw || null,
      vis:    prev.vis || '?',
      vs:     prev.vs || null,
      fsp:    prev.fsp || null,
      swd:    prev.swd || 'unsupported',
      refer:  prev.refer || '',
      last:   prev.last || []
    };
  }
  var gapMS = (prevReport && prevReport.h) ? TS - prevReport.h : null;
  var gapES = (prevReport && prevReport.t) ? TS - (prevReport.t || 0) : null;

  /* ————— registro do boot (persistido no anel e no arquivo) ————— */
  mark('BOOT_START', '#' + n + '@' + bootId + (prevReport ? ' · prev#' + prevReport.n + '/' + prevReport.id : ' · primeiro documento'));
  mark('WAS_DISCARDED', SWD);
  mark('TRACE', TRACE_ON ? '1' : '0');

  var navField = '';
  if(NAV){
    navField = 'type=' + (NAV.type || '?') +
      ' red=' + (NAV.redirectCount   !== null ? NAV.redirectCount   : 'n/a') +
      ' act=' + (NAV.activationStart !== null ? NAV.activationStart.toFixed(1) : 'n/a') +
      ' dcl=' + (NAV.dcl !== null ? NAV.dcl.toFixed(1) : 'n/a') +
      ' load=' + (NAV.load !== null ? NAV.load.toFixed(1) : 'n/a') +
      ' xfr=' + (NAV.transfer !== null ? NAV.transfer : 'n/a') +
      ' enc=' + (NAV.encoded !== null ? NAV.encoded : 'n/a') +
      ' dec=' + (NAV.decoded !== null ? NAV.decoded : 'n/a');
  }
  mark('NAV', navField + ' · referrer="' + (REFERRER ? REFERRER.slice(0, 120) : '') + '"');
  mark('URL', ULA.path + (ULA.qlen ? '?' + ULA.qlen + 'ch' : '') + (ULA.hash || '')
    + ' · boot_t0=' + TS + (TPO !== null ? ' · perfOrigin=' + Math.round(TPO) : ''));

  arch.push({
    id: bootId, t: TS, n: n,
    q: quietKill ? 1 : 0, sw: storageWiped ? 1 : 0,
    nt: navType, tab: tab, prevTab: prevTab,
    pv: prevReport ? prevReport.vw : null,
    pe: prevReport ? prevReport.e + '@' + prevReport.t : null,
    gap: gapMS, pid: prevReport ? prevReport.id : null
  });
  if(arch.length > 48) arch.splice(0, arch.length - 48);
  try{ if(LS) LS.setItem(AK, JSON.stringify(arch)); }catch(e){}

  /* ————— log de console (resumo legível) ————— */
  try{
    console[quietKill || storageWiped ? 'warn' : 'log'](
      '[CRASH-DIAG] boot #' + n + ' id=' + bootId +
      (prevTab === tab ? ' [mesma aba]' : ' [nova aba]') +
      (reloaded
        ? (quietKill ? ' — RELOAD SUSPEITO (sem beforeunload)' : ' — reload com saída limpa')
        : ' — primeiro documento') +
      ' · nav=' + navType +
      (gapMS !== null ? ' · morte há ' + fmt(gapMS) : '') +
      (prevReport ? ' · anterior=' + prevReport.e + ' · vis=' + prevReport.vis : '')
    );
  }catch(e){}

  /* ————— BANNER: estado compacto primeiro; expande por toque ————— */
  var suspeito = quietKill || storageWiped;
  if((reloaded || storageWiped) && DOC.body){
    var layout = DOC.createElement('div');
    layout.style.cssText =
      'position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;' +
      'background:rgba(15,30,53,.97);color:#dbe6f5;' +
      'font:500 12px/1.5 system-ui,-apple-system,sans-serif;' +
      'padding:10px 13px;border-radius:8px;border-left:3px solid ' +
      (suspeito ? '#e3a13b' : '#9db7d9') + ';' +
      'box-shadow:0 10px 30px rgba(0,0,0,.45);cursor:pointer;max-width:560px';

    var tl = DOC.createElement('div');
    tl.style.cssText = 'font-size:13.5px;font-weight:700;color:#f5d78e;letter-spacing:.01em';
    tl.textContent = suspeito ? '⚠ RELOAD SEM AVISO' : 'RELOAD DETECTADO';

    var o1 = DOC.createElement('div');
    o1.style.cssText = 'margin-top:4px;color:#e6eefb;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    o1.textContent = (prevReport && prevReport.vw ? prevReport.vw : '—') +
      ' · Boot #' + (prevReport ? prevReport.n : '—') + ' → #' + n +
      ' · ' + fmt(gapMS);

    var hint = DOC.createElement('div');
    hint.style.cssText = 'margin-top:6px;font-size:10.5px;color:#8fa2bd;text-align:center';
    hint.textContent = 'Toque para expandir';

    var det = DOC.createElement('div');
    det.style.cssText = 'display:none;margin-top:8px;padding-top:8px;border-top:1px solid rgba(245,215,142,.16);' +
      'font:500 11px/1.7 ui-monospace,SFMono-Regular,monospace;color:#c9d6ea;' +
      'white-space:pre-wrap;word-break:break-word';

    layout.appendChild(tl);
    layout.appendChild(o1);
    layout.appendChild(hint);
    layout.appendChild(det);

    layout.addEventListener('click', function(){
      if(det.style.display === 'block'){
        det.style.display = 'none';
        hint.textContent = 'Toque para expandir';
        return;
      }
      var L = [];
      L.push('Navigation: ' + navType + ' · xfr=' + (NAV ? NAV.transfer : 'n/a') + ' · dec=' + (NAV ? NAV.decoded : 'n/a'));
      L.push('Referrer: ' + (REFERRER || '(vazio)'));
      L.push('URL: ' + HREF);
      L.push('Storage: ' + (storageWiped ? 'apagado' : 'ok') + ' · Clean exit: ' + (prevReport && prevReport.c === 1 ? 'sim' : 'não'));
      L.push('wasDiscarded este doc: ' + SWD + ' · trace: ' + (TRACE_ON ? '1 (instrumentação ativa)' : '0 (produção normal)'));
      L.push('Gaps desde doc anterior: heartbeat ' + (gapMS !== null ? fmt(gapMS) : '—') +
        ' · último evento ' + (gapES !== null ? fmt(gapES) : '—'));
      L.push('Último estado anterior: ev=' + (prevReport ? prevReport.e : '—') +
        ' · vis=' + (prevReport ? prevReport.vis + (prevReport.vs ? '/' + prevReport.vs : '') : '—') +
        ' · view=' + (prevReport ? (prevReport.vw || '?') : '—'));
      if(prevReport){
        L.push('Previous boot: #' + prevReport.n + '  id=' + prevReport.id +
          ' · nav=' + prevReport.nav + ' · view=' + (prevReport.vw || '?') +
          ' · vis=' + prevReport.vis + (prevReport.vs ? '/' + prevReport.vs : '') +
          ' · discarded=' + (prevReport.swd || 'unsupported') +
          ' · 1º pageshow=' + (prevReport.fsp || '?') +
          (prevReport.refer ? ' · referrer="' + prevReport.refer.slice(0, 60) + '"' : ''));
        var pe = prevReport.last || [];
        L.push('Timeline (boot anterior, últimos ' + Math.min(16, pe.length) + '):');
        pe.slice(-16).forEach(function(x){ L.push('  ' + tlLine(x)); });
        L.push('——— ' + (prevReport.c === 1
          ? 'SAÍDA LIMPA (beforeunload + pagehide)'
          : 'SEM EVENTO DE SAÍDA — documento substituído sem aviso') +
          ' · último: ' + (pe.length ? tlLine(pe[pe.length - 1]) : '—') +
          ' · depois: ' + fmtClock(TS) + ' (boot #' + n + ') ———');
      }
      var cs = state.last || [];
      L.push('Este documento: #' + n + ' · id=' + bootId + ' · iniciou ' + fmtClock(TS) +
        ' · 1º pageshow=' + (state.fsp || '—'));
      cs.slice(-6).forEach(function(x){ L.push('  ' + tlLine(x)); });
      var ck = [];
      for(var k in initCounts) ck.push(k + '#' + initCounts[k]);
      if(ck.length) L.push('Entradas de init neste doc: ' + ck.join(' · '));
      det.textContent = L.join('\n');
      det.style.display = 'block';
      hint.textContent = 'Toque para ocultar';
    }, false);

    DOC.body.appendChild(layout);
  }

  /* ————— API de console ————— */
  global.__CRASH = {
    reloaded: reloaded,
    quietKill: quietKill,
    storageWiped: storageWiped,
    tab: tab,
    bootId: bootId,
    navType: navType,
    nav: NAV,
    report: function(){
      console.log('[__CRASH] boot #' + state.n + ' id=' + bootId +
        ' · nav=' + navType + ' · referrer=' + (REFERRER || '(vazio)') +
        ' · trace=' + (TRACE_ON ? 1 : 0) + ' · wasDiscarded=' + SWD);
      if(prevReport){
        console.log('[__CRASH] boot anterior: #' + prevReport.n + ' id=' + prevReport.id +
          ' · último evento=' + prevReport.e + ' · último heartbeat há ' + fmt(gapMS) +
          ' · último evento há ' + fmt(gapES) +
          ' · vis=' + prevReport.vis + (prevReport.vs ? '/' + prevReport.vs : '') +
          ' · view=' + (prevReport.vw || '?') +
          ' · 1º pageshow=' + (prevReport.fsp || '?') +
          ' · discarded=' + (prevReport.swd || 'unsupported') +
          ' · saída limpa=' + (prevReport.c === 1 ? 'sim' : 'não'));
      }
      console.log('[__CRASH] 1º pageshow DESTE doc: ' + (state.fsp || '— (ainda não disparou)'));
      console.log('[__CRASH] initCounts (este doc):', initCounts);
      console.log('[__CRASH] NAV entry:', NAV);
      console.log('[__CRASH] timeline (últimos 20):');
      (state.last || []).slice(-20).forEach(function(x){ console.log('  ' + tlLine(x)); });
      console.log('[__CRASH] arquivo de boots:');
      console.table(arch.slice(-10));
    },
    state: function(){ return JSON.parse(JSON.stringify(state)); },
    archive: function(){ return JSON.parse(JSON.stringify(arch)); },
    live: function(){
      try{ return JSON.parse(LS ? LS.getItem(LK) : 'null'); }catch(e){ return null; }
    },
    counts: function(){ return JSON.parse(JSON.stringify(initCounts)); }
  };

  save();
})(window);