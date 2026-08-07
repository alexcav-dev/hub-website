/* ==========================================================
   HUB WEBSITE
   MOTION ENGINE
   Arquitetura Oficial · motion.js
   ==========================================================

   Este arquivo contém EXCLUSIVAMENTE o motor de movimento do site:

   · Ambiente  (maré / dia / corrente de ar)
   · Luz       (sol da sala, --lx / --ly)
   · Profundidade (3 tempos de leitura do mundo)
   · Placas     (personalidades, física, inércia)
   · Monograma  (respiração, âncora da luz)
   · CTA        (luz passando pelo botão, --cta-x)

   NENHUMA lógica de interface vive aqui. Bootstrap, eventos,
   partículas e o requestAnimationFrame ficam em app.js.
   Consome apenas o rAF (ver app.js).
   Expõe HubMotion e MotionCalibration.
   ========================================================== */
(function(global){
  'use strict';

  var root = document.documentElement;

  /* estado contínuo — tudo interpolado, nada em degraus */
  var px=0, py=0, tpx=0, tpy=0;           /* olhar do observador (inércia) */
  var day=0.5, breath=0, floatY=0;         /* ciclo claro, respiro do monograma */
  var tide=0.5, lx=0.5, ly=0.5, anchor=0.32;    /* AMBIENTE, LUZ, luz no monograma — já presentes na chegada */
  var airX=0, airY=0;                      /* corrente lenta da sala */
  var dx=0, dy=0, mx=0, my=0, bx=0, by=0;  /* 3 tempos de leitura (profundidade) */
  var t0 = performance.now();
  var initPh = Math.random()*6.283;

  /* ——— referência de calibração (ajuste ao vivo no console) ———
     roomTide   → batimento do ambiente (opacidade das camadas)
     lightWalk  → percurso da luz da sala
     plateLife  → pulsação física das placas
     anchorGlow → luz encontrando o monograma */
  var MotionCalibration = {
    roomTide:   1.0,
    lightWalk:  1.0,
    plateLife:  1.0,
    anchorGlow: 1.0
  };
  global.MotionCalibration = MotionCalibration;

  /* ruído de valor — corpo irregular: a sala varia, nunca “balança” */
  function vnoise(x){
    x = x + 13.17;
    var n = Math.sin(x*12.9898 + 78.233)*43758.5453;
    return n - Math.floor(n);
  }
  function vn(x){
    var i = Math.floor(x), f = x - i;
    f = f*f*(3 - 2*f);
    return vnoise(i)*(1 - f) + vnoise(i+1)*f;
  }

  /* personalidades: cada placa é uma massa própria repousando.
     u = ritmo próprio (nunca batem ciclo juntas), amp = alcance
     em px, sc = respiração (escala em fração), react = tempo
     de resposta ao ambiente, weight = peso (importância da leitura
     do mundo), rot = rotação em graus. */
  var plates = [
    { name:'back',  ph:0.9,  u:0.11,  ampX:1.8,  ampY:1.4,  sc:0.016,
      react:0.065, weight:0.40, rot:0.09,  x:0.6, y:-0.4, z:0.006, rz:0 },
    { name:'mid',   ph:2.4,  u:0.30,  ampX:3.2,  ampY:2.6,  sc:0.024,
      react:0.090, weight:0.72, rot:0.18,  x:-1.4, y:1.0, z:0.010, rz:0 },
    { name:'front', ph:4.1,  u:0.52,  ampX:4.6,  ampY:3.8,  sc:0.032,
      react:0.120, weight:1.00, rot:0.32,  x:2.2, y:-1.6, z:0.016, rz:0 }
  ];

  /* ——— API do motor ——— */

  function init(){ t0 = performance.now(); }

  /* o observador desloca minimamente o ponto de vista da sala */
  function setPointer(cx, cy){
    var x = (cx / window.innerWidth  - 0.5) * 2;
    var y = (cy / window.innerHeight - 0.5) * 2;
    tpx = Math.max(-1,Math.min(1,x)) * 9;   /* amplitude curta no plano frontal */
    tpy = Math.max(-1,Math.min(1,y)) * 6;
  }

  function releasePointer(){ tpx = 0; tpy = 0; }

  /* retoma sem salto brusco ao voltar à visibilidade */
  function setRunning(r){ if(r) t0 = performance.now() - 1000; }

  function update(now){
    var t = (now - t0) / 1000;
    var cal = MotionCalibration;

    /* 1 — AMBIENTE · a maré. Frequências próximas porém nunca iguais
       (0.52 e 0.115, mais ruído): varia sem repetir, sem fechar ciclo
       inteiro diante dos olhos. */
    var tideRaw = 0.5
      + 0.13*Math.sin(t*0.52 + 1.4)
      + 0.08*Math.sin(t*0.115 + 4.1)
      + 0.04*vn(t*0.075 + 8.3);
    tide += (Math.max(0.24, Math.min(0.76, tideRaw)) - tide) * 0.08;

    /* 2 — LUZ. O sol da sala caminha lentamente, sem voltar à
       mesma posição durante a visita. */
    lx = 0.5 + 0.24*Math.sin(t*0.16 + 0.5)*cal.lightWalk
             + 0.05*Math.sin(t*0.04 + 2.0);
    ly = 0.5 + 0.17*Math.cos(t*0.14 + 1.1)*cal.lightWalk
             + 0.04*Math.cos(t*0.035 + 3.3);
    lx = Math.max(0.05, Math.min(0.95, lx));
    ly = Math.max(0.15, Math.min(0.85, ly));

    /* a luz encontra o monograma: suaviza quando o sol passa
       por onde o símbolo repousa (centro levemente à direita) */
    var nearM = Math.max(0, 1 - Math.abs(lx - 0.58)*1.5) * cal.anchorGlow;
    anchor += Math.max(0, Math.min(1, nearM) - anchor) * 0.14;

    /* corrente de ar — visível sobretudo na poeira suspensa */
    airX = Math.sin(t*0.07 + 0.8)*0.85 + Math.sin(t*0.024 + 2.2)*0.55;
    airY = Math.cos(t*0.055 + 1.9)*0.85 + Math.sin(t*0.03 + 0.4)*0.55;

    /* dia — a densidade do azul muda aos poucos (~4min) */
    var d = 0.5 + 0.28*Math.sin(t*0.0262) + 0.12*Math.sin(t*0.0091 + 1.7);
    day += (Math.max(0.45, Math.min(0.95, d)) - day) * 0.05;

    /* respiração do monograma e o repouso do objeto (âncora) */
    breath = 0.5 + 0.5*Math.sin(t*0.34);
    floatY = Math.sin(t*0.30 + 1.7);

    /* 3 — PROFUNDIDADE por tempo: cada camada lê o mundo em seu
       próprio ritmo. A frente responde primeiro, o fundo por último —
       a distância é a diferença de tempo. */
    dx += (px - dx)*0.14;  dy += (py - dy)*0.14;   /* frontal — lê primeiro */
    mx += (px - mx)*0.085; my += (py - my)*0.085;  /* centro */
    bx += (px - bx)*0.055; by += (py - by)*0.055;  /* fundo — mal percebe */

    /* 4 — PLACAS: objetos repousando sobre a mesa, cada um com seu
       peso. Sua própria corrente (pulso), mais a leitura do mundo
       com peso e tempo próprios. Fases nunca simultâneas, nunca um
       ciclo fechado. */
    for(var i=0;i<plates.length;i++){
      var p = plates[i];
      var ph = t*p.u + p.ph*initPh;

      /* a personalidade: dois acordes lentos em fases próprias
         + um ruído tátil muito baixo */
      var bX = Math.sin(ph)*0.40 + Math.sin(ph*0.332 + 1.7)*0.24
             + (vn(ph*0.07 + p.ph) - 0.5)*0.18;
      var bY = Math.sin(ph*0.54 + 0.9)*0.30 + Math.sin(ph*0.203 + 3.0)*0.22;
      var bZ = Math.sin(ph*0.71 + 1.0)*0.5 + 0.5;   /* 0..1 para escala */

      /* o mundo chega a esta placa: olhar + corrente, amortecido
         pelo seu peso (weight) e levado pelo seu tempo */
      var wX = (dx + airX)*p.weight*0.5;
      var wY = (dy + airY)*p.weight*0.5;

      /* alvos — o "fotograma" da personalidade:
         tx = deslocamento (curto), tz = respiração em escala */
      var tx = bX*p.ampX*cal.plateLife + wX;
      var ty = bY*p.ampY*cal.plateLife + wY;
      var tz = (bZ - 0.5)*2*p.sc*1.6*cal.plateLife;

      /* integração: a massa segue o alvo com sua própria reação
         (front rápida, back lenta) — sem overshoot, papel grosso */
      var r = p.react;
      p.x += (tx - p.x)*r*0.5;
      p.y += (ty - p.y)*r*0.5;
      p.z += (tz - p.z)*r*0.6;

      /* rotação microscópica — quase imperceptível, papel repousando */
      p.rz = bX*p.rot;
    }

    /* ——— aplica o ambiente ——— */
    root.style.setProperty('--day',    day.toFixed(4));
    root.style.setProperty('--breath', breath.toFixed(4));
    root.style.setProperty('--tide',   tide.toFixed(4));
    root.style.setProperty('--float',  floatY.toFixed(4));
    root.style.setProperty('--lx',     lx.toFixed(4));
    root.style.setProperty('--ly',     ly.toFixed(4));
    root.style.setProperty('--anchor', anchor.toFixed(4));
    root.style.setProperty('--px',     px.toFixed(3));
    root.style.setProperty('--py',     py.toFixed(3));

    /* profundidade em 3 tempos de leitura */
    root.style.setProperty('--pa', (bx + airX*0.4).toFixed(3));
    root.style.setProperty('--qa', (by + airY*0.4).toFixed(3));
    root.style.setProperty('--pb', (mx + airX*0.6).toFixed(3));
    root.style.setProperty('--qb', (my + airY*0.5).toFixed(3));
    root.style.setProperty('--pc', (dx + airX*0.8).toFixed(3));
    root.style.setProperty('--qc', (dy + airY*0.7).toFixed(3));

    /* — placas — deslocamento curto (px), escala (fração), rotação (deg) */
    root.style.setProperty('--btx-a', plates[0].x.toFixed(2)+'px');
    root.style.setProperty('--bty-a', plates[0].y.toFixed(2)+'px');
    root.style.setProperty('--bsc-a', plates[0].z.toFixed(4));
    root.style.setProperty('--rot-a', plates[0].rz.toFixed(3)+'deg');
    root.style.setProperty('--btx-b', plates[1].x.toFixed(2)+'px');
    root.style.setProperty('--bty-b', plates[1].y.toFixed(2)+'px');
    root.style.setProperty('--bsc-b', plates[1].z.toFixed(4));
    root.style.setProperty('--rot-b', plates[1].rz.toFixed(3)+'deg');
    root.style.setProperty('--btx-c', plates[2].x.toFixed(2)+'px');
    root.style.setProperty('--bty-c', plates[2].y.toFixed(2)+'px');
    root.style.setProperty('--bsc-c', plates[2].z.toFixed(4));
    root.style.setProperty('--rot-c', plates[2].rz.toFixed(3)+'deg');

    /* — CTA — a luz da sala passa pelo botão, sem efeito próprio */
    var ctaX = (lx - 0.5)*46 + px*0.8;
    root.style.setProperty('--cta-x', ctaX.toFixed(1)+'px');

    return {
      day:    day,
      tide:   tide,
      airX:   airX,
      airY:   airY,
      lx:     lx,
      anchor: anchor
    };
  }

  /* reduced motion: a sala congela numa luz estável */
  function setStatic(){
    root.style.setProperty('--day',    '0.5');
    root.style.setProperty('--breath', '0.5');
    root.style.setProperty('--tide',   '0.5');
    root.style.setProperty('--lx',     '0.5');
    root.style.setProperty('--ly',     '0.5');
    root.style.setProperty('--anchor', '0.32');
    root.style.setProperty('--px',     '0');
    root.style.setProperty('--py',     '0');
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