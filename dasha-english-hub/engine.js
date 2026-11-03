/* Dasha's English — engine. Data comes from data-*.js (window.DASHA.paths). No state is saved: the page always opens on the hub. */
(function(){
'use strict';
const D=window.DASHA;
const $=(s,r)=>(r||document).querySelector(s);
const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const plain=w=>String(w).replace(/[|*]/g,'');
let timers=[];
const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t;};
const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];};

/* ---------- audio: recordings in ../card-audio (natural voice), same keys as card-audio.js ---------- */
function norm(s){return String(s==null?'':s).toLowerCase().replace(/[‘’ʼ]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();}
function cyrb53(str){let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0,ch;i<str.length;i++){ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}
  h1=Math.imul(h1^(h1>>>16),2246822507);h1^=Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507);h2^=Math.imul(h1^(h1>>>13),3266489909);
  return 4294967296*(2097151&h2)+(h1>>>0);}
const key=s=>cyrb53(norm(s)).toString(36);
const BASE='../card-audio/', VER='d1';
const au=new Audio();au.preload='auto';
let queue=[],curBtn=null,onDone=null;
const ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
function setOn(b,c){document.querySelectorAll('.spk.on').forEach(x=>x.classList.remove('on'));if(b&&c)b.classList.add('on');}
function stopAudio(){queue=[];try{au.pause();}catch(e){}setOn(null);}
function nextAudio(){
  if(!queue.length){setOn(null);if(onDone){const f=onDone;onDone=null;f();}return;}
  au.src=BASE+key(queue.shift())+'.mp3?v='+VER;au.play().catch(()=>{});
}
au.onended=nextAudio;
au.onerror=()=>{const b=curBtn;queue=[];setOn(null);if(b){b.classList.add('err');setTimeout(()=>b.classList.remove('err'),500);}toast('Audio is not ready yet');};
function sayList(list,btn,done){stopAudio();curBtn=btn||null;onDone=done||null;queue=list.map(String).filter(Boolean);if(!queue.length)return;if(btn)setOn(btn,1);nextAudio();}
const say=(t,btn,done)=>sayList([t],btn,done);
let toastT=null;
function toast(msg){let t=$('.toast');if(!t){t=h('div','toast');document.body.appendChild(t);}t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},1800);}
function spk(text,cls){const b=h('button','spk'+(cls?' '+cls:''),ICON);b.title='Listen';b.onclick=e=>{e.stopPropagation();sayList([].concat(text),b);};return b;}
const optSay=o=>(String(o).length===1?'The letter '+o:o);

/* ---------- words: chunks and highlight ---------- */
const DIG=['igh','tch','air','ear','sh','ch','th','wh','ck','ng','ll','ss','ff','zz','oa','ai','ay','ee','ea','oo','ou','ow','oi','oy','ie','ar','or','er','ir','ur','ew','ue','au','aw','qu','kn','wr'];
function chunkWord(w){
  if(w.indexOf('|')>=0)return w.split('|').map(c=>c[0]==='*'?{t:c.slice(1),hl:true}:{t:c});
  const out=[];let i=0;
  while(i<w.length){let m=null;for(const d of DIG){if(w.startsWith(d,i)){m=d;break;}}if(!m)m=w[i];out.push({t:m});i+=m.length;}
  return out;
}
function wordHTML(w,hl){return chunkWord(w).map(c=>`<span class="${(c.hl||(hl&&hl.indexOf(c.t)>=0))?'hl':''}">${esc(c.t)}</span>`).join('');}

/* ---------- photos (optional files in img/) ---------- */
function photo(name,cap,cls){
  const box=h('div','photo '+(cls||''));const exts=['jpg','webp','png'];let k=0;const img=new Image();
  img.onerror=()=>{k++;if(k<exts.length){img.src=`img/${name}.${exts[k]}`;}else{img.remove();box.classList.add('ph');box.innerHTML=`<div class="phcap">${esc(cap||'')}</div>`;}};
  img.src=`img/${name}.${exts[0]}`;box.append(img);return box;
}

/* ---------- shared bits ---------- */
function actHead(box,b,restart){
  box.innerHTML='';const t=h('div','ahead');
  t.innerHTML=`<div><div class="atitle">${esc(b.title)}</div><div class="ainstr">${esc(b.instr||'')}</div></div>`;
  if(restart){const r=h('button','btn sm','Start again');r.onclick=restart;t.append(r);}
  box.append(t);const body=h('div','abody');box.append(body);return body;
}
function endScreen(body,score,total,errs,again,ctx,msg){
  body.innerHTML='';const e=h('div','endbox');
  e.innerHTML=`<div class="score">${score} / ${total}</div><div class="ainstr">${esc(msg||(score===total?'Perfect!':'Good job! Let\'s look at the mistakes.'))}</div>`;
  if(errs&&errs.length){const l=h('div','errs',errs.slice(0,8).join('<br>'));e.append(l);}
  const r=h('div','btnrow');
  const a=h('button','btn',again?'Play again':'');if(again){a.onclick=again;r.append(a);}
  const n=h('button','btn primary',ctx.hasNext?'Next block ›':'Back to blocks');n.onclick=ctx.hasNext?ctx.next:ctx.overview;r.append(n);
  e.append(r);body.append(e);
}
const ENG={};

/* ---------- predict ---------- */
ENG.predict=function(box,b,ctx){
  const body=actHead(box,b);body.style.flexDirection='row';body.style.gap='16px';
  const left=photo(b.img,b.cap);
  const right=h('div','pright');right.append(h('div','pq',esc(b.q)));
  const opts=h('div','popts');const rev=h('div','reveal');rev.hidden=true;rev.innerHTML=b.reveal;
  const chk=h('button','btn primary','Let\'s check!');chk.disabled=true;
  b.opts.forEach(o=>{const x=h('button','opt',esc(o));x.onclick=()=>{opts.querySelectorAll('.opt').forEach(y=>y.classList.remove('sel'));x.classList.add('sel');chk.disabled=false;};opts.append(x);});
  chk.onclick=()=>{rev.hidden=false;chk.hidden=true;nx.hidden=false;};
  const nx=h('button','btn primary',ctx.hasNext?'Next block ›':'Back to blocks');nx.hidden=true;nx.onclick=ctx.hasNext?ctx.next:ctx.overview;
  right.append(opts,chk,rev,nx);body.append(left,right);
};

/* ---------- rule / sound card ---------- */
ENG.rule=function(box,b,ctx){
  const body=actHead(box,b);const r=h('div','rule',b.html);body.append(r);
  r.querySelectorAll('[data-say]').forEach(el=>{el.onclick=()=>say(el.getAttribute('data-say'));});
  const nx=h('button','btn primary',ctx.hasNext?'Next block ›':'Back to blocks');nx.style.alignSelf='flex-start';nx.onclick=ctx.hasNext?ctx.next:ctx.overview;body.append(nx);
};

/* ---------- listen & tap ---------- */
ENG.ltap=function(box,b,ctx){
  let qs,i,score,errs;
  function start(){qs=shuffle(b.items);i=0;score=0;errs=[];show();}
  function show(){
    const body=actHead(box,b,start);const it=qs[i];
    const pr=h('div','qprompt');
    if(it.say){pr.append(spk(it.say,'big'));}
    if(it.q)pr.append(h('div','qtext',esc(it.q)));
    pr.append(h('div','cnt',(i+1)+' / '+qs.length));
    const grid=h('div','opts');const foot=h('div','foot');const fb=h('div','fb');foot.append(fb);
    const os=shuffle(it.opts.map((t,k)=>({t,ok:k===it.ans})));
    os.forEach(o=>{const x=h('button','opt',esc(o.t));x.onclick=()=>{
      grid.querySelectorAll('.opt').forEach(y=>y.disabled=true);
      if(o.t.length<40)say(optSay(o.t));
      if(o.ok){x.classList.add('ok');score++;fb.className='fb ok';fb.textContent='Yes!';}
      else{x.classList.add('bad');grid.querySelectorAll('.opt').forEach((y,k)=>{if(os[k].ok)y.classList.add('ok');});errs.push(esc((it.q||it.say||'')+' → '+it.opts[it.ans]));fb.className='fb bad';fb.textContent='Not quite: '+it.opts[it.ans];}
      if(it.exp)fb.textContent+='  '+it.exp;
      const last=i===qs.length-1;const n=h('button','btn primary',last?'See result':'Next ›');n.onclick=()=>{if(last)endScreen(body,score,qs.length,errs,start,ctx);else{i++;show();}};foot.append(n);
    };grid.append(x);});
    body.append(pr,grid,foot);
    if(it.say)later(()=>say(it.say,pr.querySelector('.spk')),150);
  }
  start();
};

/* ---------- sort ---------- */
ENG.sort=function(box,b,ctx){
  let rounds,ri,errs,placed,total,wrong;
  function start(){
    const per=Math.max(3,Math.min(4,b.per||4));const items=shuffle(b.items);rounds=[];
    for(let k=0;k<items.length;k+=per)rounds.push(items.slice(k,k+per));
    if(rounds.length>1&&rounds[rounds.length-1].length<per){const t=rounds.pop();rounds[rounds.length-1]=rounds[rounds.length-1].concat(t);}
    ri=0;errs=[];wrong=new Set();total=items.length;placed=0;show();
  }
  function show(){
    const body=actHead(box,b,start);const R=rounds[ri];
    const bk=h('div','buckets');bk.style.gridTemplateColumns=`repeat(${b.buckets.length},1fr)`;
    const lists=b.buckets.map((x,bi)=>{const e=h('div','bucket');e.innerHTML=`<div class="bk">${esc(x.k)}</div>${x.s?`<div class="bs">${esc(x.s)}</div>`:''}`;e.onclick=()=>drop(bi);bk.append(e);return e;});
    const row=h('div','chiprow');let sel=null;const left={n:R.length};
    const chips=R.map(it=>{const c=h('button','wchip',b.html?wordHTML(it[0],b.hl):esc(plain(it[0])));c.onclick=()=>{sel=it;chips.forEach(x=>x.c.classList.remove('sel'));c.classList.add('sel');if(b.speak!==false)say(plain(it[0]));};return {c,it};});
    chips.forEach(x=>row.append(x.c));
    function drop(bi){
      if(!sel)return;const x=chips.find(y=>y.it===sel);
      if(sel[1]===bi){const w=h('div','w',b.html?wordHTML(sel[0],b.hl):esc(plain(sel[0])));lists[bi].append(w);x.c.classList.add('gone');x.c.classList.remove('sel');sel=null;left.n--;placed++;
        if(!left.n){if(ri===rounds.length-1)later(()=>endScreen(body,total-wrong.size,total,errs,start,ctx),500);else later(()=>{ri++;show();},500);}}
      else{lists[bi].classList.add('shake');setTimeout(()=>lists[bi].classList.remove('shake'),400);errs.push(esc(plain(sel[0])+' → '+b.buckets[sel[1]].k));wrong.add(sel[0]);}
    }
    const cnt=h('div','cnt',`Round ${ri+1} / ${rounds.length} · tap a word, then tap its box`);
    body.append(bk,row,cnt);
  }
  start();
};

/* ---------- odd one out ---------- */
ENG.odd=function(box,b,ctx){
  let qs,i,score,errs;
  function start(){qs=shuffle(b.items);i=0;score=0;errs=[];show();}
  function show(){
    const body=actHead(box,b,start);const it=qs[i];
    const pr=h('div','qprompt');const all=spk(it.ws.map(plain),'big');pr.append(all,h('div','qtext',esc(b.q||'Which word has a different sound?')),h('div','cnt',(i+1)+' / '+qs.length));
    const os=shuffle(it.ws.map((t,k)=>({t,ok:k===it.odd})));const grid=h('div','opts');const foot=h('div','foot');const fb=h('div','fb');foot.append(fb);
    os.forEach(o=>{const x=h('button','opt',b.html?wordHTML(o.t,b.hl):esc(plain(o.t)));x.onclick=()=>{
      say(plain(o.t));grid.querySelectorAll('.opt').forEach(y=>y.disabled=true);
      if(o.ok){x.classList.add('ok');score++;fb.className='fb ok';fb.textContent='Yes! Different sound.';}
      else{x.classList.add('bad');grid.querySelectorAll('.opt').forEach((y,k)=>{if(os[k].ok)y.classList.add('ok');});errs.push(esc(it.ws.map(plain).join(', ')+' → '+plain(it.ws[it.odd])));fb.className='fb bad';fb.textContent='The odd one: '+plain(it.ws[it.odd]);}
      const last=i===qs.length-1;const n=h('button','btn primary',last?'See result':'Next ›');n.onclick=()=>{if(last)endScreen(body,score,qs.length,errs,start,ctx);else{i++;show();}};foot.append(n);
    };grid.append(x);});
    body.append(pr,grid,foot);
  }
  start();
};

/* ---------- build the word from tiles (tap, no typing) ---------- */
ENG.build=function(box,b,ctx){
  let qs,i,score,errs;
  function start(){qs=shuffle(b.items);i=0;score=0;errs=[];show();}
  function show(){
    const body=actHead(box,b,start);const it=qs[i];const w=typeof it==='string'?it:it.w;const parts=chunkWord(w);const target=plain(w);
    const pr=h('div','qprompt');pr.append(spk(it.say||target,'big'),h('div','qtext',it.q?esc(it.q):'Listen. Build the word.'),h('div','cnt',(i+1)+' / '+qs.length));
    const slots=h('div','slots');const fill=parts.map(()=>null);
    const slotEls=parts.map((p,k)=>{const s=h('div','slot','&nbsp;');s.onclick=()=>{if(fill[k]){fill[k].classList.remove('used');fill[k]=null;s.textContent='';s.classList.remove('full');}};slots.append(s);return s;});
    const tiles=h('div','tilerow');const foot=h('div','foot');const fb=h('div','fb');foot.append(fb);let wrongOnce=false;
    shuffle(parts.map(p=>p.t)).forEach(t=>{const tb=h('button','tilebtn',esc(t));tb.onclick=()=>{
      const k=fill.findIndex(x=>!x);if(k<0)return;fill[k]=tb;tb.classList.add('used');slotEls[k].textContent=t;slotEls[k].classList.add('full');
      if(fill.every(Boolean)){const got=slotEls.map(s=>s.textContent).join('');
        if(got===target){slots.classList.add('ok');tiles.querySelectorAll('.tilebtn').forEach(y=>y.disabled=true);if(!wrongOnce)score++;fb.className='fb ok';fb.textContent='Yes!';say(target);
          const last=i===qs.length-1;const n=h('button','btn primary',last?'See result':'Next ›');n.onclick=()=>{if(last)endScreen(body,score,qs.length,errs,start,ctx);else{i++;show();}};foot.append(n);}
        else{if(!wrongOnce){errs.push(esc(target));wrongOnce=true;}slots.classList.add('shake');later(()=>{slots.classList.remove('shake');fill.forEach((f,j)=>{if(f){f.classList.remove('used');fill[j]=null;slotEls[j].textContent='';slotEls[j].classList.remove('full');}});},500);}}
    };tiles.append(tb);});
    body.append(pr,slots,tiles,foot);body.style.justifyContent='space-around';
    later(()=>say(it.say||target,pr.querySelector('.spk')),150);
  }
  start();
};

/* ---------- reading ladder ---------- */
ENG.ladder=function(box,b,ctx){
  let i=0;
  function show(){
    const body=actHead(box,b,()=>{i=0;show();});const row=b.rows[i];
    const g=h('div','ladder');row.forEach(w=>{const x=h('button','lw',b.html===false?esc(plain(w)):wordHTML(w,b.hl));x.onclick=()=>say(plain(w));g.append(x);});
    const foot=h('div','foot');const pv=h('button','btn',' ‹ Back');pv.disabled=i===0;pv.onclick=()=>{i--;show();};
    const all=spk(row.map(plain));const c=h('div','cnt',`${i+1} / ${b.rows.length}`);
    const last=i===b.rows.length-1;const nx=h('button','btn primary',last?(ctx.hasNext?'Next block ›':'Back to blocks'):'Next row ›');
    nx.onclick=()=>{if(last)(ctx.hasNext?ctx.next:ctx.overview)();else{i++;show();}};
    const mid=h('div','btnrow');mid.append(all,c);foot.append(pv,mid,nx);body.append(g,foot);
  }
  show();
};

/* ---------- listen first, then read ---------- */
ENG.sents=function(box,b,ctx){
  let p=0;const per=4;const pages=Math.ceil(b.sents.length/per);
  function show(){
    const body=actHead(box,b,()=>{p=0;show();});const list=h('div','slist');
    b.sents.slice(p*per,p*per+per).forEach(s=>{const l=h('button','sline hid');l.append(spk(s),h('div','stxt',esc(s)));l.onclick=()=>{l.classList.remove('hid');say(s,l.querySelector('.spk'));};l.querySelector('.spk').onclick=e=>{e.stopPropagation();l.classList.remove('hid');say(s,l.querySelector('.spk'));};list.append(l);});
    const foot=h('div','foot');const pv=h('button','btn','‹ Back');pv.disabled=p===0;pv.onclick=()=>{p--;show();};
    const sh=h('button','btn','Show all text');sh.onclick=()=>list.querySelectorAll('.sline').forEach(x=>x.classList.remove('hid'));
    const last=p===pages-1;const nx=h('button','btn primary',last?(ctx.hasNext?'Next block ›':'Back to blocks'):'Next ›');nx.onclick=()=>{if(last)(ctx.hasNext?ctx.next:ctx.overview)();else{p++;show();}};
    const mid=h('div','btnrow');mid.append(sh,h('div','cnt',`${p+1} / ${pages}`));foot.append(pv,mid,nx);body.append(list,foot);
  }
  show();
};

/* ---------- floor is lava (true/false, 3 stones) ---------- */
ENG.lava=function(box,b,ctx){
  let qs,i,score,errs,lives;
  function start(){qs=shuffle(b.items);i=0;score=0;errs=[];lives=3;show();}
  function show(){
    const body=actHead(box,b,start);const it=qs[i];
    const top=h('div','qprompt');const st=h('div','stones');for(let k=0;k<3;k++)st.append(h('div','stone'+(k>=lives?' lost':'')));
    const sayT=it.say||(it.a?[it.a,it.b]:null);
    if(sayT)top.append(spk(sayT,'big'));
    top.append(h('div','qtext',it.a?`${wordHTML(it.a,b.hl)} &nbsp;—&nbsp; ${wordHTML(it.b,b.hl)}`:esc(it.q)),st);
    const lab=b.labels||['True','False'];const g=h('div','tf');const foot=h('div','foot');const fb=h('div','fb');foot.append(fb);
    [true,false].forEach((v,k)=>{const x=h('button','opt',esc(lab[k]));x.onclick=()=>{
      g.querySelectorAll('.opt').forEach(y=>y.disabled=true);const right=(v===it.ans);
      if(right){x.classList.add('ok');score++;fb.className='fb ok';fb.textContent='Safe! '+(it.exp||'');}
      else{x.classList.add('bad');lives--;st.children[lives]&&st.children[lives].classList.add('lost');errs.push(esc((it.q||(it.a+' — '+it.b))+' → '+lab[it.ans?0:1]));fb.className='fb bad';fb.textContent='Splash! '+(it.exp||('It is: '+lab[it.ans?0:1]));}
      const over=lives<=0,last=i===qs.length-1;const n=h('button','btn primary',(over||last)?'See result':'Next ›');
      n.onclick=()=>{if(over||last)endScreen(body,score,qs.length,errs,start,ctx,over?'Out of stones! Try again.':null);else{i++;show();}};foot.append(n);
    };g.append(x);});
    body.append(top,g,foot);
    if(sayT)later(()=>say(sayT,top.querySelector('.spk')),150);
  }
  start();
};

/* ---------- speed game: 15 seconds per card ---------- */
ENG.speed=function(box,b,ctx){
  let qs,i,score,errs;const sec=b.sec||15;
  function start(){qs=shuffle(b.items).slice(0,12);i=0;score=0;errs=[];show();}
  function show(){
    const body=actHead(box,b,start);const w=qs[i];
    const c=h('div','center');const ring=h('div','ring');ring.innerHTML=`<span>${sec}</span>`;
    const bw=h('div','bigword',b.html?wordHTML(w,b.hl):esc(plain(w)));
    const btns=h('div','btnrow');
    const okb=h('button','btn lg','I read it');const no=h('button','btn lg','Again');
    const chk=h('button','btn lg','Listen');chk.onclick=()=>say(plain(w),chk);
    let left=sec,iv=null,done=false;
    const tick=()=>{left--;ring.firstChild.textContent=Math.max(left,0);ring.style.background=`conic-gradient(var(--acc) 0 ${Math.max(left,0)/sec*100}%,#E4EAEE 0)`;if(left<=0){clearInterval(iv);ring.firstChild.textContent='0';}};
    iv=setInterval(tick,1000);timers.push(iv);
    const fin=ok=>{if(done)return;done=true;clearInterval(iv);if(ok)score++;else errs.push(esc(plain(w)));const last=i===qs.length-1;if(last)endScreen(body,score,qs.length,errs,start,ctx);else{i++;show();}};
    okb.onclick=()=>fin(true);no.onclick=()=>fin(false);
    btns.append(chk,okb,no);c.append(ring,bw,btns,h('div','cnt',(i+1)+' / '+qs.length));body.append(c);
  }
  start();
};

/* ---------- match pairs (tap-tap) ---------- */
ENG.match=function(box,b,ctx){
  let rounds,ri,errs;
  function start(){const ps=shuffle(b.pairs);rounds=[];for(let k=0;k<ps.length;k+=5)rounds.push(ps.slice(k,k+5));
    if(rounds.length>1&&rounds[rounds.length-1].length<3){const t=rounds.pop();rounds[rounds.length-1]=rounds[rounds.length-1].concat(t);}
    ri=0;errs=[];show();}
  function show(){
    const body=actHead(box,b,start);const R=rounds[ri];const cols=h('div','mcols');const L=h('div','mcol'),Rr=h('div','mcol');
    let selL=null,selR=null,left=R.length;
    const lb=R.map((p,k)=>{const x=h('button','mbtn',esc(p[0]));x.onclick=()=>{if(x.classList.contains('done'))return;if(b.lspeak!==false)say(p[0]);lb.forEach(y=>y.classList.remove('sel'));x.classList.add('sel');selL=k;try_();};L.append(x);return x;});
    const order=shuffle(R.map((p,k)=>k));
    const rb=order.map(k=>{const x=h('button','mbtn',esc(R[k][1]));x.onclick=()=>{if(x.classList.contains('done'))return;rb.forEach(y=>y.classList.remove('sel'));x.classList.add('sel');selR=k;try_();};Rr.append(x);return x;});
    function try_(){
      if(selL==null||selR==null)return;
      if(selL===selR){lb[selL].classList.add('done');lb[selL].classList.remove('sel');const j=order.indexOf(selR);rb[j].classList.add('done');rb[j].classList.remove('sel');left--;selL=selR=null;
        if(!left){if(ri===rounds.length-1)later(()=>endScreen(body,Math.max(0,b.pairs.length-errs.length),b.pairs.length,errs,start,ctx),500);else later(()=>{ri++;show();},500);}}
      else{const j=order.indexOf(selR);lb[selL].classList.add('shake');rb[j].classList.add('shake');errs.push(esc(R[selL][0]+' = '+R[selL][1]));const a=lb[selL],c=rb[j];setTimeout(()=>{a.classList.remove('shake','sel');c.classList.remove('shake','sel');},400);selL=selR=null;}
    }
    cols.append(L,Rr);body.append(cols,h('div','cnt',`Round ${ri+1} / ${rounds.length}`));
  }
  start();
};

/* ---------- error hunter: tap the wrong word(s); "~word" marks an error, text after | is the fix ---------- */
ENG.hunt=function(box,b,ctx){
  let qs,i,score,errs;
  function parse(s){const [t,fix]=s.split('|');const tok=t.split(' ');const bad=[];tok.forEach((x,k)=>{if(x[0]==='~'){bad.push(k);tok[k]=x.slice(1);}});const fixes=(fix||'').split('/');const good=tok.slice();bad.forEach((k,n)=>{good[k]=fixes[n]||fixes[0];});return {tok,bad,good:good.join(' ')};}
  function start(){qs=shuffle(b.items).map(parse);i=0;score=0;errs=[];show();}
  function show(){
    const body=actHead(box,b,start);const it=qs[i];const sel=new Set();
    const w=h('div','hwords');const foot=h('div','foot');const fb=h('div','fb');
    const els=it.tok.map((t,k)=>{const x=h('button','hw',esc(t));x.onclick=()=>{if(sel.has(k)){sel.delete(k);x.classList.remove('sel');}else{sel.add(k);x.classList.add('sel');}};w.append(x);return x;});
    const chk=h('button','btn primary','Check');
    chk.onclick=()=>{chk.hidden=true;els.forEach(x=>x.disabled=true);const ok=sel.size===it.bad.length&&it.bad.every(k=>sel.has(k));
      els.forEach((x,k)=>{x.classList.remove('sel');if(it.bad.includes(k))x.classList.add('ok');else if(sel.has(k))x.classList.add('bad');});
      if(ok){score++;fb.className='fb ok';fb.textContent='Found it!  '+it.good;}else{errs.push(esc(it.good));fb.className='fb bad';fb.textContent='Correct: '+it.good;}
      say(it.good);const last=i===qs.length-1;const n=h('button','btn primary',last?'See result':'Next ›');n.onclick=()=>{if(last)endScreen(body,score,qs.length,errs,start,ctx);else{i++;show();}};foot.append(n);};
    foot.append(fb,chk);
    body.append(h('div','cnt',(i+1)+' / '+qs.length),w,foot);
  }
  start();
};

/* ---------- speaking cards ---------- */
ENG.speak=function(box,b,ctx){
  let i=0;
  function show(){
    const body=actHead(box,b);body.style.flexDirection='column';
    const sp=h('div','sp');const card=h('div','spcard');
    card.append(h('div','pr',esc(b.prompts[i])));
    const ring=h('div','ring');ring.innerHTML=`<span>${b.sec||40}</span>`;let iv=null;
    const go=h('button','btn',`Start ${b.sec||40} s`);go.onclick=()=>{clearInterval(iv);let left=b.sec||40;ring.firstChild.textContent=left;iv=setInterval(()=>{left--;ring.firstChild.textContent=Math.max(left,0);ring.style.background=`conic-gradient(var(--acc) 0 ${Math.max(left,0)/(b.sec||40)*100}%,#E4EAEE 0)`;if(left<=0)clearInterval(iv);},1000);timers.push(iv);};
    card.append(ring,go);
    const pats=h('div','pats');(b.patterns||[]).forEach(p=>{const x=h('button','say',esc(p));x.onclick=()=>say(p);pats.append(x);});
    sp.append(card,pats);
    const foot=h('div','foot');const pv=h('button','btn','‹ Back');pv.disabled=i===0;pv.onclick=()=>{i--;show();};
    const last=i===b.prompts.length-1;const nx=h('button','btn primary',last?(ctx.hasNext?'Next block ›':'Back to blocks'):'Next ›');nx.onclick=()=>{if(last)(ctx.hasNext?ctx.next:ctx.overview)();else{i++;show();}};
    foot.append(pv,h('div','cnt',`${i+1} / ${b.prompts.length}`),nx);body.append(sp,foot);
  }
  show();
};

/* ---------- Quizlet-style card column ---------- */
function quizlet(L,host){
  const cards=L.cards||[];let i=0;host.innerHTML='';
  host.append(h('div','qlab',esc(L.cardsLabel||'Words')));
  const wrap=h('div','qwrap');const c=h('div','qcard');wrap.append(c);
  const bar=h('div','qbar');const p=h('button','btn sm','‹');const n=h('button','btn sm','›');const cnt=h('span','qcnt');bar.append(p,cnt,n);
  const hl=L.hl;let sp=null;
  function show(){const x=cards[i];c.classList.remove('flip');if(sp)sp.remove();
    const img=x.img?`<img class="qimg" src="img/cards/${esc(x.img)}.jpg" onerror="this.remove()">`:'';
    c.innerHTML=`<div class="inner"><div class="side front">${img}<div class="qword">${wordHTML(x.w,hl)}</div></div><div class="side back"><div class="qru">${esc(x.ru||'')}</div><div class="qex">${esc(x.ex||'')}</div></div></div>`;
    sp=spk(plain(x.w));wrap.append(sp);cnt.textContent=(i+1)+' / '+cards.length;}
  c.onclick=()=>{c.classList.toggle('flip');};
  p.onclick=()=>{i=(i-1+cards.length)%cards.length;show();};n.onclick=()=>{i=(i+1)%cards.length;show();};
  if(!cards.length){host.append(h('div','qcnt','—'));return;}
  host.append(wrap,bar);show();
}

/* ---------- views ---------- */
const app=$('#app');
function hub(){
  clearTimers();stopAudio();document.title="Dasha's English";app.innerHTML='';app.className='hubview';
  const top=h('header','hubtop');
  top.innerHTML=`<div><div class="brand">Dasha's English<i></i></div><div class="sub">Reading Lab · Go Getter 1 · Verbs — choose a lesson</div></div>`;
  const tb=h('button','btn teacher','Для учителя');tb.onclick=()=>teacherPlan();top.append(tb);app.append(top);
  const g=h('div','paths');
  D.paths.forEach((P,pi)=>{
    const c=h('section','pcard p-'+P.id);c.innerHTML=`<h2>${esc(P.title)}</h2><div class="psub">${esc(P.sub)}</div>`;
    P.units.forEach(U=>{
      if(U.title)c.append(h('div','utitle',esc(U.title)));
      const ch=h('div','chips');
      U.lessons.forEach((L,k)=>{const b=h('button','lchip'+(L.soon?' soon':''),`<b>${esc(L.id)}</b><span>${esc(L.short||L.name)}</span>`);b.title=L.name;if(!L.soon)b.onclick=()=>lesson(P,U,k);ch.append(b);});
      c.append(ch);
    });
    if(P.later)c.append(h('div','later',esc(P.later)));
    g.append(c);
  });
  app.append(g);
}
function overlay(title,html){
  const ov=h('div','tover');ov.innerHTML=`<div class="tpanel"><div class="th">${title}</div><div class="tt">${html}</div></div>`;
  const cl=h('button','btn primary sm','Закрыть');cl.style.alignSelf='flex-start';cl.onclick=()=>ov.remove();ov.querySelector('.tpanel').append(cl);
  ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);
}
function teacherPlan(){overlay('План занятий · Даша',D.plan||'');}

function lesson(P,U,k,bi){
  clearTimers();stopAudio();const L=U.lessons[k];
  app.innerHTML='';app.className='lessonview p-'+P.id;document.title=L.id+' · '+L.name;
  const top=h('header','ltop');
  const home=h('button','btn sm','‹ Home');home.onclick=hub;
  const ttl=h('div','ltitle',`<span class="lid">${esc(L.id)}</span> ${esc(L.name)}`);
  const nav=h('div','btnrow');nav.style.flexWrap='nowrap';
  const all=[];D.paths.forEach(p=>p.units.forEach(u=>u.lessons.forEach((l,j)=>all.push({P:p,U:u,k:j,l}))));
  const idx=all.findIndex(x=>x.l===L);const playable=all.filter(x=>!x.l.soon&&x.P===P);const pi=playable.findIndex(x=>x.l===L);
  const pv=h('button','btn sm','‹');pv.title='Previous lesson';pv.disabled=pi<=0;pv.onclick=()=>{const t=playable[pi-1];lesson(t.P,t.U,t.k);};
  const nx=h('button','btn sm','›');nx.title='Next lesson';nx.disabled=pi<0||pi>=playable.length-1;nx.onclick=()=>{const t=playable[pi+1];lesson(t.P,t.U,t.k);};
  const tch=h('button','btn teacher sm','Для учителя');tch.onclick=()=>overlay('Для учителя · '+esc(L.id),L.teach||'');
  nav.append(pv,nx,tch);top.append(home,ttl,nav);app.append(top);
  const main=h('main','lmain');const side=h('aside','qside');quizlet(L,side);
  const stg=h('section','stage');main.append(side,stg);app.append(main);
  function overview(){
    clearTimers();stopAudio();stg.innerHTML='';
    const t=h('div','tiles');
    L.blocks.forEach((b,j)=>{const x=h('button','tile',`<b>${j+1} · ${esc(b.mech||'')}</b><span>${esc(b.title)}</span><small>${esc(b.hint||'')}</small>`);x.onclick=()=>open(j);t.append(x);});
    stg.append(t);
  }
  function open(j){
    clearTimers();stopAudio();stg.innerHTML='';
    const chips=h('div','bchips');
    const ov=h('button','bchip','All blocks');ov.onclick=overview;chips.append(ov);
    L.blocks.forEach((b,m)=>{const c=h('button','bchip'+(m===j?' on':''),`${m+1} · ${esc(b.title)}`);c.onclick=()=>open(m);chips.append(c);});
    const act=h('div','act');stg.append(chips,act);
    const ctx={hasNext:j<L.blocks.length-1,next:()=>open(j+1),overview};
    ENG[L.blocks[j].t](act,L.blocks[j],ctx);
  }
  if(bi==null)overview();else open(bi);
}

/* ---------- audio texts (for card-audio/texts.json) ---------- */
function collectTexts(){
  const out=new Set();const add=t=>{if(t==null)return;[].concat(t).forEach(x=>{x=plain(String(x)).replace(/\s+/g,' ').trim();if(x&&/[a-z]/i.test(x)&&!/[Ѐ-ӿ]/.test(x))out.add(x);});};
  D.paths.forEach(P=>P.units.forEach(U=>U.lessons.forEach(L=>{
    (L.cards||[]).forEach(c=>{add(c.w);add(c.ex);});
    (L.blocks||[]).forEach(b=>{
      switch(b.t){
        case 'rule':{const re=/data-say="([^"]+)"/g;let m;while((m=re.exec(b.html)))add(m[1]);break;}
        case 'ltap':b.items.forEach(it=>{add(it.say);it.opts.forEach(o=>add(optSay(o)));});break;
        case 'sort':b.items.forEach(it=>add(it[0]));break;
        case 'odd':b.items.forEach(it=>it.ws.forEach(add));break;
        case 'build':b.items.forEach(it=>{if(typeof it==='string')add(it);else add(it.say||it.w);});break;
        case 'ladder':b.rows.forEach(r=>r.forEach(add));break;
        case 'sents':b.sents.forEach(add);break;
        case 'lava':b.items.forEach(it=>{add(it.say);if(it.a){add(it.a);add(it.b);}});break;
        case 'speed':b.items.forEach(add);break;
        case 'match':if(b.lspeak!==false)b.pairs.forEach(p=>add(p[0]));break;
        case 'hunt':b.items.forEach(s=>{const [t,fix]=s.split('|');const tok=t.split(' ');const bad=[];tok.forEach((x,k)=>{if(x[0]==='~'){bad.push(k);tok[k]=x.slice(1);}});const fx=(fix||'').split('/');bad.forEach((k,n)=>{tok[k]=fx[n]||fx[0];});add(tok.join(' '));});break;
        case 'speak':(b.patterns||[]).forEach(add);break;
      }
    });
  })));
  const o={};out.forEach(t=>{o[key(t)]=t;});return o;
}
window.__collectTexts=collectTexts;window.__key=key;window.__chunk=chunkWord;
hub();
})();
