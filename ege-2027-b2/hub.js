/* Главный экран: разделы под кнопками (при каждом открытии все закрыты),
   занятия и задания открываются поверх главного экрана во весь экран. */
(function(){
  const V='43';
  /* домашнее задание: баннер и блокировка ссылок */
  (function(){
    const nr=document.getElementById('nowrow');if(!nr)return;
    const has=HW.items.length>0;
    /* быстрые ссылки на урок */
    const LW=[['w','Words','lessonw1:words'],['h','Error hunter','lessonw1:hunt'],['t1','Task 1','lessonw1:t1-1'],['t2','Task 2','lessonw1:t2-1'],['t3','Task 3','lessonw1:iv1'],['t4','Task 4','lessonw1:t4-1']];
    const LB=[['1','Grammar · 12','block1:g'],['2','Word formation · 8','block1:w'],['3','Reading · 3','block1:r'],['4','Letter 37 · 4','block1:l']];
    function lk(href,text,hwPfx){
      const a=document.createElement('a');a.textContent=text;
      const open=!has||HW.items.some(x=>x===hwPfx||x.indexOf(hwPfx)===0);
      if(open){a.href=href;}else{a.className='lock';a.href='#';a.onclick=e=>e.preventDefault();}
      return a;
    }
    /* «Продолжить урок» */
    const contOpen=!has||HW.page('lessonw1');
    const cont=document.createElement('a');cont.className='cont';cont.style.textDecoration='none';
    if(contOpen){cont.href='lessonw1.html?v='+V;}else{cont.href='#';cont.onclick=e=>e.preventDefault();cont.style.opacity='.4';cont.style.cursor='not-allowed';}
    cont.innerHTML='<span>Занятие 1 · неделя 1</span><b>Продолжить урок →</b>';
    const qk=document.createElement('div');qk.className='qk';
    /* урок */
    const ql1=document.createElement('span');ql1.className='ql';ql1.textContent='Урок';qk.append(ql1);
    LW.forEach(x=>qk.append(lk('lessonw1.html?v='+V+'#'+x[0],x[1],x[2])));
    /* банк заданий */
    const ql2=document.createElement('span');ql2.className='ql';ql2.textContent='Банк заданий блока';qk.append(ql2);
    LB.forEach(x=>qk.append(lk('block1.html?v='+V+'#'+x[0],x[1],x[2])));
    nr.append(cont,qk);
    /* баннер домашнего задания */
    if(has){
      const bar=document.createElement('div');bar.className='hwbar';
      bar.innerHTML='<b>Homework'+(HW.due?' · due '+HW.due:'')+'</b>';
      const list=document.createElement('div');list.className='hwlist';
      HW.items.forEach(id=>{const a=document.createElement('a');a.className='hwt';a.textContent=HW.label(id);a.href=HW.href(id)+'?v='+V;list.append(a);});
      bar.append(list);
      const np=document.getElementById('now-panel');np.insertBefore(bar,np.firstChild);
    }
  })();

  const secs=[...document.querySelectorAll('.sec')];
  secs.forEach(b=>b.onclick=()=>{const id='p-'+b.dataset.p,open=b.classList.contains('on');
    secs.forEach(x=>{x.classList.remove('on');document.getElementById('p-'+x.dataset.p).hidden=true;});
    if(!open){b.classList.add('on');document.getElementById(id).hidden=false;}
    const d=document.getElementById('dash');if(d)d.hidden=!open;});
  /* блоки ФИПИ: карточки, карта месяцев, «Сейчас» */
  (function(){const BL=window.BLOCKS,SC=window.SCHED;if(!BL||!SC)return;const cb=SC.curBlock;
    const g=document.getElementById('blks');
    if(g){BL.forEach(b=>{const short=b.ru.split(/[.:;]/)[0],has=!!b.page,x=document.createElement(has?'a':'div');x.className='br'+(b.n===cb?' cur':'')+(b.n<cb?' done':'')+(has?' has':'');if(has)x.href=b.page+'?v='+V;x.title=b.ru+'\nНа уроках: '+b.focus+(b.mock?' · '+b.mock:'');
        x.innerHTML='<i>'+b.n+'</i><b>'+b.en+'</b><span>'+short+'</span><em>'+SC.blockDates(b.n)+'</em>';g.append(x);});
      const det=document.getElementById('bdet'),show=b=>{if(det)det.innerHTML='<b>'+b.n+' · '+b.en+'</b> · тема ФИПИ: '+b.ru+'. <i>На уроках: '+b.focus+(b.mock?' · '+b.mock:'')+'.</i>';};
      [...g.children].forEach((x,k)=>{x.addEventListener('mouseenter',()=>show(BL[k]));if(!BL[k].page)x.addEventListener('click',()=>show(BL[k]));});show(BL[cb-1]);
      const r=document.createElement('div');r.className='br rev';r.innerHTML='<i>18</i><b>Повторение</b><span>все 17 тем, полные варианты</span><em>19 апр – июнь</em>';g.append(r);}
    const road=document.getElementById('road');
    if(road){const M=[[9,'Окт'],[10,'Ноя'],[11,'Дек'],[0,'Янв'],[1,'Фев'],[2,'Мар'],[3,'Апр'],[4,'Май'],[5,'Июн']],m=new Date().getMonth(),pos=M.findIndex(x=>x[0]===m);
      M.forEach((mm,k)=>{const bs=BL.filter(b=>SC.blockMonth(b.n)===mm[0]),d=document.createElement('div');if(k===pos)d.className='on';else if(pos>=0&&k<pos)d.className='past';
        d.innerHTML='<i>'+mm[1]+'</i><b>'+(bs.length?bs.map(b=>b.n+' '+b.s).join(', '):(mm[0]===4?'Повторение, пробник 4':'Экзамен'))+'</b>';d.title=bs.map(b=>b.n+'. '+b.ru).join('\n');road.append(d);});}
    const ni=document.getElementById('nowi'),nb=document.getElementById('nowb'),b=BL[cb-1];
    if(ni&&b){ni.textContent='Сейчас · блок '+b.n+' из 17 · '+SC.blockDates(b.n);nb.textContent=b.en;nb.title=b.ru;}
  })();

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
