/* Отметки «В ДЗ» на УЧИТЕЛЬСКИХ сайтах (Катя ЕГЭ, Рита ЕГЭ): что уже отправлено ученице в домашку.
   На карточке или плитке задания появляется зелёная метка «✓ В ДЗ · дата», чтобы не давать одно и то же дважды.
   На сайтах учениц этот файл НЕ подключается.

   Как добавить отправленное (делается каждый раз, когда задание уходит ученице в домашку):
     k – страница, 'family-variant.html'                     → метка на карточке этой страницы
         страница:задание, 'family-variant.html:r10'          → метка на плитке задания внутри страницы
         страница#якорь, 'lesson1.html#6'                    → метка на карточке с таким якорем
     d – дата отправки (текст, можно не указывать)
     n – что именно отправлено (всплывает при наведении) */
(function(){
  const GIVEN={
    katya:[
      {k:'write-hw1113.html',d:'13 ноября',n:'3 письма (задание 37) и 3 эссе (задание 38): Family, Household Chores, Conflicts and Stress, Traits of Character'},
      {k:'family-variant.html',d:'4 ноября',n:'чтение 10–18, грамматика 19–24, словообразование 25–29, лексика 30–36'},
      {k:'family-variant.html:r10',d:'4 ноября'},
      {k:'family-variant.html:r11',d:'4 ноября'},
      {k:'family-variant.html:r18',d:'4 ноября'},
      {k:'family-variant.html:g1',d:'4 ноября'},
      {k:'family-variant.html:g2',d:'4 ноября'},
      {k:'family-variant.html:mu',d:'4 ноября'},
      {k:'family-week4-homework.html',d:'31 октября',n:'УЧ-4: чтение 10–11, грамматика 19–24, словообразование 25–29'},
      {k:'mock1.html',d:'29 октября',n:'пробник, вариант 1: аудирование 3–9'},
      {k:'home1.html',n:'диагностика, домашняя часть: аудирование 1–9, чтение 10 и 12–18, письмо 37 и 38'}
    ],
    rita:[
      {k:'home1.html',n:'диагностика, домашняя часть: аудирование 1–9, чтение 10 и 12–18, письмо 37 и 38'}
    ]
  };
  const SITE={'katya-ege-teacher-8m3q':'katya','rita-ege-teacher-0vop':'rita'};
  const parts=decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const who=parts.map(p=>SITE[p]).find(Boolean);
  if(!who)return;
  const file=(parts[parts.length-1]||'index.html').indexOf('.')<0?'index.html':parts[parts.length-1];
  const map={};(GIVEN[who]||[]).forEach(e=>{map[e.k]=e;});

  const st=document.createElement('style');
  st.textContent='.hwg{display:inline-flex;align-items:center;gap:4px;font:700 10px/1 Inter,system-ui,sans-serif!important;font-size:10px!important;line-height:1!important;height:auto!important;min-height:0!important;width:auto!important;color:#1e6b4a;background:#e8f5ef;border:1px solid #b9dcc9;border-radius:999px;padding:2px 7px;white-space:nowrap;letter-spacing:.2px;pointer-events:auto}'+
    '.lc:has(>.hwg),.tile:has(>.hwg),.stepc:has(>.hwg){position:relative}'+
    '.lc>.hwg,.stepc>.hwg{position:absolute;top:-9px;right:10px;margin:0;z-index:3;box-shadow:0 1px 3px rgba(30,107,74,.18)}'+
    '.tile>.hwg{position:absolute;top:-8px;right:8px;margin:0;z-index:3;box-shadow:0 1px 3px rgba(30,107,74,.18)}';
  document.head.appendChild(st);

  const badge=(e,tile)=>{const s=document.createElement('span');s.className='hwg';s.textContent='✓ В ДЗ'+(e.d&&!tile?' · '+e.d:'');
    s.title='Отправлено в домашку'+(e.d?' ('+e.d+')':'')+(e.n?': '+e.n:'');return s;};
  const pageOf=h=>String(h||'').split('#')[0].split('?')[0].split('/').pop();
  function put(el,e){if(!e||el.dataset.hwg)return;el.dataset.hwg='1';el.appendChild(badge(e,el.classList.contains('tile')));}
  function apply(){
    /* карточки-ссылки (страницы) */
    document.querySelectorAll('a.lc[href],a.stepc[href]').forEach(a=>{
      const h=a.getAttribute('href')||'',f=pageOf(h),hash=h.indexOf('#')>=0?'#'+h.split('#')[1]:'';
      put(a,map[f+hash]||map[f]);});
    /* плитки заданий внутри страницы урока / варианта */
    document.querySelectorAll('.tile[data-task]').forEach(t=>put(t,map[file+':'+t.dataset.task]));
  }
  let q=0;const sched=()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;apply();});};
  const start=()=>{apply();new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
})();
