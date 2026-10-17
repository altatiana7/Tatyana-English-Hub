/* «Отправить учителю на проверку»: одна попытка, ответы не показываются.
   Работа упаковывается в код. Ученица вставляет код в чат с учителем,
   учитель открывает его на своём сайте (КАТЯ ЕГЭ → «Проверка домашки») и видит ответы с проверкой. */
window.KS=(function(){
  const PFX='KATYA-EGE',T=!!window.TEACHER;
  const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
  const unb64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;};
  async function pipe(u8,Stream,fmt){const s=new Blob([u8]).stream().pipeThrough(new Stream(fmt));return new Uint8Array(await new Response(s).arrayBuffer());}
  async function pack(page,data){const raw=new TextEncoder().encode(JSON.stringify(data));
    if(window.CompressionStream){try{return PFX+':'+page+':z'+b64(await pipe(raw,CompressionStream,'deflate-raw'));}catch(e){}}
    return PFX+':'+page+':j'+b64(raw);}
  async function unpack(code){const m=String(code||'').replace(/\s+/g,'').match(/KATYA-EGE:([a-z0-9]+):([zj])([A-Za-z0-9_-]+)/);
    if(!m)throw new Error('Это не код работы.');let u=unb64(m[3]);
    if(m[2]==='z'){if(!window.DecompressionStream)throw new Error('Браузер не умеет открывать код – откройте в Chrome.');u=await pipe(u,DecompressionStream,'deflate-raw');}
    return {page:m[1],data:JSON.parse(new TextDecoder().decode(u))};}
  const now=()=>new Date().toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
  /* одна попытка: отметка об отправке хранится в браузере ученицы */
  const SK=p=>'katya-sent-'+p;
  function sent(p){if(T)return null;try{return JSON.parse(localStorage.getItem(SK(p))||'null');}catch(e){return null;}}
  function markSent(p,o){try{localStorage.setItem(SK(p),JSON.stringify(o));}catch(e){}}
  /* сайт учителя: работа, открытая из «Проверки домашки» */
  function review(p){if(!T)return null;try{const o=JSON.parse(sessionStorage.getItem('katya-review')||'null');if(o&&o.page===p){sessionStorage.removeItem('katya-review');return o;}}catch(e){}return null;}
  function copy(t){if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t).then(()=>true,()=>false);return Promise.resolve(false);}
  const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
  const st=mk('style');st.textContent='.ksov{position:fixed;inset:0;z-index:300;background:rgba(20,33,61,.35);display:flex;align-items:center;justify-content:center;padding:16px}'+
    '.ksbox{background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(20,33,61,.25);padding:18px 20px;max-width:520px;width:100%;display:flex;flex-direction:column;gap:10px;font-size:16px;line-height:1.45}'+
    '.ksbox h4{margin:0;font-size:19px}.ksbox p{margin:0}.ksbox input{width:100%;box-sizing:border-box;font:14px/1.3 monospace;padding:8px;border:1px solid #c9d3e6;border-radius:10px;background:#f7f9fd}'+
    '.ksrow{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.kssend{background:#d62f7f!important;border-color:#d62f7f!important;color:#fff!important}'+
    '.ksdone{display:inline-flex;align-items:center;gap:6px;font-size:14.5px;font-weight:700;color:#1e6b4a;background:#e8f5ef;border:1px solid #b9dcc9;border-radius:10px;padding:5px 10px}'+
    '.ksrev{background:#fff4e0;border:1px solid #e8c98c;border-radius:12px;padding:7px 12px;font-size:15px;color:#6d4b00;margin:0 0 6px}';
  document.head.append(st);
  function box(title,html,buttons){const ov=mk('div','ksov'),b=mk('div','ksbox');b.append(mk('h4',null,title));if(html)b.insertAdjacentHTML('beforeend',html);
    const r=mk('div','ksrow');buttons.forEach(x=>r.append(x));b.append(r);ov.append(b);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);return {ov,b};}
  function bt(text,fn,cls){const x=mk('button','btn'+(cls?' '+cls:''),text);x.type='button';x.onclick=fn;return x;}
  function showCode(o){const close=bt('Готово',()=>m.ov.remove(),'main');
    const m=box('Работа отправлена · '+o.at,'<p>Код скопирован. Откройте чат с учителем, вставьте его (Ctrl + V) и отправьте сообщение.</p>',[bt('Скопировать код ещё раз',()=>copy(o.code).then(ok=>{msg.textContent=ok?'Скопировано.':'Выделите код и скопируйте вручную.';})),close]);
    const inp=mk('input');inp.readOnly=true;inp.value=o.code;inp.onclick=()=>inp.select();const msg=mk('p','note');m.b.insertBefore(inp,m.b.lastChild);m.b.insertBefore(msg,m.b.lastChild);}
  /* кнопка «Отправить учителю на проверку». getData – ответы страницы; onSent – закрыть ответы на странице */
  function button(page,getData,onSent){
    const s=sent(page);
    if(s){const x=bt('✓ Отправлено учителю',()=>showCode(s),'ksdone');x.title='Показать код ещё раз';return x;}
    return bt('Отправить учителю на проверку',()=>{
      const m=box('Отправить работу учителю?','<p>Отправить можно <b>один раз</b>. После отправки ответы изменить нельзя, правильные ответы покажет учитель.</p>',
        [bt('Отмена',()=>m.ov.remove()),bt('Отправить',async()=>{m.ov.remove();const data=getData()||{};const at=now();data._at=at;const code=await pack(page,data);const o={code,at,data};markSent(page,o);await copy(code);if(onSent)onSent(o);showCode(o);},'kssend')]);
    },'kssend');}
  function reviewBar(o){return mk('div','ksrev','<b>Проверка работы ученицы</b> · отправлено '+(o.data&&o.data._at||'')+'. Верные ответы и баллы показаны ниже.');}
  return {T,pack,unpack,sent,markSent,review,button,reviewBar,showCode,copy};
})();
