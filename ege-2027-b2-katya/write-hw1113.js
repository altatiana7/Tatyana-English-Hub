/* Домашняя работа Кати от 13 ноября: 3 письма (задание 37) и 3 эссе (задание 38) из тренажёров «Письмо 37» и «Задание 38».
   Темы – продолжение блока «Семья»: Family, Household Chores, Conflicts and Stress, Traits of Character.
   Письменные тексты проверяет учитель, ответы ученице не показываются, одна попытка (отправка по частям, shared/hw-parts.js).
   Черновик хранится в браузере до отправки. На сайте учителя работа открывается из «Проверки домашки» с образцами. */
const main=$('#main'),tabs=$('#tabs'),KEY='ege27k-write-hw1113',PG='write-hw1113';
const T=!!window.TEACHER,RV=KS.review(PG);
const L37=[53,102,101].map(id=>window.W37.find(x=>x.id===id));
const L38=[2,1,5].map(id=>window.W38.find(x=>x.id===id));
const LIM={37:{min:100,max:140,lo:90,hi:154},38:{min:200,max:250,lo:180,hi:275}};
const STEPS=[
 ...L37.map((x,i)=>({id:'l'+(i+1),n:37,x,label:'Письмо '+(i+1),min:20})),
 ...L38.map((x,i)=>({id:'e'+(i+1),n:38,x,label:'Эссе '+(i+1),min:40}))
];
const blank=()=>({w:STEPS.map(()=>'')});
let S=blank();
(function load(){
  if(RV){S=Object.assign(blank(),RV.data);return;}
  try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&Array.isArray(s.w))S=Object.assign(blank(),s);}catch(e){}
})();
const save=()=>{if(RV)return;try{localStorage.setItem(KEY,JSON.stringify({w:S.w}));}catch(e){}};
const txt=k=>(S.w&&S.w[k])||'';
const isDone=k=>words(txt(k))>=LIM[STEPS[k].n].lo;
let cur=0;
const P=KS.parts(PG,{units:()=>STEPS.map((s,k)=>({id:s.id,label:s.label,done:isDone(k),errors:null})),
  snapshot:()=>({w:S.w.slice()}),onUpdate:()=>redraw()});

function paintTabs(){tabs.innerHTML='';
  STEPS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':'')+(isDone(k)?' done':'')+(P.isSent(s.id)?' sent':''),'<i>'+(k+1)+'</i><span>'+s.label+'</span>');
    b.title=s.label;b.type='button';b.onclick=()=>go(k);tabs.append(b);});
  const on=tabs.querySelector('.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});P.refresh();}
function go(k){cur=k;Clock.set(STEPS[k].min*60);redraw();}
function redraw(){document.querySelectorAll('.overlay.smp').forEach(x=>x.remove());paintTabs();main.innerHTML='';draw();}
function head(ru){main.append(el('div','inst','<b>'+ru+'</b>'));}

/* ---------- задания ---------- */
function letterTask(x){
  const from=x.name+'@mail.uk',body=esc('…'+x.lead+' '+x.q.map(q=>q.t).join(' ')+'\n…'+x.trig+' …').replace(/\n/g,'<br>');
  return '<div class="kimtask"><span class="kimno">37</span><div>You have received an email message from your English-speaking pen-friend '+esc(x.name)+':</div></div>'+
    '<div class="kimmail"><div class="mr"><b>From:</b> '+from+'</div><div class="mr"><b>To:</b> Russian_friend@ege.ru</div><div class="mr"><b>Subject:</b> '+esc(x.subject||x.topic)+'</div><div class="mb">'+body+'</div></div>'+
    '<p>Write an email to '+esc(x.name)+'.<br>In your message:<br>– answer '+x.g+' questions;<br>– ask 3 questions about '+esc(x.about)+'.</p><p><b>Write 100–140 words.</b><br>Remember the rules of email writing.</p>';
}
function essayTask(x){
  return '<div class="kimtask"><span class="kimno">38</span><div>Imagine that you are doing a project on <b>'+esc(x.subj)+'</b>. You have found some data on the subject – the results of a survey conducted among '+esc(x.who)+' in Zetland (see the table below).<br><b>Comment on the survey data and give your opinion on the subject of the project.</b></div></div>'+
    '<div class="kimrow"><table class="kimtab"><tr><th colspan="2">The survey question:<br>'+esc(x.q)+'<br><i>Choose one option</i></th></tr><tr><th>'+esc(x.col)+'</th><th>Number of respondents (%)</th></tr>'+x.rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td>'+r[1]+'</td></tr>').join('')+'</table>'+
    '<div><p><b>Write 200–250 words.</b> Use the following plan:</p><ul class="kimplan"><li>– make an opening statement on the subject of the project;</li><li>– select and report 2–3 facts;</li><li>– make 1–2 comparisons where relevant and give your comments;</li><li>– outline a problem that can arise with '+esc(x.problem)+' and suggest a way of solving it;</li><li>– conclude by giving and explaining your opinion on '+esc(x.opinion)+'.</li></ul></div></div>';
}
function essaySample(x){const r=x.rows,d=r[0][1]-r[1][1],ra=r[2][1]/r[4][1],times=ra>=2.75?'about three times':ra>=1.85?'about twice':'noticeably more';
  return 'I am currently doing a project on '+x.subj+'. I have found some data on the subject – the results of a survey conducted among '+x.who+' in Zetland (see the table). I am going to comment on the survey data and give my opinion on the subject.\n\n'+
  'According to the table, when the respondents were asked “'+x.q+'”, the most popular answer was “'+r[0][0]+'”, chosen by '+r[0][1]+'% of them. The option “'+r[1][0]+'” came second with '+r[1][1]+'%. The least popular answer was “'+r[4][0]+'”, which only '+r[4][1]+'% of the '+x.who+' selected.\n\n'+
  'Comparing the figures, we can see that “'+r[0][0]+'” is '+d+' percentage points ahead of “'+r[1][0]+'”. Moreover, “'+r[2][0]+'” was chosen '+(times==='noticeably more'?'noticeably more often than':times+' as often as')+' “'+r[4][0]+'” ('+r[2][1]+'% against '+r[4][1]+'%). I suppose the reason is that the first options are closer to the everyday experience of most '+x.who+'.\n\n'+
  'However, a problem can arise with '+x.problem+': '+x.p+'. In my view, this problem can be solved: '+x.s+'.\n\n'+
  'In conclusion, I believe that '+x.o+'.';}

function draw(){
  const s=STEPS[cur],k=cur,x=s.x,n=s.n,lim=LIM[n],locked=!!RV||P.isSent(s.id);
  head(n===37?'Письмо '+(k+1)+' из 3 · задание 37 · '+x.topic+'. Рекомендуемое время – 20 минут.':'Эссе '+(k-2)+' из 3 · задание 38 · '+x.topic+'. Рекомендуемое время – 40 минут.');
  const stage=el('div','stage'),a=el('div','panel side kim kimsheet kimw'),b=el('div','panel grow col wr');a.style.flexBasis='50%';a.style.width='50%';
  a.innerHTML=n===37?letterTask(x):essayTask(x);
  const ta=el('textarea');ta.value=txt(k);ta.placeholder='Пишите здесь. Черновик сохраняется в этом браузере.';ta.spellcheck=false;ta.setAttribute('aria-label',s.label);if(locked)ta.disabled=true;
  const wc=el('div','wc'),num=el('b'),msg=el('span');wc.append(num,msg);
  const upd=()=>{const w=words(ta.value),ok=w>=lim.min&&w<=lim.max,soft=w>=lim.lo&&w<=lim.hi;num.textContent=w;num.className=ok?'ok':(w&&!soft?'bad':'');
    msg.textContent='слов · нужно '+lim.min+'–'+lim.max+(w&&w<lim.lo?' · меньше '+lim.lo+' слов – 0 баллов за задание':w>lim.hi?' · проверяются только первые '+lim.max+' слов':(w&&!ok?' · в пределах допустимых 10%':''));};
  ta.oninput=()=>{S.w[k]=ta.value;save();upd();const t=tabs.children[k];t&&t.classList.toggle('done',isDone(k));P.refresh();};upd();
  b.append(ta,wc);stage.append(a,b);main.append(stage);
  const nav=el('div','navrow');
  nav.append(btn('← Назад',()=>go(k-1),'sm'));nav.children[0].disabled=k===0;
  if(T){nav.append(btn('Образец',()=>showSample(s.label+' · образец',n===37?sampleParas(ED.t('lt.'+x.id+'-'+x.name+'.model',x.model)):sampleParas(essaySample(x)),'Образец составлен для сайта. Это не единственно верный ответ.'),'main'));}
  nav.append(el('span','note',locked&&!RV?'Это задание отправлено учителю.':RV?'Работа ученицы. Оцените по критериям ФИПИ.':'Пишите без словаря и переводчика. Текст оценит учитель по критериям ФИПИ.'));
  if(k<STEPS.length-1)nav.append(btn('Дальше: '+STEPS[k+1].label+' →',()=>go(k+1),'main sp'));
  main.append(nav);
}
Clock.mount();{const hb=document.querySelector('header.bar'),ck=hb&&hb.querySelector('.clock');if(hb&&!RV)hb.insertBefore(P.bar(()=>STEPS[cur].id,{compact:true}),ck);}
if(RV)main.before(KS.reviewBar(RV));
go(0);
