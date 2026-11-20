/* Урок 20 ноября · Катя ЕГЭ: блок Education, урок 2 (Lesson 2 Крыловой + ФИПИ: 12–18, 30–36, ловушки 19–24). Каркас – как в lesson-1118.js. Ничего не сохраняется: страница каждый раз открывается с начала. */
const main=$('#main');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

function cards(box,st,deck,kindOf){const n=deck.length;if(!st.order)st.order=[...Array(n).keys()];
  const k=st.order[st.i],c=deck[k];
  const bar=el('div','qzbar');bar.innerHTML='<i style="width:'+((st.i+1)/n*100)+'%"></i>';
  const card=el('div','qzcard'+(st.flip?' flipped':'')),inner=el('div','qzin');
  const kind=kindOf(k);
  inner.append(el('div','qzface qzfront','<span class="qzk">'+kind+'</span><div class="qzterm">'+esc(c[0])+'</div>'),el('div','qzface qzback','<span class="qzk">Meaning</span><div class="qzdef">'+esc(c[1])+'</div>'+(c[2]?'<div class="qzex">'+esc(c[2])+'</div>':'')));card.append(inner);
  const flip=()=>{st.flip=!st.flip;card.classList.toggle('flipped',st.flip);if(st.flip)sayWord(c[0]);};card.onclick=flip;
  const sb=el('button','qzsnd',SND);sb.type='button';sb.title='Listen';sb.onclick=e=>{e.stopPropagation();sayWord(c[0]);};card.append(sb);
  const move=d=>{st.i=(st.i+d+n)%n;st.flip=false;drawLeft();};
  const nav=el('div','qznav'),pv=el('button','qzarr','&larr;'),nx=el('button','qzarr','&rarr;');pv.type=nx.type='button';pv.onclick=()=>move(-1);nx.onclick=()=>move(1);pv.disabled=st.i===0;
  const sh=btn(st.shuf?'Shuffled':'Shuffle',()=>{st.order=st.shuf?[...Array(n).keys()]:shuffle([...Array(n).keys()]);st.shuf=!st.shuf;st.i=0;st.flip=false;drawLeft();},'sm'+(st.shuf?' main':''));
  nav.append(sh,pv,el('b','qzcnt',(st.i+1)+' / '+n),nx,btn(st.i===n-1&&st.flip?'Start again':'Flip',()=>{if(st.i===n-1&&st.flip){st.i=0;st.flip=false;drawLeft();}else flip();},'sm'));
  box.append(bar,card,nav);}

function seg(items,cur,onPick){const s=el('div','seg');items.forEach(([v,l])=>{const b=el('button','segb'+(v===cur?' on':''),l);b.type='button';b.onclick=()=>onPick(v);s.append(b);});return s;}
let cleanR=null;const drawLeft=()=>H.render(),drawRight=()=>H.render();
const S={sp:{set:0,q:0,flip:false},t4:{model:false},spTab:0,c:{i:0,order:null,shuf:false,flip:false},dm:{sel:null,a:{},chk:false},pv:{i:0,picks:{},done:false},ls:{picks:{},done:false},r12:{i:0,picks:{},done:false},ue:{t:0,a:{},open:null,chk:false},gr:{t:0,open:{}}};

/* ---------- выбор ответа: по одному вопросу, можно листать без ответа ---------- */
function mcqFree(box,st,data,o){o=o||{};const n=data.length,wrap=el('div','chq');box.append(wrap);
  const score=()=>data.filter((x,k)=>st.picks[k]===x[3]).length;
  if(st.done){const e=el('div','end');e.append(el('div','score',score()+' / '+n));
    const bad=data.map((x,k)=>k).filter(k=>st.picks[k]!==data[k][3]);
    if(bad.length){const ul=el('ul','errs');bad.forEach(k=>ul.append(el('li',null,data[k][1].includes('______')?esc(data[k][1]).replace('______','<b>'+esc(data[k][3])+'</b>'):esc(data[k][1])+' <b>'+esc(data[k][3])+'</b>')));e.append(ul);}
    else e.append(el('div','fb','No mistakes.'));
    e.append(btn('Back to questions',()=>{st.done=false;st.i=0;H.render();},'main'));wrap.append(e);return;}
  const k=st.i,it=data[k],pick=st.picks[k];
  if(!st.opts)st.opts={};
  if(!st.opts[k]){let op=it[2];if(op.length>4)op=[it[3],...shuffle(op.filter(x=>x!==it[3])).slice(0,3)];st.opts[k]=o.keep?op:shuffle(op);}
  const meta=el('div','meta'),bar=el('div','qzbar');bar.innerHTML='<i style="width:'+(Object.keys(st.picks).length/n*100)+'%"></i>';
  meta.append(el('span',null,(k+1)+' / '+n),bar,el('span',null,'Score '+score()));wrap.append(meta);
  const dots=el('div','qdots');data.forEach((x,j)=>{const d=el('button','qd'+(j===k?' on':'')+(st.picks[j]!==undefined?(st.picks[j]===x[3]?' ok':' no'):''),String(j+1));d.type='button';d.onclick=()=>{st.i=j;H.render();};dots.append(d);});wrap.append(dots);
  wrap.append(el('div','tag',esc(it[0])),el('div','qtxt'+(o.small?' sm':''),esc(it[1])));
  const og=el('div','opts'+(o.one?' one':''));st.opts[k].forEach(x=>{const b=el('button',null,esc(x));b.type='button';b.disabled=pick!==undefined;
    if(pick!==undefined){if(x===it[3])b.classList.add('ok');else if(x===pick)b.classList.add('no');}
    b.onclick=()=>{st.picks[k]=x;H.render();};og.append(b);});wrap.append(og);
  let f='';if(pick!==undefined){f=pick===it[3]?'Correct.':'The answer is: <b>'+esc(it[3])+'</b>.';if(o.why)f+=' <span class="why">'+esc(o.why[k])+'</span>';}
  if(pick!==undefined&&it[4]){f='<ul class="whyo">'+it[2].map((x,j)=>'<li class="'+(x===it[3]?'okw':'')+'"><b>'+esc(x.split(')')[0])+')</b> '+esc(it[4][j])+'</li>').join('')+'</ul>';}
  const fb=el('div','fb',f);
  const pv=btn('← Previous',()=>{st.i--;H.render();},'sm');pv.disabled=k===0;
  const nx=k===n-1?btn('See result',()=>{st.done=true;H.render();},'main sm'):btn('Next →',()=>{st.i++;H.render();},'main sm');
  const foot=el('div','foot');foot.append(fb,pv,nx);wrap.append(foot);}

/* ---------- аудирование 3–9: аудио + вопросы, текст записи не показывается ---------- */
function listening(box){const st=S.ls;
  /* всё на одном экране: аудио сверху не пересоздаётся, ответы отмечаются без перерисовки страницы */
  const top=el('div','lstop');const a=el('audio');a.controls=true;a.preload='auto';a.src='audio/edu-three-teachers.mp3?v=1';a.className='aud';
  top.append(el('div','lst','<b>Three teachers.</b> 1–3: match the teachers to the subjects they would cut. 4–9: choose a or b. <span style="color:#7d89a3">Part 1 0:00–2:40 · Part 2 0:30–4:00</span>'),a);box.append(top);
  const grid=el('div','lsg');box.append(grid);const cards=[];
  const panel=el('div','lsq lsp'),res=el('div','lsres'),why=el('div','lsw');
  LS.forEach((it,k)=>{const c=el('div','lsq');c.append(el('div','lsqt','<b>'+(k+1)+'</b> '+esc(it[1])));
    const bs=it[2].map(o=>{const b=el('button',null,esc(o));b.type='button';b.onclick=e=>{if(st.done){showWhy(k);return;}st.picks[k]=o;bs.forEach(x=>x.classList.toggle('on',x===b));};
      if(st.picks[k]===o)b.classList.add('on');c.append(b);return b;});
    c.onclick=()=>{if(st.done)showWhy(k);};cards.push({c,bs,it,k});grid.append(c);});
  function showWhy(k){cards.forEach(x=>x.c.classList.toggle('sel',x.k===k));why.innerHTML='<b>'+(k+1)+'</b> '+esc(LS_WHY[k]);}
  function check(show){st.done=true;let ok=0;cards.forEach(({bs,it,k})=>{if(show)st.picks[k]=it[3];const p=st.picks[k];if(p===it[3])ok++;
    bs.forEach(b=>{const t=b.textContent;b.classList.remove('on');b.classList.toggle('ok',t===it[3]);b.classList.toggle('no',t===p&&p!==it[3]);});});
    res.textContent=ok+' / '+LS.length;why.textContent='Click a question to see why.';}
  function reset(){st.done=false;st.picks={};cards.forEach(({c,bs})=>{c.classList.remove('sel');bs.forEach(b=>b.className='');});res.textContent='';why.textContent='';}
  const bb=el('div','lsbtn');bb.append(btn('Check',()=>check(false),'main sm'),btn('Show answers',()=>check(true),'sm'),btn('Reset',reset,'sm'));
  panel.append(bb,res,why);grid.append(panel);
  if(st.done)check(false);
  cleanR=()=>{try{a.pause();}catch(e){}};}

/* ---------- естественный голос (card-audio, британский нейроголос) ---------- */
const SND='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
function sayWord(t){try{window.CardAudio&&CardAudio.say(t);}catch(e){}}
function sayNat(t,done,fail){if(!window.CardAudio){fail&&fail();return;}let ok=false;const a=new Audio(CardAudio.base+CardAudio.key(t)+'.mp3?v=1');
  a.onended=()=>{ok=true;done&&done();};a.onerror=()=>fail&&fail();a.play().catch(()=>fail&&fail());sayNat.cur=a;}
function stopNat(){try{sayNat.cur&&sayNat.cur.pause();}catch(e){}}

/* ---------- данные ---------- */
/* Speaking Task 3 (Lesson 2, Lead-in) */
const SETS=[{name:'Task 3 · School and studying',q:['What is your favourite subject at school? Why?','Do you usually remember things that you have studied?','What sort of techniques do you use to help you remember what you have studied?','How important do you think it is to go to university?','What is the best way to make teenagers motivated to learn?']}];
/* Speaking Task 4 (Lesson 2, Task 6) */
const T4_TASK='Imagine that you and your friend are doing a school project “Taking notes for learning”. You have found some photos to illustrate it but for technical reasons you cannot send them now. Leave a voice message to your friend explaining your choice of the photos and sharing some ideas about the project.';
const T4_PTS=['explain the choice of the illustrations for the project by briefly describing them and noting the difference;','mention the advantages (1–2) of the two ways of taking notes;','mention the disadvantages (1–2) of the two ways of taking notes;','express your opinion on the subject of the project – which way of taking notes presented in the pictures you preferred when you were a child and why.'];
const T4_MODEL=['Hi Sveta, it’s Masha. I’ve found two suitable pictures for our project “Taking notes for learning”. I’d like to tell you about the pictures and what I think about taking notes.',
 'I guess we should take the illustrations because in both of them there are some girls who are taking notes. In the first picture, I can see a girl sitting on the sofa and studying, she is holding a notebook and a pen. I think she might be revising for her exam. In the second picture there’s a girl with a tablet and a stylus. She is probably reading something and might also be taking some notes. The difference between the pictures is in the things the girls are using for taking notes: a notebook and an electronic device.',
 'There are some advantages of using both of the ways of taking notes. Scientists say that you remember things better when you write them down. If you use electronic devices, it’s much faster to take notes and you can copy some sections and paste them somewhere else.',
 'However, both of the ways also feature some disadvantages. Sometimes a pen won’t write. A battery in an electronic device may go dead. In this case you won’t be able to read or take any notes.',
 'When I was a child, I preferred to use notebooks for taking notes. I liked writing by hand and I also liked drawing pictures while I was listening to the teacher.',
 'That’s all for now. Call me back in the evening to discuss the project. Bye.'];
const T4_PROS=[['Online','you can do it wherever you want; you can go abroad and not miss classes','it’s more difficult to communicate with your classmates'],['In class','the atmosphere is more motivating; it’s easier for a teacher to explain things','you have to skip classes if you fall ill'],['On your own','you can take as much time as you want; no one can make you rush','there’s no one to ask; it could be boring'],['In a group','you can hear other people’s ideas; you can ask and get the answer straight away','it’s difficult for shy people to speak; you may not get time to say what you want']];

/* Cards: phrasal verbs (Lesson 2, Task 7) */
const PV=[['think over','to consider something carefully before deciding','I need a few days to think over your offer.'],
 ['dawn on','to become clear to someone for the first time','It slowly dawned on me that I had chosen the wrong course.'],
 ['catch on','to understand something, especially quickly','The rules are complicated, but you’ll soon catch on.'],
 ['give in','to stop trying to achieve something difficult; to accept defeat','The exam was hard, but she refused to give in.'],
 ['cross out','to draw a line through something written','Cross out any answers you are not sure about.'],
 ['get at','to try to express or suggest something','I’m not sure what the author is getting at in this paragraph.'],
 ['come round (to)','to be persuaded to change your mind','At first my parents were against a gap year, but they came round.'],
 ['set out','to explain or describe something in a clear and detailed way','The essay should set out both sides of the argument.'],
 ['get on with','to continue doing something, especially work','Stop chatting and get on with your revision.'],
 ['keep up with','to stay at the same level or speed as someone or something','He missed two weeks and couldn’t keep up with the class.'],
 ['deal with','to handle a problem or a situation; to cope with','Teachers have to deal with all kinds of students.'],
 ['drop out (of)','to leave school or a course before you have finished it','He dropped out of university after the first year.'],
 ['sail through','to do or deal with something very easily','She sailed through her finals and got top marks.']];

/* Do or make (Lesson 2, Task 4) */
const DM=[['an assignment','do'],['an exam','do'],['homework','do'],['the housework','do'],['the shopping','do'],['someone a favour','do'],['sport','do'],['well','do'],['a course','do'],
 ['an appointment','make'],['breakfast','make'],['a decision','make'],['an excuse','make'],['friends','make'],['a mistake','make'],['a noise','make'],['a promise','make'],['a suggestion','make']];

/* Phrasal verbs in context (Lesson 2, Task 7 – sentences from the lesson) */
const PVQ=[['I’ve been ______ what you said.','thinking over'],['Suddenly it ______ him that they couldn’t possibly have met before.','dawned on'],['Mary is very quick to ______ to things.','catch on'],['The rebels were forced to ______.','give in'],['After much careful thought, John ______ the old address.','crossed out'],['The truth is sometimes difficult to ______.','get at'],
 ['My dad will never ______ to our way of thinking.','come round'],['He ______ the reasons for his resignation in a long letter.','set out'],['Be quiet and ______ your work!','get on with'],['I can’t ______ all the change.','keep up with'],['She is used to ______ all kinds of people in her job.','dealing with'],['She started an engineering degree but ______ after only a year.','dropped out'],['Phoebe ______ her finals and got A’s in everything.','sailed through']];
const PVF=['thinking over','dawned on','catch on','give in','crossed out','get at','come round','set out','get on with','keep up with','dealing with','dropped out','sailed through','took up','made up','turned down'];
const PVQS=PVQ.map(([q,a])=>['Phrasal verb',q,[a,...shuffle(PVF.filter(x=>x!==a)).slice(0,3)],a]);

/* Listening 3–9 training (Lesson 2, Task 2): Three teachers */
const LS=[
 ['Question 1','Martine would cut …',['a) PSHE and modern foreign languages','b) RE and ICT','c) RE and PE'],'c) RE and PE'],
 ['Question 2','Greg would cut …',['a) PSHE and modern foreign languages','b) RE and ICT','c) RE and PE'],'b) RE and ICT'],
 ['Question 3','Wendy would cut …',['a) PSHE and modern foreign languages','b) RE and ICT','c) RE and PE'],'a) PSHE and modern foreign languages'],
 ['Question 4','What is Martine’s opinion about sport?',['a) It shouldn’t be taught in a state school.','b) Let students who like it do it outside normal class time.'],'b) Let students who like it do it outside normal class time.'],
 ['Question 5','Greg thinks sport …',['a) should be taught for more than one hour a week.','b) can teach about competition and stop students misbehaving.'],'b) can teach about competition and stop students misbehaving.'],
 ['Question 6','Greg suggests …',['a) computer studies should be part of all lessons.','b) all students need a computer at home.'],'a) computer studies should be part of all lessons.'],
 ['Question 7','Wendy strongly disagrees with Greg about ICT because …',['a) students don’t learn useful computer skills at home.','b) buying a home computer is expensive.'],'a) students don’t learn useful computer skills at home.'],
 ['Question 8','Martine says languages are important …',['a) to her students who are good at French.','b) for more than just communication.'],'b) for more than just communication.'],
 ['Question 9','All three teachers agree to cut …',['a) PSHE.','b) Science.'],'a) PSHE.']];
const LS_WHY=['PE – physical education, RE – religious education.','RE and ICT (information and communication technology).','PSHE (personal, social and health education) and modern foreign languages.',
 '“Best done in after-school clubs.” Trap a): she says RE, not sport, has nothing to do with state education.',
 '“Hours of PE are the only exercise they get… it teaches them about winning and losing.” Trap a): “one hour” is mentioned, but he doesn’t ask for more.',
 '“There’s no need to teach it as a separate subject, it should be a part of every lesson.”',
 '“There’s more to computers than playing games or chatting – that’s what students use their computers for.” Trap b): price is not her argument.',
 '“It’s an opportunity to find out about other cultures and societies.” Trap a): she says her students are NOT that good at French.',
 '“It could be integrated into other subjects… a bit of a waste of time.”'];

/* Reading 12–18 (Открытый банк ФИПИ): Will online education replace classroom education anytime soon? */
const R12_TITLE='Will online education replace classroom education anytime soon?';
const R12_TXT=`Over the last decade, the number of people taking online courses and using technology as a tool to enhance their education has increased dramatically. You can now master a foreign language or complete a whole degree without leaving the comfort of your sofa. You can decide not only when you want to learn but also how you want to learn. Meanwhile, the range of technology used inside the classroom has also boomed, with the rise of smartboards, digital textbooks and, most notably, the tools offered on the Internet. But what does this mean for teachers? While many teachers are excited by technology, others are concerned by its rapid development. They wonder whether they themselves could be replaced.
Technology gives us abundant opportunities. In a geography lesson, we can now transport students to explore another country. In an English class, we can take them back in time to experience Shakespeare’s plays as they were performed during his lifetime. Students are able to watch videos at home that explain how to use algebra, or allow them to see first-hand the life cycle of a plant. Technology doesn’t discriminate based on a student’s ability or skill. It provides an opportunity to engage students using a medium that they recognise. Technology is growing not just within our classrooms but also in our everyday lives, so it is natural that we should increasingly incorporate it into classrooms.
Crucially, the use of technology in the classroom doesn’t lessen the need for great teachers. In fact, it is great teachers who make using technology so significant in students’ education. Whilst technology is able to take on a whole host of tasks, it does have its shortcomings. The most prominent drawback is its inability to interact with humans. Technology can facilitate the learning process. However, it cannot replace the role of the teacher. Computers do not teach children to question, to discriminate among sources of information, to weigh perspectives. They do not explain how to think about consequences, to bring contextual meaning to a situation, to be creative, or to make careful judgments. Without a great teacher, technology merely becomes an automated tool and stops inspiring and engaging students. Ultimately, it isn’t about teachers being replaced by technology but how teachers can adapt to incorporate technology in their lessons.
As much innovation as the iPad may bring to the classroom, it is not going to replace a teacher anytime soon. In fact, the influx of technology like iPads means there is a greater need for teachers. We need teachers who are part early adopter, part integrator, and part mad scientist. The modern teacher must be willing to take chances and able to figure out not just how technology works, but how it works for each student, and where its use is most appropriate.
The question of whether technology will replace teachers is an age-old debate and one that is likely to continue as technology evolves further. In the same way that the calculator didn’t displace maths teachers, technology will continue aiding teachers to educate well-rounded and engaged students. As our Hugo Wernhoff notes, “We’re not only in it to offer flexibility in time and place for students, or lower costs for providers. Our main ambition is instead to deliver better learning.” Technology can only assist in delivering better learning when it is used by a great teacher. Students will always benefit from the guidance and instruction of a teacher at the front of a classroom.`;
const R12=[
 ['Question 12','According to the text, online education is becoming more popular because of its …',['1) teachers.','2) ease.','3) flexibility.','4) cost.'],'3) flexibility.',['Not stated: teachers are discussed later, not as a reason.','Trap: “the comfort of your sofa” is about place, the key idea is choice.','Correct: “You can decide not only when you want to learn but also how.”','Trap: costs appear only at the end and are about providers.']],
 ['Question 13','This in Paragraph 1 (“But what does this mean for teachers?”) refers to …',['1) the continuing growth in education technology.','2) the opportunity to take university courses online.','3) more people turning to online education.','4) the freedom technology gives to people.'],'1) the continuing growth in education technology.',['Correct: online learning + smartboards, digital textbooks – technology is growing everywhere.','Too narrow: only one example from the paragraph.','Too narrow: the paragraph also speaks about classrooms.','Not the point of the paragraph.']],
 ['Question 14','Which statement about the use of technology is FALSE, according to the text?',['1) Technology gives everyone equal chances.','2) It provides the environment students are used to.','3) We cannot avoid technology, so we should use it.','4) Students should use technology at home.'],'4) Students should use technology at home.',['True: “doesn’t discriminate based on a student’s ability or skill”.','True: “a medium that they recognise”.','True: “growing in our everyday lives, so it is natural…”.','FALSE – the answer: students “are able to” watch videos at home; nobody says they “should”.']],
 ['Question 15','Discriminate in Paragraph 3 (“Computers do not teach children to question, to discriminate among sources of information …”) most probably means …',['1) favour.','2) distinguish.','3) judge.','4) characterise.'],'2) distinguish.',['Trap: in Paragraph 2 “discriminate based on ability” means treat unfairly – a different meaning.','Correct: discriminate among sources = tell the difference between them.','Close, but “judge” needs no “among”.','Not related.']],
 ['Question 16','Which advantage of human teachers over technology is NOT mentioned in Paragraph 3?',['1) Development of critical thinking skills.','2) Awareness of students’ personal characteristics.','3) Student involvement and motivation.','4) Communication and interaction.'],'2) Awareness of students’ personal characteristics.',['Mentioned: “to question… to weigh perspectives… to make careful judgments”.','NOT mentioned in Paragraph 3 – the answer. “How it works for each student” is in Paragraph 4.','Mentioned: without a teacher technology “stops inspiring and engaging students”.','Mentioned: “its inability to interact with humans”.']],
 ['Question 17','Before using technology, a teacher has to find out if it is …',['1) modern.','2) safe.','3) suitable.','4) enjoyable.'],'3) suitable.',['Trap: “early adopter” sounds like “modern”, but it describes the teacher.','Not stated.','Correct: “where its use is most appropriate”.','Not stated.']],
 ['Question 18','The author draws the conclusion that technology …',['1) will substitute teachers in the distant future.','2) can help teachers but cannot replace them.','3) will never be as effective as human teachers.','4) cannot be trusted as human teachers are.'],'2) can help teachers but cannot replace them.',['Opposite: “it is not going to replace a teacher”.','Correct: “will continue aiding teachers… only when it is used by a great teacher”.','Trap: too strong – the author doesn’t compare effectiveness.','Trust is not mentioned.']]];

/* Use of English 30–36 (Открытый банк ФИПИ) */
const UE=[
 {name:'At the lecture',txt:'The opening lecture in Grand Hall was on the subject of British Literature. It was delivered by Professor Carlson. During the summer holidays, Emily and Peter had read all the authors on the assigned list. The list [30] of 20 thick books. So, by the time they took their places in the lecture hall that Tuesday morning, they both felt [31] that they were well prepared. Within moments of Professor Carlson starting his lecture, they both realized that they had done little more than read the texts. They had not [32] the different influences on the authors that birth, upbringing, education, religion and mere circumstance had brought to their work, not given any thought to the fact that the gift of storytelling was not bestowed on any particular class, colour or creed.\nProfessor Carlson continued his speech. Peter looked [33] from his notes and saw the back of his head. He felt sick. He stopped listening to Professor Carlson’s views on Byron and continued to stare for some time before the student turned and began [34] to his neighbour. Peter’s worst fears were [35].\nIt was Conrad. He was at the same university. [36], he was taking the same course. Peter waited until Conrad had left the lecture theatre before he collected up his books and rose from his place. Emily followed him quickly.',
  opts:{30:['consisted','included','contained','involved'],31:['competent','confident','excellent','efficient'],32:['reasoned','reflected','considered','expected'],33:['down','up','beside','across'],34:['talking','telling','looking','saying'],35:['convinced','ensured','approved','confirmed'],36:['However','Although','Otherwise','Moreover']},
  key:{30:'consisted',31:'confident',32:'considered',33:'up',34:'talking',35:'confirmed',36:'Moreover'},
  why:{30:'consist OF; include / contain – without “of”.',31:'feel confident that…; competent = skilled at a job.',32:'consider influences = think about them; reflect ON.',33:'look up from your notes.',34:'talk TO someone; tell + object; say – no “to his neighbour”.',35:'fears were confirmed = turned out true.',36:'Moreover adds a fact; However would need a contrast.'}},
 {name:'At the library',txt:'It was early morning. Jason stood in the library at Norwood House, [30] up at the painting above the fireplace. What an extraordinary portrait it was, of a handsome man in the prime of his life. The great Horace Winton. His grandfather. His mother, Horace’s eldest daughter, Laura, had always [31] him that he would grow up to look like her father. She had been proved right.\nThis painting had been finished just a short time before Horace’s fortieth birthday, and in a few days’ time, he himself would be forty years old. And he was the spitting [32] of his grandfather; six foot four, broad of chest, with red-gold hair and blue eyes. He knew that if Horace Winton could step out of the portrait, come to stand next to him, they would look like twins, so close was their [33].\nJason Casey finally turned away and walked out onto the terrace, headed through the hanging gardens, making for the ruined stronghold. His mother had constantly taken him there as a child, explaining that it had been her father’s favourite spot at Norwood, and [34] hers. She had [35] him up on Winton lore, and most of it had been about his grandfather. Jason knew so much about his grandfather and [36] never meeting him in person.',
  opts:{30:['seeing','watching','blinking','staring'],31:['said','told','talked','spoke'],32:['replica','image','twin','double'],33:['resemblance','reproduction','recollection','responsibility'],34:['however','moreover','although','therefore'],35:['raised','grown','brought','risen'],36:['regretted','revealed','remained','registered']},
  key:{30:'staring',31:'told',32:'image',33:'resemblance',34:'therefore',35:'brought',36:'regretted'},
  why:{30:'stare up at = look for a long time; watch – no “up at”.',31:'tell + person + that; say – no person after it.',32:'the spitting image of – fixed phrase.',33:'close resemblance = being alike.',34:'therefore = so (her father’s spot, so hers too).',35:'bring someone up on stories = raise; raise – no “up”.',36:'regret + -ing: he was sorry he never met him.'}}];

/* Grammar 19–24 · traps (Открытый банк ФИПИ) */
const GR=[
 {name:'Further education + College life',rows:[
  ['In Britain many young people decide to leave school at the age of 16 and go to a Further Education College. Here most of the courses [1] to some kind of practical vocational training in engineering, typing, cooking, etc.',['LINK'],['are linked'],'Passive: courses are linked to…'],
  ['Some 16-year-olds leave school but cannot find work. At the same time they [2] to go to college.',['NOT WANT'],['do not want'],'Present Simple: a general fact. Both “do not want” and “don’t want” are accepted.'],
  ['For them the British government [3] the Young Opportunities Scheme. This scheme places young people with a firm or a factory for 6 months and pays them a small wage.',['INTRODUCE'],['has introduced'],'Present Perfect: the result is now – the scheme works today.'],
  ['We are a family of five. My [4] sister, Heather, is in her second year in college.',['OLD'],['elder'],'Family members: elder (sister), not older.'],
  ['When the professor assigned reading from a hard-to-find book, 150 hands shot in the air to inform him they [5] it.',['NOT HAVE'],['did not have'],'Past Simple in reported speech after “shot / inform” – no Present here.'],
  ['The cashier saw Heather and began ringing the bell for assistance. “How many [6] there behind you?” she demanded.',['BE'],['are'],'Direct speech → Present: How many are there…']]},
 {name:'The role of art',rows:[
  ['Massachusetts Institute of Technology (MIT) is one of the most famous in the world. This year, MIT jumped from the fourth to the [1] highest globally ranked university in art and design.',['TWO'],['second'],'Ordinal number: the second highest.'],
  ['It [2] the top university in the world for architecture some years ago.',['NAME'],['was named'],'“some years ago” → Past Simple Passive.'],
  ['The hard work of the faculty, staff, and students [3] to that recognition.',['LEAD'],['led'],'Irregular: lead – led – led. The subject “work” is singular.'],
  ['Though it is called the Institute of Technology, the arts are essential to MIT’s mission to build a [4] society and meet the challenges of the 21st century.',['GOOD'],['better'],'build a better society – comparative, no “the”.']]},
 {name:'Where’s our teacher?',rows:[
  ['One school had a very strict head teacher. Once he [1] around the school when he heard a terrible noise coming from one of the classrooms.',['WALK'],['was walking'],'Past Continuous: a longer action interrupted by “heard”.'],
  ['Opening the door, the teacher [2] a noisy young man in the centre of the classroom.',['SEE'],['saw'],'Past Simple: a single completed action.'],
  ['He was [3] than the others and he was making the most noise. The head teacher ordered him to leave the classroom immediately.',['TALL'],['taller'],'“than” → comparative.'],
  ['“Any more questions?” he asked the students. “Yes, sir,” the [4] replied. “Can we have our teacher back?”',['CHILD'],['children'],'Irregular plural: child – children.']]}];

/* ---------- прогноз по фото ---------- */
function predict(box){box.append(el('div','inst','<b>Look at the photos and predict.</b>'));
  const g=el('div','pic2');['notes-photo1.jpg','notes-photo2.jpg'].forEach((f,i)=>{const fg=el('figure');const im=new Image();im.src='img/'+f+'?v=1';im.alt='Photo '+(i+1);fg.append(im,el('figcaption',null,'Photo '+(i+1)));g.append(fg);});
  box.append(g);
  box.append(el('ol','pq','<li>What are the girls doing? What might they be preparing for?</li><li>Which way of studying helps you remember more – paper or a screen? Why?</li><li>Today’s text is called “Will online education replace classroom education anytime soon?” What do you think the author’s answer is?</li>'));}

/* ---------- устная часть: Task 3 (вопрос только звучит) и Task 4 ---------- */
function speak(box){box.append(seg([[0,'Task 3 · Interview'],[1,'Task 4 · Taking notes']],S.spTab,v=>{S.spTab=v;H.render();}));
  const b=el('div','sprow');box.append(b);if(S.spTab===0)task3(b);else task4(b);}
function task3(box){const st=S.sp,set=SETS[st.set];let left=40,t=null;
  const wrap=el('div','kim2 ivw'),top=el('div','ivtop');
  const qc=el('div','chips');set.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;H.render();};qc.append(b);});
  top.append(el('b',null,set.name),qc);wrap.append(top);
  const card=el('div','ivcard');wrap.append(card);
  const nav=el('div','qznav'),bk=btn('← Back',()=>{st.q--;st.flip=false;H.render();},'sm'),fw=btn('Next →',()=>{st.q++;st.flip=false;H.render();},'sm');bk.disabled=st.q===0;fw.disabled=st.q===set.q.length-1;
  nav.append(bk,btn('Flip the card',()=>{st.flip=!st.flip;face();},'main sm'),fw);wrap.append(nav);box.append(wrap);
  const c=el('div','ctl2'),ring=el('div','ring ans','<b>40</b><span>seconds</span>'),label=el('div','phase','Press Play'),bx=el('div','ctlbtns');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};
  const runT=()=>{stopT();left=40;paint();label.textContent='Answer';beep(880,200);const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Time is up';beep(520,500);}},200);};
  function play(){stopT();stopNat();left=40;paint();label.textContent='Question is playing';sayNat(set.q[st.q],runT,()=>{label.textContent='Recording is not ready: press Timer';});}
  function face(){card.className='ivcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip)card.append(el('div','ey','Question '+(st.q+1)),el('div','qq',esc(set.q[st.q])));
    else{card.append(el('div','ey','Question '+(st.q+1)+' of '+set.q.length),el('div','big','Listen and answer'));const pb=el('div','navrow');pb.append(btn('Play',play,'main'),btn('Replay',play),btn('Stop',()=>{stopNat();stopT();label.textContent='Stopped';}));card.append(pb);}}
  face();bx.append(btn('Timer',runT,'sm'),btn('Reset',()=>{stopT();stopNat();left=40;paint();label.textContent='Press Play';},'sm'));
  c.append(ring,label,bx);box.append(c);
  cleanR=()=>{stopT();stopNat();};}
function task4(box){const st=S.t4;let left=0,t=null,total=150;
  const w=el('div','t4w2');
  const l=el('div','t4l');
  if(st.model){l.append(el('div','tag','Model answer'),el('div','t4m',T4_MODEL.map(p=>'<p>'+esc(p)+'</p>').join('')));}
  else{l.append(el('p','task',esc(T4_TASK)),el('div','tag','In 2.5 minutes be ready to:'),el('ul',null,T4_PTS.map(p=>'<li>'+esc(p)+'</li>').join('')),el('div','t4n','You will speak for not more than 3 minutes (12–15 sentences). You have to talk continuously.'));
    const tb=el('table','ptab');tb.innerHTML='<tr><th>Way of studying</th><th>+ Advantages</th><th>− Disadvantages</th></tr>';const pr=el('details','t4pros');pr.innerHTML='<summary>Ideas: pros and cons of different ways of studying</summary>';T4_PROS.forEach(r=>{const tr=el('tr');r.forEach(x=>tr.append(el('td',null,esc(x))));tb.append(tr);});pr.append(tb);l.append(pr);}
  const p=el('div','pics2');['notes-photo1.jpg','notes-photo2.jpg'].forEach((f,i)=>{const fg=el('figure');const im=new Image();im.src='img/'+f+'?v=1';fg.append(im,el('figcaption',null,'Photo '+(i+1)));p.append(fg);});
  const c=el('div','ctl2'),ring=el('div','ring ans','<b>2:30</b><span>preparation</span>'),label=el('div','phase','Preparation 2.5 min · Answer 3 min'),bx=el('div','ctlbtns');
  const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const paint=(ph)=>{ring.querySelector('b').textContent=fmt(left);ring.querySelector('span').textContent=ph;ring.style.background='conic-gradient(var(--acc) '+(left/total*360)+'deg,#f3ddd6 0)';};
  const stopT=()=>{clearInterval(t);t=null;};
  const run=(sec,ph,then)=>{stopT();total=sec;left=sec;paint(ph);label.textContent=ph[0].toUpperCase()+ph.slice(1);beep(880,200);const end=Date.now()+sec*1000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint(ph);if(left===0){stopT();beep(520,500);then&&then();}},250);};
  const speakT=()=>run(180,'answer',()=>{label.textContent='Time is up';});
  bx.append(btn('Prepare',()=>run(150,'preparation',speakT),'main sm'),btn('Speak',speakT,'sm'),btn(st.model?'Task':'Model',()=>{st.model=!st.model;H.render();},'sm'),btn('Reset',()=>{stopT();left=150;total=150;paint('preparation');label.textContent='Preparation 2.5 min · Answer 3 min';},'sm'));
  c.append(ring,label,bx);
  w.append(l,p,c);box.append(w);
  cleanR=()=>stopT();}

/* ---------- Do or make: сортировка ---------- */
function doMake(box){const st=S.dm;
  box.append(el('div','inst','<b>Do or make?</b> Click an expression, then click the right box.'));
  const pool=el('div','dmpool');const left=DM.map((x,k)=>k).filter(k=>!st.a[k]);
  left.forEach(k=>{const b=el('button','dmc'+(st.sel===k?' on':''),esc(DM[k][0]));b.type='button';b.onclick=()=>{st.sel=st.sel===k?null:k;H.render();};pool.append(b);});
  if(!left.length)pool.append(el('span','dmdone','All expressions are sorted.'));
  box.append(pool);
  const bins=el('div','dmbins');['do','make'].forEach(v=>{const bin=el('div','dmbin');const h=el('button','dmh',v.toUpperCase());h.type='button';h.onclick=()=>{if(st.sel===null||st.chk)return;st.a[st.sel]=v;st.sel=null;H.render();};bin.append(h);
    const list=el('div','dml');DM.forEach((x,k)=>{if(st.a[k]!==v)return;const it=el('button','dmc'+(st.chk?(x[1]===v?' ok':' no'):''),(v==='do'?'do ':'make ')+esc(x[0]));it.type='button';it.onclick=()=>{if(st.chk)return;delete st.a[k];H.render();};list.append(it);});bin.append(list);bins.append(bin);});
  box.append(bins);
  const ok=DM.filter((x,k)=>st.a[k]===x[1]).length;
  const bar=el('div','fbar');bar.append(btn('Check',()=>{st.chk=true;H.render();},'main sm'),btn('Show answers',()=>{DM.forEach((x,k)=>st.a[k]=x[1]);st.chk=true;st.sel=null;H.render();},'sm'),btn('Reset',()=>{S.dm={sel:null,a:{},chk:false};H.render();},'sm'),el('b',null,st.chk?ok+' / '+DM.length:Object.keys(st.a).length+' / '+DM.length+' sorted'));box.append(bar);}

/* ---------- чтение 12–18 ---------- */
function read12(box){box.append(el('div','inst','<b>'+esc(R12_TITLE)+'</b> Read the text and choose the correct option. Then check why the other options are wrong.'));
  const rd=el('div','rd12');const tx=el('div','rtext r12t');R12_TXT.split('\n').forEach((p,i)=>tx.append(el('p',null,'<b class="pn">'+(i+1)+'</b> '+esc(p))));
  const q=el('div');rd.append(tx,q);box.append(rd);mcqFree(q,S.r12,R12,{keep:true,one:true,small:true});}

/* ---------- 30–36: сплошной текст, вариант по нажатию на пропуск ---------- */
function useEng(box){const st=S.ue,T=UE[st.t];
  const top=el('div','fbar');top.append(seg(UE.map((x,k)=>[k,x.name]),st.t,v=>{S.ue={t:v,a:{},open:null,chk:false};H.render();}));box.append(top);
  box.append(el('div','inst','Read the text. Click a gap and choose the option that fits.'));
  const tx=el('div','rtext uet');
  T.txt.split('\n').forEach(par=>{const p=el('p');par.split(/\[(\d+)\]/).forEach((x,i)=>{if(i%2===0){p.append(document.createTextNode(x));return;}
    const n=x,cur=st.a[n];const g=el('span','gap'+(st.chk&&cur?(cur===T.key[n]?' ok':' no'):'')+(st.open===n?' cur':''),'<small>'+n+'</small> '+(cur?esc(cur):'______'));
    g.onclick=e=>{e.stopPropagation();st.open=st.open===n?null:n;H.render();};
    if(st.open===n&&!st.chk){const pop=el('span','gpop');T.opts[n].forEach((o,j)=>{const b=el('button',null,(j+1)+') '+esc(o));b.type='button';b.onclick=e=>{e.stopPropagation();st.a[n]=o;st.open=null;H.render();};pop.append(b);});g.append(pop);}
    p.append(g);});tx.append(p);});
  const wrap=el('div','uegrid'+(st.chk?' chk':''));wrap.append(tx);box.append(wrap);
  const ok=Object.keys(T.key).filter(n=>st.a[n]===T.key[n]).length;
  const bar=el('div','fbar');bar.append(btn('Check',()=>{st.chk=true;st.open=null;H.render();},'main sm'),btn('Show answers',()=>{st.a={...T.key};st.chk=true;st.open=null;H.render();},'sm'),btn('Reset',()=>{S.ue={t:st.t,a:{},open:null,chk:false};H.render();},'sm'),el('b',null,st.chk?ok+' / 7':''));box.append(bar);
  if(st.chk)wrap.append(el('ul','whyl uew',Object.keys(T.key).map(n=>'<li class="'+(st.a[n]===T.key[n]?'okw':'')+'"><b>'+n+' '+esc(T.key[n])+'</b> – '+esc(T.why[n])+'</li>').join('')));}

/* ---------- 19–24: как на сайте ФИПИ, слово справа, ответ по нажатию на пропуск ---------- */
function grammar(box){const st=S.gr,T=GR[st.t];
  const top=el('div','fbar');top.append(seg(GR.map((x,k)=>[k,x.name]),st.t,v=>{st.t=v;st.open={};H.render();}),
    btn('Show all',()=>{T.rows.forEach((r,k)=>st.open[k]=true);H.render();},'sm'),btn('Hide',()=>{st.open={};H.render();},'sm'));box.append(top);
  box.append(el('div','inst','Read the text. Change the word in capitals so that it fits the gap grammatically.'));
  const tb=el('table','wft');T.rows.forEach((r,k)=>{const tr=el('tr');const td=el('td');
    r[0].split(/\[(\d+)\]/).forEach((p,i)=>{if(i%2===0){td.append(document.createTextNode(p));return;}
      const g=el('span','gap wfg'+(st.open[k]?' ok':''),st.open[k]?esc(r[2][0]):p);g.onclick=()=>{st.open[k]=!st.open[k];H.render();};td.append(g);});
    if(st.open[k])td.append(el('div','trap','Trap: '+esc(r[3])));
    tr.append(td,el('td','wfw',r[1].map(esc).join('<br>')));tb.append(tr);});
  box.append(tb);}

const H=Hub({title:'20 November · Education · Lesson 2',sub:'Устная часть, фразовые глаголы, аудирование, трудные 12–18 и 30–36, ловушки 19–24.',
 clean:()=>{if(cleanR){cleanR();cleanR=null;}},
 groups:[
 {name:'Разминка',color:'#c8553d',items:[
  {id:'predict',t:'Predict',sub:'Фото и заголовок текста',run:predict},
  {id:'speak',t:'Speaking',sub:'Task 3 · Task 4',run:speak}]},
 {name:'Лексика',color:'#2c7f78',items:[
  {id:'cards',t:'Cards',sub:PV.length+' phrasal verbs',run:b=>cards(b,S.c,PV,()=>'Phrasal verb')},
  {id:'pv',t:'Phrasal verbs',sub:PVQS.length+' вопросов',run:b=>mcqFree(b,S.pv,PVQS)},
  {id:'dm',t:'Do or make',sub:DM.length+' выражений',run:doMake}]},
 {name:'ЕГЭ · трудные задания',color:'#2855d9',items:[
  {id:'ls',t:'Listening 3–9',sub:'Three teachers',run:listening},
  {id:'r12',t:'Reading 12–18',sub:'Online education',run:read12},
  {id:'ue',t:'Use of English 30–36',sub:'2 текста · 14 пропусков',run:useEng},
  {id:'gr',t:'Grammar traps 19–24',sub:'3 текста · 14 пропусков',run:grammar}]},
 {name:'Ещё к теме',color:'#4a4f8f',items:[
  {t:'18 ноября · урок',sub:'Education · Lesson 1',href:'lesson-1118.html?v=9'},
  {t:'Task 4 · фото',sub:'Тренажёр задания 4',href:'../ege-trainers/task4-photos.html'}]}
 ]});
document.addEventListener('click',()=>{if(S.ue.open!==null&&H){S.ue.open=null;H.render();}});
H.render();
