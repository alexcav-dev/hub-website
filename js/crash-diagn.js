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

   SEGURANÇA DA EVIDÊNCIA (v2):
   · sessionStorage morre JUNTO com o processo morto — a prova do
     kill (o "último evento") podia sumir antes do próximo boot.
     Agora cada gravação é espelhada em localStorage
     ("__hub_crash_live"), que sobrevive à morte do WebContent.
   · arquivo de boots ("__hub_crash_arch") em localStorage:
     cada boot grava {n, saída limpa?, type de navegação, tabId}
     — dá para reconstituir episódios mesmo depois de vários.
   · storageWiped: se nesta MESMA aba o sessionStorage reapareceu
     vazio mas o arquivo existe → o processo foi reiniciado de
     verdade (apagou a memória de sessão) — mais forte que c=0.

   Consumo: ~80-200 B por heartbeat, 1 escrita/2s (espelhada em LS).
   ========================================================== */
(function(global){
  'use strict';

  var K = '__hub_crash';
  var LK = '__hub_crash_live';    /* espelho que sobrevive ao kill */
  var AK = '__hub_crash_arch';    /* arquivo de boots */
  var DOC = global.document;
  var SS = null, LS = null;
  try{ SS = global.sessionStorage; }catch(e){ SS = null; }
  try{ LS = global.localStorage;  }catch(e){ LS = null; }
  var tab = Math.random().toString(36).slice(2, 10);   /* id desta aba */

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
    vw: null,                  /* view ativa (ex.: HUB) */
    last: []                   /* anel de eventos ("nome@ts") */
  };

  /* ————— view atual: lida do DOM (0 custo: 1 query a cada batimento
     + MutationObserver de classe no container de views) ————— */
  function readView(){
    try{
      var el = DOC.querySelector('.views .view.active[data-view]');
      return el ? (el.getAttribute('data-view') || '?').toUpperCase() : null;
    }catch(e){ return null; }
  }
  var viewsRoot = DOC.querySelector('.views');
  if(viewsRoot && global.MutationObserver){
    try{
      new global.MutationObserver(function(){
        var vw = readView();
        if(vw && vw !== state.vw){ state.vw = vw; save(); }
      }).observe(viewsRoot, {subtree:true, attributeFilter:['class']});
    }catch(e){}
  }
  state.vw = readView();

  /* espelho: estado mínimo em localStorage (sobrevive ao kill) */
  function mirror(){
    try{
      if(LS) LS.setItem(LK, JSON.stringify({
        n: state.n, h: state.h, e: state.e, t: state.t,
        c: state.c, v: state.v, vv: state.vv, vw: state.vw, tab: tab
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

  /* ————— heartbeat (2s): vivo + view atual; "BEAT" vira o último
     evento conhecido — o banner usa isso como "vivo até ali" ————— */
  global.setInterval(function(){
    state.h = Date.now();
    state.t = state.h;
    state.e = 'BEAT';
    var vw = readView();
    if(vw && vw !== state.vw){ state.vw = vw; }
    save();
  }, 2000);

  /* ————— boot: compara com a sessão anterior ————— */
  var reloaded  = !!(prev && typeof prev.n === 'number' && prev.n >= 1);
  var quietKill = reloaded && !(prev.c === 1);

  var navType = '?';
  try{
    var navs = global.performance && global.performance.getEntriesByType
      ? global.performance.getEntriesByType('navigation') : [];
    if(navs.length && navs[0].type) navType = navs[0].type;
  }catch(e){}

  /* arquivo de boots (localStorage — não morre com o processo) */
  var arch = [];
  try{ arch = JSON.parse(LS ? LS.getItem(AK) : 'null') || []; }catch(e){ arch = []; }
  var lastArch = arch.length ? arch[arch.length-1] : null;
  var prevTab = lastArch ? lastArch.tab : null;

  /* mesma aba, archive existe, session vazia → o processo foi
     reiniciado de verdade e levou a memória de sessão junto */
  var storageWiped = !prev && !!lastArch && lastArch.tab === tab;

  arch.push({
    t: TS, n: n, q: quietKill ? 1 : 0, e: prev ? (prev.e || 'boot') : null,
    nt: navType, tab: tab, prevTab: prevTab, sw: storageWiped ? 1 : 0
  });
  if(arch.length > 24) arch.splice(0, arch.length - 24);
  try{ if(LS) LS.setItem(AK, JSON.stringify(arch)); }catch(e){}

  try{
    console[quietKill || storageWiped ? 'warn' : 'log'](
      '[CRASH-DIAG] boot #' + n + (prevTab === tab ? ' [mesma aba]' : ' [nova aba]') +
      (reloaded
        ? (quietKill
            ? ' — RELOAD DETECTADO SEM AVISO (página morreu sem reportar)'
            : ' — reload registrado (com beforeunload)')
        : (storageWiped
            ? ' — PROCESSO REINICIADO: storage de sessão apagado nesta aba'
            : ' — primeira sessão')) +
      ' · nav=' + navType +
      (reloaded ? ' | carga anterior: #' + prev.n + '@' + prev.t : '')
    );
  }catch(e){}

  var suspeito = quietKill || storageWiped;
  if((reloaded || storageWiped) && DOC.body){
    function fmt(ms){
      if(!ms || ms < 0) return '—';
      return (ms/1000).toFixed(1).replace('.', ',') + 's';
    }
    var hbAge = prev && prev.h ? TS - prev.h : null;
    var linhas =
      'View anterior: '   + (prev && prev.vw ? prev.vw : '—') + '\n' +
      'Último evento: '   + (prev ? String(prev.e || '?').toUpperCase() : '?') + '\n' +
      'Último heartbeat: '+ (hbAge !== null ? fmt(hbAge) : '—') + '\n' +
      'Boot: #'           + (prev ? prev.n : '—') + ' → #' + n;

    var banner = DOC.createElement('div');
    banner.style.cssText =
      'position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;' +
      'background:rgba(15,30,53,.96);color:#dbe6f5;' +
      'font:500 12.5px/1.55 system-ui,-apple-system,sans-serif;' +
      'padding:12px 14px;border-radius:8px;' +
      'border-left:3px solid ' + (suspeito ? '#e3a13b' : '#9db7d9') + ';' +
      'box-shadow:0 10px 30px rgba(0,0,0,.45);cursor:pointer;max-width:560px';

    var title = DOC.createElement('div');
    title.style.cssText = 'font-size:14.5px;font-weight:700;color:#f5d78e;letter-spacing:.01em';
    title.textContent = suspeito ? '⚠ RELOAD SEM AVISO' : 'RELOAD DETECTADO';

    var sub = DOC.createElement('div');
    sub.style.cssText = 'font-size:11.5px;color:#aab8d0;margin:2px 0 9px';
    sub.textContent = storageWiped
      ? 'Provável reinício do WebContent (storage de sessão apagado)'
      : (suspeito ? 'Provável reinício do WebContent' : 'Reinício registrado (beforeunload)');

    var rows = DOC.createElement('div');
    rows.style.cssText = 'white-space:pre-line;color:#e6eefb';
    rows.textContent = linhas;

    var hint = DOC.createElement('div');
    hint.style.cssText = 'margin-top:9px;font-size:11px;color:#8fa2bd;text-align:center';
    hint.textContent = 'Toque para ver detalhes';

    var details = DOC.createElement('div');
    details.style.cssText = 'display:none;margin-top:9px;padding-top:9px;' +
      'border-top:1px solid rgba(245,215,142,.16);' +
      'font:500 11px/1.7 ui-monospace,SFMono-Regular,monospace;' +
      'color:#c9d6ea;white-space:pre-wrap;word-break:break-word';

    banner.appendChild(title);
    banner.appendChild(sub);
    banner.appendChild(rows);
    banner.appendChild(hint);
    banner.appendChild(details);

    banner.addEventListener('click', function(){
      if(details.style.display === 'block'){
        details.style.display = 'none';
        hint.textContent = 'Toque para ver detalhes';
        return;
      }
      var extra =
        'nav=' + navType +
        ' · storage apagado: ' + (storageWiped ? 'sim' : 'não') +
        ' · saída limpa: ' + (prev ? (prev.c === 1 ? 'sim' : 'não') : '?') + '\n' +
        (prev && prev.c === 0 && !storageWiped
          ? '→ morte sem beforeunload na sessão anterior\n' : '') +
        (prev && prev.last && prev.last.length
          ? '\nEventos da sessão anterior:\n' + prev.last.slice(-8).join('\n')
          : '\n(anel de eventos da sessão anterior não preservado)');
      details.textContent = extra;
      details.style.display = 'block';
      hint.textContent = 'Toque para ocultar';
      try{ console.table(prev && prev.last || []); }catch(e){}
    }, false);

    DOC.body.appendChild(banner);
  }

  /* ————— API de console ————— */
  global.__CRASH = {
    reloaded: reloaded,
    quietKill: quietKill,
    storageWiped: storageWiped,
    tab: tab,
    navType: navType,
    state: function(){ return JSON.parse(JSON.stringify(state)); },
    archive: function(){ return JSON.parse(JSON.stringify(arch)); },
    live: function(){
      try{ return JSON.parse(LS ? LS.getItem(LK) : 'null'); }catch(e){ return null; }
    },
    report: function(){
      console.log('[__CRASH] boot #' + state.n + ' · nav=' + navType +
        ' · mesmo processo? ' + (!reloaded && !storageWiped ? 'sim' : 'não') +
        ' · view: ' + (state.vw || '—') +
        ' · último evento: ' + state.e + '@' + state.t +
        ' · heartbeat: ' + state.h + ' · saída limpa: ' + state.c);
      console.table(state.last.slice(-20));
      console.log('[__CRASH] arquivo de boots (localStorage):');
      console.table(arch.slice(-8));
    }
  };

  save(); /* estado inicial do boot já persistido */
})(window);