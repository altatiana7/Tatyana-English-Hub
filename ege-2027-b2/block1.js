/* Блок 1 · Family and friends · банк заданий.
   Два экрана, на каждом две активности рядом:
   1) Grammar + Word formation рядом, 2) Reading (текст и утверждения), 3) Letter 37.
   Разные виды заданий не смешиваются; шрифт подбирается, чтобы текст помещался без прокрутки.
   Всё для учениц – на английском; заметки для учителя – по-русски под кнопкой «Учителю».
   Ничего не сохраняется: страница каждый раз открывается с первого текста. */
const main=$('#main'),tabs=$('#tabs'),B=window.B1;
const S={g:{v:0,val:{},done:false},w:{v:0,val:{},done:false},r:{v:0,val:{},done:false},l:{v:0,txt:{}}};
const NOTE={
 g:'<p><b>Грамматика, формат заданий 19–24.</b> 12 текстов по 9 пропусков из подборки «Family, friends» (тексты ОГЭ из открытого банка ФИПИ). Темы: времена, пассив, условные предложения и I wish, степени сравнения, местоимения, числительные, множественное число.</p><p>На уроке: один текст на время (7–8 минут), затем разбор только неверных пропусков. Дома: два текста подряд, отчёт – скриншот результата.</p><p>Проверка принимает полные и краткие формы (could not = couldn’t), регистр не важен – как в бланке ЕГЭ.</p>',
 w:'<p><b>Словообразование, формат заданий 25–29.</b> 8 текстов по 6 пропусков из подборки «Family, friends» (тексты ОГЭ из открытого банка ФИПИ). Основное: -ful, -ive, -ing, -tion, -ness, -ship, -er/-or, отрицательные приставки un-, im-, dis-.</p><p>Попросите ученицу перед вводом сказать часть речи для каждого пропуска: так ловятся ошибки вида creative / creativity.</p>',
 r:'<p><b>Чтение: True / False / Not stated.</b> Три рассказа по 500 слов (ОГЭ, задания 13–19). В ЕГЭ такой формат – в аудировании (задание 2), поэтому тексты хороши для тренировки различия False и Not stated.</p><p>После проверки попросите ученицу для каждого ответа показать строку в тексте. Для Not stated – объяснить, почему в тексте нет ни «да», ни «нет».</p><p>Время: 10–12 минут на текст.</p>',
 l:'<p><b>Письмо 37.</b> Четыре письма из подборки (там они в формате ОГЭ: ответить на 3 вопроса, 100–120 слов). Для ЕГЭ добавлены последняя строка письма и требование задать 3 вопроса, объём 100–140 слов. Эта часть и примерные письма составлены для сайта; их можно исправить через «Правка ответов».</p><p>Время: 20 минут. Пишется дома; на уроке – разбор по критериям К1–К3.</p>'};
const SCREENS=[
 {label:'Grammar + Word formation',color:'#b0683a',panes:['g','w']},
 {label:'Reading',color:'#66549a',panes:['r']},
 {label:'Letter 37',color:'#2c7f78',panes:['l']}];
const PANE={
 g:{title:'Grammar',color:'#b0683a',draw:b=>gaps(b,'g',B.grammar,'Change the words in capitals so that they fit the text grammatically.')},
 w:{title:'Word formation',color:'#a85050',draw:b=>gaps(b,'w',B.wf,'Form a word from the word in capitals so that it fits the text grammatically and lexically.')},
 r:{title:'Reading',color:'#66549a',draw:reading},
 l:{title:'Letter 37',color:'#2c7f78',draw:letter}};
let cur=0;
function paintTabs(){tabs.innerHTML='';SCREENS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':''),'<i>'+(k+1)+'</i><span>'+s.label+'</span>');b.type='button';b.title=s.label;b.style.setProperty('--c',s.color);b.onclick=()=>go(k);tabs.append(b);});}
function go(k){document.querySelectorAll('.overlay').forEach(x=>x.remove());cur=k;document.body.style.setProperty('--step',SCREENS[k].color);paintTabs();main.innerHTML='';
  const ws=el('div','ws2 n'+SCREENS[k].panes.length);SCREENS[k].panes.forEach(key=>{const p=el('section','wp');p.dataset.k=key;p.style.setProperty('--pc',PANE[key].color);ws.append(p);drawPane(p);});main.append(ws);
  const f=ws.querySelector('input.fin:not([disabled])');f&&f.focus({preventScroll:true});}
function drawPane(p){const key=p.dataset.k,sc=p.querySelector('.scr'),sy=sc?sc.scrollTop:0;p.innerHTML='';PANE[key].draw(p);fitAll(p);const s2=p.querySelector('.scr');if(s2)s2.scrollTop=sy;}
/* подбор шрифта: уменьшаем, пока текст не поместится без прокрутки */
function fit(e){if(!e)return;const mx=+e.dataset.max,mn=+e.dataset.min;let f=mx;e.style.fontSize=f+'px';e.classList.remove('one');const over=()=>e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1;while(f>mn&&over()){f-=.5;e.style.fontSize=f+'px';}
  if(over()&&e.dataset.one){e.classList.add('one');e.style.fontSize=e.dataset.one+'px';}}
function fitAll(p){(p||main).querySelectorAll('[data-max]').forEach(fit);}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>fitAll(),80);});
const paneOf=key=>main.querySelector('.wp[data-k="'+key+'"]');
const repaint=key=>drawPane(paneOf(key));
function overlay(title,html){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));t.insertAdjacentHTML('beforeend',html);t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
function teachBtn(key){return btn('Учителю',()=>overlay(PANE[key].title+' · только для вас',NOTE[key]),'acc sm');}
/* шапка колонки: название + выбор текста ← список → */
function phead(p,key,list,reset,names,extra){const h=el('div','ph');h.append(el('b','pt',PANE[key].title));
  const sel=el('select');sel.setAttribute('aria-label',PANE[key].title+' text');(names||list.map(x=>x.t)).forEach((t,k)=>sel.append(new Option((k+1)+'. '+t,k)));const st=S[key];sel.value=st.v;
  const set=v=>{st.v=v;reset();repaint(key);};sel.onchange=()=>set(+sel.value);
  const bk=btn('←',()=>set(st.v-1),'sm'),fw=btn('→',()=>set(st.v<list.length-1?st.v+1:0),'sm');bk.disabled=st.v===0;bk.title='Previous text';fw.title=st.v<list.length-1?'Next text':'First text';
  h.append(bk,sel,fw);if(extra)h.append(...extra);else h.append(el('span','cnt',(st.v+1)+' / '+list.length));p.append(h);}

/* ---------- Грамматика и словообразование: текст с пропусками ---------- */
function parse(x){const gaps=[];const paras=x.split('\n').map(line=>line.split(/(\[\[[^\]]+\]\])/).map(ch=>{const m=ch.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);if(!m)return ch;const g={base:m[1],acc:m[2].split('/').map(s=>s.trim()),i:gaps.length};gaps.push(g);return g;}));return {gaps,paras};}
const okAns=(g,v)=>g.acc.some(a=>norm(a)===norm(v||''));
function gaps(p,key,list,task){const st=S[key],d=list[st.v],P=parse(d.x),reset=()=>{st.val={};st.done=false;};
  const P2=P;let ctl;
  if(st.done){const n=P2.gaps.filter(g=>okAns(g,st.val[g.i])).length;ctl=[el('b','sc',n+'/'+P2.gaps.length),btn('Again',()=>{reset();repaint(key);},'sm')];}
  else ctl=[btn('Check',()=>{st.done=true;repaint(key);},'main sm')];
  ctl.push(teachBtn(key));
  phead(p,key,list,reset,null,ctl);p.append(el('div','ptask',task));
  const box=el('div','gtext scr');box.dataset.max=17;box.dataset.min=13;
  P.paras.forEach(par=>{const pp=el('p');par.forEach(ch=>{if(typeof ch==='string'){pp.append(document.createTextNode(ch));return;}
    const g=ch,ok=st.done&&okAns(g,st.val[g.i]),w=el('span','fgap'),n=el('span','fnum'+(st.done?(ok?' ok':' bad'):''),String(g.i+1));
    const inp=el('input','ans fin'+(st.done?(ok?' ok':' bad'):''));inp.type='text';inp.autocomplete='off';inp.spellcheck=false;inp.setAttribute('autocapitalize','off');inp.setAttribute('aria-label',PANE[key].title+' gap '+(g.i+1));
    inp.value=st.val[g.i]||'';inp.disabled=st.done;inp.style.width=Math.max(7,g.acc[0].length+2)+'ch';inp.oninput=()=>{st.val[g.i]=inp.value;};
    inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const all=[...box.querySelectorAll('input.fin')];const nx=all[all.indexOf(inp)+1];if(nx)nx.focus();}};
    w.append(n,inp);if(st.done&&!ok)w.append(el('b','fright','→ '+esc(g.acc[0])));w.append(el('span','base sm',esc(g.base)));pp.append(w);});box.append(pp);});
  p.append(box);
}

/* ---------- Чтение: True / False / Not stated ---------- */
function reading(p){const st=S.r,d=B.reading[st.v],reset=()=>{st.val={};st.done=false;};
  phead(p,'r',B.reading,reset);p.append(el('div','ptask','Decide which statements are True (T), False (F) or Not stated (NS).'));
  const txt=el('div','txt scr');txt.dataset.max=17;txt.dataset.min=14;txt.dataset.one=16;txt.append(el('h3',null,esc(d.t)));d.x.split('\n').forEach(x=>txt.append(el('p',null,esc(x))));
  const sts=el('div','sts');
  d.st.forEach((s,k)=>{const r=el('div','sti'),b=el('div','tfn');r.append(el('i',null,String(k+1)),el('span',null,esc(s)));
    ['T','F','NS'].forEach((lab,j)=>{const v=j+1,on=st.val[k]===v,cls=st.done?(on?(v===d.key[k]?'ok':'bad'):(v===d.key[k]?'right':'')):(on?'on':''),x=el('button',cls,lab);x.type='button';x.disabled=st.done;x.onclick=()=>{st.val[k]=v;repaint('r');};b.append(x);});
    r.append(b);sts.append(r);});
  const rb=el('div','rbody');rb.append(txt,sts);p.append(rb);
  const f=el('div','pf');
  if(st.done){const n=d.key.filter((a,k)=>st.val[k]===a).length;f.append(el('b','sc',n+' / 7'),btn('Try again',()=>{reset();repaint('r');},'sm'),btn(st.v<B.reading.length-1?'Next text →':'First text',()=>{st.v=st.v<B.reading.length-1?st.v+1:0;reset();repaint('r');},'main sm'));}
  else f.append(btn('Check',()=>{st.done=true;repaint('r');},'main sm'),el('span','note',Object.keys(st.val).length+' / 7'));
  f.append(teachBtn('r'));p.append(f);
}

/* ---------- Письмо 37 по теме блока ---------- */
function letter(p){const st=S.l,x=B.letters[st.v];
  phead(p,'l',B.letters,()=>{},B.letters.map(l=>l.subject+' · '+l.name));
  const t=el('div','lsc scr');
  t.innerHTML='<p class="ptask">You have received an email message from your English-speaking pen-friend '+esc(x.name)+':</p><div class="stim"><div class="hd">From: '+esc(x.name)+'@mail.uk · To: Russian_friend@ege.ru · Subject: '+esc(x.subject)+'</div>…'+esc(x.lead)+'<br>…'+esc(x.q)+'<br>…'+esc(x.trig.replace(/\.$/,''))+'…</div><p class="ptask">Write an email to '+esc(x.name)+'. In your message: – answer '+x.g+' questions; – ask 3 questions about '+esc(x.about)+'. Write 100–140 words.</p>';
  const ta=el('textarea');ta.placeholder='Dear '+x.name+',';ta.value=st.txt[st.v]||'';ta.spellcheck=false;ta.setAttribute('aria-label','Your email');
  const wc=el('span','wc');const paint=()=>{const n=words(ta.value);wc.textContent='Words: '+n;wc.className='wc'+(n===0?'':(n>=100&&n<=140?' ok':' bad'));};ta.oninput=()=>{st.txt[st.v]=ta.value;paint();};paint();
  t.dataset.max=17;t.dataset.min=13;const lb=el('div','lbody'),rc=el('div','lcol');rc.append(ta);lb.append(t,rc);p.append(lb);
  const f=el('div','pf');f.append(wc,btn('Sample email',()=>showSample('Sample email · '+words(x.model)+' words','<p>'+ED.t('b1.l.'+st.v,x.model)+'</p>','This is a sample, not the only correct answer.','Close'),'sm'),teachBtn('l'));p.append(f);
}

/* #1, #2 – первый экран; #3 – чтение; #4 – письмо */
go([0,0,0,1,2][Math.min(4,+location.hash.slice(1)||1)]);
