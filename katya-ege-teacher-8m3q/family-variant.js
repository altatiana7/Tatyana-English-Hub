/* Family · тематический вариант ЕГЭ «Семья и друзья» (Открытый банк заданий ЕГЭ).
   Слева аудирование 1, 2, 3–9 (записи положила учительница), справа чтение 10–18, грамматика 19–29, лексика 30–36, письмо 37–38.
   Ключи: аудирование – по найденным разборам, чтение и 19–36 – сверены с текстом; письмо проверяет учитель.
   Ничего не сохраняется: страница каждый раз открывается с начала. */
const main=$('#main');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- данные ---------- */
const T1={before:'first memories · when I was a toddler · brought up by my granny · remember anything · childhood illnesses · my early years',
 st:['Childhood memories may be connected with food.','Childhood memories can be very chaotic.','Tales of your childhood are interesting to hear.','One can remember many details about childhood.','Childhood memories aren’t important.','One may feel bad because of the absence of early childhood memories.','Childhood memories are linked to holidays.'],
 key:{A:6,B:4,C:2,D:5,E:3,F:1}};
const T2={st:['Mike is five years older than his sister.','The family members live in different parts of the country.','Mike’s father had a very happy childhood.','Mike’s father retired because of his poor health.','Mike’s mother and father first met each other being on holidays.','Mike and his sister do not seem to be very close.','Mike and his sister were brought up in the same way.'],
 key:[3,1,3,1,2,1,2],lab:['True','False','Not stated']};
const Q39=[
 ['What does the presenter NOT say about Mary Brown at the beginning of the interview?',['She writes books.','She often comes to this programme.','She is a psychologist.'],2],
 ['Which proverb paraphrases Mary’s words “You should always see a positive side of everything”?',['A friend is easier lost than found.','Every cloud has a silver lining.','Old friends are the best.'],2],
 ['What does Mary think about finding new friends at parties and in clubs?',['You’re likely to make many new acquaintances.','It’s less banal than going to festivals and events.','It’s the best way to develop a network of friends.'],1],
 ['What does Mary recommend doing to make friends online?',['Meeting online friends in real life later.','Avoiding any interest groups.','Taking an active part in forums.'],3],
 ['Which topic does Mary NOT mention as a way to start a conversation?',['Your personality.','Weather and climate.','Everyday affairs.'],2],
 ['In Mary’s opinion, what should you be like when you meet a new person?',['Judgmental.','Patient.','Easy-going.'],3],
 ['According to Mary, what can make a new friendship blossom?',['Time spent together.','Sharing a hobby.','Starting a business together.'],1]];

const HEAD=['Pet-friendly booking','Funny names','Different tactics','Seeing wild animals','Almost at the shore','Seaside observation point','Quiet places to explore','Various activities to do'];
const R10={A:'The English have a very ironic sense of humour, and it may become clear when you discover what some of the towns and villages across England and the United Kingdom are called. Some are hilarious, while others are just plain rude. It is important to keep an eye out when you pass through the English countryside to see if you can spot a few on your travels. There’s Sheepy Parva and Sheepy Magna in Lancashire, Greedy Gut in Somerset, No Place in Derbyshire. There is always something to keep people entertained during their trip!',
 B:'England is part of the British Isles and a large archipelago off the coast of Europe. It is not a very big country. In fact, you could fit all the United Kingdom, that is, England, Wales, Scotland, and Northern Ireland, inside Texas, the USA, over 2.8 times. So, it shouldn’t come as too much surprise to know that you are never far from the sea when you are in England. In fact, even if you are standing in the very center of the country, you are still no more than 70 miles away from the coast. What a shame that the English weather doesn’t often encourage a beach day!',
 C:'Badgers are not always a farmer’s best friends, but Badger Watch farm in deepest rural Dorset has decided to exploit rather than fight Britain’s cutest large mammals. Extremely difficult to spot, a badger seen in the wild is an unforgettable experience. Two specially designed hides at Badger Watch Dorset offer one of the best chances of finding one. Each hide can be booked privately for up to eight people, from 6.30 pm until the lights are shut off at midnight. Alongside badgers, the hides offer a good chance of seeing foxes, deer, and rabbits.',
 D:'Holidays are the best opportunity to explore the UK and overseas territories, spending quality time with family or friends including a four-legged one. In fact, holidays are the best excuse to go on some nice dog adventure and give your dog the best time. To plan your perfect holiday, it’s a matter of finding a place suitable for dogs. The good news is that there is more choice than you may think. We found that almost all holiday accommodation and hotels have a filter which you can use to navigate your options, although some are better presented than others.',
 E:'The Hebrides are a beautiful archipelago, where Scottish Gaelic is still spoken. Each day will be a combination of relaxation and adventure. On a full day’s excursion, we may spend four or five hours in the kayaks and cover between seven and ten miles, with plenty of opportunities to land and explore islands on foot. One of the best ways to explore its coastline and spot some of the many bird species, otters and seals is by kayak. We can offer full-day guided trips, taking in hidden coves, long sandy beaches, and hidden ancient sites.',
 F:'You never forget your first whale. Such sightings are, of course, down to good fortune and timing, but once you’ve seen your first whale, you will want to see another and another. Famous for its whaling fleet, the Yorkshire coast is one of the best places in England to spot Minke whales, which appear in late summer, following the mackerel. From the coastline of the Outer Hebrides, you can spot up to 23 species of whales, more than a quarter of the world’s 89 known species, which pass through the waters off the west coast of Scotland.',
 G:'In summer the possibility of finding a calm area away from the crowds of holiday-goers can be a difficult task. Known as the Heritage Coast, the Northumberland coast area of outstanding natural beauty is surprisingly crowd-free, even in high summer. If you’re willing to relax, you’ll find a number of excellent bathing beaches here. Heritage hunters and nature watchers are spoiled with fantastically arresting castles. Most striking is the mighty fortress at Bamburgh. Many architectural historians have declared this the most wondrous of all England’s coastal castles.'};
const K10={A:2,B:5,C:4,D:1,E:8,F:6,G:7};

const PI_TXT='“The Life of Pi” published in 2001 is the third book by the Canadian author Yann Martel. It has [A], won several prizes and been translated into forty-one languages. At the start of the book, we [B] in India. His father owns the city zoo and the family home is in the zoo. When they aren’t at school, Pi and his brother help their father at the zoo and he learns a lot about animals. When Pi is sixteen, his parents decide to close the zoo and move to Canada. They travel by ship taking the animals with them. On the way, there is [C]. Sadly, Pi’s family and the sailors all die in the storm, but Pi lives and finds himself in a lifeboat with a hyena, zebra, orangutan and an enormous tiger. At first, Pi is scared of the animals and jumps into the ocean. Then he remembers there are sharks in the water and decides to climb back into the lifeboat. One by one, the animals in the lifeboat kill and eat each other, till only Pi and the tiger are left alive. Luckily for Pi, there is [D], but he soon needs to start catching fish. He feeds the tiger to stop it killing and eating him. He also uses a whistle and [E] and show it that he’s the boss. Pi and the tiger spend 227 days in the lifeboat. They live through terrible storms and the burning heat of the Pacific sun. They are often hungry and ill. Finally, they arrive at the coast of Mexico, but you will have to [F] in the end!';
const PI_OPT=['a terrible storm and the ship sinks','received an award for being strong','some food and water on the lifeboat','sold seven million copies worldwide','read the book to find out what happens','learn about Pi’s childhood in Pondicherry','his knowledge of animals to control the tiger'];
const PI_KEY={A:4,B:6,C:1,D:3,E:7,F:5};

const PUNC=['There are few habits as infuriating as someone making us wait. But, despite what may be running through your mind as you’re kept waiting, it’s unlikely your friends and colleagues are just being selfish or do not care about the time. A look into the causes of lateness (or tardiness) offers a glimpse into a mind that may be malfunctioning.',
 '<b>2.</b> Perceptions of unpunctual people are almost always negative. “It is easy to perceive them as disorganised, chaotic, rude and lacking in consideration for others,” says Harriet Mellotte, a behavioural therapist in London. “Outside of my clinical practice, others being late can particularly <b>get under my skin!</b>”',
 'But many late people are at least somewhat organised and want to keep friends, family and bosses happy. The punctually-challenged are often excruciatingly aware and ashamed of the damage their lateness could do to their relationships, reputations and careers. Some excuses are fairly universally accepted — an accident or ailment, for example. But others aren’t so easy to swallow. Some late people will pass it off as a symptom of being concerned with loftier matters than time-keeping or having the body clock of a night owl rather than a lark.',
 'Personality differences could also dictate how we experience the passing of time. Jeff Conte, a psychology professor at San Diego State University, ran a study in which he separated participants into Type A people (ambitious, competitive) and Type B (creative, reflective, explorative). He asked them to judge, without clocks, how long it took for one minute to elapse. Type A people felt a minute had gone by when roughly 58 seconds had passed. Type B participants felt a minute had gone by after 77 seconds. “Being consistently late might not be your fault. It could be your type. The punctually-challenged often share personality characteristics such as optimism, low levels of self-control, anxiety”, he says.',
 'Dr Linda Sapadin, a psychologist from New York, says some persistent lateness comes from “an obsessive thinking problem”. The procrastinator focuses on a fear attached to the event or deadline for which they are running late. Rather than figuring out how to get beyond the fear, the fear becomes the excuse — usually expressed with a ‘but’ statement. For instance, you might tell yourself, “I wanted to be on time for that event <i>but</i> I couldn’t decide what to wear; I started to write an article <i>but</i> I was afraid my colleagues would find it not good enough,” she explains. “Whatever comes after the ‘but’ is what counts,” says Sapadin. She suggests changing the word ‘but’ to ‘and’. ‘But’ denotes opposition and blockage; ‘And’ denotes connection and resolution, she explains, so “the task becomes less frightening”.',
 'Dr Sapadin started on her path to punctuality by identifying and adapting the very thing that seemed to always make her late. “Instead of getting angry or upset because a friend or a loved one is always late, you can take a stand and set boundaries,” she says. “Talk about what you will do if the other person isn’t on time. Tell your late friend you’ll go into the movie without them if they’re more than ten minutes late. Tell that colleague who never turns his part of the project in on time that it just won’t be included next time — and the boss will know about it.”',
 'For me, a turning point came when a good friend drew her line in the sand. I was an hour late for a run in our local park. “That was it,” she said. “The truth is, I’m not going to make any more plans with you.” And so she set in motion the best thing for me: she put an end to my perpetual lateness.'];
const Q1218=[
 ['12. According to the author, the cause of unpunctuality is likely to be that a person …',['doesn’t care about other people.','is unaware of the time.','has psychological problems.','is ill-mannered and undisciplined.'],3],
 ['13. The expression “get under my skin” (paragraph 2) means …',['disappoint.','irritate.','depress.','surprise.'],2],
 ['14. Which of the excuses for the unpunctuality is NOT mentioned by the author?',['Biological rhythms.','Health problems.','Important business.','Clock failure.'],4],
 ['15. According to professor Jeff Conte, punctually-challenged people …',['are concentrated on their careers.','prefer competitive sports.','are often optimistic.','don’t particularly enjoy life.'],3],
 ['16. Dr Linda Sapadin suggests that changing the word ‘but’ to ‘and’ in people’s excuses for being late will …',['make the excuses more correct.','explain more clearly why they were late.','make them try harder coping with their problems.','help them appear less rude.'],3],
 ['17. According to Dr Linda Sapadin, if people are unable to meet deadlines you should …',['explain to them what the consequences will be.','do their part of the project yourself.','stop communicating with them altogether.','tell them how disappointed you are.'],1],
 ['18. What is the main idea expressed in the last paragraph?',['To keep friends, one should work on one’s problems.','People must have friendship.','It is hard to have unpunctual friends.','Always tell your friend the truth.'],1]];

/* 19–29: [номер, текст с [], подсказка, ответ] ; null – заголовок / строка без пропуска */
const G1=[['h','Animal friends'],
 [19,'Few people know that dolphins and whales can make good friends. They really enjoy [19] with each other.','PLAY','playing'],
 [20,'It is one of the [20] things to see in the animal world. Scientists believe that whales think that dolphins are their babies.','FUNNY','funniest'],
 [21,'In 2011 people even [21] a dolphin brought up by whales. Isn’t it amazing?','FIND','found'],
 ['h','Where’s our teacher?'],
 [22,'One school had a very strict head teacher. Once he [22] around the school when he heard a terrible noise coming from one of the classrooms.','WALK','was walking'],
 [23,'Opening the door, the teacher [23] a noisy young man in the centre of the classroom.','SEE','saw'],
 [24,'He was [24] than the others and he was making the most noise. The head teacher ordered him to leave the classroom immediately.','TALL','taller']];
const G2=[['h','Vladislav Tretyak'],
 [25,'Vladislav Tretyak is an outstanding Russian hockey player. He is considered to be one of the best goaltenders in the history of ice hockey. He was born in 1952 in a family of a military pilot and a PE teacher. So, it was only [25] that Tretyak did much sport in his early childhood.','NATURE','natural'],
 [26,'He tried [26] sports and wanted to excel in all of them, but fell in love with ice hockey at the age of 11.','VARY','various'],
 [27,'He entered the Children and Youth Sports School of the CSKA, where he began playing goaltender when he saw that, [27], no one else had the desire or courage to play the position.','ACTUAL','actually'],
 [28,'By the age of 19, Tretyak was already famous not only in Russia, but also on the [28] level.','NATIONAL','international'],
 [29,'His great [29] in the Summit Series in 1972 earned him a massive fan base all over the world. Tretyak retired at the age of 32 to spend more time with his family. He is the current president of the Ice Hockey Federation in Russia.','PERFORM','performance']];

const MU_TXT='Brenda is a nineteen-year old full-time college student, and she earns money working part time as a waitress. Brenda loves to listen to music like most young people, but she can’t [30] the high CD prices that record companies [31] for popular CDs. Brenda says that the prices of CDs are ridiculously high at $17 to $20 each and there are only two or three good songs on each CD. She [32] an apartment with three other roommates. She pays her own [33] and she also pays most of her [34]. Her solution to expensive CDs is to download or copy music from the Internet. Brenda and millions of other people are called “downloaders” because they download free file-sharing software and music. When Brenda later gives, shares, or trades her music files free over the Internet, she is also an uploader. She considers herself an active music uploader, but the music industry considers her a [35]. From 2001 on, the Recording Industry Association of America has sued and fined dozens of file-sharing services, for uploading music files, and hundreds of people, for [36] the law by downloading music.';
const MU={30:[['provide','supply','afford','allow'],3],31:[['offer','charge','suggest','propose'],2],32:[['leases','lends','hires','rents'],4],33:[['lessons','classes','tuition','education'],3],34:[['costs','fees','expenses','payments'],3],35:[['thief','cheater','burglar','bandit'],1],36:[['undermining','disobeying','breaking','ruining'],3]};

/* ---------- состояние ---------- */
const S={L:'t1',R:'r10',
 t1:{a:{},chk:false},t2:{a:{},chk:false},q39:{i:0,pick:null,score:0,errs:[],done:false},
 r10:{cur:'A',a:{},chk:false},r11:{cur:'A',a:{},chk:false},q18:{i:0,pick:null,score:0,errs:[],done:false},
 g1:{},g2:{},mu:{cur:30,a:{},chk:false}};

function seg(items,cur,onPick){const s=el('div','seg');items.forEach(([v,l])=>{const b=el('button','segb'+(v===cur?' on':''),l);b.type='button';b.onclick=()=>onPick(v);s.append(b);});return s;}
function overlay(title,html){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
const A_F='ABCDEFG';

let PL,PR;
function layout(){main.innerHTML='';const ws=el('div','ws');PL=el('section','wpane pl');PR=el('section','wpane pr');ws.append(PL,PR);main.append(ws);
  const hb=document.querySelector('.bar'),g=el('div','hbtns');const a=el('a','btn sm','← Family · урок');a.href='family-lesson.html?v=2';a.style.textDecoration='none';g.append(a,btn('Учителю',teacher,'acc sm'));hb.append(g);drawLeft();drawRight();}

/* ---------- слева: аудирование ---------- */
function drawLeft(){PL.innerHTML='';
  PL.append(seg([['t1','1 · A–F'],['t2','2 · T/F'],['t39','3–9']],S.L,v=>{S.L=v;drawLeft();}));
  const body=el('div','pbody');PL.append(body);
  const au=(src)=>{const a=el('audio','aud');a.controls=true;a.preload='none';a.src=src;return a;};
  if(S.L==='t1')task1(body,au('audio/fam-1.mp3'));else if(S.L==='t2')task2(body,au('audio/fam-2.mp3'));else task39(body,au('audio/fam-3-9.mp3'));}

function bar(box,items){const b=el('div','fbar');items.forEach(x=>b.append(x));box.append(b);}

function task1(box,audio){const st=S.t1;
  box.append(el('div','bl','<b>Before listening.</b> Predict the topic using: '+esc(T1.before)+'.'));box.append(audio);
  box.append(el('div','bl','<b>Match speakers A–F with statements 1–7.</b> There is one extra statement.'));
  const ol=el('ol','stl');T1.st.forEach(t=>ol.append(el('li',null,esc(t))));box.append(ol);
  const mg=el('div','mg');box.append(mg);
  'ABCDEF'.split('').forEach(L=>{const r=el('div','mr',''),lb=el('b',null,L);r.append(lb);
    for(let n=1;n<=7;n++){const used=Object.entries(st.a).some(([k,v])=>v===n&&k!==L);let c='cp';
      if(st.a[L]===n){c+=st.chk?(T1.key[L]===n?' ok':' no'):' sel';}else if(used)c+=' used';
      const b=el('button',c,String(n));b.type='button';b.onclick=()=>{if(st.chk)return;Object.keys(st.a).forEach(k=>{if(st.a[k]===n)delete st.a[k];});if(st.a[L]===n)delete st.a[L];else st.a[L]=n;drawLeft();};r.append(b);}
    mg.append(r);});
  const ok='ABCDEF'.split('').filter(L=>st.a[L]===T1.key[L]).length;
  bar(box,[btn('Check',()=>{st.chk=true;drawLeft();},'main sm'),btn('Show answers',()=>{st.a=Object.assign({},T1.key);st.chk=true;drawLeft();},'sm'),btn('Reset',()=>{S.t1={a:{},chk:false};drawLeft();},'sm'),el('b',null,st.chk?ok+' / 6':'')]);}

function task2(box,audio){const st=S.t2;box.append(audio);
  box.append(el('div','bl','<b>Decide:</b> True, False or Not stated.'));
  T2.st.forEach((t,i)=>{const r=el('div','tfr');r.append(el('b',null,A_F[i]),el('span','tt',esc(t)));
    T2.lab.forEach((lab,k)=>{let c='tfb';if(st.a[i]===k+1)c+=st.chk?(T2.key[i]===k+1?' ok':' no'):' sel';
      const b=el('button',c,lab==='Not stated'?'NS':lab[0]);b.type='button';b.title=lab;b.onclick=()=>{if(st.chk)return;st.a[i]=k+1;drawLeft();};r.append(b);});box.append(r);});
  const ok=T2.key.filter((k,i)=>st.a[i]===k).length;
  bar(box,[btn('Check',()=>{st.chk=true;drawLeft();},'main sm'),btn('Show answers',()=>{T2.key.forEach((k,i)=>st.a[i]=k);st.chk=true;drawLeft();},'sm'),btn('Reset',()=>{S.t2={a:{},chk:false};drawLeft();},'sm'),el('b',null,st.chk?ok+' / 7':''),el('span','bl','T = True · F = False · NS = Not stated')]);}

/* одиночный вопрос с выбором ответа (3–9, 12–18) */
function mcq(box,st,items,redraw,prefix){const n=items.length,wrap=el('div','mq');box.append(wrap);
  if(st.done){wrap.append(el('div','score',st.score+' / '+n));wrap.firstChild.style.cssText='font-size:30px;font-weight:800;color:#2e3856';
    if(st.errs.length){wrap.append(el('div','bl','<b>Mistakes</b>'));const ul=el('ul','stl');st.errs.forEach(i=>ul.append(el('li',null,esc(items[i][0])+' → <b>'+esc(items[i][1][items[i][2]-1])+'</b>')));wrap.append(ul);}else wrap.append(el('div','bl','No mistakes.'));
    wrap.append(btn('Play again',()=>{Object.assign(st,{i:0,pick:null,score:0,errs:[],done:false});redraw();},'main sm'));return;}
  const it=items[st.i];wrap.append(el('div','bl',(prefix||'')+(st.i+1)+' / '+n+' · score '+st.score),el('div','qt',esc(it[0])));
  const og=el('div','opts1');it[1].forEach((o,k)=>{const b=el('button',st.pick!==null?(k+1===it[2]?'ok':(k+1===st.pick?'no':'')):'',(k+1)+'. '+esc(o));b.type='button';b.disabled=st.pick!==null;b.onclick=()=>{st.pick=k+1;if(k+1===it[2])st.score++;else st.errs.push(st.i);redraw();};og.append(b);});wrap.append(og);
  const foot=el('div','foot'),fb=el('div','fb',st.pick===null?'':(st.pick===it[2]?'Correct.':'The answer is '+it[2]+'.'));
  const nx=btn(st.i===n-1?'See result':'Next question',()=>{if(st.i===n-1)st.done=true;else st.i++;st.pick=null;redraw();},'main sm');nx.disabled=st.pick===null;foot.append(fb,nx);wrap.append(foot);}

function task39(box,audio){box.append(el('div','bl','<b>Interview.</b> Questions 3–9: choose 1, 2 or 3.'));box.append(audio);mcq(box,S.q39,Q39,drawLeft,'Question ');}

/* ---------- справа ---------- */
function drawRight(){PR.innerHTML='';
  PR.append(seg([['r10','10'],['r11','11'],['r18','12–18'],['g1','19–24'],['g2','25–29'],['mu','30–36'],['w','37–38']],S.R,v=>{S.R=v;drawRight();}));
  const body=el('div','pbody');PR.append(body);
  ({r10:reading10,r11:reading11,r18:reading18,g1:()=>grammar(body,G1,S.g1),g2:()=>grammar(body,G2,S.g2),mu:music,w:writing})[S.R](body);}

function reading10(box){const st=S.r10;box.append(el('div','inst','<b>Task 10.</b> Match texts A–G with headings 1–8. One heading is extra.'));
  const rd=el('div','rd wide');box.append(rd);
  const left=el('div'),chips=el('div','mr');
  Object.keys(R10).forEach(L=>{let c='cp';if(L===st.cur)c+=' sel';const a=st.a[L];if(st.chk&&a)c=c.replace(' sel','')+(a===K10[L]?' ok':' no');const b=el('button',c,L+(a?' · '+a:''));b.type='button';b.onclick=()=>{st.cur=L;drawRight();};chips.append(b);});
  const tx=el('div','rtext');tx.append(el('p',null,'<b>'+st.cur+'.</b> '+esc(R10[st.cur])));left.append(chips,tx);
  const right=el('div','opl');right.append(el('div','hd','Headings · text '+st.cur));
  HEAD.forEach((h,k)=>{const n=k+1,used=Object.entries(st.a).some(([L,v])=>v===n&&L!==st.cur);const b=el('button',(st.a[st.cur]===n?'cp sel':'')+(used?' used':''),n+'. '+esc(h));b.type='button';
    b.style.cssText+=st.a[st.cur]===n?';background:#dbe6fb;border-color:#6f8fd8':'';
    b.onclick=()=>{if(st.chk)return;Object.keys(st.a).forEach(L=>{if(st.a[L]===n)delete st.a[L];});st.a[st.cur]=n;const next=Object.keys(R10).find(L=>!st.a[L]);if(next)st.cur=next;drawRight();};right.append(b);});
  rd.append(left,right);
  const ok=Object.keys(K10).filter(L=>st.a[L]===K10[L]).length;
  bar(box,[btn('Check',()=>{st.chk=true;drawRight();},'main sm'),btn('Show answers',()=>{st.a=Object.assign({},K10);st.chk=true;drawRight();},'sm'),btn('Reset',()=>{S.r10={cur:'A',a:{},chk:false};drawRight();},'sm'),el('b',null,st.chk?ok+' / 7':'')]);}

/* текст с пропусками и панелью вариантов справа (11 и 30–36) */
function gapDoc(box,txt,gaps,st,keys,labelOf,title,inst){box.append(el('div','inst','<b>'+title+'</b> '+inst));
  const rd=el('div','rd');box.append(rd);const tx=el('div','rtext');
  const parts=txt.split(/\[([A-Z0-9]+)\]/);
  parts.forEach((p,i)=>{if(i%2===0){tx.append(document.createTextNode(p));return;}
    const id=/^\d+$/.test(p)?+p:p,cur=st.a[id];let c='gp'+(st.cur===id?' cur':'');if(cur!==undefined&&st.chk)c+=(cur===keys[id]?' ok':' no');
    const g=el('span',c,cur!==undefined?esc(labelOf(id,cur)):String(id));g.onclick=()=>{st.cur=id;drawRight();};tx.append(g);});
  const opl=el('div','opl');opl.append(el('div','hd','Gap '+st.cur));
  gaps(st.cur).forEach((o,k)=>{const n=k+1,used=Object.entries(st.a).some(([L,v])=>v===n&&String(L)!==String(st.cur)&&gaps.uniq);const b=el('button',(used?'used':''),n+'. '+esc(o));b.type='button';
    if(st.a[st.cur]===n)b.style.cssText+=';background:#dbe6fb;border-color:#6f8fd8';
    b.onclick=()=>{if(st.chk)return;st.a[st.cur]=n;const ids=Object.keys(keys).map(x=>/^\d+$/.test(x)?+x:x);const next=ids.find(x=>st.a[x]===undefined);if(next!==undefined)st.cur=next;drawRight();};opl.append(b);});
  rd.append(tx,opl);
  const ids=Object.keys(keys).map(x=>/^\d+$/.test(x)?+x:x),ok=ids.filter(x=>st.a[x]===keys[x]).length;
  bar(box,[btn('Check',()=>{st.chk=true;drawRight();},'main sm'),btn('Show answers',()=>{ids.forEach(x=>st.a[x]=keys[x]);st.chk=true;drawRight();},'sm'),btn('Reset',()=>{Object.keys(st.a).forEach(k=>delete st.a[k]);st.chk=false;st.cur=ids[0];drawRight();},'sm'),el('b',null,st.chk?ok+' / '+ids.length:'')]);}

function reading11(box){const g=()=>PI_OPT;g.uniq=true;
  gapDoc(box,PI_TXT,g,S.r11,PI_KEY,(id,n)=>id+' · '+n,'Task 11.','Fill the gaps A–F with parts of sentences 1–7. One part is extra.');
  if(!S.r11.cur||S.r11.cur==='A'&&false)S.r11.cur='A';}

function reading18(box){box.append(el('div','inst','<b>Tasks 12–18.</b> Read the text and choose 1, 2, 3 or 4.'));
  const rd=el('div','rd wide');box.append(rd);const tx=el('div','rtext');tx.append(el('h5',null,'Punctuality'));
  PUNC.forEach((p,i)=>tx.append(el('p',null,(i===1?'':'<b>'+(i+1)+'.</b> ')+p.replace(/^<b>2\.<\/b> /,'<b>2.</b> '))));
  const q=el('div');mcq(q,S.q18,Q1218,drawRight,'');rd.append(tx,q);}

/* 19–29: сплошной текст, слово справа на полях, ответ открывается нажатием на пропуск */
function grammar(box,rows,st){box.append(el('div','inst','<b>Tasks '+(rows===G1?'19–24':'25–29')+'.</b> Tap a gap to see the answer.'));
  const wrap=el('div');rows.forEach(r=>{if(r[0]==='h'){wrap.append(el('div','grh',esc(r[1])));return;}
    const [n,txt,hint,ans]=r,row=el('div','gr'),t=el('div');const parts=txt.split('['+n+']');t.append(document.createTextNode(parts[0]));
    const g=el('span','gg'+(st[n]?' on':''),st[n]?esc(ans):n+'');g.onclick=()=>{st[n]=!st[n];drawRight();};t.append(g,document.createTextNode(parts[1]));row.append(t,el('div','hint',hint));wrap.append(row);});
  box.append(wrap);bar(box,[btn('Show all',()=>{rows.forEach(r=>{if(r[0]!=='h')st[r[0]]=true;});drawRight();},'sm'),btn('Hide all',()=>{rows.forEach(r=>{if(r[0]!=='h')delete st[r[0]];});drawRight();},'sm')]);}

function music(box){const st=S.mu;const keys={};Object.keys(MU).forEach(n=>keys[n]=MU[n][1]);
  const g=c=>MU[c][0];g.uniq=false;
  gapDoc(box,MU_TXT,g,st,keys,(id,n)=>id+' · '+MU[id][0][n-1],'Tasks 30–36. Sharing music with friends.','Choose the best word for each gap.');}

function writing(box){box.append(el('div','inst','<b>Tasks 37–38.</b> Written part: reading only. Katya writes it as homework.'));
  const w=el('div','wr rtext');
  w.innerHTML='<p><b>37.</b> You have received an email message from your English-speaking pen-friend Jessica:</p><p style="border:1px solid #c9d3e6;border-radius:8px;padding:6px 10px;background:#fff"><b>From:</b> Jessica@mail.uk · <b>To:</b> Russian_friend@ege.ru · <b>Subject:</b> Holidays<br><i>…Hurrah! Summer is finally here. Do you spend your summer holidays with your family or your friends? Where do you usually spend your holidays? Why do you think some people enjoy spending holidays where they live? My brother Tim has just passed his exams...</i></p><p>Write an email to Jessica. In your message: answer her questions; ask <b>3 questions</b> about the exams. Write <b>100–140 words</b>. Remember the rules of email writing.</p>'+
   '<p><b>38.1</b> Imagine that you are doing a project “Family budget: what Zetlanders spend their money on”. You have found some data on the subject – the results of the opinion polls (see the table below). Comment on the data in the table and give your opinion on the subject of the project.</p><table><tr><th>Item of expenditure</th><th>% of family budget</th></tr><tr><td>Housing</td><td>35</td></tr><tr><td>Food</td><td>25</td></tr><tr><td>Medical aid</td><td>17</td></tr><tr><td>Entertainment</td><td>16</td></tr><tr><td>Other</td><td>7</td></tr></table><p>Write <b>200–250 words</b>. Plan: make an opening statement on the subject of the project; select and report 2–3 facts; make 1–2 comparisons where relevant; outline a problem that can arise with one’s family budget and suggest a way of solving it; conclude by giving your opinion on the importance of budgeting carefully.</p>'+
   '<p><b>38.2</b> Imagine that you are doing a project on what topics discussed on social networks interest Zetland teenagers most of all. Comment on the data in the pie chart and give your opinion on the subject of the project.</p><img src="img/fam-pie.png" alt="Pie chart: topics discussed on social networks"><p>Write <b>200–250 words</b>. Plan: make an opening statement on the subject of the project; select and report 2–3 facts; make 1–2 comparisons where relevant and give your comments; outline a problem that one can face with social networks and suggest a way of solving it; conclude by giving and explaining your opinion on the quality of content one can find on the Internet.</p>';
  box.append(w);}

function teacher(){overlay('Учителю · вариант «Семья и друзья»',
'<p><b>Порядок.</b> Прогноз по теме перед заданием 1, затем аудирование 1, 2, 3–9 (сначала звук, потом ответы). Чтение 10–18, грамматика 19–29 (ответ по нажатию на пропуск) и лексика 30–36. Письмо 37–38 — Homework Кати на её сайте.</p>'+
'<p><b>Ключи.</b></p><table class="ptab"><tr><th>Задание</th><th>Ответ</th></tr>'+
'<tr><td>1 (A–F)</td><td>6 – 4 – 2 – 5 – 3 – 1 (лишнее 7)</td></tr><tr><td>2 (A–G)</td><td>3 1 3 1 2 1 2</td></tr><tr><td>3–9</td><td>2 2 1 3 2 3 1</td></tr>'+
'<tr><td>10 (A–G)</td><td>2 5 4 1 8 6 7</td></tr><tr><td>11 (A–F)</td><td>4 6 1 3 7 5</td></tr><tr><td>12–18</td><td>3 2 4 3 3 1 1</td></tr>'+
'<tr><td>19–24</td><td>playing, funniest, found, was walking, saw, taller</td></tr><tr><td>25–29</td><td>natural, various, actually, international, performance</td></tr>'+
'<tr><td>30–36</td><td>3 2 4 3 3 1 3 (afford, charge, rents, tuition, expenses, thief, breaking)</td></tr></table>'+
'<p><b>Откуда ключи.</b> Для аудирования 1, 2, 3–9 они найдены в открытых разборах этих заданий (вопросы 5 и 6 я проверила по Решу ЕГЭ и 100points). Записи я прослушать не могла, поэтому прогони хотя бы одно аудирование сама. Ключи к чтению и 19–36 сверены с текстом.</p>'+
'<p><b>Записи.</b> Каждый файл целиком, как ты прислала (в задании 1 около 8,5 минуты, в 3–9 около 10 минут), включая повторное прослушивание.</p>');}


/* ---------- главный экран варианта ---------- */
const au=src=>{const a=el('audio','aud');a.controls=true;a.preload='none';a.src=src;return a;};
const H=Hub({title:'Семья и друзья · вариант ЕГЭ',sub:'Тематический вариант из открытого банка заданий.',cols:true,
 links:[['Урок Family','family-lesson.html?v=2']],
 groups:[
 {name:'Аудирование',color:'#c8553d',items:[
  {id:'t1',t:'Задание 1',sub:'A–F, говорящие',run:b=>task1(b,au('audio/fam-1.mp3'))},
  {id:'t2',t:'Задание 2',sub:'True / False / Not stated',run:b=>task2(b,au('audio/fam-2.mp3'))},
  {id:'t39',t:'Задания 3–9',sub:'Интервью',run:b=>task39(b,au('audio/fam-3-9.mp3'))}]},
 {name:'Чтение',color:'#2f8f6b',items:[
  {id:'r10',t:'Задание 10',sub:'Тексты и заголовки',run:reading10},
  {id:'r11',t:'Задание 11',sub:'Life of Pi',run:reading11},
  {id:'r18',t:'Задания 12–18',sub:'Punctuality',run:reading18}]},
 {name:'Грамматика и лексика',color:'#2855d9',items:[
  {id:'g1',t:'Задания 19–24',sub:'Формы глаголов и слов',run:b=>grammar(b,G1,S.g1)},
  {id:'g2',t:'Задания 25–29',sub:'Словообразование',run:b=>grammar(b,G2,S.g2)},
  {id:'mu',t:'Задания 30–36',sub:'Sharing music',run:music}]},
 {name:'Письмо',color:'#8f4d7c',items:[
  {id:'w',t:'Задания 37–38',sub:'Только прочитать',run:writing}]}
 ]});
drawLeft=drawRight=()=>H.render();
H.render();
