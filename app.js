const accounts={
  "3142":{type:"student",id:"maya",name:"Maya",course:"English File Pre-Intermediate",subtitle:"Modules, vocabulary, speaking and homework",modules:[
    {name:"Module 1",lessons:["Appearance","Dating & first impressions","Jenny & Rob"]},
    {name:"Module 2",lessons:["Coming soon"]}
  ]},
  "5274":{type:"student",id:"nikita",name:"Nikita",course:"Outcomes Pre-Intermediate",subtitle:"Interactive lessons, vocabulary and grammar practice",modules:[
    {name:"Unit 7",lessons:["Revision"]},
    {name:"Unit 8",lessons:["Crime & unusual stories","Past tenses review","Future forms"]}
  ]},
  "8631":{type:"student",id:"gabi",name:"Gabi",course:"English Course",subtitle:"School English, vocabulary, video and skills",modules:[
    {name:"Module 1",lessons:["Life plans","Big decisions"]},
    {name:"Module 2",lessons:["Coming soon"]}
  ]},
  "2512":{type:"teacher"}
};

const views={login:document.getElementById('loginView'),student:document.getElementById('studentView'),teacher:document.getElementById('teacherView')};
const pinForm=document.getElementById('pinForm');
const pinInput=document.getElementById('pinInput');
const pinMessage=document.getElementById('pinMessage');
let activeStudent=null;
let currentTeacherStage=0;

const crimeVocab=[
  ["commit a crime","совершить преступление"],["suspect","подозреваемый"],["witness","свидетель"],["evidence","доказательства"],["alibi","алиби"],["arrest","арестовать"],["charge someone with","обвинить кого-либо в"],["plead guilty","признать вину"],["plead not guilty","не признать вину"],["trial","судебный процесс"],["jury","присяжные"],["verdict","вердикт"],["sentence","приговор / назначить наказание"],["fine","штраф"],["community service","общественные работы"],["prison sentence","тюремный срок"],["get away with","избежать наказания за"],["break into","вломиться"],["rob","ограбить человека/место"],["steal","украсть вещь"],["burglary","кража со взломом"],["robbery","ограбление"],["fraud","мошенничество"],["assault","нападение"],["reasonable doubt","обоснованное сомнение"],["prosecution","сторона обвинения"],["defence","сторона защиты"],["confess","признаться"],["forensic evidence","криминалистические доказательства"],["wrongfully convicted","ошибочно осуждённый"]
];

const warmup=[
  "Privacy or security: which should the law protect more strongly?",
  "Is lying ever justified if it prevents a crime?",
  "A clever criminal or an incompetent police officer: which is more dangerous?",
  "A job you love with low pay, or a boring job with a high salary?",
  "One foreign language at C2, or three languages at B2?",
  "Should a person with a clean record always get a lighter first sentence?"
];

const collocationQuiz=[
  ["The police finally ___ the suspect with fraud.",["charged","sentenced","stole"],0],
  ["The witness gave evidence ___ court.",["in","on","at"],0],
  ["The defendant decided to plead ___.",["guilty","crime","sentence"],0],
  ["The jury reached a unanimous ___.",["verdict","evidence","alibi"],0],
  ["The burglar tried to ___ with the crime.",["get away","break","charge"],0],
  ["She was sentenced ___ six months in prison.",["to","for","with"],0],
  ["Someone broke ___ the office during the night.",["into","away","over"],0],
  ["The defence argued there was reasonable ___.",["doubt","trial","fine"],0]
];

const pastQuiz=[
  ["When the police arrived, the suspect ___ through the back door.",["was escaping","escaped","had escaped"],0],
  ["By the time detectives checked the CCTV, someone ___ the recording.",["had deleted","deleted","was deleting"],0],
  ["The witness ___ home when she heard a crash.",["was walking","walked","had walked"],0],
  ["Investigators ___ the room for two hours before they found the phone.",["had been searching","searched","were searched"],0],
  ["The suspect said he ___ the victim before that evening.",["had never met","never met","was never meeting"],0],
  ["While the lawyer ___ the witness, the judge interrupted.",["was questioning","questioned","had questioned"],0],
  ["The alarm ___ at 11:42 p.m.",["went off","was going off","had gone off"],0],
  ["After the jury ___ all the evidence, they returned to the courtroom.",["had considered","were considering","consider"],0]
];

const listeningText="Angus: Today on Legal Matters we are looking at a late-night burglary. The police arrested a university student after a witness said she had seen him near the building. Helen, you are acting for the defence. Is that strong evidence? Helen: Not by itself. The witness saw a man from across the street, in poor light, for only a few seconds. Angus: But the police also found the student's phone close to the scene. Helen: That sounds important, but he says the phone had been stolen earlier that evening. The prosecution must prove more than suspicion. We also know that CCTV from a nearby shop shows another person entering the street at 11:38. Angus: So your argument is reasonable doubt? Helen: Exactly. A court should consider the whole chain of evidence, not one dramatic detail.";

const listeningQuiz=[
  ["Why was the student arrested?",["A witness placed him near the building","He confessed immediately","His fingerprints were on the window"],0],
  ["What weakness does Helen identify in the witness evidence?",["Poor viewing conditions","The witness knew the suspect","The witness changed jobs"],0],
  ["What does the student say about his phone?",["It had been stolen","He left it at home","It belonged to the victim"],0],
  ["What does the CCTV show?",["Another person entering the street","The student breaking a window","The witness leaving the city"],0],
  ["What is Helen's main legal point?",["The whole chain of evidence matters","Phone evidence is always unreliable","Witnesses should not testify"],0]
];

const tedVocab=[
  ["a shard of glass","осколок стекла"],["bloody fingerprints","окровавленные отпечатки"],["eyewitness","очевидец"],["find a match","найти совпадение"],["confess","признаться"],["friction ridges","папиллярные линии"],["forensic evidence","криминалистические доказательства"],["reliable","надёжный"],["wrongfully convicted","ошибочно осуждённый"],["corroborate evidence","подтвердить доказательства другими данными"]
];

const tedTF=[
  ["The historical case in the video took place in 1902.",true],
  ["Detectives had several eyewitnesses from the beginning.",false],
  ["A piece of broken glass carried bloody fingerprints.",true],
  ["The investigators never found a fingerprint match.",false],
  ["Fingerprint evidence is still common in criminal courts.",true],
  ["The video presents fingerprint analysis as completely error-proof.",false]
];

const tedComp=[
  ["What problem did detectives face at the start of the 1902 case?",["They had no eyewitnesses","They had too many suspects","The crime scene had been cleaned"],0],
  ["What made the broken glass important?",["It carried fingerprints","It contained DNA from three people","It showed the time of the crime"],0],
  ["What is the video's central question?",["How reliable fingerprint evidence is","Why people commit burglary","How juries reach verdicts"],0],
  ["Why should forensic evidence be corroborated?",["Human analysis can make mistakes","Fingerprints disappear after one hour","Courts do not accept fingerprints"],0],
  ["What is the strongest legal conclusion?",["Use fingerprints as part of a wider body of evidence","Treat every fingerprint match as final proof","Ignore forensic evidence entirely"],0]
];

const teacherStages=[
  {label:"Warm-up",title:"English Reboot",subtitle:"Fast choices. No “it depends”.",render:()=>`<div class="prompt-grid">${warmup.map((q,i)=>`<article class="prompt-card"><span>${i+1}</span><p>${q}</p></article>`).join('')}</div>`},
  {label:"Vocabulary",title:"Crime Vocabulary",subtitle:"Click a card to reveal the Russian meaning.",render:()=>`<div class="vocab-grid">${crimeVocab.map(([en,ru])=>`<button class="vocab-card" type="button"><strong>${en}</strong><span>${ru}</span></button>`).join('')}</div>`},
  {label:"Workout",title:"Collocation Workout",subtitle:"Choose the natural legal collocation.",render:()=>quizHTML(collocationQuiz,"collocation")},
  {label:"Listening",title:"Legal Matters",subtitle:"Listen first. Transcript stays hidden until you need it.",render:()=>`<div class="media-panel"><div class="media-actions"><button class="primary-button" id="playListening">Play listening</button><button class="secondary-button" id="toggleTranscript">Show transcript</button></div><div id="listeningTranscript" class="transcript hidden">${listeningText}</div></div>${quizHTML(listeningQuiz,"listening")}`},
  {label:"Past Tenses",title:"Crime Scene Grammar",subtitle:"Past Simple, Past Continuous, Past Perfect and Past Perfect Continuous.",render:()=>quizHTML(pastQuiz,"past")},
  {label:"TED Words",title:"TED-Ed Vocabulary",subtitle:"Vocabulary before viewing: fingerprint evidence.",render:()=>`<div class="vocab-grid compact">${tedVocab.map(([en,ru])=>`<button class="vocab-card" type="button"><strong>${en}</strong><span>${ru}</span></button>`).join('')}</div><a class="video-link" href="https://www.ted.com/talks/theodore_e_yeshion_how_did_detectives_solve_the_case_of_the_bloody_fingerprints" target="_blank" rel="noopener">Open TED-Ed video</a>`},
  {label:"TED T/F",title:"Watch: True or False",subtitle:"Watch once for the main ideas, then decide.",render:()=>tfHTML(tedTF)},
  {label:"TED Check",title:"Video Comprehension",subtitle:"Choose the best answer after the second viewing.",render:()=>quizHTML(tedComp,"ted")},
  {label:"Final Case",title:"You Are the Defence",subtitle:"Use the target vocabulary and past tenses to build an argument.",render:()=>`<div class="case-file"><div class="case-head"><span>CASE 24-08</span><strong>The Missing Laptop</strong></div><p>At 8:20 p.m. a laptop disappeared from a university office. A security guard saw a student leaving the corridor at 8:25. The student says he had been meeting a tutor in the next building. His access card was used at the office door at 8:17, but he says he had lent the card to a classmate earlier. A partial fingerprint was found on the desk, but it cannot be matched conclusively. CCTV from the main entrance was not working.</p><div class="case-prompts"><p><b>1.</b> What evidence supports the prosecution?</p><p><b>2.</b> What creates reasonable doubt?</p><p><b>3.</b> Which witness would you question first?</p><p><b>4.</b> Give a 45-second defence statement using at least six target expressions.</p></div><div class="target-strip">alibi · witness · evidence · charge · reasonable doubt · forensic evidence · plead not guilty · verdict · get away with · sentence</div></div>`}
];

function quizHTML(items,prefix){return `<div class="quiz-list">${items.map((item,qi)=>`<article class="quiz-row"><p><b>${qi+1}.</b> ${item[0]}</p><div class="option-row">${item[1].map((opt,oi)=>`<button type="button" class="quiz-option" data-correct="${oi===item[2]}" data-group="${prefix}-${qi}">${opt}</button>`).join('')}</div></article>`).join('')}</div>`}
function tfHTML(items){return `<div class="quiz-list">${items.map((item,qi)=>`<article class="quiz-row"><p><b>${qi+1}.</b> ${item[0]}</p><div class="option-row"><button type="button" class="quiz-option" data-correct="${item[1]===true}" data-group="tf-${qi}">True</button><button type="button" class="quiz-option" data-correct="${item[1]===false}" data-group="tf-${qi}">False</button></div></article>`).join('')}</div>`}

function showView(name){Object.values(views).forEach(v=>v.classList.add('hidden'));views[name].classList.remove('hidden');}
function logout(){closeTeacherLesson();activeStudent=null;pinInput.value='';pinMessage.textContent='';showView('login');}

document.getElementById('studentLogout').addEventListener('click',logout);
document.getElementById('teacherLogout').addEventListener('click',logout);

pinForm.addEventListener('submit',e=>{
  e.preventDefault();
  const pin=pinInput.value.trim();
  const account=accounts[pin];
  if(!account){pinMessage.textContent='That PIN is not recognised. Please try again.';pinInput.select();return;}
  pinMessage.textContent='';
  if(account.type==='teacher'){renderTeacher();showView('teacher');return;}
  activeStudent=account;renderStudent(account,0);showView('student');
});

function renderStudent(student,moduleIndex){
  document.getElementById('studentName').textContent=student.name;
  document.getElementById('courseName').textContent=student.course;
  document.getElementById('workspaceTitle').textContent=student.course;
  document.getElementById('workspaceSubtitle').textContent=student.subtitle;
  const nav=document.getElementById('moduleNav');nav.innerHTML='';
  student.modules.forEach((module,index)=>{const btn=document.createElement('button');btn.className='module-button'+(index===moduleIndex?' active':'');btn.textContent=module.name;btn.addEventListener('click',()=>renderStudent(student,index));nav.appendChild(btn);});
  const module=student.modules[moduleIndex];document.getElementById('lessonCount').textContent=module.lessons.length;
  const grid=document.getElementById('lessonGrid');grid.innerHTML='';
  module.lessons.forEach((lesson,index)=>{const card=document.createElement('article');card.className='lesson-card';card.innerHTML=`<div><span class="lesson-tag">LESSON ${index+1}</span><h3>${lesson}</h3><p class="muted">Interactive lesson space.</p></div><button type="button">Open lesson</button>`;card.querySelector('button').addEventListener('click',()=>alert('This lesson space is ready for content.'));grid.appendChild(card);});
}

function renderTeacher(){
  const grid=document.getElementById('teacherGrid');grid.innerHTML='';
  Object.values(accounts).filter(a=>a.type==='student').forEach(student=>{
    const card=document.createElement('article');card.className='student-card';
    const isNikita=student.id==='nikita';
    card.innerHTML=`<div><span class="lesson-tag">${isNikita?'READY FOR CLASS':'STUDENT'}</span><h3>${student.name}</h3><p class="muted">${student.course}${isNikita?'<br>Crime & Past Tenses · teacher lesson':''}</p></div><button type="button">${isNikita?'Open teacher lesson':'Preview course'}</button>`;
    card.querySelector('button').addEventListener('click',()=>{if(isNikita){openTeacherLesson();}else{activeStudent=student;renderStudent(student,0);showView('student');}});grid.appendChild(card);
  });
}

function openTeacherLesson(){
  closeTeacherLesson();currentTeacherStage=0;
  const shell=document.createElement('div');shell.id='teacherLessonShell';shell.className='teacher-lesson-shell';
  shell.innerHTML=`<aside class="lesson-sidebar"><div><p class="eyebrow">OUTCOMES PRE-INTERMEDIATE</p><h2>Crime & Past Tenses</h2><p class="lesson-side-copy">Teacher lesson</p></div><nav id="teacherStageNav"></nav><button class="ghost-button" id="closeTeacherLesson">Back to dashboard</button></aside><main class="lesson-stage"><header class="lesson-stage-header"><div><p class="eyebrow" id="stageKicker"></p><h1 id="stageTitle"></h1><p class="muted" id="stageSubtitle"></p></div><div class="progress-pill"><span id="stageNumber"></span> / ${teacherStages.length}</div></header><section id="stageContent" class="stage-content"></section><footer class="stage-footer"><button id="prevStage" class="secondary-button">Previous</button><button id="nextStage" class="primary-button">Next</button></footer></main>`;
  document.body.appendChild(shell);document.body.classList.add('lesson-open');
  document.getElementById('closeTeacherLesson').addEventListener('click',closeTeacherLesson);
  renderTeacherStage(0);
}

function closeTeacherLesson(){const el=document.getElementById('teacherLessonShell');if(el)el.remove();document.body.classList.remove('lesson-open');if('speechSynthesis'in window)window.speechSynthesis.cancel();}

function renderTeacherStage(index){
  currentTeacherStage=Math.max(0,Math.min(index,teacherStages.length-1));
  const stage=teacherStages[currentTeacherStage];
  const nav=document.getElementById('teacherStageNav');nav.innerHTML='';teacherStages.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='lesson-nav-btn'+(i===currentTeacherStage?' active':'');b.textContent=`${i+1}. ${s.label}`;b.addEventListener('click',()=>renderTeacherStage(i));nav.appendChild(b);});
  document.getElementById('stageKicker').textContent='OUTCOMES PRE-INTERMEDIATE';document.getElementById('stageTitle').textContent=stage.title;document.getElementById('stageSubtitle').textContent=stage.subtitle;document.getElementById('stageNumber').textContent=currentTeacherStage+1;document.getElementById('stageContent').innerHTML=stage.render();
  document.getElementById('prevStage').disabled=currentTeacherStage===0;document.getElementById('nextStage').disabled=currentTeacherStage===teacherStages.length-1;document.getElementById('prevStage').onclick=()=>renderTeacherStage(currentTeacherStage-1);document.getElementById('nextStage').onclick=()=>renderTeacherStage(currentTeacherStage+1);
  bindStageInteractions();document.querySelector('.lesson-stage').scrollTop=0;
}

function bindStageInteractions(){
  document.querySelectorAll('.vocab-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('revealed')));
  document.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>{const group=btn.dataset.group;document.querySelectorAll(`.quiz-option[data-group="${group}"]`).forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(btn.dataset.correct==='true'?'correct':'wrong');if(btn.dataset.correct!=='true'){const right=[...document.querySelectorAll(`.quiz-option[data-group="${group}"]`)].find(b=>b.dataset.correct==='true');if(right)right.classList.add('correct');}}));
  const play=document.getElementById('playListening');if(play)play.addEventListener('click',()=>{if(!('speechSynthesis'in window)){alert('Audio is not supported in this browser.');return;}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(listeningText);u.lang='en-GB';u.rate=.92;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith('en-gb'))||voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith('en'))||null;window.speechSynthesis.speak(u);});
  const toggle=document.getElementById('toggleTranscript');if(toggle)toggle.addEventListener('click',()=>{const t=document.getElementById('listeningTranscript');t.classList.toggle('hidden');toggle.textContent=t.classList.contains('hidden')?'Show transcript':'Hide transcript';});
}
