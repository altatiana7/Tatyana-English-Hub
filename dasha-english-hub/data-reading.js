/* Reading Lab: 14 phonics lessons (letters -> sounds -> diphthongs). Games are generated from word groups. */
window.DASHA=window.DASHA||{paths:[]};
(function(){
const plain=w=>w.replace(/[|*]/g,'');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const CARDS=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{const p=x.split('=');return {w:p[0],ru:p[1]||'',ex:p[2]||''};});
/* magic-e word -> chunks with the vowel and final e highlighted, e.g. cake -> c|*a|k|*e */
function magic(w){const m=/^([^aeiou]*)([aeiou])([^aeiou]+)e$/.exec(w);if(!m)return w;return [m[1]?m[1].split('').join('|'):'','*'+m[2],m[3].split('').join('|'),'*e'].filter(Boolean).join('|').replace(/c\|h/,'ch').replace(/s\|h/,'sh').replace(/w\|h/,'wh').replace(/t\|h/,'th');}
const pickN=(a,n)=>shuffle(a).slice(0,n);

function RL(s){
  const groups=s.groups.map(g=>({k:g.k,s:g.s,words:g.magic?g.words.map(magic):g.words}));
  const flat=[];groups.forEach((g,gi)=>g.words.forEach(w=>flat.push({w,g:gi})));
  const hl=s.hl||[];
  // listen & tap
  let ltap;
  if(s.ltap)ltap=s.ltap;
  else{
    const tg=pickN(flat,12);
    ltap=tg.map(t=>{
      const word=plain(t.w);const opts=[word];
      const partner=(s.pairs||[]).find(p=>p.indexOf(word)>=0);
      if(partner)opts.push(partner.find(x=>x!==word));
      const others=shuffle(flat.filter(x=>plain(x.w)!==word&&opts.indexOf(plain(x.w))<0));
      const same=others.filter(x=>plain(x.w)[0]===word[0]);
      (same.length>=2?same:others).forEach(x=>{if(opts.length<4&&opts.indexOf(plain(x.w))<0)opts.push(plain(x.w));});
      others.forEach(x=>{if(opts.length<4&&opts.indexOf(plain(x.w))<0)opts.push(plain(x.w));});
      return {say:word,opts,ans:0};
    });
  }
  // sort
  const per=Math.ceil(12/groups.length);
  let sortItems=[];groups.forEach((g,gi)=>pickN(g.words,Math.min(per,g.words.length)).forEach(w=>sortItems.push([w,gi])));
  // odd one out (3 + 1)
  const odd=[];for(let n=0;n<10;n++){const a=n%groups.length;let b=(a+1+Math.floor(n/groups.length))%groups.length;if(b===a)b=(a+1)%groups.length;
    odd.push({ws:pickN(groups[a].words,3).concat(pickN(groups[b].words,1)),odd:3});}
  // build the word
  const bw=flat.filter(x=>{const n=plain(x.w).length;return n>=3&&n<=6;});
  const build=pickN(bw,Math.min(10,bw.length)).map(x=>x.w);
  // ladder rows
  const lw=shuffle(flat.map(x=>x.w));const rows=[];for(let k=0;k+3<lw.length&&rows.length<6;k+=4)rows.push(lw.slice(k,k+4));
  // same / different sound (floor is lava)
  const same=[];for(let n=0;n<12;n++){
    const a=Math.floor(n/2)%groups.length;
    if(n%2===0){const p=pickN(groups[a].words,2);same.push({a:p[0],b:p[1],ans:true});}
    else{const b=(a+1)%groups.length;same.push({a:pickN(groups[a].words,1)[0],b:pickN(groups[b].words,1)[0],ans:false});}
  }
  // speed
  const speed=pickN(flat.map(x=>x.w),12);
  // rule card
  const R=s.rule;
  const keys=R.keys.map(k=>`<button class="say" data-say="${plain(k)}">${plain(k)}</button>`).join('');
  const html=`<div class="rbig"><span class="g">${R.big}</span><span class="ipa">${R.ipa||''}</span></div>
    <div class="rkeys">${keys}</div>
    <div class="note">${R.note}</div>`;
  const P=s.pred;
  const mg={};s.groups.forEach(g=>{if(g.magic)g.words.forEach(w=>{mg[w]=magic(w);});});
  const cardList=CARDS(s.cards).map(c=>mg[c.w]?{w:mg[c.w],ru:c.ru,ex:c.ex}:c);
  return {id:s.id,name:s.name,short:s.short,cardsLabel:'Words',cards:cardList,hl,teach:s.teach,
    blocks:[
      {t:'predict',title:'Predict',mech:'Warm-up',hint:'Look at the photo and guess',img:s.id.toLowerCase(),cap:P.cap,q:P.q,opts:P.opts,reveal:P.reveal},
      {t:'rule',title:'Sound of the day',mech:'Rule',hint:'Listen to the key words',html},
      {t:'ltap',title:'Listen & tap',mech:'Listening',hint:'Hear a word, tap it',instr:s.ltapInstr||'Listen. Tap the word you hear.',items:ltap},
      {t:'sort',title:'Sort by sound',mech:'Sorting',hint:'Tap a word, tap its box',instr:'Say the word. Which sound is it?',buckets:groups.map(g=>({k:g.k,s:g.s})),items:sortItems,html:true,hl},
      {t:'odd',title:'Odd one out',mech:'Odd one out',hint:'Which sound is different?',instr:'Listen to all four words.',q:s.oddQ,items:odd,html:true,hl},
      {t:'build',title:'Build the word',mech:'Word builder',hint:'Tap the letter tiles',instr:'Listen. Tap the tiles in the right order.',items:build},
      {t:'ladder',title:'Read the words',mech:'Reading ladder',hint:'Read aloud, tap to check',instr:'Read the word. Tap it to check.',rows,html:true,hl},
      {t:'sents',title:'Listen, then read',mech:'Listen & read',hint:'Audio first, text later',instr:'Tap a line. Listen. Then read it yourself.',sents:s.sents},
      {t:'lava',title:'Floor is lava',mech:'Floor is lava',hint:'Same sound or not?',instr:s.sameQ||'Listen. Is the vowel sound the same?',labels:['Same','Different'],items:same,hl},
      {t:'speed',title:'Speed game',mech:'15 seconds',hint:'Read before the ring ends',instr:'Read the word in 15 seconds!',items:speed,html:true,hl}
    ]};
}

const L=[];
L.push(RL({id:'R1',name:'Letters and first sounds · b d p t',short:'b d p t',hl:['b','d','p','t'],
 groups:[{k:'b',s:'ball',words:['ball','bed','bag','boy','bus','big']},{k:'d',s:'dog',words:['dog','dad','desk','duck','doll','door']},{k:'p',s:'pen',words:['pen','pig','park','pink','pizza','pot']},{k:'t',s:'top',words:['top','tent','tiger','toy','table','ten']}],
 rule:{big:'b d p t',ipa:'/b/ /d/ /p/ /t/',keys:['ball','dog','pen','top'],note:'Careful! <b>b</b> and <b>d</b> look the same. <b>b</b> = a stick and a ball on the right (ball). <b>d</b> = the ball is on the left (dog).'},
 oddQ:'Which word starts with a different sound?',sameQ:'Do they start with the same sound?',ltapInstr:'Listen. Which letter does the word start with?',
 ltap:[['ball','B'],['bed','B'],['bus','B'],['dog','D'],['desk','D'],['doll','D'],['pen','P'],['pig','P'],['park','P'],['tent','T'],['top','T'],['toy','T']].map(x=>({say:x[0],opts:['B','D','P','T'],ans:['B','D','P','T'].indexOf(x[1])})),
 cards:'ball=мяч=I have a ball.;bed=кровать=The bed is big.;bag=сумка=My bag is red.;dog=собака=The dog is big.;desk=парта=The pen is on the desk.;doll=кукла=I have a doll.;pen=ручка=This is my pen.;pig=свинья=A pig is pink.;park=парк=We play in the park.;tent=палатка=We have a tent.;tiger=тигр=A tiger is big.;toy=игрушка=This is my toy.',
 sents:['Dad has a big bag.','The dog is on the bed.','Ben has a red ball.','A pig is in the park.','The pen is on the desk.','Tom has a pink top.','The tiger is big.','Dan has ten toys.','Pat is on the bus.','Bob and Tim play in the park.','Dad has a big tent.','The doll is on the table.'],
 pred:{cap:'A classroom wall poster: the alphabet with a picture for each letter (B – ball, D – dog, P – pen, T – tent). Warm natural light, a child pointing at the poster.',q:'Which letters do you see on the poster?',opts:['b, d, p, t','x, z, q, j','a, e, i, o'],reveal:'Today we practise the sounds b, d, p, t. Be careful: b and d look the same!'},
 teach:'<b>Цель:</b> закрепить звуки и буквы b/d/p/t (b и d — частая путаница). <b>Тайминг:</b> Predict 3 мин · Sound 3 · Listen&tap 5 · Sort 5 · Odd 4 · Build 5 · Ladder 5 · Speed 3.<br>Приём для b/d: «bed» — по буквам рисуем кровать: b — спинка слева, d — справа. Пусть Даша покажет рукой «кулак-палец».<br>Читаем всегда вслух; нажатие на слово = проверка озвучкой. Ошибки не комментируем, а возвращаемся к ним в Speed game.'}));

L.push(RL({id:'R2',name:'Short vowels · a and e',short:'short a, e',hl:['a','e'],
 groups:[{k:'a',s:'/æ/ cat',words:['cat','hat','bag','map','man','cap','jam','hand']},{k:'e',s:'/e/ bed',words:['bed','pen','ten','net','leg','red','egg','yes','hen']}],
 pairs:[['bat','bet'],['man','men'],['pan','pen'],['pat','pet'],['bad','bed']],
 rule:{big:'a · e',ipa:'/æ/ · /e/',keys:['cat','hat','bed','pen'],note:'Short <b>a</b>: рот открыт широко, «э» как в «эхо» (cat). Short <b>e</b>: рот открыт меньше (bed). Слова читаем по буквам: c-a-t, b-e-d.'},
 cards:'cat=кошка=The cat is black.;hat=шляпа=I have a red hat.;bag=сумка=My bag is big.;map=карта=This is a map.;man=мужчина=The man is tall.;jam=джем=I like jam.;bed=кровать=My bed is blue.;pen=ручка=I have a pen.;ten=десять=I am ten.;red=красный=The hat is red.;egg=яйцо=I like eggs.;leg=нога=My leg is long.',
 sents:['A cat sat on a hat.','The man has a red bag.','Ten hens sit on the bed.','Dad has a map.','Sam has a net.','I can see a red hat.','The egg is in the bag.','Jen has a pen.','The cat has ten eggs.','Meg has a pet hen.','The man is sad.','Ben has a big bed.'],
 pred:{cap:'A black cat wearing a red hat sitting on a small bed. Bright children\'s bedroom, soft light.',q:'What can you see in the photo?',opts:['a cat, a hat and a bed','a dog, a bus and a box','a fish, a ship and a shop'],reveal:'Today: short vowels a (cat, hat) and e (bed, pen).'},
 teach:'<b>Цель:</b> различать краткие /æ/ и /e/ (cat – bed). Русскоязычные ученики часто читают оба как «э»: покажите разницу рта (шире — уже).<br>Минимальные пары для устной разминки: man – men, pan – pen, bad – bed.<br><b>Тайминг:</b> 25–30 мин на весь урок; блоки можно разделить на два занятия.'}));

L.push(RL({id:'R3',name:'Short vowels · i, o, u',short:'short i, o, u',hl:['i','o','u'],
 groups:[{k:'i',s:'/ɪ/ pig',words:['pig','big','sit','six','milk','kid','lip']},{k:'o',s:'/ɒ/ dog',words:['dog','box','hot','top','fox','clock','mop']},{k:'u',s:'/ʌ/ bus',words:['bus','cup','sun','run','duck','jump','mum']}],
 rule:{big:'i · o · u',ipa:'/ɪ/ · /ɒ/ · /ʌ/',keys:['pig','dog','bus'],note:'<b>i</b> — короткий «и» (pig, не «пиг-и»). <b>o</b> — открытый короткий «о» (dog). <b>u</b> — как короткий «а» (bus, sun).'},
 cards:'pig=свинья=The pig is big.;milk=молоко=I like milk.;six=шесть=I am six.;dog=собака=The dog is hot.;box=коробка=The box is big.;clock=часы=The clock is on the desk.;fox=лиса=A fox is red.;bus=автобус=The bus is red.;cup=чашка=A cup of milk.;sun=солнце=The sun is hot.;duck=утка=A duck can swim.;jump=прыгать=I can jump.',
 sents:['The pig is big.','Six kids sit on the bus.','The sun is hot.','A fox is in the box.','Mum has a cup of milk.','The dog can run and jump.','A duck is on the log.','Dad has a mop.','I can see a clock.','The bus is not big.','A kid sits on a mat.','The fox can run.'],
 pred:{cap:'Real animals in a farm yard: a pig, a dog, a duck and a fox, with a red bus parked behind them. Bright daylight.',q:'Which animals can you see?',opts:['a pig, a dog, a duck, a fox','a cat, a hen, a bear','a horse, a cow, a goat'],reveal:'Today: short vowels i (pig), o (dog), u (bus).'},
 teach:'<b>Цель:</b> закрепить краткие i, o, u. Типичные ошибки: pig → «пиг-и», u читается как «у» (bus → «бус»). Показывайте, что u в этих словах — как краткое «а».'}));

L.push(RL({id:'R4',name:'Digraphs · sh ch th ng',short:'sh ch th ng',hl:['sh','ch','th','ng'],
 groups:[{k:'sh',s:'/ʃ/ ship',words:['ship','shop','fish','shell','wash','brush']},{k:'ch',s:'/tʃ/ chair',words:['chair','cheese','chicken','lunch','bench','chips']},{k:'th',s:'/θ/ three',words:['three','think','thin','thumb','bath','path']},{k:'ng',s:'/ŋ/ ring',words:['ring','king','song','long','sing','swing']}],
 rule:{big:'sh · ch · th · ng',ipa:'/ʃ/ /tʃ/ /θ/ /ŋ/',keys:['ship','chair','three','ring'],note:'Две буквы — один звук! <b>sh</b> = «ш», <b>ch</b> = «ч», <b>th</b> = язык между зубами, <b>ng</b> = нос («н» без «г»: ring, не «ринг-г»).'},
 cards:'ship=корабль=A ship is on the sea.;shop=магазин=I go to the shop.;fish=рыба=A fish can swim.;brush=щётка=This is my brush.;chair=стул=The chair is red.;cheese=сыр=I like cheese.;chicken=курица=A chicken is on the bench.;lunch=обед=I have lunch at school.;three=три=I am not three.;thumb=большой палец=This is my thumb.;ring=кольцо=I have a ring.;song=песня=I like this song.',
 sents:['I like fish and chips.','A ship is on the sea.','Three kings sing a song.','The chicken is on the bench.','I wash my hands in the bath.','I have cheese for lunch.','Can I go to the shop?','I think this is a long path.','The king has a gold ring.','I wash the shell in the bath.','A thin brush is on the chair.','Sing a long song.'],
 pred:{cap:'A plate with fish and chips on a table next to a toy ship and a small gold ring. Warm kitchen light.',q:'Which two letters make ONE sound in "fish" and "chips"?',opts:['sh and ch','a and e','p and t'],reveal:'Today: two letters, one sound — sh, ch, th, ng.'},
 teach:'<b>Цель:</b> диграфы sh/ch/th/ng. Для th покажите язык между зубами (three, think). Звонкий th (this, that, mother) — в уроке Go Getter 2.<br>ng: без «г» на конце — просите «пропеть» носом.'}));

L.push(RL({id:'R5',name:'Magic e · a_e and i_e',short:'magic e: a, i',hl:[],
 groups:[{k:'a',s:'/æ/ cap',words:['cap','mad','hat','tap','man','can']},{k:'a_e',s:'/eɪ/ cape',magic:true,words:['cape','made','hate','tape','mane','cane','name','game','cake']},{k:'i',s:'/ɪ/ kit',words:['kit','bit','pin','hid','rid','fin']},{k:'i_e',s:'/aɪ/ kite',magic:true,words:['kite','bite','pine','hide','ride','fine','bike','time','like']}],
 pairs:[['cap','cape'],['mad','made'],['hat','hate'],['tap','tape'],['man','mane'],['can','cane'],['kit','kite'],['bit','bite'],['pin','pine'],['hid','hide'],['rid','ride'],['fin','fine']],
 rule:{big:'a_e · i_e',ipa:'/eɪ/ · /aɪ/',keys:['cake','name','game','bike','kite','time'],note:'<b>Магическая e</b> молчит, но «будит» гласную: она говорит своё имя. cap → <b>cape</b> /eɪ/, kit → <b>kite</b> /aɪ/. Это тоже дифтонги: два звука в одном — /eɪ/ «эй», /aɪ/ «ай».'},
 oddQ:'Which word has a different vowel sound?',
 cards:'cake=торт=I like cake.;name=имя=My name is Dasha.;game=игра=This is a game.;cape=плащ=A hero has a cape.;tape=скотч / лента=I have tape.;bike=велосипед=I have a bike.;kite=воздушный змей=The kite is white.;five=пять=I am not five.;nine=девять=I have nine toys.;time=время=It is time to go.;like=нравиться=I like cake.;ride=ехать=I ride a bike.',
 sents:['I like my new bike.','Kate has a cake for me.','What is your name?','The kite is white and fine.','Mike has nine kites.','Let us play a game.','Dave can ride a bike.','The cat hates the bath.','Jane and Mike play a game.','It is time to ride.','Dad made a cake.','I hide the cape.'],
 pred:{cap:'A birthday cake with candles on a table, a child\'s bike and a kite leaning against the wall. Cosy room, warm light.',q:'Which words do you see in the photo?',opts:['cake, bike, kite','cat, hat, bag','pen, ten, hen'],reveal:'Today: magic e. A silent e at the end changes the vowel: cap → cape, kit → kite.'},
 teach:'<b>Цель:</b> правило открытого слога с «магической e» (a_e, i_e) = дифтонги /eɪ/ и /aɪ/. <b>Приём:</b> «магическая e» — рука-волшебная палочка: cap → (взмах) → cape. Пары: cap/cape, hat/hate, kit/kite, pin/pine, rid/ride.<br>Блок Build: плитки показывают a и e раздельно — пусть Даша соберёт a…e.'}));

L.push(RL({id:'R6',name:'Magic e · o_e and u_e',short:'magic e: o, u',hl:[],
 groups:[{k:'o',s:'/ɒ/ hop',words:['hop','not','rod','cop','mop','log']},{k:'o_e',s:'/əʊ/ home',magic:true,words:['hope','note','rode','nose','home','bone','rope','stone','rose']},{k:'u',s:'/ʌ/ cub',words:['cub','tub','cut','bus','sun','run']},{k:'u_e',s:'/juː/ cube',magic:true,words:['cube','tube','cute','huge','June','mule']}],
 pairs:[['hop','hope'],['not','note'],['rod','rode'],['cub','cube'],['tub','tube'],['cut','cute']],
 rule:{big:'o_e · u_e',ipa:'/əʊ/ · /juː/',keys:['home','nose','bone','cube','cute','huge'],note:'Снова магическая e. <b>o_e</b> = /əʊ/ «оу» (home), <b>u_e</b> = /juː/ «ю» (cube). Сравни: hop → hope, cub → cube.'},
 oddQ:'Which word has a different vowel sound?',
 cards:'home=дом=I go home.;nose=нос=This is my nose.;bone=кость=The dog has a bone.;rope=верёвка=A long rope.;stone=камень=A stone is hard.;rose=роза=A red rose.;note=записка=I have a note.;hope=надеяться=I hope so.;cube=кубик=A cube is a toy.;tube=тюбик / труба=A tube of paste.;cute=милый=A cute cat.;huge=огромный=A huge dog.',
 sents:['I hope to go home.','The dog has a bone.','The stone is on the rope.','Dave wrote a note.','A cute cub is in a tube.','The cube is huge.','Jo rode a bike home.','In June I go to the lake.','I can smell a rose with my nose.','The mule is huge.','I hope Dad is home.','A rose is on the stone.'],
 pred:{cap:'A golden retriever puppy with a bone lying on a doorstep near a red rose; a small wooden cube toy beside it. Garden, soft daylight.',q:'Which two words from the photo rhyme with "phone"?',opts:['bone and stone','cube and tube','hop and top'],reveal:'Today: o_e (home, nose) and u_e (cube, cute).'},
 teach:'<b>Цель:</b> o_e /əʊ/ и u_e /juː/. После R5 — повторить цепочку «cap → cape».'}));

L.push(RL({id:'R7',name:'Vowel teams · ai ay and ee ea',short:'ai ay · ee ea',hl:['ai','ay','ee','ea'],
 groups:[{k:'ai / ay',s:'/eɪ/ day',words:['rain','train','tail','snail','paint','play','day','say','way','stay']},{k:'ee / ea',s:'/iː/ tree',words:['tree','bee','see','green','feet','sleep','sea','tea','eat','leaf']}],
 rule:{big:'ai ay · ee ea',ipa:'/eɪ/ · /iː/',keys:['rain','day','tree','sea'],note:'Две гласные «дружат»: первая называет своё имя, вторая молчит. <b>ai, ay</b> = /eɪ/ «эй» (в конце слова — ay). <b>ee, ea</b> = /iː/ долгое «и».'},
 cards:'rain=дождь=It is rain today.;train=поезд=The train is long.;snail=улитка=A snail is slow.;play=играть=I play with my dog.;day=день=It is a nice day.;stay=оставаться=Stay here.;tree=дерево=A green tree.;green=зелёный=The leaf is green.;sleep=спать=I sleep in my bed.;sea=море=The sea is blue.;tea=чай=I like tea.;eat=есть=I eat lunch.',
 sents:['It is a rainy day.','I play with my dog.','The snail is on the tree.','I can see a green tree.','The train is on the way.','We eat and drink tea.','I sleep in my bed.','Let us stay and play.','The bee is on the leaf.','Meg paints a green tail.','The sea is big.','Can you say that, please?'],
 pred:{cap:'A girl in a yellow raincoat standing under a big green tree on a rainy day; a train passes in the background. Soft grey light.',q:'What is the weather like?',opts:['rainy','snowy','sunny'],reveal:'Today: two vowels together — ai/ay (rain, day) and ee/ea (tree, sea).'},
 teach:'<b>Цель:</b> гласные пары ai/ay → /eɪ/ и ee/ea → /iː/. Правило: ay — в конце слова (day, play), ai — в середине (rain, train).<br>Дифтонг /eɪ/ показываем «эй» с движением рта: от «э» к «и».'}));

L.push(RL({id:'R8',name:'oa ow and igh y',short:'oa ow · igh y',hl:['oa','ow','igh','y','ie'],
 groups:[{k:'oa / ow',s:'/əʊ/ boat',words:['boat','coat','road','goat','snow','grow','yellow','window','show','slow']},{k:'igh / y / ie',s:'/aɪ/ light',words:['light','night','right','fly','sky','try','pie','tie','my','cry']}],
 rule:{big:'oa ow · igh y',ipa:'/əʊ/ · /aɪ/',keys:['boat','snow','light','sky'],note:'<b>oa, ow</b> = /əʊ/ «оу» (boat, snow). <b>igh</b>, а также <b>y</b> и <b>ie</b> на конце = /aɪ/ «ай» (light, fly, pie). Буквы gh в light молчат.'},
 cards:'boat=лодка=The boat is slow.;coat=пальто=My coat is yellow.;goat=коза=A goat is on the road.;snow=снег=I like snow.;yellow=жёлтый=The sun is yellow.;window=окно=Open the window.;light=свет=Turn on the light.;night=ночь=It is night.;fly=летать=Birds fly.;sky=небо=The sky is blue.;try=пробовать=Try my pie.;pie=пирог=I like pie.',
 sents:['The goat is on the road.','My coat is yellow.','I see snow at the window.','The boat is slow.','A fly is on the pie.','It is night. Turn on the light.','Try my pie.','I am right!','My kite is in the sky.','Do not cry.','Let us go to the show.','The sky is blue and the snow is white.'],
 pred:{cap:'A small wooden boat on a calm lake at night with a bright full moon and stars in the sky. Dark blue tones.',q:'Which words do you hear in "boat" and "night"?',opts:['/əʊ/ and /aɪ/','/æ/ and /e/','/ʃ/ and /tʃ/'],reveal:'Today: oa/ow = /əʊ/, igh/y = /aɪ/.'},
 teach:'<b>Цель:</b> oa/ow → /əʊ/; igh, y, ie → /aɪ/. Слова «my» и «fly»: y в конце односложного слова читается как «ай».'}));

L.push(RL({id:'R9',name:'Diphthongs · ou ow and oi oy',short:'ou ow · oi oy',hl:['ou','ow','oi','oy'],
 groups:[{k:'ou / ow',s:'/aʊ/ house',words:['house','mouse','cloud','out','round','cow','brown','down','town','clown']},{k:'oi / oy',s:'/ɔɪ/ boy',words:['boy','toy','coin','oil','join','point','noise','enjoy']},{k:'ow',s:'/əʊ/ snow',words:['snow','yellow','window','grow','show','slow']}],
 rule:{big:'ou ow · oi oy',ipa:'/aʊ/ · /ɔɪ/',keys:['house','cow','boy','toy','snow'],note:'<b>ou, ow</b> = /aʊ/ «ау» (house, cow). <b>oi, oy</b> = /ɔɪ/ «ой» (boy, coin). Осторожно: <b>ow</b> читается двумя способами: cow /aʊ/, но snow /əʊ/!'},
 oddQ:'Which word has a different vowel sound?',
 cards:'house=дом=This is my house.;mouse=мышь=A mouse is small.;cloud=облако=A white cloud.;cow=корова=A cow is big.;brown=коричневый=The cow is brown.;town=город=I live in a town.;clown=клоун=A funny clown.;boy=мальчик=The boy is ten.;toy=игрушка=This is my toy.;coin=монета=I have a coin.;noise=шум=Do not make a noise.;enjoy=наслаждаться=I enjoy the show.',
 sents:['The mouse is in the house.','A brown cow is in the town.','The boy has a toy.','A clown is out in the town.','The cloud is round.','I have a coin.','Do not make a noise!','Sit down now.','We enjoy the show.','The window is brown.','The cow is out of the house.','Boys, join the clown!'],
 pred:{cap:'A funny clown with a toy standing next to a brown cow in front of a little house in a small town. Sunny day, cheerful scene.',q:'Which sound is in "house" and "cow"?',opts:['/aʊ/ — "ау"','/ɔɪ/ — "ой"','/iː/ — "и"'],reveal:'Today: diphthongs /aʊ/ (house, cow) and /ɔɪ/ (boy, toy).'},
 teach:'<b>Цель:</b> дифтонги /aʊ/ и /ɔɪ/ + различение ow /aʊ/ и ow /əʊ/ (cow – snow). Это одна из самых частых ошибок.'}));

L.push(RL({id:'R10',name:'oo · long and short',short:'oo',hl:['oo','ew','ue'],
 groups:[{k:'oo',s:'/uː/ moon',words:['moon','spoon','zoo','food','s|ch|*oo|l','room','blue','pool','cool']},{k:'oo',s:'/ʊ/ book',words:['book','look','foot','good','cook','wood','hook','took']}],
 rule:{big:'oo',ipa:'/uː/ · /ʊ/',keys:['moon','zoo','book','foot'],note:'<b>oo</b> бывает долгим /uː/ (moon, zoo, school) и коротким /ʊ/ (book, foot, good). Долгий — как «у-у», короткий — быстрый «у».'},
 oddQ:'Which word has a different oo sound?',
 cards:'moon=луна=The moon is big.;spoon=ложка=I have a spoon.;zoo=зоопарк=We go to the zoo.;food=еда=I like this food.;school=школа=I go to school.;room=комната=My room is big.;blue=синий=The pool is blue.;pool=бассейн=We swim in the pool.;book=книга=I read a book.;look=смотреть=Look at me.;foot=ступня=My foot is big.;good=хороший=It is good.',
 sents:['I go to school.','The moon is blue.','The spoon is in the room.','We see a cool zoo.','I look at a good book.','My foot is in the pool.','Mum can cook good food.','The wood is on the hook.','Look at the moon!','He took a book to school.','I like the blue pool.','It is cool in the room.'],
 pred:{cap:'A child reading a book by the window in a school classroom, with a bright full moon visible outside in the evening. Calm, warm tone.',q:'Which word from the photo has two o\'s?',opts:['book, moon, school','cat, hat, map','tree, bee, sea'],reveal:'Today: oo can be long /uː/ (moon) or short /ʊ/ (book).'},
 teach:'<b>Цель:</b> oo /uː/ vs /ʊ/. Запоминаем слова-образцы: moon, zoo, school, food — долгое; book, look, good, foot — краткое.'}));

L.push(RL({id:'R11',name:'ar and or',short:'ar · or',hl:['ar','or','a'],
 groups:[{k:'ar',s:'/ɑː/ car',words:['car','star','farm','park','arm','dark','shark','card']},{k:'or',s:'/ɔː/ horse',words:['horse','fork','corn','short','sport','storm','north','more']},{k:'a',s:'/æ/ cat',words:['bat','bag','hat','black','map','hand','lamp','back']}],
 rule:{big:'ar · or',ipa:'/ɑː/ · /ɔː/',keys:['car','star','horse','fork'],note:'<b>ar</b> = долгое /ɑː/ «а-а» (car), <b>or</b> = долгое /ɔː/ «о-о» (horse). Не путай с коротким <b>a</b> /æ/ (cat). R в конце не рычим!'},
 oddQ:'Which word has a different vowel sound?',
 cards:'car=машина=The car is red.;star=звезда=I see a star.;farm=ферма=A cow is on the farm.;park=парк=We play in the park.;shark=акула=A shark can swim.;card=открытка=I have a card.;horse=лошадь=A horse is fast.;fork=вилка=A fork and a spoon.;corn=кукуруза=I like corn.;short=короткий=A short pen.;sport=спорт=I like sport.;storm=буря=A big storm.',
 sents:['The car is in the park.','The shark is in the dark.','I see a star in the dark.','The horse is on the farm.','I play sport in the park.','A fork is short.','The storm is in the north.','I have a card in my hand.','My bag is black.','Mark has corn and a fork.','The cat is in the dark.','I can see a car on the farm.'],
 pred:{cap:'A farm at dusk: a brown horse near a red car, with the first star in a dark blue sky. Peaceful rural scene.',q:'What can you see in the photo?',opts:['a horse, a car, a star','a fish, a ship, a shop','a pig, a dog, a duck'],reveal:'Today: ar /ɑː/ (car, star) and or /ɔː/ (horse, fork).'},
 teach:'<b>Цель:</b> ar /ɑː/, or /ɔː/ + контраст с краткой a /æ/ (cat) — это пара из Go Getter (/ɑː/ и /æ/).'}));

L.push(RL({id:'R12',name:'er ir ur',short:'er ir ur',hl:['er','ir','ur'],
 groups:[{k:'ir / ur / er',s:'/ɜː/ bird',words:['bird','girl','shirt','first','turn','burn','nurse','purple','fur','skirt']},{k:'-er',s:'/ə/ teacher',words:['teacher','sister','brother','water','number','finger','letter','mother','father']}],
 rule:{big:'ir ur er',ipa:'/ɜː/ · /ə/',keys:['bird','girl','nurse','teacher','sister'],note:'<b>ir, ur, er</b> под ударением = /ɜː/ (bird, nurse). А <b>-er</b> на конце слова не ударная: /ə/, почти «а» (teacher, sister).'},
 oddQ:'Which word has a different sound?',
 cards:'bird=птица=A bird can fly.;girl=девочка=The girl is ten.;shirt=рубашка=A purple shirt.;first=первый=I am first.;nurse=медсестра=My aunt is a nurse.;purple=фиолетовый=A purple hat.;skirt=юбка=My skirt is blue.;fur=мех=A cat has fur.;teacher=учитель=My teacher is nice.;sister=сестра=My sister is six.;water=вода=A glass of water.;number=число=What is your number?',
 sents:['The girl has a purple shirt.','A bird is in the water.','My sister is a nurse.','My teacher has a nice shirt.','I have ten fingers.','Turn left, please.','My brother has a letter.','Her skirt is purple.','A cat has fur.','My mother and father are at home.','What is your number?','The first bird is purple.'],
 pred:{cap:'A girl in a purple shirt feeding a small bird next to her teacher in a sunny school garden. Natural, warm light.',q:'What colour is the girl\'s shirt?',opts:['purple','green','yellow'],reveal:'Today: er, ir, ur — three spellings, one sound /ɜː/ (bird, girl, nurse).'},
 teach:'<b>Цель:</b> ir/ur/er = /ɜː/ и слабое -er /ə/ на конце (teacher, sister). R не читается (британский вариант).'}));

L.push(RL({id:'R13',name:'Diphthongs · ear and air',short:'ear · air',hl:['ear','air','ere','are'],
 groups:[{k:'ear / ere',s:'/ɪə/ ear',words:['ear','hear','near','year','deer','here','dear','clear']},{k:'air / are',s:'/eə/ chair',words:['chair','hair','pair','air','square','care','share','bear','there']},{k:'ee / ea',s:'/iː/ tree',words:['tree','see','sea','green','eat','tea']}],
 rule:{big:'ear · air',ipa:'/ɪə/ · /eə/',keys:['ear','near','chair','hair','bear'],note:'Это тоже дифтонги: <b>ear, eer, ere</b> = /ɪə/ «иэ» (ear, here). <b>air, are</b> = /eə/ «эа» (chair, care). Обрати внимание: bear — тоже /eə/!'},
 oddQ:'Which word has a different vowel sound?',
 cards:'ear=ухо=My ear is cold.;hear=слышать=I can hear you.;near=близко=The park is near.;year=год=It is a new year.;deer=олень=A deer is in the park.;here=здесь=Come here.;chair=стул=Sit on the chair.;hair=волосы=My hair is long.;pair=пара=A pair of shoes.;square=квадрат=A square is not round.;bear=медведь=A bear is big.;there=там=Look over there.',
 sents:['I hear a deer here.','The bear is near the chair.','My hair is long.','I have a pair of shoes.','A square is not round.','I wear a blue coat there.','Share your chair, please.','My ear is cold.','It is a new year.','The bear is not here.','I can see a pair of deer.','Take care in the air.'],
 pred:{cap:'A brown bear toy sitting on a wooden chair next to a small deer figure, a pair of red shoes on the floor. Studio-style, soft light.',q:'Which two words are in the photo?',opts:['bear and chair','boat and coat','cat and hat'],reveal:'Today: ear/ere = /ɪə/ (ear, here), air/are = /eə/ (chair, bear).'},
 teach:'<b>Цель:</b> центрирующие дифтонги /ɪə/ и /eə/ (ʊə — редкий: sure, tour — пока не берём). Минимальные пары: here – hair, beer – bear, dear – dare.'}));

L.push(RL({id:'R14',name:'Silent letters · kn wr l',short:'silent letters',hl:['kn','wr'],
 groups:[{k:'kn',s:'silent k',words:['know','knee','knife','knock','knit','knot']},{k:'wr / w',s:'silent w',words:['write','wrong','wrist','wrap','two','who']},{k:'l',s:'silent l',words:['walk','talk','half','chalk','calm','could']}],
 rule:{big:'kn · wr · l',ipa:'silent k · w · l',keys:['know','knee','write','wrong','walk','talk'],note:'Некоторые буквы не читаются: <b>k</b> перед n (know, knee), <b>w</b> перед r (write, wrong), <b>l</b> в walk, talk, half. Эти слова надо просто запомнить!'},
 oddQ:'Which word has a different silent letter?',
 cards:'know=знать=I know you.;knee=колено=My knee hurts.;knife=нож=A knife is sharp.;knock=стучать=Knock on the door.;write=писать=I write my name.;wrong=неправильный=This is wrong.;two=два=I have two cats.;who=кто=Who is that?;walk=идти / гулять=I walk to school.;talk=говорить=We talk a lot.;half=половина=Half a cake.;chalk=мел=I write with chalk.',
 sents:['I know the girl.','Knock, knock! Who is there?','Two boys walk and talk.','Write your name on the board.','A knife is not a toy.','This is wrong.','Half a cake is for me.','He has a bad knee.','Do you know what to write?','She can walk and talk.','You can write with chalk.','I could not hear the knock.'],
 pred:{cap:'A boy knocking on a wooden front door while a girl writes on a small blackboard with chalk next to it. Bright, friendly street scene.',q:'Which word begins with a silent letter?',opts:['knock','cat','pig'],reveal:'Today: silent letters. In "knock" we do not say k; in "write" we do not say w.'},
 teach:'<b>Цель:</b> немые буквы kn, wr, l. После этого урока — проверочное чтение (Speed game) по всем 14 урокам.'}));

window.DASHA.paths.push({id:'read',title:'Reading Lab',sub:'Letters, sounds and diphthongs · 14 lessons',units:[{title:'Sounds and spelling',lessons:L}],later:'Каждый урок: фото-прогноз, звук дня, 8 игр. Слова из урока — карточки слева.'});
})();
