/* ——————————————————————————————————————————————
   Particles — o sistema de poeira iluminada.
   Sprites radiais (tinta e dourado), desfoque de
   profundidade e gate de luz. Consome o ambiente
   devolvido pelo Motion Engine. Expõe HubDust.
—————————————————————————————————————————————— */
(function(global){
  'use strict';

  var c, ctx;
  var dpr = Math.min(window.devicePixelRatio||1,2);
  var w=0, h=0, p=[];

  /* sprites de poeira — o círculo é substituído por poeira de verdade:
     centro denso, borda desfoque; a poeira longe desfoca, a perto aguça */
  var sprInk=null, sprGold=null;
  function spriteDust(rgb){
    var cv=document.createElement('canvas');
    cv.width=cv.height=28;
    var g=cv.getContext('2d');
    var rad=g.createRadialGradient(14,14,0,14,14,14);
    rad.addColorStop(0,   rgb+',.85');
    rad.addColorStop(.45, rgb+',.22');
    rad.addColorStop(1,   rgb+',0');
    g.fillStyle=rad; g.fillRect(0,0,28,28);
    return cv;
  }

  function init(canvas){
    c = canvas;
    ctx = c.getContext('2d');
    sprInk=spriteDust('rgba(29,53,87,'); sprGold=spriteDust('rgba(176,141,62,');
    resize();
  }

  function resize(){
    if(!c) return;
    w = c.clientWidth; h = c.clientHeight;
    c.width = w*dpr; c.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    var n = Math.round((w*h)/54000); p = [];
    for(var i=0;i<n;i++){
      /* z: profundidade — define tamanho, velocidade, opacidade e foco */
      var z = Math.random();
      p.push({
        x:Math.random()*w, y:Math.random()*h, z:z,
        r:0.30 + z*1.15,
        a:(0.030 + z*0.085),
        ph:Math.random()*6.283,
        sp:0.00035 + Math.random()*0.0011,
        vx:(Math.random()-0.5)*0.020*(0.4+z),
        vy:-(Math.random()*0.016+0.005)*(0.35+z),
        sw:Math.random()*6.283,          /* fase da oscilação lateral */
        g: Math.random() < 0.09          /* raras partículas que pegam o dourado */
      });
    }
  }

  function render(env){
    if(!ctx || !w || !h) return;
    ctx.clearRect(0,0,w,h);
    for(var i=0;i<p.length;i++){
      var q=p[i];
      q.ph += q.sp; q.sw += 0.0016;
      /* a partícula é levada pela corrente, não por uma trajetória */
      q.x += q.vx + env.airX*0.030*(0.3+q.z) + Math.sin(q.sw)*0.045*q.z;
      q.y += q.vy + env.airY*0.012*(0.3+q.z);
      if(q.y < -8){ q.y = h+8; q.x = Math.random()*w; }
      if(q.x < -8) q.x = w+8; else if(q.x > w+8) q.x = -8;

      /* só brilha quando atravessa a luz — depende do dia e da posição */
      var lightX = 0.28 + env.day*0.44;
      var inLight = 1 - Math.min(1, Math.abs(q.x/w - lightX) / 0.42);
      var a = q.a * (0.42 + 0.58*inLight) * (0.55 + 0.45*Math.sin(q.ph));
      if(a <= 0.002) continue;
      /* desfoque de profundidade: a poeira distante é mais larga e
         translúcida (fora de foco); a próxima aguça e encolhe */
      var spr = q.g ? sprGold : sprInk;
      var s = q.r * 2.0 * (1.35 - q.z*0.4);
      ctx.globalAlpha = Math.min(1, a*1.9);
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
