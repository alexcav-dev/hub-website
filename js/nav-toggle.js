/* ==========================================================
   MENU MOBILE · js/nav-toggle.js
   ==========================================================
   SOOMENTE o abrir/fechar do menu ☰ do header mobile.

   NÃO duplica o ViewManager: as opções do painel são os próprios
   <button data-view> que o app.js já gerencia (o painel .nav-track
   vive dentro de .app-nav, então o clique já troca a view). Este
   arquivo cuida apenas de:
   · abrir/fechar (classe .nav-open no header + aria-expanded);
   · fechar ao tocar numa opção, com Esc e ao voltar ao desktop;
   · sincronizar o rótulo do botão (abrir/fechar menu).

   Carregar depois de js/app.js. Nenhum sistema existente é tocado.
   ========================================================== */
(function(global){
  'use strict';

  var header = document.querySelector('.app-header');
  var toggle = document.getElementById('mobile-nav-toggle');
  var nav = header ? header.querySelector('.app-nav') : null;
  if(!header || !toggle || !nav) return;

  function setOpen(open){
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  }

  toggle.addEventListener('click', function(){
    setOpen(!header.classList.contains('nav-open'));
  });

  /* selecionar uma opção: a troca de view é do ViewManager; aqui só
     recolhemos o painel (manter a página na posição da nova view) */
  nav.addEventListener('click', function(e){
    if(e.target.closest('[data-view]')) setOpen(false);
  });

  global.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && header.classList.contains('nav-open')) setOpen(false);
  });

  /* voltar à largura desktop recolhe o menu (estado limpo) */
  var mq = global.matchMedia ? global.matchMedia('(max-width:960px)') : null;
  if(mq){
    var onChange = function(){ setOpen(false); };
    if(mq.addEventListener) mq.addEventListener('change', onChange);
    else if(mq.addListener) mq.addListener(onChange);
  }
})(window);