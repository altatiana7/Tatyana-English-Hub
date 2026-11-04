/* Общая отправка домашки: ученик жмёт «Отправить» -> у него «Готово», у учителя работа появляется в «Входящих» на my-hub.html.
   Та же база, что у Арины, Кати, Риты и Майи (get/submit_arina_homework). Отличие работ разных учеников – префикс в test_id.
   Ученик:  HWSent.submit({student:'gabi',name:'Габи',page:'gabi-hw-2026-11-04',title:'Homework 9',data:{...}})
            HWSent.badge(student,page) -> HTML «Готово» или '' ; HWSent.isSent(student,page) */
window.HWSent=(function(){
  const DB='https://lzxcmrlubhjfdhtqvqzt.supabase.co',KEY='sb_publishable_PmyZRwzWne8lqprej4XJQA_XiujtjEI';
  const H={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'};
  const now=()=>new Date().toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
  const SK=(s,p)=>'hw-sent:'+s+':'+p;
  const get=(s,p)=>{try{return JSON.parse(localStorage.getItem(SK(s,p))||'null')}catch(e){return null}};
  const put=(s,p,o)=>{try{localStorage.setItem(SK(s,p),JSON.stringify(o))}catch(e){}};
  const isSent=(s,p)=>!!get(s,p);
  async function post(o){
    const r=await fetch(DB+'/rest/v1/rpc/submit_arina_homework',{method:'POST',headers:H,body:JSON.stringify({
      p_test_id:o.student+':'+o.page,p_test_title:(o.name||o.student)+' · '+(o.title||o.page),p_score:1,p_max_score:1,p_answers:o.data||{},p_details:[]})});
    if(!r.ok)throw new Error('submit_failed');return true}
  /* отправка: отметка «отправлено» ставится сразу; если нет интернета – работа ждёт и уходит сама */
  async function submit(o){
    const rec={at:now(),pending:true,o:o};put(o.student,o.page,rec);
    try{await post(o);rec.pending=false;put(o.student,o.page,rec)}catch(e){}
    return rec}
  async function flush(){
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k.indexOf('hw-sent:')!==0)continue;
      let rec;try{rec=JSON.parse(localStorage.getItem(k))}catch(e){continue}
      if(rec&&rec.pending&&rec.o){try{await post(rec.o);rec.pending=false;localStorage.setItem(k,JSON.stringify(rec))}catch(e){}}}}catch(e){}}
  window.addEventListener('online',flush);window.addEventListener('load',()=>setTimeout(flush,1500));
  function badge(s,p){const r=get(s,p);if(!r)return '';
    return r.pending?'<span class="hwdone hwwait">Saved · will be sent when you are online</span>'
      :'<span class="hwdone">✓ Done · Готово · sent to teacher'+(r.at?' · '+r.at:'')+'</span>'}
  const st=document.createElement('style');
  st.textContent='.hwdone{display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:15px;color:#1e6b4a;background:#e8f5ef;border:1px solid #b9dcc9;border-radius:10px;padding:6px 12px}.hwwait{color:#8a5a00;background:#fff4e0;border-color:#e8c98c}';
  document.head.appendChild(st);


  /* Для страниц без собственной отправки: плавающая кнопка «Домашка готова». o={student,name,page,title} */
  function doneButton(o){
    const box=document.createElement('div');box.className='hwfloat';
    const draw=()=>{box.innerHTML='';
      if(isSent(o.student,o.page)){box.innerHTML=badge(o.student,o.page);return}
      const b=document.createElement('button');b.type='button';b.className='hwbtn';b.textContent="I'm done · send to teacher";
      b.onclick=async()=>{if(!confirm('Send this homework to your teacher? You can send it only once.'))return;b.disabled=true;
        await submit({student:o.student,name:o.name,page:o.page,title:o.title,data:{done:true,at:now()}});draw()};
      box.appendChild(b)};
    draw();(document.body?Promise.resolve():new Promise(r=>addEventListener('DOMContentLoaded',r))).then(()=>document.body.appendChild(box))}
  const st2=document.createElement('style');
  st2.textContent='.hwfloat{position:fixed;right:14px;bottom:12px;z-index:9999}.hwbtn{font:800 15px Inter,system-ui,sans-serif;background:#1e8f5f;color:#fff;border:0;border-radius:12px;padding:11px 16px;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer}.hwbtn:disabled{opacity:.6}.hwfloat .hwdone{box-shadow:0 6px 18px rgba(0,0,0,.18)}';
  document.head.appendChild(st2);

  /* ---------- сайт учителя ---------- */
  const NAMES={gabi:'Габи',nikita:'Никита',kate:'Катя Д',maya:'Майя',dasha:'Даша',timofey:'Тимофей','rita-ege':'Рита','katya-ege':'Катя','arina':'Арина'};
  async function list(ask){
    let code='';try{code=localStorage.getItem('arina-teacher-code')||''}catch(e){}
    if(!code&&ask){code=(prompt('Пароль учителя к результатам:')||'').trim();if(code)try{localStorage.setItem('arina-teacher-code',code)}catch(e){}}
    if(!code)return {need:true};
    const r=await fetch(DB+'/rest/v1/rpc/get_arina_homework',{method:'POST',headers:H,body:JSON.stringify({p_teacher_code:code})});
    if(r.status===400||r.status===401||r.status===403){try{localStorage.removeItem('arina-teacher-code')}catch(e){}return {need:true,bad:true}}
    if(!r.ok)throw new Error('load_failed');
    const rows=(await r.json()||[]).filter(x=>String(x.test_id||'').indexOf('timofey-oge-hw-')!==0).map(x=>{const id=String(x.test_id||'');const i=id.indexOf(':');
      const student=i>0?id.slice(0,i):'arina';let title=x.test_title||id;const nm=NAMES[student];
      /* в заголовке имя уже есть: «Габи · Homework…», а список добавляет его сам */
      if(nm&&title.indexOf(nm+' · ')===0)title=title.slice(nm.length+3);
      return {key:String(x.id||x.created_at),student:student,page:(i>0?id.slice(i+1):id).split('~p')[0],title:title,at:x.created_at}})
      .sort((a,b)=>new Date(b.at)-new Date(a.at));
    return {rows}}
  const SEEN='hw-seen-keys';
  const seen=()=>{try{return new Set(JSON.parse(localStorage.getItem(SEEN)||'[]'))}catch(e){return new Set()}};
  const markSeen=keys=>{try{const s=seen();keys.forEach(k=>s.add(k));localStorage.setItem(SEEN,JSON.stringify([...s].slice(-500)))}catch(e){}};
  return {submit,isSent,badge,doneButton,flush,list,seen,markSeen,NAMES}
})();
