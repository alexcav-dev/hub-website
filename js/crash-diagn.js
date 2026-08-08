/* ==========================================================
   DIAGNÓSTICO PERSISTENTE DE RECARGA · js/crash-diagn.js
   ==========================================================
   Instrumentação leve, sempre ativa (sem flag), reversível:
   apagar a <script> do index.html + este arquivo.

   · histórico compacto em sessionStorage ("__hub_crash");
   · contador de carregamentos (n) — atravessa reloads;
   · registra pageshow/pagehide/beforeunload/visibilitychange/
     resize/visualViewport (dedupe ~300ms);
   · heartbeat a cada 2s — timestamp do último batimento vivo;
   · no BOOT compara com a sessão anterior:
       n aumentou  → "RELOAD DETECTADO" (banner automático)
       c === 0 (sem pagehide/beforeunload) → morte SEM aviso
       (provável kill do processo) — grifado em âmbar
   · consome ~0 trabalho quando ocioso; sessionStorage ≈ 100 B
     por gravação; gravações: 2s (heartbeat) + eventos raros.
   Não toca em layout, motion, dust nem na instrumentação ?trace.
   ========================================================== */
(function(global){
  'use strict';

  var K = '__hub_crash';
  var DOC = global.document;
  var SS = null;
  try{ SS = global.sessionStorage; }catch(e){ SS = null; }

  var BUF = 40;                  /* tamanho do anel de eventos */
  var TS = Date.now();           /* timestamp deste boot */
  var prev = null;
  try{ prev = JSON.parse(SS ? SS.getItem(K) : 'null') || null; }catch(e){ prev = null; }

  var n = 1;
  if(prev && typeof prev.n === 'number') n = prev.n + 1;

  var state = {
    n: n,                      /* contador de carregamentos */
    h: 0,                      /* último heartbeat (ms) */
    e: 'boot',                 /* último evento conhecido */
    t: TS,                     /* quando esse evento ocorreu */
    c: 0,                      /* 1 = saída limpa | 0 = sem aviso */
    v: global.innerWidth,      /* última largura registrada */
    vv: global.innerHeight,
    last: []                   /* anel de eventos ("nome@ts") */
  };

  function save(){
    try{ SS.setItem(K, JSON.stringify(state)); }catch(e){}
  }

  function mark(ev, extra){
    var now = Date.now();
    state.t = now;
    state.e = ev;
    var item = ev + '@' + now + (extra ? ':' + extra : '');
    state.last.push(item);
    if(state.last.length > BUF) state.last.shift();
    save();
  }

  /* ————— eventos de vida/morte ————— */
  global.addEventListener('beforeunload', function(){
    state.c = 1;               /* saída normal: reload/navegação */
    mark('beforeunload');
  });

  global.addEventListener('pagehide', function(){
    mark('pagehide');          /* não marca 'limpo': pode ser kill */
  }, true);

  global.addEventListener('pageshow', function(ev){
    mark('pageshow', ev.persisted ? 'p' : 'r');
  }, true);

  global.addEventListener('visibilitychange', function(){
    mark('vis:' + (DOC.hidden ? 'H' : 'V'));
  }, true);

  /* resize/visualViewport — dedupe de 300ms */
  var VVD = 0;
  function onResize(ev){
    var now = Date.now();
    if(now - VVD < 300) return;
    VVD = now;
    mark(ev, global.innerWidth + 'x' + global.innerHeight);
  }
  global.addEventListener('resize', onResize, true);
  if(global.visualViewport){
    global.visualViewport.addEventListener('resize', onResize, true);
    global.visualViewport.addEventListener('scroll', onResize, true);
  }

  /* ————— heartbeat (2s → ~30 gravações/min, ~80 B cada) ————— */
  global.setInterval(function(){
    state.h = Date.now();
    save();
  }, 2000);

  /* ————— boot: compara com a sessão anterior ————— */
  var reloaded  = !!(prev && typeof prev.n === 'number' && prev.n >= 1);
  var quietKill = reloaded && !(prev.c === 1);

  try{
    console[quietKill ? 'warn' : 'log'](
      '[CRASH-DIAG] boot #' + n +
      (reloaded
        ? (quietKill
            ? ' — RELOAD DETECTADO SEM AVISO (página morreu sem reportar)'
            : ' — reload registrado (com beforeunload)')
        : ' — primeira sessão') +
      (reloaded ? ' | carga anterior: #' + prev.n + '@' + prev.t : '')
    );
  }catch(e){}

  if(reloaded && DOC.body){
    /* banner fixo discreto, fechável por toque */
    var banner = DOC.createElement('div');
    banner.style.cssText =
      'position:fixed;left:10px;right:10px;bottom:10px;z-index:99999;' +
      'background:rgba(15,30,53,.95);color:#f5d78e;font:600 12px/1.55 system-ui,sans-serif;' +
      'padding:9px 12px;border-radius:6px;border-left:3px solid ' +
      (quietKill ? '#e3a13b' : '#9db7d9') + ';' +
      'box-shadow:0 8px 24px rgba(0,0,0,.35);cursor:pointer;' +
      'max-width:560px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    banner.textContent =
      (quietKill ? '!!! RELOAD DETECTADO — SEM AVISO (provável morte do processo)' : 'reload detectado') +
      ' · carga #' + n +
      (quietKill
        ? ' · morte há ~' + Math.max(1, Math.round((TS - prev.t)/1000)) + 's' +
          ' · último evento conhecido: ' + (prev.e || '?')
        : '');
    banner.addEventListener('click', function(){ DOC.body.removeChild(banner); }, false);
    DOC.body.appendChild(banner);
    if(quietKill){
      /* releitura do anel para o relatório do console */
      try{
        console.table((prev.last || []).slice(-Math.min(15, prev.last.length)));
      }catch(e){}
    }
  }

  /* ————— API de console ————— */
  global.__CRASH = {
    reloaded: reloaded,
    quietKill: quietKill,
    state: function(){ return JSON.parse(JSON.stringify(state)); },
    report: function(){
      console.log('[__CRASH] boot #' + state.n + ' · último evento: ' + state.e + '@' + state.t +
        ' · heartbeat: ' + state.h + ' · limpo: ' + state.c);
      console.table(state.last.slice(-20));
    }
  };

  save(); /* estado inicial do boot já persistido */
})(window);