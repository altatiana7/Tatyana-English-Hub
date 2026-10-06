/* Домашняя часть диагностики: аудирование 1–9, чтение 10 и 12–18, письмо 37 и 38.
   Работа длинная, поэтому черновик хранится в этом браузере до нажатия «Очистить всё». */
const D=window.DIAG,main=$('#main'),tabs=$('#tabs'),KEY='ege2027b2-home1';
const blank=()=>({l1:{},l2:{},l3:{},r10:{},r12:{},w37:'',w38:'',q3:0,q12:0,checked:false});
const NAMES=['Рита','Катя'];let who=0;try{who=+localStorage.getItem(KEY+'-who')||0;}catch(e){}
let S=blank();const load=()=>{S=blank();try{const s=JSON.parse(localStorage.getItem(KEY+'-'+who)||'null');if(s)S=Object.assign(blank(),s);}catch(e){}};load();
const save=()=>{try{localStorage.setItem(KEY+'-'+who,JSON.stringify(S));}catch(e){}};
function paintWho(){const w=$('#who');w.innerHTML='';NAMES.forEach((n,i)=>{const b=el('button','tab'+(i===who?' on':''),n);b.type='button';b.onclick=()=>{who=i;try{localStorage.setItem(KEY+'-who',i);}catch(e){}load();paintWho();go(0);};w.append(b);});}
let cur=0;const AG='ABCDEFG';
const audio=el('audio','main');audio.controls=true;audio.preload='none';audio.src='audio/listening.mp3';
const EMAIL={from:'Emily@mail.uk',to:'Russian_friend@ege.ru',subj:'School rules',
 body:'…Our school has just banned mobile phones in class, and everybody is talking about it. Do you use your phone at school, and what for? How do you usually prepare for important tests? What would you change about your school timetable if you could?\n…By the way, I have just joined our school debate club…',about:'her debate club'};
const PROJ={subj:'what skills teenagers in Zetland consider most important for their future career',rows:[['Communication skills',34],['Knowledge of foreign languages',27],['Digital skills',21],['Time management',12],['Creativity',6]],col:'Skill',
 problem:'developing skills for a future career',opinion:'the importance of preparing for a future career in one’s school years'};

const STEPS=[
 {id:'l1',label:'Аудир. 1',min:0,draw:lis1},{id:'l2',label:'Аудир. 2',min:0,draw:lis2},{id:'l3',label:'Аудир. 3–9',min:0,draw:lis3},
 {id:'r10',label:'Чтение 10',min:8,draw:read10},{id:'r12',label:'Чтение 12–18',min:15,draw:read12},
 {id:'w37',label:'Письмо 37',min:20,draw:()=>writing(37)},{id:'w38',label:'Письмо 38',min:40,draw:()=>writing(38)},
 {id:'rep',label:'Отчёт',min:0,draw:report}
];
const cnt=o=>Object.keys(o).filter(k=>o[k]!=null&&o[k]!=='').length;
function isDone(id){return id==='l1'?cnt(S.l1)===6:id==='l2'?cnt(S.l2)===7:id==='l3'?cnt(S.l3)===7:id==='r10'?cnt(S.r10)===7:id==='r12'?cnt(S.r12)===7:id==='w37'?words(S.w37)>=90:id==='w38'?words(S.w38)>=180:S.checked;}
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab'+(k===cur?' on':'')+(isDone(s.id)?' done':''),s.label);b.type='button';b.onclick=()=>go(k);tabs.append(b);});
  const on=tabs.querySelector('.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});}
function go(k){cur=k;if(k>2)audio.pause();Clock.set(STEPS[k].min*60);redraw();}
function redraw(){paintTabs();main.innerHTML='';STEPS[cur].draw();}
function nextBtn(){return btn('Дальше: '+STEPS[cur+1].label+' →',()=>go(cur+1),'main sp');}
function head(ru,src){main.append(el('div','inst','<b>'+ru+'</b>'+(src?'<span class="src">'+src+'</span>':'')));}
function lisHead(ru){head(ru);const r=el('div','navrow');r.append(audio);main.append(r);}
function lock(e){if(S.checked)e.disabled=true;return e;}
function mark(ok){return S.checked?(ok?' ok':' bad'):'';}

/* ---------- Аудирование ---------- */
function lis1(){
  lisHead('Задание 1. Вы услышите 6 высказываний. Установите соответствие между высказываниями каждого говорящего A–F и утверждениями 1–7. Каждое утверждение используется только один раз, одно утверждение лишнее. Запись звучит дважды.');
  const stage=el('div','stage'),a=el('div','panel grow'),b=el('div','panel side');
  a.append(el('ol','hl',D.lis.s1.map(x=>'<li>'+esc(x)+'</li>').join('')));a.firstChild.style.listStyle='decimal';a.firstChild.style.paddingLeft='26px';a.firstChild.style.fontSize='20px';
  const m=el('div','match');'ABCDEF'.split('').forEach((L,k)=>{const s=lock(el('select',mark(S.l1[k]===D.lis.k1[k]).trim()));s.setAttribute('aria-label','Говорящий '+L);s.append(new Option('…',''));for(let n=1;n<=7;n++)s.append(new Option(n,n));s.value=S.l1[k]||'';
    s.onchange=()=>{S.l1[k]=s.value?+s.value:null;save();paintTabs();};m.append(el('b',null,'Говорящий '+L+(S.checked&&S.l1[k]!==D.lis.k1[k]?' → '+D.lis.k1[k]:'')),s);});
  b.append(m);stage.append(a,b);main.append(stage);
  const nav=el('div','navrow');nav.append(el('span','note','Одна запись на все задания 1–9 (около 31 минуты, паузы уже внутри). Включите её один раз и не останавливайте, как на экзамене.'),nextBtn());main.append(nav);
}
function lis2(){
  lisHead('Задание 2. Вы услышите диалог. Определите, какие из утверждений A–G соответствуют содержанию текста (1 – True), какие не соответствуют (2 – False) и о чём в тексте не сказано (3 – Not stated). Запись звучит дважды.');
  const stage=el('div','stage'),a=el('div','panel grow');const names=['True','False','Not stated'];
  D.lis.s2.forEach((t,k)=>{const r=el('div','score');r.style.fontSize='19px';r.append(el('span',null,'<b>'+AG[k]+'</b> '+esc(t)));
    names.forEach((nm,j)=>{const b=lock(el('button',S.l2[k]===j+1?'on':'',(j+1)+' · '+nm));b.type='button';b.style.minWidth='122px';
      if(S.checked){if(j+1===D.lis.k2[k])b.style.cssText+='border-color:var(--ok);background:var(--okbg);color:#12603c';else if(S.l2[k]===j+1)b.style.cssText+='border-color:var(--bad);background:var(--badbg);color:#8f1f1f';}
      b.onclick=()=>{S.l2[k]=j+1;save();redraw();};r.append(b);});a.append(r);});
  stage.append(a);main.append(stage);const nav=el('div','navrow');nav.append(btn('← Аудир. 1',()=>go(0),'sm'),nextBtn());main.append(nav);
}
function chipsQ(first,n,curK,sel,key,okFn){const c=el('div','chips');for(let k=0;k<n;k++){const b=el('button','chip'+(k===curK?' on':'')+(S.checked?(okFn(k)?' ok':' bad'):(sel[k]!=null?' fill':'')),String(first+k));b.type='button';b.onclick=()=>{S[key]=k;save();redraw();};c.append(b);}return c;}
function qCard(q,opts,first,k,sel,right,cls){const card=el('div','panel grow qcard');card.append(el('div','qhead','<span class="qnum">'+(first+k)+'</span>'));card.append(el('div','qtext long',esc(q)));
  const o=el('div','opts '+cls);opts.forEach((w,j)=>{const b=lock(el('button','opt'+(S.checked?(j+1===right?' ok':(sel[k]===j+1?' bad':'')):(sel[k]===j+1?' sel':'')),(j+1)+') '+esc(w)));b.type='button';b.onclick=()=>{sel[k]=j+1;save();redraw();};o.append(b);});card.append(o);return card;}
function lis3(){
  lisHead('Задания 3–9. Вы услышите интервью. В заданиях 3–9 выберите вариант ответа 1, 2 или 3. Запись звучит дважды.');
  const k=S.q3,q=D.lis.mc[k],stage=el('div','stage');stage.append(qCard(q[0],q[1],3,k,S.l3,D.lis.k3[k],'c3'));main.append(stage);
  const nav=el('div','navrow');nav.append(chipsQ(3,7,k,S.l3,'q3',i=>S.l3[i]===D.lis.k3[i]),btn('← Назад',()=>{S.q3--;redraw();},'sm'),btn('Вперёд →',()=>{S.q3++;redraw();},'sm'),nextBtn());
  nav.children[1].disabled=k===0;nav.children[2].disabled=k===6;main.append(nav);
}

/* ---------- Чтение ---------- */
function read10(){
  head('Задание 10. Установите соответствие между текстами A–G и заголовками 1–8. Используйте каждую цифру только один раз. В задании один заголовок лишний.','Открытый банк ФИПИ');
  const stage=el('div','stage'),a=el('div','panel grow read'),b=el('div','panel side');
  D.r10.t.forEach((t,k)=>a.append(el('p',null,'<b>'+AG[k]+'.</b> '+esc(t))));
  b.append(el('ol','hl',D.r10.h.map((x,k)=>'<li><b>'+(k+1)+'.</b> '+esc(x)+'</li>').join('')));
  const m=el('div','match');m.style.gridTemplateColumns='auto 1fr auto 1fr';AG.split('').forEach((L,k)=>{const s=lock(el('select',mark(S.r10[k]===D.r10.a[k]).trim()));s.setAttribute('aria-label','Текст '+L);s.append(new Option('…',''));for(let n=1;n<=8;n++)s.append(new Option(n,n));s.value=S.r10[k]||'';
    s.onchange=()=>{S.r10[k]=s.value?+s.value:null;save();paintTabs();};m.append(el('b',null,L+(S.checked&&S.r10[k]!==D.r10.a[k]?' → '+D.r10.a[k]:'')),s);});
  b.append(m);stage.append(a,b);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Рекомендуемое время – 8 минут. Таймер запускается кнопкой «Старт» вверху.'),nextBtn());main.append(nav);
}
function read12(){
  head('Задания 12–18. Прочитайте текст и выберите вариант ответа 1, 2, 3 или 4.','Открытый банк ФИПИ');
  const k=S.q12,q=D.r12.q[k],stage=el('div','stage'),a=el('div','panel grow read');a.append(el('h3',null,esc(D.r12.title)));D.r12.p.forEach(p=>a.append(el('p',null,esc(p))));
  const card=qCard(q.q,q.o,12,k,S.r12,D.r12.a[k],'c1');card.classList.remove('grow');card.classList.add('side');card.style.justifyContent='flex-start';card.querySelector('.qtext').style.fontSize='20px';card.querySelectorAll('.opt').forEach(o=>{o.style.fontSize='18px';o.style.padding='7px 10px';});
  stage.append(a,card);main.append(stage);
  const nav=el('div','navrow');nav.append(chipsQ(12,7,k,S.r12,'q12',i=>S.r12[i]===D.r12.a[i]),btn('← Назад',()=>{S.q12--;redraw();},'sm'),btn('Вперёд →',()=>{S.q12++;redraw();},'sm'),nextBtn());
  nav.children[1].disabled=k===0;nav.children[2].disabled=k===6;main.append(nav);
}

/* ---------- Письмо ---------- */
const LIM={37:{min:100,max:140,lo:90,hi:154},38:{min:200,max:250,lo:180,hi:275}};
function writing(n){
  const key='w'+n,L=LIM[n];
  head(n===37?'Задание 37. Электронное письмо личного характера. Рекомендуемое время – 20 минут.':'Задание 38. Письменное высказывание с элементами рассуждения на основе таблицы. Рекомендуемое время – 40 минут.','Задание составлено для сайта по образцу демоверсии ФИПИ');
  const stage=el('div','stage'),a=el('div','panel side kim'),b=el('div','panel grow col wr');a.style.fontSize='18px';a.style.flexBasis='46%';a.style.width='46%';
  if(n===37){a.innerHTML='<p class="task">You have received an email message from your English-speaking pen-friend Emily:</p><div class="stim"><div class="hd">From: '+EMAIL.from+'<br>To: '+EMAIL.to+'<br>Subject: '+EMAIL.subj+'</div>'+esc(EMAIL.body).replace(/\n/g,'<br>')+'</div><p class="task" style="margin-top:8px">Write an email to Emily.<br>In your message:<br>– answer her questions;<br>– ask 3 questions about '+EMAIL.about+'.</p><p class="task">Write 100–140 words.<br>Remember the rules of email writing.</p>';}
  else{a.innerHTML='<p class="task">Imagine that you are doing a project on '+PROJ.subj+'. You have found some data on the subject – the results of the opinion polls (see the table below).</p><p class="task">Comment on the data in the table and give your opinion on the subject of the project.</p><table class="t"><tr><th>'+PROJ.col+'</th><th>Number of respondents (%)</th></tr>'+PROJ.rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</table><p class="task">Write 200–250 words.<br>Use the following plan:</p><ul style="list-style:none;padding-left:4px"><li>– make an opening statement on the subject of the project;</li><li>– select and report 2–3 facts;</li><li>– make 1–2 comparisons where relevant and give your comments;</li><li>– outline a problem that can arise with '+PROJ.problem+' and suggest a way of solving it;</li><li>– conclude by giving and explaining your opinion on '+PROJ.opinion+'.</li></ul>';}
  const ta=lock(el('textarea'));ta.value=S[key];ta.placeholder='Пишите здесь. Черновик сохраняется в этом браузере.';ta.spellcheck=false;ta.setAttribute('aria-label','Ответ на задание '+n);
  const wc=el('div','wc'),num=el('b'),msg=el('span');wc.append(num,msg);
  const upd=()=>{const w=words(ta.value),ok=w>=L.min&&w<=L.max,soft=w>=L.lo&&w<=L.hi;num.textContent=w;num.className=ok?'ok':(w&&!soft?'bad':'');
    msg.textContent='слов · нужно '+L.min+'–'+L.max+(w&&w<L.lo?' · меньше '+L.lo+' слов – 0 баллов за задание':w>L.hi?' · проверяются только первые '+L.max+' слов':(w&&!ok?' · в пределах допустимых 10%':''));};
  ta.oninput=()=>{S[key]=ta.value;save();upd();const t=tabs.children[cur];t&&t.classList.toggle('done',isDone(key));};upd();
  b.append(ta,wc);stage.append(a,b);main.append(stage);
  const nav=el('div','navrow');nav.append(el('span','note','Пишите без словаря и переводчика: это диагностика, а не оценка.'),nextBtn());main.append(nav);
}

/* ---------- Отчёт ---------- */
const errs=(sel,key)=>key.filter((a,k)=>sel[k]!==a).length;
const by3=e=>e===0?3:e===1?2:e===2?1:0,by2=e=>e===0?2:e===1?1:0;
function scores(){return [['Аудирование 1',by2(errs(S.l1,D.lis.k1)),2],['Аудирование 2',by3(errs(S.l2,D.lis.k2)),3],['Аудирование 3–9',7-errs(S.l3,D.lis.k3),7],['Чтение 10',by3(errs(S.r10,D.r10.a)),3],['Чтение 12–18',7-errs(S.r12,D.r12.a),7]];}
function line(lbl,sel,key,first,letters){return lbl+': '+key.map((a,k)=>(letters?letters[k]:first+k)+'='+(sel[k]==null?'–':sel[k])+(sel[k]===a?'':' (верно '+a+')')).join(', ');}
function reportText(){const r=scores();return 'ЕГЭ 2027 · диагностика · домашняя часть · '+NAMES[who]+'\n'+r.map(x=>x[0]+': '+x[1]+' / '+x[2]).join('\n')+'\nИтого с автоматической проверкой: '+r.reduce((a,x)=>a+x[1],0)+' / 22\n\n'+
  [line('Аудирование 1',S.l1,D.lis.k1,0,'ABCDEF'),line('Аудирование 2',S.l2,D.lis.k2,0,AG),line('Аудирование 3–9',S.l3,D.lis.k3,3),line('Чтение 10',S.r10,D.r10.a,0,AG),line('Чтение 12–18',S.r12,D.r12.a,12)].join('\n')+
  '\n\n=== Задание 37 · '+words(S.w37)+' слов ===\n'+(S.w37.trim()||'(нет ответа)')+'\n\n=== Задание 38 · '+words(S.w38)+' слов ===\n'+(S.w38.trim()||'(нет ответа)')+'\n';}
function report(){
  head(NAMES[who]+' · '+(S.checked?'работа проверена. Отправьте отчёт учителю: письмо 37 и 38 оценивает учитель по критериям ФИПИ.':'проверьте, что вверху выбрано ваше имя. Когда всё готово, нажмите «Проверить работу». После проверки ответы изменить нельзя.'));
  const res=el('div','res'),a=el('div','panel'),b=el('div','panel');
  if(!S.checked){a.append(el('h3',null,'Что сделано'));STEPS.slice(0,7).forEach(s=>a.append(el('div','rrow','<span>'+s.label+'</span><span class="note">'+(isDone(s.id)?'готово':'не закончено')+'</span><b>'+(isDone(s.id)?'✓':'—')+'</b>')));
    b.append(el('h3',null,'Как отправить'),el('p',null,'1. Нажмите «Проверить работу».<br>2. Нажмите «Скопировать отчёт» и вставьте текст в сообщение учителю – или скачайте файл и отправьте его.'),el('p','note','В отчёт попадают ответы, баллы и оба письменных текста.'));}
  else{const r=scores();a.append(el('h3',null,'Баллы · автоматическая проверка'));r.forEach(x=>{const p=x[1]/x[2];a.append(el('div','rrow','<span>'+x[0]+'</span><div class="meter"><i class="'+(p<.7?'low':p<.86?'mid':'high')+'" style="width:'+p*100+'%"></i></div><b>'+x[1]+' / '+x[2]+'</b>'));});
    a.append(el('div','rrow','<span class="total">Итого</span><span class="note">письмо (20 баллов) оценит учитель</span><b class="total">'+r.reduce((s,x)=>s+x[1],0)+' / 22</b>'));
    b.append(el('h3',null,'Письменная часть'),el('p',null,'Задание 37: <b>'+words(S.w37)+'</b> слов (нужно 100–140).<br>Задание 38: <b>'+words(S.w38)+'</b> слов (нужно 200–250).'),el('p','note','Ошибки в заданиях видны на вкладках: зелёным – верно, красным – неверно, после стрелки – правильный ответ.'));}
  res.append(a,b);main.append(res);
  const nav=el('div','navrow'),msg=el('span','note');
  if(!S.checked)nav.append(btn('Проверить работу',()=>{S.checked=true;save();redraw();},'acc'));
  else{nav.append(btn('Скопировать отчёт',()=>{(navigator.clipboard?navigator.clipboard.writeText(reportText()):Promise.reject()).then(()=>{msg.textContent='Скопировано – вставьте в сообщение учителю.';}).catch(()=>{msg.textContent='Не получилось скопировать – скачайте файл.';});},'main'));
    const d=el('a','btn','Скачать отчёт файлом');d.download='ege-diagnostic-home-'+(who?'katya':'rita')+'.txt';d.href=URL.createObjectURL(new Blob([reportText()],{type:'text/plain;charset=utf-8'}));nav.append(d);}
  nav.append(msg);const clr=btn('Очистить всё',()=>{if(clr.dataset.sure){try{localStorage.removeItem(KEY+'-'+who);}catch(e){}S=blank();go(0);}else{clr.dataset.sure=1;clr.textContent='Точно очистить? Нажмите ещё раз';}},'sm sp');nav.append(clr);main.append(nav);
}
Clock.mount();paintWho();go(0);
