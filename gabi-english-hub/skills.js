/* Lesson engine for Gabi's skills lessons (Unit 1, lessons 4–5 and Test yourself).
   One screen per step, navy bar on top, nothing saved between visits.
   Activity types: quiz · gaps · pick · order · talk · map · write · explain.
   A step may have a side panel: audio (with a read-aloud fallback), a text that hides, or a card. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nz=s=>String(s||'').toLowerCase().replace(/[’‘`´]/g,"'").replace(/[-–—]/g,' ').replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const words=t=>(String(t).trim().match(/[A-Za-z’']+/g)||[]).length;
let CFG,cur=0,ST=[],seen=new Set(),tick=0,EMBED=false,SHARED={},PH={},STAGES=[];
const has=src=>!!src&&PH[src]===true;
const mono=n=>`<i class="mono">${esc(String(n).charAt(0))}</i>`;
const face=(p)=>has(p.img)?`<img src="${esc(p.img)}" alt="">`:mono(p.n);

/* ---------- speech fallback ---------- */
function say(lines,onend){try{speechSynthesis.cancel();const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));const names=[...new Set(lines.map(l=>l[0]))];let n=0;
  lines.forEach(l=>{const u=new SpeechSynthesisUtterance(l[1]);u.lang='en-GB';u.rate=.95;const k=names.indexOf(l[0]);if(vs.length)u.voice=vs[k%vs.length];u.pitch=k%2?0.8:1.15;u.onend=()=>{n++;if(n===lines.length&&onend)onend()};speechSynthesis.speak(u)})}catch(e){}}
let CLIP=null;
function hush(){try{speechSynthesis.cancel()}catch(e){}if(CLIP){try{CLIP.pause()}catch(e){}CLIP=null}document.querySelectorAll('audio').forEach(a=>{try{a.pause()}catch(e){}})}
function playClip(src,text){hush();if(!src)return say([['q',text]]);const el=new Audio(src);CLIP=el;let fell=false;const fb=()=>{if(fell||CLIP!==el)return;fell=true;CLIP=null;say([['q',text]])};el.addEventListener('error',fb);const p=el.play();if(p&&p.catch)p.catch(fb)}

/* ---------- shell ---------- */
function boot(cfg){CFG=cfg;EMBED=new URLSearchParams(location.search).has('embed');document.documentElement.classList.toggle('embed',EMBED);
 document.body.innerHTML=`<div class="bar"><a class="home" href="${esc(cfg.hub||'index.html')}" aria-label="Back to Gabi Hub">←<span>&nbsp;Hub</span></a>
  <div class="now"><small id="stage"></small><b id="title"></b></div><div class="steps" id="steps" role="tablist" aria-label="Lesson steps"></div>
  <button class="arrow" id="prev" aria-label="Previous step">‹</button><button class="arrow next" id="next"></button></div>
  <main class="sheet" id="sheet"></main>`;
 ST=cfg.steps.map(()=>({}));STAGES=[...new Set(cfg.steps.map(x=>x.stage))];
 $('#steps').onclick=e=>{const b=e.target.closest('[data-i]');if(b)go(+b.dataset.i)};
 $('#prev').onclick=()=>{if(cur)go(cur-1)};
 $('#next').onclick=()=>{if(cur===CFG.steps.length-1){if(EMBED)return;ST=CFG.steps.map(()=>({}));SHARED={};seen.clear();go(0)}else go(cur+1)};
 const sh=$('#sheet');sh.addEventListener('click',onClick);sh.addEventListener('submit',e=>{e.preventDefault();const f=e.target.closest('[data-form]');if(f)act('submit',f.dataset.form,f)});sh.addEventListener('input',onInput);
 const srcs=new Set();cfg.steps.forEach(st=>{if(st.photo)srcs.add(st.photo.src);const sd=st.side||{};(sd.people||[]).forEach(p=>p.img&&srcs.add(p.img));if(sd.mail&&sd.mail.img)srcs.add(sd.mail.img)});
 let left=srcs.size,started=false;const start=()=>{if(started)return;started=true;go(0)};if(!left)return start();setTimeout(start,1800);
 srcs.forEach(src=>{const im=new Image();im.onload=()=>{PH[src]=true;if(--left<=0)start()};im.onerror=()=>{PH[src]=false;if(--left<=0)start()};im.src=src})}
function go(i){hush();clearInterval(tick);tick=0;seen.add(cur);cur=i;drawBar();draw()}
function drawBar(){const S=CFG.steps;
 $('#steps').innerHTML=S.map((s,i)=>(i&&s.stage!==S[i-1].stage?'<i></i>':'')+`<button class="chip${i===cur?' on':seen.has(i)?' seen':''}" data-i="${i}" role="tab" aria-selected="${i===cur}" title="${esc(s.title)}">${i+1}</button>`).join('');
 $('#stage').textContent=CFG.kicker+' · '+S[cur].stage;$('#title').textContent=(cur+1)+' / '+S.length+' · '+S[cur].title;
 $('#prev').style.visibility=cur?'visible':'hidden';const last=cur===S.length-1;$('#next').textContent=last?'Start again':'Next ›';$('#next').style.visibility=last&&EMBED?'hidden':'visible'}
function draw(){const step=CFG.steps[cur],s=ST[cur];if(!s.init){s.init=true;initAct(step.act,s)}
 const photo=step.photo&&has(step.photo.src)?`<figure class="photo${step.side?'':' full'}"><img src="${esc(step.photo.src)}" alt="${esc(step.photo.alt||'')}" style="object-position:${esc(step.photo.pos||'center')}">${step.photo.cap?`<figcaption>${esc(step.photo.cap)}</figcaption>`:''}</figure>`:'';
 const side=(step.side?sideHTML(step.side,s):'')+photo;const gated=step.side&&step.side.gate&&!s.open;const look=step.side&&step.side.look?' look-'+step.side.look:'';
 const sh=$('#sheet');sh.className='sheet'+(side?' two':'')+(step.wide?' wide':'')+(!step.side&&photo?' pic':'');sh.dataset.stage=STAGES.indexOf(step.stage)%6;
 sh.innerHTML=(side?`<aside class="side${look}">${side}</aside>`:'')+`<section class="work"><p class="hint">${step.hint||''}</p>${gated?`<div class="gate"><b>${esc(step.side.gateText||'Listen first. The task stays hidden.')}</b>${step.side.text?'':`<button class="main" data-open>${esc(step.side.gateBtn||'Show the task')}</button>`}</div>`:`<div class="act" id="act">${actHTML(step.act,s)}</div>`}</section>`;
 bindSide(step.side,s);bindPlayers();const a=$('#sheet [data-auto]');if(a&&!gated)a.focus()}
function redrawAct(){const step=CFG.steps[cur],s=ST[cur];const el=$('#act');if(el){el.innerHTML=actHTML(step.act,s);bindPlayers();const a=el.querySelector('[data-auto]');if(a)a.focus()}}

/* ---------- audio player ---------- */
const mmss=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
function player(a,k,auto){return `<div class="pl" data-pl="${k}"><button class="plb" data-plbtn aria-label="Play or pause"></button><div class="plm"><span>${esc(a.label||'Recording')}</span><div class="plt" data-pltrack><u></u></div></div><b class="pltime">0:00</b><button class="plr" data-plback aria-label="Back ten seconds">−10 s</button><i class="eq" aria-hidden="true"><s></s><s></s><s></s><s></s><s></s></i><audio preload="metadata" src="${esc(a.src)}" ${auto?'data-autoplay':''}></audio></div>`}
function bindPlayers(){document.querySelectorAll('.pl:not([data-b])').forEach(box=>{box.dataset.b=1;const el=box.querySelector('audio'),bar=box.querySelector('.plt u'),tm=box.querySelector('.pltime');
  const paint=()=>{bar.style.width=(el.duration?el.currentTime/el.duration*100:0)+'%';tm.textContent=mmss(el.currentTime)+(el.duration?' / '+mmss(el.duration):'')};
  el.addEventListener('timeupdate',paint);el.addEventListener('loadedmetadata',paint);
  el.addEventListener('play',()=>{box.classList.add('on');const sd=box.closest('.side');if(sd)sd.classList.add('live')});
  ['pause','ended'].forEach(ev=>el.addEventListener(ev,()=>{box.classList.remove('on');const sd=box.closest('.side');if(sd&&!sd.querySelector('.pl.on'))sd.classList.remove('live')}));
  box.querySelector('[data-pltrack]').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();if(el.duration)el.currentTime=(e.clientX-r.left)/r.width*el.duration});
  el.addEventListener('error',()=>{const sd=CFG.steps[cur].side,a=sd&&sd.audio&&sd.audio[+box.dataset.pl];box.classList.add('tts');
   box.innerHTML=a&&a.script?`<button class="plb" data-say="${box.dataset.pl}" aria-label="Play"></button><div class="plm"><span>${esc(a.label||'Recording')}</span><em>Read aloud by the browser until the recording is added.</em></div><button class="plr" data-stop>Stop</button>`:`<div class="plm"><span>${esc((a&&a.label)||'Recording')}</span><em>The recording is missing.</em></div>`},{once:true});
  if(el.dataset.autoplay!==undefined){const p=el.play();if(p&&p.catch)p.catch(()=>{})}})}
/* ---------- side panel ---------- */
function sideHTML(sd,s){let h='';
 if(sd.look==='radio')h+=`<div class="onair"><i></i>On air</div>`;
 if(sd.title)h+=`<b class="sideT">${esc(sd.title)}</b>`;
 if(sd.audio)h+=sd.audio.map((a,k)=>player(a,k)).join('');
 if(sd.people)h+=`<div class="people">${sd.people.map(p=>`<div>${face(p)}<b>${esc(p.n)}</b></div>`).join('')}</div>`;
 const mail=sd.mail?`<div class="mailHead">${face({n:sd.mail.from,img:sd.mail.img})}<div><b>${esc(sd.mail.from)}</b><span>${esc(sd.mail.sub)}</span></div><em>to me</em></div>`:'';
 if(sd.text){if(s.hidden)h+=`<div class="gone"><b>The text is hidden.</b><span>Work from memory.</span><button class="ghost" data-peek>Teacher: show it again</button></div>`;
  else h+=`${mail}<div class="text">${sd.text.html}</div>${sd.text.seconds?`<div class="count"><u id="countBar"></u></div><div class="row"><span id="countN" class="muted"></span><button class="main" data-hide>Hide the text and start</button></div>`:''}`}
 if(sd.card)h+=`<div class="card">${typeof sd.card==='function'?sd.card(SHARED):sd.card}</div>`;
 return h}
function bindSide(sd,s){if(!sd)return;
 if(sd.text&&sd.text.seconds&&!s.hidden){let left=s.left==null?sd.text.seconds:s.left;const paint=()=>{const b=$('#countBar'),n=$('#countN');if(!b)return clearInterval(tick);b.style.width=(left/sd.text.seconds*100)+'%';n.textContent=left+' seconds to read'};paint();
  tick=setInterval(()=>{left--;s.left=left;if(left<=0){clearInterval(tick);s.hidden=true;s.open=true;draw()}else paint()},1000)}}

/* ---------- activities ---------- */
function initAct(a,s){if(!a)return;
 if(a.type==='quiz'){s.items=a.shuffle===false?a.items.slice():shuffle(a.items);s.i=0;s.ok=0;s.miss=[];s.pick=null;s.done=false}
 if(a.type==='gaps'){s.val={};s.checked=false;s.show=false}
 if(a.type==='pick'){s.sel={};s.checked=false}
 if(a.type==='order'){s.pool=shuffle(a.items.map((t,i)=>i));s.seq=[];s.checked=false}
 if(a.type==='talk'){s.i=0;s.flip=false;s.used={};s.left=null;s.run=false}
 if(a.type==='map'){s.val=SHARED.map||{}}
 if(a.type==='write'){s.text=s.text||''}
 if(a.type==='explain'){s.i=0;s.shown={}}}
const fb=(ok,head,body)=>`<div class="fb ${ok?'ok':'no'}"><b>${head}</b>${body?`<span>${body}</span>`:''}</div>`;
function actHTML(a,s){if(!a)return'';return ACT[a.type].view(a,s)}
const ACT={
quiz:{view(a,s){const n=s.items.length;
  if(s.done)return `<div class="end"><div><span class="tag">${esc(a.label||'Result')}</span><h3>${s.ok} of ${n} correct</h3><p>${s.ok===n?'No mistakes.':'Look at the ones you missed, then play again.'}</p><button class="main" data-again>Play again</button></div>${review(s.miss)}</div>`;
  const q=s.items[s.i],opts=q.o||a.opts,done=s.pick!=null,right=typeof q.a==='number'?opts[q.a]:q.a;
  return `<div class="qhead"><span class="tag">${esc(a.label||'Question')} ${s.i+1} of ${n}</span><b>${s.ok} correct</b></div>
   ${q.audio?`<div class="bubble in">${player({src:q.audio,label:q.who||'Listen'},'q',!done)}</div>`:''}
   <p class="q${q.small?' small':''}">${q.html||esc(q.q)}</p>
   <div class="opts n${opts.length}${a.cols?' c'+a.cols:''}${a.chat?' chat':''}">${opts.map((o,k)=>`<button data-opt="${k}" class="${done?(o===right?'ok':o===s.pick?'no':'dim'):''}" ${done?'disabled':''}>${esc(o)}</button>`).join('')}</div>
   ${done?fb(s.pick===right,s.pick===right?'Correct.':'The answer is: '+esc(right),q.why?esc(q.why):'')+`<button class="main" data-next data-auto>${s.i===n-1?'See the result':'Next'}</button>`:''}`},
 click(a,s,d){if(d.opt!==undefined&&s.pick==null){const q=s.items[s.i],opts=q.o||a.opts,right=typeof q.a==='number'?opts[q.a]:q.a;s.pick=opts[+d.opt];if(s.pick===right)s.ok++;else s.miss.push([q.plain||q.q||'',right,q.why||'']);return redrawAct()}
  if(d.next!==undefined){s.i++;s.pick=null;if(s.i>=s.items.length)s.done=true;return redrawAct()}
  if(d.again!==undefined){s.init=false;initAct(a,s);s.init=true;return redrawAct()}}},
gaps:{view(a,s){const n=a.items.length;let ok=0;
  if(a.inline){const body=a.items.map((it,i)=>{const v=s.val[i]||'';let st='';if(s.checked){const g=judge(it,v);st=g===true?'ok':'no';if(g===true)ok++}
    return `${it.html?it.pre:esc(it.pre||'')} <span class="ig ${st}"><input data-gap="${i}" value="${esc(v)}" ${i===0?'data-auto':''} autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Gap ${i+1}">${s.show?`<em>${esc(it.model||it.ans[0])}</em>`:''}</span> `}).join('')+esc(a.tail||'');
   return `<form data-form="gaps"><p class="cloze">${body}</p><div class="row"><button class="main">Check</button><button type="button" class="ghost" data-show>${s.show?'Hide the answers':'Show the answers'}</button>${s.checked?`<b class="score">${ok} of ${n} correct</b>`:''}</div></form>`}
  if(a.free)return `<ol class="gaps free">${a.items.map((it,i)=>`<li><span>${esc(it.pre)}</span><input class="long" data-gap="${i}" value="${esc(s.val[i]||'')}" placeholder="${esc(it.ph||'')}" autocomplete="off" spellcheck="false" ${i===0?'data-auto':''}></li>`).join('')}</ol>${a.after?`<p class="afterNote">${esc(a.after)}</p>`:''}`;
  const rows=a.items.map((it,i)=>{const v=s.val[i]||'';let st='';if(s.checked){const good=judge(it,v);st=good===true?'ok':good==='near'?'near':'no';if(good===true)ok++}
   return `<li class="${st}">${it.pre?`<span>${it.html?it.pre:esc(it.pre)}</span>`:''}<input data-gap="${i}" value="${esc(v)}" class="${it.long?'long':''}" placeholder="${esc(it.ph||'')}" autocomplete="off" autocapitalize="off" spellcheck="false" ${i===0?'data-auto':''}>${it.post?`<span>${esc(it.post)}</span>`:''}${s.show?`<em>${esc(it.model||it.ans[0])}</em>`:''}</li>`}).join('');
  return `<form data-form="gaps"><ol class="gaps${a.dense?' dense':''}${a.cols===2?' two':''}">${rows}</ol><div class="row"><button class="main">Check</button>${a.test&&!s.checked?'':`<button type="button" class="ghost" data-show>${s.show?'Hide the answers':'Show the answers'}</button>`}${s.checked?`<b class="score">${ok} of ${n}${a.open?' match the key. Compare the yellow ones with the model answer.':' correct'}</b>`:''}</div></form>`},
 input(a,s,t){if(t.dataset.gap!==undefined)s.val[+t.dataset.gap]=t.value},
 submit(a,s){s.checked=true;redrawAct()},
 click(a,s,d){if(d.show!==undefined){s.show=!s.show;redrawAct()}}},
pick:{view(a,s){let ok=0,bad=0;const chips=a.items.map((it,i)=>{const on=!!s.sel[i];let st='';if(s.checked){if(it.ok&&on){st='ok';ok++}else if(!it.ok&&on){st='no';bad++}else if(it.ok)st='missed'}
   return `<button data-chip="${i}" class="${on?'on ':''}${st}" ${s.checked?'disabled':''}>${esc(it.t)}${s.checked&&it.note&&(it.ok||on)?`<small>${esc(it.note)}</small>`:''}</button>`}).join('');
  const total=a.items.filter(x=>x.ok).length;
  return `<div class="pick${a.notes?' notes':''}">${chips}</div><div class="row">${s.checked?`<b class="score">${ok} of ${total} found${bad?', '+bad+' wrong':''}</b><button class="ghost" data-again>Try again</button>`:`<button class="main" data-check>Check</button><span class="muted">Choose ${total}.</span>`}</div>`},
 click(a,s,d){if(d.chip!==undefined){s.sel[+d.chip]=!s.sel[+d.chip];return redrawAct()}if(d.check!==undefined){s.checked=true;return redrawAct()}if(d.again!==undefined){s.sel={};s.checked=false;return redrawAct()}}},
order:{view(a,s){const good=s.checked&&s.seq.every((x,i)=>x===i);
  if(a.compact)return `<div class="order compact"><div><b class="lab">${esc(a.from||'Tap in the right order')}</b>${s.pool.map(i=>{const pos=s.seq.indexOf(i);return `<button data-take="${i}" class="${pos>=0?'picked ':''}${s.checked?(pos===i?'ok':'no'):''}" ${pos>=0?'disabled':''}><i>${pos>=0?pos+1:''}</i>${esc(a.items[i])}${s.checked&&pos!==i?`<small>${i+1}</small>`:''}</button>`}).join('')}</div></div>
   <div class="row"><button class="main" data-check ${s.seq.length<a.items.length?'disabled':''}>Check</button><button class="ghost" data-again>Start again</button>${s.checked?`<b class="score">${good?'All in order.':'Green numbers show the right place.'}</b>`:''}</div>`;
  return `<div class="order"><div><b class="lab">${esc(a.from||'Tap in the right order')}</b>${s.pool.map(i=>`<button data-take="${i}" ${s.seq.includes(i)?'disabled':''}>${esc(a.items[i])}</button>`).join('')}</div>
   <ol>${a.items.map((_,k)=>{const i=s.seq[k];return `<li class="${s.checked&&i!=null?(i===k?'ok':'no'):''}">${a.slots?`<small>${esc(a.slots[k])}</small>`:''}${i!=null?esc(a.items[i]):''}${s.checked&&i!==k?`<em>${esc(a.items[k])}</em>`:''}</li>`}).join('')}</ol></div>
   <div class="row"><button class="main" data-check ${s.seq.length<a.items.length?'disabled':''}>Check</button><button class="ghost" data-again>Start again</button>${s.checked?`<b class="score">${good?'All in order.':'Compare with the green answers.'}</b>`:''}</div>`},
 click(a,s,d){if(d.take!==undefined&&!s.checked){s.seq.push(+d.take);return redrawAct()}if(d.check!==undefined){s.checked=true;return redrawAct()}if(d.again!==undefined){s.seq=[];s.checked=false;return redrawAct()}}},
talk:{view(a,s){const c=a.cards[s.i],n=a.cards.length,secs=c.secs||a.secs||40,left=s.left==null?secs:s.left,R=34,C=2*Math.PI*R;
  const hidden=c.say&&!s.flip;const chips=c.chips||a.chips||[];
  return `<div class="talk"><div class="tcard"><span class="tag">${esc(c.tag||a.label||'Card')} ${n>1?(s.i+1)+' of '+n:''}</span>
    ${hidden?`<p class="q muted">The question is only spoken. Listen.</p>`:`<p class="q">${c.html||esc(c.q)}</p>`}${c.sub&&!hidden?`<p class="sub">${c.sub}</p>`:''}
    ${c.say?`<div class="row"><button class="main" data-play>${s.played?'Replay':'Play'}</button><button class="ghost" data-stop>Stop</button></div>`:''}</div>
   <div class="timer"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="${R}" class="tr"/><circle cx="40" cy="40" r="${R}" class="tf" id="tf" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-left/secs)}"/></svg><b id="tn">${left}</b><button class="ghost" data-timer>${s.run?'Pause':left===0?'Reset':'Start'}</button></div></div>
   ${chips.length?`<div class="chips"><b class="lab">${esc(a.chipLabel||'Tap a phrase when he uses it')} · <span id="usedN">${Object.values(s.used).filter(Boolean).length}</span> used</b>${chips.map((p,k)=>`<button data-used="${k}" class="${s.used[k]?'on':''}">${esc(p)}</button>`).join('')}</div>`:''}
   <div class="row nav3"><button class="ghost" data-back ${s.i===0?'disabled':''}>Back</button>${c.say?`<button class="ghost" data-flip>${s.flip?'Hide the text':'Flip the card'}</button>`:''}<button class="main" data-fwd>${s.i===n-1?'First card':'Next card'}</button></div>`},
 click(a,s,d){const c=a.cards[s.i],secs=c.secs||a.secs||40;
  if(d.play!==undefined){s.played=true;playClip(c.audio,c.say);return}
  if(d.stop!==undefined){hush();return}
  if(d.flip!==undefined){s.flip=!s.flip;return redrawAct()}
  if(d.used!==undefined){s.used[+d.used]=!s.used[+d.used];return redrawAct()}
  if(d.timer!==undefined){(s.spoke=s.spoke||{})[s.i]=1;if(s.run){s.run=false;clearInterval(tick);return redrawAct()}if(s.left===0||s.left==null)s.left=secs;s.run=true;clearInterval(tick);
    tick=setInterval(()=>{s.left--;const R=34,C=2*Math.PI*R,f=$('#tf'),n=$('#tn');if(f){f.setAttribute('stroke-dashoffset',C*(1-s.left/secs));n.textContent=s.left}if(s.left<=0){s.run=false;clearInterval(tick);redrawAct()}},1000);return redrawAct()}
  if(d.back!==undefined||d.fwd!==undefined){hush();clearInterval(tick);s.run=false;s.left=null;s.flip=false;s.played=false;if(!a.keepChips)s.used={};s.i=d.back!==undefined?s.i-1:(s.i+1)%a.cards.length;return redrawAct()}}},
map:{view(a,s){return `<div class="map"><div class="hub">${esc(a.centre)}</div><div class="branches">${a.branches.map((b,i)=>`<label><b>${esc(b.label)}</b>${Array.from({length:b.n||2},(_,k)=>`<input data-map="${i}_${k}" value="${esc(s.val[i+'_'+k]||'')}" placeholder="${esc((b.ph||[])[k]||'key words')}" autocomplete="off">`).join('')}</label>`).join('')}</div></div><p class="muted">Key words only, no sentences. The plan stays next to you on the writing step.</p>`},
 input(a,s,t){if(t.dataset.map!==undefined){s.val[t.dataset.map]=t.value;SHARED.map=s.val;SHARED.mapDef=a}}},
write:{view(a,s){return `${a.to?`<div class="mailHead compose"><div><b>To: ${esc(a.to)}</b><span>${esc(a.subject||'')}</span></div></div>`:''}<div class="write"><textarea data-text data-auto placeholder="${esc(a.ph||'Write here')}" spellcheck="false">${esc(s.text)}</textarea><div class="wside"><b id="wc"></b><ul id="chk"></ul>${a.submit?`<button class="main" data-send>${s.code?'Copy the code again':'Submit to teacher'}</button><span class="muted" id="sentMsg">${s.code?(s.shared?'Choose your teacher in the list.':'Code copied. Paste it in your chat with your teacher.'):''}</span>${s.code?`<input type="hidden" data-code value="${esc(s.code)}">`:''}`:`<button class="ghost" data-copy>Copy the text</button><span id="copied" class="muted"></span>`}</div></div>`},
 after(a,s){const t=s.text,n=words(t);const wc=$('#wc');if(!wc)return;wc.textContent=n+' words'+(a.min?' · aim for '+a.min+'–'+a.max:'');wc.className=a.min&&n>=a.min&&n<=a.max?'ok':'';
  $('#chk').innerHTML=a.checks.map(c=>`<li class="${c.test(t)?'ok':''}">${esc(c.label)}</li>`).join('')},
 input(a,s,t){if(t.dataset.text!==undefined){s.text=t.value;this.after(a,s)}},
 click(a,s,d){if(d.send!==undefined){const rep=(CFG.steps.find(x=>x.act&&x.act.type==='report')||{}).act||{};return sendCode(rep,s,()=>{redrawAct();ACT.write.after(a,s)})}
  if(d.copy!==undefined){const done=()=>{const c=$('#copied');if(c)c.textContent='Copied.'};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s.text).then(done,()=>{});else{const ta=$('[data-text]');ta.select();try{document.execCommand('copy');done()}catch(e){}}}}}
};
ACT.total={view(a,s){let sum=0,max=0,all=true;const rows=a.parts.map(p=>{const st=ST[p.step],ac=CFG.steps[p.step].act;let got=0,done=false;
   if(ac.type==='gaps'){done=!!st.checked;got=ac.items.filter((it,i)=>judge(it,(st.val||{})[i])===true).length*(p.half?.5:1)}
   if(ac.type==='quiz'){done=!!st.done;got=st.ok||0}
   if(!done)all=false;sum+=got;max+=p.max;return `<li class="${done?'':'wait'}"><span>${esc(p.label)}</span><b>${done?got+' / '+p.max:'not finished'}</b></li>`}).join('');
  const pct=sum/max;return `<div class="total"><ul>${rows}</ul><div class="sum"><b>${sum} / ${max}</b><span>${!all?'Finish and check every part to see the real total.':pct>=.9?'Excellent. Unit 1 is secure.':pct>=.75?'Good. Look again at the parts with lost points.':'Go back to the weakest part before Unit 2.'}</span></div></div>`}};
function reportText(a){const L=[a.name||CFG.kicker,''];CFG.steps.forEach((st,i)=>{const ac=st.act,s=ST[i]||{};if(!ac||ac.type==='report')return;L.push((i+1)+'. '+st.title);
  if(ac.type==='gaps'){const v=s.val||{};ac.items.forEach((it,k)=>L.push('   '+[it.pre,'['+(v[k]||'—')+']',it.post].filter(Boolean).join(' ')));if(!ac.free)L.push('   '+(s.checked?ac.items.filter((it,k)=>judge(it,v[k])===true).length+' of '+ac.items.length+(ac.open?' match the key':' correct'):'not checked'))}
  else if(ac.type==='quiz')L.push('   '+(s.done?s.ok+' of '+s.items.length+' correct':s.items&&(s.i||s.pick!=null)?'not finished: '+s.ok+' correct so far':'not done'));
  else if(ac.type==='pick')L.push('   '+(ac.items.filter((it,k)=>s.sel&&s.sel[k]).map(it=>it.t).join(', ')||'not done'));
  else if(ac.type==='map'){const v=s.val||SHARED.map||{};ac.branches.forEach((b,k)=>L.push('   '+b.label+': '+(Array.from({length:b.n||2},(_,j)=>v[k+'_'+j]).filter(Boolean).join(', ')||'—')))}
  else if(ac.type==='write')L.push('   '+(s.text?words(s.text)+' words':'not written'),s.text||'');
  else if(ac.type==='talk')L.push('   answered aloud: '+Object.keys(s.spoke||{}).length+' of '+ac.cards.length+' questions');L.push('')});return L.join('\n')}
function reportData(a){return {assignment:a.assignment,submitted:new Date().toISOString(),steps:CFG.steps.map((st,i)=>{const ac=st.act,s=ST[i]||{};if(!ac||ac.type==='report')return null;
  if(ac.type==='gaps'){const v=s.val||{};return {v:ac.items.map((_,k)=>v[k]||''),c:s.checked?1:0}}
  if(ac.type==='quiz')return {ok:s.ok||0,n:ac.items.length,d:s.done?1:0};
  if(ac.type==='pick')return {v:ac.items.map((_,k)=>s.sel&&s.sel[k]?1:0)};
  if(ac.type==='map'){const v=s.val||SHARED.map||{};return {v:ac.branches.map((b,k)=>Array.from({length:b.n||2},(_,j)=>v[k+'_'+j]||''))}}
  if(ac.type==='write')return {t:s.text||''};
  if(ac.type==='talk')return {n:Object.keys(s.spoke||{}).length,of:ac.cards.length};return null})}}
const b64u=bytes=>{let t='';bytes.forEach(b=>t+=String.fromCharCode(b));return btoa(t).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
async function reportCode(a){const raw=new TextEncoder().encode(JSON.stringify(reportData(a)));const pre=a.prefix||'HW';
  try{if(typeof CompressionStream==='function'){const cs=new CompressionStream('deflate-raw');const w=cs.writable.getWriter();w.write(raw);w.close();const buf=new Uint8Array(await new Response(cs.readable).arrayBuffer());return pre+'.'+b64u(buf)}}catch(e){}
  return pre+'r.'+b64u(raw)}
function reportTodo(){const L=[];CFG.steps.forEach((st,i)=>{const ac=st.act,s=ST[i]||{};if(!ac)return;let ok=true;
  if(ac.type==='gaps')ok=ac.items.every((_,k)=>(s.val||{})[k])&&(ac.free||!!s.checked);else if(ac.type==='quiz')ok=!!s.done;else if(ac.type==='write')ok=!!s.text&&(!ac.min||words(s.text)>=ac.min);else if(ac.type==='map')ok=Object.values(s.val||SHARED.map||{}).filter(Boolean).length>=ac.branches.length;else if(ac.type==='talk')ok=Object.keys(s.spoke||{}).length>=ac.cards.length;
  if(!ok)L.push(i+1)});return L}
function sendCode(a,s,fin){reportCode(a).then(code=>{s.code=code;s.shared=false;
  const copy=()=>{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(code).catch(()=>{});return Promise.resolve()};
  copy().then(()=>{let touch=false;try{touch=matchMedia('(pointer:coarse)').matches}catch(e){}if(touch&&navigator.share){s.shared=true;navigator.share({text:code}).catch(()=>{s.shared=false;fin()})}fin()})})}
ACT.report={view(a,s){const todo=reportTodo();
  return `<div class="write send"><textarea readonly data-report spellcheck="false">${esc(reportText(a))}</textarea><div class="wside">
   ${todo.length?`<b class="todo">Not finished: step${todo.length>1?'s':''} ${todo.join(', ')}</b><span class="muted">You can go back and finish, or send it as it is.</span>`:`<b class="ok">Everything is done.</b>`}
   <button class="main" data-send data-auto>${s.code?'Copy the code again':'Send to teacher'}</button>
   ${s.code?`<span class="muted" id="sentMsg">${s.shared?'Choose your teacher in the list.':'Your homework code is copied. Open your chat with your teacher, paste it (Ctrl + V) and send.'}</span><input readonly class="codeBox" data-code value="${esc(s.code)}" aria-label="Homework code">`:`<span class="muted">This makes a homework code for your teacher.</span>`}</div></div>`},
 click(a,s,d){if(d.send!==undefined)sendCode(a,s,redrawAct)}};

ACT.explain={view(a,s){const n=a.items.length;
  if(s.i>=n)return `<div class="exEnd"><span class="tag">${esc(a.endLabel||'All the rules')}</span><ol>${a.items.map(it=>`<li><b>${esc(it.name)}</b><span>${esc(it.sum||'')||it.rule}</span></li>`).join('')}</ol><div class="row"><button class="ghost" data-again>Start again</button></div></div>`;
  const it=a.items[s.i],open=!!s.shown[s.i];
  return `<div class="qhead"><span class="tag">${esc(a.label||'Rule')} ${s.i+1} of ${n}</span><b>${esc(it.name)}</b></div>
   <p class="q small">${it.ask}</p>
   ${open?`<div class="fb ok rule"><b>${esc(it.head||'The rule')}</b><span>${it.rule}</span>${it.eg?`<em>${it.eg}</em>`:''}</div>`:`<p class="muted">${esc(a.wait||'Gabi answers first. Then open the rule.')}</p>`}
   <div class="row nav3"><button class="ghost" data-back ${s.i===0?'disabled':''}>Back</button>${open?`<button class="main" data-fwd data-auto>${s.i===n-1?'See all the rules':'Next rule'}</button>`:`<button class="main" data-reveal data-auto>Show the rule</button>`}</div>`},
 after(a,s){const it=a.items[s.i],on=it&&s.shown[s.i]?it.k:null;document.querySelectorAll('#sheet .text mark[data-k]').forEach(m=>m.classList.toggle('lit',!!on&&m.dataset.k.split(' ').includes(on)));const f=document.querySelector('#sheet .text mark.lit');if(f&&f.scrollIntoView)f.scrollIntoView({block:'nearest'})},
 click(a,s,d){if(d.reveal!==undefined)s.shown[s.i]=true;else if(d.fwd!==undefined)s.i++;else if(d.back!==undefined)s.i=Math.max(0,s.i-1);else if(d.again!==undefined){s.i=0;s.shown={}}else return;redrawAct();this.after(a,s)}};
function judge(it,v){const raw=String(v||'').trim().toLowerCase();if(raw&&(it.ans||[]).some(x=>String(x).toLowerCase()===raw))return true;const n=nz(v);if(!n)return false;if((it.ans||[]).some(x=>nz(x)===n))return true;if(it.kw){return it.kw.some(g=>g.every(k=>n.includes(k)))?true:'near'}return false}
function review(rows){return rows.length?`<div class="review"><b>Look again</b><ol>${rows.map(r=>`<li><span>${esc(r[0])}</span><em>${esc(r[1])}</em>${r[2]?`<small>${esc(r[2])}</small>`:''}</li>`).join('')}</ol></div>`:'<p class="clean">Nothing to review.</p>'}

/* ---------- events ---------- */
function act(kind,name,el,d){const step=CFG.steps[cur],s=ST[cur],A=step.act&&ACT[step.act.type];if(!A)return;if(kind==='submit'&&A.submit)A.submit(step.act,s,el)}
function onClick(e){const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset,step=CFG.steps[cur],s=ST[cur];
 if(d.plbtn!==undefined||d.plback!==undefined){const box=b.closest('.pl'),el=box.querySelector('audio');if(d.plback!==undefined){el.currentTime=Math.max(0,el.currentTime-10);return}
  if(el.paused){document.querySelectorAll('audio').forEach(x=>{if(x!==el)x.pause()});try{speechSynthesis.cancel()}catch(_){}const p=el.play();if(p&&p.catch)p.catch(()=>{})}else el.pause();return}
 if(d.open!==undefined){s.open=true;hush();return draw()}
 if(d.hide!==undefined){clearInterval(tick);s.hidden=true;s.open=true;return draw()}
 if(d.peek!==undefined){s.hidden=false;s.left=null;return draw()}
 if(d.say!==undefined&&!b.closest('#act')){hush();return say(step.side.audio[+d.say].script)}
 if(d.stop!==undefined&&!b.closest('#act')){return hush()}
 const A=step.act&&ACT[step.act.type];if(A&&A.click&&b.closest('#act'))A.click(step.act,s,d,b);
 if(step.act&&step.act.type==='write')ACT.write.after(step.act,s)}
function onInput(e){const step=CFG.steps[cur],s=ST[cur],A=step.act&&ACT[step.act.type];if(A&&A.input)A.input(step.act,s,e.target)}
const _draw=draw;draw=function(){_draw();const step=CFG.steps[cur],A=step.act&&ACT[step.act.type];if(A&&A.after&&$('#act'))A.after(step.act,ST[cur])};
window.Lesson={boot,words,nz};
})();
