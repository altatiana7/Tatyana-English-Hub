/* Главный экран: разделы под кнопками (при каждом открытии все закрыты),
   занятия и задания открываются поверх главного экрана во весь экран. */
(function(){
  const V='97',TCH=!!window.TEACHER;
  /* сайт ученицы: дополнительные материалы закрыты, их открывает учитель */
  if(!TCH)document.querySelectorAll('a.lc.xtra').forEach(a=>{a.classList.add('xlock');a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.title='Открывает учитель';});
  /* домашнее задание: баннер и блокировка ссылок */
  (function(){
    const nr=document.getElementById('nowrow');if(!nr)return;
    const has=HW.items.length>0;
    /* быстрые ссылки на урок */
    const LW=[['lessonw1.html?v=74#w','Words','lessonw1:words'],['lessonw1.html?v=74#c','Collocations','lessonw1:colls'],['lessonw1.html?v=74#h','Error hunter','lessonw1:hunt'],['lessonw1.html?v=74#m','Match','lessonw1:match'],['lessonw1.html?v=74#t1','Task 1','lessonw1:t1-1'],['lessonw1.html?v=74#t2','Task 2','lessonw1:t2-1'],['lessonw1.html?v=74#t3','Task 3','lessonw1:iv1'],['lessonw1.html?v=74#t4','Task 4','lessonw1:t4-1'],['family-quizlet.html?v=68','Topic Practice','',0],['extra-family.html?v=57','Words & Vocabulary','',1]];
    const LB=[['lesson1.html?v=93#5','Listening · 1–9','',1],['lesson1.html?v=94#8','Reading · 11','',1],['lesson1.html?v=93#6','Grammar · 19–24','',1],['lesson1.html?v=94#6','Word Formation · 25–29','',1],['lesson1.html?v=94#7','Vocabulary · 30–36','',1],['write37.html?v=60','Writing · 37','',1],['write38.html?v=57','Writing · 38','',1]];
    function lk(href,text,hwPfx,xtra){
      const a=document.createElement('a');a.textContent=text;
      const open=(TCH||!xtra)&&(!has||HW.items.some(x=>x===hwPfx||x.indexOf(hwPfx)===0));if(xtra&&!TCH)a.title='Открывает учитель';
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
    const ql1=document.createElement('span');ql1.className='ql';ql1.textContent='Тема блока · слова, коллокации, тренировка, устная часть';qk.append(ql1);
    LW.forEach(x=>qk.append(lk(x[0],x[1],x[2],x[3])));
    /* банк заданий */
    const ql2=document.createElement('span');ql2.className='ql';ql2.textContent=TCH?'Письменная часть ЕГЭ · переход сразу к заданию':'Письменная часть ЕГЭ · открывает учитель';qk.append(ql2);
    LB.forEach(x=>qk.append(lk(x[0],x[1],x[2],x[3])));
    /* тренажёры: вынесены с внутренней страницы прямо на панель (только на сайте учителя) */
    if(TCH){
      const LT=[['ege-30-36.html?v=2','Задания 30–36'],['concession.html?v=2','Though · However · Despite'],['pamyatki.html?v=2','Памятки ЕГЭ'],['lexika.html?v=2','Лексика ЕГЭ'],['russia.html?v=41','Russia'],['plan.html?v=40','План']];
      const ql3=document.createElement('span');ql3.className='ql';ql3.textContent='Тренажёры';qk.append(ql3);
      LT.forEach(x=>{const a=document.createElement('a');a.href=x[0];a.textContent=x[1];a.className='tr';qk.append(a);});
    }
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
    if(g){BL.forEach(b=>{const short=b.ru.split(/[.:;]/)[0],has=!!b.page,x=document.createElement(has?'a':'div');x.className='br'+(b.n===cb?' cur':'')+(b.n<cb?' done':'')+(has?' has':'');if(has){const [target,anchor='']=b.page.split('#');x.href=target+'?v='+V+(anchor?'#'+anchor:'');}x.title=b.ru+'\nНа уроках: '+b.focus+(b.mock?' · '+b.mock:'');
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
  function close(){if(!box)return;const b=box;box=null;b.remove();document.title='ЕГЭ 2027 · К · английский';}
  function open(href){close();box=document.createElement('div');box.className='fsbox';
    const f=document.createElement('iframe');f.src=href;f.title='Задание';f.allow='fullscreen; microphone; autoplay; clipboard-write';f.setAttribute('allowfullscreen','');
    f.onload=()=>{try{document.title=f.contentDocument.title;}catch(e){}};
    box.append(f);document.body.append(box);

    setTimeout(()=>{try{f.focus();}catch(e){}},50);}

  /* сайт учителя: проверка домашки – работы Кати приходят из базы сами */
  const PAGE={home1:'home1.html?v=41',lesson1:'lesson1.html?v=94#9',lessonw1:'lessonw1.html?v=74'};
  function openWork(page,data){const P=PAGE[page];if(!P)throw new Error('Неизвестная работа: '+page);
    sessionStorage.setItem('katya-review',JSON.stringify({page:page,data:data}));open(P);}
  let seen={};try{seen=JSON.parse(localStorage.getItem('katya-seen')||'{}');}catch(e){}
  const saveSeen=()=>{try{localStorage.setItem('katya-seen',JSON.stringify(seen));}catch(e){}};
  const badge=n=>{const b=document.getElementById('chknew');if(b){b.textContent=n;b.hidden=!n;}};
  async function loadChecks(ask){
    const msg=document.getElementById('chkmsg'),box=document.getElementById('chklist');if(!box)return;
    if(ask)msg.textContent='Загрузка…';
    let res;try{res=await KS.list(ask);}catch(e){if(ask)msg.textContent='Не удалось загрузить работы. Проверьте интернет и нажмите «Обновить».';return;}
    if(res.need){if(ask||res.bad)msg.textContent=res.bad?'Неверный пароль. Нажмите «Обновить» и введите его ещё раз.':'Нажмите «Обновить» и один раз введите пароль учителя (тот же, что для работ Арины).';return;}
    const rows=res.rows;badge(rows.filter(r=>!seen[r.id]).length);
    msg.textContent=rows.length?'Сдано работ: '+rows.length+'. Нажмите на работу – откроются ответы Кати: верно – зелёным, неверно – красным, баллы – на вкладке итогов.':'Катя пока ничего не отправила.';
    box.innerHTML='';
    rows.forEach(r=>{const it=document.createElement('div');it.className='chki'+(seen[r.id]?'':' new');
      const when=new Date(r.at).toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
      it.innerHTML='<div><b></b><span>отправлено '+when+'</span></div>';it.querySelector('b').textContent=r.title;
      const b=document.createElement('button');b.type='button';b.className='btn main';b.textContent='Открыть';
      b.onclick=()=>{try{seen[r.id]=1;saveSeen();openWork(r.page,Object.assign({_at:when},r.data));loadChecks(false);}catch(e){msg.textContent=e.message;}};
      it.append(b);box.append(it);});
  }
  if(TCH&&document.getElementById('chklist')){
    document.getElementById('chkload').onclick=()=>loadChecks(true);
    const t=document.querySelector('.sec[data-p="check"]');if(t)t.addEventListener('click',()=>{if(t.classList.contains('on'))loadChecks(true);});
    loadChecks(false);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')loadChecks(false);});
  }
  /* старые работы, присланные кодом */
  const cb=document.getElementById('chkbtn');
  if(cb)cb.onclick=async()=>{const m=document.getElementById('chkmsg');try{const o=await KS.unpack(document.getElementById('chkcode').value);
      openWork(o.page,o.data);m.textContent='Открыта работа от '+(o.data._at||'')+'.';}
    catch(e){m.textContent='Не получилось открыть код: '+e.message;}};
  window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data==='ege-home')close();});
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('main a[href], .sitemenu a[href]');if(!a)return;
    const u=new URL(a.href,location.href);if(u.origin!==location.origin||/index\.html$/.test(u.pathname)||!/\.html$/.test(u.pathname))return;
    e.preventDefault();open(u.pathname.split('/').pop()+u.search+u.hash);});
})();
