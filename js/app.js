/* ==========================================================
   HUB WEBSITE
   APPLICATION
   Arquitetura Oficial · app.js
   ==========================================================

   Tudo que não é o motor de movimento (motion.js):

   · 01 · Partículas  — a poeira da sala (HubDust)
   · 02 · Eventos     — pointer, resize, visibilidade (HubInteractions)
   · 03 · Orquestração — bootstrap, gate de reduced motion e o
                          requestAnimationFrame único do site

   Carregar SEMPRE depois de js/motion.js.
   ========================================================== */

/* ==========================================================
   01 · PARTÍCULAS
   ========================================================== */
/* ——————————————————————————————————————————————
   Particles — poeira de verdade suspendida numa sala
   iluminada, não um efeito. Pouca, pequena, suave.

   · cada grão tem profundidade (z), velocidade própria e vida;
   · alguns somem (ciclo), outros surgem — reposição;
   · só brilham quando atravessam a luz da sala (env.lx);
   · nunca parecem estrelas (sem cintilação rápida) nem neve
     (sem queda uniforme).

   Expõe HubDust: init(canvas), resize(), render(env).
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  var c, ctx;
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var w=0, h=0, p=[];
  /* a poeira pertence à mesma corrente de ar da sala — usa a massa
     única de acoplamento definida no RoomPhysics (fonte única) */
  var roomPhysics = window.RoomPhysics;

  /* sprite radial: centro denso, borda que desfaz — pó, não ponto */
  var sprInk=null, sprGold=null;
  function spriteDust(rgb){
    var cv=document.createElement('canvas');
    cv.width=cv.height=20;
    var g=cv.getContext('2d');
    var rad=g.createRadialGradient(10,10,0,10,10,10);
    rad.addColorStop(0,   rgb+'.80');
    rad.addColorStop(.45, rgb+'.16');
    rad.addColorStop(1,   rgb+'.0');
    g.fillStyle=rad; g.fillRect(0,0,20,20);
    return cv;
  }

  function init(canvas){
    c = canvas;
    ctx = c.getContext('2d');
    sprInk = spriteDust('rgba(29,53,87,');
    sprGold = spriteDust('rgba(176,141,62,');
    resize();
  }

  function resize(){
    if(!c) return;
    w = c.clientWidth; h = c.clientHeight;
    c.width = w*dpr; c.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    /* pouca poeira: densidade baixa */
    var n = Math.max(10, Math.round((w*h)/62000));
    p = [];
    for(var i=0;i<n;i++) p.push(makeP());
  }

  function makeP(){
    var q = {
      x:Math.random()*w, y:Math.random()*h,
      z:Math.random(),                 /* profundidade: tamanho, lentidão, foco */
      r:0.45 + Math.random()*1.0,
      a:0.05 + Math.random()*0.09,
      sw:Math.random()*6.283,
      ph:Math.random()*6.283,
      /* velocidades diferentes — deriva, não queda uniforme */
      vx:(Math.random()-0.5)*0.013*(0.6+Math.random()*0.8),
      vy:-((Math.random()*0.0030 + 0.0012)*(0.35+Math.random())),
      g: Math.random() < 0.06,         /* raras que pegam o dourado */
      life: 0, lm: 0
    };
    reseed(q, false);
    return q;
  }

  /* reaparece de outra forma: nova posição, nova profundidade,
     nova velocidade, novo prazo de vida — algumas somem, outras surgem */
  function reseed(q, anywhere){
    q.x = Math.random()*w;
    q.y = anywhere ? Math.random()*h : Math.random()*h;
    q.z = Math.random();
    q.r = 0.45 + Math.random()*1.0;
    q.a = 0.05 + Math.random()*0.09;
    q.vx = (Math.random()-0.5)*0.013*(0.6+Math.random());
    q.vy = -((Math.random()*0.0030 + 0.0012)*(0.5+Math.random()));
    q.lm = 24 + Math.floor(Math.random()*48);        /* 24..72s */
    q.life = q.lm;
  }

  function render(env){
    if(!ctx || !w || !h) return;
    ctx.clearRect(0,0,w,h);
    var lux = (env && env.lx !== undefined) ? env.lx : 0.5;
    var tide = (env && env.tide !== undefined) ? env.tide : 0.5;

    for(var i=0;i<p.length;i++){
      var q = p[i];

      /* ciclo de vida: o suficiente para umas desaparecerem no ar */
      q.life -= 1;
      if(q.life <= 0){
        reseed(q, true);
        continue;
      }
      var fade = 1;
      var fi = q.lm - q.life;            /* temperatura: surgindo */
      if(fi < 60)  fade = Math.min(1, fi/60);
      if(q.life < 90) fade = Math.min(fade, q.life/90);   /* e desaparecendo */

      q.sw += 0.0012; q.ph += 0.0014;
      /* suspensa: deriva horizontal leve + afunda de leve, pois
         a sala inteira repousa — e a luz a atravessa. A energia
         da sala (env.rmx) empurra a poeira junto com o resto do
         ambiente, com o mesmo ar, sem protagonismo */
      q.x += q.vx + env.airX*0.018*(0.35+q.z) + Math.sin(q.sw)*0.05*q.z
           + (env.rmx||0)*roomPhysics.dustMass*(0.35+q.z);
      q.y += q.vy + (env.airY||0)*0.008*(0.35+q.z)
           + (env.rmy||0)*roomPhysics.dustMass*0.55*(0.35+q.z);

      if(q.y < -10){ q.y = h+8; q.x = Math.random()*w; }
      if(q.x < -8) q.x = w+8; else if(q.x > w+8) q.x = -8;

      /* só cruza a luz da sala: clareia na faixa de iluminação */
      var inLight = 1 - Math.min(1, Math.abs(q.x/w - lux) / 0.42);
      var a = q.a * (0.28 + 0.66*inLight) * (0.72 + 0.28*Math.sin(q.ph));
      a *= fade;
      /* a poeira vibra um pouco com a maré da sala */
      a *= 0.92 + 0.08*Math.sin(tide*6.283);
      if(a <= 0.004) continue;

      var spr = q.g ? sprGold : sprInk;
      var s = q.r*1.9*(1.3 - q.z*0.35);
      ctx.globalAlpha = Math.min(1, a*1.7);
      ctx.drawImage(spr, q.x-s, q.y-s, s*2, s*2);
      ctx.globalAlpha = 1;
    }
  }

  global.HubDust = {
    init: init,
    resize: resize,
    render: render
  };
})(window);

/* ==========================================================
   02 · EVENTOS
   ========================================================== */
/* ——————————————————————————————————————————————
   Interações — cursor, resize e visibilidade.
   Apenas costura os eventos nos sistemas certos:
   aponta para o Motion Engine (motion.js) e
   redimensiona as Partículas. Expõe HubInteractions.
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  function init(core){
    window.addEventListener('resize', function(){
      if(core.dust) core.dust.resize();
    }, {passive:true});

    window.addEventListener('pointermove', function(e){
      if(core.motion) core.motion.setPointer(e.clientX, e.clientY);
    }, {passive:true});

    window.addEventListener('pointerleave', function(){
      if(core.motion) core.motion.releasePointer();
    }, {passive:true});

    document.addEventListener('visibilitychange', function(){
      if(core.setRunning) core.setRunning(!document.hidden);
    }, {passive:true});
  }

  global.HubInteractions = { init: init };
})(window);

/* ==========================================================
   04 · REVELAÇÃO NO SCROLL
   ========================================================== */
/* ——————————————————————————————————————————————
   Revelação — switch de visibilidade para as seções
   abaixo da dobra (.rev → .in). Não toca no motor
   (motion.js): só assina um IntersectionObserver e
   adiciona a classe. Respeita prefers-reduced-motion
   (o media query do CSS já força .rev visível).
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  var io = null;

  function init(){
    var els = Array.prototype.slice.call(document.querySelectorAll('.rev'));
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    /* dispara quando ~20–25% do elemento já está na viewport —
       rootMargin negativo na base empurra o ponto de gatilho para
       dentro da tela em vez de na borda exata. Uma vez revelado,
       para de observar: a seção nunca "pisca" de novo ao rolar
       para cima e para baixo outra vez. */
    /* progressive enhancement: se a criação do observer falhar por
       qualquer motivo, revela tudo de uma vez — nenhum .rev deve
       jamais ficar preso em opacity:0 por culpa do mecanismo */
    try{
      io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, {threshold:.22, rootMargin:'0px 0px -20% 0px'});
      els.forEach(function(el){ io.observe(el); });

      /* telas baixas (landscape mobile e janelas curtas): a zona morta
         do rootMargin pode prender o CTA final da Demonstração em
         opacity:0 quando o fim do scroll é alcançado. Ao atingir o fim
         da view, qualquer .rev ainda pendente entra de uma vez — o
         conteúdo final da vitrine nunca fica invisível. A rota só
         dispara dentro de (max-height:680px); no desktop de altura
         normal o IntersectionObserver continua sendo o único dono. */
      if(global.matchMedia && global.matchMedia('(max-height:680px)').matches){
        var demo = document.querySelector('.view.view--demo');
        if(demo){
          var forceAtEnd = function(){
            if(demo.scrollTop + demo.clientHeight >= demo.scrollHeight - 2){
              els.forEach(function(el){
                if(!el.classList.contains('in')) el.classList.add('in');
              });
              demo.removeEventListener('scroll', forceAtEnd);
            }
          };
          demo.addEventListener('scroll', forceAtEnd, {passive:true});
          forceAtEnd();
        }
      }
    }catch(e){
      els.forEach(function(el){ el.classList.add('in'); });
    }
  }

global.HubReveal = { init: init };
})(window);

/* ==========================================================
   04B · CTA · RESPIRAÇÃO (breathing, só enquanto visível)
   ========================================================== */
/* ——————————————————————————————————————————————
   Um único IntersectionObserver, reaproveitável, alterna
   .breathe-active em qualquer .cta enquanto ele estiver na tela.
   Ao contrário do HubReveal, este NÃO desconecta a observação:
   o efeito precisa ligar e desligar toda vez que o botão entra
   e sai da viewport (ex.: ao trocar de view). O CSS cuida de
   pausar a respiração e devolver o controle do transform ao
   hover (ver .cta.breathe-active:hover em style.css).
   Expõe HubBreathe.
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  function init(){
    var els = Array.prototype.slice.call(document.querySelectorAll('.cta'));
    if(!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        entry.target.classList.toggle('breathe-active', entry.isIntersecting);
      });
    }, {threshold:.6});
    els.forEach(function(el){ io.observe(el); });
  }

  global.HubBreathe = { init: init };
})(window);

/* ==========================================================
   05 · VIEW MANAGER
   ========================================================== */
/* ——————————————————————————————————————————————
   Views — navegação institucional sem hash routing.
   Não toca Motion, Dust nem Atmosfera: apenas controla qual
   section.view está ativa dentro do workspace.
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  var State = {
    IDLE: 'IDLE',
    LEAVING: 'LEAVING',
    ENTERING: 'ENTERING'
  };

  var AppState = {
    currentView: null,
    previousView: null,
    history: [],
    isTransitioning: false,
    state: State.IDLE
  };

  var controls = [];
  var viewMap = {};
  var indicator = null;
  var navEl = null;
  var navTrack = null;

  function getView(name){
    return viewMap[name] || null;
  }

  /* ——— indicador de menu: uma única linha que desliza até o item
     ativo, em vez de trocar instantaneamente. Só transform
     (translateX + scaleX), nunca left/width, para não custar
     reflow: a linha nasce com 1px de largura estática e o CSS
     multiplica essa base pela largura real do botão via scaleX. */
  function moveIndicator(control, animate){
    if(!indicator || !navEl || !control) return;
    var navBox = navEl.getBoundingClientRect();
    var ctrlBox = control.getBoundingClientRect();
    var x = ctrlBox.left - navBox.left;
    var w = ctrlBox.width;
    if(!animate) indicator.style.transitionDuration = '0s';
    indicator.style.setProperty('--nav-x', x.toFixed(1)+'px');
    indicator.style.setProperty('--nav-w', w.toFixed(1));
    indicator.classList.add('is-ready');
    if(!animate){
      /* força o navegador a aplicar a posição sem transição antes
         de devolver o controle da duração ao CSS */
      indicator.offsetHeight;
      indicator.style.transitionDuration = '';
    }
  }

  function updateNav(name){
    var activeControl = null;
    controls.forEach(function(control){
      var isActive = control.getAttribute('data-view') === name;
      control.classList.toggle('active', isActive);
      control.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if(isActive) activeControl = control;
    });
    if(activeControl){
      moveIndicator(activeControl, true);
      /* nav mobile pode rolar na horizontal (ver style.css, ≤960px);
         no desktop a nav nunca transborda, então isto não move nada.
         block:'nearest' impede qualquer rolagem vertical da página. */
      if(activeControl.scrollIntoView){
        activeControl.scrollIntoView({behavior:'smooth', block:'nearest', inline:'nearest'});
      }
    }
  }

  function deactivate(name){
    var view = getView(name);
    if(!view) return;
    view.classList.remove('active');
    view.setAttribute('aria-hidden', 'true');
  }

  function activate(name){
    var view = getView(name);
    if(!view) return null;
    view.classList.add('active');
    view.setAttribute('aria-hidden', 'false');
    view.scrollTop = 0;
    /* no mobile a rolagem passou a ser da página (ver style.css,
       seção 19) — sem isto, trocar de view manteria a posição de
       rolagem anterior. No desktop o body nunca rola, então isto
       não faz nada (no-op seguro). */
    if(global.scrollTo) global.scrollTo(0, 0);
    return view;
  }

  function close(name){
    deactivate(name);
  }

  function finish(nextName){
    AppState.currentView = nextName;
    AppState.isTransitioning = false;
    AppState.state = State.IDLE;
  }

  function open(name){
    var next = getView(name);
    if(!next || AppState.isTransitioning || AppState.currentView === name) return;

    AppState.isTransitioning = true;
    AppState.state = State.LEAVING;
    AppState.previousView = AppState.currentView;
    if(AppState.previousView) AppState.history.push(AppState.previousView);

    var done = false;
    function complete(){
      if(done) return;
      done = true;
      next.removeEventListener('transitionend', onEnd);
      finish(name);
    }
    function onEnd(e){
      if(e.target !== next || e.propertyName !== 'opacity') return;
      complete();
    }

    next.addEventListener('transitionend', onEnd);
    close(AppState.previousView);
    AppState.state = State.ENTERING;
    activate(name);
    updateNav(name);

    if(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches){
      complete();
    } else {
      /* rede de segurança: no mobile a troca de view usa display:none
         (ver style.css), então a opacidade nunca anima e este evento
         nunca dispara — sem isto, isTransitioning ficaria travado para
         sempre depois da primeira troca, e nenhum clique de navegação
         funcionaria de novo. Idempotente (o `done` acima protege contra
         chamada dupla), então no desktop — onde o transitionend real
         continua disparando primeiro — isto nunca tem efeito visível. */
      global.setTimeout(complete, 260);
    }
  }

  function init(){
    navEl = document.querySelector('.app-nav');
    navTrack = navEl ? navEl.querySelector('.nav-track') : null;
    indicator = navEl ? navEl.querySelector('.nav-indicator') : null;
    controls = Array.prototype.slice.call(document.querySelectorAll('.app-nav [data-view]'));
    var views = Array.prototype.slice.call(document.querySelectorAll('.views .view[data-view]'));
    viewMap = {};

    views.forEach(function(view){
      var name = view.getAttribute('data-view');
      viewMap[name] = view;
      view.setAttribute('aria-hidden', view.classList.contains('active') ? 'false' : 'true');
    });

    var active = views.filter(function(view){ return view.classList.contains('active'); })[0] || views[0];
    if(active){
      AppState.currentView = active.getAttribute('data-view');
      active.classList.add('active');
      active.setAttribute('aria-hidden', 'false');
      updateNav(AppState.currentView);
      /* a primeira posição não desliza de lugar nenhum — nasce
         já no lugar certo, sem chamar atenção antes mesmo do
         usuário interagir */
      var initialControl = controls.filter(function(c){
        return c.getAttribute('data-view') === AppState.currentView;
      })[0];
      if(initialControl) moveIndicator(initialControl, false);
    }

    controls.forEach(function(control){
      control.addEventListener('click', function(){
        open(control.getAttribute('data-view'));
      });
    });

    window.addEventListener('resize', function(){
      var current = controls.filter(function(c){ return c.classList.contains('active'); })[0];
      if(current) moveIndicator(current, false);
    }, {passive:true});

    /* a FAIXA de botões (.nav-track) rola na horizontal em mobile
       (≤960px) — getBoundingClientRect é sempre relativo ao
       viewport, então o traço dourado precisa recalcular a própria
       posição a cada rolagem manual da faixa, ou fica para trás
       enquanto o usuário arrasta os itens. Sem custo no desktop:
       ali a faixa nunca rola. */
    if(navTrack){
      navTrack.addEventListener('scroll', function(){
        var current = controls.filter(function(c){ return c.classList.contains('active'); })[0];
        if(current) moveIndicator(current, false);
      }, {passive:true});
    }

    document.addEventListener('click', function(e){
      var link = e.target.closest('[data-view-link]');
      if(!link) return;
      e.preventDefault();
      open(link.getAttribute('data-view-link'));
    });
  }

  global.ViewManager = {
    init: init,
    open: open,
    close: close,
    activate: activate,
    deactivate: deactivate,
    updateNav: updateNav,
    getView: getView,
    state: AppState
  };
})(window);

/* ==========================================================
   06 · LIGHTBOX
   ========================================================== */
/* ——————————————————————————————————————————————
   Lightbox — abre os prints da Demonstração em destaque.
   Não toca Motion, Dust nem o ViewManager: só escuta cliques nas
   imagens de .showcase-media/.showcase-trio e alterna a classe
   .is-open de uma camada fixa já presente no HTML. Fecha pelo
   botão, clicando fora da imagem (no fundo) ou com Esc.
   Expõe HubLightbox.
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  var box, img, closeBtn, lastFocus = null;

  function open(src, alt){
    if(!box) return;
    img.src = src;
    img.alt = alt || '';
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    lastFocus = document.activeElement;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close(){
    if(!box) return;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
    /* limpa o src só depois da transição, evita "flash" da imagem antiga */
    global.setTimeout(function(){
      if(!box.classList.contains('is-open')) img.src = '';
    }, 300);
  }

  function onKeydown(e){
    if(e.key === 'Escape' || e.key === 'Esc') close();
  }

  function init(){
    box = document.getElementById('lightbox');
    img = document.getElementById('lightbox-img');
    closeBtn = document.getElementById('lightbox-close');
    if(!box || !img || !closeBtn) return;

    var triggers = Array.prototype.slice.call(
      document.querySelectorAll('.showcase-media img, .showcase-trio img')
    );
    triggers.forEach(function(el){
      el.addEventListener('click', function(){
        open(el.currentSrc || el.src, el.alt);
      });
    });

    closeBtn.addEventListener('click', close);
    /* clicar fora da imagem (no fundo escurecido) fecha; clicar na
       própria imagem ou no quadro não deve fechar */
    box.addEventListener('click', function(e){
      if(e.target === box) close();
    });
  }

  global.HubLightbox = { init: init, open: open, close: close };
})(window);

/* ==========================================================
   03 · ORQUESTRAÇÃO
   ========================================================== */
/* ——————————————————————————————————————————————
   Bootstrap — inicialização e orquestração.
   Respeita prefers-reduced-motion, monta os sistemas
   e conduz o único requestAnimationFrame do site.
—————————————————————————————————————————————— */
(function(){
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = window.HubMotion;
  var dust = window.HubDust;

  if(window.ViewManager) window.ViewManager.init();
  if(window.HubLightbox) window.HubLightbox.init();

  /* progressive enhancement: cada sistema inicializa de forma
     independente — se um falhar (erro de runtime, ausência de API),
     os demais seguem vivos. O conteúdo jamais fica refém do motor. */
  function safe(fn){
    try{ fn(); }catch(e){ /* isolado: não derruba a orquestração */ }
  }

  if(reduce){
    motion.setStatic();
    return;
  }

  safe(function(){ motion.init(); });
  safe(function(){ dust.init(document.getElementById('dust')); });
  if(window.HubReveal) safe(window.HubReveal.init.bind(window.HubReveal));
  if(window.HubBreathe) safe(window.HubBreathe.init.bind(window.HubBreathe));

  var running = true;

  /* a troca de visibilidade é o único item no estado que o bootstrap
     governa — partículas e física são chamadas apenas quando vivo */
  window.HubInteractions.init({
    motion: motion,
    dust: dust,
    setRunning: function(r){
      running = r;
      motion.setRunning(r);
    }
  });

  function loop(now){
    if(running){
      dust.render(motion.update(now));
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
