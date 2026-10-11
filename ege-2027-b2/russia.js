/* Russia: interview questions about Russia (Task 3, audio only) and letters with questions about Russia (Task 37).
   Nothing is saved: the page always opens clean, from the first card. */
const main=$('#main'),tabs=$('#tabs'),IV=window.RUIV;
const LET=window.W37.filter(l=>l.q.some(q=>q.k==='country'||/Russia/.test(q.t)));
const isRu=q=>q.k==='country'||/Russia/.test(q.t);
const S={tab:0,iv:{v:0,q:0,flip:false,smp:false},lt:{i:0,open:{}}};
const TABS=[['Interview · Task 3','#4a4f8f',interview],['Letters · Task 37','#2c7f78',letters]];
let cleanup=null;
function paintTabs(){tabs.innerHTML='';TABS.forEach((t,k)=>{const b=el('button','tab'+(k===S.tab?' on':''),t[0]);b.type='button';b.style.setProperty('--step',t[1]);b.onclick=()=>{S.tab=k;redraw();};tabs.append(b);});}
function redraw(){if(cleanup){cleanup();cleanup=null;}document.querySelectorAll('.overlay.smp').forEach(x=>x.remove());paintTabs();main.innerHTML='';TABS[S.tab][2]();}
function head(t,src){main.append(el('div','inst','<b>'+t+'</b>'+(src?'<span class="src">'+src+'</span>':'')));}

/* ---------- Interview: one card at a time, the question is only heard ---------- */
function interview(){
  const st=S.iv,v=IV[st.v];let left=40,t=null;const au=new Audio();au.preload='auto';
  head('Task 3. You are going to give an interview. You have to answer five questions. Give full answers to the questions (2–3 sentences). Remember that you have 40 seconds to answer each question.');
  const top=el('div','ivtop'),sel=el('select');sel.setAttribute('aria-label','Topic');IV.forEach((x,k)=>sel.append(new Option((k+1)+'. '+x.theme,k)));sel.value=st.v;
  sel.onchange=()=>{st.v=+sel.value;st.q=0;st.flip=false;st.smp=false;redraw();};top.append(el('span','note','Topic:'),sel);
  const qc=el('div','chips');v.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;st.smp=false;redraw();};qc.append(b);});top.append(el('span','note','Question:'),qc);
  top.append(btn('Introduction',()=>play('intro'),'sm'));main.append(top);
  const stage=el('div','stage'),card=el('div','ivcard'),side=el('div','panel ctl col');
  const ring=el('div','ring ans','<b>40</b><span>seconds</span>'),label=el('div','phase','Press Play');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};
  const recBox=el('div','rec');
  const runT=()=>{stopT();left=40;paint();label.textContent='Answer';beep(880,200);Rec.start();const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Time is up';beep(520,500);Rec.stop(recBox,v.id+'-q'+(st.q+1));}},200);};
  function play(what){stopT();Rec.cancel();left=40;paint();au.pause();au.src='audio/'+v.id+'-'+what+'.mp3?v=17';label.textContent=what==='intro'?'Introduction is playing':'Question is playing';
    au.onended=()=>{if(what==='intro'){label.textContent='Now press Play';}else runT();};au.onerror=()=>{label.textContent='Audio did not load';};au.play().catch(()=>{label.textContent='Audio did not load';});}
  function face(){card.className='ivcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip){card.append(el('div','ey','Question '+(st.q+1)+' · '+esc(v.theme)),el('div','qq',esc(v.q[st.q])));
      if(st.smp)card.append(el('div','ey','Sample answer'),el('div','smpa',esc(v.a[st.q])));else card.append(el('div','tip','A full answer is 2–3 sentences: a direct answer, then a reason or an example. Use the same tense as in the question.'));
      card.append(btn(st.smp?'Hide the answer':'Sample answer',()=>{st.smp=!st.smp;face();},'sm'));}
    else{card.append(el('div','ey',esc(v.theme)+' · question '+(st.q+1)+' of 5'),el('div','big','Listen and answer'),el('div','note','The question is only heard. The text is on the back of the card.'));
      const pb=el('div','navrow');pb.append(btn('Play',()=>play('q'+(st.q+1)),'main'),btn('Replay',()=>play('q'+(st.q+1))),btn('Stop',()=>{au.pause();stopT();Rec.cancel();label.textContent='Stopped';}));card.append(pb);}}
  face();
  const rb=recToggle();rb.textContent='Recording: '+(Rec.on?'on':'off');const rclick=rb.onclick;rb.onclick=async()=>{await rclick();rb.textContent=rb.textContent.indexOf('недоступен')>0?'No microphone':'Recording: '+(Rec.on?'on':'off');};
  const box=el('div','ctlbtns');box.append(btn('Timer',runT,'sm'),btn('Reset',()=>{stopT();Rec.cancel();left=40;paint();label.textContent='Press Play';},'sm'),rb);
  side.append(ring,label,box,recBox);stage.append(card,side);main.append(stage);
  const last=st.q===4&&st.v===IV.length-1,nav=el('div','navrow');
  const bk=btn('← Back',()=>{st.q--;st.flip=false;st.smp=false;redraw();}),
    fw=btn(st.q<4?'Next →':(last?'Start again':'Next topic →'),()=>{if(st.q<4)st.q++;else{st.v=last?0:st.v+1;st.q=0;}st.flip=false;st.smp=false;redraw();});bk.disabled=st.q===0;
  nav.append(bk,btn('Flip the card',()=>{st.flip=!st.flip;face();},'main'),fw,el('span','note','Topic '+(st.v+1)+' of '+IV.length+' · 5 points · questions and audio are made for this site in the exam format.'));main.append(nav);
  cleanup=()=>{stopT();au.pause();Rec.cancel();};
}

/* ---------- Letters with questions about Russia ---------- */
function letters(){
  const st=S.lt,x=LET[st.i],her=x.g==='her';
  head('Task 37. Letters with questions about Russia. Read the letter, answer the questions aloud, then open the sample answers.',(st.i+1)+' of '+LET.length);
  const stage=el('div','stage'),a=el('div','panel side kim'),b=el('div','panel grow');a.style.flexBasis='46%';a.style.width='46%';a.style.fontSize='19px';
  const body=esc(x.lead)+' '+x.q.map(q=>isRu(q)?'<mark>'+esc(q.t)+'</mark>':esc(q.t)).join(' ')+'<br>…'+esc(x.trig)+'…';
  a.innerHTML='<p class="task">You have received '+(x.email?'an email message':'a letter')+' from your English-speaking pen-friend '+esc(x.name)+':</p><div class="stim" style="font-size:19px;line-height:1.42">'+
    (x.email?'<div class="hd">From: '+esc(x.name)+'@mail.uk<br>To: Russian_friend@ege.ru<br>Subject: '+esc(x.subject)+'</div>':'')+'…'+body+'</div>'+
    '<p class="task" style="margin:8px 0 0">Write '+(x.email?'an email':'a letter')+' to '+esc(x.name)+': answer '+(her?'her':'his')+' questions and ask 3 questions about '+esc(x.about)+'. Write 100–140 words.</p>';
  x.q.forEach((q,k)=>{const r=el('div','ruq'+(isRu(q)?' ru':''));r.append(el('div','qt',(isRu(q)?'<span class="tg">Russia</span>':'')+esc(q.t)));
    if(st.open[k])r.append(el('div','an',esc(x.ans[k])));
    r.append(btn(st.open[k]?'Hide the answer':'Sample answer',()=>{st.open[k]=!st.open[k];redraw();},'sm'));r.lastChild.style.marginTop='6px';b.append(r);});
  b.append(el('p','note','Questions about Russia are marked. Do not write about yourself there: speak about Russian teenagers, the country or your region (Most Russian teenagers … · In my country … · In my region …).'));
  stage.append(a,b);main.append(stage);
  const nav=el('div','navrow'),sel=el('select','rusel');sel.setAttribute('aria-label','Letter');LET.forEach((l,k)=>sel.append(new Option((k+1)+'. '+l.topic+' · '+l.name,k)));sel.value=st.i;sel.onchange=()=>{st.i=+sel.value;st.open={};redraw();};
  const bk=btn('← Back',()=>{st.i--;st.open={};redraw();}),fw=btn(st.i<LET.length-1?'Next →':'Start again',()=>{st.i=st.i<LET.length-1?st.i+1:0;st.open={};redraw();});bk.disabled=st.i===0;
  nav.append(bk,sel,fw,btn('Whole sample letter',()=>showSample('Task 37 · sample letter',sampleParas(x.model),words(x.model)+' words. This is a sample, not the only correct answer.'),'main'));
  main.append(nav);
}
redraw();
