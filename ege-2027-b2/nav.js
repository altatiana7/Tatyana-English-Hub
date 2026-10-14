/* Общее меню разделов: один сайт, одна навигация на всех страницах. */
(function(){
  const SECT=[['index.html','Главная','все разделы'],['lessonw1.html','Занятие 1 · неделя 1','Family and friends'],['block1.html','Блок 1 · задания','грамматика, чтение, письмо'],['lesson1.html','Диагностика','9 этапов на уроке'],['home1.html','Домашняя часть','аудирование, чтение, письмо'],['write37.html','Письмо 37','структура, вопросы, 89 писем'],['write38.html','Задание 38','структура, данные, 27 тем'],['russia.html','Russia','устная часть и письма о России'],['plan.html','План','для учителя']];
  const V='26',bar=document.querySelector('.bar'),home=bar&&bar.querySelector('a.home');if(!home)return;
  const here=(location.pathname.split('/').pop()||'index.html');
  const b=document.createElement('button');b.type='button';b.className='tab menub';b.textContent=(SECT.find(s=>s[0]===here)||SECT[0])[1];b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');
  const m=document.createElement('nav');m.className='sitemenu';m.hidden=true;m.setAttribute('aria-label','Разделы сайта');
  SECT.forEach(s=>{const a=document.createElement('a');a.href=s[0]+'?v='+V;a.className=s[0]===here?'on':'';a.innerHTML='<b>'+s[1]+'</b><span>'+s[2]+'</span>';m.append(a);});
  /* кнопка «На главную» на каждой странице и в каждом задании: сам логотип стал кнопкой со стрелкой */
  if(here!=='index.html'){home.href='index.html?v='+V;home.title='На главную';home.classList.add('homebtn');home.innerHTML='<em class="harr">←</em>Главная';
    const hs=document.createElement('style');hs.textContent='.bar a.home.homebtn{border:1.5px solid #c9d3e6;border-radius:12px;padding:6px 10px 6px 8px;background:#fff;gap:5px;font-size:16px}.bar a.home.homebtn::before{display:none}.bar a.home.homebtn:hover{background:#edf4ff}.bar a.home .harr{font-style:normal;font-weight:900;font-size:19px;color:#2855d9;margin-right:2px}';document.head.append(hs);}
  if(typeof ED!=='undefined'){const a=document.createElement('a');a.href='#';a.innerHTML='<b>Правка ответов</b><span>для учителя</span>';a.onclick=e=>{e.preventDefault();close();ED.toggle();};m.append(a);}
  /* подсказки и рекомендации скрыты: ученик видит экран учителя. Показываются кнопкой и снова прячутся при каждом открытии страницы */
  const hst=document.createElement('style');hst.textContent='body:not(.showhints) .hint{display:none!important}.hintb{white-space:nowrap;flex:0 0 auto}';document.head.append(hst);
  const hb=document.createElement('button');hb.type='button';hb.className='btn sm main hintb';hb.textContent='Подсказки: вкл';hb.hidden=true;
  const hm=document.createElement('a');hm.href='#';
  const paintH=()=>{const on=document.body.classList.contains('showhints');hb.hidden=!on;hm.innerHTML='<b>Подсказки</b><span>'+(on?'скрыть':'показать')+'</span>';};
  const toggleH=()=>{document.body.classList.toggle('showhints');paintH();};hb.onclick=toggleH;hm.onclick=e=>{e.preventDefault();close();toggleH();};
  if(here!=='index.html'){m.append(hm);bar.append(hb);paintH();}
  /* внутри полноэкранного окна главного экрана: «Главная» закрывает окно и возвращает на главный экран */
  if(window.top!==window){const toHub=e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;const u=new URL(a.href,location.href);if(/index\.html$/.test(u.pathname)||/\/$/.test(u.pathname)){e.preventDefault();try{window.top.postMessage('ege-home',location.origin);}catch(x){}}};document.addEventListener('click',toHub,true);}
  home.after(b);document.body.append(m);
  const close=()=>{m.hidden=true;b.setAttribute('aria-expanded','false');};
  b.onclick=e=>{e.stopPropagation();m.hidden=!m.hidden;b.setAttribute('aria-expanded',String(!m.hidden));const r=b.getBoundingClientRect();m.style.left=Math.max(8,r.left)+'px';m.style.top=(r.bottom+6)+'px';};
  document.addEventListener('click',e=>{if(!m.contains(e.target))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
