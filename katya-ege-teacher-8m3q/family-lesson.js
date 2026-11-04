/* Family · урок для Кати (ЕГЭ B2). Материал – из «Family and Friends» (Громова) и страниц Family на сайте.
   Слева: карточки Quizlet и выбор слова. Справа: прогноз по фото → устная часть → ЕГЭ 30–36.
   Заметки учителя – по-русски, под кнопкой «Учителю». Ничего не сохраняется: страница каждый раз открывается с начала. */
const main=$('#main');

const CARDS=[['a close-knit family','дружная семья'],['sibling rivalry','соперничество братьев и сестёр'],['a single-parent family','неполная семья'],['an extended family','большая семья с родственниками'],['a nuclear family','родители и дети'],['a breadwinner','кормилец семьи'],['a family gathering','семейная встреча'],['unconditional support','безусловная поддержка'],['to be on speaking terms','разговаривать друг с другом'],['a distant relative','дальний родственник'],['to share the same values','разделять ценности'],['to rely on somebody','полагаться на кого-то'],['take after','быть похожим на родственника'],['grow up','вырасти'],['bring up','воспитывать'],['get along with','ладить с'],['fall out with','поссориться с'],['make up with','помириться с'],['drift apart','отдалиться друг от друга'],['fit in','вписаться в коллектив'],['let down','подвести'],['hit it off','сразу найти общий язык'],['go out with','встречаться с'],['break up','расстаться']];

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
const EGE_TXT="When Olivia moved to a new school, she was worried about making friends. At first, she found it hard to [30] because everyone already knew each other. Luckily, her classmate Emma helped her feel welcome. The girls quickly [31] and discovered they had a lot in common. Olivia admired Emma's [32]: she never shared private conversations with others. However, they once [33] over a misunderstanding. Instead of ignoring the problem, they talked it through and soon [34]. Olivia realised that good friends don't always [35] on everything, but they respect each other's opinions. Since then, their friendship has become stronger, and Olivia knows she can [36] on Emma whenever she needs support.";
const EGE={30:[['fit in','break up','take after','bring up'],'fit in'],31:[['let it down','hit it off','fell it out','got it by'],'hit it off'],32:[['loyalty','loneliness','rivalry','indifference'],'loyalty'],33:[['grew up','fell out','took after','went out'],'fell out'],34:[['made up','grew out','broke down','came into'],'made up'],35:[['argue','agree','depend','avoid'],'agree'],36:[['base','rely','lean','trust'],'rely']};

const SETS=[
 {name:'Family ties',q:['Do you have an extended or an immediate family?','How many members are there in your family?','Do you get along with all your relatives?','Who is the breadwinner in your family?','Do you take after your mother or your father?','What do you usually do together?']},
 {name:'Task 3 · Friends and family',q:['How do you usually keep in touch with your relatives?','What makes a family close-knit?','What can teenagers do when they fall out with their parents?','Is it better to have a few close friends or a wide circle of acquaintances?','What is the best way to make friends at a new school?']},
 {name:'Family vocabulary',q:['How do you usually resolve a conflict when you fall out with a family member?','Can you think of a time when you took after one of your members of the family? What was it?','In your opinion, what is the most important thing to make a family close-knit?','Have you ever been the black sheep of the family? If so, how did your family react?','How do you show your family members that you are there for them when they need help?']}];

/* Лексика «Семья»: слова, упражнения 1–3, задания в формате ЕГЭ */
const FAM=[['nuclear family','нуклеарная семья (мать, отец и дети)'],['extended family','расширенная семья (включает бабушек, дедушек, тётей, дядей и т. д.)'],['immediate family','ближайшие родственники (родители, дети, братья, сёстры)'],['single-parent family','семья с одним родителем'],['stepfamily','отчим/мачеха и их дети (сводная семья)'],['half-brother / half-sister','сводный брат/сестра (общий только один родитель)'],['adoptive parents','приёмные родители'],['guardian','опекун'],['relative','родственник'],['ancestor','предок'],['descendant','потомок'],['kin','родня, близкие родственники'],
 ['to get along with someone','ладить с кем-то','I get along well with my parents, and we have a lot in common.'],
 ['to have a strong bond','иметь крепкую связь','The siblings have a strong bond, always supporting each other.'],
 ['to fall out with someone','поссориться с кем-то','They fell out over a silly argument, but later made up.'],
 ['to be close-knit','быть сплочённым','Our family is very close-knit, and we always spend holidays together.'],
 ['to look after someone','заботиться о ком-то','She looks after her elderly parents and makes sure they are comfortable.'],
 ['to have a misunderstanding','иметь недоразумение','They had a misunderstanding, but it was cleared up after a good conversation.'],
 ['to take after someone','походить на кого-то (по характеру, внешности)','She takes after her mother in terms of personality, they’re both very kind and caring.'],
 ['to be a black sheep of the family','быть белой вороной в семье','He’s always been the black sheep of the family, doing things differently from everyone else.'],
 ['to raise a child','воспитывать ребёнка','They raised their children with strong values and always taught them the importance of kindness.'],
 ['to be there for someone','быть рядом с кем-то, поддерживать','No matter what happens, my family is always there for me when I need them.']];
const MAR_TXT='Maria comes from a large [1]. She has many cousins, uncles, and aunts, as well as her grandparents, who live nearby. Her [2] includes her parents and her younger brother. Maria’s parents got divorced a few years ago, and she now lives with her [3] in a small apartment. Her father married another woman, and she has a [4] from this marriage. His name is Jake, and they get along very well. Maria’s mother, however, is an [5] to her because she has taken care of her since Maria was a baby. Her father’s [6] lives in a different city, and Maria doesn’t see them very often.';
const MAR_OPT=['nuclear family','immediate family','single-parent family','stepfamily','adoptive parents','extended family'];
const MAR_KEY={1:6,2:2,3:3,4:4,5:5,6:1};
const MIST=[['His half-brother is very close to him, and they often spend weekends together.',null],['Her adoptive parents raised her in a loving environment after she was abandoned.',null],['The guardian of the children decided to send them to a new school.','The parent of the children decided to send them to a new school.','guardian — опекун, а не родитель.'],['She has a small extended family, consisting of her mother and father only.','She has a small nuclear family, consisting only of her mother and father.','extended family — это семья с большими родственниками.'],['Our family is not a nuclear family because we have many cousins living with us.','Our family is not an extended family because we don’t have many cousins living with us.','nuclear family — это семья, состоящая из родителей и детей.']];
const PAIRS=[['to be close-knit','Иметь крепкие отношения и всегда поддерживать друг друга.'],['to fall out with','Поссориться с кем-то и прекратить общение на некоторое время.'],['to take after someone','Быть похожим на кого-то из семьи, обычно по характеру или внешности.'],['to have a misunderstanding','Иметь недоразумение, неправильно понять что-то.'],['to raise a child','Заботиться о ребёнке и обучать его жизни.'],['to be the black sheep of the family','Быть тем, кто отличается от остальных членов семьи, часто ведёт себя иначе.']];
const SAR_TXT='Sarah has always had a very supportive family. She gets along well with her parents and they have a very [1] relationship. She is especially close to her brother, and they [2] each other through thick and thin. They even look after their grandmother together when she’s not feeling well. Recently, however, Sarah and her cousin had a small [3] about a family event. They disagreed on where to hold it, but after talking it through, they were able to [4] and move on. Sarah sometimes feels like the [5] of the family because she chooses a different career path than her parents and siblings, but they always support her no matter what. She’s glad her parents [6] her with love and care, raising her with strong values. She knows that no matter what happens, her family will always [7] her, and that means a lot to her.';
const SAR={1:[['close-knit','black sheep','strong bond','misunderstanding'],3],2:[['take after','be there for','fall out with','raise a child'],2],3:[['be there for','misunderstanding','look after','get along with'],2],4:[['take after','have a strong bond','make up','raise a child'],3],5:[['nuclear family','black sheep','relative','ancestor'],2],6:[['raise a child','look after','take after','adoptive parents'],2],7:[['make up','get along with','be there for','raise a child'],3]};


const S={left:'cards',right:'predict',c:{i:0,order:null,shuf:false,flip:false},
  ch:{i:0,pick:null,score:0,errs:[],done:false,ord:null},
  sp:{set:0,q:0,flip:false},eg:{ans:{},open:null},
  f:{i:0,order:null,shuf:false,flip:false},mi:{i:0,done:[],pick:null},ma:{sel:null,ok:{},err:0,ord:null},mar:{cur:1,a:{},chk:false},sar:{cur:1,a:{},chk:false}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- озвучка вопросов ---------- */
let voice=null;
function pickVoice(){const v=(window.speechSynthesis&&speechSynthesis.getVoices())||[];voice=v.find(x=>/en-GB/i.test(x.lang)&&/Google|Natural|Sonia|Libby|Ryan/i.test(x.name))||v.find(x=>/en-GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
function say(text,done,fail){if(!window.speechSynthesis){fail&&fail();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);if(voice)u.voice=voice;u.lang=voice?voice.lang:'en-GB';u.rate=.95;u.onend=()=>done&&done();u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')fail&&fail();};speechSynthesis.speak(u);}
function stopSay(){try{window.speechSynthesis&&speechSynthesis.cancel();}catch(e){}}

function seg(items,cur,onPick){const s=el('div','seg');items.forEach(([v,l])=>{const b=el('button','segb'+(v===cur?' on':''),l);b.type='button';b.onclick=()=>onPick(v);s.append(b);});return s;}
function overlay(title,html){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}

/* ---------- раскладка ---------- */
let PL,PR,cleanR=null;
function layout(){main.innerHTML='';const ws=el('div','ws');PL=el('section','wpane pl');PR=el('section','wpane pr');ws.append(PL,PR);main.append(ws);
  const hb=document.querySelector('.bar');const g=el('div','hbtns');g.append(btn('Учителю',teacher,'acc sm'));hb.append(g);
  drawLeft();drawRight();}

/* ---------- слева: карточки и выбор слова ---------- */
function drawLeft(){PL.innerHTML='';
  PL.append(seg([['cards','Cards'],['fam','Family words'],['choose','Choose'],['mist','Mistakes'],['match','Match']],S.left,v=>{S.left=v;drawLeft();}));
  const body=el('div','pbody');PL.append(body);
  if(S.left==='cards')cards(body,S.c,CARDS,k=>k<12?'Collocation':'Phrasal verb');
  else if(S.left==='fam')cards(body,S.f,FAM,k=>k<12?'Family':'Relationship');
  else if(S.left==='choose')choose(body);else if(S.left==='mist')mistake(body);else match(body);}
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

function choose(box){const st=S.ch,n=CH.length;const wrap=el('div','chq');box.append(wrap);
  if(st.done){const e=el('div','end');e.append(el('div','score',st.score+' / '+n));
    if(st.errs.length){e.append(el('div','tag','Mistakes'));const ul=el('ul','errs');st.errs.forEach(i=>ul.append(el('li',null,esc(CH[i][1]).replace('______','<b>'+esc(CH[i][3])+'</b>'))));e.append(ul);}
    else e.append(el('div','fb','No mistakes.'));
    e.append(btn('Play again',()=>{S.ch={i:0,pick:null,score:0,errs:[],done:false,ord:shuffle([...Array(n).keys()])};drawLeft();},'main'));wrap.append(e);return;}
  if(!st.ord)st.ord=[...Array(n).keys()];
  const k=st.ord[st.i],it=CH[k],opts=st.opts&&st.optsFor===k?st.opts:(st.opts=shuffle(it[2]),st.optsFor=k,st.opts);
  const meta=el('div','meta');const bar=el('div','qzbar');bar.innerHTML='<i style="width:'+(st.i/n*100)+'%"></i>';meta.append(el('span',null,(st.i+1)+' / '+n),bar,el('span',null,'Score '+st.score));wrap.append(meta);
  wrap.append(el('div','tag',esc(it[0])),el('div','qtxt',esc(it[1])));
  const og=el('div','opts');opts.forEach(o=>{const b=el('button',null,esc(o));b.type='button';b.disabled=st.pick!==null;
    if(st.pick!==null){if(o===it[3])b.classList.add('ok');else if(o===st.pick)b.classList.add('no');}
    b.onclick=()=>{st.pick=o;if(o===it[3])st.score++;else st.errs.push(k);drawLeft();};og.append(b);});wrap.append(og);
  const fb=el('div','fb',st.pick===null?'':(st.pick===it[3]?'Correct.':'The answer is: '+esc(it[3])+'.'));
  const nx=btn(st.i===n-1?'See result':'Next question',()=>{if(st.i===n-1){st.done=true;}else{st.i++;}st.pick=null;drawLeft();},'main sm');nx.disabled=st.pick===null;
  const foot=el('div','foot');foot.append(fb,nx);wrap.append(foot);}

/* ---------- справа: прогноз → устная часть → ЕГЭ 30–36 ---------- */
function drawRight(){if(cleanR){cleanR();cleanR=null;}PR.innerHTML='';
  PR.append(seg([['predict','1 · Predict'],['speak','2 · Speaking'],['ege','3 · Olivia'],['maria','4 · Maria'],['sarah','5 · Sarah']],S.right,v=>{S.right=v;drawRight();}));
  const body=el('div','pbody');PR.append(body);
  if(S.right==='predict')predict(body);else if(S.right==='speak')speak(body);else if(S.right==='ege')ege(body);
  else if(S.right==='maria')gapPanel(body,MAR_TXT,()=>MAR_OPT,MAR_KEY,S.mar,'Task 1. Maria.','Choose the correct word for each gap. One word is used once.',true);
  else gapPanel(body,SAR_TXT,c=>SAR[c][0],Object.fromEntries(Object.keys(SAR).map(n=>[n,SAR[n][1]])),S.sar,'Lexis and grammar 30–36. Sarah.','Choose the best option for each gap.',false);}

function predict(box){box.append(el('div','inst','<b>Look at the photos and predict.</b>'));
  const g=el('div','pic3');for(let i=1;i<=3;i++){const f=el('figure');const img=new Image();const ex=['jpg','png','webp'];let x=0;img.alt='Photo '+i;
    const ph=()=>{const d=el('div','ph','Photo '+i);img.replaceWith(d);};
    img.onerror=()=>{x++;if(x<ex.length)img.src='img/family-'+i+'.'+ex[x];else ph();};img.src='img/family-'+i+'.'+ex[0];f.append(img);g.append(f);}
  box.append(g);
  box.append(el('ol','pq','<li>Who are these people? What is the relationship between them?</li><li>What do you think today’s topic is?</li><li>What problems can people like these have with each other?</li><li>Which words from the cards could you hear?</li>'));
  box.append(btn('Next: Speaking →',()=>{S.right='speak';drawRight();},'main sm'));}

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

function ege(box){const st=S.eg;box.append(el('div','inst','<b>Read the text and choose the best word for each gap (30–36).</b>'));
  const w=el('div','egew');let open=null;
  const parts=EGE_TXT.split(/\[(\d+)\]/);
  parts.forEach((p,i)=>{if(i%2===0){w.append(document.createTextNode(p));return;}
    const n=+p,ans=EGE[n][1],cur=st.ans[n];
    const g=el('span','gap'+(cur?(cur===ans?' ok':' no'):''),cur?esc(cur):String(n));
    g.onclick=e=>{e.stopPropagation();st.open=st.open===n?null:n;drawRight();};
    if(st.open===n){const pop=el('div','gpop');EGE[n][0].forEach(o=>{const b=el('button',null,esc(o));b.type='button';b.onclick=ev=>{ev.stopPropagation();st.ans[n]=o;st.open=null;drawRight();};pop.append(b);});g.append(pop);}
    w.append(g);});
  box.append(w);
  const ok=Object.keys(EGE).filter(n=>st.ans[n]===EGE[n][1]).length;
  const bar=el('div','fbar');bar.append(el('b',null,ok+' / 7'),btn('Show answers',()=>{Object.keys(EGE).forEach(n=>st.ans[n]=EGE[n][1]);st.open=null;drawRight();},'sm'),btn('Reset',()=>{st.ans={};st.open=null;drawRight();},'sm'));box.append(bar);
  const close=()=>{if(st.open!==null){st.open=null;drawRight();}};document.addEventListener('click',close);cleanR=()=>document.removeEventListener('click',close);}

/* ---------- лист «Семья»: найди ошибку, соедини, текст с пропусками ---------- */
function mistake(box){const st=S.mi,n=MIST.length,wrap=el('div','chq');box.append(wrap);
  if(st.i>=n){const ok=st.done.filter(x=>x).length;wrap.append(el('div','end','<div class="score">'+ok+' / '+n+'</div>'));wrap.append(btn('Play again',()=>{S.mi={i:0,done:[],pick:null};drawLeft();},'main'));return;}
  const it=MIST[st.i],bad=!!it[1];
  const meta=el('div','meta');const b0=el('div','qzbar');b0.innerHTML='<i style="width:'+(st.i/n*100)+'%"></i>';meta.append(el('span',null,(st.i+1)+' / '+n),b0);wrap.append(meta);
  wrap.append(el('div','tag','Find the mistake'),el('div','qtxt',esc(it[0])));
  const og=el('div','opts');[['ok','Correct sentence'],['bad','There is a mistake']].forEach(([v,l])=>{const b=el('button',null,l);b.type='button';b.disabled=st.pick!==null;
    if(st.pick!==null){if(v===(bad?'bad':'ok'))b.classList.add('ok');else if(st.pick===v)b.classList.add('no');}
    b.onclick=()=>{st.pick=v;st.done[st.i]=(v==='bad')===bad;drawLeft();};og.append(b);});wrap.append(og);
  let fb='';if(st.pick!==null)fb=bad?'<b>'+esc(it[1])+'</b><br><span style="color:#586380">'+esc(it[2])+'</span>':'This sentence is correct.';
  wrap.append(el('div','fb',fb));wrap.lastChild.style.cssText='min-height:60px;font-size:15px;flex:none';
  const nx=btn(st.i===n-1?'See result':'Next sentence',()=>{st.i++;st.pick=null;drawLeft();},'main sm');nx.disabled=st.pick===null;wrap.append(nx);}

function match(box){const st=S.ma,n=PAIRS.length;if(!st.ord)st.ord=shuffle([...Array(n).keys()]);
  const top=el('div','fbar'),done=Object.keys(st.ok).length;
  top.append(el('b',null,'Match the expressions with their meanings.'),el('span','bl',(done===n?'Done · ':'')+done+' / '+n+' · mistakes '+st.err),btn('Again',()=>{S.ma={sel:null,ok:{},err:0,ord:null};drawLeft();},'sm'));box.append(top);
  const g=el('div','mt'),L=el('div','col'),R=el('div','col');
  PAIRS.forEach((p,i)=>{const b=el('button',st.ok[i]?'ok':(st.sel===i?'sel':''),esc(p[0]));b.type='button';b.disabled=!!st.ok[i];b.onclick=()=>{st.sel=i;drawLeft();};L.append(b);});
  st.ord.forEach(i=>{const b=el('button',st.ok[i]?'ok':'',esc(PAIRS[i][1]));b.type='button';b.disabled=!!st.ok[i];
    b.onclick=()=>{if(st.sel===null)return;if(st.sel===i){st.ok[i]=true;st.sel=null;}else{st.err++;b.classList.add('no');setTimeout(()=>drawLeft(),450);st.sel=null;return;}drawLeft();};R.append(b);});
  g.append(L,R);box.append(g);}

/* текст с пропусками, справа варианты (Maria, Sarah) */
function gapPanel(box,txt,optsOf,keys,st,title,inst,uniq){box.append(el('div','inst','<b>'+title+'</b> '+inst));
  const rd=el('div','rd');rd.style.cssText='display:grid;grid-template-columns:1fr 235px;gap:10px;align-items:start';box.append(rd);
  const tx=el('div','rtext');tx.style.cssText='border:1px solid #e3e8f2;border-radius:10px;background:#fbfcfe;padding:8px 12px;font-size:15.5px;line-height:1.62;max-height:calc(100vh - 215px);overflow:auto';
  txt.split(/\[(\d+)\]/).forEach((p,i)=>{if(i%2===0){tx.append(document.createTextNode(p));return;}
    const id=+p,cur=st.a[id];let c='gap'+(cur!==undefined&&st.chk?(cur===keys[id]?' ok':' no'):'');const g=el('span',c,cur!==undefined?id+' · '+esc(optsOf(id)[cur-1]):String(id));
    if(st.cur===id)g.style.outline='3px solid #2855d9';g.onclick=()=>{st.cur=id;drawRight();};tx.append(g);});
  const op=el('div');op.style.cssText='display:flex;flex-direction:column;gap:5px;max-height:calc(100vh - 215px);overflow:auto';op.append(el('div','tag','Gap '+st.cur));
  optsOf(st.cur).forEach((o,k)=>{const n=k+1,used=uniq&&Object.entries(st.a).some(([x,v])=>v===n&&+x!==st.cur);const b=el('button',null,n+'. '+esc(o));b.type='button';
    b.style.cssText='text-align:left;padding:6px 10px;border:2px solid '+(st.a[st.cur]===n?'#6f8fd8':'#c9d3e6')+';background:'+(st.a[st.cur]===n?'#dbe6fb':'#f8faff')+';border-radius:10px;font-weight:600;font-size:15px;'+(used?'opacity:.45':'');
    b.onclick=()=>{if(st.chk)return;st.a[st.cur]=n;const ids=Object.keys(keys).map(Number),next=ids.find(x=>st.a[x]===undefined);if(next!==undefined)st.cur=next;drawRight();};op.append(b);});
  rd.append(tx,op);
  const ids=Object.keys(keys).map(Number),ok=ids.filter(x=>st.a[x]===keys[x]).length;
  const bar=el('div','fbar');bar.append(btn('Check',()=>{st.chk=true;drawRight();},'main sm'),btn('Show answers',()=>{ids.forEach(x=>st.a[x]=keys[x]);st.chk=true;drawRight();},'sm'),btn('Reset',()=>{st.a={};st.chk=false;st.cur=1;drawRight();},'sm'),el('b',null,st.chk?ok+' / '+ids.length:''));box.append(bar);}

/* ---------- заметки учителя ---------- */
function teacher(){overlay('Учителю · урок Family',
'<p><b>Порядок на уроке (около 60 минут).</b></p><ol>'+
'<li><b>Predict</b> (3–4 мин): фото, ученица предполагает тему и слова.</li>'+
'<li><b>Speaking</b> (10 мин): warm-up, «Family ties», затем «Task 3». Вопрос только звучит, текст на обороте карточки.</li>'+
'<li><b>Cards</b> (10 мин): 12 коллокаций и 12 phrasal verbs, по одной карточке. Сначала ученица пытается вспомнить значение сама.</li>'+
'<li><b>Choose the word</b> (10 мин): 16 вопросов, по одному на экране. Ошибки разберите в конце.</li>'+
'<li><b>EGE 30–36</b> (10 мин): сплошной текст, пропуск открывается нажатием.</li>'+
'<li>Домашку («Translate &amp; tense», письмо 37 и 38, Speaking 3) открывайте на сайте Кати, когда скажете «выполнить».</li></ol>'+
'<p><b>Промпты для фото</b> (положить в папку img как family-1, family-2, family-3 с расширением jpg, png или webp):</p><ol>'+
'<li>Candid photo of a modern three-generation family having Sunday lunch at a big table at home, grandmother, parents, two teenagers, natural light, realistic photograph, no text</li>'+
'<li>Two teenage girls laughing together on a school staircase, one showing something on her phone, contemporary clothes, realistic candid photograph, natural light</li>'+
'<li>Two young adult friends on a city bench in the evening, one comforting the other after an argument, soft light, realistic photograph, no text</li></ol>'+
'<p><b>На что обратить внимание: phrasal verbs с карточек.</b></p>'+
'<table class="ptab"><tr><th>Глагол</th><th>Схема</th><th>Формы</th></tr>'+
'<tr><td>take after sb</td><td>с объектом, не разделяется</td><td>take – took</td></tr>'+
'<tr><td>grow up</td><td>без объекта</td><td>grow – grew</td></tr>'+
'<tr><td>bring up sb</td><td>разделяется: bring a child up, bring him up</td><td>bring – brought</td></tr>'+
'<tr><td>get along with sb</td><td>три части, не разделяется</td><td>get – got</td></tr>'+
'<tr><td>fall out with sb</td><td>без объекта, with + человек</td><td>fall – fell</td></tr>'+
'<tr><td>make up with sb</td><td>без объекта, with + человек</td><td>make – made</td></tr>'+
'<tr><td>drift apart</td><td>без объекта</td><td>regular</td></tr>'+
'<tr><td>fit in</td><td>без объекта (fit in with sb)</td><td>fit – fit(ted)</td></tr>'+
'<tr><td>let down sb</td><td>разделяется: let her down</td><td>let – let</td></tr>'+
'<tr><td>hit it off</td><td>устойчивое, with sb</td><td>hit – hit</td></tr>'+
'<tr><td>go out with sb</td><td>не разделяется</td><td>go – went</td></tr>'+
'<tr><td>break up (with sb)</td><td>без объекта</td><td>break – broke</td></tr></table>'+
'<p>Типичные ловушки: grow up (сам вырос) и bring up (воспитали); take after (характер, внешность, как у родственника) и look like (только внешность). В тексте 30–36 все глаголы стоят в Past Simple, обратите внимание на формы fell и made.</p>'+
'<p><b>Лист «Семья».</b> Добавлено: карточки «Family words» (12 слов о семье и 10 выражений с примерами), «Find the mistake» (упражнение 2), «Match» (упражнение 3), текст «Maria» (упражнение 1), устный набор «Family vocabulary» (5 вопросов) и текст «Sarah» (30–36). Ключи — с листа.</p><p>Замечания к ключам листа: в упражнении 1 пункты 4–6 неудобны (например, «an … to her» при ответе во множественном числе). В упражнении 2 пятое предложение логически верное, а в ключе его «исправляют» наоборот. В Sarah пункт 6 ответ look after, но raise a child тоже подходит по смыслу. Проверь и скажи, если надо поменять.</p><p><b>Озвучка вопросов.</b> Сейчас используется голос браузера; если он звучит неестественно, можно читать вопросы самой: на обороте карточки текст и таймер.</p>');}

layout();
