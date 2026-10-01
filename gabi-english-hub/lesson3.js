'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const wordFormCards=[
  ['compose','composer · composition'],
  ['develop','developer · development'],
  ['discover','discovery'],
  ['science','scientist · scientific'],
  ['biology','biologist · biological'],
  ['astronomy','astronomer · astronomical'],
  ['mathematics','mathematician · mathematical'],
  ['electric','electricity · electrical'],
  ['fame','famous'],
  ['talent','talented'],
  ['determine','determination · determined'],
  ['confident','confidence'],
  ['intelligent','intelligence'],
  ['connect','connection']
];

const vocab=[
  ['talent','талант','talented · a talented athlete'],
  ['determination','решимость, упорство','determined · determined to succeed'],
  ['confidence','уверенность','confident · feel confident'],
  ['intelligence','ум, интеллект','intelligent · an intelligent person'],
  ['style','стиль','stylish · a stylish performer'],
  ['hard work','упорный труд','hard-working · a hard-working player'],
  ['inspire teammates','вдохновлять товарищей по команде','His confidence inspires his teammates.'],
  ['make assumptions','делать предположения','Don’t make assumptions about someone’s age.'],
  ['challenge a stereotype','оспаривать стереотип','Challenge a stereotype about older people.'],
  ['keep an open mind','быть открытым к новым взглядам','Keep an open mind when you meet people.'],
  ['development','развитие','develop → development'],
  ['electricity','электричество','electric → electricity'],
  ['fame','слава','fame → famous'],
  ['discovery','открытие','discover → discovery'],
  ['scientist','учёный','science → scientist'],
  ['specimen','образец для изучения','collect specimens']
];

const famousPeople=[
  {
    name:'Vladimir Putin',
    text:'Vladimir Putin was born in 1952 in Leningrad, now Saint Petersburg. He studied law at Leningrad State University and later worked in the Soviet security service. In 1999 he became Prime Minister of Russia. At the end of that year he became acting President, and in 2000 he was elected President. These biographical facts make the text useful for practising words connected with careers, public life and personal history.',
    source:'Official Kremlin biography and historical records.'
  },
  {
    name:'Konstantin Khabensky',
    text:'Konstantin Khabensky was born in 1972 in Leningrad, now Saint Petersburg. He first studied in a technical field but later chose acting. He became widely known through theatre and film work, including Night Watch and Day Watch. His career gives us useful language for talking about talent, development, performance and professional choices.',
    source:'Biographical details checked against published actor biography sources.'
  },
  {
    name:'Alexander Ovechkin',
    text:'Alexander Ovechkin was born in 1985 in Moscow. He developed his career in ice hockey and joined the Washington Capitals in the NHL. In 2018 he captained the Capitals to their first Stanley Cup championship and received the Conn Smythe Trophy as the most valuable player of the playoffs. His story is useful for vocabulary about sport, achievement, determination and teamwork.',
    source:'Biographical details checked against NHL records.'
  }
];

const warmupQuiz=[
  {
    question:'Which famous scientist later worked as Master of the Royal Mint and personally investigated counterfeiter?',
    options:['Isaac Newton','Nikola Tesla','Charles Darwin','Alan Turing'],
    answer:'Isaac Newton',
    fact:'Newton became Warden and later Master of the Royal Mint. He took the job seriously and investigated counterfeiting cases.'
  },
  {
    question:'Whose first agreement with FC Barcelona was famously written on a paper napkin?',
    options:['Lionel Messi','Alexander Ovechkin','Michael Jackson','Ludwig van Beethoven'],
    answer:'Lionel Messi',
    fact:'A preliminary agreement connected with Messi’s move to Barcelona was written on a napkin in 2000.'
  },
  {
    question:'Which composer originally admired Napoleon enough to dedicate a major symphony to him, then removed the dedication?',
    options:['Ludwig van Beethoven','Wolfgang Mozart','Johann Bach','Franz Schubert'],
    answer:'Ludwig van Beethoven',
    fact:'Beethoven originally connected his Third Symphony, the Eroica, with Napoleon, but changed the dedication after Napoleon declared himself emperor.'
  },
  {
    question:'Which scientist named a newly discovered element after her homeland?',
    options:['Marie Skłodowska-Curie','Hedy Lamarr','Ada Lovelace','Rosalind Franklin'],
    answer:'Marie Skłodowska-Curie',
    fact:'Curie named polonium after Poland, her homeland.'
  },
  {
    question:'Which inventor worked on alternating-current technology and also experimented with wireless transmission?',
    options:['Nikola Tesla','Charles Darwin','Nicolaus Copernicus','Isaac Newton'],
    answer:'Nikola Tesla',
    fact:'Tesla is strongly associated with alternating-current systems and also carried out experiments in wireless power and radio-frequency technology.'
  },
  {
    question:'Which performer co-wrote “We Are the World” with Lionel Richie?',
    options:['Michael Jackson','Elvis Presley','Freddie Mercury','David Bowie'],
    answer:'Michael Jackson',
    fact:'Michael Jackson and Lionel Richie wrote “We Are the World” for the 1985 USA for Africa charity recording.'
  },
  {
    question:'Which mathematician described the idea of a universal computing machine in 1936?',
    options:['Alan Turing','Isaac Newton','Nikola Tesla','Charles Darwin'],
    answer:'Alan Turing',
    fact:'Turing’s 1936 paper introduced the abstract machine model now known as the Turing machine.'
  },
  {
    question:'Which scientist first trained in medicine but strongly disliked surgery before changing direction?',
    options:['Charles Darwin','Nicolaus Copernicus','Alan Turing','Marie Curie'],
    answer:'Charles Darwin',
    fact:'Darwin studied medicine in Edinburgh but left the course; he later studied at Cambridge.'
  },
  {
    question:'Which astronomer proposed a heliocentric model in which Earth moves around the Sun?',
    options:['Nicolaus Copernicus','Isaac Newton','Nikola Tesla','Alan Turing'],
    answer:'Nicolaus Copernicus',
    fact:'Copernicus developed a heliocentric model that placed the Sun near the centre of the planetary system.'
  },
  {
    question:'Which hockey star grew up in a family where his mother was an Olympic champion in basketball?',
    options:['Alexander Ovechkin','Lionel Messi','Wayne Gretzky','Sidney Crosby'],
    answer:'Alexander Ovechkin',
    fact:'Ovechkin’s mother, Tatyana Ovechkina, was a two-time Olympic gold medallist in basketball with the Soviet team.'
  },
  {
    question:'Which Russian actor studied at a technical institute before choosing an acting career?',
    options:['Konstantin Khabensky','Alexander Ovechkin','Michael Jackson','Lionel Messi'],
    answer:'Konstantin Khabensky',
    fact:'Khabensky studied in a technical field before leaving and later training as an actor.'
  },
  {
    question:'Which Hollywood star was also an inventor who co-developed a frequency-hopping communication system?',
    options:['Hedy Lamarr','Marilyn Monroe','Grace Kelly','Audrey Hepburn'],
    answer:'Hedy Lamarr',
    fact:'Hedy Lamarr and George Antheil patented a frequency-hopping system intended to make radio-controlled torpedoes harder to jam.'
  },
  {
    question:'Which novelist disappeared for eleven days in 1926, creating a major public mystery?',
    options:['Agatha Christie','Virginia Woolf','Jane Austen','George Eliot'],
    answer:'Agatha Christie',
    fact:'Agatha Christie disappeared in December 1926 and was found eleven days later at a hotel in Harrogate.'
  },
  {
    question:'Which scientist was offered the presidency of Israel in 1952 but declined?',
    options:['Albert Einstein','Isaac Newton','Nikola Tesla','Alan Turing'],
    answer:'Albert Einstein',
    fact:'After the death of Chaim Weizmann, Einstein was invited to become President of Israel but declined the offer.'
  },
  {
    question:'Which technology entrepreneur said a college calligraphy course later influenced the typography of the Macintosh?',
    options:['Steve Jobs','Bill Gates','Alan Turing','Nikola Tesla'],
    answer:'Steve Jobs',
    fact:'Jobs later said that his calligraphy studies influenced the Macintosh’s attention to typography.'
  }
];

const quickCheck=[
  ['Vladimir Putin was born in …','Leningrad',['Moscow','Leningrad','London']],
  ['Before national politics, Putin worked in …','a state security service',['medicine','a state security service','cinema']],
  ['Khabensky first studied in …','a technical field',['a technical field','medicine','professional sport']],
  ['Khabensky appeared in …','Night Watch and Day Watch',['Night Watch and Day Watch','Titanic and Avatar','Rocky and Creed']],
  ['Ovechkin was born in …','Moscow',['Moscow','Saint Petersburg','Madrid']],
  ['Ovechkin developed a career in …','ice hockey',['tennis','ice hockey','basketball']],
  ['The Capitals won the Stanley Cup in …','2018',['2000','2018','2025']],
  ['Ovechkin received the Conn Smythe Trophy as …','playoff MVP',['top coach','playoff MVP','best goalkeeper']]
];

const videoTF=[
  ['Make-up is used to change the man’s appearance.','True'],
  ['The man stays in the make-up room for the whole film.','False'],
  ['We see the man outside after his appearance changes.','True'],
  ['The video gives the man’s year of birth.','False'],
  ['The film encourages viewers to think about first impressions.','True'],
  ['The man becomes younger during the experiment.','False']
];

const chooseWords=[
  ['The make-up changes the man’s ________.','appearance'],
  ['He is made to look much ________.','older'],
  ['The video asks us to question our ________ about age.','assumptions'],
  ['A fixed idea about a group of people is a ________.','stereotype'],
  ['We should keep an ________ mind when we meet people.','open'],
  ['Appearance does not always tell us what a person is ________.','like'],
  ['The film makes us think about how we ________ older people.','treat'],
  ['Age should not decide how much ________ we show someone.','respect']
];
const wordBank=['appearance','older','assumptions','stereotype','open','like','treat','respect'];

const celebrityKidsText='Growing up with a famous parent can look exciting from the outside, but many children of celebrities still want an ordinary private life. They know that people recognise their family name, and they understand why strangers are curious. However, they do not always like the attention. Some teenagers believe that fame creates opportunities, while others prefer to build an identity of their own. They need privacy, they want close friends, and they often value normal routines. At the same time, their lives are changing. They are studying, travelling, working on projects and meeting new people. A teenager may think that a public event is exciting today but feel completely different about it tomorrow. The important point is that we cannot know a person simply from a photo. A famous surname belongs to a family, but personality belongs to the individual.';

const familyDinnersText='For many families, dinner is more than a meal. It is a time when people stop, sit together and talk about the day. In one family, a parent cooks the main dish while a teenager lays the table. The younger child brings a bottle of water and puts it next to the glasses. When everyone is ready, the family turns off the television and leaves the phones in another room. During the meal, they share stories from school and work. Sometimes there is an argument, but there is usually a laugh too. At the weekend, they may invite a grandparent or a friend. A simple dinner can become an important family tradition because it gives people the chance to listen to one another. The meal does not need to be expensive; the important thing is the time they spend together.';

const stativeQs=[
  ['Celebrity kids usually ___ why people are curious.','understand',['are understanding','understand']],
  ['They often ___ privacy.','need',['need','are needing']],
  ['Some teenagers ___ fame creates opportunities.','believe',['are believing','believe']],
  ['Others ___ to build their own identity.','prefer',['prefer','are preferring']],
  ['They ___ close friends and normal routines.','want',['are wanting','want']],
  ['Right now, many teenagers ___ on new projects.','are working',['work','are working']],
  ['A teenager may ___ differently tomorrow.','feel',['be feeling','feel']],
  ['We cannot ___ a person from a photo alone.','know',['know','be knowing']],
  ['A famous surname ___ to a family.','belongs',['belongs','is belonging']],
  ['This month, some teenagers ___ abroad for work or study.','are travelling',['travel','are travelling']]
];

const articleQs=[
  ['Dinner can be ___ important family tradition.','an',['a','an','the','—']],
  ['A parent may cook ___ main dish.','the',['a','an','the','—']],
  ['A teenager lays ___ table.','the',['a','an','the','—']],
  ['The younger child brings ___ bottle of water.','a',['a','an','the','—']],
  ['They turn off ___ television before eating.','the',['a','an','the','—']],
  ['At ___ weekend, they may invite a grandparent.','the',['a','an','the','—']],
  ['They share stories from ___ school and work.','—',['a','an','the','—']],
  ['Sometimes there is ___ argument.','an',['a','an','the','—']],
  ['A family may invite ___ friend to dinner.','a',['a','an','the','—']],
  ['What matters most is ___ time they spend together.','the',['a','an','the','—']]
];

const earlierLives=[
  ['Ludwig van Beethoven','composer','He continued composing music despite serious hearing problems.'],
  ['Lionel Messi','footballer','He moved from Argentina to Spain when he was thirteen to develop his football career.'],
  ['Nikola Tesla','inventor and engineer','His work with alternating current influenced modern electrical technology.'],
  ['Michael Jackson','performer','He became internationally famous while he was still a child.'],
  ['Marie Skłodowska-Curie','physicist and chemist','She discovered polonium and radium.'],
  ['Isaac Newton','physicist and mathematician','He researched gravity and light.'],
  ['Alan Turing','computer scientist','In 1936, he developed the idea of a Universal Machine.'],
  ['Nicolaus Copernicus','astronomer','He developed the theory that the Earth moves around the Sun.'],
  ['Charles Darwin','biologist','He observed nature and collected specimens from around the world.']
];

let wfIndex=0,wfBack=false;
let vocabIndex=0,vocabBack=false;
let personIndex=0;
let warmupStarted=false,warmupIndex=0,warmupScore=0,warmupStreak=0,warmupAnswered=false,warmupSelected='',warmupFinished=false;
let quickIndex=0;
let videoTfIndex=0,chooseIndex=0;
let grammarPane='kids',stativeIndex=0,articleIndex=0;
let recallIndex=0;
let lessonTimer=null;

function accordion(title,subtitle,content,open=false){
  return `<details class="activity" ${open?'open':''}>
    <summary><span><strong>${esc(title)}</strong><small>${esc(subtitle)}</small></span><b>OPEN</b></summary>
    <div class="activityBody">${content}</div>
  </details>`;
}

function warmupQuizCard(){
  if(!warmupStarted && !warmupFinished){
    return `<div class="hardQuizShell">
      <div class="hardQuizStart">
        <div class="hardQuizKicker">HARD MODE · UNUSUAL FACTS EDITION</div>
        <h2>Famous People Quiz</h2>
        <p>15 challenging questions. The answer is not always obvious.</p>
        <div class="hardQuizRules">
          <span>15 unusual-fact questions</span>
          <span>Immediate feedback after every answer</span>
          <span>Streak + score tracking</span>
          <span>Short fact after every question</span>
        </div>
        <button class="hardQuizPrimary" id="startWarmupQuiz">Start Challenge</button>
      </div>
    </div>`;
  }

  if(warmupFinished){
    const pct=Math.round((warmupScore/warmupQuiz.length)*100);
    const comment=pct>=87?'Excellent recall and inference.':pct>=67?'Strong result. Review the facts you missed.':'Good start. Reopen the quiz and challenge the facts again.';
    return `<div class="hardQuizShell">
      <div class="hardQuizResult">
        <div class="hardQuizKicker">QUIZ COMPLETE</div>
        <h2>${warmupScore} / ${warmupQuiz.length}</h2>
        <div class="hardQuizScoreBar"><span style="width:${pct}%"></span></div>
        <p>${pct}% · ${comment}</p>
        <button class="hardQuizPrimary" id="restartWarmupQuiz">Try Again</button>
      </div>
    </div>`;
  }

  const q=warmupQuiz[warmupIndex];
  const pct=((warmupIndex+1)/warmupQuiz.length)*100;
  return `<div class="hardQuizShell">
    <div class="hardQuizTop">
      <div>
        <span>Question <strong>${warmupIndex+1}</strong> / ${warmupQuiz.length}</span>
        <span class="streakPill ${warmupStreak>1?'show':''}">Streak: ${warmupStreak}</span>
      </div>
      <strong>Score: ${warmupScore}</strong>
    </div>
    <div class="hardQuizProgress"><span style="width:${pct}%"></span></div>
    <h2 class="hardQuizQuestion">${esc(q.question)}</h2>
    <div class="hardQuizOptions">
      ${q.options.map(opt=>{
        let cls='';
        if(warmupAnswered){
          if(opt===q.answer) cls=' correct';
          else if(opt===warmupSelected) cls=' wrong';
        }
        return `<button class="hardOption${cls}" data-warmup-answer="${esc(opt)}" ${warmupAnswered?'disabled':''}>${esc(opt)}</button>`;
      }).join('')}
    </div>
    <div class="hardQuizFeedback ${warmupAnswered?'show':''}">
      <strong>${warmupAnswered?(warmupSelected===q.answer?'Correct.':'Not quite.') : ''}</strong>
      <p>${warmupAnswered?esc(q.fact):''}</p>
    </div>
    <div class="hardQuizNextRow">
      <button class="hardQuizPrimary ${warmupAnswered?'':'hiddenQuizBtn'}" id="nextWarmupQuestion">
        ${warmupIndex===warmupQuiz.length-1?'See Result':'Next Question →'}
      </button>
    </div>
  </div>`;
}

function wordFormCard(){
  const c=wordFormCards[wfIndex];
  return `<div class="panel">
    <div class="row" style="justify-content:space-between">
      <span class="tag">WORD FORMATION</span><strong>${wfIndex+1} / ${wordFormCards.length}</strong>
    </div>
    <button class="wordFlash" id="wfFlash">
      <span class="wordFaceLabel">${wfBack?'WORD FAMILY':'BASE WORD'}</span>
      <strong>${esc(wfBack?c[1]:c[0])}</strong>
      <small>${wfBack?'Tap to see the base word':'Tap to flip'}</small>
    </button>
    <div class="row center" style="margin-top:14px">
      <button class="actionBtn" id="wfPrev" ${wfIndex===0?'disabled':''}>←</button>
      <button class="actionBtn" id="wfNext" ${wfIndex===wordFormCards.length-1?'disabled':''}>→</button>
    </div>
  </div>`;
}

function wordsAndPeople(){
  const v=vocab[vocabIndex];
  const p=famousPeople[personIndex];
  return `<div class="grid2">
    <section class="panel">
      <span class="tag">WORD PAIRS & USEFUL PHRASES</span>
      <h3>Quizlet-style cards</h3>
      <button class="flash" id="vocabFlash">${esc(vocabBack?v[1]:v[0])}<small>${vocabBack?esc(v[2]):'Tap to flip'}</small></button>
      <div class="row center" style="margin-top:13px">
        <button class="actionBtn" id="vocabPrev" ${vocabIndex===0?'disabled':''}>←</button>
        <strong>${vocabIndex+1} / ${vocab.length}</strong>
        <button class="actionBtn" id="vocabNext" ${vocabIndex===vocab.length-1?'disabled':''}>→</button>
        <button class="actionBtn" id="listenWord">Listen</button>
      </div>
    </section>

    <section class="panel">
      <span class="tag">FAMOUS PEOPLE</span>
      <h3>Read the text</h3>
      <div class="personTabs">
        ${famousPeople.map((x,i)=>`<button class="personBtn ${i===personIndex?'active':''}" data-person="${i}">${esc(x.name)}</button>`).join('')}
      </div>
      <p class="personText">${esc(p.text)}</p>
      <div class="factSource">${esc(p.source)}</div>
    </section>
  </div>`;
}

function quickCheckCard(){
  const q=quickCheck[quickIndex];
  return `<div class="questionBox">
    <div class="row" style="justify-content:space-between">
      <span class="tag">QUICK CHECK</span><strong>${quickIndex+1} / ${quickCheck.length}</strong>
    </div>
    <p class="question">${esc(q[0])}</p>
    <div class="choices">${q[2].map(x=>`<button data-quick="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <div class="feedback" id="quickFeedback"></div>
    <div class="row">
      <button class="actionBtn" id="quickPrev" ${quickIndex===0?'disabled':''}>←</button>
      <button class="actionBtn" id="quickNext" ${quickIndex===quickCheck.length-1?'disabled':''}>→</button>
    </div>
  </div>`;
}

function videoCard(){
  const tf=videoTF[videoTfIndex];
  const cw=chooseWords[chooseIndex];
  return `<div class="grid2">
    <div class="panel videoWrap">
      <span class="tag">TO BE OLD</span>
      <h3>Watch the video</h3>
      <video id="oldVideo" controls preload="metadata" playsinline poster="assets/lesson3/video-poster.jpg" src="assets/lesson3/to-be-old.mp4"></video>
      <div class="videoActions">
        <button class="actionBtn" id="restartVideo">Play from the start</button>
        <a class="actionBtn" href="assets/lesson3/to-be-old.mp4" download>Download video</a>
      </div>
    </div>

    <div class="panel">
      <div class="taskTabs">
        <button class="miniBtn active" data-video-pane="tf">True / False</button>
        <button class="miniBtn" data-video-pane="words">Choose from words</button>
      </div>

      <div class="taskPane active" id="videoPane-tf">
        <div class="row" style="justify-content:space-between">
          <span class="tag">TRUE / FALSE</span><strong>${videoTfIndex+1} / ${videoTF.length}</strong>
        </div>
        <p class="question">${esc(tf[0])}</p>
        <div class="choices">
          <button data-vtf="True">True</button>
          <button data-vtf="False">False</button>
        </div>
        <div class="feedback" id="videoTfFeedback"></div>
        <div class="row">
          <button class="actionBtn" id="videoTfPrev" ${videoTfIndex===0?'disabled':''}>←</button>
          <button class="actionBtn" id="videoTfNext" ${videoTfIndex===videoTF.length-1?'disabled':''}>→</button>
        </div>
      </div>

      <div class="taskPane" id="videoPane-words">
        <div class="row" style="justify-content:space-between">
          <span class="tag">CHOOSE FROM WORDS</span><strong>${chooseIndex+1} / ${chooseWords.length}</strong>
        </div>
        <div class="wordBank">${wordBank.map(x=>`<span>${esc(x)}</span>`).join('')}</div>
        <p class="question">${esc(cw[0])}</p>
        <div class="choices">${wordBank.map(x=>`<button data-cword="${esc(x)}">${esc(x)}</button>`).join('')}</div>
        <div class="feedback" id="chooseFeedback"></div>
        <div class="row">
          <button class="actionBtn" id="choosePrev" ${chooseIndex===0?'disabled':''}>←</button>
          <button class="actionBtn" id="chooseNext" ${chooseIndex===chooseWords.length-1?'disabled':''}>→</button>
        </div>
      </div>
    </div>
  </div>`;
}

function sentencePhraseWord(){
  return `<div class="grid2">
    <div class="panel">
      <span class="tag">SENTENCE · PHRASE · WORD</span>
      <h3>Choose from today’s lesson</h3>
      <label>One sentence<textarea id="spwSentence" placeholder="Copy or write one sentence."></textarea></label>
      <label>One phrase<input id="spwPhrase" placeholder="Choose one phrase."></label>
      <label>One key word<input id="spwWord" placeholder="Choose one word."></label>
    </div>
    <div class="panel">
      <h3>Explain your choice</h3>
      <p class="question">Use: “I chose … because …”</p>
      <button class="actionBtn" id="spwModel">Show a model</button>
      <div class="feedback" id="spwFeedback"></div>
    </div>
  </div>`;
}

function celebrityAndDinner(){
  const s=stativeQs[stativeIndex];
  const a=articleQs[articleIndex];
  return `<div class="panel">
    <div class="grammarTabs">
      <button class="miniBtn ${grammarPane==='kids'?'active':''}" data-grammar="kids">Celebrity Kids · Text</button>
      <button class="miniBtn ${grammarPane==='stative'?'active':''}" data-grammar="stative">Stative verbs</button>
      <button class="miniBtn ${grammarPane==='dinner'?'active':''}" data-grammar="dinner">Family Dinners · Text</button>
      <button class="miniBtn ${grammarPane==='articles'?'active':''}" data-grammar="articles">Articles</button>
    </div>

    <div class="grammarPane ${grammarPane==='kids'?'active':''}" id="grammar-kids">
      <span class="tag">READING · STATIVE VERBS IN CONTEXT</span>
      <h3>Celebrity Kids</h3>
      <p class="readText">${esc(celebrityKidsText)}</p>
    </div>

    <div class="grammarPane ${grammarPane==='stative'?'active':''}" id="grammar-stative">
      <div class="row" style="justify-content:space-between">
        <span class="tag">STATIVE / DYNAMIC</span><strong>${stativeIndex+1} / ${stativeQs.length}</strong>
      </div>
      <p class="question">${esc(s[0])}</p>
      <div class="choices">${s[2].map(x=>`<button data-stative="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <div class="feedback" id="stativeFeedback"></div>
      <div class="row">
        <button class="actionBtn" id="stativePrev" ${stativeIndex===0?'disabled':''}>←</button>
        <button class="actionBtn" id="stativeNext" ${stativeIndex===stativeQs.length-1?'disabled':''}>→</button>
      </div>
    </div>

    <div class="grammarPane ${grammarPane==='dinner'?'active':''}" id="grammar-dinner">
      <span class="tag">READING · ARTICLES IN CONTEXT</span>
      <h3>Family Dinners</h3>
      <p class="readText">${esc(familyDinnersText)}</p>
    </div>

    <div class="grammarPane ${grammarPane==='articles'?'active':''}" id="grammar-articles">
      <div class="row" style="justify-content:space-between">
        <span class="tag">A / AN / THE / —</span><strong>${articleIndex+1} / ${articleQs.length}</strong>
      </div>
      <p class="question">${esc(a[0])}</p>
      <div class="choices">${a[2].map(x=>`<button data-article="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <div class="feedback" id="articleFeedback"></div>
      <div class="row">
        <button class="actionBtn" id="articlePrev" ${articleIndex===0?'disabled':''}>←</button>
        <button class="actionBtn" id="articleNext" ${articleIndex===articleQs.length-1?'disabled':''}>→</button>
      </div>
    </div>
  </div>`;
}

function recallCard(){
  const x=earlierLives[recallIndex];
  return `<div class="grid2">
    <div class="panel">
      <div class="row" style="justify-content:space-between">
        <span class="tag">EARLIER FAMOUS LIVES</span><strong>${recallIndex+1} / ${earlierLives.length}</strong>
      </div>
      <h2>${esc(x[0])}</h2>
      <p class="personText"><strong>${esc(x[1])}</strong>. ${esc(x[2])}</p>
      <div class="row" style="margin-top:13px">
        <button class="actionBtn" id="recallPrev" ${recallIndex===0?'disabled':''}>←</button>
        <button class="actionBtn" id="recallNext" ${recallIndex===earlierLives.length-1?'disabled':''}>→</button>
      </div>
    </div>
    <div class="panel">
      <h3>Connect the ideas</h3>
      <p class="question">Compare this person with one person from today.</p>
      <p>Use: <strong>They both … / Unlike … / One important difference is …</strong></p>
    </div>
  </div>`;
}

function finishCard(){
  return `<div class="timerBox">
    <span class="tag">30-SECOND CHALLENGE</span>
    <h2>Talent has no age limit.</h2>
    <p class="question">Choose two people from the lesson. Compare them using at least three lesson words.</p>
    <div class="wordBank center"><span>talent</span><span>determination</span><span>confidence</span><span>development</span><span>keep an open mind</span></div>
    <button class="actionBtn primary" id="startTimer">Start 30 seconds</button>
    <div class="clock" id="clock">30</div>
    <button class="actionBtn" id="finishModel">Show a model</button>
    <div class="feedback" id="finishFeedback"></div>
  </div>`;
}

function render(){
  $('#activities').innerHTML =
    accordion('1 · Warm-up · Famous People Quiz','Hard Mode · 15 unusual facts · score and streak.',warmupQuizCard(),true)+
    accordion('2 · Word Formation · Quizlet cards','compose → composer · composition and more.',wordFormCard())+
    accordion('3 · Word pairs + Famous people','Vocabulary plus embedded continuous texts about Putin, Khabensky and Ovechkin.',wordsAndPeople())+
    accordion('4 · Text details · Quick check','Short comprehension. Activities 21, 23 and 15 are removed.',quickCheckCard())+
    accordion('5 · To Be Old · Video + practice','Video, 6 True/False statements and Choose from words.',videoCard())+
    accordion('6 · Sentence · Phrase · Word','Choose useful language and explain your choice.',sentencePhraseWord())+
    accordion('7 · Celebrity Kids + Family Dinners','Original B1 texts with stative verbs and articles.',celebrityAndDinner())+
    accordion('8 · Recall · Earlier famous lives','Connect people from previous lessons.',recallCard())+
    accordion('9 · Finish · 30-second challenge','Transfer vocabulary and ideas to speaking.',finishCard());
  bindAll();
}

function rerenderKeepOpen(titlePrefix){
  const openTitles=$$('.activity[open] summary strong').map(x=>x.textContent);
  render();
  $$('.activity').forEach(d=>{
    const t=$('summary strong',d).textContent;
    d.open=openTitles.some(x=>t.startsWith(x.split(' · ')[0])) || (titlePrefix && t.startsWith(titlePrefix));
  });
}

function markAnswer(button,ok,feedbackEl,okMsg='Correct.',badMsg='Try again.'){
  button.classList.add(ok?'correct':'wrong');
  if(feedbackEl) feedbackEl.textContent=ok?okMsg:badMsg;
}

function bindAll(){
  $('#full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();

  if($('#startWarmupQuiz')) $('#startWarmupQuiz').onclick=()=>{
    warmupStarted=true;
    warmupFinished=false;
    warmupIndex=0;
    warmupScore=0;
    warmupStreak=0;
    warmupAnswered=false;
    warmupSelected='';
    rerenderKeepOpen('1');
  };

  $('[data-warmup-answer]').forEach(b=>b.onclick=()=>{
    if(warmupAnswered) return;
    const q=warmupQuiz[warmupIndex];
    warmupSelected=b.dataset.warmupAnswer;
    warmupAnswered=true;
    if(warmupSelected===q.answer){
      warmupScore++;
      warmupStreak++;
    }else{
      warmupStreak=0;
    }
    rerenderKeepOpen('1');
  });

  if($('#nextWarmupQuestion')) $('#nextWarmupQuestion').onclick=()=>{
    if(!warmupAnswered) return;
    if(warmupIndex>=warmupQuiz.length-1){
      warmupFinished=true;
      warmupStarted=false;
    }else{
      warmupIndex++;
      warmupAnswered=false;
      warmupSelected='';
    }
    rerenderKeepOpen('1');
  };

  if($('#restartWarmupQuiz')) $('#restartWarmupQuiz').onclick=()=>{
    warmupStarted=false;
    warmupFinished=false;
    warmupIndex=0;
    warmupScore=0;
    warmupStreak=0;
    warmupAnswered=false;
    warmupSelected='';
    rerenderKeepOpen('1');
  };

  if($('#wfFlash')) $('#wfFlash').onclick=()=>{wfBack=!wfBack;rerenderKeepOpen('2')};
  if($('#wfPrev')) $('#wfPrev').onclick=()=>{if(wfIndex>0){wfIndex--;wfBack=false;rerenderKeepOpen('2')}};
  if($('#wfNext')) $('#wfNext').onclick=()=>{if(wfIndex<wordFormCards.length-1){wfIndex++;wfBack=false;rerenderKeepOpen('2')}};

  if($('#vocabFlash')) $('#vocabFlash').onclick=()=>{vocabBack=!vocabBack;rerenderKeepOpen('3')};
  if($('#vocabPrev')) $('#vocabPrev').onclick=()=>{if(vocabIndex>0){vocabIndex--;vocabBack=false;rerenderKeepOpen('3')}};
  if($('#vocabNext')) $('#vocabNext').onclick=()=>{if(vocabIndex<vocab.length-1){vocabIndex++;vocabBack=false;rerenderKeepOpen('3')}};
  if($('#listenWord')) $('#listenWord').onclick=()=>{
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(vocab[vocabIndex][0]);
    u.lang='en-GB';
    const voices=speechSynthesis.getVoices();
    u.voice=voices.find(x=>x.lang==='en-GB')||null;
    speechSynthesis.speak(u);
  };
  $$('[data-person]').forEach(b=>b.onclick=()=>{personIndex=Number(b.dataset.person);rerenderKeepOpen('3')});

  $$('[data-quick]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.quick===quickCheck[quickIndex][1];
    markAnswer(b,ok,$('#quickFeedback'),'Correct.','Read the text again.');
  });
  if($('#quickPrev')) $('#quickPrev').onclick=()=>{if(quickIndex>0){quickIndex--;rerenderKeepOpen('4')}};
  if($('#quickNext')) $('#quickNext').onclick=()=>{if(quickIndex<quickCheck.length-1){quickIndex++;rerenderKeepOpen('4')}};

  if($('#restartVideo')) $('#restartVideo').onclick=()=>{
    const v=$('#oldVideo'); if(v){v.currentTime=0;v.play().catch(()=>{})}
  };
  $$('[data-video-pane]').forEach(b=>b.onclick=()=>{
    const pane=b.dataset.videoPane;
    $$('.taskPane').forEach(x=>x.classList.remove('active'));
    $$('.taskTabs .miniBtn').forEach(x=>x.classList.remove('active'));
    $('#videoPane-'+pane).classList.add('active'); b.classList.add('active');
  });
  $$('[data-vtf]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.vtf===videoTF[videoTfIndex][1];
    markAnswer(b,ok,$('#videoTfFeedback'),'Correct.','Watch that part again.');
  });
  if($('#videoTfPrev')) $('#videoTfPrev').onclick=()=>{if(videoTfIndex>0){videoTfIndex--;rerenderKeepOpen('5')}};
  if($('#videoTfNext')) $('#videoTfNext').onclick=()=>{if(videoTfIndex<videoTF.length-1){videoTfIndex++;rerenderKeepOpen('5')}};
  $$('[data-cword]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.cword===chooseWords[chooseIndex][1];
    markAnswer(b,ok,$('#chooseFeedback'),'Correct.','Try another word from the bank.');
  });
  if($('#choosePrev')) $('#choosePrev').onclick=()=>{if(chooseIndex>0){chooseIndex--;rerenderKeepOpen('5')}};
  if($('#chooseNext')) $('#chooseNext').onclick=()=>{if(chooseIndex<chooseWords.length-1){chooseIndex++;rerenderKeepOpen('5')}};

  if($('#spwModel')) $('#spwModel').onclick=()=>{
    $('#spwFeedback').textContent='Word: confidence. Phrase: keep an open mind. Sentence: “Appearance does not always tell us what a person is like.” I chose them because they connect the lesson’s vocabulary with its main idea.';
  };

  $$('[data-grammar]').forEach(b=>b.onclick=()=>{grammarPane=b.dataset.grammar;rerenderKeepOpen('7')});
  $$('[data-stative]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.stative===stativeQs[stativeIndex][1];
    markAnswer(b,ok,$('#stativeFeedback'),'Correct.','Check whether the verb describes a state or an action in progress.');
  });
  if($('#stativePrev')) $('#stativePrev').onclick=()=>{if(stativeIndex>0){stativeIndex--;grammarPane='stative';rerenderKeepOpen('7')}};
  if($('#stativeNext')) $('#stativeNext').onclick=()=>{if(stativeIndex<stativeQs.length-1){stativeIndex++;grammarPane='stative';rerenderKeepOpen('7')}};
  $$('[data-article]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.article===articleQs[articleIndex][1];
    markAnswer(b,ok,$('#articleFeedback'),'Correct.','Think about first mention, specific reference and fixed expressions.');
  });
  if($('#articlePrev')) $('#articlePrev').onclick=()=>{if(articleIndex>0){articleIndex--;grammarPane='articles';rerenderKeepOpen('7')}};
  if($('#articleNext')) $('#articleNext').onclick=()=>{if(articleIndex<articleQs.length-1){articleIndex++;grammarPane='articles';rerenderKeepOpen('7')}};

  if($('#recallPrev')) $('#recallPrev').onclick=()=>{if(recallIndex>0){recallIndex--;rerenderKeepOpen('8')}};
  if($('#recallNext')) $('#recallNext').onclick=()=>{if(recallIndex<earlierLives.length-1){recallIndex++;rerenderKeepOpen('8')}};

  if($('#startTimer')) $('#startTimer').onclick=()=>{
    clearInterval(lessonTimer);
    let n=30;
    $('#clock').textContent=n;
    lessonTimer=setInterval(()=>{
      n--;
      const el=$('#clock');
      if(!el){clearInterval(lessonTimer);return}
      el.textContent=n;
      if(n<=0) clearInterval(lessonTimer);
    },1000);
  };
  if($('#finishModel')) $('#finishModel').onclick=()=>{
    $('#finishFeedback').textContent='Ovechkin and Messi both developed successful careers in sport. Ovechkin is connected with ice hockey, while Messi is connected with football. Both stories show talent, development and long-term effort.';
  };
}

render();
