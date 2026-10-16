/* Russia: speaking tasks 1–4 and letters (Task 37) with questions about Russia.
   Every card has two sides: the task on the front, the answers on the back.
   Nothing is saved: the page always opens clean, from the first card. */
const main=$('#main'),tabs=$('#tabs'),IV=window.RUIV,RD=window.RUREAD,ADS=window.RUADS,P4=window.RUP4,XL=window.RULET;
const isRu=q=>q.k==='country'||/Russia/.test(q.t);
const LET=window.W37.filter(l=>l.q.some(isRu));
const S={tab:0,iv:{v:0,q:0,flip:false},t1:{v:0,flip:false},t2:{v:0,flip:false},t4:{v:0,flip:false},lt:{v:0,flip:false},pics:{}};
const TABS=[['Interview','#3f6b4f',interview],['Reading aloud','#2c7f78',reading],['Questions','#2b6f69',questions],['Monologue','#4c7f4a',monologue],['Letters','#a0742c',letters]];
let cleanup=null,flipNow=null;
/* real flip: the card turns over, the other side is painted at the half-way point; a click on the card flips it too */
function makeFlip(st,card,paint){let busy=false;const f=()=>{if(busy)return;busy=true;card.classList.add('flipout');setTimeout(()=>{st.flip=!st.flip;paint();card.classList.remove('flipout');card.classList.add('flipin');setTimeout(()=>{card.classList.remove('flipin');busy=false;},270);},170);};
  card.classList.add('flipcard');card.onclick=e=>{if(e.target.closest('button,a,input,label,select,audio,[contenteditable]'))return;f();};flipNow=f;return f;}
function paintTabs(){tabs.innerHTML='';TABS.forEach((t,k)=>{const b=el('button','tab'+(k===S.tab?' on':''),t[0]);b.type='button';b.style.setProperty('--step',t[1]);b.onclick=()=>{S.tab=k;redraw();};tabs.append(b);});}
function redraw(){if(cleanup){cleanup();cleanup=null;}flipNow=null;document.querySelectorAll('.overlay.smp').forEach(x=>x.remove());paintTabs();main.innerHTML='';TABS[S.tab][2]();}
function head(t,src){main.append(el('div','inst','<b>'+t+'</b>'+(src?'<span class="src">'+src+'</span>':'')));}
function recBtn(){const b=btn('',async()=>{if(!Rec.on){if(!(await Rec.enable())){b.textContent='No microphone';return;}Rec.on=true;}else Rec.on=false;paint();},'sm wide');const paint=()=>{b.textContent='Recording: '+(Rec.on?'on':'off');b.classList.toggle('main',Rec.on);};paint();return b;}
/* variant navigation: Back / select / Next / Flip */
function varNav(st,list,name,extra){const n=list.length,nav=el('div','navrow'),sel=el('select','rusel');sel.setAttribute('aria-label',name);list.forEach((x,k)=>sel.append(new Option((k+1)+'. '+x,k)));sel.value=st.v;
  const set=v=>{st.v=v;st.flip=false;if(st.q!=null)st.q=0;redraw();};sel.onchange=()=>set(+sel.value);
  const bk=btn('← Back',()=>set(st.v-1)),fw=btn(st.v<n-1?'Next →':'Start again',()=>set(st.v<n-1?st.v+1:0));bk.disabled=st.v===0;
  nav.append(bk,sel,fw,btn('Flip the card',()=>flipNow&&flipNow(),'main'));if(extra)extra.forEach(x=>nav.append(x));nav.append(el('span','note hint',name+' '+(st.v+1)+' of '+n+' · answers on the back: click the card'));main.append(nav);}
/* timer with phases (preparation / answer) */
function runner(o){let i=-1,end=0,left=0,t=null,paused=false;const b=o.ring.querySelector('b'),sp=o.ring.querySelector('span');
  const paint=()=>{const p=o.phases[i];b.textContent=mmss(left);o.ring.classList.toggle('ans',p.kind==='answer');o.ring.classList.remove('end');o.ring.style.background='conic-gradient('+(p.kind==='answer'?'var(--acc)':'var(--blue)')+' '+(left/p.sec*360)+'deg,#e1ece8 0)';};
  const tick=()=>{left=(end-Date.now())/1000;if(left<=0){next();return;}paint();};
  function enter(){const p=o.phases[i];left=p.sec;end=Date.now()+left*1000;sp.textContent=p.kind==='answer'?'answer':'preparation';o.label.textContent=p.label;paint();beep(p.kind==='answer'?880:660,220);if(p.kind==='answer')Rec.start();o.onPhase&&o.onPhase(i);clearInterval(t);t=setInterval(tick,200);}
  function next(){clearInterval(t);if(i>=0&&o.phases[i].kind==='answer'&&(i+1>=o.phases.length||o.phases[i+1].kind!=='answer'))Rec.stop(o.recBox,o.recName);
    i++;if(i>=o.phases.length){i=o.phases.length;b.textContent='0:00';sp.textContent='time is up';o.label.textContent='Task completed';o.ring.classList.add('end');o.ring.style.background='';beep(520,500);o.onPhase&&o.onPhase(-1);return;}paused=false;enter();}
  return {start(){clearInterval(t);Rec.cancel();o.recBox.innerHTML='';i=-1;next();},skip(){if(i>=0&&i<o.phases.length)next();},
    pause(){if(i<0||i>=o.phases.length)return false;if(!paused){paused=true;clearInterval(t);left=(end-Date.now())/1000;}else{paused=false;end=Date.now()+left*1000;t=setInterval(tick,200);}return paused;},stop(){clearInterval(t);Rec.cancel();}};}
/* two-sided task card with the timer panel */
function shell(st,front,back,phases,recName,onPhase,bind){
  const stage=el('div','stage'),card=el('div','panel grow kim'),ctl=el('div','panel ctl col');
  const paintCard=()=>{card.classList.toggle('rback',st.flip);card.innerHTML=st.flip?back():front();card.scrollTop=0;if(!st.flip&&bind)bind(card);};paintCard();const flip=makeFlip(st,card,paintCard);
  const ring=el('div','ring','<b>'+mmss(phases[0].sec)+'</b><span>ready</span>'),label=el('div','phase','Press Start'),recBox=el('div','rec');
  const run=runner({ring,label,phases,recBox,recName,onPhase});
  const startB=btn('Start',()=>{if(st.flip){st.flip=false;paintCard();}run.start();startB.textContent='Restart';pauseB.disabled=skipB.disabled=false;pauseB.textContent='Pause';},'main wide'),
    pauseB=btn('Pause',()=>{pauseB.textContent=run.pause()?'Resume':'Pause';},'sm'),skipB=btn('Skip',()=>run.skip(),'sm');pauseB.disabled=skipB.disabled=true;
  const box=el('div','ctlbtns');box.append(startB,pauseB,skipB,recBtn());ctl.append(ring,label,box,recBox);stage.append(card,ctl);main.append(stage);
  cleanup=()=>{run.stop();};return card;}

/* ---------- Task 3. Interview: the question is only heard ---------- */
function interview(){
  const st=S.iv,v=IV[st.v];let left=40,t=null;const au=new Audio();au.preload='auto';
  head('Task 3. You are going to give an interview. You have to answer five questions. Give full answers to the questions (2–3 sentences). Remember that you have 40 seconds to answer each question.');
  const top=el('div','ivtop'),sel=el('select');sel.setAttribute('aria-label','Topic');IV.forEach((x,k)=>sel.append(new Option((k+1)+'. '+x.theme,k)));sel.value=st.v;
  sel.onchange=()=>{st.v=+sel.value;st.q=0;st.flip=false;redraw();};top.append(el('span','note','Topic:'),sel);
  const qc=el('div','chips');v.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;redraw();};qc.append(b);});top.append(el('span','note','Question:'),qc);
  top.append(btn('Introduction',()=>play('intro'),'sm'));main.append(top);
  const stage=el('div','stage'),card=el('div','ivcard'),side=el('div','panel ctl col');
  const ring=el('div','ring ans','<b>40</b><span>seconds</span>'),label=el('div','phase','Press Play');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};const recBox=el('div','rec');
  const runT=()=>{stopT();left=40;paint();label.textContent='Answer';beep(880,200);Rec.start();const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Time is up';beep(520,500);Rec.stop(recBox,v.id+'-q'+(st.q+1));}},200);};
  function play(what){stopT();Rec.cancel();left=40;paint();au.pause();au.src='audio/'+v.id+'-'+what+'.mp3?v=17c';label.textContent=what==='intro'?'Introduction is playing':'Question is playing';
    au.onended=()=>{if(what==='intro'){label.textContent='Now press Play';}else runT();};au.onerror=()=>{label.textContent='Audio did not load';};au.play().catch(()=>{label.textContent='Audio did not load';});}
  function face(){card.className='ivcard flipcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip)card.append(el('div','ey','Question '+(st.q+1)+' · '+esc(v.theme)),el('div','qq',esc(v.q[st.q])),el('div','ey','Sample answer'),el('div','smpa',ED.t('ru.iv.'+v.id+'.'+st.q,v.a[st.q])));
    else{card.append(el('div','ey',esc(v.theme)+' · question '+(st.q+1)+' of 5'),el('div','big','Listen and answer'),el('div','note hint','The question is only heard. Click the card to flip it: the text and a sample answer are on the back.'));
      const pb=el('div','navrow');pb.append(btn('Play',()=>play('q'+(st.q+1)),'main'),btn('Replay',()=>play('q'+(st.q+1))),btn('Stop',()=>{au.pause();stopT();Rec.cancel();label.textContent='Stopped';}));card.append(pb);}}
  face();const flip=makeFlip(st,card,face);
  const box=el('div','ctlbtns');box.append(btn('Timer',runT,'sm'),btn('Reset',()=>{stopT();Rec.cancel();left=40;paint();label.textContent='Press Play';},'sm'),recBtn());
  side.append(ring,label,box,recBox);stage.append(card,side);main.append(stage);
  const last=st.q===4&&st.v===IV.length-1,nav=el('div','navrow');
  const bk=btn('← Back',()=>{st.q--;st.flip=false;redraw();}),fw=btn(st.q<4?'Next →':(last?'Start again':'Next topic →'),()=>{if(st.q<4)st.q++;else{st.v=last?0:st.v+1;st.q=0;}st.flip=false;redraw();});bk.disabled=st.q===0;
  nav.append(bk,btn('Flip the card',flip,'main'),fw,el('span','note hint','Topic '+(st.v+1)+' of '+IV.length+' · 5 points · questions and audio are made for this site in the exam format.'));main.append(nav);
  cleanup=()=>{stopT();au.pause();Rec.cancel();};
}

/* ---------- Task 1. Reading aloud ---------- */
function reading(){
  const st=S.t1,r=RD[st.v];
  const front='<p class="task">Task 1. Imagine that you are preparing a project with your friend. You have found some interesting material for the presentation and you want to read this text to your friend. You have 1.5 minutes to read the text silently, then be ready to read it out aloud. You will not have more than 1.5 minutes to read it.</p><div class="textbox">'+esc(r.x)+'</div>';
  const back='<div class="ey">'+esc(r.t)+' · what to check</div><p class="bk"><b>Words to pronounce carefully:</b> '+esc(r.note)+'.</p><p class="bk"><b>1 point:</b> the speech is easy to follow, with no unnatural pauses; phrasal stress and intonation are correct; no more than five phonetic mistakes, of which no more than two change the meaning.</p><p class="bk"><b>0 points:</b> the text is not finished in 1.5 minutes, or there are more mistakes.</p><p class="bk"><b>Remember:</b> pause at commas and full stops, let your voice fall at the end of a statement, read numbers and dates in full, pronounce the endings -ed and -s.</p>';
  shell(st,()=>front,()=>back,[{label:'Preparation · read silently',kind:'prep',sec:90},{label:'Answer · read aloud',kind:'answer',sec:90}],'task1-'+(st.v+1));
  varNav(st,RD.map(x=>x.t),'Text',[el('span','note hint',words(r.x)+' words · 1 point.')]);
}

/* ---------- Task 2. Questions about an advertisement ---------- */
function questions(){
  const st=S.t2,a=ADS[st.v];
  const front='<p class="task">Task 2. Study the advertisement.</p><div class="adrow"><div class="ruad" style="background:'+a.c+'"><b>'+esc(a.title)+'</b><span>'+esc(a.sub)+'</span></div><div><p class="task">'+esc(a.intro)+' In 1.5 minutes you are to ask four direct questions to find out about the following:</p><ol id="pts">'+a.points.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ol><p class="task">You have 20 seconds to ask each question.</p></div></div>';
  const back='<div class="ey">'+esc(a.title)+' · sample questions</div><ol class="bkl">'+a.key.map((x,k)=>'<li><i>'+esc(a.points[k])+'</i><br>'+ED.t('ru.t2.'+st.v+'.'+k,x.replace(/ \/ /g,'\n'))+'</li>').join('')+'</ol><p class="bk sm">1 point for each direct, grammatically correct question on the point. No points for an indirect question, wrong word order or a missing auxiliary verb.</p>';
  shell(st,()=>front,()=>back,[{label:'Preparation',kind:'prep',sec:90}].concat(a.points.map((p,k)=>({label:'Question '+(k+1),kind:'answer',sec:20}))),'task2-'+(st.v+1),
    i=>{[...document.querySelectorAll('#pts li')].forEach((x,k)=>{x.className=i<1?'':(k===i-1?'now':(k<i-1?'past':''));});});
  varNav(st,ADS.map(x=>x.title.replace(/[!:].*$/,'')),'Advertisement',[el('span','note hint','4 points.')]);
}

/* ---------- Task 4. Monologue: two photos for a project ---------- */
function monologue(){
  const st=S.t4,p=P4[st.v];
  const pic=k=>{const u=S.pics[st.v+'-'+k];return '<figure><figcaption>Photo '+(k+1)+'</figcaption>'+(u?'<img src="'+u+'" alt="Photo '+(k+1)+'">':'<label class="slot"><input type="file" accept="image/*" data-k="'+k+'" hidden><span>'+esc(p.cap[k])+'</span><i>Click to add a photo</i></label>')+'</figure>';};
  const front=()=>'<div class="t4"><div><p class="task">Task 4. Imagine that you and your friend are doing a school project “'+esc(p.project)+'”. You have found some photos to illustrate it but for technical reasons you cannot send them now. Leave a voice message to your friend explaining your choice of the photos and sharing some ideas about the project. In 2.5 minutes be ready to:</p><ul><li>explain the choice of the illustrations for the project by briefly describing them and noting the differences;</li><li>mention the advantages (1–2) of '+esc(p.kind)+';</li><li>mention the disadvantages (1–2) of '+esc(p.kind)+';</li><li>express your opinion on the subject of the project – '+esc(p.pref)+'.</li></ul><p class="task">You will speak for not more than 3 minutes (12–15 sentences). You have to talk continuously.</p></div><div class="pics">'+pic(0)+pic(1)+'</div></div>';
  const back='<div class="ey">'+esc(p.project)+' · sample answer</div>'+p.s.map((x,k)=>'<p class="bk"><i>'+window.RUP4LAB[k]+'.</i> '+ED.t('ru.t4.'+st.v+'.'+k,x)+'</p>').join('');
  shell(st,front,()=>back,[{label:'Preparation',kind:'prep',sec:150},{label:'Answer · voice message',kind:'answer',sec:180}],'task4-'+(st.v+1),null,
    card=>card.querySelectorAll('input[type=file]').forEach(inp=>{inp.onchange=()=>{const f=inp.files[0];if(f){S.pics[st.v+'-'+inp.dataset.k]=URL.createObjectURL(f);card.innerHTML=front();card.querySelectorAll('input[type=file]').forEach(i2=>i2.onchange=inp.onchange);}};}));
  varNav(st,P4.map(x=>x.project),'Project',[el('span','note hint','10 points.')]);
}

/* ---------- Task 37. Letters with questions about Russia ---------- */
function letters(){
  const st=S.lt,x=LET[st.v],her=x.g==='her',ext=XL[x.id+'-'+x.name]||[];
  head('Task 37. Letters with questions about Russia. Read the letter and answer the questions aloud, then flip the card to see the answers.');
  const stage=el('div','stage'),card=el('div','panel grow kim');
  const paintCard=()=>{card.classList.toggle('rback',st.flip);card.scrollTop=0;
  if(!st.flip){card.innerHTML='<p class="task">You have received '+(x.email?'an email message':'a letter')+' from your English-speaking pen-friend '+esc(x.name)+':</p><div class="stim" style="font-size:21px;line-height:1.5">'+
      (x.email?'<div class="hd">From: '+esc(x.name)+'@mail.uk<br>To: Russian_friend@ege.ru<br>Subject: '+esc(x.subject)+'</div>':'')+'…'+esc(x.lead)+' '+x.q.map(q=>isRu(q)?'<mark>'+esc(q.t)+'</mark>':esc(q.t)).join(' ')+'<br>…'+esc(x.trig)+'…</div>'+
      '<p class="task" style="margin:8px 0 0">Write '+(x.email?'an email':'a letter')+' to '+esc(x.name)+': answer '+(her?'her':'his')+' questions and ask 3 questions about '+esc(x.about)+'. Write 100–140 words.</p><p class="note hint" style="margin:6px 0 0">Questions about Russia are marked. Do not write about yourself there: speak about Russian teenagers, the country or your region.</p>';}
  else{let n=0;card.innerHTML='<div class="ey">'+esc(x.topic)+' · '+esc(x.name)+' · answers</div>'+x.q.map((q,k)=>{const e=isRu(q)?ext[n++]:null;return '<div class="rq"><b>'+(isRu(q)?'<span class="tg">Russia</span>':'')+esc(q.t)+'</b><p><i>In the letter:</i> '+ED.t('lt.'+x.id+'-'+x.name+'.'+k+'.a',x.ans[k])+'</p>'+(e?'<p><i>Speaking, 2–3 sentences:</i> '+ED.t('lt.'+x.id+'-'+x.name+'.'+k+'.s',e)+'</p>':'')+'</div>';}).join('');}};paintCard();makeFlip(st,card,paintCard);
  stage.append(card);main.append(stage);
  varNav(st,LET.map(l=>l.topic+' · '+l.name),'Letter',[btn('Whole sample letter',()=>showSample('Task 37 · sample letter','<p>'+ED.t('lt.'+x.id+'-'+x.name+'.model',x.model)+'</p>',words(x.model)+' words. This is a sample, not the only correct answer.'),'sm')]);
}
redraw();
