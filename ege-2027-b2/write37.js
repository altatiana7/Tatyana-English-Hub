/* Тренажёр письма (задание 37): структура → разбор вопросов → ответы → свои вопросы → письмо целиком.
   Игровые шаги каждый раз начинаются с нуля; сохраняется только черновик письма. */
const L=window.W37,main=$('#main'),tabs=$('#tabs'),NAMES=['Рита','Катя'],KEY='ege2027b2-w37';
let who=0;try{who=+localStorage.getItem(KEY+'-who')||0;}catch(e){}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const TYPES={
 habit:{n:'О себе: привычки и вкусы',c:'#3f8fd6',how:'Отвечай о себе в Present Simple: одна-две фразы с деталью.',fr:'I usually … · I’m keen on … · My favourite … is … because …'},
 country:{n:'О России и ровесниках',c:'#2fa89a',how:'Вопрос не о тебе: пиши о подростках, стране или своём регионе.',fr:'Most Russian teenagers … · In my country … · In my region …'},
 opinion:{n:'Мнение и причина',c:'#e39a1c',how:'Нужна позиция и объяснение. Без because ответ неполный.',fr:'I think … because … · In my opinion, … · To my mind, …'},
 would:{n:'Would: мечты и советы',c:'#d0559f',how:'В вопросе would – в ответе тоже would.',fr:'I’d like to … because … · I’d advise you to … · If I were you, I’d …'},
 past:{n:'Прошлое и опыт',c:'#8e5bd0',how:'Время как в вопросе: Past Simple или Present Perfect.',fr:'When I was a child, I … · I have never … · The last … I’ve … was …'},
 future:{n:'Планы и будущее',c:'#ea7f3c',how:'Планы – going to, прогноз – will.',fr:'I’m going to … · I’m planning to … · I think … will …'}
};
const TK=Object.keys(TYPES);
const ALLQ=[];L.forEach(x=>x.q.forEach((q,i)=>ALLQ.push({t:q.t,k:q.k,d:q.d,lead:i===0?x.lead:'',ans:x.ans[i],name:x.name})));
const CNT={};TK.forEach(k=>CNT[k]=ALLQ.filter(q=>q.k===k).length);const DBL=ALLQ.filter(q=>q.d).length;
const TENSE={past:['Уже случилось','Past Simple: Where did you …? What was …? Who gave you …?'],present:['Происходит сейчас','Present Simple или Continuous: What is … like? How often do you …? What are you …ing?'],future:['Ещё впереди','Future: When are you going to …? What will you …? Who is coming …?']};
const PARTS=[['Обращение','Dear Emily,','Hi Emily, · Hello Emily,','На отдельной строке, после имени запятая.'],
 ['Благодарность за письмо','Thanks for your email. It was great to hear from you.','Thank you for your message. · I was glad to get your email.','Это ссылка на предыдущий контакт.'],
 ['Ответы на три вопроса','In your email you asked me about … Well, …','You asked me about … · As for your question, …','Отдельный абзац. На каждый вопрос – полный ответ.'],
 ['Реакция на новость','Anyway, great news about your puppy!','By the way, I’m glad you’ve joined the club. · Wow, a trip to London sounds amazing!','Мостик к своим вопросам.'],
 ['Три вопроса по теме','What …? How …? When …?','Все три – строго о том, что указано в задании.','Тот же абзац, что и реакция на новость.'],
 ['Завершающая фраза','I have to go now. Write back soon.','Sorry, I must dash. · Hope to hear from you soon. · Keep in touch!','Отдельная строка: причина закончить и надежда на ответ.'],
 ['Подпись-клише','Best wishes,','All the best, · Lots of love, · Take care,','Отдельная строка, запятая в конце.'],
 ['Имя','Rita','Только имя.','Отдельная строка, без точки.']];
const ST={order:null,placed:0,miss:0, typ:'habit', pool:null,pi:0,filt:'all',stage:0,score:0,streak:0,pick:null,dpick:null,show:false, ap:null,ai:0,apick:null,aval:['','',''],achk:false, cur:0};
let cur=0;
const STEPS=[['Структура','#7b5fc4',0,structure],['Разбор вопросов','#3f8fd6',0,analysis],['Отвечаю на вопросы','#2fa89a',0,answer],['Задаю вопросы','#4faa55',0,ask],['Пишу письмо','#ea7f3c',20,letter]];
function paintWho(){const w=$('#who');w.innerHTML='';NAMES.forEach((n,i)=>{const b=el('button','tab'+(i===who?' on':''),n);b.type='button';b.onclick=()=>{who=i;try{localStorage.setItem(KEY+'-who',i);}catch(e){}paintWho();redraw();};w.append(b);});}
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':''),'<i>'+(k+1)+'</i><span>'+s[0]+'</span>');b.type='button';b.title=s[0];b.style.setProperty('--c',s[1]);b.onclick=()=>go(k);tabs.append(b);});}
function go(k){cur=k;document.body.style.setProperty('--step',STEPS[k][1]);Clock.set(STEPS[k][2]*60);redraw();}
function redraw(){paintTabs();main.innerHTML='';STEPS[cur][3]();}
function head(t,src){main.append(el('div','inst','<b>'+t+'</b>'+(src?'<span class="src">'+src+'</span>':'')));}
function nextBtn(){return cur<STEPS.length-1?btn('Дальше: '+STEPS[cur+1][0]+' →',()=>go(cur+1),'main sp'):el('span');}

/* ---------- 1. Структура: собери письмо ---------- */
function structure(){
  if(!ST.order)ST.order=shuffle(PARTS.map((p,i)=>i));
  const done=ST.placed===PARTS.length;
  head(done?'Письмо собрано. В скобках – чем можно заменить фразу.':'Собери письмо по порядку: нажимай части справа в том порядке, в каком они идут в письме.','Формат электронного письма по демоверсии ФИПИ: без адреса и даты');
  const stage=el('div','stage'),a=el('div','panel grow sk'),b=el('div','panel side col'+(done?' slim':''));
  PARTS.forEach((p,i)=>{const on=i<ST.placed;a.append(el('div','skrow'+(on?' on':''),'<i>'+(i+1)+'</i><div>'+(on?'<b>'+p[0]+'</b><span class="ph">'+esc(p[1])+'</span>'+'</div><div class="alt">'+(done?esc(p[2]):p[3]):'<span class="ph empty">…</span>')+'</div>'));});
  if(done){b.append(el('h3',null,'Три правила'),el('p',null,'<b>Абзацы.</b> Благодарность, ответы, вопросы – каждый блок с новой строки.'),el('p',null,'<b>Объём.</b> 100–140 слов. Меньше 90 – ноль за всё задание; после 154 слова не проверяются.'),el('p',null,'<b>Стиль.</b> Письмо другу: сокращения (I’m, don’t) уместны, официальные обороты – нет.'),
      el('p','note','Ошибок при сборке: '+ST.miss+'.'),btn('Собрать ещё раз',()=>{ST.order=null;ST.placed=0;ST.miss=0;redraw();}));}
  else{b.append(el('div','note','Ошибок: '+ST.miss));const box=el('div','parts');ST.order.forEach(i=>{if(i<ST.placed)return;const t=btn('<b>'+PARTS[i][0]+'</b>'+esc(PARTS[i][1]),()=>{if(i===ST.placed){ST.placed++;redraw();}else{ST.miss++;t.classList.add('bad');b.firstChild.textContent='Ошибок: '+ST.miss;setTimeout(()=>t.classList.remove('bad'),500);}},'part');box.append(t);});b.append(box);}
  stage.append(a,b);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Часть '+Math.min(ST.placed+1,PARTS.length)+' из '+PARTS.length),nextBtn());main.append(nav);
}

/* ---------- 2. Разбор вопросов друга ---------- */
function analysis(){
  head('Что спрашивает друг: разбор всех писем банка','62 письма Открытого банка ФИПИ · '+ALLQ.length+' вопросов');
  const stage=el('div','stage'),a=el('div','grow col'),b=el('div','panel side col'),g=el('div','tgrid');
  TK.forEach(k=>{const T=TYPES[k],t=el('button','ttile'+(k===ST.typ?' on':''),'<b>'+T.n+'</b><span class="big">'+CNT[k]+'</span><div class="meter"><i style="width:'+CNT[k]/CNT.habit*100+'%;background:'+T.c+'"></i></div><span>'+Math.round(CNT[k]/ALLQ.length*100)+'% вопросов</span>');t.type='button';t.style.setProperty('--c',T.c);t.onclick=()=>{ST.typ=k;redraw();};g.append(t);});
  a.append(g,el('div','panel dbl','<b>Двойные вопросы: '+DBL+' из '+ALLQ.length+'.</b> В вопросе две части – «…, and why?», «why or why not?», «…and what are these?». Ответ только на первую часть засчитывается как неполный.'));
  const T=TYPES[ST.typ],ex=ALLQ.filter(q=>q.k===ST.typ);
  b.append(el('h3',null,T.n),el('p',null,'<b>Как отвечать.</b> '+T.how),el('p','frame',esc(T.fr)),el('h3',null,'Примеры из банка'));
  ex.slice(0,2).forEach(q=>b.append(el('p','exq','<b>'+esc(q.t)+'</b><br><span>'+esc(q.ans)+'</span>')));
  b.querySelector('h3').style.color=T.c;
  stage.append(a,b);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Нажми на тип, чтобы увидеть, как на него отвечать. Образцы ответов составлены для сайта.'),nextBtn());main.append(nav);
}

/* ---------- 3. Отвечаю на вопросы друга ---------- */
function answer(){
  if(!ST.pool){ST.pool=shuffle(ALLQ.filter(q=>ST.filt==='all'||q.k===ST.filt));ST.pi=0;ST.stage=0;ST.pick=ST.dpick=null;ST.show=false;}
  const q=ST.pool[ST.pi];
  head('Вопрос из письма друга. Сначала определи, какой это вопрос, потом ответь.');
  const top=el('div','navrow'),ch=el('div','chips');[['all','Все']].concat(TK.map(k=>[k,TYPES[k].n.split(':')[0]])).forEach(([k,n])=>{const c=el('button','chip'+(ST.filt===k?' on fill':''),n);c.type='button';c.onclick=()=>{ST.filt=k;ST.pool=null;redraw();};ch.append(c);});
  top.append(ch,el('b','sp','Очки: '+ST.score+' · серия: '+ST.streak));main.append(top);
  const stage=el('div','stage'),card=el('div','panel grow qcard');
  card.append(el('div','qhead','<span class="qnum">'+(ST.pi+1)+'</span><span class="qtitle">из '+ST.pool.length+' · письмо от '+esc(q.name)+'</span>'));
  if(q.lead)card.append(el('div','note',esc(q.lead)));
  card.append(el('div','qtext',esc(q.t)));
  if(ST.stage===0){const o=el('div','opts c3');TK.forEach(k=>{const bt=el('button','opt',TYPES[k].n);bt.type='button';bt.onclick=()=>{ST.pick=k;const ok=k===q.k;ST.score+=ok?1:0;ST.streak=ok?ST.streak+1:0;ST.stage=1;redraw();};o.append(bt);});card.append(el('div','note','Какой это вопрос?'),o);}
  else{const ok=ST.pick===q.k,T=TYPES[q.k];card.append(el('div','verdict '+(ok?'ok':'bad'),'<b>'+(ok?'Верно.':'Не совсем.')+'</b> Это «'+T.n+'». '+T.how+' <i>'+esc(T.fr)+'</i>'));
    if(ST.stage===1){const o=el('div','opts');o.style.gridTemplateColumns='1fr 1fr';[['Одна часть',false],['Две части – ответить на обе',true]].forEach(([n,v])=>{const bt=el('button','opt',n);bt.type='button';bt.onclick=()=>{ST.dpick=v;const k=v===q.d;ST.score+=k?1:0;ST.streak=k?ST.streak+1:0;ST.stage=2;redraw();};o.append(bt);});card.append(el('div','note','Сколько частей в вопросе?'),o);}
    else{const k2=ST.dpick===q.d;card.append(el('div','verdict '+(k2?'ok':'bad'),'<b>'+(k2?'Верно.':'Не совсем.')+'</b> '+(q.d?'Вопрос двойной: нужен ответ на обе части.':'Здесь одна часть: хватит одной-двух фраз.')));
      const ta=el('textarea','mini');ta.placeholder='Напиши свой ответ: одна-две фразы.';ta.setAttribute('aria-label','Мой ответ');card.append(ta);
      if(ST.show)card.append(el('div','verdict','<b>Образец:</b> '+esc(q.ans)));}}
  stage.append(card);main.append(stage);const nav=el('div','navrow');
  if(ST.stage===2){if(!ST.show)nav.append(btn('Показать образец',()=>{const v=main.querySelector('textarea').value;ST.show=true;redraw();main.querySelector('textarea').value=v;}));
    nav.append(btn(ST.pi<ST.pool.length-1?'Следующий вопрос →':'Начать заново',()=>{if(ST.pi<ST.pool.length-1)ST.pi++;else{ST.pool=null;}ST.stage=0;ST.pick=ST.dpick=null;ST.show=false;redraw();},'acc'));}
  else nav.append(el('span','note','За каждое верное определение – очко.'));
  nav.append(nextBtn());main.append(nav);const t=main.querySelector('textarea');if(t&&!ST.show)t.focus();
}

/* ---------- 4. Задаю три вопроса ---------- */
const AUX=['do','does','did','is','are','was','were','am','have','has','had','will','would','can','could','should','shall','may','might','must'],WH=['what','where','when','why','who','whom','whose','which','how'];
function checkQ(s,all){s=s.trim();if(!s)return [false,'Вопрос не написан.'];if(!/\?$/.test(s))return [false,'В конце нужен вопросительный знак.'];
  const w=s.toLowerCase().replace(/[’']/g,"'").replace(/[^a-z' ]/g,' ').split(/\s+/).filter(Boolean),f=w[0].replace(/'.*$/,'');
  if(!WH.includes(f)&&!AUX.includes(f))return [false,'Начни с вопросительного слова (What, Where, How…) или вспомогательного глагола (Did, Is, Are…).'];
  if(w.length<4)return [false,'Слишком коротко: вопрос должен быть понятен без письма друга.'];
  if(['what','who','which','whose'].includes(f)&&['it','you','he','she','they','we','i','this','that'].includes(w[1]))return [false,'Проверь порядок слов: после вопросительного слова идёт глагол, а не подлежащее (What was it like?).'];
  if(WH.includes(f)&&!['who','what','which','whose'].includes(f)&&!w.slice(1,5).some(x=>AUX.includes(x.replace(/n't$/,''))||/'s$|'re$|'ll$|'d$/.test(x)))return [false,'После вопросительного слова нужен вспомогательный глагол: Where did you …? When is he …?'];
  if(all.filter(x=>x.trim().toLowerCase()===s.toLowerCase()).length>1)return [false,'Вопросы не должны повторяться.'];
  return [true,'По форме вопрос составлен верно.'];}
function ask(){
  if(!ST.ap){ST.ap=shuffle(L);ST.ai=0;ST.apick=null;ST.aval=['','',''];ST.achk=false;}
  const x=ST.ap[ST.ai];head('Друг сообщает новость. Нужно задать три вопроса строго по теме.');
  const stage=el('div','stage'),a=el('div','panel grow qcard'),b=el('div','panel side col');a.style.justifyContent='flex-start';
  a.append(el('div','qhead','<span class="qnum">'+(ST.ai+1)+'</span><span class="qtitle">из '+ST.ap.length+' · письмо от '+esc(x.name)+'</span>'),el('div','qtext long','…'+esc(x.trig)+' …'),el('div','kim','<p class="task">Ask 3 questions about '+esc(x.about)+'.</p>'));
  if(ST.apick==null){const o=el('div','opts c3');Object.keys(TENSE).forEach(k=>{const bt=el('button','opt',TENSE[k][0]);bt.type='button';bt.onclick=()=>{ST.apick=k;redraw();};o.append(bt);});a.append(el('div','note','Когда это происходит? От этого зависит время в твоих вопросах.'),o);
    b.append(el('h3',null,'Правила'),el('p',null,'<b>По теме.</b> Все три вопроса – о том, что названо в задании. Вопрос о другом не засчитывается.'),el('p',null,'<b>Время.</b> Смотри на новость друга: уже случилось, происходит или только будет.'),el('p',null,'<b>Разные.</b> Три разных вопроса, лучше с разными вопросительными словами.'));}
  else{const ok=ST.apick===x.tt;a.append(el('div','verdict '+(ok?'ok':'bad'),'<b>'+(ok?'Верно.':'Посмотри ещё раз.')+'</b> '+TENSE[x.tt][0]+'. '+esc(TENSE[x.tt][1])));
    [0,1,2].forEach(i=>{const r=el('div','qrow'),inp=el('input','ans q3');inp.type='text';inp.value=ST.aval[i];inp.placeholder='Вопрос '+(i+1);inp.spellcheck=false;inp.autocomplete='off';inp.setAttribute('aria-label','Вопрос '+(i+1));inp.oninput=()=>{ST.aval[i]=inp.value;};
      if(ST.achk){const c=checkQ(ST.aval[i],ST.aval);inp.classList.add(c[0]?'ok':'bad');r.append(inp,el('span','note',c[1]));}else r.append(inp);a.append(r);});
    b.append(el('h3',null,ST.achk?'Образец вопросов':'Подсказка'));
    if(ST.achk){b.append(el('ol','errs',x.ask.map(q=>'<li>'+esc(q)+'</li>').join('')),el('p','note','Проверка автоматическая и смотрит только на форму вопроса. По теме ли вопрос и нет ли ошибок, решает учитель.'));}
    else b.append(el('p',null,esc(TENSE[x.tt][1])),el('p','note','Тема вопросов: <b>'+esc(x.about)+'</b>.'));}
  stage.append(a,b);main.append(stage);const nav=el('div','navrow');
  if(ST.apick!=null&&!ST.achk)nav.append(btn('Проверить вопросы',()=>{ST.achk=true;redraw();},'acc'));
  if(ST.achk)nav.append(btn('Исправить',()=>{ST.achk=false;redraw();}),btn('Следующая новость →',()=>{ST.ai=(ST.ai+1)%ST.ap.length;ST.apick=null;ST.aval=['','',''];ST.achk=false;redraw();},'acc'));
  nav.append(nextBtn());main.append(nav);
}

/* ---------- 5. Пишу письмо целиком ---------- */
const dkey=()=>KEY+'-'+who+'-'+L[ST.cur].id;
function checks(t){const lines=t.split('\n').map(s=>s.trim()).filter(Boolean),w=words(t),low=t.toLowerCase(),last=lines[lines.length-1]||'',prev=lines[lines.length-2]||'';
  return [['Обращение в первой строке',/^(dear|hi|hello)\s+\S+.*,\s*$/i.test(lines[0]||'')],['Благодарность за письмо',/thank|glad to|great to hear|nice to hear|good to hear|happy to/.test(low)],
   ['Три вопроса другу',(t.match(/\?/g)||[]).length>=3,(t.match(/\?/g)||[]).length+' из 3'],['Завершающая фраза',/write back|hope to hear|hear from you|have to go|got to go|must go|must dash|keep in touch|looking forward/.test(low)],
   ['Подпись-клише на отдельной строке',/^(best wishes|all the best|love|lots of love|take care|yours|best regards|warm wishes|cheers),?$/i.test(prev)],['Имя в последней строке',lines.length>3&&/^[A-Za-zА-Яа-яЁё]+$/.test(last)],
   ['Объём 100–140 слов',w>=100&&w<=140,w+(w>=90&&w<100||w>140&&w<=154?' · допустимо':w<90&&w?' · меньше 90 – 0 баллов':w>154?' · лишнее не проверяется':'')]];}
function letter(){
  const x=L[ST.cur];head('Задание 37. Электронное письмо личного характера · 20 минут','Открытый банк ФИПИ · письмо '+(ST.cur+1)+' из '+L.length);
  const top=el('div','navrow'),sel=el('select','pick');sel.setAttribute('aria-label','Выбор письма');L.forEach((y,i)=>sel.append(new Option((i+1)+'. '+(y.subject||y.topic)+' · '+y.name,i)));sel.value=ST.cur;sel.onchange=()=>{ST.cur=+sel.value;redraw();};
  top.append(sel,btn('Случайное письмо',()=>{ST.cur=Math.floor(Math.random()*L.length);redraw();},'sm'));main.append(top);
  const stage=el('div','stage'),a=el('div','panel side kim'),b=el('div','grow col wr'),c=el('div','panel chk');a.classList.add('p37');
  a.innerHTML='<p class="task">You have received an email message from your English-speaking pen-friend '+esc(x.name)+':</p><div class="stim"><div class="hd">From: '+esc(x.name)+'@mail.uk<br>To: Russian_friend@ege.ru<br>Subject: '+esc(x.subject||x.topic)+'</div>…'+esc(x.lead)+' '+x.q.map(q=>esc(q.t)).join(' ')+'<br>…'+esc(x.trig)+' …</div><p class="task" style="margin-top:8px">Write an email to '+esc(x.name)+'.<br>In your message:<br>– answer '+x.g+' questions;<br>– ask 3 questions about '+esc(x.about)+'.</p><p class="task">Write 100–140 words.<br>Remember the rules of email writing.</p>';
  const ta=el('textarea');ta.spellcheck=false;ta.placeholder='Пиши письмо здесь. Черновик сохраняется в этом браузере.';ta.setAttribute('aria-label','Моё письмо');try{ta.value=localStorage.getItem(dkey())||'';}catch(e){}
  const paint=()=>{c.innerHTML='';checks(ta.value).forEach(r=>c.append(el('div','ck'+(r[1]?' ok':''),'<i>'+(r[1]?'✓':'')+'</i><div>'+r[0]+(r[2]?' <span>'+r[2]+'</span>':'')+'</div>')));};
  ta.oninput=()=>{try{localStorage.setItem(dkey(),ta.value);}catch(e){}paint();};paint();
  b.append(ta);stage.append(a,b,c);main.append(stage);
  const nav=el('div','navrow'),msg=el('span','note');
  nav.append(btn('Скопировать для учителя',()=>{const t='Письмо 37 · '+NAMES[who]+' · №'+(ST.cur+1)+' '+(x.subject||x.topic)+' ('+x.name+') · '+words(ta.value)+' слов\n\n'+ta.value;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{msg.textContent='Скопировано – вставь в сообщение учителю.';}).catch(()=>{msg.textContent='Не получилось скопировать: выдели текст и скопируй вручную.';});},'main'),
    btn('Образец письма',()=>{const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,'Образец · составлен для сайта'),el('pre','model',esc(x.model)),btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}),
    btn('Очистить черновик',()=>{ta.value='';try{localStorage.removeItem(dkey());}catch(e){}paint();},'sm'),msg);main.append(nav);
}
Clock.mount();paintWho();go(Math.min(STEPS.length-1,Math.max(0,(+location.hash.slice(1)||1)-1)));
