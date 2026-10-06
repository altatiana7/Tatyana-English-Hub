/* Общее меню разделов: один сайт, одна навигация на всех страницах. */
(function(){
  const SECT=[['index.html','Главная','все разделы'],['lesson1.html','Занятие 1','диагностика на уроке'],['home1.html','Домашняя часть','аудирование, чтение, письмо'],['write37.html','Письмо 37','структура, вопросы, 89 писем'],['write38.html','Задание 38','структура, данные, 27 тем'],['plan.html','План','для учителя']];
  const V='15',bar=document.querySelector('.bar'),home=bar&&bar.querySelector('a.home');if(!home)return;
  const here=(location.pathname.split('/').pop()||'index.html');
  const b=document.createElement('button');b.type='button';b.className='tab menub';b.textContent=(SECT.find(s=>s[0]===here)||SECT[0])[1];b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');
  const m=document.createElement('nav');m.className='sitemenu';m.hidden=true;m.setAttribute('aria-label','Разделы сайта');
  SECT.forEach(s=>{const a=document.createElement('a');a.href=s[0]+'?v='+V;a.className=s[0]===here?'on':'';a.innerHTML='<b>'+s[1]+'</b><span>'+s[2]+'</span>';m.append(a);});
  home.after(b);document.body.append(m);
  const close=()=>{m.hidden=true;b.setAttribute('aria-expanded','false');};
  b.onclick=e=>{e.stopPropagation();m.hidden=!m.hidden;b.setAttribute('aria-expanded',String(!m.hidden));const r=b.getBoundingClientRect();m.style.left=Math.max(8,r.left)+'px';m.style.top=(r.bottom+6)+'px';};
  document.addEventListener('click',e=>{if(!m.contains(e.target))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
