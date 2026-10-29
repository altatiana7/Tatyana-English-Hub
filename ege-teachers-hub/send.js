/* «Отправить учителю на проверку»: одна попытка, ответы не показываются.
   Работа уходит учителю сразу (как у Арины) – без кода и без чата.
   Учитель видит её на своём сайте: Teacher's Hub ЕГЭ → «Проверка домашки».
   Если в момент отправки нет интернета, работа ждёт в браузере и уходит сама, как только связь появится. */
window.KS=(function(){
  const T=!!window.TEACHER,PFX='katya-ege:';
  const DB='https://lzxcmrlubhjfdhtqvqzt.supabase.co',KEY='sb_publishable_PmyZRwzWne8lqprej4XJQA_XiujtjEI';
  const H={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'};
  const TITLE={mock1:'Пробник ЕГЭ 2027 · Вариант 1 · Аудирование 3–9',home1:'Диагностика · домашняя часть',lesson1:'Диагностика · тест',lessonw1:'Занятие 1 · Error hunter и Match'};
  const now=()=>new Date().toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});

  /* ---------- отправка в базу ---------- */
  async function submit(page,data){
    const r=await fetch(DB+'/rest/v1/rpc/submit_arina_homework',{method:'POST',headers:H,body:JSON.stringify({
      p_test_id:PFX+page,p_test_title:'Катя · '+(TITLE[page]||page),p_score:1,p_max_score:1,p_answers:data||{},p_details:[]})});
    if(!r.ok)throw new Error('submit_failed');return true;}

  /* одна попытка: отметка об отправке хранится в браузере ученицы */
  const SK=p=>'katya-sent-'+p;
  function sent(p){if(T)return null;try{return JSON.parse(localStorage.getItem(SK(p))||'null');}catch(e){return null;}}
  function markSent(p,o){try{localStorage.setItem(SK(p),JSON.stringify(o));}catch(e){}}
  /* работы, которые не ушли из-за интернета, досылаются сами */
  let flushing=false;
  async function flush(){if(T||flushing)return;flushing=true;
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k.indexOf('katya-sent-')!==0)continue;
      const p=k.slice(11),o=sent(p);if(!o||!o.pending)continue;
      try{await submit(p,o.data);o.pending=false;markSent(p,o);document.querySelectorAll('[data-ks="'+p+'"]').forEach(x=>x.replaceWith(doneBtn(p)));}catch(e){}}}
    catch(e){}flushing=false;}
  if(!T){window.addEventListener('online',flush);window.addEventListener('load',()=>setTimeout(flush,1200));}

  /* сайт учителя: работа, открытая из «Проверки домашки» */
  function review(p){if(!T)return null;try{const o=JSON.parse(sessionStorage.getItem('katya-review')||'null');if(o&&o.page===p){sessionStorage.removeItem('katya-review');return o;}}catch(e){}return null;}

  /* сайт учителя: список работ Кати из базы */
  async function list(ask){
    let code='';try{code=localStorage.getItem('arina-teacher-code')||'';}catch(e){}
    if(!code&&ask){code=(prompt('Пароль учителя к результатам (тот же, что для работ Арины):')||'').trim();if(code)try{localStorage.setItem('arina-teacher-code',code);}catch(e){}}
    if(!code)return {need:true};
    const r=await fetch(DB+'/rest/v1/rpc/get_arina_homework',{method:'POST',headers:H,body:JSON.stringify({p_teacher_code:code})});
    if(r.status===400||r.status===401||r.status===403){try{localStorage.removeItem('arina-teacher-code');}catch(e){}return {need:true,bad:true};}
    if(!r.ok)throw new Error('load_failed');
    const rows=(await r.json()||[]).filter(x=>String(x&&x.test_id||'').indexOf(PFX)===0)
      .map(x=>({id:String(x.id||x.created_at),page:x.test_id.slice(PFX.length),title:TITLE[x.test_id.slice(PFX.length)]||x.test_title,at:x.created_at,data:x.answers||{}}))
      .sort((a,b)=>new Date(b.at)-new Date(a.at));
    return {rows};}

  /* старые работы, присланные кодом до перехода на прямую отправку */
  const unb64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;};
  async function pipe(u8,Stream,fmt){const s=new Blob([u8]).stream().pipeThrough(new Stream(fmt));return new Uint8Array(await new Response(s).arrayBuffer());}
  async function unpack(code){const m=String(code||'').replace(/\s+/g,'').match(/KATYA-EGE:([a-z0-9]+):([zj])([A-Za-z0-9_-]+)/);
    if(!m)throw new Error('Это не код работы.');let u=unb64(m[3]);
    if(m[2]==='z'){if(!window.DecompressionStream)throw new Error('Браузер не умеет открывать код – откройте в Chrome.');u=await pipe(u,DecompressionStream,'deflate-raw');}
    return {page:m[1],data:JSON.parse(new TextDecoder().decode(u))};}

  const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
  const st=mk('style');st.textContent='.ksov{position:fixed;inset:0;z-index:300;background:rgba(29,58,52,.35);display:flex;align-items:center;justify-content:center;padding:16px}'+
    '.ksbox{background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(29,58,52,.25);padding:18px 20px;max-width:520px;width:100%;display:flex;flex-direction:column;gap:10px;font-size:16px;line-height:1.45}'+
    '.ksbox h4{margin:0;font-size:19px}.ksbox p{margin:0}'+
    '.ksrow{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.kssend{background:#d62f7f!important;border-color:#d62f7f!important;color:#fff!important}'+
    '.ksdone{display:inline-flex;align-items:center;gap:6px;font-size:14.5px;font-weight:700;color:#1e6b4a;background:#e8f5ef;border:1px solid #b9dcc9;border-radius:10px;padding:5px 10px;cursor:default}'+
    '.kswait{color:#8a5a00;background:#fff4e0;border-color:#e8c98c}'+
    '.ksrev{background:#fff4e0;border:1px solid #e8c98c;border-radius:12px;padding:7px 12px;font-size:15px;color:#6d4b00;margin:0 0 6px}';
  document.head.append(st);
  function box(title,html,buttons){const ov=mk('div','ksov'),b=mk('div','ksbox');b.append(mk('h4',null,title));if(html)b.insertAdjacentHTML('beforeend',html);
    const r=mk('div','ksrow');buttons.forEach(x=>r.append(x));b.append(r);ov.append(b);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);return {ov,b};}
  function bt(text,fn,cls){const x=mk('button','btn'+(cls?' '+cls:''),text);x.type='button';x.onclick=fn;return x;}
  function doneBtn(p){const o=sent(p)||{};const x=mk('span','ksdone'+(o.pending?' kswait':''),o.pending?'Отправляется… (ждёт интернет)':'✓ Отправлено учителю'+(o.at?' · '+o.at:''));
    if(o.pending)x.dataset.ks=p;x.title=o.pending?'Работа сохранена и уйдёт сама, как только появится интернет':'Работа у учителя. Отправить можно один раз.';return x;}
  /* другая попытка с другого устройства: если работа уже в базе, кнопку закрываем */
  async function remoteSent(p){try{const r=await fetch(DB+'/rest/v1/rpc/get_arina_done',{method:'POST',headers:H,body:'{}'});if(!r.ok)return false;
    const d=await r.json();return Array.isArray(d)&&d.some(x=>x&&x.test_id===PFX+p);}catch(e){return false;}}

  /* кнопка «Отправить учителю на проверку». getData – ответы страницы; onSent – закрыть ответы на странице */
  function button(page,getData,onSent){
    if(T){const x=mk('span','note','На сайте учителя работа не отправляется.');return x;}
    if(sent(page))return doneBtn(page);
    const b=bt('Отправить учителю на проверку',()=>{
      const m=box('Отправить работу учителю?','<p>Отправить можно <b>один раз</b>. После отправки ответы изменить нельзя, правильные ответы покажет учитель.</p>',
        [bt('Отмена',()=>m.ov.remove()),bt('Отправить',async()=>{m.ov.remove();
          const data=getData()||{};const at=now();data._at=at;const o={at,data,pending:true};markSent(page,o);
          let ok=false;try{ok=await submit(page,data);}catch(e){}
          o.pending=!ok;markSent(page,o);if(onSent)onSent(o);if(b.isConnected)b.replaceWith(doneBtn(page));
          const f=box(ok?'Работа отправлена':'Работа сохранена',ok?'<p>Учитель уже видит твою работу. Больше ничего делать не нужно.</p>':'<p>Сейчас нет связи с интернетом. Работа сохранена в этом браузере и уйдёт учителю сама, как только появится интернет. Просто открой сайт ещё раз позже.</p>',[bt('Готово',()=>f.ov.remove(),'main')]);},'kssend')]);
    },'kssend');
    remoteSent(page).then(y=>{if(y&&b.isConnected&&!sent(page)){markSent(page,{at:'',data:{},pending:false});b.replaceWith(doneBtn(page));}});
    return b;}
  function reviewBar(o){return mk('div','ksrev','<b>Проверка работы ученицы</b> · отправлено '+(o.data&&o.data._at||'')+'. Верные ответы и баллы показаны ниже.');}
  return {T,TITLE,sent,markSent,review,list,unpack,button,reviewBar,flush};
})();
