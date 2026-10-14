/* Правка примерных устных ответов прямо на странице.
   Кнопка «Правка ответов» в верхней панели включает режим правки: текст ответа можно исправить на месте.
   Правки сохраняются в этом браузере и показываются вместо исходного текста везде, где стоит этот ответ.
   Режим правки при каждом открытии страницы выключен. */
const ED=(function(){
  const KEY='ege27-answer-edits',ORIG={};let on=false,last=null,btnTop=null,fileM=null,tools=null,onB=null,cntL=null;
  const load=()=>{try{const o=JSON.parse(localStorage.getItem(KEY)||'{}')||{};Object.keys(o).forEach(k=>{if(k.indexOf('ru.lt.')===0){o[k.slice(3)]=o[k];delete o[k];}});return o;}catch(e){return {};}};
  const save=o=>{try{localStorage.setItem(KEY,JSON.stringify(o));return true;}catch(e){return false;}};
  const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])).replace(/\n/g,'<br>');
  const clean=s=>String(s).replace(/ /g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
  /* текст ответа для вставки в разметку: с правкой, если она есть */
  function t(key,text){ORIG[key]=clean(text);const o=load(),v=o[key]!=null?o[key]:ORIG[key];
    return '<span class="ed'+(o[key]!=null?' edited':'')+'" data-ed="'+key+'"'+(on?' contenteditable="true" spellcheck="true"':'')+'>'+html(v)+'</span>';}
  function sync(key){const o=load(),v=o[key]!=null?o[key]:ORIG[key];document.querySelectorAll('[data-ed="'+key+'"]').forEach(x=>{if(x!==document.activeElement)x.innerHTML=html(v);x.classList.toggle('edited',o[key]!=null);});paintCount();}
  function store(node){const key=node.dataset.ed,v=clean(node.innerText),o=load();if(!v||v===ORIG[key])delete o[key];else o[key]=v;if(!save(o))msg('Браузер не дал сохранить правку');sync(key);}
  function count(){return Object.keys(load()).length;}
  function paintCount(){if(btnTop)btnTop.textContent=on?'Правка: вкл':'Правка';if(cntL)cntL.textContent='Исправлено ответов: '+count();}
  function msg(t){const m=document.createElement('div');m.className='edtoast';m.textContent=t;document.body.append(m);setTimeout(()=>m.remove(),2600);}
  function mark(root){(root||document).querySelectorAll('[data-ed]').forEach(x=>{if(on){x.contentEditable='true';x.spellcheck=true;}else x.removeAttribute('contenteditable');});}
  function toggle(){on=!on;btnTop.hidden=!on;document.body.classList.toggle('editing',on);mark();fileM.hidden=true;btnTop.classList.toggle('main',on);paintCount();if(!on){const a=document.activeElement;if(a&&a.dataset&&a.dataset.ed)a.blur();tools.hidden=true;}}
  /* маленькая панель над ответом, который сейчас правят */
  function placeTools(n){const r=n.getBoundingClientRect();tools.hidden=false;const w=tools.offsetWidth,h=tools.offsetHeight;let y=r.bottom+6;if(y+h>innerHeight-6)y=r.top-h-6;tools.style.top=Math.max(56,y)+'px';tools.style.left=Math.max(6,Math.min(r.right-w,innerWidth-w-6))+'px';}
  function revert(){if(!last||!last.isConnected){msg('Сначала нажмите на ответ, который нужно вернуть');return;}const key=last.dataset.ed,o=load();delete o[key];save(o);last.innerHTML=html(ORIG[key]);sync(key);last.blur();msg('Возвращён исходный текст');}
  function download(){const blob=new Blob([JSON.stringify(load(),null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ege27-pravki-otvetov.json';document.body.append(a);a.click();a.remove();}
  function upload(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=()=>{const f=i.files[0];if(!f)return;f.text().then(s=>{try{const n=JSON.parse(s);if(!n||typeof n!=='object')throw 0;const o=load();Object.keys(n).forEach(k=>{if(typeof n[k]==='string')o[k]=n[k];});save(o);Object.keys(n).forEach(k=>{if(ORIG[k]!=null)sync(k);});paintCount();msg('Правки загружены');}catch(e){msg('Это не файл с правками');}});};i.click();}
  function setup(){
    const bar=document.querySelector('.bar');if(!bar)return;
    const mk=(l,f,c)=>{const b=document.createElement('button');b.type='button';b.className='btn sm'+(c?' '+c:'');b.textContent=l;b.onclick=f;return b;};
    btnTop=mk('Правка',e=>{e.stopPropagation();paintCount();fileM.hidden=!fileM.hidden;const r=btnTop.getBoundingClientRect();fileM.style.top=(r.bottom+6)+'px';fileM.style.right=Math.max(8,innerWidth-r.right)+'px';},'edtop');btnTop.title='Правка примерных ответов';btnTop.hidden=true;bar.append(btnTop);
    fileM=document.createElement('div');fileM.className='edmenu';fileM.hidden=true;
    onB=mk('Закончить правку',()=>{fileM.hidden=true;toggle();},'main');cntL=document.createElement('span');cntL.className='edcnt';
    fileM.append(onB,cntL,mk('Скачать правки в файл',()=>{fileM.hidden=true;download();}),mk('Загрузить правки из файла',()=>{fileM.hidden=true;upload();}),mk('Вернуть все исходные ответы',()=>{fileM.hidden=true;if(!count()){msg('Правок пока нет');return;}if(confirm('Вернуть исходный текст во всех исправленных ответах?')){const o=load();save({});Object.keys(o).forEach(k=>{if(ORIG[k]!=null)sync(k);});paintCount();msg('Все ответы снова исходные');}}));
    document.body.append(fileM);document.addEventListener('click',e=>{if(!fileM.contains(e.target)&&e.target!==btnTop)fileM.hidden=true;});
    tools=document.createElement('div');tools.className='edtools';tools.hidden=true;
    tools.append(mk('Вернуть исходный',revert),mk('Готово',()=>{const a=document.activeElement;if(a&&a.dataset&&a.dataset.ed)a.blur();tools.hidden=true;},'main'));
    tools.addEventListener('mousedown',e=>e.preventDefault());document.body.append(tools);
    document.addEventListener('focusin',e=>{const n=e.target.closest&&e.target.closest('[data-ed]');if(n){last=n;if(on)placeTools(n);}});
    document.addEventListener('focusout',e=>{const n=e.target.closest&&e.target.closest('[data-ed]');if(n&&on){store(n);tools.hidden=true;}});
    document.addEventListener('input',e=>{const n=e.target.closest&&e.target.closest('[data-ed]');if(n){clearTimeout(n._t);n._t=setTimeout(()=>{if(n.isConnected){const key=n.dataset.ed,v=clean(n.innerText),o=load();if(!v||v===ORIG[key])delete o[key];else o[key]=v;save(o);n.classList.toggle('edited',o[key]!=null);paintCount();}},500);}});
    /* Enter внутри ответа – новая строка, а не новый блок; вставка – только текст */
    document.addEventListener('keydown',e=>{const n=e.target.closest&&e.target.closest('[data-ed]');if(!n||!on)return;if(e.key==='Escape'){n.blur();e.stopPropagation();}else if(e.key==='Enter'){e.preventDefault();document.execCommand('insertLineBreak');}e.stopPropagation();},true);
    document.addEventListener('paste',e=>{const n=e.target.closest&&e.target.closest('[data-ed]');if(!n)return;e.preventDefault();const s=(e.clipboardData||window.clipboardData).getData('text/plain');document.execCommand('insertText',false,s);});
    /* клик по ответу в режиме правки не переворачивает карточку и не закрывает окно */
    document.addEventListener('click',e=>{if(on&&e.target.closest&&e.target.closest('[data-ed]'))e.stopPropagation();},true);
    new MutationObserver(()=>{if(on)mark();}).observe(document.body,{childList:true,subtree:true});
    const st=document.createElement('style');st.textContent=
      '.edtop{margin-left:auto;white-space:nowrap}'+
      '.editing [data-ed]{display:inline-block;max-width:100%;outline:2px dashed #e0a04a;outline-offset:3px;border-radius:4px;cursor:text;min-width:40px}'+
      '.editing [data-ed]:focus{outline:3px solid #f0a040}'+
      
      '.editing [data-ed].edited{box-shadow:inset 3px 0 0 #2f8f5f}'+
      '.edmenu .edcnt{font-size:14px;color:#667;padding:2px 6px}'+
      '.edmenu{position:fixed;z-index:61;background:#fff;border:1px solid #d6dbe8;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.16);padding:6px;display:flex;flex-direction:column;gap:4px}'+
      '.edtools{position:fixed;z-index:61;display:flex;gap:6px;background:#fff;border:2px solid #d9822b;border-radius:10px;padding:4px;box-shadow:0 6px 18px rgba(0,0,0,.18)}'+
      '.edtoast{position:fixed;z-index:62;top:64px;left:50%;transform:translateX(-50%);background:#2b2f4a;color:#fff;font-size:16px;padding:8px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);pointer-events:none;max-width:90vw}';
    document.head.append(st);paintCount();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
  return {t,toggle};
})();
