/* Verbs Box: elementary verbs for Dasha (commands, everyday actions, like / have / can). Plus the teacher's plan. */
(function(){
const {CARDS,LT,TF,MATCH,SORT,HUNT,BUILD,SENTS,SPEED,SPEAK,PREDICT,RULE,say}=window.DASHA.H;

const V1=[
{id:'V1',name:'Commands · stand up, sit down, open…',short:'Commands',
 cards:CARDS('stand up=встать=Stand up, please.;sit down=сесть=Sit down.;open=открывать=Open your book.;close=закрывать=Close your book.;listen=слушать=Listen to me.;look=смотреть=Look at the board.;read=читать=Read the text.;write=писать=Write your name.;draw=рисовать=Draw a cat.;say=говорить=Say it again.;point=показывать=Point to the door.;clap=хлопать=Clap your hands.'),
 blocks:[
  PREDICT('v1','A teacher standing in front of a bright classroom with one hand raised, showing a "stand up" gesture to smiling children.','What does the teacher say?',['Stand up, please.','I\'m a dog.','It\'s a pen.'],'Today: action words — verbs. They tell us what to do: stand up, sit down, open.'),
  RULE('Verb first!',`<table class="rtable"><tr><th>Command</th><th>Listen</th></tr><tr><td>Stand up.</td><td>${say('Stand up, please.')}</td></tr><tr><td>Sit down.</td><td>${say('Sit down, please.')}</td></tr><tr><td>Open your book.</td><td>${say('Open your book.')}</td></tr><tr><td>Close your book.</td><td>${say('Close your book.')}</td></tr></table><div class="note">Команда начинается с <b>глагола</b>: <b>Open</b> your book. Не нужно I или you. Вежливо: добавь <b>please</b>.</div>`),
  LT('Simon says','Listen. Tap the command. Then do it!',[['Stand up.','',['Stand up.','Sit down.','Clap your hands.','Open your book.']],['Sit down.','',['Sit down.','Stand up.','Close your book.','Point to the door.']],['Open your book.','',['Open your book.','Close your book.','Write your name.','Read the text.']],['Close your book.','',['Close your book.','Open your book.','Draw a cat.','Say it again.']],['Listen to me.','',['Listen to me.','Look at the board.','Read the text.','Clap your hands.']],['Look at the board.','',['Look at the board.','Listen to me.','Write your name.','Stand up.']],['Read the text.','',['Read the text.','Write your name.','Say it again.','Draw a cat.']],['Write your name.','',['Write your name.','Read the text.','Draw a cat.','Open your book.']],['Draw a cat.','',['Draw a cat.','Write your name.','Point to the door.','Clap your hands.']],['Say it again.','',['Say it again.','Listen to me.','Look at the board.','Read the text.']],['Point to the door.','',['Point to the door.','Open your book.','Clap your hands.','Stand up.']],['Clap your hands.','',['Clap your hands.','Point to the door.','Sit down.','Draw a cat.']]]),
  MATCH('Verbs and Russian','Match the verb and the Russian word.',[['stand up','встать'],['sit down','сесть'],['open','открывать'],['close','закрывать'],['listen','слушать'],['look','смотреть'],['read','читать'],['write','писать'],['draw','рисовать'],['say','говорить'],['point','показывать'],['clap','хлопать']]),
  SORT('Hands, legs or head?','What do you use? Put the verb in the right box.',['hands','legs','eyes, ears, mouth'],[['write',0],['draw',0],['clap',0],['open',0],['stand up',1],['sit down',1],['jump',1],['walk',1],['look',2],['listen',2],['read',2],['say',2]]),
  HUNT('Error hunter','Tap the wrong word.',['Open ~you book.|your','~Stands up, please.|Stand','Listen ~on me.|to','Look ~on the board.|at','~Writes your name.|Write','Close ~an book.|your','Sit ~up.|down','~I read the text, please.|Read','Point ~at the door.|to','~Opens your book.|Open']),
  BUILD('Spell the verb','Listen. Build the verb.',['sit','read','look','draw','say','clap','open','write','point','close']),
  SPEED('Speed game',['stand up','sit down','open','close','listen','look','read','write','draw','say','point','clap']),
  SPEAK('Simon says','Your teacher says a command — you do it. Then you are Simon!',['Teacher says: Stand up!','Teacher says: Clap your hands!','Now you are Simon: Say a command.','Now you are Simon: Say a new command.'],["Stand up, please.","Sit down.","Clap your hands.","Open your book.","Look at the board.","Simon says …"],40)
 ],
 teach:'<b>Цель:</b> первые глаголы-команды (Student\'s Book 0.3, Classroom language). Метод TPR: Даша делает то, что слышит. <b>Тайминг:</b> Predict 3 · Rule 3 · Simon says 6 · Match 5 · Sort 4 · Hunter 4 · Build 5 · Speaking 5.'},

{id:'V2',name:'Everyday verbs · go, eat, run, sleep…',short:'Everyday verbs',
 cards:CARDS('go=идти, ехать=I go to school.;come=приходить=Come here.;run=бежать=I run in the park.;jump=прыгать=I jump high.;walk=идти пешком=I walk home.;eat=есть=I eat lunch.;drink=пить=I drink milk.;sleep=спать=I sleep in my bed.;wash=мыть=I wash my hands.;swim=плавать=I swim in the pool.;play=играть=I play with my dog.;sing=петь=I sing a song.'),
 blocks:[
  PREDICT('v2','Children doing different things in a sunny park: one runs, one jumps, one eats a sandwich on a bench, one drinks juice.','What are the children doing?',['running, jumping, eating, drinking','sleeping and washing','reading and writing'],'Today: everyday verbs — run, jump, eat, drink, go, sleep…'),
  RULE('I + verb',`<table class="rtable"><tr><th>I</th><th>Listen</th></tr><tr><td>I go to school.</td><td>${say('I go to school.')}</td></tr><tr><td>I eat lunch.</td><td>${say('I eat lunch.')}</td></tr><tr><td>We play football.</td><td>${say('We play football.')}</td></tr><tr><td>They sing a song.</td><td>${say('They sing a song.')}</td></tr></table><div class="note">После <b>I, you, we, they</b> глагол стоит <b>без изменений</b>: I go, we go. Нельзя «I am go»! (am/is/are — это другой глагол.)</div>`),
  LT('Which verb?','Listen. Tap the verb.',[['I eat lunch.','I ___ lunch.',['eat','drink','sleep','wash']],['I drink milk.','I ___ milk.',['drink','eat','run','jump']],['I sleep in my bed.','I ___ in my bed.',['sleep','wash','sing','walk']],['I wash my hands.','I ___ my hands.',['wash','eat','play','swim']],['I run in the park.','I ___ in the park.',['run','sleep','drink','sing']],['I jump high.','I ___ high.',['jump','walk','eat','wash']],['I swim in the pool.','I ___ in the pool.',['swim','run','sleep','eat']],['We play football.','We ___ football.',['play','sing','wash','drink']],['They sing a song.','They ___ a song.',['sing','jump','sleep','eat']],['I go to school.','I ___ to school.',['go','come','drink','sleep']],['Come here, please.','___ here, please.',['Come','Go','Run','Sing']],['I walk home.','I ___ home.',['walk','swim','sleep','sing']]]),
  MATCH('Verbs and Russian','Match the verb and the Russian word.',[['go','идти'],['come','приходить'],['run','бежать'],['jump','прыгать'],['walk','идти пешком'],['eat','есть'],['drink','пить'],['sleep','спать'],['wash','мыть'],['swim','плавать'],['play','играть'],['sing','петь']]),
  SORT('At home or outside?','Where do you do it? Put the verb in the right box.',['at home','outside'],[['sleep',0],['wash',0],['eat',0],['drink',0],['sing',0],['watch TV',0],['run',1],['jump',1],['walk',1],['swim',1],['ride a bike',1],['play football',1]]),
  HUNT('Error hunter','Tap the wrong word.',['I ~am go home.|go','They ~are play football.|play','I ~am sleep in my bed.|sleep','We ~are eat lunch.|eat','I ~am swim in the pool.|swim','I ~goes to school.|go','You ~walks fast.|walk','We ~drinks tea.|drink','They ~sings a song.|sing','I ~jumps high.|jump']),
  BUILD('Spell the verb','Listen. Build the verb.',['g|o','c|o|m|e','r|u|n','j|u|m|p','w|a|l|k','e|a|t','s|l|ee|p','w|a|sh','s|w|i|m','p|l|ay','s|i|ng','d|r|i|n|k']),
  SENTS('Listen, then read','Tap a line. Listen. Then read it.',['I go to school.','I run in the park.','We eat lunch at school.','I drink milk.','I sleep in my bed.','I wash my hands.','We play football.','I walk home.','I jump and I run.','We sing a song.','I swim in the pool.','Come here, please.']),
  TF('Floor is lava','Listen. True or false?',[['We eat with a fork.',true],['We sleep in the bath.',false],['We wash our hands with water.',true],['A fish can swim.',true],['We drink milk.',true],['We run in bed.',false],['We sing a song.',true],['We eat a pencil.',false],['We walk to school.',true],['We play football in the park.',true],['We sleep at the zoo.',false],['We drink a book.',false]],['True','False']),
  SPEED('Speed game',['go','come','run','jump','walk','eat','drink','sleep','wash','swim','play','sing']),
  SPEAK('Mime and say','Your teacher mimes. You say what it is: "You run!"',['Teacher mimes: run.','Teacher mimes: eat.','Teacher mimes: sleep.','Teacher mimes: swim.','Now you mime. Teacher says what it is.'],["I run.","You jump.","We eat.","They sing.","Can you swim?","Yes, I can. / No, I can't."],40)
 ],
 teach:'<b>Цель:</b> базовые глаголы действия; ключевое правило: после I/you/we/they глагол без изменений, без am/is/are («I am go» — частая ошибка). <b>Тайминг:</b> Predict 3 · Rule 4 · Which verb 6 · Match 5 · Sort 4 · Hunter 5 · Build 5 · Sents 5 · Mime 5.'},

{id:'V3',name:'I like · I have · I can',short:'like, have, can',
 cards:CARDS('like=нравиться=I like pizza.;love=любить=I love my dog.;have=иметь=I have a cat.;can=уметь, мочь=I can swim.;can\'t=не уметь=I can\'t fly.;dance=танцевать=I can dance.;draw=рисовать=I can draw a cat.;swim=плавать=I can swim.;fly=летать=Birds can fly.;ride a bike=ездить на велосипеде=I can ride a bike.;play football=играть в футбол=I like football.;cook=готовить=Mum can cook.'),
 blocks:[
  PREDICT('v3','Three children in a school yard: one holds a football, one draws on a notepad, one plays a guitar. Sunny day, natural expressions.','What do you think they say?',['I like football. I can draw. I can play.','I\'m a teacher.','It\'s a big bag.'],'Today: I like…, I have…, I can… Three very useful verbs.'),
  RULE('like · have · can',`<table class="rtable"><tr><th>I …</th><th>Listen</th></tr><tr><td>I like / love + thing</td><td>${say('I like pizza.')}</td></tr><tr><td>I have + thing</td><td>${say('I have a cat.')}</td></tr><tr><td>I can + verb</td><td>${say('I can swim.')}</td></tr><tr><td>I can't + verb</td><td>${say("I can't fly.")}</td></tr></table><div class="note"><b>can</b> не меняется и после него глагол без to: I can <b>swim</b> (не «I can to swim»).</div>`),
  LT('like, have or can?','Listen. Tap the right word.',[['I like pizza.','I ___ pizza.',['like','have','can']],['I can swim.','I ___ swim.',['can','like','have']],['I have a cat.','I ___ a cat.',['have','can','like']],['I love my dog.','I ___ my dog.',['love','can','have']],['We can sing.','We ___ sing.',['can','have','like']],['I have a brother.','I ___ a brother.',['have','can','like']],['They like music.','They ___ music.',['like','can','have']],['I can draw a cat.','I ___ draw a cat.',['can','like','have']],['You have a bike.','You ___ a bike.',['have','can','like']],['We like football.','We ___ football.',['like','have','can']],['I can ride a bike.','I ___ ride a bike.',['can','have','like']],['I have a doll.','I ___ a doll.',['have','can','like']]]),
  MATCH('Verbs and Russian','Match the English and the Russian word.',[['like','нравиться'],['love','любить'],['have','иметь'],['can','уметь'],["can't",'не уметь'],['dance','танцевать'],['draw','рисовать'],['swim','плавать'],['fly','летать'],['ride a bike','ездить на велосипеде'],['play football','играть в футбол'],['cook','готовить']]),
  SORT('like, have or can?','Which word goes before it? Put it in the right box.',['I like …','I have …','I can …'],[['pizza',0],['music',0],['football',0],['cake',0],['a dog',1],['a bike',1],['a brother',1],['a cat',1],['swim',2],['run',2],['dance',2],['draw',2]]),
  HUNT('Error hunter','Tap the wrong word.',['I ~likes pizza.|like','We ~likes music.|like','I ~has a cat.|have','They ~has a car.|have','I ~cans swim.|can','You ~cans run.|can','He can ~swims.|swim','I can ~swimming.|swim','Can you ~swims?|swim','I ~am have a dog.|have']),
  TF('Floor is lava','Listen. True or false?',[['A fish can swim.',true],['A cat can fly.',false],['Birds can fly.',true],['A dog can read.',false],['A fish can run.',false],['A horse can run.',true],['A frog can jump.',true],['An elephant can fly.',false],['A kangaroo can jump.',true],['A penguin can fly.',false],['A bird can sing.',true],['A snail can run fast.',false]],['True','False']),
  BUILD('Spell the verb','Listen. Build the verb.',['l|i|k|e','l|o|v|e','h|a|v|e','c|a|n','s|w|i|m','d|r|aw','d|a|n|c|e','c|oo|k','f|l|y','r|u|n']),
  SENTS('Listen, then read','Tap a line. Listen. Then read it.',['I like pizza.','I love my dog.','I have a cat.','I have a brother.','I can swim.','I can draw a cat.',"I can't fly.",'We like music.','We can sing.','They can dance.','You can run fast.','Can you swim?']),
  SPEED('Speed game',['like','love','have','can',"can't",'dance','draw','swim','fly','cook','run','sing']),
  SPEAK('About me','Say 3 things about you.',['Say 3 things you like.','Say 3 things you have.','Say 3 things you can do.','Say 1 thing you can\'t do.'],["I like …","I love …","I have …","I can …","I can't …"],40)
 ],
 teach:'<b>Цель:</b> три самых частых глагола: like/love, have, can. Связь: Go Getter 1 — Unit 4 (have got), Unit 5 (can). <b>Тайминг:</b> Predict 3 · Rule 4 · Choose 6 · Match 5 · Sort 4 · Hunter 5 · Lava 4 · Build 5 · Sents 5 · About me 5.'}
];

window.DASHA.paths.push({id:'verbs',title:'Verbs Box',sub:'Elementary verbs · 3 lessons',units:[{title:'Action words',lessons:V1}],later:'Подключайте по 10 минут между блоками Go Getter.'});

window.DASHA.plan=`<div class="tt"><b>Формат:</b> 2 занятия в неделю. Каждое занятие: 5 мин Predict и повторение · 20 мин Reading Lab · 25 мин Go Getter · 10 мин Verbs Box / Speed game.<br>
<b>Правила для Даши:</b> текст сначала на слух, потом на глаз; читаем вслух; ничего не печатаем (только нажатия); без Memory; ошибки не разбираем сразу — возвращаемся в Speed game.</div>
<table><tr><th>Неделя</th><th>Занятие A</th><th>Занятие B</th></tr>
<tr><td>1</td><td>R1 b d p t · GG 0.1 (имена, my name is)</td><td>R2 short a, e · GG 1.1 Family · V1 Commands</td></tr>
<tr><td>2</td><td>R3 short i, o, u · GG 1.1 (конец)</td><td>R4 sh ch th ng · GG 1.2 am/is/are</td></tr>
<tr><td>3</td><td>R5 magic e a, i · GG 1.2 my/your/his/her</td><td>R6 magic e o, u · GG 1.2 (конец) · V2</td></tr>
<tr><td>4</td><td>R7 ai ay ee ea · GG 0.2 Numbers</td><td>R8 oa ow igh y · GG 0.2 Colours · V3</td></tr>
<tr><td>5</td><td>R9 ou ow oi oy · GG 0.3 Classroom, a/an</td><td>R10 oo · GG 0.3 (конец) · V2 повтор</td></tr>
<tr><td>6</td><td>R11 ar or · GG 1.3 (скоро)</td><td>R12 er ir ur · GG 1.4 (скоро)</td></tr>
<tr><td>7</td><td>R13 ear air · GG 1.5 (скоро)</td><td>R14 silent letters · GG 1.6 · V3 повтор</td></tr>
<tr><td>8</td><td>Обзор: Speed game по R1–R14 · GG 1.7</td><td>Повторение M2 · мини-тест</td></tr></table>
<div class="tt"><b>Сейчас в школе: Spotlight 3, модуль 2 (Family moments), поэтому семья идёт первой.</b> Весь Spotlight 3 → что берём у нас:</div>
<table><tr><th>Spotlight 3</th><th>Наш хаб</th></tr>
<tr><td>M1 School days! (школа, числа, цвета, команды)</td><td>GG 0.2 · GG 0.3 · V1 Commands · R1–R4</td></tr>
<tr><td>M2 Family moments! (семья, my/his/her)</td><td>GG 1.1 · GG 1.2 · R5–R6</td></tr>
<tr><td>M3 All the things I like! (я люблю, еда, игрушки)</td><td>V3 like · have · can · R7–R8</td></tr>
<tr><td>M4 Come in and play! (игрушки, this/that, мебель)</td><td>GG 0.3 (a/an) · GG Unit 2 (скоро) · R9–R10</td></tr>
<tr><td>M5 Furry friends! (животные, части тела, can)</td><td>V3 can · GG Unit 5, 7 (скоро) · R11–R12</td></tr>
<tr><td>M6 Home, sweet home! (комнаты, there is / are)</td><td>GG Unit 3 (скоро) · R13</td></tr>
<tr><td>M7 A day off! (свободное время, Present Continuous)</td><td>V2 · GG Unit 5 (скоро) · R14</td></tr>
<tr><td>M8 Day by day! (распорядок дня, Present Simple)</td><td>V2 · GG Unit 6 (скоро)</td></tr></table>
<div class="tt">
<b>Фото:</b> для блока Predict положите изображения в папку img/ под именами r1.jpg … r14.jpg, gg-0-1.jpg, gg-0-2.jpg и т. д. (список — в img/IMAGE-PROMPTS.md). Пока нет фото, на экране видна подпись-описание.</div>`;
})();
