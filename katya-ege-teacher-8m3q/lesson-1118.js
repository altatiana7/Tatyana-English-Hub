/* Урок 18 ноября · Катя ЕГЭ: тест по «Семье» → блок Education (урок 1). Каркас – как в family-lesson.js. Ничего не сохраняется: страница каждый раз открывается с начала. */
const main=$('#main');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- озвучка вопросов ---------- */
let voice=null;
function pickVoice(){const v=(window.speechSynthesis&&speechSynthesis.getVoices())||[];voice=v.find(x=>/en-GB/i.test(x.lang)&&/Google|Natural|Sonia|Libby|Ryan/i.test(x.name))||v.find(x=>/en-GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
function say(text,done,fail){if(!window.speechSynthesis){fail&&fail();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);if(voice)u.voice=voice;u.lang=voice?voice.lang:'en-GB';u.rate=.95;u.onend=()=>done&&done();u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')fail&&fail();};speechSynthesis.speak(u);}
function stopSay(){try{window.speechSynthesis&&speechSynthesis.cancel();}catch(e){}}
function cards(box,st,deck,kindOf){const n=deck.length;if(!st.order)st.order=[...Array(n).keys()];
  const k=st.order[st.i],c=deck[k];
  const bar=el('div','qzbar');bar.innerHTML='<i style="width:'+((st.i+1)/n*100)+'%"></i>';
  const card=el('div','qzcard'+(st.flip?' flipped':'')),inner=el('div','qzin');
  const kind=kindOf(k);
  inner.append(el('div','qzface qzfront','<span class="qzk">'+kind+'</span><div class="qzterm">'+esc(c[0])+'</div>'),el('div','qzface qzback','<span class="qzk">Meaning</span><div class="qzdef">'+esc(c[1])+'</div>'+(c[2]?'<div class="qzex">'+esc(c[2])+'</div>':'')));card.append(inner);
  const flip=()=>{st.flip=!st.flip;card.classList.toggle('flipped',st.flip);};card.onclick=flip;
  const move=d=>{st.i=(st.i+d+n)%n;st.flip=false;drawLeft();};
  const nav=el('div','qznav'),pv=el('button','qzarr','&larr;'),nx=el('button','qzarr','&rarr;');pv.type=nx.type='button';pv.onclick=()=>move(-1);nx.onclick=()=>move(1);pv.disabled=st.i===0;
  const sh=btn(st.shuf?'Shuffled':'Shuffle',()=>{st.order=st.shuf?[...Array(n).keys()]:shuffle([...Array(n).keys()]);st.shuf=!st.shuf;st.i=0;st.flip=false;drawLeft();},'sm'+(st.shuf?' main':''));
  nav.append(sh,pv,el('b','qzcnt',(st.i+1)+' / '+n),nx,btn(st.i===n-1&&st.flip?'Start again':'Flip',()=>{if(st.i===n-1&&st.flip){st.i=0;st.flip=false;drawLeft();}else flip();},'sm'));
  box.append(bar,card,nav);}

function speak(box){const st=S.sp,set=SETS[st.set];let left=40,t=null;
  const wrap=el('div','kim2 ivw'),top=el('div','ivtop'),sel=el('select');SETS.forEach((x,k)=>sel.append(new Option('Set '+(k+1)+' · '+x.name,k)));sel.value=st.set;
  sel.onchange=()=>{st.set=+sel.value;st.q=0;st.flip=false;drawRight();};
  const qc=el('div','chips');set.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;drawRight();};qc.append(b);});
  top.append(sel,qc);wrap.append(top);
  const card=el('div','ivcard');wrap.append(card);
  const nav=el('div','qznav'),bk=btn('←',()=>{st.q--;st.flip=false;drawRight();},'sm'),fw=btn(st.q<set.q.length-1?'→':'Next set',()=>{if(st.q<set.q.length-1)st.q++;else{st.set=(st.set+1)%SETS.length;st.q=0;}st.flip=false;drawRight();},'sm');bk.disabled=st.q===0;
  nav.append(bk,btn('Flip the card',()=>{st.flip=!st.flip;face();},'main sm'),fw);wrap.append(nav);box.append(wrap);
  const c=el('div','ctl2'),ring=el('div','ring ans','<b>40</b><span>seconds</span>'),label=el('div','phase','Press Play'),bx=el('div','ctlbtns');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};
  const runT=()=>{stopT();left=40;paint();label.textContent='Answer';beep(880,200);const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Time is up';beep(520,500);}},200);};
  function play(){stopT();left=40;paint();label.textContent='Question is playing';say(set.q[st.q],runT,()=>{label.textContent='No English voice: press Timer';});}
  function face(){card.className='ivcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip)card.append(el('div','ey','Question '+(st.q+1)+' · '+esc(set.name)),el('div','qq',esc(set.q[st.q])));
    else{card.append(el('div','ey','Question '+(st.q+1)+' of '+set.q.length),el('div','big','Listen and answer'));const pb=el('div','navrow');pb.append(btn('Play',play,'main'),btn('Replay',play),btn('Stop',()=>{stopSay();stopT();label.textContent='Stopped';}));card.append(pb);}}
  face();bx.append(btn('Timer',runT,'sm'),btn('Reset',()=>{stopT();stopSay();left=40;paint();label.textContent='Press Play';},'sm'));
  c.append(ring,label,bx);box.append(c);
  box.style.flexDirection='row';box.style.gap='10px';
  cleanR=()=>{stopT();stopSay();};}


function seg(items,cur,onPick){const s=el('div','seg');items.forEach(([v,l])=>{const b=el('button','segb'+(v===cur?' on':''),l);b.type='button';b.onclick=()=>onPick(v);s.append(b);});return s;}
let cleanR=null;const drawLeft=()=>H.render(),drawRight=()=>H.render();
const S={sp:{set:0,q:0,flip:false},c:{i:0,order:null,shuf:false,flip:false},ft:{i:0,picks:{},done:false},ch:{i:0,picks:{},done:false},g30:{ans:{},open:null},wf:{t:0,open:{}}};

/* ---------- данные ---------- */
const SETS=[
 {name:'Task 3 · Education and learning',q:['What school subjects do you find most useful for your future, and why?','How do you usually prepare for important exams?','Would you prefer to study at a university in your home town or in another city? Why?','What do you think about distance learning?','Do you think taking a gap year is a good idea for school leavers?']},
 {name:'Opinions · Education',q:['Should every student learn a foreign language at school? Why?','Is it better to learn things by heart or to understand how they work?','Should higher education be free for everyone?','What makes a really good teacher?','How do you think schools will change in the next twenty years?']}];

const FT=[
 ['Collocations','My parents are strict, but I know they ______ my best interests at heart.',['have','keep','take','hold'],'have'],
 ['Phrasal verbs','Sophie ______ her grandmother: she has the same sense of humour and the same stubbornness.',['takes after','looks after','looks like','takes up'],'takes after'],
 ['Collocations','After years of not ______ speaking terms, the brothers finally made up.',['being on','keeping in','staying at','having on'],'being on'],
 ['Prepositions','Teenagers often clash ______ their parents over curfews and pocket money.',['with','against','to','at'],'with'],
 ['Idioms','The twins are so alike: Mia is the spitting ______ of her sister.',['image','picture','copy','mirror'],'image'],
 ['Collocations','Living with three generations under one roof can put a ______ on relationships.',['strain','pressure','weight','load'],'strain'],
 ['Phrasal verbs','It was a risky decision, but his family ______ him all the way.',['stood by','stood for','stood out','stood up'],'stood by'],
 ['Word formation','Their ______ has always been based on mutual trust. (RELATE)',['relationship','relation','relative','relativity'],'relationship'],
 ['Word formation','Despite their differences, the siblings remain very ______ of each other. (SUPPORT)',['supportive','supported','supporting','supportable'],'supportive'],
 ['Word formation','Many young adults want to be financially ______ of their parents. (DEPEND)',['independent','dependent','independence','undependable'],'independent'],
 ['Word formation','She felt completely ______ for all the housework she did. (APPRECIATE)',['unappreciated','inappreciated','disappreciated','misappreciated'],'unappreciated'],
 ['Phrasal verbs','After a heated argument, the sisters soon ______ things up.',['patched','fixed','mended','repaired'],'patched'],
 ['Collocations','The generation ______ means that parents and teens often see things differently.',['gap','gulf','split','distance'],'gap'],
 ['Idioms','My uncle is the black ______ of the family: he never follows the rules.',['sheep','horse','cat','crow'],'sheep'],
 ['Confusables','She was ______ by her aunt after her parents moved abroad.',['raised','grown','risen','arisen'],'raised']];

const EDU=[
 ['to sit / take an exam','to do an exam (the process)','Thousands of students sit the EGE every June.'],
 ['to pass / fail an exam','to succeed / not succeed in an exam','She passed with flying colours.'],
 ['to resit an exam','to take an exam again after failing','If you fail, you can resit it in the autumn.'],
 ['to cram for an exam','to study very hard just before an exam','Cramming the night before rarely works.'],
 ['to fall behind with','to fail to keep up with work','He fell behind with his coursework after the illness.'],
 ['to catch up on / with','to do work you have missed','I need to catch up on the lectures I missed.'],
 ['to drop out of','to leave school or university before finishing','She dropped out of university to start a business.'],
 ['to enrol on a course','to officially join a course','I have enrolled on an online coding course.'],
 ['to apply for / to','to ask officially for a place (for a course / to a university)','He applied to three universities.'],
 ['to graduate from','to complete a university degree','My sister graduated from MSU last year.'],
 ['tuition fees','money paid for teaching','Tuition fees have risen sharply.'],
 ['a scholarship','money given to a student for good results','She won a full scholarship to Oxford.'],
 ['a gap year','a year off between school and university','Many school leavers take a gap year.'],
 ['higher education','education at university or college','Higher education should be accessible to all.'],
 ['distance learning','studying from home online','Distance learning suits self-disciplined students.'],
 ['a heavy workload','a large amount of work','The final year comes with a heavy workload.'],
 ['to meet a deadline','to finish work on time','I worked all weekend to meet the deadline.'],
 ['to do research','to study a subject in detail','Students are expected to do research on their own.'],
 ['rote learning','memorising without understanding','Rote learning is still common in some schools.'],
 ['a well-rounded education','an education that develops many abilities','Sport and art are part of a well-rounded education.'],
 ['compulsory / optional subjects','subjects you must / may choose to study','Maths is compulsory; drama is optional.'],
 ['to major in','to study as your main subject at university','She is majoring in economics.']];

const CHQ=[
 ['Phrasal verbs','Students who ______ behind with their studies often struggle in the final year.',['fall','drop','get','stay'],'fall'],
 ['Collocations','He failed the maths exam and has to ______ it in August.',['resit','replay','return','review'],'resit'],
 ['Collocations','Most of us were up all night ______ for the history test.',['cramming','stuffing','filling','packing'],'cramming'],
 ['Phrasal verbs','She ______ out of university after the first year to start a business.',['dropped','fell','left','gave'],'dropped'],
 ['Confusables','The university offers a full ______ to students with outstanding results.',['scholarship','salary','fee','wage'],'scholarship'],
 ['Collocations','Lecturers expect first-year students to ______ research independently.',['do','make','take','have'],'do'],
 ['Collocations',"I'm afraid I won't be able to ______ the deadline for the essay.",['meet','catch','keep','win'],'meet'],
 ['Prepositions','To be considered, you must apply ______ the course before 1 March.',['for','to','on','at'],'for'],
 ['Confusables','Only those who ______ the entrance exam will be admitted.',['pass','succeed','achieve','win'],'pass'],
 ['Confusables','Tuition ______ at British universities have risen sharply.',['fees','prices','payments','costs'],'fees'],
 ['Prepositions','My brother graduated ______ Moscow State University last year.',['from','at','in','of'],'from'],
 ['Collocations','Many teachers criticise ______ learning, where facts are memorised without understanding.',['rote','heart','head','mind'],'rote'],
 ['Collocations','She is taking a ______ year to travel before going to university.',['gap','free','break','spare'],'gap'],
 ['Confusables','Students can choose ______ subjects in addition to the core curriculum.',['optional','voluntary','free','chosen'],'optional']];

const T30="For many school leavers in the UK, a gap year has become a popular way to [30] a break between school and university. Some students use it to [31] money for their tuition fees, while others travel or volunteer abroad. Critics argue that a year away from studying makes it harder to [32] back into the academic routine. However, research suggests that students who take a gap year are less likely to [33] out of university later. Admissions officers also say that such applicants often show greater maturity and a clearer sense of [34]. Of course, a gap year does not [35] success: it all depends on how the time is spent. Students who simply stay at home are unlikely to gain much, so careful planning is [36] to making the year worthwhile.";
const K30={30:[['take','make','do','get'],'take'],31:[['earn','win','gain','profit'],'earn'],32:[['get','turn','put','set'],'get'],33:[['drop','fall','leave','give'],'drop'],34:[['direction','way','route','course'],'direction'],35:[['guarantee','warrant','assure','insure'],'guarantee'],36:[['key','main','chief','major'],'key']};
Object.keys(K30).forEach(n=>{K30[n][0]=shuffle(K30[n][0]);});
const WHY30={30:'take a break – a fixed collocation',31:'earn money; gain experience / weight',32:'get back into a routine',33:'drop out of school or university',34:'a sense of direction – knowing where you are going',35:'guarantee success; assure somebody',36:'be key to doing something'};

const WF=[
 {name:'Online learning',rows:[
  ['In recent years, online courses have become an [25] alternative to traditional classes.','ATTRACT','attractive'],
  ['Many learners appreciate the [26] to study at their own pace.','FREE','freedom'],
  ['However, some find it hard to stay motivated without the [27] of a teacher.','SUPERVISE','supervision'],
  ['Experts warn that the lack of face-to-face contact can make students feel [28].','ISOLATE','isolated'],
  ['Nevertheless, the number of people taking online degrees continues to grow [29].','STEADY','steadily']]},
 {name:'University life',rows:[
  ['Moving away from home to study can be a truly [25] experience.','CHALLENGE','challenging'],
  ['First-year students often struggle with their sudden [26].','INDEPENDENT','independence'],
  ['Universities offer support to help them cope with stress and [27].','LONELY','loneliness'],
  ['Those who fail to plan their time are at risk of becoming [28].','ORGANISE','disorganised'],
  ['With the right attitude, most students adapt [29] to their new life.','SUCCESS','successfully']]}];

/* ---------- прогноз по фото ---------- */
function predict(box){box.append(el('div','inst','<b>Look at the photos and predict.</b>'));
  const g=el('div','pic3');for(let i=1;i<=3;i++){const f=el('figure');const img=new Image();const ex=['jpg','png','webp'];let x=0;img.alt='Photo '+i;
    img.onerror=()=>{x++;if(x<ex.length)img.src='img/edu-'+i+'.'+ex[x];else img.replaceWith(el('div','ph','Photo '+i));};img.src='img/edu-'+i+'.'+ex[0];f.append(img);g.append(f);}
  box.append(g);
  box.append(el('ol','pq','<li>Where are these people and what are they doing? They might be… / They must be…</li><li>How do you think each of them feels about studying?</li><li>Which of these ways of learning works best for you, and why?</li><li>What problems connected with education could come up in the exam (Task 3, 4, 37 or 38)?</li>'));}

/* ---------- выбор ответа: по одному вопросу, можно листать без ответа ---------- */
function mcqFree(box,st,data){const n=data.length,wrap=el('div','chq');box.append(wrap);
  const score=()=>data.filter((x,k)=>st.picks[k]===x[3]).length;
  if(st.done){const e=el('div','end');e.append(el('div','score',score()+' / '+n));
    const bad=data.map((x,k)=>k).filter(k=>st.picks[k]!==data[k][3]);
    if(bad.length){e.append(el('div','tag','Check these'));const ul=el('ul','errs');bad.forEach(k=>ul.append(el('li',null,esc(data[k][1]).replace('______','<b>'+esc(data[k][3])+'</b>'))));e.append(ul);}
    else e.append(el('div','fb','No mistakes.'));
    e.append(btn('Back to questions',()=>{st.done=false;st.i=0;H.render();},'main'));wrap.append(e);return;}
  const k=st.i,it=data[k],pick=st.picks[k];
  if(!st.opts)st.opts={};if(!st.opts[k])st.opts[k]=shuffle(it[2]);
  const meta=el('div','meta'),bar=el('div','qzbar');bar.innerHTML='<i style="width:'+(Object.keys(st.picks).length/n*100)+'%"></i>';
  meta.append(el('span',null,(k+1)+' / '+n),bar,el('span',null,'Score '+score()));wrap.append(meta);
  const dots=el('div','qdots');data.forEach((x,j)=>{const d=el('button','qd'+(j===k?' on':'')+(st.picks[j]!==undefined?(st.picks[j]===x[3]?' ok':' no'):''),String(j+1));d.type='button';d.onclick=()=>{st.i=j;H.render();};dots.append(d);});wrap.append(dots);
  wrap.append(el('div','tag',esc(it[0])),el('div','qtxt',esc(it[1])));
  const og=el('div','opts');st.opts[k].forEach(o=>{const b=el('button',null,esc(o));b.type='button';b.disabled=pick!==undefined;
    if(pick!==undefined){if(o===it[3])b.classList.add('ok');else if(o===pick)b.classList.add('no');}
    b.onclick=()=>{st.picks[k]=o;H.render();};og.append(b);});wrap.append(og);
  const fb=el('div','fb',pick===undefined?'':(pick===it[3]?'Correct.':'The answer is: <b>'+esc(it[3])+'</b>.'));
  const pv=btn('← Previous',()=>{st.i--;H.render();},'sm');pv.disabled=k===0;
  const nx=k===n-1?btn('See result',()=>{st.done=true;H.render();},'main sm'):btn('Next →',()=>{st.i++;H.render();},'main sm');
  const foot=el('div','foot');foot.append(fb,pv,nx);wrap.append(foot);}

/* ---------- ЕГЭ 30–36: сплошной текст, пропуск открывается нажатием ---------- */
function ege30(box){const st=S.g30;box.append(el('div','inst','<b>Gap year.</b> Read the text and choose the best option for each gap (30–36).'));
  const w=el('div','egew');
  T30.split(/\[(\d+)\]/).forEach((p,i)=>{if(i%2===0){w.append(document.createTextNode(p));return;}
    const n=+p,ans=K30[n][1],cur=st.ans[n];
    const g=el('span','gap'+(cur?(cur===ans?' ok':' no'):''),cur?esc(cur):String(n));
    g.onclick=e=>{e.stopPropagation();st.open=st.open===n?null:n;H.render();};
    if(st.open===n){const pop=el('div','gpop');K30[n][0].forEach((o,j)=>{const b=el('button',null,(j+1)+') '+esc(o));b.type='button';b.onclick=ev=>{ev.stopPropagation();st.ans[n]=o;st.open=null;H.render();};pop.append(b);});g.append(pop);}
    w.append(g);});
  box.append(w);
  const ok=Object.keys(K30).filter(n=>st.ans[n]===K30[n][1]).length,all=Object.keys(st.ans).length===7;
  const bar=el('div','fbar');bar.append(el('b',null,ok+' / 7'),btn('Show answers',()=>{Object.keys(K30).forEach(n=>st.ans[n]=K30[n][1]);st.open=null;H.render();},'sm'),btn('Reset',()=>{st.ans={};st.open=null;H.render();},'sm'));box.append(bar);
  if(all){const ul=el('ul','whyl');Object.keys(K30).forEach(n=>ul.append(el('li',null,'<b>'+n+'</b> '+esc(WHY30[n]))));box.append(ul);}
  const close=()=>{if(st.open!==null){st.open=null;H.render();}};document.addEventListener('click',close);cleanR=()=>document.removeEventListener('click',close);}

/* ---------- ЕГЭ 25–29: как на сайте ФИПИ, слово справа, ответ по нажатию на пропуск ---------- */
function wordForm(box){const st=S.wf,T=WF[st.t];
  const top=el('div','fbar');top.append(seg(WF.map((x,k)=>[k,'Text '+(k+1)+' · '+x.name]),st.t,v=>{st.t=v;st.open={};H.render();}),
    btn('Show all',()=>{T.rows.forEach((r,k)=>st.open[k]=true);H.render();},'sm'),btn('Hide',()=>{st.open={};H.render();},'sm'));box.append(top);
  box.append(el('div','inst','Read the text. Form a word that fits each gap from the word in capitals.'));
  const tb=el('table','wft');T.rows.forEach((r,k)=>{const tr=el('tr');const td=el('td');
    r[0].split(/\[(\d+)\]/).forEach((p,i)=>{if(i%2===0){td.append(document.createTextNode(p));return;}
      const g=el('span','gap wfg'+(st.open[k]?' ok':''),st.open[k]?esc(r[2]):p);g.onclick=()=>{st.open[k]=!st.open[k];H.render();};td.append(g);});
    tr.append(el('td','wfn',String(25+k)),td,el('td','wfw',esc(r[1])));tb.append(tr);});
  box.append(tb);}

const H=Hub({title:'18 November · Family → Education',sub:'Тест по теме «Семья» и первый урок блока Education.',
 clean:()=>{if(cleanR){cleanR();cleanR=null;}},
 groups:[
 {name:'Разминка',color:'#c8553d',items:[
  {id:'predict',t:'Predict',sub:'Фото: о чём тема?',run:predict},
  {id:'speak',t:'Speaking',sub:'Task 3 · Education',run:speak}]},
 {name:'Family · тест',color:'#8f4d7c',items:[
  {id:'ftest',t:'Family test',sub:'15 вопросов',run:b=>mcqFree(b,S.ft,FT)}]},
 {name:'Education · лексика',color:'#2c7f78',items:[
  {id:'cards',t:'Cards',sub:EDU.length+' карточек',run:b=>cards(b,S.c,EDU,k=>k<10?'Verb phrase':'Collocation')},
  {id:'choose',t:'Choose',sub:CHQ.length+' вопросов',run:b=>mcqFree(b,S.ch,CHQ)}]},
 {name:'Education · ЕГЭ',color:'#2855d9',items:[
  {id:'e30',t:'30–36 · Gap year',sub:'7 пропусков',run:ege30},
  {id:'wf',t:'25–29 · Word formation',sub:'2 текста по 5',run:wordForm}]},
 {name:'Ещё к теме',color:'#4a4f8f',items:[
  {t:'Family · вариант ЕГЭ',sub:'Семья и друзья: 1–38',href:'family-variant.html?v=2'},
  {t:'Family · урок',sub:'Карточки и тексты',href:'family-lesson.html?v=4'}]}
 ]});
H.render();
