/* ——————————————————————————————————————————————
   main.js — inicialização e orquestração.
   Respeita prefers-reduced-motion, monta os sistemas
   e conduz o único requestAnimationFrame do site.
—————————————————————————————————————————————— */
(function(){
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = window.HubMotion;
  var dust = window.HubDust;

  if(reduce){
    motion.setStatic();
    return;
  }

  motion.init();
  dust.init(document.getElementById('dust'));

  var running = true;

  /* a troca de visibilidade é o único item no estado que o main
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