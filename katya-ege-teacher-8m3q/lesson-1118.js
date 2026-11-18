/* Урок 18 ноября · Катя ЕГЭ: тест по «Семье» → блок Education, Lesson 1 Крыловой (задания ФИПИ). Каркас – как в family-lesson.js. Ничего не сохраняется: страница каждый раз открывается с начала. */
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
const S={sp:{set:0,q:0,flip:false},c:{i:0,order:null,shuf:false,flip:false},ft:{i:0,picks:{},done:false},c1:{i:0,picks:{},done:false},c2:{i:0,picks:{},done:false},lk:{i:0,picks:{},done:false},ls:{picks:{},done:false},r11:{cur:'A',a:{},chk:false},r12:{i:0,picks:{},done:false},wf:{t:0,open:{}}};

/* ---------- данные ---------- */
/* Speaking: задание 3 ФИПИ со страницы тренажёров (ege-trainers/task3-interview-voice-1), озвучка – natural-voice.js */
const SETS=[{"name": "Task 3 · Schools", "q": ["What do you think schools will look like in some twenty years?", "What kind of teachers will work at these schools?", "What subjects will be taught at these schools?", "How different will these schools be from today's school?", "Will it be boring or fun to study at the school of the future? Why?"]}, {"name": "Task 3 · Studying online", "q": ["Do you have any experience in studying online?", "What do you think are the main advantages of studying online?", "Do you see any disadvantages of online education?", "What subjects can be studied online with good results?", "Would you prefer to study at university online? Or do you think traditional offline education is still better? Why?"]}, {"name": "Task 3 · School subject", "q": ["What`s your favourite school subject? When did you get interested in it?", "Is your future profession connected with this subject? In what way?", "When did you start learning English? What tasks did you like doing at your English classes?", "Did you do anything outside English classes to master the language?", "In what way can your knowledge of English help you in the future?"]}, {"name": "Task 3 · Foreign languages", "q": ["Do you think it`s important to know foreign languages? Why yes or no?", "What foreign languages did you study at school? For how many years?", "Did you enjoy studying a foreign language at school? What was the most difficult aspect for you?", "What do you think is the best way to master a foreign language? How do you study English outside school?", "What foreign languages would you like to learn in the future?"]}];

/* Family test: вопросы из урока Family на этом сайте (family-lesson.js) */
const WHO=['a role model','feel down','spouses','grow up','the breadwinner','take after','an only child','close resemblance','the spitting image'];
const CH=[
 ['Phrasal verbs','My cousin and I used to be close, but after moving away we slowly ______.',['drifted apart','broke up','took after','grew up'],'drifted apart'],
 ['Phrasal verbs','Mia and I ______ immediately; we talked for hours at our first meeting.',['fell out','hit it off','let down','brought up'],'hit it off'],
 ['Phrasal verbs','You look so much like your grandfather. You really ______ him.',['make up with','take after','fit in','go out with'],'take after'],
 ['Phrasal verbs','After the argument, they apologised and ______.',['grew up','made up','drifted apart','fell for'],'made up'],
 ['In context','My older sister always ______ me when I need advice.',['supports','breaks up','falls out','lets down'],'supports'],
 ['In context',"He felt isolated because he couldn't ______ with his new classmates.",['take after','fit in','make up','grow up'],'fit in'],
 ['In context','Sophie was ______ by her grandparents in a small town.',['let down','brought up','fallen out','drifted apart'],'brought up'],
 ['In context','I can always ______ my best friend when things go wrong.',['get over','rely on','go out','take after'],'rely on'],
 ['Who am I? What is it?','This person earns money for the family.',WHO,'the breadwinner'],
 ['Who am I? What is it?','To look exactly like someone else.',WHO,'the spitting image'],
 ['Who am I? What is it?','A wife and a husband.',WHO,'spouses'],
 ['Who am I? What is it?','A child with no brothers or sisters.',WHO,'an only child'],
 ['Who am I? What is it?','To feel sad and depressed.',WHO,'feel down'],
 ['Who am I? What is it?','A perfect example for others.',WHO,'a role model'],
 ['Who am I? What is it?','To be very similar in appearance.',WHO,'close resemblance'],
 ['Who am I? What is it?','To resemble an older family member.',WHO,'take after']];

/* ЕГЭ 30–36: сплошной текст, [n] – пропуск */

/* Education: Vocabulary Education and learning (курс Крыловой, папка 07) */
const EDU=[
 ['think over','to consider something carefully before deciding'],
 ['sail through','to pass an exam or test very easily'],
 ['get on with','to continue doing something, especially work'],
 ['drop out (of)','to leave school or a course before finishing it'],
 ['deal with','to take action to solve a problem'],
 ['cross out','to draw a line through a word or sentence'],
 ['come round','to change your opinion and agree'],
 ['set out','to explain ideas clearly; to start with a clear aim'],
 ['keep up with','to stay at the same level or speed as others'],
 ['give in','to stop resisting and accept defeat'],
 ['get at','to mean or suggest something indirectly'],
 ['dawn on','to become clear to somebody for the first time'],
 ['catch on','to understand; to become popular'],
 ['sit / take / do an exam','to be examined (the process)'],
 ['pass / fail an exam','to succeed / not succeed in an exam'],
 ['pay attention to','to watch, listen to or think about carefully'],
 ['draw attention to','to make people notice something'],
 ['make / accept a suggestion','to offer / agree to an idea'],
 ['make up your mind','to decide'],
 ['be in two minds about','to be unable to decide'],
 ['cross your mind','to come into your thoughts'],
 ['bear in mind','to remember a fact when deciding'],
 ['see the point (of)','to understand the reason for something'],
 ['make sense of','to understand something difficult'],
 ['learn a lesson / teach sb a lesson','to understand a mistake / to punish so that sb learns']];

/* Topic vocabulary in contrast (Lesson 1, Task 9) */
const CF1=[
 ['take · pass · study · teach · learn · read','Next term we will ______ plants and how they grow.',['study','learn','teach','read'],'study'],
 ['take · pass · study · teach · learn · read','She ______ English to foreign students.',['teaches','learns','studies','passes'],'teaches'],
 ['take · pass · study · teach · learn · read','They ______ Russian at school.',['learn','teach','pass','take'],'learn'],
 ['take · pass · study · teach · learn · read','Bob has decided to ______ the geography exam.',['take','pass','study','learn'],'take'],
 ['take · pass · study · teach · learn · read',"Your handwriting is so untidy I can't ______ it.",['read','learn','study','take'],'read'],
 ['take · pass · study · teach · learn · read','The exam is so hard that only five percent of applicants ______.',['pass','take','learn','study'],'pass'],
 ['boast · admire · fail · count · measure','"Will the table fit in here?" "I don\'t know – let\'s ______ it."',['measure','count','admire','fail'],'measure'],
 ['boast · admire · fail · count · measure','We stood for a few moments, ______ the view.',['admiring','boasting','measuring','counting'],'admiring'],
 ['boast · admire · fail · count · measure','He didn\'t talk about his exam results in case people thought he was ______.',['boasting','admiring','failing','counting'],'boasting'],
 ['boast · admire · fail · count · measure','She moved to London in the hope of finding work as a model, but ______.',['failed','boasted','counted','measured'],'failed'],
 ['boast · admire · fail · count · measure',"Let's ______ out loud from one to ten.",['count','measure','admire','boast'],'count'],
 ['test · exam · assignment · subject · lesson · task · effort','I failed my physics ______, but I passed chemistry.',['exam','lesson','task','subject'],'exam'],
 ['test · exam · assignment · subject · lesson · task · effort','How can we make science ______ more interesting?',['lessons','tasks','efforts','tests'],'lessons'],
 ['test · exam · assignment · subject · lesson · task · effort','Making these pastries is no easy ______.',['task','effort','test','subject'],'task'],
 ['test · exam · assignment · subject · lesson · task · effort','I have a lot of reading ______ to complete before the end of term.',['assignments','subjects','lessons','efforts'],'assignments'],
 ['test · exam · assignment · subject · lesson · task · effort',"I've made an ______ to drink less tea and coffee.",['effort','task','assignment','exam'],'effort'],
 ['test · exam · assignment · subject · lesson · task · effort','The class are having a spelling ______ today.',['test','lesson','subject','effort'],'test']];
const CF2=[
 ['test · exam · assignment · subject · lesson · task · effort','My favourite ______ at school were history and English.',['subjects','lessons','tasks','exams'],'subjects'],
 ['colleague · classmate · student · pupil','She discovered that her male ______ were earning more than she was.',['colleagues','classmates','pupils','students'],'colleagues'],
 ['colleague · classmate · student · pupil',"Students were given a list of all their ______' names and a list of descriptions of roles.",['classmates','colleagues','pupils','students'],'classmates'],
 ['colleague · classmate · student · pupil','The painting is believed to be by a ______ of Titian.',['pupil','student','classmate','colleague'],'pupil'],
 ['colleague · classmate · student · pupil','There are plenty of job opportunities for engineering ______.',['students','pupils','classmates','colleagues'],'students'],
 ['qualifications · qualities · skills · degree · certificate · results','We\'re looking for someone who loves children and has the ______ of a good teacher.',['qualities','qualifications','skills','results'],'qualities'],
 ['qualifications · qualities · skills · degree · certificate · results',"He has a master's ______ in history from Yale.",['degree','certificate','qualification','result'],'degree'],
 ['qualifications · qualities · skills · degree · certificate · results','Ruth had great writing ______.',['skills','qualities','qualifications','results'],'skills'],
 ['qualifications · qualities · skills · degree · certificate · results','Do you have any academic ______?',['qualifications','qualities','skills','certificates'],'qualifications'],
 ['qualifications · qualities · skills · degree · certificate · results','British Airways has announced disappointing ______ for the first half of the year.',['results','qualities','skills','degrees'],'results'],
 ['qualifications · qualities · skills · degree · certificate · results',"You can get a medical ______ that shows which vaccinations you've had.",['certificate','degree','qualification','result'],'certificate'],
 ['speak · talk · know · recognise · tell · say','Would you mind ______ more slowly, please?',['speaking','talking','saying','telling'],'speaking'],
 ['speak · talk · know · recognise · tell · say','She ______ to her mother on the phone every week.',['talks','says','tells','speaks'],'talks'],
 ['speak · talk · know · recognise · tell · say',"I hadn't seen her for 20 years, but I ______ her immediately.",['recognised','knew','told','said'],'recognised'],
 ['speak · talk · know · recognise · tell · say','Can your child ______ the time yet?',['tell','say','speak','know'],'tell'],
 ['speak · talk · know · recognise · tell · say','Small children find it difficult to ______ long words.',['say','tell','talk','speak'],'say'],
 ['achieve · reach · get · arrive',"I've been working all day, but I feel as if I've ______ nothing.",['achieved','reached','got','arrived'],'achieved'],
 ['achieve · reach · get · arrive','If you ______ to the restaurant before us, just wait at the bar.',['get','reach','arrive','achieve'],'get'],
 ['achieve · reach · get · arrive','She ______ the conclusion that there was no more she could do.',['reached','achieved','arrived','got'],'reached'],
 ['achieve · reach · get · arrive','We ______ in Prague later that day.',['arrived','reached','got','achieved'],'arrived']];

/* Linking words (Lesson 1, Task 8) */
const LW=['otherwise','nonetheless','furthermore','generally','besides','whereas','therefore'];
const LK=[["I'd better write it down, ______ I'll forget it.",'otherwise'],
 ['There are serious problems in our country. ______, we feel this is a good time to return.','nonetheless'],
 ["The house is beautiful. ______, it's in a great location.",'furthermore'],
 ['______, they don’t have a bad life and they have no desire to change it for anything more adventurous.','generally'],
 ['Do you play any other sports ______ basketball?','besides'],
 ['He must be about 60, ______ his wife looks about 30.','whereas'],
 ['Doctors are short of time to listen and ______ tend to prescribe drugs whenever they can.','therefore']]
 .map(([q,a])=>['Linking words',q,[a,...shuffle(LW.filter(x=>x!==a)).slice(0,3)],a]);

/* Listening 3–9 (Lesson 1, Task 4): First weeks at university */
const LS=[
 ['Question 1','What advice does Leanne give about getting to know people in the first weeks at university?',['A) Join lots of different sports clubs.','B) Avoid judging people on first impressions.','C) Make friends with people studying the same subject as you.'],'B) Avoid judging people on first impressions.'],
 ['Question 2','What does she regret about her first week at university?',['A) not having more fun','B) not doing more work','C) not saving her money'],'A) not having more fun'],
 ['Question 3','Leanne chose not to live at home because',['A) her parents discouraged her.','B) it was too far to travel every day.','C) she wanted to be independent.'],'C) she wanted to be independent.'],
 ['Question 4','Leanne was able to manage financially at university by',['A) cutting down on her social life.','B) getting an evening job.','C) finding ways of economizing.'],'C) finding ways of economizing.'],
 ['Question 5','What is Leanne’s opinion on attending lectures?',['A) It’s not worth going.','B) They are useful as an introduction to the subject.','C) You should make detailed notes.'],'B) They are useful as an introduction to the subject.'],
 ['Question 6','What did Leanne find difficult about working without supervision?',['A) managing her time','B) motivating herself','C) understanding the task'],'A) managing her time'],
 ['Question 7','What did she find difficult about university life?',['A) being away from her family','B) having to cook for herself','C) getting stressed by work'],'C) getting stressed by work']];
const LS_WHY=['Try to be open-minded: people who don’t speak to you may just be shy. A – not only sports clubs. C – a fact, not a tip.',
 '“I wish I’d taken more advantage of social life in that first week.” B – work shouldn’t be a priority at first. C – spending more is OK.',
 '“It was important to stand on my own two feet” = be independent. B – it wasn’t far. A – the family is close.',
 'Sharing books, charity shops, eating cheaply = economizing. B – an evening job would mean cutting down on social life (A).',
 'A lecture gives a basic overview and shows what to read around, so it’s worth going. C – notes are on the internet.',
 'It’s easy to waste time unless you’re disciplined = managing time. B / C – she is interested in the subject.',
 'She gets totally stressed at exam times. B – cooking wasn’t too bad. A – she appreciated her mum in the holidays.'];

/* Reading 11 (Lesson 1, Task 2, Открытый банк ФИПИ) */
const R11_TXT='It is a source of national embarrassment – despite hours of lessons and listening to foreign language tapes, most of us [A]. However, a new study suggests there may be hope for those who have difficulty with a foreign language – they should try singing it instead.\nResearch found that adults who sang words or short phrases from a foreign language while learning were twice as good at speaking it later. It is thought that by listening to words that are sung, and by singing them back, the technique takes advantage of the strong links between music and memory.\nAlthough not clearly understood, music is known to help students [B] recall.\nDr Overy said singing could lead to new approaches to learning a foreign language. She said: “Most people [C] from songs they have heard and songs are sometimes used by language teachers with young children.”\nDr Overy and her colleagues used recordings of Hungarian words to teach 60 adults. They chose Hungarian as the participants [D] language.\nThe participants either listened to words that were spoken and then had to repeat them back, much like a standard teach-yourself tape, or the words were said rhythmically or sung.\nAfter a 15-minute learning period, they were then given several tests to see how well they had learned the words. Those [E] scored highest. They were also better at recalling the words correctly in tests of long term memory. Interestingly, they did not sing the words when they recalled them.\nDr Ludke said the findings could help those [F].';
const R11_OPT=['when studying and can help to start memory','who struggle to learn foreign languages','had no experience of learning this','have experience of remembering words','who had used the “listen and sing” approach','can barely order a simple drink while abroad','facilitate verbatim memory for foreign languages'];
const R11_KEY={A:6,B:1,C:4,D:3,E:5,F:2};

/* Reading 12–18 training (Lesson 1, Task 7, Открытый банк ФИПИ) */
const R12_TXT=`For any student, moving away from home can be a bit scary. But I did not expect student life in Scotland to be all that different from my home of the Netherlands. After all, we get the same news and TV shows online. Many students find the northwest climate can affect them a lot. You may find the grayness and dampness, especially during the winter months, difficult to get used to. However, when I moved from Amsterdam to study at the University of Stirling, I began to realise that a few minor issues were catching me off balance. I was suffering a minor cultural shock.
In my first year, I quickly found out my English was not as good as I had assumed. Most of my roommates were born and raised in Scotland, and I constantly found myself having to ask people to repeat themselves. Their Scottish accents did not help and I was mispronouncing names and places all the time. I also got confused about minor cultural things. Much to my flatmates’ amusement, it took me two Christmases to figure out that mince pies are not actually filled with minced beef.
The linguistic barrier meant that public transport was tricky at first. I found the lack of information about bus prices and how and where to get tickets really surprising. It turned a simple 15-minute journey into a daunting task.
Then I had to adjust to a new social life. I was surprised by the campus culture in the UK – in the Netherlands, most universities don’t have one main campus where you can attend university, as well as live and exercise all in the same place. But here, you never have to leave campus if you don’t want to. I had to adapt to everyone being so close to each other all the time.
Parties are different here too. In the Netherlands, the less effort you put into getting ready, the better. I’d normally slip on my trusty Converse shoes, along with some clothes I could get away with wearing to class tomorrow, and wear minimal make-up. But, in my experience, partying is more formal in the UK. Your make-up needs to be flawless and your hair needs to be immaculate. You’ll preferably be wearing a dress and heels, too. I was constantly having to borrow clothes off my friends just to fit in. Parties finish early and everyone just wanders off, whereas in my country that would be the time I’d leave the house.
But it is not all early closing times and strange pastries. Social behaviours may also confuse, surprise or offend you. For example, you may find people appear cold, distant or always in a hurry. Cultures are built on deeply-embedded sets of values, norms, assumptions and beliefs. It can be surprising and sometimes distressing to find that people do not share some of your most deeply held ideas, as most of us take our core values and beliefs for granted and assume they are universally held.
However, I have found lots of pleasant surprises in the UK too – and so have many other international students I know. My friend Agnes was taken aback by how sociable people are. She says she was shocked when complete strangers started talking to her at the bus stop. I, personally, was surprised by how smartly male students in Stirling dress compared to my home country.
Culture shock can knock your confidence in the beginning. But you are not alone in taking time to adapt, and soon you start to come to grips with all experiences. Studies suggest that taking a gap year or studying abroad can positively influence your brain to make you more outgoing and open to new ideas. Looking back, most of the ones I experienced made good stories to tell my friends.`;
const R12=[
 ['Question 1','When she moved to Scotland, the student was mostly confused by …',['1) small unexpected things.','2) television shows.','3) the weather.','4) the local food.'],'1) small unexpected things.',['Correct: “minor issues were catching me off balance”.','Wrong information: “we get the same news and TV shows”.','Mentioned, but the question is different: true for many students, not for her.','Not stated.']],
 ['Question 2','In paragraph 4 “Then I had to adjust to …” the author stresses that it was difficult for her to get used to …',['1) living in the same place all the time.','2) doing sports where she lived.','3) always being around the same people.','4) having few social activities.'],'3) always being around the same people.',['Mentioned, but the question is about social life.','Not stated: it was all on the same campus, not where she lived.','Correct: “I had to adapt to everyone being so close to each other all the time.”','Not stated: the number of activities is not mentioned.']],
 ['Question 3','According to the author, parties she got used to in the Netherlands …',['1) made her feel uncomfortable.','2) required greater expenses.','3) started and finished earlier.','4) allowed for casual clothing.'],'4) allowed for casual clothing.',['Not stated about parties in general.','Wrong: she wore everyday clothes.','Wrong: parties in the Netherlands start when UK parties finish.','Correct: “the less effort you put into getting ready, the better”.']],
 ['Question 4','Which of the following statements, according to the author, is TRUE about international students in Stirling?',['1) They don’t dress up as well as locals.','2) They may experience many positive cultural surprises.','3) They don’t talk to strangers.','4) Their eating habits are different.'],'2) They may experience many positive cultural surprises.',['Wrong: she compares male students to her home country, not to locals.','Correct: “I have found lots of pleasant surprises … and so have many other international students”.','Wrong: strangers talked to her friend, not the other way round.','Not stated.']]];

/* Word formation 25–29: Remembering for exams (Lesson 1, Task 5) + Auckland University (ФИПИ, страница тренажёров) */
const WF=[
 {name:'Remembering for exams',rows:[
  ['It’s frustrating for everybody not to be able to remember things but having a bad memory can be a particular [1] for students at exam time.',['ADVANTAGE'],['disadvantage']],
  ['Anyway, I did a search on the internet and found [2] ideas for improving your memory.',['COUNT'],['countless']],
  ['One idea I thought particularly [3] was that we should try and use all our senses when given information to learn.',['VALUE'],['valuable']],
  ['So, for example, instead of reading [4], we should record the material and then listen to it.',['SILENT'],['silently']],
  ['Apparently, the [5] of speaking and listening helps reinforce the [6] text.',['COMBINE','WRITE'],['combination','written']],
  ['Another theory, which some people might find [7], is that there is a greater [8] of our memorising something successfully if we do it when the house is [9] and, preferably, just before bedtime.',['LIKELY','POSSIBLE','PEACE'],['unlikely','possibility','peaceful']]]},
 {name:'Auckland University',rows:[
  ['The University of Auckland is New Zealand’s leading university. [25], it’s among the top 200 universities of the world.',['ACTUAL'],['actually']],
  ['The University of Auckland has a strong focus on legal and [26] programmes welcoming students from all parts of the world.',['BUSY'],['business']],
  ['The student [27] of the University of Auckland is 40,000, about 4,000 of whom have come to study from abroad.',['POPULATE'],['population']],
  ['The University of Auckland also offers postgraduate studies, which will certainly broaden your academic and [28] horizons.',['EMPLOY'],['employment']],
  ['It will be [29] for your CV with specialist skills and knowledge provided.',['VALUE'],['valuable']],
  ['Whether you plan to join the next generation of leading [30] in New Zealand or in your native country, the University of Auckland will help you to make your mark on the world.',['LAW'],['lawyers']]]}];

/* ---------- прогноз по фото ---------- */
function predict(box){box.append(el('div','inst','<b>Look at the photos and predict.</b>'));
  const g=el('div','pic3');for(let i=1;i<=3;i++){const f=el('figure');const img=new Image();const ex=['jpg','png','webp'];let x=0;img.alt='Photo '+i;
    img.onerror=()=>{x++;if(x<ex.length)img.src='img/edu-'+i+'.'+ex[x];else img.replaceWith(el('div','ph','Photo '+i));};img.src='img/edu-'+i+'.'+ex[0];f.append(img);g.append(f);}
  box.append(g);
  box.append(el('ol','pq','<li>Where are these people and what are they doing? They might be… / They must be…</li><li>What could make things easy or hard to remember when you study?</li><li>What do you think will be the hardest thing about being a university student?</li>'));}

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
  const top=el('div','lstop');const a=el('audio');a.controls=true;a.preload='auto';a.src='audio/edu-first-weeks.mp3';a.className='aud';
  top.append(el('div','lst','<b>First weeks at university.</b> Choose A, B or C.'),a);box.append(top);
  const grid=el('div','lsg');box.append(grid);const cards=[];
  const panel=el('div','lsq lsp'),res=el('div','lsres'),why=el('div','lsw');
  LS.forEach((it,k)=>{const c=el('div','lsq');c.append(el('div','lsqt','<b>'+(k+1)+'</b> '+esc(it[1])));
    const bs=it[2].map(o=>{const b=el('button',null,esc(o));b.type='button';b.onclick=e=>{if(st.done){showWhy(k);return;}st.picks[k]=o;bs.forEach(x=>x.classList.toggle('on',x===b));};
      if(st.picks[k]===o)b.classList.add('on');c.append(b);return b;});
    c.onclick=()=>{if(st.done)showWhy(k);};cards.push({c,bs,it,k});grid.append(c);});
  function showWhy(k){cards.forEach(x=>x.c.classList.toggle('sel',x.k===k));why.innerHTML='<b>'+(k+1)+'</b> '+esc(LS_WHY[k]);}
  function check(show){st.done=true;let ok=0;cards.forEach(({bs,it,k})=>{if(show)st.picks[k]=it[3];const p=st.picks[k];if(p===it[3])ok++;
    bs.forEach(b=>{const t=b.textContent;b.classList.remove('on');b.classList.toggle('ok',t===it[3]);b.classList.toggle('no',t===p&&p!==it[3]);});});
    res.textContent=ok+' / 7';why.textContent='Click a question to see why.';}
  function reset(){st.done=false;st.picks={};cards.forEach(({c,bs})=>{c.classList.remove('sel');bs.forEach(b=>b.className='');});res.textContent='';why.textContent='';}
  const bb=el('div','lsbtn');bb.append(btn('Check',()=>check(false),'main sm'),btn('Show answers',()=>check(true),'sm'),btn('Reset',reset,'sm'));
  panel.append(bb,res,why);grid.append(panel);
  if(st.done)check(false);
  cleanR=()=>{try{a.pause();}catch(e){}};}

/* ---------- чтение 11: пропуски A–F, справа части предложений ---------- */
function read11(box){const st=S.r11;box.append(el('div','inst','<b>Singing can help when learning a foreign language.</b> Fill in the gaps A–F with parts of sentences 1–7. There is one extra part.'));
  const rd=el('div','rd11');box.append(rd);
  const tx=el('div','rtext');
  R11_TXT.split('\n').forEach(par=>{const p=el('p');par.split(/\[([A-F])\]/).forEach((x,i)=>{if(i%2===0){p.append(document.createTextNode(x));return;}
    const cur=st.a[x];const g=el('span','gap'+(cur&&st.chk?(cur===R11_KEY[x]?' ok':' no'):'')+(st.cur===x?' cur':''),cur?x+' · '+cur:x);g.onclick=()=>{st.cur=x;H.render();};p.append(g);});tx.append(p);});
  const op=el('div','r11o');op.append(el('div','tag','Gap '+st.cur));
  R11_OPT.forEach((o,k)=>{const n=k+1,used=Object.entries(st.a).some(([g,v])=>v===n&&g!==st.cur);const b=el('button',(st.a[st.cur]===n?'on':'')+(used?' used':''),n+'. '+esc(o));b.type='button';
    b.onclick=()=>{if(st.chk)return;st.a[st.cur]=n;const nx='ABCDEF'.split('').find(g=>!st.a[g]);if(nx)st.cur=nx;H.render();};op.append(b);});
  rd.append(tx,op);
  const ok=Object.keys(R11_KEY).filter(g=>st.a[g]===R11_KEY[g]).length;
  const bar=el('div','fbar');bar.append(btn('Check',()=>{st.chk=true;H.render();},'main sm'),btn('Show answers',()=>{st.a={...R11_KEY};st.chk=true;H.render();},'sm'),btn('Reset',()=>{S.r11={cur:'A',a:{},chk:false};H.render();},'sm'),el('b',null,st.chk?ok+' / 6':''));box.append(bar);}

/* ---------- чтение 12–18: текст слева, вопрос справа, разбор каждого варианта ---------- */
function read12(box){box.append(el('div','inst','<b>The culture shock of being an international student.</b> Read the text and choose the correct option. Then check why the other options are wrong.'));
  const rd=el('div','rd12');const tx=el('div','rtext r12t');R12_TXT.split('\n').forEach((p,i)=>tx.append(el('p',null,'<b class="pn">'+(i+1)+'</b> '+esc(p))));
  const q=el('div');rd.append(tx,q);box.append(rd);mcqFree(q,S.r12,R12,{keep:true,one:true,small:true});}

/* ---------- 25–29: как на сайте ФИПИ, слово справа, ответ по нажатию на пропуск ---------- */
function wordForm(box){const st=S.wf,T=WF[st.t];
  const top=el('div','fbar');top.append(seg(WF.map((x,k)=>[k,x.name]),st.t,v=>{st.t=v;st.open={};H.render();}),
    btn('Show all',()=>{T.rows.forEach((r,k)=>r[2].forEach((a,j)=>st.open[k+'-'+j]=true));H.render();},'sm'),btn('Hide',()=>{st.open={};H.render();},'sm'));box.append(top);
  box.append(el('div','inst','Read the text. Form a word that fits each gap from the word in capitals.'));
  const tb=el('table','wft');T.rows.forEach((r,k)=>{const tr=el('tr');const td=el('td');let j=0;
    r[0].split(/\[(\d+)\]/).forEach((p,i)=>{if(i%2===0){td.append(document.createTextNode(p));return;}
      const id=k+'-'+(j++),ans=r[2][j-1];const g=el('span','gap wfg'+(st.open[id]?' ok':''),st.open[id]?esc(ans):p);g.onclick=()=>{st.open[id]=!st.open[id];H.render();};td.append(g);});
    tr.append(td,el('td','wfw',r[1].map(esc).join('<br>')));tb.append(tr);});
  box.append(tb);}

const H=Hub({title:'18 November · Family → Education',sub:'Тест по теме «Семья» и Lesson 1 блока Education.',
 clean:()=>{if(cleanR){cleanR();cleanR=null;}},
 groups:[
 {name:'Разминка',color:'#c8553d',items:[
  {id:'predict',t:'Predict',sub:'Фото: о чём тема?',run:predict},
  {id:'speak',t:'Speaking',sub:'Task 3 · 4 интервью',run:speak}]},
 {name:'Family · тест',color:'#8f4d7c',items:[
  {id:'ftest',t:'Family test',sub:CH.length+' вопросов',run:b=>mcqFree(b,S.ft,CH)}]},
 {name:'Education · лексика',color:'#2c7f78',items:[
  {id:'cards',t:'Cards',sub:EDU.length+' карточек',run:b=>cards(b,S.c,EDU,k=>k<13?'Phrasal verb':'Collocation')},
  {id:'cf1',t:'Words in contrast 1',sub:CF1.length+' вопросов',run:b=>mcqFree(b,S.c1,CF1)},
  {id:'cf2',t:'Words in contrast 2',sub:CF2.length+' вопросов',run:b=>mcqFree(b,S.c2,CF2)},
  {id:'lk',t:'Linking words',sub:'30–36 · '+LK.length+' вопросов',run:b=>mcqFree(b,S.lk,LK)}]},
 {name:'Education · ЕГЭ',color:'#2855d9',items:[
  {id:'ls',t:'Listening 3–9',sub:'First weeks at university',run:listening},
  {id:'r11',t:'Reading 11',sub:'Singing can help',run:read11},
  {id:'r12',t:'Reading 12–18',sub:'Culture shock',run:read12},
  {id:'wf',t:'Word formation 25–29',sub:'2 текста',run:wordForm}]},
 {name:'Ещё к теме',color:'#4a4f8f',items:[
  {t:'Family · вариант ЕГЭ',sub:'Семья и друзья: 1–38',href:'family-variant.html?v=2'},
  {t:'Family · урок',sub:'Карточки и тексты',href:'family-lesson.html?v=4'}]}
 ]});
H.render();
