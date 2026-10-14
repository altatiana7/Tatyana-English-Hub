/* Главный экран: разделы под кнопками (при каждом открытии все закрыты),
   занятия и задания открываются поверх главного экрана во весь экран. */
(function(){
  const secs=[...document.querySelectorAll('.sec')];
  secs.forEach(b=>b.onclick=()=>{const id='p-'+b.dataset.p,open=b.classList.contains('on');
    secs.forEach(x=>{x.classList.remove('on');document.getElementById('p-'+x.dataset.p).hidden=true;});
    if(!open){b.classList.add('on');document.getElementById(id).hidden=false;}});

  let box=null;
  function close(){if(!box)return;const b=box;box=null;if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});}b.remove();document.title='ЕГЭ 2027 · английский';}
  function open(href){close();box=document.createElement('div');box.className='fsbox';
    const f=document.createElement('iframe');f.src=href;f.title='Задание';f.allow='fullscreen; microphone; autoplay; clipboard-write';f.setAttribute('allowfullscreen','');
    f.onload=()=>{try{document.title=f.contentDocument.title;}catch(e){}};
    box.append(f);document.body.append(box);
    const r=box.requestFullscreen&&box.requestFullscreen();if(r&&r.catch)r.catch(()=>{});
    setTimeout(()=>{try{f.focus();}catch(e){}},50);}
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&box)close();});
  window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data==='ege-home')close();});
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('main a[href], .sitemenu a[href]');if(!a)return;
    const u=new URL(a.href,location.href);if(u.origin!==location.origin||/index\.html$/.test(u.pathname)||!/\.html$/.test(u.pathname))return;
    e.preventDefault();open(u.pathname.split('/').pop()+u.search+u.hash);});
})();
