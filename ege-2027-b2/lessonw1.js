/* Занятие 1 · неделя 1 · блок 1 «Family and friends».
   Материал для учениц – только на английском; заметки для учителя – по-русски, под кнопкой «Учителю».
   Ничего не сохраняется: страница каждый раз открывается с первого шага. */
const main=$('#main'),tabs=$('#tabs');

/* ---------- Материал ---------- */
const WORDS=[
 ['get on (well) with sb','to have a friendly relationship with someone','I get on really well with my older brother.'],
 ['fall out with sb','to stop being friends after an argument','She fell out with her best friend over a silly joke.'],
 ['make up (with sb)','to become friends again after an argument','We argued in the morning but made up by lunchtime.'],
 ['look up to sb','to admire and respect someone','I have always looked up to my grandfather.'],
 ['take after sb','to look or behave like an older relative','Everyone says I take after my mum.'],
 ['bring up a child','to look after a child until they are an adult','My parents brought me up to be honest.'],
 ['rely on sb','to trust someone to help or support you','I know I can always rely on my sister.'],
 ['generation gap','differences in ideas between young and older people','The generation gap shows when we talk about music.'],
 ['household chores','everyday jobs in the home, like washing up','We share the household chores at weekends.'],
 ['spend quality time','to give each other full attention','We try to spend quality time together every Sunday.'],
 ['close-knit family','a family whose members support each other','I come from a close-knit family.'],
 ['sibling rivalry','competition between brothers and sisters','There was some sibling rivalry when we were little.'],
 ['peer pressure','influence from people of your own age','Peer pressure can make teenagers do silly things.'],
 ['set an example','to behave in a way others should copy','Older children should set an example.'],
 ['have a lot in common','to share interests or opinions','My best friend and I have a lot in common.'],
 ['a shoulder to cry on','someone who listens when you are upset','A real friend is a shoulder to cry on.']];

const HUNT=[
 ['How much costs the photo session?','How much does the photo session cost?','Present Simple question: does + infinitive.'],
 ['Where the studio is located?','Where is the studio located?','Question word + verb + subject.'],
 ['Can you tell me what time do you open?','What time do you open?','Only direct questions in task 2.'],
 ['Is there any discounts for large families?','Are there any discounts for large families?','Plural noun: are there.'],
 ['Do you offering home visits?','Do you offer home visits?','Do + infinitive, no -ing.'],
 ['How long the session lasts?','How long does the session last?','Auxiliary does; the main verb has no -s.'],
 ['What kind of photos you take?','What kind of photos do you take?','Do not forget the auxiliary verb.'],
 ['Do I need book in advance?','Do I need to book in advance?','need + to + infinitive.']];

const ADS=[
 {title:'Family Memories Photo Studio',sub:'Professional photo sessions for the whole family',c:'#2c7f78',intro:'You are considering having a family photo session and now you’d like to get more information.',
  points:['location of the studio','price of a session','discounts for large families','number of photos you get'],
  key:['Where is the studio located?\nWhere can I find the studio?','How much does a session cost?\nWhat is the price of a photo session?','Are there any discounts for large families?\nDo you offer discounts for large families?','How many photos do we get?\nHow many photos are included in the price?']},
 {title:'Family Weekend Camp',sub:'Two days of fun for parents and children',c:'#4a4f8f',intro:'You are considering going to the camp with your family and now you’d like to get more information.',
  points:['dates of the next camp','activities for parents and children','accommodation','price for a family of four'],
  key:['When is the next camp?\nWhat are the dates of the next camp?','What activities are there for parents and children?\nWhat can parents and children do together?','Where do families stay?\nWhat kind of accommodation do you offer?','How much does the camp cost for a family of four?\nWhat is the price for a family of four?']}];

const IV=[
 {id:'w1a',theme:'Family life',intro:'Hello everybody! It’s the Teenagers Talk radio programme. Today we are talking about family life, and our guest is a teenager from Russia. We would like to know your opinion on this topic. Please answer five questions. So, let’s get started.',
  q:['How many people are there in your family, and who are you closest to?','What household chores do you usually do at home?','How do the members of your family usually spend their free time together?','What family traditions would you like to keep when you have your own family?','What advice would you give to teenagers who often argue with their parents?'],
  a:['There are four of us: my parents, my younger brother and me. I am closest to my mum because I can tell her absolutely everything, and she never judges me.',
   'I usually do the washing up and take out the rubbish. At weekends I also help my dad with the shopping, which I don’t mind at all because we chat on the way.',
   'We often watch films together on Friday evenings and go for long walks in the park. In summer we usually go to the countryside to visit my grandparents.',
   'I would definitely keep our tradition of having a big family dinner every Sunday. It is the only time when everybody puts their phones away and really talks to each other.',
   'I would advise them to stay calm and try to see the situation through their parents’ eyes. It also helps to choose the right moment for a serious talk instead of arguing in a hurry.']},
 {id:'w1b',theme:'Friendship',intro:'Hello everybody! It’s the Teenagers Talk radio programme. Today we are talking about friendship, and our guest is a teenager from Russia. We would like to know your opinion on this topic. Please answer five questions. So, let’s get started.',
  q:['What qualities do you value most in a friend?','How did you meet your best friend?','Do you prefer to spend time with one close friend or with a group of friends? Why?','What do you usually do when you fall out with a friend?','Do you think it is possible to stay friends with someone who lives in another country? Why or why not?'],
  a:['Above all, I value honesty and loyalty. A real friend tells you the truth even when it is unpleasant and supports you when things go wrong.',
   'We met at a summer camp when we were eleven. We were in the same team, discovered that we had a lot in common, and we have been inseparable ever since.',
   'I prefer spending time with one close friend because we can have deep conversations. In a big group people often just chat about unimportant things.',
   'First I take some time to calm down, and then I try to talk to my friend face to face. Usually we make up quickly because neither of us likes holding a grudge.',
   'I am sure it is possible, thanks to video calls and messengers. However, such a friendship needs more effort, because you have to find time to talk despite the time difference.']}];

/* ---------- Состояние: только на время открытой страницы ---------- */
const S={w:{mode:'cards',i:0,order:null,shuf:false,flip:{},mt:null},h:{pg:0,flip:{}},t2:{v:0},iv:{v:0,q:0,flip:false,smp:false},sc:{t2:[null,null,null,null],t3:[null,null,null,null,null]}};
const STEPS=[
 {label:'Words',color:'#2c7f78',draw:words1},
 {label:'Error hunter',color:'#a85050',draw:hunt},
 {label:'Task 2',color:'#2f6f9f',draw:task2},
 {label:'Task 3',color:'#4a4f8f',draw:task3},
 {label:'Homework',color:'#b0683a',draw:homework}];
let cur=0,cleanup=null,keyH=null;
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':''),'<i>'+(k+1)+'</i><span>'+s.label+'</span>');b.type='button';b.title=s.label;b.style.setProperty('--c',s.color);b.onclick=()=>go(k);tabs.append(b);});}
function go(k){if(cleanup){cleanup();cleanup=null;}stopSay();document.querySelectorAll('.overlay').forEach(x=>x.remove());cur=k;document.body.style.setProperty('--step',STEPS[k].color);paintTabs();main.innerHTML='';STEPS[k].draw();}
function redraw(){go(cur);}
function head(t){main.append(el('div','inst','<b>'+t+'</b>'));}
function nextBtn(){return cur<STEPS.length-1?btn('Next: '+STEPS[cur+1].label+' →',()=>go(cur+1),'main sp'):el('span');}
function overlay(title,html,rows){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);(rows||[]).forEach(r=>t.append(r));t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
function teachBtn(html,rows){return btn('Учителю',()=>overlay('Учителю · только для вас',html,rows),'acc sm');}
function scoreRow(label,max,get,set){const r=el('div','score');r.append(el('span',null,label));for(let n=0;n<=max;n++){const b=el('button',get()===n?'on':'',String(n));b.type='button';b.onclick=()=>{set(n);[...r.querySelectorAll('button')].forEach((x,k)=>x.classList.toggle('on',k===n));};r.append(b);}return r;}
function navRow(items){const n=el('div','navrow');items.forEach(x=>n.append(x));n.append(nextBtn());main.append(n);}
/* переворот карточки: половина поворота, смена стороны, вторая половина */
function turn(card,after){card.classList.add('turn');setTimeout(()=>{after();card.classList.remove('turn');},170);}

function recBtn(){const b=btn('',async()=>{if(!Rec.on){if(!(await Rec.enable())){b.textContent='No microphone';return;}Rec.on=true;}else Rec.on=false;paint();},'sm wide');const paint=()=>{b.textContent='Recording: '+(Rec.on?'on':'off');b.classList.toggle('main',Rec.on);};paint();return b;}
/* ---------- Озвучка вопросов голосом браузера ---------- */
let voice=null;
function pickVoice(){const v=(window.speechSynthesis&&speechSynthesis.getVoices())||[];voice=v.find(x=>/en-GB/i.test(x.lang)&&/Google|Natural|Sonia|Libby|Ryan/i.test(x.name))||v.find(x=>/en-GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
function say(text,done,fail){if(!window.speechSynthesis){fail&&fail();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);if(voice)u.voice=voice;u.lang=voice?voice.lang:'en-GB';u.rate=.95;u.onend=()=>done&&done();u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')fail&&fail();};speechSynthesis.speak(u);}
function stopSay(){try{window.speechSynthesis&&speechSynthesis.cancel();}catch(e){}}

/* ---------- 1. Words: карточки и Match ---------- */
function words1(){const st=S.w;
  head('Family and friends · 16 key phrases');
  const top=el('div','navrow');top.append(btn('Cards',()=>{st.mode='cards';redraw();},st.mode==='cards'?'main':''),btn('Match',()=>{st.mode='match';st.mt=null;redraw();},st.mode==='match'?'main':''));main.append(top);
  if(st.mode==='cards'){
    /* Quizlet: одна большая карточка, термин – лицевая сторона, значение и пример – оборот; стрелки, счётчик, полоса прогресса, звук, перемешивание */
    const order=st.order||(st.order=[...WORDS.keys()]),n=order.length,k=order[st.i],w=WORDS[k];
    const wrap=el('div','qz'),bar=el('div','qzbar');bar.innerHTML='<i style="width:'+((st.i+1)/n*100)+'%"></i>';
    const card=el('div','qzcard'+(st.flip[k]?' flipped':'')),inner=el('div','qzin');
    const front=el('div','qzface qzfront','<span class="qzk">Term</span><div class="qzterm">'+esc(w[0])+'</div>');
    const back=el('div','qzface qzback','<span class="qzk">Definition</span><div class="qzdef">'+ED.t('w1.w.'+k+'.d',w[1])+'</div><div class="qzex">'+ED.t('w1.w.'+k+'.x',w[2])+'</div>');
    const snd=el('button','qzsnd','<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>');snd.type='button';snd.title='Listen';
    snd.onclick=e=>{e.stopPropagation();say(st.flip[k]?w[1]+'. '+w[2]:w[0]);};
    inner.append(front,back);card.append(inner,snd);
    const flip=()=>{st.flip[k]=!st.flip[k];card.classList.toggle('flipped',!!st.flip[k]);};
    card.onclick=e=>{if(e.target.closest('[contenteditable],button'))return;flip();};
    const move=d=>{stopSay();st.i=(st.i+d+n)%n;st.flip={};redraw();};
    const nav=el('div','qznav'),pv=el('button','qzarr','&larr;'),nx=el('button','qzarr','&rarr;');pv.type=nx.type='button';pv.title='Previous';nx.title='Next';pv.onclick=()=>move(-1);nx.onclick=()=>move(1);pv.disabled=st.i===0;
    const sh=btn(st.shuf?'Shuffled':'Shuffle',()=>{if(st.shuf){st.order=[...WORDS.keys()];st.shuf=false;}else{st.order=[...WORDS.keys()].sort(()=>Math.random()-.5);st.shuf=true;}st.i=0;st.flip={};redraw();},'sm'+(st.shuf?' main':''));
    nav.append(sh,pv,el('b','qzcnt',(st.i+1)+' / '+n),nx,btn(st.i===n-1?'Start again':'Flip',()=>{if(st.i===n-1&&st.flip[k]){st.i=0;st.flip={};redraw();}else flip();},'sm'));
    wrap.append(bar,card,nav);main.append(wrap);
    keyH=e=>{if(e.target.closest&&e.target.closest('[contenteditable],input,select,textarea'))return;if(e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();flip();}else if(e.key==='ArrowRight')move(1);else if(e.key==='ArrowLeft'&&st.i>0)move(-1);};
    document.addEventListener('keydown',keyH);cleanup=()=>{document.removeEventListener('keydown',keyH);keyH=null;};
    navRow([teachBtn('<p><b>0–7 мин.</b> Ученица читает фразу, сама объясняет значение по-английски, потом переворачивает карточку (щелчок по карточке или пробел; стрелки – следующая/предыдущая). Затем Match на время.</p><p>Попросите составить предложение о своей семье с 2–3 фразами: это заготовки для интервью.</p>')]);}
  else{ if(!st.mt){const set=[...WORDS.keys()].sort(()=>Math.random()-.5).slice(0,4);st.mt={set,right:[...set].sort(()=>Math.random()-.5),sel:null,done:{},err:st.next?st.next.err:0,round:st.next?st.next.round:1};st.next=null;}
    const m=st.mt,box=el('div','mt'),L=el('div','col'),R=el('div','col');
    m.set.forEach(k=>{const b=el('button',m.done[k]?'ok':(m.sel===k?'sel':''),esc(WORDS[k][0]));b.type='button';b.onclick=()=>{if(m.done[k])return;m.sel=k;redraw();};L.append(b);});
    m.right.forEach(k=>{const b=el('button',m.done[k]?'ok':'',esc(WORDS[k][1]));b.type='button';b.onclick=()=>{if(m.done[k]||m.sel==null)return;if(m.sel===k){m.done[k]=1;m.sel=null;redraw();}else{m.err++;b.classList.add('no');setTimeout(()=>b.classList.remove('no'),500);}};R.append(b);});
    box.append(L,R);main.append(box);const fin=Object.keys(m.done).length===4;
    navRow([el('b',null,'Round '+m.round+' · mistakes: '+m.err),fin?btn('Next round →',()=>{const r=m.round+1,e=m.err;st.mt=null;st.next={round:r,err:e};redraw();},'main'):el('span','note','Click a phrase, then its meaning.')]);}
}

/* ---------- 2. Error hunter: прямые вопросы ---------- */
function hunt(){const st=S.h;
  head('Error hunter. Each question has one mistake. Say the correct question aloud, then flip the card to check.');
  const g=el('div','grid4');
  HUNT.slice(st.pg*4,st.pg*4+4).forEach((h,i)=>{const k=st.pg*4+i,c=el('div','fc');
    const paint=()=>{c.className='fc'+(st.flip[k]?' back':'');c.innerHTML=st.flip[k]?'<div class="bad">'+esc(h[0])+'</div><div class="w">'+ED.t('w1.h.'+k,h[1])+'</div><div class="rule">'+esc(h[2])+'</div>':'<div class="k">Question '+(k+1)+' of 8</div><div class="bad">'+esc(h[0])+'</div>';};
    paint();c.onclick=e=>{if(e.target.closest('[contenteditable]'))return;turn(c,()=>{st.flip[k]=!st.flip[k];paint();});};g.append(c);});
  main.append(g);
  const pg=el('div','pager'),bk=btn('← Back',()=>{st.pg=0;redraw();}),fw=btn(st.pg===0?'Next 4 →':'Start again',()=>{st.pg=st.pg===0?1:0;st.flip={};redraw();});bk.disabled=st.pg===0;
  pg.append(bk,el('b',null,(st.pg+1)+' / 2'),fw);
  navRow([pg,teachBtn('<p><b>7–15 мин.</b> Самые частые потери в задании 2: нет вспомогательного глагола, порядок слов, косвенный вопрос («Can you tell me…»), are/is there.</p><p>Ученица исправляет вслух, вы переворачиваете карточку. Если ошиблась – попросите придумать свой вопрос с той же ловушкой.</p>')]);
}

/* ---------- 3. Task 2 в формате экзамена ---------- */
function task2(){const st=S.t2,a=ADS[st.v];
  const stage=el('div','stage'),kim=el('div','panel grow kim'),ctl=el('div','panel ctl col');
  kim.innerHTML='<p class="task">Task 2. Study the advertisement.</p><div class="adrow"><div class="ruad" style="background:'+a.c+'"><b>'+esc(a.title)+'</b><span>'+esc(a.sub)+'</span></div><div><p class="task">'+esc(a.intro)+' In 1.5 minutes you are to ask four direct questions to find out about the following:</p><ol id="pts">'+a.points.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ol><p class="task">You have 20 seconds to ask each question.</p></div></div>';
  const phases=[{label:'Preparation',kind:'prep',sec:90}].concat(a.points.map((p,k)=>({label:'Question '+(k+1),kind:'answer',sec:20})));
  const ring=ringEl(90),label=el('div','phase','Press Start'),recBox=el('div','rec');
  const run=phaseRunner({ring,label,phases,recBox,recName:'task2-'+(st.v+1),en:true,onPhase:i=>{[...document.querySelectorAll('#pts li')].forEach((x,k)=>{x.className=i<1?'':(k===i-1?'now':(k<i-1?'past':''));});}});
  ring.querySelector('span').textContent='ready';
  const startB=btn('Start',()=>{run.start();startB.textContent='Restart';pauseB.disabled=skipB.disabled=false;pauseB.textContent='Pause';},'main wide');
  const pauseB=btn('Pause',()=>{pauseB.textContent=run.pause()?'Continue':'Pause';},'sm'),skipB=btn('Skip',()=>run.skip(),'sm');pauseB.disabled=skipB.disabled=true;
  const box=el('div','ctlbtns');box.append(startB,pauseB,skipB,recBtn(),btn('Sample questions',()=>showSample(a.title+' · sample questions','<ol class="smpl">'+a.key.map((x,k)=>'<li><i>'+esc(a.points[k])+'</i><br>'+ED.t('w1.t2.'+st.v+'.'+k,x)+'</li>').join('')+'</ol>',null,'Close'),'sm wide'));
  ctl.append(ring,label,box,recBox);stage.append(kim,ctl);main.append(stage);
  navRow([btn('Advertisement '+(st.v+1)+' of 2',()=>{st.v=1-st.v;redraw();},'sm'),teachBtn('<p><b>15–25 мин.</b> Два объявления в режиме экзамена: 1,5 минуты подготовки, по 20 секунд на вопрос. Включите запись, после ответа ученица слушает себя и сама ставит баллы.</p><p>По 1 баллу за вопрос: прямой, грамматически верный, по пункту. 0 – косвенный вопрос, ошибка в порядке слов или вспомогательном глаголе.</p>',a.points.map((p,k)=>scoreRow((k+1)+'. '+p,1,()=>S.sc.t2[k],n=>S.sc.t2[k]=n)))]);
  cleanup=()=>run.stop();
}

/* ---------- 4. Task 3: интервью, вопрос только звучит ---------- */
function task3(){const st=S.iv,v=IV[st.v];let left=40,t=null;
  head('Task 3. You are going to give an interview. You have to answer five questions. Give full answers to the questions (2–3 sentences). Remember that you have 40 seconds to answer each question.');
  const top=el('div','ivtop'),sel=el('select');sel.setAttribute('aria-label','Set');IV.forEach((x,k)=>sel.append(new Option('Set '+(k+1)+' · '+x.theme,k)));sel.value=st.v;
  sel.onchange=()=>{st.v=+sel.value;st.q=0;st.flip=false;st.smp=false;redraw();};
  const qc=el('div','chips');v.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;st.smp=false;redraw();};qc.append(b);});
  top.append(sel,el('span','note','Question:'),qc,btn('Introduction',()=>play(true),'sm'),btn('Answer plan',()=>showSample('Answer plan · 2–3 sentences','<p><b>1.</b> Answer the question directly.<br><b>2.</b> Give a reason or a detail.<br><b>3.</b> Add an example, a feeling or a result.</p><p><b>Useful starts:</b> To be honest, … · As far as I know, … · The thing is that … · For example, … · That’s why …</p><p>Use the same tense as the question. Answer both parts of a double question.</p>',null,'Close'),'sm'));main.append(top);
  const stage=el('div','stage'),card=el('div','ivcard'),side=el('div','panel ctl col');
  const ring=el('div','ring ans','<b>40</b><span>seconds</span>'),label=el('div','phase','Press Play'),recBox=el('div','rec');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};
  const runT=()=>{stopT();left=40;paint();label.textContent='Answer';beep(880,200);Rec.start();const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Time is up';beep(520,500);Rec.stop(recBox,v.id+'-q'+(st.q+1));}},200);};
  function play(intro){stopT();Rec.cancel();left=40;paint();label.textContent=intro?'Introduction is playing':'Question is playing';
    say(intro?v.intro:v.q[st.q],()=>{if(intro)label.textContent='Now press Play';else runT();},()=>{label.textContent='No English voice in this browser';});}
  function face(){card.className='ivcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip){card.append(el('div','ey','Question '+(st.q+1)+' · '+esc(v.theme)),el('div','qq',esc(v.q[st.q])));if(st.smp)card.append(el('div','ey','Sample answer'),el('div','smpa',ED.t('w1.iv.'+v.id+'.'+st.q,v.a[st.q])));card.append(btn(st.smp?'Hide the answer':'Sample answer',()=>{st.smp=!st.smp;face();},'sm'));}
    else{card.append(el('div','ey','Question '+(st.q+1)+' of 5'),el('div','big','Listen and answer'));
      const pb=el('div','navrow');pb.append(btn('Play',()=>play(false),'main'),btn('Replay',()=>play(false)),btn('Stop',()=>{stopSay();stopT();Rec.cancel();label.textContent='Stopped';}));card.append(pb);}}
  face();
  const box=el('div','ctlbtns');box.append(btn('Timer',runT,'sm'),btn('Reset',()=>{stopT();Rec.cancel();left=40;paint();label.textContent='Press Play';},'sm'),recBtn());
  side.append(ring,label,box,recBox);stage.append(card,side);main.append(stage);
  const last=st.q===4,bk=btn('← Back',()=>{st.q--;st.flip=false;st.smp=false;redraw();}),fw=btn(last?(st.v===0?'Next set →':'Start again'):'Next →',()=>{if(!last)st.q++;else{st.v=st.v===0?1:0;st.q=0;}st.flip=false;st.smp=false;redraw();});bk.disabled=st.q===0;
  navRow([bk,btn('Flip the card',()=>turn(card,()=>{st.flip=!st.flip;face();}),'main'),fw,teachBtn('<p><b>25–50 мин.</b> Сначала «Answer plan» (2 минуты), затем Set 1 с записью без остановок. Ученица слушает свою запись и ставит себе баллы, вы сверяете. Set 2 – тот же режим, цель: каждый ответ 2–3 фразы и 1–2 фразы из Words.</p><p>По 1 баллу: полный ответ из 2–3 фраз, верное время глагола, ответ на обе части вопроса.</p><p>Вопросы звучат голосом браузера. Если голоса нет, прочитайте вопрос сами, не показывая текст.</p>',v.q.map((q,k)=>scoreRow('Answer '+(k+1),1,()=>S.sc.t3[k],n=>S.sc.t3[k]=n)))]);
  cleanup=()=>{stopT();stopSay();Rec.cancel();};
}

/* ---------- 5. Homework ---------- */
function homework(){
  head('Homework · send it two days before the next lesson.');
  const g=el('div','hw');
  const card=(t,body)=>{const p=el('div','panel');p.innerHTML='<b>'+t+'</b>'+body;g.append(p);};
  card('1. Words','<p>Learn the 16 phrases in Words. Play Match until you finish a round with no mistakes.</p>');
  card('2. Interview','<p>Answer Set 2 (Friendship) again at home with the timer and the recording on. Send the five recordings.</p>');
  card('3. Letter 37','<p>Write letter 46 (Family · Harley) from the letter bank in 20 minutes, 100–140 words. Then compare it with the sample letter.</p><div class="frm"><span>Letter 37 → Letter bank → 46</span></div>');
  card('4. Diagnostic homework','<p>Finish any part of the diagnostic homework you have not done yet: listening 1–9, reading 10 and 12–18.</p>');
  main.append(g);
  const w=el('a','btn','Letter 37 →');w.href='write37.html?v=23';w.style.textDecoration='none';
  navRow([w,teachBtn('<p><b>55–60 мин.</b> Назовите одну сильную сторону урока и две задачи на неделю. Домашнее задание – за два дня до следующего занятия, письмо проверяете заранее и разбираете на уроке.</p><p>Следующее занятие блока 1: чтение вслух и монолог (задания 1 и 4) на тему семьи и дружбы.</p>')]);
}

go(Math.min(STEPS.length-1,Math.max(0,(+location.hash.slice(1)||1)-1)));
