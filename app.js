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
  "9017":{type:"teacher"}
};

const views={login:document.getElementById('loginView'),student:document.getElementById('studentView'),teacher:document.getElementById('teacherView')};
const pinForm=document.getElementById('pinForm');
const pinInput=document.getElementById('pinInput');
const pinMessage=document.getElementById('pinMessage');
let activeStudent=null;

function showView(name){Object.values(views).forEach(v=>v.classList.add('hidden'));views[name].classList.remove('hidden');}
function logout(){activeStudent=null;pinInput.value='';pinMessage.textContent='';showView('login');}

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
  const nav=document.getElementById('moduleNav');
  nav.innerHTML='';
  student.modules.forEach((module,index)=>{
    const btn=document.createElement('button');
    btn.className='module-button'+(index===moduleIndex?' active':'');
    btn.textContent=module.name;
    btn.addEventListener('click',()=>renderStudent(student,index));
    nav.appendChild(btn);
  });
  const module=student.modules[moduleIndex];
  document.getElementById('lessonCount').textContent=module.lessons.length;
  const grid=document.getElementById('lessonGrid');
  grid.innerHTML='';
  module.lessons.forEach((lesson,index)=>{
    const card=document.createElement('article');card.className='lesson-card';
    card.innerHTML=`<div><span class="lesson-tag">LESSON ${index+1}</span><h3>${lesson}</h3><p class="muted">Interactive lesson space.</p></div><button type="button">Open lesson</button>`;
    card.querySelector('button').addEventListener('click',()=>alert('This lesson space is ready for content.'));
    grid.appendChild(card);
  });
}

function renderTeacher(){
  const grid=document.getElementById('teacherGrid');grid.innerHTML='';
  Object.values(accounts).filter(a=>a.type==='student').forEach(student=>{
    const card=document.createElement('article');card.className='student-card';
    const lessons=student.modules.reduce((sum,m)=>sum+m.lessons.length,0);
    card.innerHTML=`<div><span class="lesson-tag">STUDENT</span><h3>${student.name}</h3><p class="muted">${student.course}<br>${student.modules.length} modules · ${lessons} lessons</p></div><button type="button">Preview course</button>`;
    card.querySelector('button').addEventListener('click',()=>{activeStudent=student;renderStudent(student,0);showView('student');});
    grid.appendChild(card);
  });
}
