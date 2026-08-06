/* ——————————————————————————————————————————————
   Interactions — cursor, resize e visibilidade.
   Apenas costura os eventos nos sistemas certos:
   aponta para o Motion Engine e redimensiona as
   Partículas. Expõe HubInteractions.
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