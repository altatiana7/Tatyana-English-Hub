/* Тренажёр задания 38: структура и клише → чтение данных → проблема и вывод → текст целиком. */
const T=window.W38,main=$('#main'),tabs=$('#tabs'),NAMES=['Ученица 1','Ученица 2'],KEY='ege2027b2-w38';
let who=0;try{who=+localStorage.getItem(KEY+'-who')||0;}catch(e){}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const ST={cur:0,kind:1,par:0,qs:null,qi:0,pick:null,score:0,showP:false};let cur=0;
const PARS=[
 ['Вступление','make an opening statement on the subject of the project',['что вы делаете проект и какая у него тема','страна Zetland','вы нашли данные – результаты опроса','кого опрашивали – как в задании','где данные: в таблице или на диаграмме','что вы собираетесь сделать: описать данные и высказать мнение'],
  ['I am currently doing a project on … in Zetland.','I have found some data on the subject – the results of a survey conducted among … in Zetland.','The data are presented in the table / in the pie chart.','I am going to comment on the survey data and give my opinion on the subject.']],
 ['Факты','select and report 2–3 facts',['2–3 факта из таблицы, цифры точно как в задании','ссылка на таблицу или диаграмму','варианты ответа связаны с вопросом опроса'],
  ['According to the table, when the respondents were asked “…”, …% of them chose the option “…”.','The most popular answer was “…”, chosen by …% of the respondents.','“…” came second with …%.','The least popular option was “…” (only …%).']],
 ['Сравнения','make 1–2 comparisons where relevant and give your comments',['1–2 сравнения с цифрами','ваш комментарий: почему так может быть','в абзацах 2 и 3 – разные данные, без повторов'],
  ['“…” is twice as popular as “…”.','… percentage points more respondents chose “…” than “…”.','There is only a slight difference between “…” and “…”.','This may be because … / I suppose the reason is that …']],
 ['Проблема и решение','outline a problem that can arise with … and suggest a way of solving it',['проблема именно та, что названа в плане задания','конкретное решение, а не общие слова'],
  ['However, a problem can arise with …: …','One problem connected with … is that …','To solve this problem, … could …','One possible solution is to …']],
 ['Вывод','conclude by giving and explaining your opinion on …',['ваше мнение по тому вопросу, который назван в задании','объяснение: почему вы так считаете'],
  ['In conclusion, I believe that … because …','To sum up, in my opinion, …','All in all, I am convinced that …']]];
const STEPS=[['Структура и клише',0,structure],['Читаю данные',0,dataStep],['Проблема и вывод',0,probStep],['Пишу 38',40,writeStep]];
function paintWho(){const w=$('#who');w.innerHTML='';NAMES.forEach((n,i)=>{const b=el('button','tab'+(i===who?' on':''),n);b.type='button';b.onclick=()=>{who=i;try{localStorage.setItem(KEY+'-who',i);}catch(e){}paintWho();redraw();};w.append(b);});}
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':''),'<i>'+(k+1)+'</i><span>'+s[0]+'</span>');b.type='button';b.title=s[0];b.onclick=()=>go(k);tabs.append(b);});}
function go(k){cur=k;Clock.set(STEPS[k][1]*60);redraw();}
function redraw(){paintTabs();main.innerHTML='';STEPS[cur][2]();}
function nextBtn(){return cur<STEPS.length-1?btn('Дальше: '+STEPS[cur+1][0]+' →',()=>go(cur+1),'main sp'):el('span');}
function picker(note){const top=el('div','navrow'),sel=el('select','pick');sel.setAttribute('aria-label','Тема задания');T.forEach((y,i)=>sel.append(new Option((i+1)+'. '+y.topic,i)));sel.value=ST.cur;sel.onchange=()=>{ST.cur=+sel.value;ST.qs=null;ST.showP=false;redraw();};
  top.append(sel,btn('Случайная тема',()=>{ST.cur=Math.floor(Math.random()*T.length);ST.qs=null;ST.showP=false;redraw();},'sm'));
  [['38.1 · таблица',1],['38.2 · диаграмма',2]].forEach(([n,k])=>top.append(btn(n,()=>{ST.kind=k;redraw();},'sm'+(ST.kind===k?' main':''))));
  if(note)top.append(el('span','note',note));main.append(top);}
const FILL=['#2855d9','#d93286','#00a4b8','#f2b705','#8a94a6'];
function pie(rows){let a=-Math.PI/2,s='';const R=100,C=110;rows.forEach((r,k)=>{const b=a+r[1]/100*2*Math.PI,x1=C+R*Math.cos(a),y1=C+R*Math.sin(a),x2=C+R*Math.cos(b),y2=C+R*Math.sin(b),m=(a+b)/2;
    s+='<path d="M'+C+' '+C+'L'+x1.toFixed(1)+' '+y1.toFixed(1)+'A'+R+' '+R+' 0 '+(b-a>Math.PI?1:0)+' 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+'Z" fill="'+FILL[k]+'" stroke="#fff" stroke-width="2"/>';
    s+='<text x="'+(C+R*.66*Math.cos(m)).toFixed(1)+'" y="'+(C+R*.66*Math.sin(m)+5).toFixed(1)+'" text-anchor="middle" font-size="14" font-weight="700" fill="'+(k===3?'#14213d':'#fff')+'">'+r[1]+'%</text>';a=b;});
  return '<div class="pie"><svg viewBox="0 0 220 220" role="img" aria-label="Pie chart">'+s+'</svg><div>'+rows.map((r,k)=>'<div class="lg"><i style="background:'+FILL[k]+'"></i>'+esc(r[0])+'</div>').join('')+'</div></div>';}
function dataHtml(x){return '<p class="sq"><b>The survey question:</b> '+esc(x.q)+'<br><i>Choose one option</i></p>'+(ST.kind===1?'<table class="t"><tr><th>'+esc(x.col)+'</th><th>Number of respondents (%)</th></tr>'+x.rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td>'+r[1]+'</td></tr>').join('')+'</table>':pie(x.rows));}
function taskHtml(x){const src=ST.kind===1?'table':'pie chart';return '<p class="task">Imagine that you are doing a project on '+esc(x.subj)+'. You have found some data on the subject – the results of a survey conducted among '+x.who+' in Zetland (see the '+src+' below).</p><p class="task">Comment on the survey data and give your opinion on the subject of the project.</p>'+dataHtml(x)+'<p class="task">Write 200–250 words.<br>Use the following plan:</p><ul class="plan"><li>– make an opening statement on the subject of the project;</li><li>– select and report 2–3 facts;</li><li>– make 1–2 comparisons where relevant and give your comments;</li><li>– outline a problem that can arise with '+esc(x.problem)+' and suggest a way of solving it;</li><li>– conclude by giving and explaining your opinion on '+esc(x.opinion)+'.</li></ul>';}
function sample(x){const r=x.rows,src=ST.kind===1?'table':'pie chart',d=r[0][1]-r[1][1],ra=r[2][1]/r[4][1],times=ra>=2.75?'about three times':ra>=1.85?'about twice':'noticeably more';
  return 'I am currently doing a project on '+x.subj+'. I have found some data on the subject – the results of a survey conducted among '+x.who+' in Zetland (see the '+src+'). I am going to comment on the survey data and give my opinion on the subject.\n\n'+
  'According to the '+src+', when the respondents were asked “'+x.q+'”, the most popular answer was “'+r[0][0]+'”, chosen by '+r[0][1]+'% of them. The option “'+r[1][0]+'” came second with '+r[1][1]+'%. The least popular answer was “'+r[4][0]+'”, which only '+r[4][1]+'% of the '+x.who+' selected.\n\n'+
  'Comparing the figures, we can see that “'+r[0][0]+'” is '+d+' percentage points ahead of “'+r[1][0]+'”. Moreover, “'+r[2][0]+'” was chosen '+(times==='noticeably more'?'noticeably more often than':times+' as often as')+' “'+r[4][0]+'” ('+r[2][1]+'% against '+r[4][1]+'%). I suppose the reason is that the first options are closer to the everyday experience of most '+x.who+'.\n\n'+
  'However, a problem can arise with '+x.problem+': '+x.p+'. In my view, this problem can be solved: '+x.s+'.\n\n'+
  'In conclusion, I believe that '+x.o+'.';}

/* ---------- 1. Структура и клише ---------- */
function structure(){
  main.append(el('div','inst','<b>Пять пунктов плана – пять абзацев. Выберите абзац, чтобы увидеть, что в нём должно быть.</b><span class="src">План и формулировки задания – по демоверсии ФИПИ</span>'));
  const stage=el('div','stage'),a=el('div','panel grow sk'),b=el('div','panel grow');a.classList.remove('grow');a.style.cssText='width:40%;flex:0 0 40%';
  PARS.forEach((p,i)=>{const r=el('button','skrow par'+(i===ST.par?' on':''),'<i>'+(i+1)+'</i><div><b>'+p[0]+'</b><span class="ph">'+esc(p[1])+'</span></div>');r.type='button';r.onclick=()=>{ST.par=i;redraw();};a.append(r);});
  
  const p=PARS[ST.par];b.append(el('h3',null,'Абзац '+(ST.par+1)+' · '+p[0]));const two=el('div','two'),c1=el('div'),c2=el('div');c1.append(el('p',null,'<b>Что должно быть</b>'),el('ul','errs',p[2].map(x=>'<li>'+x+'</li>').join('')));c2.append(el('p',null,'<b>Фразы</b>'));p[3].forEach(f=>c2.append(el('p','frame',esc(f))));two.append(c1,c2);b.append(two);
  stage.append(a,b);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','200–250 слов (меньше 180 – ноль, после 275 не проверяется) · нейтральный стиль, без сокращений · 40 минут'),nextBtn());main.append(nav);
}

/* ---------- 2. Читаю данные: верное описание цифр ---------- */
function makeQs(x){const r=x.rows,qs=[],o=n=>'“'+r[n][0]+'”';
  const add=(q,ok,bad,why)=>qs.push({q,opts:shuffle([ok].concat(bad)),ok,why});
  add('Какое предложение верно передаёт данные?',o(1)+' came second with '+r[1][1]+'%.',[o(1)+' came second with '+r[2][1]+'%.',o(2)+' came second with '+r[2][1]+'%.',o(1)+' was the most popular answer with '+r[1][1]+'%.'],'Второе место – '+r[1][0]+', '+r[1][1]+'%. Цифры и порядок берём точно из задания.');
  add('Какое сравнение верно?',o(0)+' is '+(r[0][1]-r[1][1])+' percentage points ahead of '+o(1)+'.',[o(0)+' is '+(r[0][1]-r[2][1])+' percentage points ahead of '+o(1)+'.',o(1)+' is '+(r[0][1]-r[1][1])+' percentage points ahead of '+o(0)+'.',o(0)+' is '+(r[1][1])+' percentage points ahead of '+o(1)+'.'],r[0][1]+' − '+r[1][1]+' = '+(r[0][1]-r[1][1])+'. В сравнении нужны обе цифры или точная разница.');
  add('Какой факт можно сообщить о самом редком ответе?','The least popular option was '+o(4)+', chosen by only '+r[4][1]+'% of the respondents.',['The least popular option was '+o(3)+', chosen by only '+r[3][1]+'% of the respondents.','The least popular option was '+o(4)+', chosen by only '+r[3][1]+'% of the respondents.','Nobody chose '+o(4)+'.'],'Самый редкий ответ – '+r[4][0]+', '+r[4][1]+'%.');
  const ra=r[0][1]/r[2][1],w=ra>=2.75?'about three times':ra>=1.85?'about twice':'less than twice';
  add('Во сколько раз чаще выбирали '+o(0)+', чем '+o(2)+'?',w+' as often'+(w==='less than twice'?'':'')+' ('+r[0][1]+'% against '+r[2][1]+'%)',['about three times','about twice','less than twice'].filter(z=>z!==w).map(z=>z+' as often ('+r[0][1]+'% against '+r[2][1]+'%)').concat(['exactly four times as often ('+r[0][1]+'% against '+r[2][1]+'%)']),r[0][1]+' : '+r[2][1]+' ≈ '+ra.toFixed(1)+'. Округляйте честно: twice, three times, almost twice.');
  add('Какое предложение подходит для абзаца с фактами?','According to the '+(ST.kind===1?'table':'pie chart')+', '+r[0][1]+'% of the respondents chose the option '+o(0)+'.',['I think '+o(0)+' is the best answer.','Everybody in Zetland prefers '+o(0)+'.','About half of the respondents chose '+o(3)+'.'],'Факт – это цифра из задания со ссылкой на источник, без собственной оценки и без обобщений на всю страну.');
  add('Сколько вместе набрали два самых популярных ответа?',(r[0][1]+r[1][1])+'% of the respondents chose either '+o(0)+' or '+o(1)+'.',[(r[0][1]+r[2][1])+'% of the respondents chose either '+o(0)+' or '+o(1)+'.',(r[1][1]+r[2][1])+'% of the respondents chose either '+o(0)+' or '+o(1)+'.',(r[0][1]+r[1][1]+10)+'% of the respondents chose either '+o(0)+' or '+o(1)+'.'],r[0][1]+' + '+r[1][1]+' = '+(r[0][1]+r[1][1])+'. Сложение долей – тоже сравнение, если его прокомментировать.');
  return qs;}
function dataStep(){
  const x=T[ST.cur];if(!ST.qs){ST.qs=makeQs(x);ST.qi=0;ST.pick=null;ST.score=0;}
  picker('Верных ответов: '+ST.score+' из '+ST.qs.length);
  const stage=el('div','stage'),a=el('div','panel side kim p38',dataHtml(x)),b=el('div','panel grow qcard');b.style.justifyContent='flex-start';
  if(ST.qi>=ST.qs.length){b.append(el('div','qtext','Данные разобраны: '+ST.score+' из '+ST.qs.length+'.'),el('div','note','В абзацах 2 и 3 используйте разные цифры: факты отдельно, сравнения отдельно.'),btn('Ещё раз по этой теме',()=>{ST.qs=null;redraw();}));}
  else{const q=ST.qs[ST.qi];b.append(el('div','qhead','<span class="qnum">'+(ST.qi+1)+'</span><span class="qtitle">из '+ST.qs.length+'</span>'),el('div','qtext long',esc(q.q)));
    const o=el('div','opts c1');q.opts.forEach(t=>{const bt=el('button','opt'+(ST.pick!=null?(t===q.ok?' ok':(t===ST.pick?' bad':'')):''),esc(t));bt.type='button';bt.disabled=ST.pick!=null;bt.onclick=()=>{ST.pick=t;if(t===q.ok)ST.score++;redraw();};o.append(bt);});b.append(o);
    if(ST.pick!=null)b.append(el('div','verdict '+(ST.pick===q.ok?'ok':'bad'),'<b>'+(ST.pick===q.ok?'Верно.':'Неверно.')+'</b> '+esc(q.why)));}
  stage.append(a,b);main.append(stage);const nav=el('div','navrow');
  if(ST.pick!=null&&ST.qi<ST.qs.length)nav.append(btn('Следующий вопрос →',()=>{ST.qi++;ST.pick=null;redraw();},'acc'));
  nav.append(nextBtn());main.append(nav);
}

/* ---------- 3. Проблема и вывод ---------- */
function probStep(){
  const x=T[ST.cur];picker('Пункты 4 и 5 плана: чаще всего баллы теряют здесь');
  const stage=el('div','stage'),a=el('div','panel grow col'),b=el('div','panel grow col');
  const mk=(host,title,task,key,model,hint)=>{host.append(el('h3',null,title),el('p','task',esc(task)),el('p','note',hint));const ta=el('textarea','mini tall');ta.placeholder='Напишите 2–3 предложения.';ta.setAttribute('aria-label',title);try{ta.value=localStorage.getItem(KEY+'-'+who+'-'+x.id+'-'+key)||'';}catch(e){}ta.oninput=()=>{try{localStorage.setItem(KEY+'-'+who+'-'+x.id+'-'+key,ta.value);}catch(e){}};host.append(ta);if(ST.showP)host.append(el('div','verdict','<b>Образец:</b> '+esc(model)));};
  mk(a,'Абзац 4 · проблема и решение','– outline a problem that can arise with '+x.problem+' and suggest a way of solving it','p','However, a problem can arise with '+x.problem+': '+x.p+'. To solve it, '+x.s+'.','Проблема – именно с тем, что названо в задании. Решение – конкретное действие: кто и что может сделать.');
  mk(b,'Абзац 5 · вывод и мнение','– conclude by giving and explaining your opinion on '+x.opinion,'o','In conclusion, I believe that '+x.o+'.','Мнение – по вопросу из задания, а не «о проекте вообще». Обязательно объясните его: because …');
  stage.append(a,b);main.append(stage);const nav=el('div','navrow');
  nav.append(btn(ST.showP?'Скрыть образцы':'Показать образцы',()=>{ST.showP=!ST.showP;redraw();}),el('span','note','Образцы составлены для сайта.'),nextBtn());main.append(nav);
}

/* ---------- 4. Пишу 38 ---------- */
const CARD=['Во вступлении названы проект, его тема, Zetland, опрос и участники – как в задании.','Сказано, где данные: в таблице или на диаграмме.','Приведены 2–3 факта, все цифры совпадают с заданием.','Сделаны 1–2 сравнения, и каждое прокомментировано.','В абзацах 2 и 3 разные данные.','Проблема – та, что названа в плане; решение конкретное.','В выводе – моё мнение по вопросу из задания и объяснение.','Пять абзацев, каждый начинается со слова-связки.','Нет сокращений и разговорных слов.','Я перечитала текст и исправила ошибки. Уложилась в 40 минут.'];
function checks(t,x){const paras=t.split(/\n\s*\n|\n/).map(s=>s.trim()).filter(Boolean),w=words(t),low=t.toLowerCase(),nums=x.rows.map(r=>r[1]).filter((n,i,a)=>a.indexOf(n)===i).filter(n=>new RegExp('(^|\\D)'+n+'(\\s?%| per ?cent|\\D|$)').test(t)).length;
  return [['Объём 200–250 слов',w>=200&&w<=250,w+(w>=180&&w<200||w>250&&w<=275?' · допустимо':w&&w<180?' · меньше 180 – 0 баллов':w>275?' · лишнее не проверяется':'')],['Пять абзацев',paras.length===5,paras.length+' из 5'],
   ['Названы проект, Zetland и опрос',/project/.test(low)&&/zetland/.test(low)&&/survey|poll/.test(low)],['Ссылка на таблицу или диаграмму',/table|pie chart|chart|diagram/.test(low)],
   ['Цифры из задания',nums>=3,nums+' разных · нужно от 3'],['Сравнение',/\b(than|twice|times as|as \w+ as|whereas|while|compared|in comparison|percentage points|difference)\b/.test(low)],
   ['Проблема и решение',/problem|difficult|issue|challenge/.test(low)&&/solv|solution|way out|could|should/.test(low)],['Вывод с мнением',/in conclusion|to sum up|to conclude|all in all/.test(low)&&/i believe|in my opinion|i think|i am convinced|to my mind/.test(low)],
   ['Без сокращений',w>0&&!/\b\w+n[’']t\b|\bi[’']m\b|\bit[’']s\b|[’'](re|ve|ll)\b/i.test(t)]];}
function overlay(title,node){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title),node,btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
function writeStep(){
  const x=T[ST.cur],dk=KEY+'-'+who+'-'+x.id+'-t';picker('Задание составлено для сайта по образцу демоверсии ФИПИ · 40 минут');
  const stage=el('div','stage'),a=el('div','panel side kim p38 wide',taskHtml(x)),b=el('div','grow col wr'),c=el('div','ckrow');
  const ta=el('textarea');ta.spellcheck=false;ta.placeholder='Пишите здесь. Абзацы разделяйте пустой строкой. Черновик сохраняется в этом браузере.';ta.setAttribute('aria-label','Мой текст');try{ta.value=localStorage.getItem(dk)||'';}catch(e){}
  const paint=()=>{c.innerHTML='';checks(ta.value,x).forEach(r=>c.append(el('span','ckp'+(r[1]?' ok':''),(r[1]?'✓ ':'')+r[0]+(r[2]?' · '+r[2]:''))));};
  ta.oninput=()=>{try{localStorage.setItem(dk,ta.value);}catch(e){}paint();};paint();b.append(ta,c);stage.append(a,b);main.append(stage);
  const nav=el('div','navrow'),msg=el('span','note');
  nav.append(btn('Скопировать для учителя',()=>{const t='Задание 38.'+ST.kind+' · '+NAMES[who]+' · №'+x.id+' '+x.topic+' · '+words(ta.value)+' слов\n\n'+ta.value;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{msg.textContent='Скопировано.';}).catch(()=>{msg.textContent='Не получилось скопировать.';});},'main'),
    btn('Карта самопроверки',()=>{const d=el('div');CARD.forEach(k=>{const l=el('label','ck'),i=el('input');i.type='checkbox';l.append(i,el('div',null,k));d.append(l);});overlay('Карта самопроверки · то, что не видит автоматическая проверка',d);}),
    btn('Образец',()=>{const s=sample(x);overlay('Образец · составлен для сайта · '+words(s)+' слов',el('pre','model',esc(s)));}),
    btn('Очистить черновик',()=>{ta.value='';try{localStorage.removeItem(dk);}catch(e){}paint();},'sm'),msg);main.append(nav);
}
Clock.mount();paintWho();go(Math.min(STEPS.length-1,Math.max(0,(+location.hash.slice(1)||1)-1)));
