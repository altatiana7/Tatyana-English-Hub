/* Reach Higher · Unit 1 · five missions, five game mechanics.
   0 Bomb (family words, typed) · 1 Jeopardy (Sharenting text, typed) · 2 Millionaire (tenses)
   3 Floor is Lava (noun definitions, typed) · 4 Boss Battle (articles + the rule).
   Nothing is saved: every mission opens clean. */
(function(){
'use strict';
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nz=s=>String(s||'').toLowerCase().replace(/[’‘`´]/g,"'").replace(/[-–—]/g,' ').replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const digits=s=>String(s||'').replace(/\D/g,'');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- content ---------- */
const BOMB=[
 ['A','your mother’s or father’s sister',['aunt']],
 ['U','your aunt’s husband',['uncle']],
 ['C','your uncle’s son or daughter',['cousin']],
 ['N','your brother’s daughter',['niece']],
 ['N','your sister’s son',['nephew']],
 ['W','the woman a man is married to',['wife']],
 ['S','a brother or a sister, in one word',['sibling']],
 ['T','one of two children born at the same time',['twin']],
 ['R','any member of your family',['relative']],
 ['G','your daughter’s son',['grandson']],
 ['S','your mother’s new husband',['stepfather','step father','stepdad']],
 ['M','your wife’s or husband’s mother',['mother-in-law']],
 ['B','your sister’s husband',['brother-in-law']],
 ['D','your son’s wife',['daughter-in-law']],
 ['H','a brother who shares only one parent with you',['half-brother']],
 ['O','a child with no brothers or sisters: an … child',['only','only child']]
];
const JCATS=['Numbers','Who and where','Details','Words'];
/* [category, value, clue, shown answer, test] — test: 'd:1000' digits, or list of keyword groups (any group, all words in it) */
const JEO=[
 [0,100,'How many photos do parents in the UK post of a child before the fifth birthday?','About 1,000',{d:['1000'],w:[['thousand']]}],
 [0,200,'How old is the boy who is legally forcing his mother to stop sharing images of him?','16',{d:['16'],w:[['sixteen']]}],
 [0,300,'How many euros does that boy want his mother to pay if she doesn’t stop?','€10,000',{d:['10000'],w:[['ten','thousand']]}],
 [0,400,'How many euros may parents in France have to pay for posting photos of their children without permission?','€45,000',{d:['45000'],w:[['forty','five','thousand']]}],
 [1,100,'Who is filming the teenage boy with the guitar?','His mother',{w:[['mother'],['mum'],['mom']]}],
 [1,200,'In which country do parents post about 1,000 photos of each child?','The UK',{w:[['uk'],['united','kingdom'],['britain'],['u k']]}],
 [1,300,'Which university studied what 10- to 17-year-olds think about their photos?','The University of Michigan',{w:[['michigan']]}],
 [1,400,'In which country can parents pay €45,000 for posting photos without permission?','France',{w:[['france']]}],
 [2,100,'Why is the toddler shouting?','He doesn’t want to eat his lunch.',{w:[['lunch'],['eat']]}],
 [2,200,'What is the teenage boy doing when his mother films him?','Playing a new song on his guitar',{w:[['guitar'],['song']]}],
 [2,300,'How long after the filming does the boy discover that people are watching the video?','Two days later',{w:[['two'],['2']]}],
 [2,400,'From what age should children be asked before their photos are posted, according to the University of Michigan?','Over ten',{d:['10'],w:[['ten']]}],
 [3,100,'The word in the text for a very young child who is learning to walk','toddler',{w:[['toddler']]}],
 [3,200,'The name of the phenomenon: parents sharing a lot of photos of their children online','sharenting',{w:[['sharenting']]}],
 [3,300,'Which two words make the word “sharenting”?','share + parenting',{w:[['shar','parent']]}],
 [3,400,'The word in the text for teenagers that comes from the same family as “adolescence”','adolescents',{w:[['adolescent']]}]
];
const JDOUBLE=11; /* this clue is worth double */
const LADDER=['£100','£200','£300','£500','£1,000','£2,000','£4,000','£8,000','£16,000','£32,000','£64,000','£125,000','£250,000','£500,000','£1 MILLION'];
/* [question, [correct, wrong, wrong, wrong], why, hint] */
const MIL=[
 ['Listen! Someone ___ at the door.',['is knocking','knocks','knock','are knocking'],'“Listen!” means it is happening now: Present Continuous.','Look at the first word.'],
 ['My dad ___ to work by bus every day.',['goes','is going','go','going'],'“Every day” is a routine: Present Simple, with -es after he.','Every day = a routine.'],
 ['Be quiet, please. The baby ___.',['is sleeping','sleeps','sleep','are sleeping'],'It is happening at this moment: Present Continuous.','Why must we be quiet right now?'],
 ['Water ___ at 100 degrees Celsius.',['boils','is boiling','boil','boiling'],'A fact that is always true: Present Simple.','Is it true only today, or always?'],
 ['Now I ___ what you mean.',['understand','am understanding','understands','understanding'],'Understand is a state verb. State verbs do not take the continuous form, even with “now”.','Is “understand” an action you can watch?'],
 ['My cousin lives in Madrid, but this month she ___ with us.',['is staying','stays','stay','staying'],'A temporary situation (“this month”): Present Continuous.','This month only.'],
 ['___ your brother ___ football on Saturdays?',['Does … play','Is … playing','Do … play','Does … plays'],'A routine question with he: Does + base form.','On Saturdays = every Saturday.'],
 ['This soup ___ delicious. What’s in it?',['tastes','is tasting','taste','tasting'],'Taste, when it describes the food, is a state verb: Present Simple.','The soup is not doing anything.'],
 ['Why ___ you ___ at me like that? Is there something on my face?',['are … looking','do … look','is … looking','does … look'],'It is happening right now, and “look at” is an action: Present Continuous.','It is happening while they speak.'],
 ['She ___ three brothers and a sister.',['has','is having','have','having'],'Have for possession or family is a state verb: Present Simple.','Possession, not an activity.'],
 ['We can’t talk now. We ___ dinner.',['are having','have','has','having'],'Have dinner is an action, so it can be continuous: it is happening now.','Here “have” means “eat”.'],
 ['I ___ about buying a new phone, but I ___ the price is too high.',['am thinking … think','think … am thinking','am thinking … am thinking','think … think'],'Think about = consider (an action, continuous). Think = believe (a state, simple).','One “think” is a plan in progress, the other is an opinion.'],
 ['More and more parents ___ photos of their children online these days.',['are posting','post','posts','is posting'],'A changing situation (“more and more”, “these days”): Present Continuous.','More and more … these days.'],
 ['He ___ always ___ my things without asking! It’s so annoying.',['is … taking','does … take','is … take','do … taking'],'Always + Present Continuous shows an annoying habit.','The speaker is annoyed.'],
 ['Which sentence is correct?',['She doesn’t believe him because he is always lying.','She isn’t believing him because he always lies.','She don’t believe him because he is lying always.','She isn’t believing him because he is always lie.'],'Believe is a state verb (simple). “Is always lying” is an annoying habit.','Check “believe” first.']
];
/* [definition, noun, base word] */
const LAVA=[
 ['an angry disagreement','argument','argue'],
 ['the feeling that you can do things well','confidence','confident'],
 ['the time in life between being a child and an adult','adolescence','adolescent'],
 ['the answer to a problem','solution','solve'],
 ['the ability to make decisions without other people’s control','independence','independent'],
 ['words that make something clear and easy to understand','explanation','explain'],
 ['the feeling you get when you like doing something','enjoyment','enjoy'],
 ['when something gets better','improvement','improve'],
 ['the feeling when your face goes red in front of other people','embarrassment','embarrass'],
 ['something important that you succeed in doing after a lot of work','achievement','achieve'],
 ['when someone allows you to do something','permission','permit'],
 ['a choice you make after thinking carefully','decision','decide'],
 ['the way two people or things are linked','connection','connect'],
 ['the ability to wait calmly without getting angry','patience','patient'],
 ['the way in which two things are not the same','difference','different']
];
const RULES=['A general idea','Specific, or mentioned before','First mention: one of many','Unique: there is only one','A job'];
const ARTS=['a','an','the','no article'];
/* [before, after, article index, rule index] */
const BOSS=[
 ['My mum is','doctor.',0,4],
 ['','teenagers need a lot of sleep.',3,0],
 ['I’ve got','unusual hobby.',1,2],
 ['We watched a film last night.','film was about a famous family.',2,1],
 ['','sun rises in the east.',2,3],
 ['','arguments are normal in every family.',3,0],
 ['','arguments I have with my parents are about my bedroom.',2,1],
 ['Her brother wants to be','engineer.',1,4],
 ['He’s','headmaster at my school.',2,3],
 ['I’m in','difficult situation.',0,2],
 ['I love','music. It helps me relax.',3,0],
 ['Can you pass me','phone on the table?',2,1],
 ['','President of France lives in Paris.',2,3],
 ['It was','honest answer.',1,2]
];

/* ---------- engine ---------- */
let root=null,kind=-1,g=null,timer=0;
function stop(){clearInterval(timer);timer=0}
function mount(el){stop();if(!el){root=null;return}
 root=el;kind=+el.dataset.game;el.className='rh rh'+kind;
 el.addEventListener('click',onClick);el.addEventListener('submit',onSubmit);el.addEventListener('input',onInput);
 el.addEventListener('keydown',e=>e.stopPropagation());
 start()}
function start(){stop();g=GAMES[kind].init();draw()}
function draw(){if(!root||!root.isConnected){stop();return}root.innerHTML=GAMES[kind].view();const a=root.querySelector('[data-auto]');if(a)a.focus()}
function onClick(e){e.stopPropagation();const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
 if(d.again!==undefined)return start();
 GAMES[kind].click&&GAMES[kind].click(d,b)}
function onSubmit(e){e.preventDefault();e.stopPropagation();const inp=e.target.querySelector('input');GAMES[kind].submit&&GAMES[kind].submit(inp?inp.value:'')}
function onInput(e){e.stopPropagation();GAMES[kind].typing&&GAMES[kind].typing()}
function review(rows){return rows.length?`<div class="rhReview"><b>Look again</b><ol>${rows.map(r=>`<li><span>${esc(r[0])}</span><em>${esc(r[1])}</em>${r[2]?`<small>${esc(r[2])}</small>`:''}</li>`).join('')}</ol></div>`:'<p class="rhClean">No mistakes to review.</p>'}
function endCard(tag,title,line,rows){return `<div class="rhEnd"><div class="rhEndTop"><span class="rhTag">${esc(tag)}</span><h3>${esc(title)}</h3><p>${esc(line)}</p><button class="rhMain" data-again>Play again</button></div>${review(rows)}</div>`}
const dots=(n,i,res)=>`<div class="rhDots">${Array.from({length:n},(_,k)=>`<i class="${res[k]===true?'ok':res[k]===false?'no':k===i?'cur':''}"></i>`).join('')}</div>`;

const GAMES=[
/* 0 · BOMB */
{init(){return {i:0,left:70,max:90,res:[],miss:[],fb:null,run:false,over:null}},
 tick(){timer=setInterval(()=>{if(!g.run||g.fb||g.over)return;g.left-=.25;if(g.left<=0){g.left=0;g.over='boom';stop();return draw()}this.paint()},250)},
 paint(){const f=root.querySelector('.fuse u'),n=root.querySelector('.bombN');if(f)f.style.width=Math.max(0,g.left/g.max*100)+'%';if(n)n.textContent=Math.ceil(g.left);const b=root.querySelector('.bomb');if(b)b.classList.toggle('hot',g.left<=15)},
 typing(){if(!g.run&&!g.over){g.run=true;this.tick()}},
 view(){if(g.over){const ok=g.res.filter(x=>x).length;const rest=g.over==='boom'?BOMB.slice(g.res[g.i]!=null?g.i+1:g.i).map(w=>[w[0]+' · '+w[1],w[2][0],'not reached']):[];
   return endCard('Bomb',g.over==='boom'?'Boom. The fuse ran out.':'Defused with '+Math.ceil(g.left)+' seconds left.',ok+' of '+BOMB.length+' family words correct.',g.miss.concat(rest))}
  const w=BOMB[g.i];
  return `<div class="bombGrid"><div class="bomb ${g.left<=15?'hot':''}"><div class="bombBall"><b class="bombN">${Math.ceil(g.left)}</b><span>seconds</span></div><div class="fuse"><u style="width:${g.left/g.max*100}%"></u></div><p>${g.run?'Right answer: +5 seconds. Wrong answer or pass: −6.':'The fuse lights when you type the first letter.'}</p></div>
  <div class="rhPlay"><div class="rhHead"><span class="rhTag">Family word ${g.i+1} of ${BOMB.length}</span>${dots(BOMB.length,g.i,g.res)}</div>
   <div class="bombClue"><b class="letter">${w[0]}</b><p>${esc(w[1])}</p></div>
   ${g.fb?`<div class="rhFb no"><b>The word is ${esc(w[2][0])}.</b><span>−6 seconds. The fuse is paused.</span></div><button class="rhMain" data-next data-auto>Next word</button>`
   :`<form class="rhForm"><input data-auto autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Starts with ${w[0]}" aria-label="Family word"><button class="rhMain">Defuse</button><button type="button" class="rhGhost" data-pass>Pass</button></form>`}
  </div></div>`},
 wrong(v){const w=BOMB[g.i];g.res[g.i]=false;g.miss.push([w[0]+' · '+w[1],w[2][0],v?'you typed: '+v:'passed']);g.left=Math.max(0,g.left-6);g.fb=true;if(g.left<=0){g.over='boom';stop()}draw()},
 next(){g.fb=null;g.i++;if(g.i>=BOMB.length){g.over='safe';stop()}draw()},
 submit(v){if(g.fb||g.over||!v.trim())return;this.typing();const w=BOMB[g.i];if(w[2].some(a=>nz(a)===nz(v))){g.res[g.i]=true;g.left=Math.min(g.max,g.left+5);this.next()}else this.wrong(v.trim())},
 click(d){if(d.pass!==undefined){this.typing();return this.wrong('')}if(d.next!==undefined)return this.next()}},

/* 1 · JEOPARDY */
{init(){return {open:null,st:{},score:0,ans:null}},
 val(i){return JEO[i][1]*(i===JDOUBLE?2:1)},
 view(){const n=Object.keys(g.st).length;
  if(g.open==null&&n===JEO.length){const miss=JEO.map((c,i)=>g.st[i]===false?[c[2],c[3]]:null).filter(Boolean);return endCard('Jeopardy','Final score: '+g.score+' points','Best possible score: '+JEO.reduce((a,_,i)=>a+this.val(i),0)+'. '+(JEO.length-miss.length)+' of '+JEO.length+' clues correct.',miss)}
  if(g.open!=null){const c=JEO[g.open],v=this.val(g.open),a=g.ans;
   return `<div class="jeoClue"><div class="rhHead"><span class="rhTag">${esc(JCATS[c[0]])} · ${v} points${g.open===JDOUBLE?' · double clue':''}</span><b class="rhScore">${g.score} points</b></div>
    <p class="jeoQ">${esc(c[2])}</p>
    ${a?`<div class="rhFb ${a.ok?'ok':'no'}"><b>${a.ok?'Correct: +'+v:'Not this time: −'+v}</b><span>Answer: ${esc(c[3])}${a.v?' · You typed: '+esc(a.v):''}</span></div><div class="rhRow"><button class="rhMain" data-back data-auto>Back to the board</button><button class="rhGhost" data-flip>Teacher: count it as ${a.ok?'wrong':'correct'}</button></div>`
    :`<form class="rhForm"><input data-auto autocomplete="off" spellcheck="false" placeholder="Type your answer" aria-label="Answer"><button class="rhMain">Answer</button><button type="button" class="rhGhost" data-giveup>I don’t know</button></form><p class="rhNote">From memory. The text stays closed.</p>`}</div>`}
  return `<div class="jeo"><div class="rhHead"><span class="rhTag">Sharenting · Student’s Book p7 · from memory</span><b class="rhScore">${g.score} points · ${n} of ${JEO.length}</b></div>
   <div class="jeoBoard">${JCATS.map((c,ci)=>`<div class="jeoCol"><b>${esc(c)}</b>${JEO.map((q,i)=>q[0]===ci?`<button data-cell="${i}" class="${g.st[i]===true?'ok':g.st[i]===false?'no':''}" ${g.st[i]!=null?'disabled':''}>${g.st[i]===true?'✓':g.st[i]===false?'✕':q[1]}</button>`:'').join('')}</div>`).join('')}</div></div>`},
 judge(v){const t=JEO[g.open][4],d=digits(v),n=nz(v);return (t.d&&t.d.includes(d)&&d!=='')||(t.w||[]).some(grp=>grp.every(k=>n.includes(k)))},
 settle(ok,v){const val=this.val(g.open);g.st[g.open]=ok;g.score+=ok?val:-val;g.ans={ok,v}},
 submit(v){if(g.open==null||g.ans||!v.trim())return;this.settle(this.judge(v),v.trim());draw()},
 click(d){if(d.cell!==undefined){g.open=+d.cell;g.ans=null;return draw()}
  if(d.giveup!==undefined){this.settle(false,'');return draw()}
  if(d.flip!==undefined){const val=this.val(g.open),was=g.ans.ok;g.score+=was?-2*val:2*val;g.ans.ok=!was;g.st[g.open]=!was;return draw()}
  if(d.back!==undefined){g.open=null;g.ans=null;return draw()}}},

/* 2 · MILLIONAIRE */
{init(){return {i:0,level:0,qs:MIL.map(q=>({q:q[0],o:shuffle(q[1]),a:q[1][0],why:q[2],hint:q[3]})),pick:null,first:null,cut:[],used:{},dbl:false,hint:false,miss:[],over:false}},
 safe(l){return l>=10?10:l>=5?5:0},
 view(){if(g.over){const won=g.level?LADDER[g.level-1]:'£0';return endCard('Millionaire','You leave with '+won+'.',(MIL.length-g.miss.length)+' of '+MIL.length+' correct. A wrong answer drops you to the last safe level.',g.miss)}
  const q=g.qs[g.i],done=g.pick!=null;
  return `<div class="milGrid"><div class="rhPlay"><div class="rhHead"><span class="rhTag">Question ${g.i+1} of ${MIL.length} · for ${LADDER[g.level]}</span>
    <span class="life"><button data-life="half" ${g.used.half||done?'disabled':''}>50:50</button><button data-life="hint" ${g.used.hint||done?'disabled':''}>Hint</button><button data-life="dbl" ${g.used.dbl||done?'disabled':''}>Two tries</button></span></div>
   <p class="milQ">${esc(q.q)}</p>${g.hint&&!done?`<p class="rhNote">Hint: ${esc(q.hint)}</p>`:''}${g.dbl&&!done?`<p class="rhNote">Two tries are on for this question.</p>`:''}
   <div class="milOpts">${q.o.map((o,k)=>{const cls=done?(o===q.a?'ok':o===g.pick||o===g.first?'no':'dim'):(o===g.first?'no':'');return `<button data-opt="${k}" class="${cls}" ${done||g.cut.includes(k)||o===g.first?'disabled':''} ${g.cut.includes(k)?'style="visibility:hidden"':''}><i>${'ABCD'[k]}</i><span>${esc(o)}</span></button>`}).join('')}</div>
   ${done?`<div class="rhFb ${g.pick===q.a?'ok':'no'}"><b>${g.pick===q.a?'Correct.':'The answer is: '+esc(q.a)}</b><span>${esc(q.why)}</span></div><button class="rhMain" data-next data-auto>${g.i===MIL.length-1?'See what you won':'Next question'}</button>`:''}
  </div><ol class="ladder">${LADDER.map((v,k)=>`<li class="${k===g.level?'cur':k<g.level?'won':''} ${k===4||k===9||k===14?'safe':''}"><span>${k+1}</span>${v}</li>`).reverse().join('')}</ol></div>`},
 click(d){const q=g.qs[g.i];
  if(d.life){g.used[d.life]=true;if(d.life==='half'){const wrong=q.o.map((o,k)=>k).filter(k=>q.o[k]!==q.a&&q.o[k]!==g.first);g.cut=shuffle(wrong).slice(0,2)}if(d.life==='hint')g.hint=true;if(d.life==='dbl')g.dbl=true;return draw()}
  if(d.opt!==undefined){const o=q.o[+d.opt];if(o!==q.a&&g.dbl&&!g.first){g.first=o;return draw()}
   g.pick=o;if(o===q.a)g.level=Math.min(LADDER.length,g.level+1);else{g.level=this.safe(g.level);g.miss.push([q.q,q.a,q.why])}return draw()}
  if(d.next!==undefined){g.i++;g.pick=null;g.first=null;g.cut=[];g.dbl=false;g.hint=false;if(g.i>=MIL.length)g.over=true;return draw()}}},

/* 3 · FLOOR IS LAVA */
{init(){return {i:0,lava:12,res:[],miss:[],fb:null,run:false,hint:false,over:null}},
 tick(){timer=setInterval(()=>{if(!g.run||g.fb||g.over)return;g.lava+=.3;if(g.lava>=100){g.lava=100;g.over='burnt';stop();return draw()}this.paint()},250)},
 paint(){const l=root.querySelector('.lavaFill'),n=root.querySelector('.lavaN');if(l)l.style.height=g.lava+'%';if(n)n.textContent=Math.round(g.lava)+'%';const s=root.querySelector('.shaft');if(s)s.classList.toggle('hot',g.lava>=75)},
 typing(){if(!g.run&&!g.over){g.run=true;this.tick()}},
 view(){if(g.over){const ok=g.res.filter(x=>x).length;const rest=g.over==='burnt'?LAVA.slice(g.res[g.i]!=null?g.i+1:g.i).map(w=>[w[0],w[1],'not reached']):[];
   return endCard('Floor is lava',g.over==='burnt'?'The lava reached the top.':'You crossed the room. Lava at '+Math.round(g.lava)+'%.',ok+' of '+LAVA.length+' nouns correct.',g.miss.concat(rest))}
  const w=LAVA[g.i];
  return `<div class="lavaGrid"><div class="shaft ${g.lava>=75?'hot':''}"><div class="lavaFill" style="height:${g.lava}%"></div><b class="lavaN">${Math.round(g.lava)}%</b><span>lava</span></div>
  <div class="rhPlay"><div class="rhHead"><span class="rhTag">Noun ${g.i+1} of ${LAVA.length} · no word list</span>${dots(LAVA.length,g.i,g.res)}</div>
   <p class="lavaDef">${esc(w[0])}</p>
   ${g.hint&&!g.fb?`<p class="rhNote">Hint: it comes from <b>${esc(w[2])}</b> and starts with <b>${esc(w[1][0])}</b>.</p>`:''}
   ${g.fb?`<div class="rhFb no"><b>The noun is ${esc(w[1])}.</b><span>${esc(w[2])} → ${esc(w[1])}. The lava jumped up. It is paused now.</span></div><button class="rhMain" data-next data-auto>Next noun</button>`
   :`<form class="rhForm"><input data-auto autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the noun" aria-label="Noun"><button class="rhMain">Jump</button><button type="button" class="rhGhost" data-hint ${g.hint?'disabled':''}>Hint (lava +6)</button></form>
   <p class="rhNote">${g.run?'Right noun: the lava drops. Wrong spelling: it jumps up.':'The lava starts rising when you type the first letter.'}</p>`}
  </div></div>`},
 next(){g.fb=null;g.hint=false;g.i++;if(g.i>=LAVA.length){g.over='safe';stop()}draw()},
 submit(v){if(g.fb||g.over||!v.trim())return;this.typing();const w=LAVA[g.i];
  if(nz(v)===nz(w[1])){g.res[g.i]=true;g.lava=Math.max(0,g.lava-13);this.next()}
  else{g.res[g.i]=false;g.miss.push([w[0],w[1],'you typed: '+v.trim()]);g.lava=Math.min(100,g.lava+9);g.fb=true;if(g.lava>=100){g.over='burnt';stop()}draw()}},
 click(d){if(d.hint!==undefined){this.typing();g.hint=true;g.lava=Math.min(99,g.lava+6);return draw()}if(d.next!==undefined)return this.next()}},

/* 4 · BOSS BATTLE */
{init(){return {i:0,hp:110,art:null,rule:null,miss:[],hits:0,crits:0,over:false}},
 view(){if(g.over){const dead=g.hp<=0;return endCard('Boss battle',dead?'The Rule Breaker is beaten.':'The Rule Breaker survives with '+g.hp+' points.',g.hits+' articles correct, '+g.crits+' with the right rule'+(dead?'.':'. Play again and name the rule every time.'),g.miss)}
  const q=BOSS[g.i],artDone=g.art!=null,artOk=g.art===q[2],done=artDone&&(!artOk||g.rule!=null),shown=artDone?(q[2]===3?'—':ARTS[q[2]]):'___';
  let sent=(q[0]?esc(q[0])+' ':'')+`<b class="gap ${artDone?(artOk?'ok':'no'):''}">${shown}</b> `+esc(q[1]);
  return `<div class="bossGrid"><div class="boss"><span class="rhTag">The Rule Breaker</span><div class="hp"><u style="width:${Math.max(0,g.hp)/1.1}%"></u></div><b class="hpN">${Math.max(0,g.hp)} / 110</b><p>Right article: 6 damage. Name the rule too: 9. A wrong article heals it by 3.</p></div>
  <div class="rhPlay"><div class="rhHead"><span class="rhTag">Sentence ${g.i+1} of ${BOSS.length}</span></div>
   <p class="bossQ">${sent}</p>
   ${!artDone?`<div class="artRow">${ARTS.map((a,k)=>`<button data-art="${k}">${a}</button>`).join('')}</div>`
    :artOk&&g.rule==null?`<p class="rhNote">Hit: −6. Why this article? Name the rule for 3 more.</p><div class="ruleRow">${RULES.map((r,k)=>`<button data-rule="${k}">${esc(r)}</button>`).join('')}</div>`
    :`<div class="rhFb ${artOk&&g.rule===q[3]?'ok':'no'}"><b>${!artOk?'Wrong article. It heals: +3.':g.rule===q[3]?'Critical hit: −9.':'The article was right, but the rule is different.'}</b><span>Rule: ${esc(RULES[q[3]])} → ${q[2]===3?'no article':ARTS[q[2]]}</span></div><button class="rhMain" data-next data-auto>${g.i===BOSS.length-1||g.hp<=0?'See the result':'Next sentence'}</button>`}
  </div></div>`},
 full(q){return (q[0]?q[0]+' ':'')+'___ '+q[1]},
 click(d){const q=BOSS[g.i];
  if(d.art!==undefined){g.art=+d.art;if(g.art===q[2]){g.hp-=6;g.hits++}else{g.hp=Math.min(110,g.hp+3);g.miss.push([this.full(q),q[2]===3?'no article':ARTS[q[2]],'Rule: '+RULES[q[3]]])}return draw()}
  if(d.rule!==undefined){g.rule=+d.rule;if(g.rule===q[3]){g.hp-=3;g.crits++}else g.miss.push([this.full(q),(q[2]===3?'no article':ARTS[q[2]])+' (article correct)','Rule: '+RULES[q[3]]]);return draw()}
  if(d.next!==undefined){g.i++;g.art=null;g.rule=null;if(g.i>=BOSS.length||g.hp<=0)g.over=true;return draw()}}}
];
window.RH={mount,stop,counts:[BOMB.length,JEO.length,MIL.length,LAVA.length,BOSS.length]};
})();
