const vocab=[['regret','сожалеть; жалеть','I don’t regret it.'],['intend to','намереваться','I intend to study harder this year.'],['perhaps','возможно; может быть','Perhaps I’ll take a different route.'],['a gap year','год перерыва перед дальнейшей учёбой','take a gap year'],['further','дальше; дальнейший','study further'],['struggle with','испытывать трудности с','struggle with a language'],['make a resolution','принять решение / дать себе обещание','make a resolution to change'],['get into the habit of','выработать привычку','get into the habit of waking up early'],['habit','привычка','a good habit'],['brave','смелый','a brave decision'],['courage','смелость; мужество','have the courage to try'],['take the chance','воспользоваться шансом','take the chance to try something new'],['keep an open mind','оставаться открытым к новым идеям','keep an open mind'],['be prepared to change','быть готовым изменить план','be prepared to change'],['life-changing','меняющий жизнь','a life-changing experience'],['do well','преуспевать; хорошо справляться','do well in exams'],['change your ways','изменить привычное поведение','change your ways']];
let vi=0;const quiz=document.getElementById('quizcard');function renderV(){const v=vocab[vi];document.getElementById('vfront').textContent=v[0];document.getElementById('vback').textContent=v[1];document.getElementById('vbackword').textContent=v[0];document.getElementById('vexample').textContent=v[2];document.getElementById('vocabCount').textContent=(vi+1)+' / '+vocab.length;quiz.classList.remove('flipped')}quiz.onclick=()=>quiz.classList.toggle('flipped');document.getElementById('vprev').onclick=()=>{vi=(vi-1+vocab.length)%vocab.length;renderV()};document.getElementById('vnext').onclick=()=>{vi=(vi+1)%vocab.length;renderV()};document.getElementById('vaudio').onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(vocab[vi][0]);u.lang='en-GB';u.rate=.9;speechSynthesis.speak(u)};renderV();
const lex=[
['Ella didn’t ______ joining the school drama club because it helped her make new friends.',['regret','intend','struggle','explore']],
['I ______ to start my homework earlier this term, but I still leave everything till the last minute.',['regret','intend','imagine','improve']],
['We’re not sure what to do after the exams. ______ we’ll go to a summer camp together.',['Further','Brave','Perhaps','Habit']],
['After finishing school, Leo took a ______ before university and spent six months volunteering abroad.',['resolution','gap year','career','habit']],
['If you want to study ______, you may need to choose more difficult subjects next year.',['perhaps','courage','further','chance']],
['Nina moved to Spain last year, so at first she really ______ with the language.',['took the chance','struggled','regretted','intended']],
['On 1 January, Max made a ______ to spend less time on his phone in the evenings.',['habit','gap year','resolution','regret']],
['After a few weeks of training, waking up early became a ______, and it no longer felt difficult.',['courage','habit','chance','further']],
['It was very ______ of Mia to speak in front of the whole school even though she was nervous.',['open-minded','life-changing','brave','further']],
['Ben wanted to audition for the band, but he didn’t have the ______ to perform alone on stage.',['habit','courage','resolution','further']],
['Mr Carter asked us to keep an open ______ and listen carefully to everyone’s ideas before deciding.',['habit','chance','mind','future']],
['Olivia wasn’t sure about joining the science competition, but in the end she decided to take the ______.',['resolution','chance','courage','habit']]
];
const lexGrid=document.getElementById('lexGrid');lex.forEach((q,i)=>{const box=document.createElement('div');box.className='lex-q';box.innerHTML=`<b>QUESTION ${i+1}</b><p>${q[0]}</p><div class="choices">${q[1].map((o,j)=>`<div class="choice"><input type="radio" name="lex${i}" id="lex${i}_${j}" data-lex="${i}" value="${o}"><label for="lex${i}_${j}">${String.fromCharCode(65+j)}) ${o}</label></div>`).join('')}</div>`;lexGrid.appendChild(box)});
const articleParts=['After saving money for almost ',' entire year, I finally bought ',' new phone last weekend. It was ',' latest model, and I had been wanting it ever since I saw ',' advertisement for it online.<br><br>When I got to ',' store, there was already ',' long line of people waiting outside. I waited for almost ',' hour before I could even walk in. Once inside, ',' salesperson helped me choose between ',' different colors and explained ',' features of ',' new camera system.<br><br>Setting up ',' phone took longer than I expected. I had to transfer all ',' photos, ',' contacts, and ',' apps from my old phone, which was honestly kind of annoying. Still, once everything was set up, I couldn’t stop testing ',' new features.<br><br>',' camera quality was incredible compared to my old phone, and ',' battery life lasted almost ',' entire day without needing ',' charge. My friends were jealous when they saw ',' phone, and a few of them even asked me for ',' advice about which model to buy.<br><br>Even though it was ',' expensive purchase, I think it was worth ',' money I saved. Now I just have to be careful not to drop ',' phone!'];
const prompts=['entire year','new phone','latest model','advertisement','store','long line','hour','salesperson','different colors','features','new camera system','phone','photos','contacts','apps','new features','camera quality','battery life','entire day','charge','phone','advice','expensive purchase','money I saved','phone'];function artSel(i){return `<select class="art-select" data-art="${i}"><option value="">${i+1}</option><option value="a">a</option><option value="an">an</option><option value="the">the</option><option value="zero">—</option></select><span class="target">(${prompts[i]})</span>`}let ah='';for(let i=0;i<25;i++)ah+=articleParts[i]+artSel(i);ah+=articleParts[25];document.getElementById('articleText').innerHTML=ah;
function showPanel(id){document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));document.getElementById(id).classList.remove('hidden');document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));window.scrollTo({top:0,behavior:'smooth'})}document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));document.getElementById('openHw').onclick=()=>{document.getElementById('course').classList.add('hidden');document.getElementById('homework').classList.add('show');showPanel('readPanel')};document.getElementById('backBtn').onclick=()=>{document.getElementById('homework').classList.remove('show');document.getElementById('course').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})};
function bytesToB64url(bytes){let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}function encodePayload(obj){return bytesToB64url(new TextEncoder().encode(JSON.stringify(obj)))}function collect(){const wf=[...document.querySelectorAll('[data-wf]')].map(x=>x.value),art=[...document.querySelectorAll('[data-art]')].map(x=>x.value),lexAns=lex.map((_,i)=>{const e=document.querySelector(`input[name="lex${i}"]:checked`);return e?e.value:''});return{wf,art,lex:lexAns}}function save(){localStorage.setItem('life-plans-hw1',JSON.stringify(collect()))}function load(){try{const d=JSON.parse(localStorage.getItem('life-plans-hw1')||'{}');(d.wf||[]).forEach((v,i)=>{const e=document.querySelector(`[data-wf="${i}"]`);if(e)e.value=v});(d.art||[]).forEach((v,i)=>{const e=document.querySelector(`[data-art="${i}"]`);if(e)e.value=v});(d.lex||[]).forEach((v,i)=>{if(v){const e=[...document.querySelectorAll(`input[name="lex${i}"]`)].find(x=>x.value===v);if(e)e.checked=true}})}catch(e){}}document.addEventListener('change',e=>{if(e.target.matches('[data-wf],[data-art],[data-lex]'))save()});document.addEventListener('input',e=>{if(e.target.matches('[data-wf]'))save()});load();
document.getElementById('submitBtn').onclick=()=>{const d=collect(),missing=d.wf.filter(x=>!x.trim()).length+d.art.filter(x=>!x).length+d.lex.filter(x=>!x).length;if(missing){const s=document.getElementById('submitStatus');s.className='status bad';s.textContent='Finish all tasks first · '+missing+' answer'+(missing===1?'':'s')+' missing.';return}const payload={v:2,assignment:'life-plans-hw1',submitted:new Date().toISOString(),wf:d.wf.map(x=>x.trim()),art:d.art,lex:d.lex};const code=encodePayload(payload);document.getElementById('submissionCode').textContent=code;document.getElementById('codeWrap').classList.remove('hidden');const s=document.getElementById('submitStatus');s.className='status';s.textContent='Homework code created. Send it to your teacher.';localStorage.setItem('life-plans-hw1-code',code)};document.getElementById('copyBtn').onclick=async()=>{const c=document.getElementById('submissionCode').textContent;try{await navigator.clipboard.writeText(c);document.getElementById('copyBtn').textContent='Copied ✓'}catch(e){const r=document.createRange();r.selectNode(document.getElementById('submissionCode'));getSelection().removeAllRanges();getSelection().addRange(r)}};

// Module 1 lesson navigation — compact cards with dates and completion status.
(()=>{
  const course=document.getElementById('course');
  const firstCard=course?.querySelector('.lesson-card');
  const head=course?.querySelector('.lesson-head');
  if(!course||!firstCard||!head)return;

  if(!document.getElementById('lesson-grid-tweaks')){
    const st=document.createElement('style');
    st.id='lesson-grid-tweaks';
    st.textContent=`
      .lesson-grid-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:stretch}
      .lesson-grid-three .lesson-card{padding:20px;min-height:0}
      .lesson-grid-three .lesson-card h3{font-size:clamp(22px,2vw,30px);line-height:1.12;margin:0 0 8px}
      .lesson-grid-three .lesson-card p{font-size:14px;line-height:1.35}
      .lesson-grid-three .tag{display:block;margin-bottom:6px;font-size:11px}
      .lesson-date{display:block;margin:0 0 8px;color:#7b8b93;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .lesson-completed{display:inline-flex;margin-top:10px;padding:6px 11px;border-radius:999px;background:#e9fff5;color:#20775b;font-size:12px;font-weight:900}
      .lesson-grid-three .open-btn{padding:10px 14px;font-size:14px}
      @media (max-width: 900px){.lesson-grid-three{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  const sub=head.querySelector('p');
  if(sub)sub.textContent='Lessons 1–3';

  const grid=document.createElement('div');
  grid.className='lesson-grid-three';
  firstCard.parentNode.insertBefore(grid,firstCard);
  grid.appendChild(firstCard);

  const decorate=(card,opts)=>{
    const title=card.querySelector('h3');
    const desc=card.querySelector('p');
    const badge=card.querySelector('.tag');
    const btn=card.querySelector('.open-btn');
    if(badge)badge.textContent=opts.tag;
    if(title)title.textContent=opts.title;
    if(desc)desc.innerHTML=`<span class="lesson-date">${opts.date}</span>${opts.desc}${opts.completed?'<br><span class="lesson-completed">Completed</span>':''}`;
    if(btn)btn.textContent='Open →';
  };

  decorate(firstCard,{
    tag:'LESSON 1 · HOMEWORK',
    title:'Older teens. Different routes.',
    date:'24 Aug',
    desc:'Reading, vocabulary, word formation and articles.',
    completed:true
  });

  const second=firstCard.cloneNode(true);
  decorate(second,{
    tag:'LESSON 2 · HOMEWORK',
    title:'Fix & Strengthen',
    date:'27 Aug',
    desc:'Vocabulary, word formation and articles — practice from your mistakes.',
    completed:true
  });
  const btn2=second.querySelector('.open-btn');
  btn2.id='openHw2';
  btn2.onclick=()=>{window.location.href='repair-homework.html'};
  grid.appendChild(second);

  const third=firstCard.cloneNode(true);
  decorate(third,{
    tag:'LESSON 3 · HOMEWORK',
    title:'The Hollow · Articles · Smells',
    date:'1 Sep',
    desc:'Quizlet vocabulary, music-festival articles and strong-smell language.',
    completed:false
  });
  const btn3=third.querySelector('.open-btn');
  btn3.id='openHw3';
  btn3.onclick=()=>{window.location.href='lesson-3-homework.html'};
  grid.appendChild(third);
})();

// Daily Must-Know English Expressions + separate BY phrases for Gabi.
(()=>{
  const course=document.getElementById('course');
  const cover=course?.querySelector('.course-cover');
  if(!course||!cover||document.getElementById('gabi-daily-strip'))return;

  const style=document.createElement('style');
  style.textContent=`
    .gabi-daily{margin:18px 0 20px;padding:14px 16px;border:1px solid #d9e7ea;border-radius:18px;background:linear-gradient(135deg,#ffffff,#f5fbfb);box-shadow:0 8px 24px rgba(28,119,119,.08)}
    .gabi-daily-top{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
    .gabi-today{font-size:14px;font-weight:900;color:#207f7a}.gabi-today span{color:#54666c;font-weight:700;margin-left:8px}
    .gabi-by-btn{border:1px solid #cfe3e2;background:#fff;border-radius:999px;padding:8px 11px;font-size:12px;font-weight:900;color:#207f7a;cursor:pointer}
    .gabi-bubble{display:inline-block;position:relative;background:#fff0b8;border:1px solid #f3cf57;border-radius:16px;padding:10px 13px;font-size:15px;font-weight:900;color:#714d00;margin-bottom:12px}
    .gabi-bubble:after{content:'';position:absolute;left:24px;bottom:-9px;border:9px solid transparent;border-top-color:#f3cf57;border-bottom:0}
    .gabi-exprs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .gabi-expr{padding:12px 13px;border-radius:15px;background:#fff;border:1px solid #e5ecee;box-shadow:0 4px 12px rgba(30,87,91,.05)}
    .gabi-expr:nth-child(2){background:#f4fbff}.gabi-expr:nth-child(3){background:#fff6f9}
    .gabi-expr b{display:block;font-size:16px;color:#26384a;line-height:1.15}.gabi-expr span{display:block;margin-top:5px;font-size:12px;color:#8a4f66}.gabi-expr p{margin:6px 0 0;font-size:12px;line-height:1.4;color:#5f6c74}
    .gabi-by{display:none;margin-top:12px;padding-top:12px;border-top:1px solid #dde8e8}.gabi-by.open{display:flex;gap:7px;flex-wrap:wrap}.gabi-by span{padding:6px 9px;border-radius:999px;background:#fff;border:1px solid #dce8e8;font-size:12px;font-weight:800;color:#42565c}
    @media(max-width:850px){.gabi-exprs{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const expressions=[
    ['no cap','честно / без вранья','No cap, that episode was actually creepy.'],
    ['catching strays','попасть под раздачу ни за что','Why am I catching strays? I didn’t even say anything.'],
    ['shady','подозрительный / мутный','That guy seems a bit shady.'],
    ['lowkey','слегка / втайне','I lowkey want to watch the next episode now.'],
    ['red flag','тревожный звоночек','That behaviour is a serious red flag.'],
    ['try-hard','тот, кто слишком старается произвести впечатление','He’s acting like such a try-hard.'],
    ['spill the tea','расскажи, что случилось / выкладывай сплетни','Come on, spill the tea. What happened?'],
    ['ghost someone','резко перестать отвечать человеку','He just ghosted everyone after the party.']
  ];
  const messages=['Keep going — you’re building real English.','Small progress every day adds up.','Use it, don’t just memorise it.','One good phrase can make you sound much more natural.'];
  const now=new Date();
  const day=Math.floor((now-new Date(now.getFullYear(),0,0))/86400000);
  const picks=[expressions[day%expressions.length],expressions[(day+3)%expressions.length],expressions[(day+5)%expressions.length]];

  const strip=document.createElement('section');
  strip.id='gabi-daily-strip';
  strip.className='gabi-daily';
  strip.innerHTML=`
    <div class="gabi-daily-top"><div class="gabi-today">Today · ${now.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}<span>${messages[day%messages.length]}</span></div><button class="gabi-by-btn" type="button">Useful BY phrases ▾</button></div>
    <div class="gabi-bubble">❗ MUST-KNOW ENGLISH EXPRESSIONS!</div>
    <div class="gabi-exprs">${picks.map(x=>`<div class="gabi-expr"><b>${x[0]}</b><span>${x[1]}</span><p>${x[2]}</p></div>`).join('')}</div>
    <div class="gabi-by"><span>by heart</span><span>by accident</span><span>by chance</span><span>by name</span><span>by the way</span><span>by hand</span><span>by myself</span></div>`;
  cover.insertAdjacentElement('afterend',strip);
  const by=strip.querySelector('.gabi-by');
  strip.querySelector('.gabi-by-btn').onclick=()=>by.classList.toggle('open');
})();