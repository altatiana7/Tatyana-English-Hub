/* Пробник ЕГЭ 2027 · Вариант 1 – домашняя работа Кати (материалы учителя).
   Аудирование 3–9, чтение 10, 11, 12–18, грамматика 19–24, словообразование 25–29, лексика 30–36, письмо 37, эссе 38.
   Отправка – «Отправить учителю на проверку» (одна попытка, ответы не показываются). Черновик хранится в браузере. */
const main=$('#main'),tabs=$('#tabs'),KEY='ege27k-mock1',PG='mock1';
const T=!!window.TEACHER,RV=KS.review(PG);let SENT=KS.sent(PG);
const blank=()=>({l3:{},r10:{},r11:{},r12:{},g:{},wf:{},v:{},w37:'',w38:'',c38:0,q12:0,checked:false});
let S=blank();
(function load(){if(RV){S=Object.assign(blank(),RV.data);S.checked=true;return;}
  if(SENT){S=Object.assign(blank(),SENT.data);S.sent=true;S.checked=false;return;}
  try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)S=Object.assign(blank(),s);}catch(e){}if(!T)S.checked=false;})();
const save=()=>{if(RV||S.sent)return;try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const AG='ABCDEFG';
const audio=el('audio','main');audio.controls=true;audio.preload='none';audio.src='audio/mock1-l39.mp3';

const M={
 l3:{q:[
  ['What do we learn about Sandra Wright at the beginning of the interview?',['She’s won very few competitions.','She’s not internationally famous.','She rarely has time for interviews.']],
  ['Sandra started playing tennis because ...',['her father was fond of this game.','she had a great tennis coach at school.','tennis matches were often held in her town.']],
  ['Sandra’s first coach was her ...',['school teacher.','parent.','sister.']],
  ['What motivates Sandra now, besides her love for tennis?',['Winning more titles.','A chance to inspire others.','Travelling the world.']],
  ['One of Sandra’s hobbies is ...',['charity.','surfing.','hiking.']],
  ['What helps Sandra to balance her career and family life?',['Being able to set priorities.','Concentrating only on tennis.','A team of professional managers.']],
  ['Sandra thinks that success is about ...',['winning.','growing.','being famous.']]],
  a:[3,1,2,2,1,1,2]},
 r10:{h:['From natural to technological','Present everywhere','Smart ideas changing the world','Making our lives less boring','Cheaper and stronger over time','Changing habits','Necessary at sea','Helping to get around'],
  t:['Humans are naturally curious and creative. This led our species to many scientific and technological discoveries. Since our earliest ancestors hit a rock to make the first sharp-edged tool, humans have continued to innovate. From the debut of the wheel to the launch of Mars rovers, several of these key findings stand out as especially revolutionary. Some inventions were made by chance. However, most of them were the work of innovative thinkers who had put many years into their discoveries.',
  'Finding your way in the world was much harder in the past. People used tools like compasses, maps and stars to explore and settle in most parts of our planet. However, old methods didn’t work well for exact navigation, especially for airplanes or when walking in unfamiliar places. The invention of GPS fixed this problem. GPS is a system of satellites that send signals to Earth. Anyone with a GPS device can use these signals to know exactly where they are. GPS is very important for safety.',
  'Before the invention of the wheel, humans were limited in how much stuff we could transport over land, and how far. The wheel itself was not the most difficult part of ‘inventing the wheel.’ When time came to connect a platform to the wheel, things got tricky. For instance, the holes at the centre of the wheels had to be nearly perfectly round and smooth. The hard work paid off. Wheeled carts helped agriculture and transportation of goods. Now, wheels are found in everything from clocks to vehicles or turbines.',
  'Ancient mariners used the stars for navigation, but this method didn’t work during the day or on cloudy nights, making it dangerous to travel far from land. The first compass was invented in China. It was used for navigation for the first time between the 11th and 12th centuries. Soon after, the technology was brought to the West. The compass helped mariners to navigate safely far from land. It opened up the world for exploration and the development of global trade. This instrument is still widely used today.',
  'The invention of the light bulb transformed our world. It made us less dependent on natural light. It allowed us to be productive at any time, day or night. Thomas Edison is credited as the primary inventor of the technology because he made a lighting system in 1879. This invention introduced electricity to homes of the Western world. It also had a rather unexpected result of modifying people’s sleep patterns. Instead of going to bed at nightfall and sleeping in segments throughout the night, we now sleep all in one go.',
  'People first made nails over 2,000 years ago in Ancient Rome. This became possible when humans learned how to work with metal. Before this, builders had to fit wooden pieces together in special ways, which was much harder and took more time. Until about 200 years ago, workers made nails by hand. A blacksmith would heat an iron rod and hammer it into shape. Machines started making nails between 1790 and 1820, which made them more available. The way we make nails keeps improving. Now nails are made from steel and last longer.',
  'People have been keeping food cold for thousands of years. In ancient times, they used ice or cold water, depending on where they lived. The first artificial cooling system appeared in 1748. In 1834, American engineer Jacob Perkins created a new cooling system using compressed gas. Then in 1876, German engineer Carl von Linde found a way to turn gas into liquid. The first home refrigerator was invented in 1913 by American engineer Fred Wolf. As more people wanted fresh food, refrigerators became common in houses.'],
  a:[3,8,2,7,6,5,1]},
 r11:{title:'Rivers and streams',
  p:['The UK rivers and streams are very important natural features. Not only do they help to make the British landscape attractive and lively, but they have always been crucial for the growth of towns and cities. They have been providing fresh water for drinking and farming, {A}.',
  'Some of the most beautiful rivers in England are called ‘chalk streams.’ Their pure, clear, constant water from underground chalk springs, flowing across gravel beds, makes them perfect sources of clean water. They are ideal places {B}. They are home to all kinds of animals, fish, insects, and plants. The majority of the world’s chalk streams are found in England. There are only about 200 chalk streams in the world. And most of them are in the southern part of England, with a few more in France, {C}.',
  'Unfortunately, far too many of the UK waterways have been overused and undervalued. Several of them are almost dry in some places, and polluted in others. Less than a fifth of England’s rivers are healthy, {D} on them. In fact, population growth and a big increase in water use have both badly affected the ecosystems of rivers and streams. And recent research has shown {E} local rivers is wasted.',
  'People can turn this around. Ecologists know {F} enough water for people and nature if they are looked after properly.'],
  o:['which makes them all even more special','for lots of wild creatures to breed and grow','where there are so many chalk streams that','that local rivers and streams can provide','that a third of the water people take from','and for business and transport over centuries','and climate change is putting more pressure'],
  a:[6,2,1,7,5,4]},
 r12:{title:'What can help you to live a better life',
  p:['There are lots of things that can help you to live a better life, but one of them is not that clear – boundaries. Boundaries are how we care and give support to those we love – without sacrificing our own health and happiness in the process. They are not necessarily about our relationships with people, as many might think. In the modern world, we sometimes need to set boundaries to using technology. Here are a few tricks I’ve found particularly useful.',
  'My number one must-have is treating the news like a snack. I am ready to stop scrolling through negative news or social media content, and you would probably benefit from doing the same. Many therapists recognise that constantly refreshing the headlines takes a toll on you; during the workday, it makes you think less about the work, and it causes unnecessary stress. ‘There’s a lot of pressure to keep up, like it’s what’s expected of me or the right thing to do, and I need to redefine what the actual limit is for me,’ says Mike, who has a consulting agency in San Francisco. ‘What I would love to do is go back to the days before cable news, when the newspaper arrived once or twice a day.’',
  'If you don’t like your compulsive news-seeking habit either, join him in checking the headlines just twice a day. If that still feels like too much, I suggest subscribing to a weekly newsletter that summarizes recent events, and catching up in one condensed session. You’ll probably end up feeling more focused and optimistic.',
  'Another thing is to banish tech from the bedroom. In 2026, change the relationship with your phone – at least for nights. Mike is going to start keeping his phone in another room, and he encourages others to set the same boundary. ‘Nobody has told me I need to have my phone next to me all the time, but for a long time I used to do it. I thought, “What if somebody calls in the middle of the night, or there’s an emergency?” But I also can’t think of a time when that happened,’ Mike adds.',
  'If you, too, operate under the assumption that other people expect you to be available 24/7, reevaluate that notion, he suggests. You might find that if you keep your phone in another room overnight – while letting your friends know about your new boundary – you’ll sleep better and feel more refreshed in the morning.',
  'Last, but not least – trade virtual time for face time. Katy Mith’s days often pass in a virtual haze. The New York-based psychologist sees clients online during the day, and then hops back on a virtual call in the evening to meet with fellow leaders in the organizations she’s involved with. Then there’s even more tech when it’s time to catch up with long-distance friends and family. ‘I’ve had to think about how much of my life I want to spend in that medium,’ says Mith, author of many books about well-being. ‘I’m trying to be very thoughtful about how much of my week is on virtual calls.’',
  'If that makes sense for you, she says, make it a point to say ‘no’ to opportunities that are not part of your usual course of work and involve online meetings, or let the organizers know that you can’t commit to lots of virtual time. Then, they can choose to proceed with or without you, if you’re not going to be virtual with them a lot of the time.',
  'She also recommends seeking out community-based opportunities that prioritize getting together in person. ‘All those side conversations that happen when you get together with people are really good for your mental health and will help brighten your year.’',
  'These boundaries help create a balance between online and offline life, ensuring that technology use enriches rather than detracts from personal well-being and real-world interactions.'],
  q:[['The goal of the text is to ...',['give a definition of boundaries.','describe types of boundaries.','give advice on limiting technology.','share tricks of how to support others.']],
  ['The expression ‘takes a toll on you’ (paragraph 2) is closest in meaning to ...',['limits your freedom.','changes your life.','has a bad effect.','causes emotions.']],
  ['What is Mike’s advice on dealing with the news?',['Try to read the news in your free time only.','Limit news input to twice a day or just weekly.','Look for a specific type of news like cable news.','Read just news headlines to catch up quickly.']],
  ['That in ‘...when that happened’ (paragraph 4) most probably refers to ...',['Leaving a phone in another room.','Keeping a phone close by.','Your colleagues calling you.','A sudden serious event.']],
  ['Which is NOT mentioned as a suggestion for better sleep?',['Notify others you are not available at a late time.','Turn off technology at a certain time before sleep.','Stop assuming others may need you day and night.','Avoid leaving your phone in your bedroom for a night.']],
  ['The therapist Katy Mith advises limiting ...',['online meetings outside work.','virtual working calls per week.','conversations online after work.','virtual communication with family.']],
  ['What is the main idea of the text?',['Setting boundaries on technology use improves your life.','It is possible to live a better life without technology.','Achieving a balance between online and offline life is hard.','A lot of people realize that technology is becoming harmful.']]],
  a:[3,3,2,4,2,1,1]},
 g:{title:'The River Nile',start:19,items:[
  ['The River Nile is the longest river in the world, stretching for 6853 km in the northeast of Africa. It ___ the main water source for many African countries such as Sudan or Egypt for a long time.','BE',['has been']],
  ['Ancient Egyptians settled along the banks of the Nile. There they ___ to build accommodation and grow crops.','BEGIN',['began']],
  ['Wheat was the ___ crop which ancient Egyptians cultivated, and they greatly depended on the Nile floods to make the soil fertile.','ONE',['first']],
  ['The Nile’s predictable flooding cycle allowed ancient Egyptians to develop a calendar based on its patterns. They knew very well that they ___ from hunger and poverty if the river didn’t flood.','SUFFER',['would suffer']],
  ['Many ancient Egyptian cities, including Cairo and Luxor, ___ along the Nile’s banks.','BUILD',['were built']],
  ['Ancient Egyptians even believed the River Nile was a god, ___ as Hapi, who was believed to control the river’s flooding.','KNOW',['known']]]},
 wf:{title:'Russian pelmeni',start:25,items:[
  ['When you think of Russian food, the first thing that may come to your mind is pelmeni. Pelmeni is Russia’s ___ dish.','NATION',['national']],
  ['They are small dumplings with ___ fillings wrapped in a thin layer of dough. The most popular fillings are all kinds of meat and sometimes fish, but some people add cabbage or mushrooms, too.','VARY',['various']],
  ['___, Russian women made pelmeni only in winter so that they could make a lot of them and keep them frozen outdoors in special wooden boxes. Now you can eat pelmeni all the year round.','HISTORICAL',['historically']],
  ['Most ___ to Russia try pelmeni and find them very tasty.','VISIT',['visitors']],
  ['There is an ___ monument to pelmeni in Russia. It is located in Izhevsk, Udmurtia. There is a gastronomic festival devoted to pelmeni in Udmurtia, too.','USUAL',['unusual']]]},
 v:{title:'Henry',
  p:['It was impossible for Henry to get to his office in half an hour. The wind was howling, and the cars were stuck in snowdrifts. He couldn’t {30} a day like that. The buses had been somewhere around Park Avenue, where they sat huddled like frozen dinosaurs, as one left the flock only very rarely to {31} up a few brave travellers. The travellers rushed from doorways frantically waving their arms, sliding wildly to the curb. They mounted the buses with damp eyes and red faces, and in Henry’s case, icicles on his beard.',
  'It had been absolutely impossible to get a taxi. He had given {32} after fifteen minutes of waiting and started walking south from his street. Henry often walked to work. It was only eighteen blocks from door to door. Today he soon {33} that the biting wind was brutal, and he had only gone four more blocks when he had already been out of breath. A friendly doorman {34} him to wait in a lobby. Henry thought that the other, more sensible souls caught their first glimpse of the blizzard that morning had {35} not to go to work at all. Henry was sure that the store would be empty. But he wasn’t the type to sit at home twiddling his thumbs or watching serials. And it wasn’t that he went to work because he was too compulsive. The truth was that Henry went to work six days a week simply because he loved the store very much, {36} often, like today, he didn’t have to come.'],
  o:[['recognise','remind','receive','remember'],['pick','seize','grab','catch'],['up','out','of','off'],['repeated','realised','regarded','remained'],['accepted','approved','allowed','afforded'],['demanded','decided','directed','depended'],['even','still','yet','just']],
  a:[4,1,1,2,3,2,3]}
};

const STEPS=[
 {id:'l3',label:'Аудирование 3–9',min:0,draw:lis3},
 /* 29.10: Кате задано только аудирование 3–9; остальные части варианта (чтение, 19–36, 37, 38) были на уроке */
 {id:'rep',label:T?'Отчёт':'Отправить',min:0,draw:report}];
const cnt=o=>Object.keys(o).filter(k=>o[k]!=null&&o[k]!=='').length;
const NEED={l3:7,r10:7,r11:6,r12:7,g:6,wf:5,v:7};
function isDone(id){if(NEED[id])return cnt(S[id])>=NEED[id];if(id==='w37')return words(S.w37)>=90;if(id==='w38')return words(S.w38)>=180;return S.checked||S.sent;}
function paintTabs(){tabs.innerHTML='';STEPS.forEach((s,k)=>{const b=el('button','tab num'+(k===cur?' on':'')+(isDone(s.id)?' done':''),'<i>'+(k+1)+'</i><span>'+s.label+'</span>');b.title=s.label;b.type='button';b.onclick=()=>go(k);tabs.append(b);});
  const on=tabs.querySelector('.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});}
let cur=0;
function go(k){cur=k;if(k>0)audio.pause();Clock.set(STEPS[k].min*60);redraw();}
function redraw(){paintTabs();main.innerHTML='';STEPS[cur].draw();}
function nextBtn(){return cur<STEPS.length-1?btn('Дальше: '+STEPS[cur+1].label+' →',()=>go(cur+1),'main sp'):el('span');}
function head(ru){main.append(el('div','inst','<b>'+ru+'</b>'));}
function lock(e){if(S.checked||S.sent)e.disabled=true;return e;}
function mark(ok){return S.checked?(ok?' ok':' bad'):'';}
const tick=()=>{const t=tabs.children[cur];t&&t.classList.toggle('done',isDone(STEPS[cur].id));};

/* ---------- Аудирование 3–9 ---------- */
function lis3(){
  {const r=el('div','navrow');r.append(audio,el('span','note','Запись звучит дважды, паузы уже внутри. Включите один раз и не останавливайте.'));main.append(r);}
  const stage=el('div','stage listening39'),sheet=el('div','panel kimsheet');
  sheet.append(el('div','kimnote','Вы услышите интервью. В заданиях 3–9 запишите в поле ответа цифру 1, 2 или 3, соответствующую выбранному Вами варианту ответа. Вы услышите запись дважды.'));
  const grid=el('div','kimgrid');
  M.l3.q.forEach((q,k)=>{const item=el('section','kimitem'),top=el('div','kimq');top.append(el('span','kimno',String(k+3)),el('span',null,esc(q[0])));item.append(top);
    const opts=el('div','kimopts');const box=lock(el('input','kimbox'));box.maxLength=1;box.inputMode='numeric';box.setAttribute('aria-label','Ответ '+(k+3));
    const paint=()=>{opts.querySelectorAll('.kimopt').forEach((o,j)=>o.classList.toggle('on',S.l3[k]===j+1));box.value=S.l3[k]||'';};
    const set=v=>{if(S.checked||S.sent)return;S.l3[k]=v;save();paint();tick();};
    q[1].forEach((ans,j)=>{const o=el('div','kimopt',(j+1)+') '+esc(ans));o.onclick=()=>set(j+1);if(S.checked&&j+1===M.l3.a[k])o.classList.add('correct');opts.append(o);});
    box.oninput=()=>{const v=+box.value;if(v>=1&&v<=3)set(v);else{box.value='';set(null);}};
    const ans=el('div','kimans');ans.append(el('span',null,'Ответ:'),box);if(S.checked)box.classList.add(S.l3[k]===M.l3.a[k]?'ok':'bad');
    const bd=el('div','kimbody');bd.append(opts,ans);item.append(bd);grid.append(item);paint();});
  sheet.append(grid);stage.append(sheet);main.append(stage);
  const nav=el('div','navrow');nav.append(nextBtn());main.append(nav);
}

/* ---------- Чтение ---------- */
function selRow(m,label,store,k,max,right,lbl){const s=lock(el('select',mark(store[k]===right).trim()));s.setAttribute('aria-label',lbl);s.append(new Option('…',''));for(let n=1;n<=max;n++)s.append(new Option(n,n));s.value=store[k]||'';
  s.onchange=()=>{store[k]=s.value?+s.value:null;save();tick();};m.append(el('b',null,label+(S.checked&&store[k]!==right?' → '+right:'')),s);}
function read10(){
  head('Задание 10. Установите соответствие между текстами A–G и заголовками 1–8. Используйте каждую цифру только один раз. В задании один заголовок лишний.');
  const stage=el('div','stage'),a=el('div','panel grow read mk'),b=el('div','panel side');
  M.r10.t.forEach((t,k)=>a.append(el('p',null,'<b>'+AG[k]+'</b> '+esc(t))));
  b.append(el('ol','hl',M.r10.h.map((x,k)=>'<li><b>'+(k+1)+'.</b> '+esc(x)+'</li>').join('')));
  const m=el('div','match');m.style.gridTemplateColumns='auto 1fr auto 1fr';AG.split('').forEach((L,k)=>selRow(m,L,S.r10,k,8,M.r10.a[k],'Текст '+L));
  b.append(m);stage.append(a,b);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Рекомендуемое время – 8 минут. Таймер – кнопка «Старт» вверху.'),nextBtn());main.append(nav);
}
function read11(){
  head('Задание 11. Прочитайте текст и заполните пропуски A–F частями предложений, обозначенными цифрами 1–7. Одна часть лишняя.');
  const stage=el('div','stage'),a=el('div','panel grow read mk'),b=el('div','panel side');
  a.append(el('h3',null,esc(M.r11.title)));M.r11.p.forEach(p=>a.append(el('p',null,esc(p).replace(/\{([A-F])\}/g,(x,L)=>'<b class="gapL">'+L+'. ________</b>'))));
  b.append(el('ol','hl',M.r11.o.map((x,k)=>'<li><b>'+(k+1)+'.</b> '+esc(x)+'</li>').join('')));
  const m=el('div','match');m.style.gridTemplateColumns='auto 1fr auto 1fr';'ABCDEF'.split('').forEach((L,k)=>selRow(m,L,S.r11,k,7,M.r11.a[k],'Пропуск '+L));
  b.append(m);stage.append(a,b);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Рекомендуемое время – 8 минут.'),nextBtn());main.append(nav);
}
function chipsQ(first,n,curK,sel,key,okFn){const c=el('div','chips');for(let k=0;k<n;k++){const b=el('button','chip'+(k===curK?' on':'')+(S.checked?(okFn(k)?' ok':' bad'):(sel[k]!=null?' fill':'')),String(first+k));b.type='button';b.onclick=()=>{S[key]=k;save();redraw();};c.append(b);}return c;}
function read12(){
  head('Задания 12–18. Прочитайте текст и выберите вариант ответа 1, 2, 3 или 4.');
  const k=S.q12,q=M.r12.q[k],stage=el('div','stage read12'),a=el('div','panel grow read');a.append(el('h3',null,esc(M.r12.title)));M.r12.p.forEach(p=>a.append(el('p',null,esc(p))));
  const card=el('div','panel side qcard q12card');card.append(el('div','qhead','<span class="qnum">'+(12+k)+'</span>'),el('div','qtext long',esc(q[0])));
  const o=el('div','opts c1');q[1].forEach((w,j)=>{const r=M.r12.a[k],b=lock(el('button','opt'+(S.checked?(j+1===r?' ok':(S.r12[k]===j+1?' bad':'')):(S.r12[k]===j+1?' sel':'')),(j+1)+') '+esc(w)));b.type='button';b.onclick=()=>{S.r12[k]=j+1;save();redraw();};o.append(b);});card.append(o);
  stage.append(a,card);main.append(stage);
  const nav=el('div','navrow');nav.append(chipsQ(12,7,k,S.r12,'q12',i=>S.r12[i]===M.r12.a[i]),btn('← Назад',()=>{S.q12--;redraw();},'sm'),btn('Вперёд →',()=>{S.q12++;redraw();},'sm'),nextBtn());
  nav.children[1].disabled=k===0;nav.children[2].disabled=k===6;main.append(nav);
}

/* ---------- 19–29: сплошной текст как на ФИПИ, слово – справа на полях ---------- */
const gOk=(id,i)=>M[id].items[i][2].some(v=>norm(v)===norm(S[id][i]||''));
function gaps(id){const D=M[id],g=id==='g';
  head(g?'Задания 19–24. Прочитайте текст. Преобразуйте слова, напечатанные заглавными буквами в конце строк, обозначенных номерами 19–24, так, чтобы они грамматически соответствовали содержанию текста.':'Задания 25–29. Прочитайте текст. Образуйте от слов, напечатанных заглавными буквами в конце строк, обозначенных номерами 25–29, однокоренные слова, так, чтобы они грамматически и лексически соответствовали содержанию текста.');
  const stage=el('div','stage'),a=el('div','panel grow fipiT');a.append(el('h3',null,esc(D.title)));
  D.items.forEach((it,i)=>{const row=el('div','fr'),parts=it[0].split('___'),tx=el('div','ft');tx.append(el('b','fn',String(D.start+i)),document.createTextNode(parts[0]));
    const inp=lock(el('input','fin'+mark(gOk(id,i))));inp.type='text';inp.autocomplete='off';inp.spellcheck=false;inp.setAttribute('autocapitalize','off');inp.value=S[id][i]||'';inp.setAttribute('aria-label','Ответ '+(D.start+i));
    inp.oninput=()=>{S[id][i]=inp.value;save();tick();};tx.append(inp);if(S.checked&&!gOk(id,i))tx.append(el('b','fright',' → '+esc(it[2][0])+' '));tx.append(document.createTextNode(parts[1]||''));
    row.append(tx,el('div','fw',it[1]));a.append(row);});
  stage.append(a);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Впишите в пропуск одно слово или форму, как в бланке ЕГЭ.'),nextBtn());main.append(nav);
}
/* ---------- 30–36 ---------- */
function voc(){const D=M.v;
  head('Задания 30–36. Прочитайте текст с пропусками, обозначенными номерами 30–36. Эти номера соответствуют заданиям 30–36, в которых представлены возможные варианты ответов. Выберите один вариант.');
  const stage=el('div','stage'),a=el('div','panel grow fipiT');a.append(el('h3',null,esc(D.title)));
  D.p.forEach(par=>{const p=el('p','vp');par.split(/\{(\d\d)\}/).forEach((x,j)=>{if(j%2===0){p.append(document.createTextNode(x));return;}const k=+x-30,s=lock(el('select','vsel'+mark(S.v[k]===D.a[k])));s.setAttribute('aria-label','Пропуск '+x);s.append(new Option(x+' …',''));D.o[k].forEach((o,n)=>s.append(new Option(x+' · '+(n+1)+') '+o,n+1)));s.value=S.v[k]||'';
    s.onchange=()=>{S.v[k]=s.value?+s.value:null;save();tick();};p.append(s);if(S.checked&&S.v[k]!==D.a[k])p.append(el('b','fright',' → '+D.o[k][D.a[k]-1]+' '));});a.append(p);});
  stage.append(a);main.append(stage);const nav=el('div','navrow');nav.append(el('span','note','Нажмите на пропуск и выберите вариант 1–4.'),nextBtn());main.append(nav);
}

/* ---------- Письмо ---------- */
const E38=[{title:'38.1 · Culture · Theatre',subj:'young Zetlanders and culture',q:'What can motivate you to go to the theatre more often?',col:'Options',
  rows:[['Productions connected with themes relevant to my life',35],['After-show parties, opportunities to meet the actors',30],['Affordable prices',22],['Behind-the-scenes tours',7],['Positive reviews from popular bloggers',6]],
  problem:'a problem that can arise for teenagers not interested in cultural events',opinion:'theatre-going as a free time activity'},
 {title:'38.2 · Friendship · Communication',subj:'communication with friends in Zetland',q:'What is the main reason why you rarely communicate with your old friends?',col:'Options',
  rows:[['Living far from each other',34],['Lack of free time',26],['New friends are more interesting',20],['Conflicts in the past',11],['Different interests',9]],
  problem:'a problem that one can face when communicating with old friends',opinion:'whether it is important to have many friends'}];
const LIM={37:{min:100,max:140,lo:90,hi:154},38:{min:200,max:250,lo:180,hi:275}};
function writing(n){const key='w'+n,L=LIM[n];
  head(n===37?'Задание 37. Электронное письмо личного характера. Рекомендуемое время – 20 минут.':'Задание 38. Выберите 38.1 или 38.2 и напишите письменное высказывание. Рекомендуемое время – 40 минут.');
  const stage=el('div','stage'),a=el('div','panel side kim kimsheet kimw'),b=el('div','panel grow col wr');a.style.flexBasis='50%';a.style.width='50%';
  if(n===37){a.innerHTML='<div class="kimtask"><span class="kimno">37</span><div>You have received an email message from your English-speaking pen-friend John:</div></div><div class="kimmail"><div class="mr"><b>From:</b> John@mail.uk</div><div class="mr"><b>To:</b> Russian_friend@ege.ru</div><div class="mr"><b>Subject:</b> National Unity Day</div><div class="mb">… I’m doing a project on “Holidays in Different Countries of the World.” I’ve learnt that in Russia, National Unity Day is celebrated on November 4th. What event does this holiday commemorate? How is it celebrated in Russia? How do you and your family usually spend this day?<br>… My friends and I have started a book club…</div></div><p>Write an email to John.<br>In your message:<br>– answer his questions;<br>– ask 3 questions about the book club.</p><p><b>Write 100–140 words.</b><br>Remember the rules of email writing.</p>';}
  else{const P=E38[S.c38],sw=el('div','chips');E38.forEach((x,k)=>{const c=lock(el('button','chip'+(k===S.c38?' on':''),x.title));c.type='button';c.onclick=()=>{S.c38=k;save();redraw();};sw.append(c);});a.append(sw);
    a.append(el('div',null,'<div class="kimtask"><span class="kimno">38</span><div>Imagine that you are doing a project on <b>'+P.subj+'</b>. You have found some data on the subject – the results of a survey conducted among Zetland teenagers (see the table below).<br><b>Comment on the survey data and give your opinion on the subject of the project.</b></div></div><div class="kimrow"><table class="kimtab"><tr><th colspan="2">The survey question:<br>'+P.q+'<br><i>Choose one option</i></th></tr><tr><th>'+P.col+'</th><th>Respondents (%)</th></tr>'+P.rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</table><div><p><b>Write 200–250 words.</b> Use the following plan:</p><ul class="kimplan"><li>– make an opening statement on the subject of the project;</li><li>– select and report 2–3 facts;</li><li>– make 1–2 comparisons where relevant and give your comments;</li><li>– outline '+P.problem+' and suggest a way of solving it;</li><li>– conclude by giving and explaining your opinion on '+P.opinion+'.</li></ul></div></div>'));}
  const ta=lock(el('textarea'));ta.value=S[key];ta.placeholder='Пишите здесь. Черновик сохраняется в этом браузере.';ta.spellcheck=false;ta.setAttribute('aria-label','Ответ на задание '+n);
  const wc=el('div','wc'),num=el('b'),msg=el('span');wc.append(num,msg);
  const upd=()=>{const w=words(ta.value),ok=w>=L.min&&w<=L.max,soft=w>=L.lo&&w<=L.hi;num.textContent=w;num.className=ok?'ok':(w&&!soft?'bad':'');
    msg.textContent='слов · нужно '+L.min+'–'+L.max+(w&&w<L.lo?' · меньше '+L.lo+' слов – 0 баллов за задание':w>L.hi?' · проверяются только первые '+L.max+' слов':'');};
  ta.oninput=()=>{S[key]=ta.value;save();upd();tick();};upd();
  b.append(ta,wc);stage.append(a,b);main.append(stage);
  const nav=el('div','navrow');nav.append(el('span','note','Пишите без словаря и переводчика. Текст оценит учитель по критериям ФИПИ.'),nextBtn());main.append(nav);
}

/* ---------- Отчёт / отправка ---------- */
const right=(sel,key)=>key.filter((a,k)=>sel[k]===a).length;
function scores(){return [['Аудирование 3–9',right(S.l3,M.l3.a),7]];}
function report(){
  if(!T){head(S.sent?'Работа отправлена учителю. Ответы и баллы покажет учитель.':'Проверьте, всё ли сделано, и отправьте работу учителю. Отправить можно один раз: после отправки ответы изменить нельзя.');
    const res=el('div','res'),a=el('div','panel'),b=el('div','panel');a.append(el('h3',null,'Что сделано'));
    STEPS.slice(0,-1).forEach(s=>a.append(el('div','rrow','<span>'+s.label+'</span><span class="note">'+(isDone(s.id)?'готово':'не закончено')+'</span><b>'+(isDone(s.id)?'✓':'—')+'</b>')));
    b.append(el('h3',null,'Как отправить'),el('p',null,'Нажмите «Отправить учителю на проверку» – работа сразу уйдёт учителю. Ничего копировать и пересылать не нужно.'),el('p','note','Учитель получит все ответы.'));
    res.append(a,b);main.append(res);const nav=el('div','navrow');
    nav.append(KS.button(PG,()=>{const d=JSON.parse(JSON.stringify(S));delete d.sent;delete d.checked;return d;},o=>{SENT=o;S.sent=true;redraw();}));main.append(nav);return;}
  if(RV)main.append(KS.reviewBar(RV));
  head(RV?'Работа Кати проверена автоматически.':S.checked?'Работа проверена.':'Нажмите «Проверить работу», чтобы увидеть верные и неверные ответы.');
  const res=el('div','res'),a=el('div','panel'),b=el('div','panel');
  if(S.checked){const r=scores();a.append(el('h3',null,'Верно · автоматическая проверка'));r.forEach(x=>{const p=x[1]/x[2];a.append(el('div','rrow','<span>'+x[0]+'</span><div class="meter"><i class="'+(p<.7?'low':p<.86?'mid':'high')+'" style="width:'+p*100+'%"></i></div><b>'+x[1]+' / '+x[2]+'</b>'));});
    a.append(el('div','rrow','<span class="total">Итого</span><span class="note"></span><b class="total">'+r.reduce((s,x)=>s+x[1],0)+' / 7</b>'));}
  else{a.append(el('h3',null,'Что сделано'));STEPS.slice(0,-1).forEach(s=>a.append(el('div','rrow','<span>'+s.label+'</span><b>'+(isDone(s.id)?'✓':'—')+'</b>')));}
  b.append(el('h3',null,'Ответы'),el('p','note','Ошибки видны на вкладках: зелёным – верно, красным – неверно, после стрелки – правильный ответ.'));
  res.append(a,b);main.append(res);
  const nav=el('div','navrow');if(!S.checked)nav.append(btn('Проверить работу',()=>{S.checked=true;save();redraw();},'acc'));
  if(!RV){const clr=btn('Очистить всё',()=>{if(clr.dataset.sure){try{localStorage.removeItem(KEY);}catch(e){}S=blank();go(0);}else{clr.dataset.sure=1;clr.textContent='Точно очистить? Нажмите ещё раз';}},'sm sp');nav.append(clr);}
  main.append(nav);
}
Clock.mount();go(RV?STEPS.length-1:0);
