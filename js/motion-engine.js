/* ——————————————————————————————————————————————
   Motion Engine — toda a física ambiental.
   Um único rAF governa: ciclo de luz, respiração,
   correntes de ar e o ponto de vista do observador.
   Expõe HubMotion para o resto da aplicação.
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  var root = document.documentElement;

  /* estado contínuo — tudo interpolado, nada em degraus */
  var px=0, py=0, tpx=0, tpy=0;          /* ponto de vista (damping pesado) */
  var day=0.5, breath=0, floatY=0;        /* luz do dia, respiração, repouso */
  var airX=0, airY=0;                     /* corrente de ar lenta */
  var t0 = performance.now();

  function init(){
    t0 = performance.now();
  }

  /* o observador desloca minimamente o ponto de vista da sala */
  function setPointer(cx, cy){
    var x = (cx / window.innerWidth  - 0.5) * 2;
    var y = (cy / window.innerHeight - 0.5) * 2;
    tpx = Math.max(-1,Math.min(1,x)) * 7;   /* amplitude curta: 7px no plano frontal */
    tpy = Math.max(-1,Math.min(1,y)) * 5;
  }

  function releasePointer(){ tpx = 0; tpy = 0; }

  /* retoma sem salto brusco ao voltar à visibilidade */
  function setRunning(r){ if(r) t0 = performance.now() - 1000; }

  /* avança a física, aplica as variáveis na raiz e devolve o
     ambiente para os consumidores (partículas) */
  function update(now){
    var t = (now - t0) / 1000;

    /* ciclo de luz: ~4 min por travessia, com uma segunda onda mais lenta
       para que nunca se repita de forma perceptível */
    var d = 0.5
          + 0.34*Math.sin(t*0.0262)
          + 0.10*Math.sin(t*0.0091 + 1.7)
          + 0.06*Math.sin(t*0.0043 + 0.4);
    day += (Math.max(0,Math.min(1,d)) - day) * 0.02;

    breath = 0.5 + 0.5*Math.sin(t*0.2244);      /* ~28s, como uma respiração */
    floatY = Math.sin(t*0.2417 + 1.1);          /* repouso do objeto */
    airX   = Math.sin(t*0.0431) + 0.4*Math.sin(t*0.0173 + 2.2);
    airY   = Math.cos(t*0.0327 + 0.8);

    /* inércia: a sala nunca acompanha o cursor, ela cede */
    px += (tpx - px) * 0.022;
    py += (tpy - py) * 0.022;

    root.style.setProperty('--day',    day.toFixed(4));
    root.style.setProperty('--breath', breath.toFixed(4));
    root.style.setProperty('--float',  floatY.toFixed(4));
    root.style.setProperty('--px',    (px + airX*0.9).toFixed(3));
    root.style.setProperty('--py',    (py + airY*0.6).toFixed(3));

    /* placas: cada uma flutua por suas próprias correntes — fases e
       amplitudes distintas, somadas à régua da câmera (paralaxe) */
    var fA = Math.sin(t*0.061+1.1)*1.0, gA = Math.cos(t*0.073+0.4)*0.7;
    var fB = Math.sin(t*0.049+2.3)*1.2, gB = Math.cos(t*0.057+1.8)*0.9;
    var fC = Math.sin(t*0.052+0.6)*1.5, gC = Math.cos(t*0.063+2.4)*1.1;
    root.style.setProperty('--pa', (px + fA + airX*0.5).toFixed(3));
    root.style.setProperty('--qa', (py + gA + airY*0.5).toFixed(3));
    root.style.setProperty('--pb', (px + fB + airX*0.8).toFixed(3));
    root.style.setProperty('--qb', (py + gB + airY*0.7).toFixed(3));
    root.style.setProperty('--pc', (px + fC + airX*1.0).toFixed(3));
    root.style.setProperty('--qc', (py + gC + airY*0.9).toFixed(3));

    return { day: day, airX: airX, airY: airY };
  }

  /* reduced motion: a sala congela numa luz estável */
  function setStatic(){
    root.style.setProperty('--day','0.5');
    root.style.setProperty('--breath','0.5');
  }

  global.HubMotion = {
    init: init,
    setPointer: setPointer,
    releasePointer: releasePointer,
    setRunning: setRunning,
    update: update,
    setStatic: setStatic
  };
})(window);
