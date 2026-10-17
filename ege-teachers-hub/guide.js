/* ГАЙДЛАЙН · КАТЯ (только на сайте учителя «Teacher's Hub ЕГЭ»).
   Два отдельных блока: что у Кати открыто для самостоятельной работы / ДЗ и что делаем только на уроке.
   «Задано сейчас» берётся с сайта Кати (ege-2027-b2-katya/homework.js) – то, что там записано в HW.items.
   Отметки «ДЗ» и «Урок» с датой ставит учитель; они хранятся в этом браузере, чтобы задания не повторялись. */
(function(){
  const box=document.getElementById('guide');if(!box)return;
  const KEY='tHubGuideKatya';
  /* [id, название, что внутри, ссылка, id заданий на сайте Кати] */
  const STUDENT=[
    ['Диагностика',[
      ['home1','Домашняя часть диагностики','Аудирование 1–9, чтение 10 и 12–18, письмо 37 и 38','home1.html',['home1']]]],
    ['Блок 1 · Family and friends · лексика',[
      ['w-words','Words · карточки','Слова темы, Quizlet','lessonw1.html#w',['lessonw1:words']],
      ['w-colls','Collocations','Коллокации темы','lessonw1.html#c',['lessonw1:colls']],
      ['w-hunt','Error hunter','Поиск ошибок','lessonw1.html#h',['lessonw1:hunt']],
      ['w-match','Match','Сопоставление','lessonw1.html#m',['lessonw1:match']],
      ['fq','Family · Phrasal verbs','Карточки Quizlet и тренировка','family-quizlet.html',[]]]],
    ['Блок 1 · устная часть',[
      ['t1-1','Task 1 · текст 1','Чтение вслух','lessonw1.html#t1',['lessonw1:t1-1']],
      ['t1-2','Task 1 · текст 2','Чтение вслух','lessonw1.html#t1',['lessonw1:t1-2']],
      ['t2-1','Task 2 · объявление 1','Условный диалог-расспрос','lessonw1.html#t2',['lessonw1:t2-1']],
      ['t2-2','Task 2 · объявление 2','Условный диалог-расспрос','lessonw1.html#t2',['lessonw1:t2-2']],
      ['iv1','Task 3 · интервью 1','Пять вопросов на слух','lessonw1.html#t3',['lessonw1:iv1']],
      ['iv2','Task 3 · интервью 2','Пять вопросов на слух','lessonw1.html#t3',['lessonw1:iv2']],
      ['iv3','Task 3 · интервью 3','Пять вопросов на слух','lessonw1.html#t3',['lessonw1:iv3']],
      ['t4-1','Task 4 · фото','Сравнение двух фото','lessonw1.html#t4',['lessonw1:t4-1']],
      ['t4-2','Монолог · Your best friend','Разминка перед заданием 4','lessonw1.html#t4',['lessonw1:t4-2']]]],
    ['Тренажёры',[
      ['write37','Письмо 37','Структура, разбор вопросов, 89 писем','write37.html',['write37']],
      ['write38','Задание 38','Структура, данные, 27 тем','write38.html',['write38']],
      ['russia','Russia','Устная часть о России','russia.html',['russia']]]]
  ];
  const LESSON=[
    ['Диагностика',[
      ['lesson1','Диагностика на занятии','8 этапов: интервью, вопросы, чтение вслух, монолог, аудирование, 19–36, чтение 11','lesson1.html',['lesson1']]]],
    ['Блок 1 · занятие',[
      ['xf-words','Family and Friends · лексика','Слова и интерактивный квиз','extra-family.html',[]],
      ['xf-trans','Family and Friends · перевод','Перевод с лексикой темы','extra-family.html',[]],
      ['xf-list','Family and Friends · Listening 1','Аудирование по теме','extra-family.html',[]],
      ['xf-speak','Family and Friends · Speaking','Обсуждение по теме','extra-family.html',[]]]],
    ['Письменная часть · у Кати закрыта',[
      ['wp-l','Listening · 1–9','Из диагностики','lesson1.html#5',[]],
      ['wp-r','Reading · 11','Из диагностики','lesson1.html#8',[]],
      ['wp-g','Grammar · 19–24','Из диагностики','lesson1.html#6',[]],
      ['wp-w','Word formation · 25–29','Из диагностики','lesson1.html#6',[]],
      ['wp-v','Vocabulary · 30–36','Из диагностики','lesson1.html#7',[]]]]
  ];
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return {};}};
  const save=o=>{try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}};
  const today=()=>{const d=new Date();return d.getDate()+'.'+String(d.getMonth()+1).padStart(2,'0');};
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let K={set:'',due:'',items:[],ok:false};

  /* что сейчас задано Кате – читаем её homework.js как текст */
  function readKatya(){
    return fetch('../ege-2027-b2-katya/homework.js?t='+Date.now()).then(r=>r.ok?r.text():'').then(t=>{
      t=t.replace(/\/\*[\s\S]*?\*\//g,'');const m=t.match(/window\.HW\s*=\s*\{([\s\S]*?)\};/);if(!m)return;
      const g=(k)=>{const x=m[1].match(new RegExp(k+"\\s*:\\s*'([^']*)'"));return x?x[1]:'';};
      const it=m[1].match(/items\s*:\s*\[([\s\S]*?)\]/);
      K={set:g('set'),due:g('due'),items:it?(it[1].match(/'[^']*'/g)||[]).map(s=>s.slice(1,-1)):[],ok:true};
      /* задано сейчас → сама ставим отметку «ДЗ» с датой выдачи */
      const o=load();let ch=false;
      [...STUDENT,...LESSON].forEach(g=>g[1].forEach(r=>{if(r[4].some(id=>K.items.indexOf(id)>=0)){o[r[0]]=o[r[0]]||{};if(!o[r[0]].hw){o[r[0]].hw=K.set||today();ch=true;}}}));
      if(ch)save(o);
    }).catch(()=>{});
  }
  const isNow=r=>r[4].some(id=>K.items.indexOf(id)>=0);

  function row(r,o){
    const m=o[r[0]]||{},d=document.createElement('div');d.className='gr'+(isNow(r)?' now':'')+(m.hw||m.cl?' used':'');
    d.innerHTML='<a href="'+r[3]+'"><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></a>'+
      (isNow(r)?'<i class="gnow">задано сейчас</i>':'')+
      '<button type="button" class="gs hw'+(m.hw?' on':'')+'" title="Отметить: задано на дом">ДЗ'+(m.hw?' · '+esc(m.hw):'')+'</button>'+
      '<button type="button" class="gs cl'+(m.cl?' on':'')+'" title="Отметить: сделали на уроке">Урок'+(m.cl?' · '+esc(m.cl):'')+'</button>';
    const [bh,bc]=d.querySelectorAll('.gs');
    const tg=k=>()=>{const x=load();x[r[0]]=x[r[0]]||{};x[r[0]][k]=x[r[0]][k]?'':today();save(x);paint();};
    bh.onclick=tg('hw');bc.onclick=tg('cl');return d;
  }
  function col(title,sub,groups,cls){
    const o=load(),c=document.createElement('div');c.className='gcol '+cls;
    let n=0,u=0;groups.forEach(g=>g[1].forEach(r=>{n++;const m=o[r[0]]||{};if(m.hw||m.cl)u++;}));
    c.innerHTML='<div class="gh"><b>'+title+'</b><span>'+sub+'</span><em>использовано '+u+' из '+n+'</em></div>';
    const sc=document.createElement('div');sc.className='gscr';
    groups.forEach(g=>{const h=document.createElement('div');h.className='gg';h.textContent=g[0];sc.append(h);g[1].forEach(r=>sc.append(row(r,o)));});
    c.append(sc);return c;
  }
  function paint(){
    box.innerHTML='';
    const top=document.createElement('div');top.className='gtop';
    if(!K.ok)top.innerHTML='<b>Сейчас у Кати:</b> <span>не удалось прочитать её сайт – отметки ниже работают.</span>';
    else if(!K.items.length)top.innerHTML='<b>Сейчас у Кати:</b> <span>домашняя работа не задана – на её сайте открыто всё из левого блока.</span>';
    else top.innerHTML='<b>Задано Кате сейчас'+(K.set?' · '+esc(K.set):'')+(K.due?' → к '+esc(K.due):'')+':</b> '+K.items.map(id=>'<span class="gt">'+esc(window.HW&&HW.label?HW.label(id):id)+'</span>').join('');
    const clr=document.createElement('button');clr.type='button';clr.className='gclr';clr.textContent='Сбросить отметки';
    clr.onclick=()=>{if(confirm('Сбросить все отметки «ДЗ» и «Урок»?')){save({});paint();}};top.append(clr);
    const g=document.createElement('div');g.className='g2';
    g.append(col('ДЗ · для студента','Открыто на сайте Кати: она делает сама',STUDENT,'st'),
             col('На уроке','У Кати закрыто: открываю я на занятии',LESSON,'ls'));
    box.append(top,g);
  }
  paint();readKatya().then(paint);
})();
