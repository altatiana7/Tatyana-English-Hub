/* Блок 1 · Family and friends · банк заданий.
   Всё для учениц – на английском; заметки для учителя – по-русски под кнопкой «Учителю».
   Ничего не сохраняется: страница каждый раз открывается с первого текста. */
const main=$('#main'),tabs=$('#tabs'),B=window.B1;
const S={g:{v:0,val:{},done:false},w:{v:0,val:{},done:false},r:{v:0,val:{},done:false},l:{v:0,txt:{}}};
const STEPS=[
 {label:'Grammar',color:'#b0683a',draw:()=>gaps('g',B.grammar,'Grammar','Change the words in capitals so that they fit the text grammatically.')},
 {label:'Word formation',color:'#a85050',draw:()=>gaps('w',B.wf,'Word formation','Form a word from the word in capitals so that it fits the text grammatically and lexically.')},
 {label:'Reading',color:'#66549a',draw:reading},
 {label:'Letter 37',color:'#2c7f78',draw:letter}];
let cur=0,cleanup=null;
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':''),'<i>'+(k+1)+'</i><span>'+s.label+'</span>');b.type='button';b.title=s.label;b.style.setProperty('--c',s.color);b.onclick=()=>go(k);tabs.append(b);});}
function go(k){if(cleanup){cleanup();cleanup=null;}document.querySelectorAll('.overlay').forEach(x=>x.remove());cur=k;document.body.style.setProperty('--step',STEPS[k].color);paintTabs();main.innerHTML='';STEPS[k].draw();}
function redraw(){const y=main.querySelector('.gtext,.txt');const sy=y?y.scrollTop:0;go(cur);const y2=main.querySelector('.gtext,.txt');if(y2)y2.scrollTop=sy;}
function head(t){main.append(el('div','inst','<b>'+t+'</b>'));}
function overlay(title,html){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
function teachBtn(html){return btn('Учителю',()=>overlay('Учителю · только для вас',html),'acc sm');}
function nextBtn(){return cur<STEPS.length-1?btn('Next: '+STEPS[cur+1].label+' →',()=>go(cur+1),'main sp'):el('span');}
/* выбор текста: ← список → */
function picker(st,list,reset){const p=el('div','pick'),sel=el('select');sel.setAttribute('aria-label','Text');list.forEach((x,k)=>sel.append(new Option((k+1)+'. '+x.t,k)));sel.value=st.v;
  const set=v=>{st.v=v;reset();go(cur);};sel.onchange=()=>set(+sel.value);
  const bk=btn('←',()=>set(st.v-1),'sm'),fw=btn('→',()=>set(st.v<list.length-1?st.v+1:0),'sm');bk.disabled=st.v===0;bk.title='Previous text';fw.title=st.v<list.length-1?'Next text':'First text';
  p.append(bk,sel,fw,el('b',null,(st.v+1)+' / '+list.length));return p;}

/* ---------- Грамматика и словообразование: текст с пропусками ---------- */
function parse(x){const gaps=[];const paras=x.split('\n').map(line=>line.split(/(\[\[[^\]]+\]\])/).map(ch=>{const m=ch.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);if(!m)return ch;const g={base:m[1],acc:m[2].split('/').map(s=>s.trim()),i:gaps.length};gaps.push(g);return g;}));return {gaps,paras};}
const okAns=(g,v)=>g.acc.some(a=>norm(a)===norm(v||''));
function gaps(key,list,name,task){const st=S[key],d=list[st.v],P=parse(d.x);
  head(task);
  const nav=el('div','navrow');nav.append(picker(st,list,()=>{st.val={};st.done=false;}));main.append(nav);
  const box=el('div','gtext'),cols=el('div','cols2');
  P.paras.forEach(par=>{const p=el('p');par.forEach(ch=>{if(typeof ch==='string'){p.append(document.createTextNode(ch));return;}
    const g=ch,ok=st.done&&okAns(g,st.val[g.i]),w=el('span','fgap'),n=el('span','fnum'+(st.done?(ok?' ok':' bad'):''),String(g.i+1));
    const inp=el('input','ans fin'+(st.done?(ok?' ok':' bad'):''));inp.type='text';inp.autocomplete='off';inp.spellcheck=false;inp.setAttribute('autocapitalize','off');inp.setAttribute('aria-label','Gap '+(g.i+1));
    inp.value=st.val[g.i]||'';inp.disabled=st.done;inp.style.width=Math.max(8,g.acc[0].length+3)+'ch';inp.oninput=()=>{st.val[g.i]=inp.value;};
    inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const all=[...box.querySelectorAll('input.fin')];const nx=all[all.indexOf(inp)+1];if(nx)nx.focus();}};
    w.append(n,inp);if(st.done&&!ok)w.append(el('b','fright','→ '+esc(g.acc[0])));w.append(el('span','base sm',esc(g.base)));p.append(w);});cols.append(p);});
  box.append(cols);main.append(box);
  if(st.done){const n=P.gaps.filter(g=>okAns(g,st.val[g.i])).length;nav.append(el('b',null,'Score: '+n+' / '+P.gaps.length),btn('Try again',()=>{st.val={};st.done=false;go(cur);}),btn(st.v<list.length-1?'Next text →':'First text',()=>{st.v=st.v<list.length-1?st.v+1:0;st.val={};st.done=false;go(cur);},'main'));}
  else nav.append(btn('Check',()=>{st.done=true;redraw();},'acc'));
  nav.append(teachBtn(key==='g'
    ?'<p><b>Грамматика, формат заданий 19–24.</b> 12 текстов по 9 пропусков из подборки «Family, friends» (тексты ОГЭ из открытого банка ФИПИ). Темы: времена, пассив, условные предложения и I wish, степени сравнения, местоимения, числительные, множественное число.</p><p>На уроке: один текст на время (7–8 минут), затем разбор только неверных пропусков. Дома: два текста подряд, отчёт – скриншот результата.</p><p>Проверка принимает полные и краткие формы (could not = couldn’t), регистр не важен – как в бланке ЕГЭ.</p>'
    :'<p><b>Словообразование, формат заданий 25–29.</b> 7 текстов по 6 пропусков из подборки «Family, friends» (тексты ОГЭ из открытого банка ФИПИ). Основное: -ful, -ive, -ing, -tion, -ness, -ship, -er/-or, отрицательные приставки un-, im-, dis-.</p><p>Попросите ученицу перед вводом сказать часть речи для каждого пропуска: так ловятся ошибки вида creative / creativity.</p>'),nextBtn());
  if(!st.done){const f=box.querySelector('input.fin');f&&f.focus({preventScroll:true});}
}

/* ---------- Чтение: True / False / Not stated ---------- */
function reading(){const st=S.r,d=B.reading[st.v];
  head('Read the text. Decide which statements are True (T), False (F) or Not stated (NS).');
  const top=el('div','navrow');top.append(picker(st,B.reading,()=>{st.val={};st.done=false;}));main.append(top);
  const g=el('div','rd'),txt=el('div','txt'),sts=el('div','sts');txt.append(el('h3',null,esc(d.t)));d.x.split('\n').forEach(p=>txt.append(el('p',null,esc(p))));
  d.st.forEach((s,k)=>{const r=el('div','sti'),b=el('div','tfn');r.append(el('i',null,String(k+1)),el('span',null,esc(s)));
    ['T','F','NS'].forEach((lab,j)=>{const v=j+1,on=st.val[k]===v,cls=st.done?(on?(v===d.key[k]?'ok':'bad'):(v===d.key[k]?'right':'')):(on?'on':''),x=el('button',cls,lab);x.type='button';x.disabled=st.done;x.onclick=()=>{st.val[k]=v;redraw();};b.append(x);});
    r.append(b);sts.append(r);});
  g.append(txt,sts);main.append(g);
  const nav=el('div','navrow');
  if(st.done){const n=d.key.filter((a,k)=>st.val[k]===a).length;nav.append(el('b',null,'Score: '+n+' / 7'),btn('Try again',()=>{st.val={};st.done=false;go(cur);}),btn(st.v<B.reading.length-1?'Next text →':'First text',()=>{st.v=st.v<B.reading.length-1?st.v+1:0;st.val={};st.done=false;go(cur);},'main'));}
  else nav.append(btn('Check',()=>{st.done=true;redraw();},'acc'),el('span','note',Object.keys(st.val).length+' / 7'));
  nav.append(teachBtn('<p><b>Чтение: True / False / Not stated.</b> Три рассказа по 500 слов (ОГЭ, задания 13–19). В ЕГЭ такой формат – в аудировании (задание 2), поэтому тексты хороши для тренировки различия False и Not stated.</p><p>После проверки попросите ученицу для каждого ответа показать строку в тексте. Для Not stated – объяснить, почему в тексте нет ни «да», ни «нет».</p><p>Время: 10–12 минут на текст.</p>'),nextBtn());
  main.append(nav);
}

/* ---------- Письмо 37 по теме блока ---------- */
function letter(){const st=S.l,x=B.letters[st.v];
  const g=el('div','lt'),left=el('div','panel'),right=el('div','panel');
  left.innerHTML='<p class="task">You have received an email message from your English-speaking pen-friend '+esc(x.name)+':</p><div class="stim"><div class="hd">From: '+esc(x.name)+'@mail.uk<br>To: Russian_friend@ege.ru<br>Subject: '+esc(x.subject)+'</div>…'+esc(x.lead)+'<br>…'+esc(x.q)+'<br>…'+esc(x.trig.replace(/\.$/,''))+'…</div><p class="task">Write an email to '+esc(x.name)+'. In your message: – answer '+x.g+' questions; – ask 3 questions about '+esc(x.about)+'. Write 100–140 words. Remember the rules of email writing.</p>';
  const ta=el('textarea');ta.placeholder='Dear '+x.name+',';ta.value=st.txt[st.v]||'';ta.spellcheck=false;ta.setAttribute('aria-label','Your email');
  const wc=el('span','wc');const paint=()=>{const n=words(ta.value);wc.textContent='Words: '+n;wc.className='wc'+(n===0?'':(n>=100&&n<=140?' ok':' bad'));};ta.oninput=()=>{st.txt[st.v]=ta.value;paint();};paint();
  right.append(ta,wc);g.append(left,right);main.append(g);
  const nav=el('div','navrow');
  nav.append(picker(st,B.letters.map(l=>({t:l.subject+' · '+l.name})),()=>{}),btn('Sample email',()=>showSample('Sample email · '+words(x.model)+' words','<p>'+ED.t('b1.l.'+st.v,x.model)+'</p>','This is a sample, not the only correct answer.','Close'),'sm'),
    teachBtn('<p><b>Письмо 37.</b> Четыре письма из подборки (там они в формате ОГЭ: ответить на 3 вопроса, 100–120 слов). Для ЕГЭ добавлены последняя строка письма и требование задать 3 вопроса, объём 100–140 слов. Эта часть и примерные письма составлены для сайта; их можно исправить через «Правка ответов».</p><p>Время: 20 минут. Пишется дома; на уроке – разбор по критериям К1–К3.</p>'),nextBtn());
  main.append(nav);
}

go(Math.min(STEPS.length-1,Math.max(0,(+location.hash.slice(1)||1)-1)));
