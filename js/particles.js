/* ——————————————————————————————————————————————
   Particles — poeira de verdade suspendida numa sala
   iluminada, não um efeito. Pouca, pequena, suave.

   · cada grão tem profundidade (z), velocidade própria e vida;
   · alguns somem (ciclo), outros surgem — reposição hestaria;
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

  /* sprite radial: centro denso, borda que desfaz — pó, não ponto */
  var sprInk=null, sprGold=null;
  function spriteDust(rgb){
    var cv=document.createElement('canvas');
    cv.width=cv.height=20;
    var g=cv.getContext('2d');
    var rad=g.createRadialGradient(10,10,0,10,10,10);
    rad.addColorStop(0,   rgb+',.80');
    rad.addColorStop(.45, rgb+',.16');
    rad.addColorStop(1,   rgb+',0');
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
    /* pouca poeira: densidade menor que antes */
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
         a sala inteira repousa — e a luz a atravessa */
      q.x += q.vx + env.airX*0.018*(0.35+q.z) + Math.sin(q.sw)*0.05*q.z;
      q.y += q.vy + (env.airY||0)*0.008*(0.35+q.z);

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