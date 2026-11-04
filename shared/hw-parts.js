/* Отправка домашки по частям.
   Ученица делает домашку постепенно: готовые задания можно отправить, не дожидаясь конца.
   – На каждое задание одна попытка: после отправки оно закрывается.
   – После отправки ученица видит только число ошибок, а не где и какие.
   – Каждая часть уходит учителю отдельной записью «страница~p1», «страница~p2»…
     В записи лежит весь снимок ответов на этот момент (_parts: номер части, что отправлено, ошибки).
   – Нет интернета: часть сохраняется и уходит сама, когда связь появится.

   Страница подключает так:
     const P=HWParts.make({id:'rita-ege:home1', testId:'rita-ege:home1', title:'Рита · Домашняя часть', lang:'ru',
        units:()=>[{id:'l1',label:'Аудирование 1',done:true|false,errors:число|null}, …],   // errors:null – проверяет учитель
        snapshot:()=>({…все ответы…}), onUpdate:()=>перерисовать, legacySent:()=>работа уже отправлена целиком, disabled:сайт учителя})
     P.isSent(id)  – задание закрыто;  P.refresh() – обновить кнопку;  P.bar(()=>id текущего задания) – готовая панель с кнопкой. */
window.HWParts=(function(){
  const DB='https://lzxcmrlubhjfdhtqvqzt.supabase.co',KEY='sb_publishable_PmyZRwzWne8lqprej4XJQA_XiujtjEI';
  const H={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'};
  const PRE='hw-parts:';
  const now=()=>new Date().toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
  const L={
    ru:{send:'Отправить сделанное',sendN:n=>'Отправить сделанное ('+n+')',made:(d,t)=>'Сделано '+d+' из '+t,sent:s=>'отправлено '+s,
      err:n=>'ошибок: '+n,thisSent:'Это задание отправлено',thisErr:n=>'Это задание отправлено · ошибок: '+n,thisTeacher:'Это задание отправлено · проверит учитель',shortThis:n=>'✓ здесь ошибок: '+n,totalErr:n=>'всего ошибок: '+n,shortTeacher:'✓ проверит учитель',
      ask:'Отправить сделанное?',askBody:ls=>'Сейчас уйдут: <b>'+ls.join(', ')+'</b>.<br>На каждое задание одна попытка: после отправки ответы изменить нельзя. Остальные задания можно доделать и отправить позже.',
      cancel:'Отмена',go:'Отправить',ok:'Отправлено',okBody:(e,m)=>'Учитель уже видит эти задания.'+(e!=null?' Ошибок: <b>'+e+'</b>.':'')+(m?' Письменные задания проверит учитель.':'')+' Какие именно ошибки, покажет учитель.',
      wait:'Сохранено',waitBody:'Сейчас нет интернета. Работа сохранена в этом браузере и уйдёт учителю сама, как только связь появится.',
      close:'Готово',allDone:'✓ Всё отправлено учителю',allErr:n=>' · ошибок всего: '+n,allTeacher:' · письменное проверит учитель',pending:'Отправляется… (ждёт интернет)',teacherNote:'На сайте учителя работа не отправляется.'},
    en:{send:'Send finished tasks',sendN:n=>'Send finished tasks ('+n+')',made:(d,t)=>'Done '+d+' of '+t,sent:s=>'sent '+s,
      err:n=>'mistakes: '+n,thisSent:'This task is sent',thisErr:n=>'This task is sent · mistakes: '+n,thisTeacher:'This task is sent · your teacher will check it',shortThis:n=>'✓ here: '+n+' mistakes',totalErr:n=>'mistakes in total: '+n,shortTeacher:'✓ teacher checks it',
      ask:'Send finished tasks?',askBody:ls=>'Going to your teacher now: <b>'+ls.join(', ')+'</b>.<br>You have one try for each task: after sending you cannot change the answers. You can finish the other tasks and send them later.',
      cancel:'Cancel',go:'Send',ok:'Sent',okBody:(e,m)=>'Your teacher can see these tasks.'+(e!=null?' Mistakes: <b>'+e+'</b>.':'')+(m?' Your teacher will check the writing.':'')+' Your teacher will show you which ones.',
      wait:'Saved',waitBody:'There is no internet now. Your work is saved in this browser and will go to your teacher by itself when you are online.',
      close:'OK',allDone:'✓ All sent to your teacher',allErr:n=>' · mistakes in total: '+n,allTeacher:' · your teacher checks the writing',pending:'Sending… (waiting for internet)',teacherNote:'Nothing is sent from the teacher site.'}
  };
  /* ---------- отправка ---------- */
  async function post(tid,title,answers){
    const r=await fetch(DB+'/rest/v1/rpc/submit_arina_homework',{method:'POST',headers:H,body:JSON.stringify({
      p_test_id:tid,p_test_title:title,p_score:1,p_max_score:1,p_answers:answers||{},p_details:[]})});
    if(!r.ok)throw new Error('submit_failed');return true}
  const load=k=>{try{return JSON.parse(localStorage.getItem(PRE+k)||'null')}catch(e){return null}};
  const save=(k,r)=>{try{localStorage.setItem(PRE+k,JSON.stringify(r))}catch(e){}};
  let flushing=false;
  async function flush(){
    if(flushing)return;flushing=true;
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k.indexOf(PRE)!==0)continue;
      const rec=load(k.slice(PRE.length));if(!rec||!rec.rows)continue;let ch=false;
      for(const row of rec.rows){if(!row.pending)continue;try{await post(row.tid,row.title,row.payload);row.pending=false;row.payload=null;ch=true}catch(e){}}
      if(ch){save(k.slice(PRE.length),rec);window.dispatchEvent(new Event('hwparts-flushed'))}}}catch(e){}
    flushing=false}
  window.addEventListener('online',flush);window.addEventListener('load',()=>setTimeout(flush,1500));

  const st=document.createElement('style');
  st.textContent='.hwpbar{display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;font:600 15px/1.3 Inter,system-ui,sans-serif;color:#2b3a4f}'+
   '.hwpbtn{font:800 15px Inter,system-ui,sans-serif;background:#3f7f67;color:#fff;border:0;border-radius:10px;padding:9px 14px;cursor:pointer}.hwpbtn:disabled{background:#b9c7c0;cursor:default}'+
   '.hwpnote{color:#51647c;font-weight:600}.hwpok{display:inline-flex;align-items:center;gap:6px;font-weight:800;color:#1e6b4a;background:#e8f5ef;border:1px solid #b9dcc9;border-radius:10px;padding:6px 12px}'+
   '.hwpc{flex-wrap:nowrap;white-space:nowrap;font-size:14.5px}.hwpc .hwpbtn{padding:6px 11px}.tab.sent{background:#e8f5ef!important;border-color:#b9dcc9!important;color:#1e6b4a!important}'+
   '.hwpwait{color:#8a5a00;background:#fff4e0;border-color:#e8c98c}.hwpthis{font-weight:800;color:#1e6b4a}'+
   '.hwpov{position:fixed;inset:0;z-index:10000;background:rgba(20,33,61,.35);display:flex;align-items:center;justify-content:center;padding:16px}'+
   '.hwpbox{background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(20,33,61,.25);padding:18px 20px;max-width:520px;width:100%;display:flex;flex-direction:column;gap:10px;font:16px/1.45 Inter,system-ui,sans-serif;color:#1d2b3f}'+
   '.hwpbox h4{margin:0;font-size:19px}.hwpbox p{margin:0}.hwprow{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}'+
   '.hwpbox button{font:700 15px Inter,system-ui,sans-serif;border-radius:10px;padding:9px 14px;border:1px solid #c9d3df;background:#fff;color:#1d2b3f;cursor:pointer}.hwpbox button.go{background:#3f7f67;border-color:#3f7f67;color:#fff}';
  document.head.appendChild(st);

  function make(o){
    const T=L[o.lang==='en'?'en':'ru'],K=o.id;
    let rec=load(K)||{sent:{},rows:[],n:0};
    const bars=[];
    const units=()=>{let u=[];try{u=o.units()||[]}catch(e){}return u};
    const legacy=()=>{try{return !!(o.legacySent&&o.legacySent())}catch(e){return false}};
    const isSent=id=>legacy()||!!rec.sent[id];
    const errOf=id=>rec.sent[id]?rec.sent[id].err:null;
    const sentCount=()=>units().filter(u=>isSent(u.id)).length;
    const ready=()=>units().filter(u=>u.done&&!isSent(u.id));
    const allSent=()=>{const u=units();return u.length>0&&u.every(x=>isSent(x.id))};
    const hasPending=()=>rec.rows.some(r=>r.pending);
    function totals(){let e=0,m=false;units().forEach(u=>{const s=rec.sent[u.id];if(!s)return;if(s.err==null)m=true;else e+=s.err});return {e,m}}
    function box(title,html,btns){const ov=document.createElement('div');ov.className='hwpov';const b=document.createElement('div');b.className='hwpbox';
      const h=document.createElement('h4');h.textContent=title;b.appendChild(h);const p=document.createElement('p');p.innerHTML=html;b.appendChild(p);
      const r=document.createElement('div');r.className='hwprow';btns.forEach(x=>r.appendChild(x));b.appendChild(r);ov.appendChild(b);
      ov.onclick=e=>{if(e.target===ov)ov.remove()};document.body.appendChild(ov);return ov}
    function btn(t,fn,cls){const b=document.createElement('button');b.type='button';b.textContent=t;if(cls)b.className=cls;b.onclick=fn;return b}
    async function doSend(ids){
      const us=units(),errs={},part=rec.n+1;
      ids.forEach(id=>{const u=us.find(x=>x.id===id);const e=u&&typeof u.errors==='number'?u.errors:null;errs[id]=e;rec.sent[id]={at:now(),err:e}});
      rec.n=part;
      const all=Object.keys(rec.sent),total=us.length;
      let snap={};try{snap=o.snapshot()||{}}catch(e){}
      const payload=Object.assign({},snap,{_parts:{k:part,ids:ids.slice(),all:all,total:total,err:errs,final:all.length>=total},_at:now()});
      const row={k:part,tid:o.testId+'~p'+part,title:o.title+' · часть '+part+' ('+all.length+'/'+total+')',payload:payload,pending:true};
      rec.rows.push(row);save(K,rec);
      try{await post(row.tid,row.title,payload);row.pending=false;row.payload=null}catch(e){}
      save(K,rec);
      const tt=totals(),ps=ids.some(id=>errs[id]==null);
      let e=0;ids.forEach(id=>{if(errs[id]!=null)e+=errs[id]});
      box(row.pending?T.wait:T.ok,row.pending?T.waitBody:T.okBody(ids.some(id=>errs[id]!=null)?e:null,ps),[btn(T.close,function(){this.closest('.hwpov').remove()},'go')]);
      refresh();try{o.onUpdate&&o.onUpdate(ids)}catch(e){}}
    function send(){
      const r=ready();if(!r.length)return;
      const ov=box(T.ask,T.askBody(r.map(u=>u.label)),[btn(T.cancel,()=>ov.remove()),btn(T.go,()=>{ov.remove();doSend(r.map(u=>u.id))},'go')])}
    function draw(el,cur,compact){
      el.innerHTML='';
      if(o.disabled){const s=document.createElement('span');s.className='hwpnote';s.textContent=T.teacherNote;el.appendChild(s);return}
      const us=units(),done=us.filter(u=>u.done||isSent(u.id)).length,tt=totals();
      if(allSent()){const s=document.createElement('span');s.className='hwpok'+(hasPending()?' hwpwait':'');
        s.textContent=hasPending()?T.pending:T.allDone+(legacy()?'':(tt.m?T.allTeacher:'')+(tt.e||!tt.m?T.allErr(tt.e):''));
        if(legacy())s.textContent=T.allDone;el.appendChild(s);return}
      const b=document.createElement('button');b.type='button';b.className='hwpbtn';const n=ready().length;
      b.textContent=T.sendN(n);b.disabled=!n;b.onclick=send;el.appendChild(b);
      const s=document.createElement('span');s.className='hwpnote';
      const sc=sentCount();
      s.textContent=compact?(done+'/'+us.length+(sc&&!(tt.m&&!tt.e)?' · '+T.totalErr(tt.e):'')):T.made(done,us.length)+(sc?' · '+T.sent(sc)+(tt.m&&!tt.e?'':' · '+T.err(tt.e)):'');
      s.title=T.made(done,us.length)+(sc?' · '+T.sent(sc):'');
      el.appendChild(s);
      const id=cur&&cur();if(id&&rec.sent[id]){const t=document.createElement('span');t.className='hwpthis';const e=rec.sent[id].err;t.textContent=compact?(e==null?T.shortTeacher:T.shortThis(e)):(e==null?T.thisTeacher:T.thisErr(e));el.appendChild(t)}
    }
    function refresh(){bars.forEach(x=>{if(x.el.isConnected)draw(x.el,x.cur,x.compact)});for(let i=bars.length-1;i>=0;i--)if(!bars[i].el.isConnected&&bars[i].seen)bars.splice(i,1)}
    function bar(cur,opts){const el=document.createElement('div');el.className='hwpbar'+(opts&&opts.compact?' hwpc':'');const x={el:el,cur:cur,compact:!!(opts&&opts.compact),seen:false};bars.push(x);draw(el,cur,x.compact);
      setTimeout(()=>{x.seen=true},0);return el}
    window.addEventListener('hwparts-flushed',()=>{rec=load(K)||rec;refresh()});
    return {isSent,errOf,ready,sentCount,allSent,send,bar,refresh,totals,rec:()=>rec}
  }
  return {make,flush,post}
})();
