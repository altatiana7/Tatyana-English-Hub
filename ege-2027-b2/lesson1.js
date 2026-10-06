/* Занятие 1 · диагностика в формате ЕГЭ. Ничего не сохраняется: страница каждый раз открывается чистой. */
const D=window.DIAG,main=$('#main'),tabs=$('#tabs');
const READ_A="Many people believe that our brain simply rests while we are asleep. In fact, scientists have discovered that it stays surprisingly busy throughout the night. During deep sleep the brain sorts through everything we have learned during the day and decides which information is worth keeping. Important facts and skills are moved into long-term memory, while unnecessary details are thrown away. This explains why students who sleep for at least eight hours usually remember new material better than those who study late into the night. Researchers have also found that sleep helps us to solve difficult problems. People who were given a puzzle in the evening were twice as likely to find the answer after a good night’s rest. Nevertheless, about a third of teenagers regularly get less sleep than they need, mainly because of bright screens and early school timetables. Doctors therefore advise switching off all gadgets an hour before going to bed.";
const READ_B="Honey is the only food that practically never goes bad. Archaeologists have found pots of honey in ancient Egyptian tombs which were over three thousand years old and still perfectly good to eat. The secret lies in its chemistry. Honey contains very little water and a lot of sugar, so bacteria simply cannot survive in it. Besides, bees add a special enzyme which produces a natural disinfectant. To make just one kilogram of honey, bees have to visit about four million flowers and fly a distance equal to several trips around the world. Throughout history people have used honey not only as a sweetener but also as a medicine. Doctors in ancient Greece treated wounds and burns with it, and modern research has confirmed that this method really works. Nevertheless, scientists warn that honey should not be given to children under the age of one.";
const READS=[READ_A,READ_B],RNOTE=["throughout, discovered, learned, unnecessary, puzzle, therefore, twice","archaeologists, ancient, tombs, chemistry, bacteria, enzyme, disinfectant, throughout, wounds"];
const ADS=[{img:"img/ad-tour.jpg",title:'Enjoy our hop-on-hop-off sightseeing tour!',intro:'You are considering going on the sightseeing tour and now you’d like to get more information.',points:['operation hours','starting point','tourist attractions to see','price for one person'],
  key:['What are the operation hours of the tour? / When does the tour operate?','Where is the starting point of the tour? / Where does the tour start?','What tourist attractions can I see during the tour?','How much is the tour for one person? / What is the price for one person?']},
 {img:'img/ad-lang.jpg',title:'Individual language classes with native speakers!',intro:'You are considering taking some lessons and now you’d like to get more information.',points:['location','price for one lesson','duration of the lesson','languages available'],
  key:['Where are the classes held? / Where are you located?','How much does one lesson cost? / What is the price for one lesson?','How long does the lesson last? / What is the duration of the lesson?','What languages are available? / What languages can I learn?']}];
const IV=[{id:'iv16',theme:'Science',q:['What science subjects have you studied? Which of them did you enjoy?','Are there any inventions or discoveries which have negative effects?','What would you like scientists to discover or invent in the future? Why?','Which scientist of the past or the present do you admire? Why?','What discovery or invention can you not live without? Why?']},
  {id:'iv33',theme:'Planning the day',q:['What do you usually do on a typical day?','Do you usually make a plan for your day? Why or why not?','How do you make sure you will not forget any important tasks for the day?','Do you think it’s a good idea to use mobile tools and applications to plan your day?','Do you think time management courses can be useful for school students? Why or why not?']}];
const IVTIP='Полный ответ из 2–3 фраз: прямой ответ → причина или пример. Время глагола – как в вопросе.';
const P4S=[{img:['img/exam-photo1.jpg','img/exam-photo2.jpg'],project:'Preparing for exams',kind:'the two types of preparing for exams',pref:'which type of preparing for exams you’d prefer as a school student and why'},
 {img:['img/stress-photo1.jpg','img/stress-photo2.jpg'],project:'Fighting stress',kind:'the two ways to fight stress',pref:'which of these ways to fight stress presented in the pictures you’d prefer and why'}];

/* Две ученицы: у каждой свои ответы, баллы и свой вариант устной части */
const NAMES=['Рита','Катя'];
const fresh=i=>({vr:i,g:{val:[],un:[],cur:0,done:false},w:{val:[],un:[],cur:0,done:false},v:{val:[],un:[],cur:0,done:false},r:{sel:{},act:0,done:false},
  sp:{t1:null,t2:[null,null,null,null],t3:[null,null,null,null,null],k1:null,k2:null,k3:null},iv:{v:i,q:0,flip:false}});
const ALL=[fresh(0),fresh(1)];let who=0,S=ALL[0];
function paintWho(){const w=$('#who');w.innerHTML='';NAMES.forEach((n,i)=>{const b=el('button','tab'+(i===who?' on':''),n);b.type='button';b.onclick=()=>{who=i;S=ALL[i];paintWho();go(cur);};w.append(b);});}
let cleanup=null,cur=0;

const STEPS=[
 {id:'g',label:'19–24',min:7,draw:()=>typed('g','Преобразуйте, если необходимо, слово, напечатанное заглавными буквами, так, чтобы оно грамматически соответствовало содержанию текста.')},
 {id:'w',label:'25–29',min:6,draw:()=>typed('w','Образуйте от слова, напечатанного заглавными буквами, однокоренное слово так, чтобы оно грамматически и лексически соответствовало содержанию текста.')},
 {id:'v',label:'30–36',min:7,draw:mcq},
 {id:'r',label:'Чтение 11',min:7,draw:read11},
 {id:'s1',label:'Устная 1',min:0,draw:speak1},
 {id:'s2',label:'Устная 2',min:0,draw:speak2},
 {id:'s3',label:'Устная 3',min:0,draw:speak3},
 {id:'s4',label:'Устная 4',min:0,draw:speak4},
 {id:'res',label:'Итоги',min:0,draw:results}
];
function isDone(id){const sp=S.sp;return id==='s1'?sp.t1!=null:id==='s2'?sp.t2.every(x=>x!=null):id==='s3'?sp.t3.every(x=>x!=null):id==='s4'?(sp.k1!=null&&sp.k2!=null&&sp.k3!=null):id==='res'?false:S[id].done;}
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab'+(k===cur?' on':'')+(isDone(s.id)?' done':''),s.label);b.type='button';b.onclick=()=>go(k);tabs.append(b);});
  const on=tabs.querySelector('.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});}
function go(k){if(cleanup){cleanup();cleanup=null;}cur=k;Clock.set(STEPS[k].min*60);paintTabs();main.innerHTML='';STEPS[k].draw();}
function redraw(){if(cleanup){cleanup();cleanup=null;}paintTabs();main.innerHTML='';STEPS[cur].draw();}
function nextBtn(){return cur<STEPS.length-1?btn('Дальше: '+STEPS[cur+1].label+' →',()=>go(cur+1),'main sp'):el('span');}
function chips(items,st,filled,okFn){const c=el('div','chips');items.forEach((it,k)=>{const b=el('button','chip'+(k===st.cur?' on':'')+(st.done?(okFn(k)?' ok':' bad'):(filled(k)?' fill':'')),String(it.n));b.type='button';b.onclick=()=>{st.cur=k;redraw();};c.append(b);});return c;}
function head(ru,title){const h=el('div','inst','<b>'+ru+'</b>'+(title?'<span class="src">Текст: '+esc(title)+' · Открытый банк ФИПИ</span>':''));main.append(h);}

/* ---------- 19–24 и 25–29: ввод слова ---------- */
function typedOk(key,k){return D[key].items[k].acc.includes(norm(S[key].val[k]||''));}
function typed(key,ru){
  const d=D[key],st=S[key],it=d.items[st.cur];head(ru,d.title);
  const stage=el('div','stage'),card=el('div','panel grow qcard');
  const shown=st.done?esc(it.show):(st.val[st.cur]?esc(st.val[st.cur]):'&nbsp;');
  card.append(el('div','qhead','<span class="qnum">'+it.n+'</span><span class="qtitle">'+(st.cur+1)+' из '+d.items.length+'</span>'));
  card.append(el('div','qtext'+(it.text.length>260?' long':''),esc(it.text).replace('___','<span class="gap'+(st.done?(typedOk(key,st.cur)?' ok':' bad'):'')+'">'+shown+'</span>')));
  const row=el('div','qrow');row.append(el('span','base',esc(it.base)));
  const inp=el('input','ans');inp.type='text';inp.autocomplete='off';inp.spellcheck=false;inp.setAttribute('autocapitalize','off');inp.placeholder='Ваш ответ';inp.value=st.val[st.cur]||'';inp.setAttribute('aria-label','Ответ '+it.n);
  if(st.done){inp.disabled=true;inp.classList.add(typedOk(key,st.cur)?'ok':'bad');}
  inp.oninput=()=>{st.val[st.cur]=inp.value;const g=card.querySelector('.gap');g.innerHTML=inp.value?esc(inp.value):'&nbsp;';const c=main.querySelectorAll('.chip')[st.cur];c&&c.classList.toggle('fill',!!inp.value.trim());};
  inp.onkeydown=e=>{if(e.key==='Enter'&&!st.done){if(st.cur<d.items.length-1){st.cur++;redraw();}}};
  row.append(inp);
  if(!st.done){const u=el('button','unsure'+(st.un[st.cur]?' on':''),st.un[st.cur]?'Сомневаюсь ✓':'Сомневаюсь');u.type='button';u.onclick=()=>{st.un[st.cur]=!st.un[st.cur];redraw();};row.append(u);}
  card.append(row);
  if(st.done){const ok=typedOk(key,st.cur);card.append(el('div','verdict '+(ok?'ok':'bad'),'<b>'+(ok?'Верно.':'Неверно.')+'</b> Ответ: <b>'+esc(it.show)+'</b>. '+esc(it.note)+(st.un[st.cur]&&ok?' <i>Отмечено «сомневаюсь» – повторить.</i>':'')));}
  stage.append(card);main.append(stage);
  const nav=el('div','navrow');nav.append(chips(d.items,st,k=>!!(st.val[k]||'').trim(),k=>typedOk(key,k)));
  nav.append(btn('← Назад',()=>{st.cur--;redraw();},'sm'),btn('Вперёд →',()=>{st.cur++;redraw();},'sm'));
  nav.children[1].disabled=st.cur===0;nav.children[2].disabled=st.cur===d.items.length-1;
  if(st.done){const n=d.items.filter((x,k)=>typedOk(key,k)).length;nav.append(el('b',null,'Результат: '+n+' из '+d.items.length));nav.append(nextBtn());}
  else nav.append(btn('Проверить раздел',()=>{st.done=true;st.cur=0;Clock.stop();redraw();},'acc sp'));
  main.append(nav);if(!st.done)inp.focus();
}

/* ---------- 30–36: выбор из четырёх ---------- */
function mcq(){
  const d=D.v,st=S.v,it=d.items[st.cur];head('Прочитайте текст с пропусками 30–36 и выберите для каждого пропуска один из четырёх вариантов.',d.title);
  const pi=d.p.findIndex(p=>p.includes('{{'+it.n+'}}'));
  const html=esc(d.p[pi]).replace(/\{\{(\d+)\}\}/g,(m,n)=>{const k=n-30,ch=st.val[k],me=k===st.cur,w=st.done?d.items[k].o[d.items[k].a-1]:(ch!=null?d.items[k].o[ch]:'');
    return '<span class="gap'+(me?'':' dim')+(st.done?(ch===d.items[k].a-1?' ok':' bad'):'')+'">'+n+(w?' · '+esc(w):'')+'</span>';});
  const stage=el('div','stage'),card=el('div','panel grow qcard');
  card.append(el('div','qhead','<span class="qnum">'+it.n+'</span><span class="qtitle">абзац '+(pi+1)+' из '+d.p.length+'</span>'));
  card.append(el('div','qtext long',html));
  const o=el('div','opts');it.o.forEach((w,j)=>{const b=el('button','opt',(j+1)+') '+esc(w));b.type='button';
    if(st.done){b.disabled=true;if(j===it.a-1)b.classList.add('ok');else if(st.val[st.cur]===j)b.classList.add('bad');}
    else{if(st.val[st.cur]===j)b.classList.add('sel');b.onclick=()=>{st.val[st.cur]=j;if(st.cur<d.items.length-1)st.cur++;redraw();};}o.append(b);});
  card.append(o);
  if(st.done){const ok=st.val[st.cur]===it.a-1;card.append(el('div','verdict '+(ok?'ok':'bad'),'<b>'+(ok?'Верно.':'Неверно.')+'</b> '+esc(it.note)));}
  stage.append(card);main.append(stage);
  const ok=k=>st.val[k]===d.items[k].a-1,nav=el('div','navrow');nav.append(chips(d.items,st,k=>st.val[k]!=null,ok));
  nav.append(btn('← Назад',()=>{st.cur--;redraw();},'sm'),btn('Вперёд →',()=>{st.cur++;redraw();},'sm'));
  nav.children[1].disabled=st.cur===0;nav.children[2].disabled=st.cur===d.items.length-1;
  if(st.done){nav.append(el('b',null,'Результат: '+d.items.filter((x,k)=>ok(k)).length+' из 7'));nav.append(nextBtn());}
  else{const u=el('button','unsure'+(st.un[st.cur]?' on':''),st.un[st.cur]?'Сомневаюсь ✓':'Сомневаюсь');u.type='button';u.onclick=()=>{st.un[st.cur]=!st.un[st.cur];redraw();};nav.append(u);
    nav.append(btn('Проверить раздел',()=>{st.done=true;st.cur=0;Clock.stop();redraw();},'acc sp'));}
  main.append(nav);
}

/* ---------- Чтение, задание 11 ---------- */
const AF='ABCDEF';
function r11errors(){return D.r11.a.filter((a,k)=>S.r.sel[k]!==a).length;}
function r11score(){const e=r11errors();return e===0?2:e===1?1:0;}
function read11(){
  const d=D.r11,st=S.r;head('Прочитайте текст и заполните пропуски A–F частями предложений 1–7. Одна из частей в списке лишняя.',d.title);
  const stage=el('div','stage'),txt=el('div','panel grow read'),side=el('div','panel side col');
  txt.append(el('h3',null,esc(d.title)));
  d.p.forEach(p=>{txt.append(el('p',null,esc(p).replace(/\{\{([A-F])\}\}/g,(m,L)=>{const k=AF.indexOf(L),s=st.sel[k];
    return '<button type="button" class="gbtn'+(st.done?(s===d.a[k]?' ok':' bad'):(k===st.act?' on':''))+'" data-g="'+k+'">'+L+' · '+(s?s:'?')+(st.done&&s!==d.a[k]?' → '+d.a[k]:'')+'</button>';})));});
  txt.querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>{if(st.done)return;st.act=+b.dataset.g;redraw();});
    const parts=el('div','parts');d.parts.forEach((t,j)=>{const n=j+1,usedBy=Object.keys(st.sel).find(k=>st.sel[k]===n);
    const b=el('button','part'+(usedBy!=null?' used':''),'<b>'+n+'</b>'+esc(t)+(usedBy!=null?' <i>('+AF[usedBy]+')</i>':''));b.type='button';b.disabled=st.done;
    b.onclick=()=>{Object.keys(st.sel).forEach(k=>{if(st.sel[k]===n)delete st.sel[k];});st.sel[st.act]=n;const free=[0,1,2,3,4,5].find(k=>st.sel[k]==null&&k>st.act);const any=[0,1,2,3,4,5].find(k=>st.sel[k]==null);st.act=free!=null?free:(any!=null?any:st.act);redraw();};parts.append(b);});
  side.append(parts);stage.append(txt,side);main.append(stage);
  const nav=el('div','navrow');
  if(st.done){nav.append(el('b',null,'Результат: '+r11score()+' из 2 баллов · ошибок: '+r11errors()));nav.append(el('span','note','0 ошибок – 2 балла, 1 – 1 балл, 2 и более – 0. После стрелки – верный номер.'));nav.append(nextBtn());}
  else{nav.append(el('span','note','Нажмите пропуск в тексте, затем часть предложения. Выбран пропуск <b>'+AF[st.act]+'</b> · заполнено '+Object.keys(st.sel).length+' из 6'));nav.append(btn('Проверить задание',()=>{st.done=true;Clock.stop();redraw();},'acc sp'));}
  main.append(nav);
}

/* ---------- Устная часть ---------- */
function scoreRow(label,max,get,set){const r=el('div','score');r.append(el('span',null,label));for(let n=0;n<=max;n++){const b=el('button',get()===n?'on':'',String(n));b.type='button';b.onclick=()=>{set(n);[...r.querySelectorAll('button')].forEach((x,k)=>x.classList.toggle('on',k===n));paintTabs();};r.append(b);}return r;}
function teacherPanel(html,rows){const ov=el('div','overlay');ov.hidden=true;const t=el('div','teach');t.append(el('h4',null,'Оценка учителя · критерии ФИПИ'));t.insertAdjacentHTML('beforeend',html);rows.forEach(r=>t.append(r));t.append(btn('Закрыть',()=>{ov.hidden=true;},'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.hidden=true;};document.body.append(ov);return ov;}
function speakShell(taskHtml,phases,opts){
  const stage=el('div','stage'),kim=el('div','panel grow kim',taskHtml),ctl=el('div','panel ctl col');
  const ring=ringEl(phases[0].sec),label=el('div','phase','Нажмите «Начать»'),recBox=el('div','rec');
  const run=phaseRunner({ring,label,phases,recBox,recName:opts.name,onPhase:opts.onPhase});
  const startB=btn('Начать',()=>{run.start();startB.textContent='Сначала';pauseB.disabled=skipB.disabled=false;pauseB.textContent='Пауза';},'main wide');
  const pauseB=btn('Пауза',()=>{pauseB.textContent=run.pause()?'Продолжить':'Пауза';},'sm'),skipB=btn('Пропустить',()=>run.skip(),'sm');pauseB.disabled=skipB.disabled=true;
  const ov=teacherPanel(opts.teachHtml,opts.rows);
  const box=el('div','ctlbtns');box.append(startB,pauseB,skipB,recToggle(),btn('Оценка учителя',()=>{ov.hidden=false;},'acc sm wide'));
  ctl.append(ring,label,box,recBox);stage.append(kim,ctl);main.append(stage);
  const nav=el('div','navrow');nav.append(btn('Вариант '+(S.vr+1)+' из 2',()=>{S.vr=1-S.vr;redraw();},'sm'),el('span','note',opts.note||''));nav.append(nextBtn());main.append(nav);
  cleanup=()=>{run.stop();ov.remove();};return kim;
}
function speak1(){const READ1=READS[S.vr];
  speakShell('<p class="task">Task 1. Imagine that you are preparing a project with your friend. You have found some interesting material for the presentation and you want to read this text to your friend. You have 1.5 minutes to read the text silently, then be ready to read it out aloud. You will not have more than 1.5 minutes to read it.</p><div class="textbox">'+esc(READ1)+'</div>',
   [{label:'Подготовка · читайте про себя',kind:'prep',sec:90},{label:'Ответ · читайте вслух',kind:'answer',sec:90}],
   {name:NAMES[who]+'-task1',note:'Задание 1 · 1 балл · текст составлен для сайта по образцу ФИПИ ('+words(READ1)+' слов).',
    teachHtml:'<p><b>1 балл:</b> речь воспринимается легко, нет необоснованных пауз; фразовое ударение и интонация без нарушений; не более 5 фонетических ошибок, из них не более 2 искажают смысл.</p><p><b>0:</b> текст не дочитан или ошибок больше.</p><p>Отмечайте: '+RNOTE[S.vr]+', окончания -ed, паузы на запятых.</p>',
    rows:[scoreRow('Чтение вслух',1,()=>S.sp.t1,n=>S.sp.t1=n)]});
}
function speak2(){const AD=ADS[S.vr];
  const kim=speakShell('<p class="task">Task 2. Study the advertisement.</p><div class="adt">'+esc(AD.title)+'</div><div class="adrow"><img src="'+AD.img+'" alt="Advertisement photo"><div><p class="task">'+esc(AD.intro)+' In 1.5 minutes you are to ask four direct questions to find out about the following:</p><ol id="pts">'+AD.points.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ol><p class="task">You have 20 seconds to ask each question.</p></div></div>',
   [{label:'Подготовка',kind:'prep',sec:90}].concat(AD.points.map((p,k)=>({label:'Вопрос '+(k+1),kind:'answer',sec:20}))),
   {name:NAMES[who]+'-task2',note:'Задание 2 · 4 балла · Открытый банк ФИПИ.',
    onPhase:i=>{const li=[...document.querySelectorAll('#pts li')];li.forEach((x,k)=>{x.className=i<1?'':(k===i-1?'now':(k<i-1?'past':''));});},
    teachHtml:'<p>По <b>1 баллу</b> за вопрос: прямой вопрос по пункту, грамматически верный, понятный на слух. 0 – косвенный вопрос, ошибка в порядке слов или вспомогательном глаголе, вопрос не по пункту.</p><p><b>Возможные вопросы:</b><br>'+AD.key.map((x,k)=>(k+1)+'. '+esc(x)).join('<br>')+'</p>',
    rows:AD.points.map((p,k)=>scoreRow((k+1)+'. '+p,1,()=>S.sp.t2[k],n=>S.sp.t2[k]=n))});
}
function speak4(){const P4=P4S[S.vr];
  speakShell('<div class="t4"><div><p class="task">Task 4. Imagine that you and your friend are doing a school project “'+esc(P4.project)+'”. You have found some photos to illustrate it but for technical reasons you cannot send them now. Leave a voice message to your friend explaining your choice of the photos and sharing some ideas about the project. In 2.5 minutes be ready to:</p><ul><li>explain the choice of the illustrations for the project by briefly describing them and noting the differences;</li><li>mention the advantages (1–2) of '+esc(P4.kind)+';</li><li>mention the disadvantages (1–2) of '+esc(P4.kind)+';</li><li>express your opinion on the subject of the project – '+esc(P4.pref)+'.</li></ul><p class="task">You will speak for not more than 3 minutes (12–15 sentences). You have to talk continuously.</p></div><div class="pics"><figure><figcaption>Photo 1</figcaption><img src="'+P4.img[0]+'" alt="Photo 1"></figure><figure><figcaption>Photo 2</figcaption><img src="'+P4.img[1]+'" alt="Photo 2"></figure></div></div>',
   [{label:'Подготовка',kind:'prep',sec:150},{label:'Ответ · голосовое сообщение',kind:'answer',sec:180}],
   {name:NAMES[who]+'-task4',note:'Задание 4 · 10 баллов · Открытый банк ФИПИ.',
    teachHtml:'<p><b>К1 Решение коммуникативной задачи (0–4):</b> раскрыты все 4 пункта плана, 12–15 фраз. При 0 по К1 всё задание – 0.</p><p><b>К2 Организация (0–3):</b> обращение к другу, вступление и заключение, логичность, средства связи.</p><p><b>К3 Языковое оформление (0–3):</b> лексика, грамматика, произношение.</p>',
    rows:[scoreRow('К1 · содержание',4,()=>S.sp.k1,n=>S.sp.k1=n),scoreRow('К2 · организация',3,()=>S.sp.k2,n=>S.sp.k2=n),scoreRow('К3 · язык',3,()=>S.sp.k3,n=>S.sp.k3=n)]});
}
/* Задание 3: одна карточка за раз, вопрос только звучит */
function speak3(){
  const st=S.iv,v=IV[st.v];let left=40,t=null;const au=new Audio();au.preload='auto';
  head('Task 3. You are going to give an interview. You have to answer five questions. Give full answers to the questions (2–3 sentences). Remember that you have 40 seconds to answer each question.');
  const top=el('div','ivtop'),sel=el('select');sel.setAttribute('aria-label','Вариант');IV.forEach((x,k)=>sel.append(new Option('Вариант '+(k+1),k)));sel.value=st.v;
  sel.onchange=()=>{st.v=+sel.value;st.q=0;st.flip=false;redraw();};top.append(sel);
  const qc=el('div','chips');v.q.forEach((q,k)=>{const b=el('button','chip'+(k===st.q?' on':''),String(k+1));b.type='button';b.onclick=()=>{st.q=k;st.flip=false;redraw();};qc.append(b);});top.append(el('span','note','Вопрос:'),qc);
  const ov=teacherPanel('<p>По <b>1 баллу</b> за ответ: полный и точный ответ из 2–3 фраз, без ошибок, мешающих пониманию. 0 – ответ короче двух фраз, не на тот вопрос или с ошибкой во времени глагола.</p><p><b>Вопросы варианта:</b><br>'+v.q.map((x,k)=>(k+1)+'. '+esc(x)).join('<br>')+'</p>',v.q.map((q,k)=>scoreRow('Ответ '+(k+1),1,()=>S.sp.t3[k],n=>S.sp.t3[k]=n)));
  top.append(btn('Вступление',()=>play('intro'),'sm'),btn('Оценка учителя',()=>{ov.hidden=false;},'acc sm sp'));main.append(top);
  const stage=el('div','stage'),card=el('div','ivcard'+(st.flip?' back':'')),side=el('div','panel ctl col');
  const ring=el('div','ring ans','<b>40</b><span>секунд</span>'),label=el('div','phase','Нажмите Play');
  const paint=()=>{ring.querySelector('b').textContent=left;ring.style.background='conic-gradient(var(--acc) '+(left/40*360)+'deg,#f3ddd6 0)';ring.classList.toggle('end',left===0);};
  const stopT=()=>{clearInterval(t);t=null;};
  const runT=()=>{stopT();left=40;paint();label.textContent='Ответ';beep(880,200);Rec.start();const end=Date.now()+40000;t=setInterval(()=>{left=Math.max(0,Math.ceil((end-Date.now())/1000));paint();if(left===0){stopT();label.textContent='Время вышло';beep(520,500);Rec.stop(recBox,NAMES[who]+'-'+v.id+'-q'+(st.q+1));}},200);};
  function play(what){stopT();Rec.cancel();left=40;paint();au.pause();au.src='audio/'+v.id+'-'+what+'.mp3';label.textContent=what==='intro'?'Звучит вступление':'Звучит вопрос';
    au.onended=()=>{if(what==='intro'){label.textContent='Теперь нажмите Play';}else runT();};au.onerror=()=>{label.textContent='Запись не загрузилась';};au.play().catch(()=>{label.textContent='Запись не загрузилась';});}
  const recBox=el('div','rec');
  function face(){card.className='ivcard'+(st.flip?' back':'');card.innerHTML='';
    if(st.flip){card.append(el('div','ey','Question '+(st.q+1)+' · '+esc(v.theme)),el('div','qq',esc(v.q[st.q])),el('div','tip',IVTIP));}
    else{card.append(el('div','ey','Question '+(st.q+1)+' of 5'),el('div','big','Listen and answer'),el('div','note','Вопрос только звучит. Текст – на обороте карточки.'));
      const pb=el('div','navrow');pb.append(btn('Play',()=>play('q'+(st.q+1)),'main'),btn('Replay',()=>play('q'+(st.q+1))),btn('Stop',()=>{au.pause();stopT();Rec.cancel();label.textContent='Остановлено';}));card.append(pb);}}
  face();
  const box=el('div','ctlbtns');box.append(btn('Таймер',runT,'sm'),btn('Сброс',()=>{stopT();Rec.cancel();left=40;paint();label.textContent='Нажмите Play';},'sm'),recToggle());
  side.append(ring,label,box,recBox);stage.append(card,side);main.append(stage);
  const nav=el('div','navrow');const bk=btn('← Назад',()=>{st.q--;st.flip=false;redraw();}),fw=btn('Вперёд →',()=>{st.q++;st.flip=false;redraw();});bk.disabled=st.q===0;fw.disabled=st.q===4;
  nav.append(bk,btn('Перевернуть карточку',()=>{st.flip=!st.flip;face();},'main'),fw,el('span','note','Задание 3 · 5 баллов · запись интервью из Открытого банка ФИПИ.'),nextBtn());main.append(nav);
  cleanup=()=>{stopT();au.pause();Rec.cancel();ov.remove();};
}

/* ---------- Итоги ---------- */
function calc(){
  const g=D.g.items.filter((x,k)=>typedOk('g',k)).length,w=D.w.items.filter((x,k)=>typedOk('w',k)).length,v=D.v.items.filter((x,k)=>S.v.val[k]===x.a-1).length;
  const sp=S.sp,n=x=>x==null?0:x,t2=sp.t2.reduce((a,x)=>a+n(x),0),t3=sp.t3.reduce((a,x)=>a+n(x),0),t4=sp.k1===0?0:n(sp.k1)+n(sp.k2)+n(sp.k3);
  return [['19–24 · грамматика',g,6,S.g.done],['25–29 · словообразование',w,5,S.w.done],['30–36 · лексика',v,7,S.v.done],['Чтение · задание 11',S.r.done?r11score():0,2,S.r.done],
    ['Устная 1 · чтение вслух',n(sp.t1),1,sp.t1!=null],['Устная 2 · вопросы',t2,4,isDone('s2')],['Устная 3 · интервью',t3,5,isDone('s3')],['Устная 4 · монолог',t4,10,isDone('s4')]];
}
function errList(){const out=[],un=[];
  [['g',k=>typedOk('g',k)],['w',k=>typedOk('w',k)],['v',k=>S.v.val[k]===D.v.items[k].a-1]].forEach(([key,ok])=>{if(!S[key].done)return;D[key].items.forEach((it,k)=>{
    const mine=key==='v'?(S.v.val[k]!=null?it.o[S.v.val[k]]:'—'):((S[key].val[k]||'').trim()||'—'),right=key==='v'?it.o[it.a-1]:it.show;
    if(!ok(k))out.push([it.n,it.tag,mine,right]);else if(S[key].un[k])un.push([it.n,it.tag,right]);});});
  if(S.r.done)D.r11.a.forEach((a,k)=>{if(S.r.sel[k]!==a)out.push(['11 '+AF[k],'Чтение · связность текста',S.r.sel[k]?String(S.r.sel[k]):'—',String(a)]);});return {out,un};}
function reportText(){const r=calc(),e=errList(),sum=r.reduce((a,x)=>a+x[1],0),max=r.reduce((a,x)=>a+x[2],0);
  return 'ЕГЭ 2027 · диагностика, занятие 1 · '+NAMES[who]+'\n'+r.map(x=>x[0]+': '+(x[3]?x[1]:'—')+' / '+x[2]).join('\n')+'\nИтого на занятии: '+sum+' / '+max+'\n\nОшибки:\n'+(e.out.map(x=>x[0]+' · '+x[1]+' · ответ: '+x[2]+' · верно: '+x[3]).join('\n')||'нет')+'\n\nВерно, но с сомнением:\n'+(e.un.map(x=>x[0]+' · '+x[1]+' · '+x[2]).join('\n')||'нет');}
function results(){
  const r=calc(),e=errList(),sum=r.reduce((a,x)=>a+x[1],0),max=r.reduce((a,x)=>a+x[2],0);
  head(NAMES[who]+' · итоги диагностики на занятии · '+max+' из 82 первичных баллов экзамена. Остальные 42 балла (аудирование, чтение 10 и 12–18, письмо) – домашняя часть.');
  const res=el('div','res'),a=el('div','panel'),b=el('div','panel');
  a.append(el('h3',null,'Баллы по заданиям'));
  r.forEach(x=>{const p=x[2]?x[1]/x[2]:0;a.append(el('div','rrow','<span>'+x[0]+'</span><div class="meter"><i class="'+(!x[3]?'':p<.7?'low':p<.86?'mid':'high')+'" style="width:'+(x[3]?p*100:0)+'%"></i></div><b>'+(x[3]?x[1]:'—')+' / '+x[2]+'</b>'));});
  a.append(el('div','rrow','<span class="total">Итого</span><span></span><b class="total">'+sum+' / '+max+'</b>'));a.append(el('div','note','Красный – ниже 70%, жёлтый – 70–85%, зелёный – выше 85%.'));
  b.append(el('h3',null,'Карта ошибок'));
  if(!e.out.length&&!e.un.length)b.append(el('p','note',(S.g.done||S.w.done||S.v.done)?'Ошибок в проверенных разделах нет.':'Разделы 19–36 ещё не проверены: нажмите «Проверить раздел» в каждом.'));
  if(e.out.length)b.append(el('ul','errs',e.out.map(x=>'<li><b>'+x[0]+'</b> · '+esc(x[1])+': <span style="color:var(--bad)">'+esc(x[2])+'</span> → <b>'+esc(x[3])+'</b></li>').join('')));
  if(e.un.length){b.append(el('h3',null,'Верно, но с сомнением'));b.append(el('ul','errs',e.un.map(x=>'<li><b>'+x[0]+'</b> · '+esc(x[1])+': '+esc(x[2])+'</li>').join('')));}
  res.append(a,b);main.append(res);
  const nav=el('div','navrow'),msg=el('span','note');
  nav.append(btn('Скопировать итоги',()=>{const t=reportText();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{msg.textContent='Скопировано – вставьте в заметки или сообщение.';}).catch(()=>{msg.textContent='Не получилось скопировать автоматически.';});},'main'),
    btn('Сбросить всё и начать заново',()=>{location.reload();}),msg);
  const h=el('a','btn sp','Домашняя часть →');h.href='home1.html';nav.append(h);main.append(nav);
}
Clock.mount();paintWho();go(0);
