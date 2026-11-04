/* «Выполнено → закрыто». Общий модуль для сайтов учеников.
   Идея: когда ученик отправил домашку учителю, на его сайте она закрывается (на хабе и на самой странице),
   а учитель, зайдя на сайт, сразу видит, что сделано («✓ Done»), а что ещё нет («To do»).

   Откуда модуль знает, что домашка отправлена:
   1) из базы (get_arina_done – список отправленных работ, пароль не нужен) → видно с любого устройства,
      в том числе с компьютера учителя;
   2) из отметок в браузере ученика (hw-sent:*, katya-sent-*, rita-sent-*, maya-sent-*) → работает даже без интернета.

   Всегда открыто (не закрывается никогда): карточки и устная часть ЕГЭ/ОГЭ. Для этого у страницы есть keep (см. ниже),
   а на хабе такие пункты просто не получают id.

   Учитель: если в этом браузере когда-то вводился пароль учителя (arina-teacher-code), работа помечается «Done»,
   но остаётся кликабельной – её можно открыть и посмотреть.

   Использование:
     Хаб:      HWLock.hub([{sel:'a[href*="lesson-9-homework"]', id:'gabi:gabi-hw-2026-11-04', card:'.card'}])
               (id работы = префикс ученика + ':' + страница: gabi:…, nikita:…, kate:…, maya:…, katya-ege:…, rita-ege:…)
     Страница: HWLock.page({id:'nikita:2026-10-25', home:'index.html', keep:'#fcard'})
               keep – CSS-селектор того, что остаётся открытым после отправки (карточки, устная часть); можно не указывать.
     Динамический хаб (карточки рисуются скриптом): HWLock.hub(()=>[...]) – функция вызывается при каждой перерисовке,
               HWLock.refresh() – перерисовать вручную. */
window.HWLock=(function(){
  const DB='https://lzxcmrlubhjfdhtqvqzt.supabase.co',KEY='sb_publishable_PmyZRwzWne8lqprej4XJQA_XiujtjEI';
  const H={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'};
  const LS=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
  const isTeacher=()=>!!LS('arina-teacher-code');

  /* ---------- что уже отправлено ---------- */
  const PFX={katya:'katya-ege:',rita:'rita-ege:',maya:'maya:'};
  function localIds(){
    const ids=new Set();
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';let m;
      if(k.indexOf('hw-sent:')===0){const v=LS(k);if(v&&v!=='null')ids.add(k.slice(8));}
      else if((m=k.match(/^(katya|rita|maya)-sent-(.+)$/))){const v=LS(k);if(v&&v!=='null')ids.add(PFX[m[1]]+m[2]);}}}catch(e){}
    return ids}
  let remoteP=null;
  const idOf=x=>typeof x==='string'?x:(x&&x.test_id)||'';
  async function rpc(name,body,ms){
    const ctl=typeof AbortController==='function'?new AbortController():null,tm=ctl?setTimeout(()=>ctl.abort(),ms||6000):0;
    try{const r=await fetch(DB+'/rest/v1/rpc/'+name,{method:'POST',headers:H,body:JSON.stringify(body||{}),signal:ctl?ctl.signal:undefined});
      if(!r.ok)return [];const d=await r.json();return Array.isArray(d)?d:[]}
    catch(e){return []}finally{if(tm)clearTimeout(tm)}}
  function remote(){
    if(remoteP)return remoteP;
    remoteP=(async()=>{
      try{const raw=sessionStorage.getItem('hw-done-cache');if(raw){const o=JSON.parse(raw);if(Date.now()-o.t<20000)return new Set(o.ids)}}catch(e){}
      /* общий список отправленного (пароль не нужен) + у учителя ещё и «Входящие» (по паролю) */
      const code=LS('arina-teacher-code');
      const [a,b]=await Promise.all([rpc('get_arina_done'),code?rpc('get_arina_homework',{p_teacher_code:code}):Promise.resolve([])]);
      const ids=[...a,...b].map(idOf).filter(Boolean);
      if(ids.length)try{sessionStorage.setItem('hw-done-cache',JSON.stringify({t:Date.now(),ids:ids}))}catch(e){}
      return new Set(ids)})();
    return remoteP}
  async function ready(){const a=await remote(),b=localIds();return new Set([...a,...b])}
  /* вызвать сразу после отправки: сбросить кэш, чтобы замок появился без ожидания */
  function forget(){remoteP=null;try{sessionStorage.removeItem('hw-done-cache')}catch(e){}}

  /* ---------- оформление ---------- */
  const css=document.createElement('style');
  css.textContent=
    '.hwl-closed{opacity:.72;filter:saturate(.5)}'+
    '.hwl-closed.hwl-student a[data-hw-link]:not([data-hw-cards]){pointer-events:none;cursor:not-allowed;background:#9aa3a0!important;border-color:#9aa3a0!important;color:#fff!important;box-shadow:none!important}'+
    'button.hwl-closed.hwl-student:not([data-hw-cards]),a.hwl-closed.hwl-student:not([data-hw-cards]){pointer-events:none;cursor:not-allowed}'+
    '.hwl-badge{display:inline-flex;align-items:center;gap:6px;font:800 13px/1.2 Inter,system-ui,Arial,sans-serif;border-radius:9px;padding:5px 10px;margin:4px 8px 4px 0;white-space:nowrap;vertical-align:middle}'+
    '.hwl-badge.done{color:#1e6b4a;background:#e8f5ef;border:1px solid #b9dcc9}'+
    '.hwl-badge.todo{color:#8a5a00;background:#fff4e0;border:1px solid #e8c98c}'+
    '.hwl-hide{display:none!important}.hwl-keepshow{display:block!important}'+
    '.hwl-banner{position:sticky;top:0;z-index:2147482000;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;background:#e8f5ef;color:#1e6b4a;border-bottom:2px solid #b9dcc9;padding:12px 16px;font:800 16px/1.35 Inter,system-ui,Arial,sans-serif;text-align:center}'+
    '.hwl-banner a{color:#fff;background:#1e8f5f;text-decoration:none;border-radius:10px;padding:8px 14px}'+
    '.hwl-closedscr{max-width:560px;margin:12vh auto;padding:28px 24px;background:#fff;border:1px solid #b9dcc9;border-radius:18px;text-align:center;font:800 20px/1.4 Inter,system-ui,Arial,sans-serif;color:#1e6b4a;box-shadow:0 12px 34px rgba(0,0,0,.12)}'+
    '.hwl-closedscr p{margin:8px 0 18px;font-weight:600;font-size:16px;color:#3d4f48}'+
    '.hwl-closedscr a{display:inline-block;color:#fff;background:#1e8f5f;text-decoration:none;border-radius:12px;padding:11px 20px;font-size:16px}';
  document.head.appendChild(css);
  const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};

  /* ---------- хаб: закрыть выполненное, пометить «To do» ---------- */
  let hubSrc=null,hubTimer=0;
  let uidN=0;
  function paint(items,done,final){
    const T=isTeacher();
    items.forEach(it=>{
      const sel=it.sel||('[data-hw-id="'+it.id+'"]');
      document.querySelectorAll(sel).forEach(a=>{
        /* card – то, что серится/закрывается: по умолчанию родитель ссылки; card:'.селектор' – ближайший такой предок;
           card:'self' – сама ссылка. Если карточка и есть сама ссылка (или это <button>), текст внутри не переписываем. */
        const card=a.tagName==='BUTTON'||it.card==='self'?a:(it.card?(a.closest(it.card)||a):a.parentElement);   /* card указан, но предка нет → сама ссылка */
        const inline=card===a;
        const isDone=!!it.always||done.has(it.id);
        const was=a.dataset.hwState;
        const state=isDone?'done':'todo';
        if(was===state)return;
        if(!isDone&&!final&&was==null)return;   /* пока база не ответила, «To do» не рисуем */
        const uid=a.dataset.hwUid||(a.dataset.hwUid=String(++uidN));
        a.dataset.hwState=state;a.setAttribute('data-hw-link','1');
        if(card)card.dataset.hwState=state;
        document.querySelectorAll('.hwl-badge[data-hw-for="'+uid+'"]').forEach(b=>b.remove());
        const badge=(cls,txt)=>{const b=el('span','hwl-badge '+cls,txt);b.dataset.hwFor=uid;
          if(inline){(a.tagName==='BUTTON'&&a.firstElementChild?a.firstElementChild:a).appendChild(b)}else a.insertAdjacentElement('beforebegin',b)};
        if(!isDone){
          if(a.dataset.hwHref!=null){if(a.tagName!=='BUTTON')a.setAttribute('href',a.dataset.hwHref);a.removeAttribute('aria-disabled');if(a.dataset.hwText!=null)a.innerHTML=a.dataset.hwText}
          delete a.dataset.hwCards;
          if(card)card.classList.remove('hwl-closed','hwl-student');
          if(it.todo!==false)badge('todo','To do');
          return}
        if(a.dataset.hwHref==null){a.dataset.hwHref=a.getAttribute('href')||'';if(!inline)a.dataset.hwText=a.innerHTML}
        if(card){card.classList.add('hwl-closed');if(!T)card.classList.add('hwl-student')}
        if(T){badge('done','✓ Done · teacher');return}
        if(it.cards){a.dataset.hwCards='1';if(!inline)a.innerHTML=it.cardsText||'Cards only →';badge('done','✓ Done · cards open');return}
        if(a.tagName!=='BUTTON'){a.setAttribute('href','#');a.removeAttribute('target');if(!inline)a.innerHTML=it.closedText||'Closed'}
        a.setAttribute('aria-disabled','true');
        badge('done','✓ Done · sent');
      })})}
  let lastDone=null,mo=null;
  function observe(){
    try{if(!mo)mo=new MutationObserver(()=>{clearTimeout(hubTimer);hubTimer=setTimeout(refresh,150)});
      mo.observe(document.body,{childList:true,subtree:true})}catch(e){}}
  function paintSafe(items,done,final){            /* наши же правки не должны будить наблюдателя */
    if(mo)mo.disconnect();
    try{paint(items,done,final)}finally{observe()}}
  async function refresh(){
    if(!hubSrc)return;const items=typeof hubSrc==='function'?hubSrc():hubSrc;
    paintSafe(items,lastDone||localIds(),!!lastDone);
    const done=await ready();lastDone=done;
    paintSafe(items,done,true)}
  /* нажатие по закрытой кнопке ничего не открывает (ловим раньше, чем скрипты хаба) */
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('[data-hw-link]');
    if(a&&a.dataset.hwState==='done'&&!a.dataset.hwCards&&!isTeacher()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);
  function hub(src){
    hubSrc=src;observe();refresh();
    window.addEventListener('pageshow',e=>{if(e.persisted){forget();lastDone=null;refresh()}})}

  /* ---------- страница домашки: если уже отправлена – закрыть ---------- */
  function isolate(keepEls){
    const path=new Set();keepEls.forEach(k=>{let n=k;while(n&&n!==document.body){path.add(n);n=n.parentElement}});
    (function walk(n){[...n.children].forEach(c=>{
      if(/^(SCRIPT|STYLE|LINK|META)$/.test(c.tagName)||c.classList.contains('hwl-banner')||c.id==='page-label')return;
      if(keepEls.indexOf(c)>=0)return;
      if(path.has(c))walk(c);else c.classList.add('hwl-hide')})})(document.body)}
  /* Страницы с игровым движком (skills.js и др.) сами перерисовывают body уже после загрузки –
     поэтому «закрытое» состояние накладывается заново, пока страница не успокоится. */
  let pageOpts=null,pageMO=null,pageTimer=0;
  function applyClosed(){
    const o=pageOpts;if(!o)return;
    if(pageMO)pageMO.disconnect();
    try{
      const links=(o.links||[]).map(l=>'<a href="'+l.href+'">'+l.label+'</a>').join(' ');
      const home=o.home===false?'':(o.home||'index.html');
      const homeLink=home?'<a href="'+home+'">Back to homework</a> ':'';
      document.documentElement.classList.add('hwl-page-closed');
      if(isTeacher()){
        if(!document.querySelector('.hwl-banner'))document.body.insertBefore(el('div','hwl-banner','✓ Done · this homework was sent to the teacher'),document.body.firstChild);
      }else{
        let keep=[];try{keep=o.keep?[...document.querySelectorAll(o.keep)]:[]}catch(e){}
        if(keep.length){
          isolate(keep);
          keep.forEach(k=>{try{if(getComputedStyle(k).display==='none')k.classList.add('hwl-keepshow')}catch(e){}});
          (o.hide||[]).forEach(q=>{try{document.querySelectorAll(q).forEach(x=>x.classList.add('hwl-hide'))}catch(e){}});
          if(o.css&&!document.getElementById('hwl-page-css')){const st=el('style');st.id='hwl-page-css';st.textContent=o.css;document.head.appendChild(st)}   /* css – прячет то, что страница рисует заново (кнопки «дальше» и т.п.) */
          if(o.onClose&&!o._called){o._called=1;try{o.onClose()}catch(e){}}   /* onClose – страница может отключить свою навигацию, чтобы из карточек нельзя было уйти в закрытое */
          if(!document.querySelector('.hwl-banner'))document.body.insertBefore(el('div','hwl-banner','✓ Done · closed. Your cards are still open. '+homeLink+links),document.body.firstChild);
        }else{
          [...document.body.children].forEach(c=>{if(!/^(SCRIPT|STYLE|LINK)$/.test(c.tagName)&&c.id!=='page-label'&&!c.classList.contains('hwl-closedscr'))c.classList.add('hwl-hide')});
          if(!document.querySelector('.hwl-closedscr'))document.body.appendChild(el('div','hwl-closedscr','✓ Done<p>This homework was sent to your teacher, so it is closed.'+(links?' Your cards are still open:':'')+'</p>'+homeLink+links));
        }
      }
    }finally{
      try{if(!pageMO)pageMO=new MutationObserver(()=>{clearTimeout(pageTimer);pageTimer=setTimeout(applyClosed,60)});
        pageMO.observe(document.body,{childList:true})}catch(e){}}}
  function closePage(o){pageOpts=o;
    if(document.body)applyClosed();
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyClosed);
    window.addEventListener('load',applyClosed)}
  /* сначала смотрим отметки в браузере (мгновенно), потом базу */
  async function page(o){
    if(localIds().has(o.id)){closePage(o);return true}
    const done=await ready();
    if(done.has(o.id)){closePage(o);return true}
    return false}

  return {ready,forget,hub,refresh,page,isTeacher,localIds}
})();
