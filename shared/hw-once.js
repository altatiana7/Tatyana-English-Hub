/* Одна попытка на задание в домашке. Прячет и отключает кнопки «Play again / Try again / Again / Reset / Start over»,
   чтобы ответ нельзя было переделать. Карточки (Quizlet) не трогает – они всегда свободны. */
(function(){
  var RE=/^\s*(play again|try again|again|reset|reset all|start over|start again|restart|retry|study these \d+ again|снова|заново|ещё раз|еще раз|сначала)\s*[.!›»→]*\s*$/i;
  var SAFE='.quizlet,#cards,.cards,[data-cards],.flashcards,.hwl-banner,.hwl-closedscr,.hwpbox,.hwpov';
  var st=document.createElement('style');st.textContent='.hwo-off{display:none!important}';document.head.appendChild(st);
  function scan(){
    document.querySelectorAll('button,a.btn,[role=button]').forEach(function(b){
      if(b.classList.contains('hwo-off'))return;
      var t=(b.textContent||'').trim();
      if(!RE.test(t)&&!/^(reset|resetAll|again|retry)$/i.test(b.id||''))return;
      if(b.closest(SAFE))return;
      b.classList.add('hwo-off');b.setAttribute('aria-hidden','true');b.setAttribute('tabindex','-1')})}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.hwo-off');
    if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);
  var T=0,mo=new MutationObserver(function(){clearTimeout(T);T=setTimeout(function(){mo.disconnect();try{scan()}finally{mo.observe(document.body,{childList:true,subtree:true})}},60)});
  function go(){scan();mo.observe(document.body,{childList:true,subtree:true})}
  if(document.body)go();else document.addEventListener('DOMContentLoaded',go)
})();
