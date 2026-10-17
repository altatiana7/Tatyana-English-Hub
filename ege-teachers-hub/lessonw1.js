/* Занятие 1 · неделя 1 · блок 1 «Family and friends».
   Материал для учениц – только на английском; заметки для учителя – по-русски, под кнопкой «Учителю».
   Ничего не сохраняется: страница каждый раз открывается с первого шага. */
const main=$('#main'),tabs=$('#tabs');
const SHOW=!!window.TEACHER; /* ученица: без образцов ответов, Error hunter – один раз и учителю */
/* Коллокации – из «Topic Practice» (Family · Lesson 13, карточки) */
const COLL=[['a close-knit family','дружная семья'],['sibling rivalry','соперничество братьев и сестёр'],['a single-parent family','неполная семья'],['an extended family','большая семья с родственниками'],['a nuclear family','родители и дети'],['a breadwinner','кормилец семьи'],['a family gathering','семейная встреча'],['unconditional support','безусловная поддержка'],['to be on speaking terms','разговаривать друг с другом'],['a distant relative','дальний родственник'],['to share the same values','разделять ценности'],['to rely on somebody','полагаться на кого-то']];

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
 {title:'Family Weekend Camp',sub:'Two days of fun for parents and children',c:'#3f6b4f',intro:'You are considering going to the camp with your family and now you’d like to get more information.',
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
   'I am sure it is possible, thanks to video calls and messengers. However, such a friendship needs more effort, because you have to find time to talk despite the time difference.']},
 {id:'w1c',theme:'Best friend',intro:'Hello everybody! It’s the Teenagers Talk radio programme. Today we are talking about best friends, and our guest is a teenager from Russia. We would like to know your opinion on this topic. Please answer six questions. So, let’s get started.',
  q:['What is your best friend like?','Where did you and your friend meet for the first time?','How often do you see each other?','What do you like to do together?','What career is your best friend going to follow?','What would you recommend to a teenager who wants to be a good friend?'],
  a:['My best friend is cheerful, reliable and very honest. She always tells me the truth, even when it is not pleasant to hear, and I really appreciate that.',
   'We met for the first time in the first grade, when our teacher put us at the same desk. We started chatting on the very first day and have been friends ever since.',
   'We see each other almost every day at school, and at weekends we usually meet in the centre of our town. During the holidays we chat online for hours, even when one of us goes away.',
   'We love going for long walks and discussing everything in the world. We also enjoy cooking together, and sometimes we go to concerts of our favourite bands.',
   'She is going to become a doctor, because she has always wanted to help people. She is good at biology and chemistry, so I am sure she will succeed.',
   'I would recommend being a good listener and keeping your friends’ secrets. It is also important to support your friend when things go wrong, not only when everything is fine.']}];


const READ1={t:'Family dinners',x:'Scientists have long been interested in how family habits shape our lives. One of the most surprising findings concerns the simple family dinner. Researchers in several countries have discovered that teenagers who regularly eat with their parents tend to do better at school and feel less stressed. They are also less likely to develop unhealthy eating habits. The reason seems to be communication rather than the food itself. During a shared meal, family members talk about their day, discuss problems and make plans together. Children learn new words, listen to different opinions and practise expressing their own ideas. Interestingly, the benefits remain even when the meal is short or simple. However, modern life makes such dinners more and more difficult. Parents often work late, and teenagers have clubs, sports and homework. Experts therefore suggest that families should try to eat together at least three times a week and keep their phones away from the table.',
 note:'researchers, regularly, communication, interestingly, therefore; -ed: interested, discovered; numbers: three times a week'};
const READ2={t:'Human brain',x:'The human brain is the most complex and remarkable organ of the body. It controls everything we do – thinking, learning, and even heart rate. Though the brain makes up only 2 percent of the body’s weight, it uses around 20 percent of its energy. It works 24 hours a day. Even when a person is sleeping, the brain is working hard to keep other organs functioning. Most people think that our brain is more active during the daytime because it needs to deal with a great amount of information. In fact, that’s not true. The brain is far more active when a person is sleeping! However, scientists don’t yet have any explanation for this fact.',
 note:'complex, remarkable, organ, functioning, information, explanation, scientists; numbers: 2 percent, 20 percent, 24 hours'};
const READS=[READ1,READ2];
const TALK={title:'Your best friend',points:['what people need friends for','how long you and your friend have known each other','what you enjoy doing together','what your attitude to friendship is'],
 s:'I’d like to tell you about my best friend and about friendship in general. People need friends to share their joys and problems, to get advice and simply not to feel lonely. A real friend supports you when things go wrong and is happy when you succeed. My best friend’s name is Lena, and we have known each other for nine years. We met in the first grade and have been inseparable ever since. We enjoy doing a lot of things together. We often go for long walks, watch films and cook pizza at weekends. Sometimes we just sit in a café and talk for hours. As for my attitude to friendship, I think it is one of the most valuable things in life. Friendship needs honesty, trust and patience, and you have to work at it. That is why I try to be a good friend myself.'};
const P4={project:'Spending free time',kind:'the two ways of spending free time',pref:'which way of spending free time you would prefer and why',
 img:['img/w1-family.jpg','img/w1-friends.jpg'],cap:['A family relaxing in a park','Teenagers chatting with friends'],
 s:'Hi, Alex! I’m calling about our project “Spending free time”. I’ve found two photos for it. The first photo shows a family relaxing on the grass in a park: the parents and their little children are laughing and enjoying the sunny day. The second photo shows a group of teenagers sitting on the steps outside a building and chatting. Both photos show people spending free time together, but in the first one it is a family, while in the second one it is a group of friends. Spending time with your family helps you feel close to your parents and supported. However, it is sometimes difficult to find an activity that everyone enjoys. Spending time with friends is fun, because you share the same interests. On the other hand, friends can sometimes have a bad influence on you. As for me, I prefer spending free time with my friends, because we have a lot in common, but I always keep Sunday for my family. That’s all for now. Call me back soon. Bye!'};

/* ---------- Состояние: только на время открытой страницы ---------- */
const S={left:'cards',w:{i:0,order:null,shuf:false,flip:{},mt:null},h:{i:0,order:null,shuf:false,flip:{}},right:1,t1:{v:0},t4:{v:0},t2:{v:0},iv:{v:0,q:0,flip:false,smp:false},sc:{t1:null,t2:[null,null,null,null],t3:[null,null,null,null,null],k1:null,k2:null,k3:null}};
S.c={i:0,order:null,shuf:false,flip:{}};S.h.ans={};S.h.done=false;
const RV=KS.review('lessonw1');let SENT=KS.sent('lessonw1');if(SENT){S.h.ans=Object.assign({},SENT.data.hunt||{});S.h.done=true;}
let keyH=null,cleanL=null,cleanR=null,PL=null,PR=null;
tabs.innerHTML='<span class="ttlb">Block 1 · Family and friends</span>';
/* ДОМАШКА: какие сегменты открыты */
const LMAP={cards:'words',colls:'colls',hunt:'hunt',match:'match'};
const RMAP={1:'t1-1',2:'t2-1',3:'iv1',4:'t4-1'};
function hwLeft(v){return !HW.items.length||HW.has('lessonw1:'+LMAP[v]);}
function hwRight(v){if(!HW.items.length)return true;const p='lessonw1:';if(v===1)return HW.has(p+'t1-1')||HW.has(p+'t1-2');if(v===2)return HW.has(p+'t2-1')||HW.has(p+'t2-2');if(v===3)return HW.has(p+'iv1')||HW.has(p+'iv2')||HW.has(p+'iv3');if(v===4)return HW.has(p+'t4-1')||HW.has(p+'t4-2');return false;}
function hwAnyLeft(){return ['cards','colls','hunt','match'].some(hwLeft);}
function hwAnyRight(){return [1,2,3,4].some(hwRight);}

function overlay(title,html,rows){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);(rows||[]).forEach(r=>t.append(r));t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
function overlayEn(title,html){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);t.append(btn('Close',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
function scoreRow(label,max,get,set){const r=el('div','score');r.append(el('span',null,label));for(let n=0;n<=max;n++){const b=el('button',get()===n?'on':'',String(n));b.type='button';b.onclick=()=>{set(n);[...r.querySelectorAll('button')].forEach((x,k)=>x.classList.toggle('on',k===n));};r.append(b);}return r;}
function seg(items,cur,onPick){const s=el('div','seg');items.forEach(([v,l])=>{const b=el('button','segb'+(v===cur?' on':''),l);b.type='button';b.onclick=()=>onPick(v);s.append(b);});return s;}
function segHW(items,cur,onPick,check){const s=el('div','seg');items.forEach(([v,l])=>{const ok=check(v);const b=el('button','segb'+(v===cur?' on':'')+(ok?'':' lock'),l);b.type='button';if(ok)b.onclick=()=>onPick(v);else{b.disabled=true;b.title='Locked';}s.append(b);});return s;}
function recBtn(){const b=btn('',async()=>{if(!Rec.on){if(!(await Rec.enable())){b.textContent='No microphone';return;}Rec.on=true;}else Rec.on=false;paint();},'sm wide');const paint=()=>{b.textContent='Recording: '+(Rec.on?'on':'off');b.classList.toggle('main',Rec.on);};paint();return b;}
/* ---------- Озвучка голосом браузера ---------- */
let voice=null;
function pickVoice(){const v=(window.speechSynthesis&&speechSynthesis.getVoices())||[];voice=v.find(x=>/en-GB/i.test(x.lang)&&/Google|Natural|Sonia|Libby|Ryan/i.test(x.name))||v.find(x=>/en-GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
function say(text,done,fail){if(!window.speechSynthesis){fail&&fail();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);if(voice)u.voice=voice;u.lang=voice?voice.lang:'en-GB';u.rate=.95;u.onend=()=>done&&done();u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')fail&&fail();};speechSynthesis.speak(u);}
function stopSay(){try{window.speechSynthesis&&speechSynthesis.cancel();}catch(e){}}

/* ---------- Раскладка: слева карточки, справа устная часть, внизу домашнее задание и заметки учителя ---------- */
function layout(){main.innerHTML='';const ws=el('div','ws');PL=el('section','wpane pl');PR=el('section','wpane pr');ws.append(PL,PR);main.append(ws);
  const hb=document.querySelector('.bar');if(hb&&!hb.querySelector('.hbtns')){const g=el('div','hbtns');if(!SHOW){g.append(btn('Homework',homework,'main sm'),sendBtn());hb.append(g);}else{g.append(btn('Homework',homework,'main sm'),btn('Учителю',teacher,'acc sm'));hb.append(g);}}
  drawLeft();drawRight();}

/* ---------- Слева: карточки Quizlet ---------- */
function drawLeft(){if(cleanL){cleanL();cleanL=null;}PL.innerHTML='';
  if(!hwAnyLeft()){PL.append(el('div','lockbox','<b>Locked</b><span>Not in your homework</span>'));return;}
  if(!hwLeft(S.left)){S.left=['cards','colls','hunt','match'].find(hwLeft)||'cards';}
  PL.append(segHW([['cards','Words'],['colls','Collocations'],['hunt','Error hunter'],['match','Match']],S.left,v=>{S.left=v;if(v==='match')S.w.mt=null;drawLeft();},hwLeft));
  const body=el('div','pbody');PL.append(body);
  if(S.left==='cards')quizlet(body,S.w,WORDS.length,k=>['Term','<div class="qzterm">'+esc(WORDS[k][0])+'</div>'],k=>['Definition','<div class="qzdef">'+ED.t('w1.w.'+k+'.d',WORDS[k][1])+'</div><div class="qzex">'+ED.t('w1.w.'+k+'.x',WORDS[k][2])+'</div>'],(k,f)=>f?WORDS[k][1]+'. '+WORDS[k][2]:WORDS[k][0]);
  else if(S.left==='colls')quizlet(body,S.c,COLL.length,k=>['Collocation','<div class="qzterm">'+esc(COLL[k][0])+'</div>'],k=>['Meaning','<div class="qzdef">'+esc(COLL[k][1])+'</div>'],(k,f)=>f?'':COLL[k][0]);
  else if(S.left==='hunt'&&!SHOW)hunter(body);
  else if(S.left==='hunt')quizlet(body,S.h,HUNT.length,k=>['Find the mistake','<div class="qzterm">'+esc(HUNT[k][0])+'</div>'],k=>['Correct question','<div class="qzwrong">'+esc(HUNT[k][0])+'</div><div class="qzdef qzok">'+ED.t('w1.h.'+k,HUNT[k][1])+'</div><div class="qzex">'+esc(HUNT[k][2])+'</div>'],(k,f)=>f?HUNT[k][1]:'');
  else match(body);}
function quizlet(box,st,n,face,back,sayTxt){
  if(!st.order||st.order.length!==n)st.order=[...Array(n).keys()];
  const k=st.order[st.i],f=face(k),b=back(k);
  const bar=el('div','qzbar');bar.innerHTML='<i style="width:'+((st.i+1)/n*100)+'%"></i>';
  const card=el('div','qzcard'+(st.flip[k]?' flipped':'')),inner=el('div','qzin');
  inner.append(el('div','qzface qzfront','<span class="qzk">'+f[0]+'</span>'+f[1]),el('div','qzface qzback','<span class="qzk">'+b[0]+'</span>'+b[1]));card.append(inner);
  const snd=el('button','qzsnd','<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>');snd.type='button';snd.title='Listen';snd.onclick=e=>{e.stopPropagation();const t=sayTxt(k,!!st.flip[k]);if(t)say(t);};if(sayTxt(k,false)||sayTxt(k,true))card.append(snd);
  const flip=()=>{st.flip[k]=!st.flip[k];card.classList.toggle('flipped',!!st.flip[k]);};
  card.onclick=e=>{if(e.target.closest('[contenteditable],button'))return;flip();};
  const move=d=>{stopSay();st.i=(st.i+d+n)%n;st.flip={};drawLeft();};
  const nav=el('div','qznav'),pv=el('button','qzarr','&larr;'),nx=el('button','qzarr','&rarr;');pv.type=nx.type='button';pv.title='Previous';nx.title='Next';pv.onclick=()=>move(-1);nx.onclick=()=>move(1);pv.disabled=st.i===0;
  const sh=btn(st.shuf?'Shuffled':'Shuffle',()=>{st.order=st.shuf?[...Array(n).keys()]:[...Array(n).keys()].sort(()=>Math.random()-.5);st.shuf=!st.shuf;st.i=0;st.flip={};drawLeft();},'sm'+(st.shuf?' main':''));
  nav.append(sh,pv,el('b','qzcnt',(st.i+1)+' / '+n),nx,btn(st.i===n-1&&st.flip[k]?'Start again':'Flip',()=>{if(st.i===n-1&&st.flip[k]){st.i=0;st.flip={};drawLeft();}else flip();},'sm'));
  box.append(bar,card,nav);
  keyH=e=>{if(e.target.closest&&e.target.closest('[contenteditable],input,select,textarea,.pr'))return;if(e.key===' '){e.preventDefault();flip();}else if(e.key==='ArrowRight')move(1);else if(e.key==='ArrowLeft'&&st.i>0)move(-1);};
  document.addEventListener('keydown',keyH);cleanL=()=>{document.removeEventListener('keydown',keyH);keyH=null;};
}
/* Error hunter для ученицы: исправить вопрос самой, ответ не показывается; отправка учителю один раз */
function hunter(box){const st=S.h,n=HUNT.length;if(!st.order||st.order.length!==n)st.order=[...Array(n).keys()];const k=st.order[st.i];
  const bar=el('div','qzbar');bar.innerHTML='<i style="width:'+((st.i+1)/n*100)+'%"></i>';
  const card=el('div','qzcard'),inner=el('div','qzin');inner.append(el('div','qzface qzfront','<span class="qzk">Find the mistake</span><div class="qzterm">'+esc(HUNT[k][0])+'</div>'));card.append(inner);card.style.cursor='default';
  const inp=el('input','ans');inp.type='text';inp.placeholder='Write the correct question';inp.autocomplete='off';inp.spellcheck=false;inp.value=st.ans[k]||'';inp.disabled=!!st.done;inp.style.width='100%';inp.style.boxSizing='border-box';inp.style.padding='7px 10px';
  inp.oninput=()=>{st.ans[k]=inp.value;};
  const move=d=>{st.i=Math.min(n-1,Math.max(0,st.i+d));drawLeft();};
  const nav=el('div','qznav'),pv=el('button','qzarr','&larr;'),nx=el('button','qzarr','&rarr;');pv.type=nx.type='button';pv.onclick=()=>move(-1);nx.onclick=()=>move(1);pv.disabled=st.i===0;nx.disabled=st.i===n-1;
  const filled=Object.keys(st.ans).filter(x=>(st.ans[x]||'').trim()).length;
  nav.append(pv,el('b','qzcnt',(st.i+1)+' / '+n),nx,el('span','note',st.done?'Sent to the teacher':'Answered: '+filled+' / '+n));
  box.append(bar,card,inp,nav);setTimeout(()=>{if(!st.done)try{inp.focus();}catch(e){}},30);
  keyH=e=>{if(e.target===inp&&e.key==='Enter'){e.preventDefault();move(1);}};document.addEventListener('keydown',keyH);cleanL=()=>{document.removeEventListener('keydown',keyH);keyH=null;};}
function sendBtn(){const w=el('span');const draw=()=>{w.innerHTML='';w.append(KS.button('lessonw1',()=>({hunt:S.h.ans,match:S.w.mt?{round:S.w.mt.round,err:S.w.mt.err}:null}),o=>{SENT=o;S.h.done=true;draw();if(S.left==='hunt')drawLeft();}));};draw();return w;}
/* сайт учителя: работа из «Проверки домашки» */
function showReview(o){const h=o.data.hunt||{},rows=HUNT.map((x,k)=>{const a=(h[k]||'').trim(),ok=a&&a.replace(/[?\s]+$/,'').toLowerCase()===x[1].replace(/[?\s]+$/,'').toLowerCase();
    return '<li><span class="qzwrong">'+esc(x[0])+'</span><br>Ученица: <b style="color:'+(ok?'#1e6b4a':'#b4413a')+'">'+(a?esc(a):'—')+'</b><br>Верно: <span class="qzok">'+esc(x[1])+'</span></li>';}).join('');
  const m=o.data.match;overlay('Проверка · Error hunter · отправлено '+(o.data._at||''),'<ol class="hwl">'+rows+'</ol>'+(m?'<p>Match: раунд '+m.round+', ошибок '+m.err+'.</p>':''));}
function match(box){const st=S.w;
  if(!st.mt){const set=[...WORDS.keys()].sort(()=>Math.random()-.5).slice(0,4);st.mt={set,right:[...set].sort(()=>Math.random()-.5),sel:null,done:{},err:st.next?st.next.err:0,round:st.next?st.next.round:1};st.next=null;}
  const m=st.mt,g=el('div','mt'),L=el('div','col'),R=el('div','col');
  m.set.forEach(k=>{const b=el('button',m.done[k]?'ok':(m.sel===k?'sel':''),esc(WORDS[k][0]));b.type='button';b.onclick=()=>{if(m.done[k])return;m.sel=k;drawLeft();};L.append(b);});
  m.right.forEach(k=>{const b=el('button',m.done[k]?'ok':'',esc(WORDS[k][1]));b.type='button';b.onclick=()=>{if(m.done[k]||m.sel==null)return;if(m.sel===k){m.done[k]=1;m.sel=null;drawLeft();}else{m.err++;b.classList.add('no');setTimeout(()=>b.classList.remove('no'),500);}};R.append(b);});
  g.append(L,R);box.append(g);const fin=Object.keys(m.done).length===4,nav=el('div','qznav');
  nav.append(el('b',null,'Round '+m.round+' · mistakes: '+m.err),fin?btn('Next round →',()=>{st.next={round:m.round+1,err:m.err};st.mt=null;drawLeft();},'main'):el('span','note','Click a phrase, then its meaning.'));box.append(nav);}

/* ---------- Справа: устная часть, задания 1–4 под кнопками ---------- */
function drawRight(){if(cleanR){cleanR();cleanR=null;}stopSay();PR.innerHTML='';
  if(!hwAnyRight()){PR.append(el('div','lockbox','<b>Locked</b><span>Not in your homework</span>'));return;}
  if(!hwRight(S.right)){S.right=[1,2,3,4].find(hwRight)||1;}
  PR.append(segHW([[1,'1 · Reading aloud'],[2,'2 · Questions'],[3,'3 · Interview'],[4,'4 · Monologue']],S.right,v=>{S.right=v;drawRight();},hwRight));
  const body=el('div','pbody sp4');PR.append(body);[null,t1,t2,t3,t4][S.right](body);}
/* общий блок управления: круговой таймер с фазами и запись */
function ctl(box,phases,name,extra,onPhase){const c=el('div','ctl2'),ring=ringEl(phases[0].sec),label=el('div','phase','Press Start'),rec=el('div','rec');ring.querySelector('span').textContent='ready';
  const run=phaseRunner({ring,label,phases,recBox:rec,recName:name,en:true,onPhase});
  const st=btn('Start',()=>{run.start();st.textContent='Restart';pa.disabled=sk.disabled=false;pa.textContent='Pause';},'main wide'),pa=btn('Pause',()=>{pa.textContent=run.pause()?'Continue':'Pause';},'sm'),sk=btn('Skip',()=>run.skip(),'sm');pa.disabled=sk.disabled=true;
  const b=el('div','ctlbtns');b.append(st,pa,sk,recBtn());(extra||[]).forEach(x=>b.append(x));c.append(ring,label,b,rec);box.append(c);cleanR=()=>run.stop();}
function t1(box){const st=S.t1,r=READS[st.v],k=el('div','kim2');
  k.innerHTML='<p class="task">Task 1. Imagine that you are preparing a project with your friend. You have found some interesting material for the presentation and you want to read this text to your friend. You have 1.5 minutes to read the text silently, then be ready to read it out aloud. You will not have more than 1.5 minutes to read it.</p><div class="textbox">'+esc(r.x)+'</div>';
  box.append(k);ctl(box,[{label:'Preparation · read silently',kind:'prep',sec:90},{label:'Answer · read aloud',kind:'answer',sec:90}],'task1-'+(st.v+1),[btn('Tips',()=>overlayEn('Reading aloud · what to check','<p><b>Words to pronounce carefully:</b> '+esc(r.note)+'.</p><p>Pause at commas and full stops, let your voice fall at the end of a statement, read numbers in full, pronounce the endings -ed and -s.</p>'),'sm wide'),btn('Text '+(st.v+1)+' of '+READS.length,()=>{st.v=(st.v+1)%READS.length;drawRight();},'sm wide')]);}
function t2(box){const st=S.t2,a=ADS[st.v],k=el('div','kim2');
  k.innerHTML='<p class="task">Task 2. Study the advertisement.</p><div class="adrow"><div class="ruad" style="background:'+a.c+'"><b>'+esc(a.title)+'</b><span>'+esc(a.sub)+'</span></div><div><p class="task">'+esc(a.intro)+' In 1.5 minutes you are to ask four direct questions to find out about the following:</p><ol id="pts">'+a.points.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ol><p class="task">You have 20 seconds to ask each question.</p></div></div>';
  box.append(k);
  ctl(box,[{label:'Preparation',kind:'prep',sec:90}].concat(a.points.map((p,i)=>({label:'Question '+(i+1),kind:'answer',sec:20}))),'task2-'+(st.v+1),
    [...(SHOW?[btn('Sample questions',()=>showSample(a.title+' · sample questions','<ol class="smpl">'+a.key.map((x,i)=>'<li><i>'+esc(a.points[i])+'</i><br>'+ED.t('w1.t2.'+st.v+'.'+i,x)+'</li>').join('')+'</ol>',null,'Close'),'sm wide')]:[]),btn('Advert '+(st.v+1)+' of 2',()=>{st.v=1-st.v;drawRight();},'sm wide')],
    i=>{[...PR.querySelectorAll('#pts li')].forEach((x,j)=>{x.className=i<1?'':(j===i-1?'now':(j<i-1?'past':''));});});}
function t3(box){const st=S.iv,v=IV[st.v];let left=40,t=null;
  const wrap=el('div','kim2 ivw'),top=el('div','ivtop'),sel=el('select');sel.setAttribute('aria-label','Set');IV.forEach((x,k)=>sel.append(new Option('Set '+(k+1)+' · '+x.theme,k)));sel.value=st.v;
  sel.onchange=()=>{st.v=+sel.value;st.q=0;st.flip=false;st.smp=false;drawRight();};
  const qc=el('div','chips');v.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;st.smp=false;drawRight();};qc.append(b);});
  top.append(sel,qc,btn('Intro',()=>play(true),'sm'));wrap.append(top);
  const card=el('div','ivcard');wrap.append(card);
  const nav=el('div','qznav'),bk=btn('←',()=>{st.q--;st.flip=false;st.smp=false;drawRight();},'sm'),fw=btn(st.q<v.q.length-1?'→':'Next set',()=>{if(st.q<v.q.length-1)st.q++;else{st.v=(st.v+1)%IV.length;st.q=0;}st.flip=false;st.smp=false;drawRight();},'sm');bk.disabled=st.q===0;
  nav.append(bk,btn('Flip the card',()=>{st.flip=!st.flip;face();},'main sm'),fw);wrap.append(nav);box.append(wrap);
  const c=el('div','ctl2'),ring=el('div','ring ans','<b>40</b><span>seconds</span>'),label=el('div','phase','Press Play'),rec=el('div','rec');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};
  const runT=()=>{stopT();left=40;paint();label.textContent='Answer';beep(880,200);Rec.start();const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Time is up';beep(520,500);Rec.stop(rec,v.id+'-q'+(st.q+1));}},200);};
  function play(intro){stopT();Rec.cancel();left=40;paint();label.textContent=intro?'Introduction is playing':'Question is playing';say(intro?v.intro:v.q[st.q],()=>{if(intro)label.textContent='Now press Play';else runT();},()=>{label.textContent='No English voice in this browser';});}
  function face(){card.className='ivcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip){card.append(el('div','ey','Question '+(st.q+1)+' · '+esc(v.theme)),el('div','qq',esc(v.q[st.q])));if(st.smp)card.append(el('div','smpa',ED.t('w1.iv.'+v.id+'.'+st.q,v.a[st.q])));if(SHOW)card.append(btn(st.smp?'Hide the answer':'Sample answer',()=>{st.smp=!st.smp;face();},'sm'));}
    else{card.append(el('div','ey','Question '+(st.q+1)+' of '+v.q.length),el('div','big','Listen and answer'));const pb=el('div','navrow');pb.append(btn('Play',()=>play(false),'main'),btn('Replay',()=>play(false)),btn('Stop',()=>{stopSay();stopT();Rec.cancel();label.textContent='Stopped';}));card.append(pb);}}
  face();const b=el('div','ctlbtns');b.append(btn('Timer',runT,'sm'),btn('Reset',()=>{stopT();Rec.cancel();left=40;paint();label.textContent='Press Play';},'sm'),recBtn(),btn('Answer plan',()=>overlayEn('Answer plan · 2–3 sentences','<p><b>1.</b> Answer the question directly.<br><b>2.</b> Give a reason or a detail.<br><b>3.</b> Add an example, a feeling or a result.</p><p><b>Useful starts:</b> To be honest, … · As far as I know, … · The thing is that … · For example, … · That’s why …</p><p>Use the same tense as the question. Answer both parts of a double question.</p>'),'sm wide'));
  c.append(ring,label,b,rec);box.append(c);cleanR=()=>{stopT();stopSay();Rec.cancel();};}
function t4(box){if(S.t4.v===1){talk(box);return;}const k=el('div','kim2 t4w');
  k.innerHTML='<div class="t4txt"><p class="task">Task 4. Imagine that you and your friend are doing a school project “'+esc(P4.project)+'”. You have found some photos to illustrate it but for technical reasons you cannot send them now. Leave a voice message to your friend explaining your choice of the photos and sharing some ideas about the project. In 2.5 minutes be ready to:</p><ul><li>explain the choice of the illustrations for the project by briefly describing them and noting the differences;</li><li>mention the advantages (1–2) of '+esc(P4.kind)+';</li><li>mention the disadvantages (1–2) of '+esc(P4.kind)+';</li><li>express your opinion on the subject of the project – '+esc(P4.pref)+'.</li></ul><p class="task">You will speak for not more than 3 minutes (12–15 sentences). You have to talk continuously.</p></div><div class="pics2"><figure><figcaption>Photo 1</figcaption><img src="'+P4.img[0]+'" alt="'+esc(P4.cap[0])+'"></figure><figure><figcaption>Photo 2</figcaption><img src="'+P4.img[1]+'" alt="'+esc(P4.cap[1])+'"></figure></div>';
  box.append(k);ctl(box,[{label:'Preparation',kind:'prep',sec:150},{label:'Answer · voice message',kind:'answer',sec:180}],'task4',[...(SHOW?[btn('Sample answer',()=>showSample('Task 4 · sample answer','<p>'+ED.t('w1.t4',P4.s)+'</p>','This is a sample, not the only correct answer.','Close'),'sm wide')]:[]),btn('Variant 1 of 2',()=>{S.t4.v=1;drawRight();},'sm wide')]);}

function talk(box){const k=el('div','kim2');
  k.innerHTML='<p class="task">Monologue. You are going to give a talk about '+esc(TALK.title.toLowerCase())+'. You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences). Remember to say:</p><ul>'+TALK.points.map(p=>'<li>'+esc(p)+';</li>').join('').replace(/;<\/li>$/,'.</li>')+'</ul><p class="task">You have to talk continuously.</p>';
  box.append(k);ctl(box,[{label:'Preparation',kind:'prep',sec:90},{label:'Answer · talk',kind:'answer',sec:120}],'talk-best-friend',[...(SHOW?[btn('Sample answer',()=>showSample('Your best friend · sample talk','<p>'+ED.t('w1.talk',TALK.s)+'</p>','This is a sample, not the only correct answer.','Close'),'sm wide')]:[]),btn('Variant 2 of 2',()=>{S.t4.v=0;drawRight();},'sm wide')]);}

/* ---------- Домашнее задание и заметки учителя – под кнопками ---------- */
function homework(){overlayEn('Homework · before the next lesson','<ol class="hwl"><li><b>Words.</b> Learn the 16 phrases. Play Match until you finish a round with no mistakes.</li><li><b>Interview.</b> Answer Set 2 (Friendship) with the timer and the recording on. Send the five recordings.</li><li><b>Letter 37.</b> Block 1 tasks → Letter 37 → “Family gatherings · Ann”: 20 minutes, 100–140 words. Then compare it with the sample email.</li><li><b>Grammar and word formation.</b> Block 1 tasks → two grammar texts and two word formation texts. Send screenshots of your scores.</li></ol>');}
function teacher(){const notes={1:'<p><b>Задание 1 · чтение вслух.</b> Два текста (кнопка Text 1/2): «Family dinners» и «Human brain» из подборки. 1,5 минуты про себя, 1,5 минуты вслух. 1 балл: нет необоснованных пауз, интонация верная, не более 5 фонетических ошибок, из них не более 2 искажают смысл. Трудные слова – в кнопке Tips.</p>',
  2:'<p><b>Задание 2 · вопросы.</b> По 1 баллу за прямой, грамматически верный вопрос по пункту. Перед заданием – Error hunter слева: ловушки «Can you tell me…», are/is there, вспомогательный глагол.</p>',
  3:'<p><b>Задание 3 · интервью.</b> Вопросы звучат голосом браузера; если голоса нет, прочитайте вопрос сами, не показывая текст. По 1 баллу: 2–3 фразы, верное время глагола, ответ на обе части вопроса. Просите использовать 1–2 фразы из Words.</p>',
  4:'<p><b>Задание 4 · монолог.</b> Вариант 1 – по двум фото в формате ЕГЭ; вариант 2 – «Your best friend» из подборки (формат ОГЭ: 10–12 фраз по плану, 1,5 мин подготовки, 2 мин ответ) – как разминка перед ЕГЭ-монологом. К1 (0–4): все четыре пункта, 12–15 фраз; К2 (0–3): обращение к другу, вступление и заключение, связность; К3 (0–3): язык. При 0 по К1 всё задание – 0.</p>'};
  overlay('Учителю · только для вас','<p><b>Ход урока, 60 минут.</b> 0–7: Words слева (карточки, потом Match). 7–15: Error hunter. 15–25: задание 2. 25–45: задание 3, Set 1 и Set 2 с записью. 45–55: задание 1 или 4 – по времени. 55–60: Homework.</p>'+notes[S.right],
   S.right===2?ADS[S.t2.v].points.map((p,k)=>scoreRow((k+1)+'. '+p,1,()=>S.sc.t2[k],n=>S.sc.t2[k]=n)):S.right===3?IV[S.iv.v].q.map((q,k)=>scoreRow('Answer '+(k+1),1,()=>S.sc.t3[k],n=>S.sc.t3[k]=n)):S.right===1?[scoreRow('Reading aloud',1,()=>S.sc.t1,n=>S.sc.t1=n)]:[scoreRow('К1',4,()=>S.sc.k1,n=>S.sc.k1=n),scoreRow('К2',3,()=>S.sc.k2,n=>S.sc.k2=n),scoreRow('К3',3,()=>S.sc.k3,n=>S.sc.k3=n)]);}

/* ссылки с главного экрана: #w #h #m – карточки слева, #t1–#t4 – устная часть справа, #hw – домашнее задание */
(function(){const h=location.hash.slice(1),L={w:'cards',c:'colls',h:'hunt',m:'match'}[h],R=/^t[1-4]$/.test(h)?+h[1]:0;if(L)S.left=L;if(R)S.right=R;layout();if(h==='hw')homework();if(RV)showReview(RV);})();
