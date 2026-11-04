/* Dasha's English — flashcard decks cut from the 10 photo sheets (A–H, R1, R2).
   Each deck = Quizlet-style cards (sidebar) + 9 activities built from the same cards.
   Photos: img/cards/s<SHEET>-<NN>.jpg  (sheet order: left to right, top to bottom). */
(function(){
const D=window.DASHA;
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=(arr,not,n)=>shuf(arr.filter(x=>x!==not)).slice(0,n);

/* card = [word, russian, example, sheet] (sheet only when it differs from the deck sheet) */
const SPEC=[
{id:'A',sheet:'A',title:'Classroom',theme:'school things',
 cards:[['notebook','тетрадь',"It's a notebook."],['ruler','линейка',"It's a ruler."],['rubber','ластик',"It's a rubber."],['pencil case','пенал',"It's a pencil case."],['sharpener','точилка',"It's a sharpener."],['scissors','ножницы',"They're scissors."],['coloured pencils','цветные карандаши',"They're coloured pencils."],['sandwich','бутерброд',"It's a sandwich."],['bin','мусорное ведро',"It's a bin."],['whiteboard','доска',"It's a whiteboard."],['chair','стул',"It's a chair."],['clock','часы',"It's a clock."]],
 predict:{q:'What are these?',opts:['school things','animals','clothes'],reveal:"Today: things in the classroom. A notebook, a ruler, a rubber, scissors…"},
 pats:["What's this?","It's a …","It's a ruler.","They're scissors."]},
{id:'B',sheet:'B',title:'Colours and fruit',theme:'colours',
 cards:[['black','чёрный','A black cat.'],['brown','коричневый','A brown teddy bear.'],['green','зелёный','Green apples.'],['grey','серый','A grey elephant.'],['orange','оранжевый','Orange oranges.'],['pink','розовый','A pink flamingo.'],['purple','фиолетовый','Purple grapes.'],['white','белый','A white swan.'],['yellow','жёлтый','Yellow lemons.'],['desk','парта',"It's a desk."],['parents','родители','My parents are happy.'],['alphabet','алфавит','Say the alphabet.']],
 predict:{q:'What is the same in these photos?',opts:['colours','numbers','sports'],reveal:'Today: colours. Black, brown, green, grey, orange, pink, purple, white, yellow.'},
 pats:['What colour is it?',"It's black.","It's green.",'A pink flamingo.']},
{id:'C',sheet:'C',title:'Weather and seasons',theme:'weather',
 cards:[['windy','ветреный',"It's windy."],['cloudy','облачный',"It's cloudy."],['winter','зима',"It's cold in winter."],['summer','лето',"It's hot in summer."],['autumn','осень','Leaves fall in autumn.'],['spring','весна','Flowers come in spring.'],['morning','утро','Good morning!'],['afternoon','день (после обеда)','Good afternoon!'],['evening','вечер','Good evening!'],['week','неделя','A week has seven days.'],['garden','сад','This is a garden.'],['weather','погода',"What's the weather like?"]],
 predict:{q:'What are these photos about?',opts:['weather, seasons, times of day','animals','food'],reveal:'Today: weather, seasons and times of day. Windy, cloudy, winter, summer, morning, evening.'},
 pats:["What's the weather like?","It's windy.","It's cloudy.",'I like summer.']},
{id:'D',sheet:'D',title:'Where is it?',theme:'places',
 cards:[['under','под','The cat is under the table.'],['behind','за, позади','The cat is behind the sofa.'],['in front of','перед','She is in front of the house.'],['home','дом, дома',"I'm at home."],['house','дом (здание)','This is a house.'],['party','вечеринка',"It's a birthday party."],['holiday','отпуск, каникулы',"We're on holiday."],['photo','фото',"It's a photo."],['album','альбом',"It's a photo album."],['blog','блог','She writes a blog.'],['country','страна','Show a country on the map.'],['fun','веселье',"It's fun!"]],
 predict:{q:'Where is the cat in the first two photos?',opts:['under and behind things','in the garden','in a box'],reveal:'Today: where things are. Under the table. Behind the sofa. In front of the house.'},
 pats:['Where is the cat?',"It's under the table.","It's behind the sofa.",'She is in front of the house.']},
{id:'E',sheet:'E',title:'Meeting people',theme:'people',
 cards:[['This is …','Это …','This is my friend.'],['classmate','одноклассник',"He's my classmate."],['neighbour','сосед',"She's my neighbour."],['Nice to meet you.','Приятно познакомиться.','Nice to meet you, too.'],['How are you?','Как дела?',"I'm fine, thanks."],['Sorry!','Извини!',"Sorry! It's OK."],["Let's go!",'Пойдём!',"Let's go to school!"],['age','возраст','How old are you?'],['hobby','хобби','My hobby is guitar.'],['letter','письмо',"It's a letter."],['teeth','зубы','I brush my teeth.'],['dark hair','тёмные волосы',"She's got dark hair."],
  ['the UK','Великобритания','This is the UK flag.','F'],['Italy','Италия','This is the flag of Italy.','F'],['the USA','США','This is the flag of the USA.','F'],['very well','очень хорошо',"I'm very well, thanks.",'F'],['great','отлично','Great!','F'],['fun','весело',"It's fun!",'F']],
 predict:{q:'What are the people doing?',opts:['meeting and greeting','cooking','swimming'],reveal:"Today: meeting people. This is my friend. Nice to meet you. How are you?"},
 pats:['This is my friend.','Nice to meet you.','How are you?',"I'm fine, thanks."]},
{id:'G',sheet:'G',title:'Classroom commands',theme:'commands',
 cards:[['stand up','встань','Stand up, please.'],['sit down','сядь','Sit down, please.'],['open','открой','Open your book.'],['close','закрой','Close your book.'],['listen','слушай','Listen, please.'],['look','смотри','Look at the board.'],['read','читай','Read the text.'],['write','пиши','Write your name.'],['draw','рисуй','Draw a picture.'],['say','скажи','Say it, please.'],['point','покажи, указывай','Point to the board.'],['clap','хлопай','Clap your hands.']],
 predict:{q:'What are the children doing in class?',opts:['different actions','different games','different foods'],reveal:'Today: classroom commands. Stand up, sit down, open, close, listen, look, read, write.'},
 pats:['Stand up, please.','Sit down, please.','Open your book.','Clap your hands.']},
{id:'H',sheet:'H',title:'Everyday verbs',theme:'verbs',
 cards:[['come','иди сюда, приходи','Come here, please.'],['jump','прыгать','I can jump.'],['drink','пить','I drink water.'],['like','любить, нравиться','I like ice cream.'],['love','любить','I love my dog.'],['have','иметь, у меня есть','I have a cat.'],['dance','танцевать','We dance.'],['fly','летать; запускать','I fly a kite.'],['ride a bike','кататься на велосипеде','I ride a bike.'],['play football','играть в футбол','We play football.'],['cook','готовить','I cook with my dad.'],['can','уметь, мочь','I can do a handstand.']],
 predict:{q:'What are the children doing?',opts:['actions: jump, dance, cook…','sleeping','shopping'],reveal:'Today: everyday verbs. Come, jump, drink, like, love, have, dance, fly, ride, play, cook.'},
 pats:['I can …','I like …','I love …','I have …']},
{id:'PH1',sheet:'R1',title:'Phonics · b d p t',theme:'first words',
 cards:[['ball','мяч',"It's a ball."],['bed','кровать',"It's a bed."],['bag','рюкзак, сумка',"It's a bag."],['dog','собака',"It's a dog."],['desk','парта, стол',"It's a desk."],['doll','кукла',"It's a doll."],['pen','ручка',"It's a pen."],['pig','свинья',"It's a pig."],['park','парк',"It's a park."],['tent','палатка',"It's a tent."],['tiger','тигр',"It's a tiger."],['toy','игрушка',"It's a toy."]],
 predict:{q:'What do the words begin with?',opts:['b, d, p, t','m, n, s','a, e, i'],reveal:'Today: first sounds b, d, p, t. Ball, bed, dog, desk, pen, park, tent, toy.'},
 pats:["What's this?","It's a ball.","It's a dog.","It's a tiger."]},
{id:'PH2',sheet:'R2',title:'Phonics · a and e',theme:'short vowels',
 cards:[['cat','кошка',"It's a cat."],['hat','шляпа',"It's a hat."],['bag','сумка',"It's a bag."],['map','карта',"It's a map."],['man','мужчина',"He's a man."],['jam','варенье',"It's jam."],['bed','кровать',"It's a bed."],['pen','ручка',"It's a pen."],['six','шесть','Six things.'],['red','красный',"It's a red apple."],['egg','яйцо',"It's an egg."],['leg','нога','This is a leg.']],
 predict:{q:'Which vowel sounds do you hear?',opts:['a and e','o and u','only i'],reveal:'Today: short vowels a and e. Cat, hat, bag, map, man, jam — bed, pen, red, egg, leg.'},
 pats:["What's this?","It's a cat.","It's an egg.","It's a red apple."]}
];

function build(S){
  const cards=S.cards.map((c,i)=>{
    const sh=c[3]||S.sheet;const n=c[3]?(S.cards.slice(0,i).filter(x=>x[3]===c[3]).length+1):(i+1);
    return {w:c[0],ru:c[1],ex:c[2],img:'s'+sh+'-'+String(n).padStart(2,'0')};
  });
  const words=cards.map(c=>c.w);
  const P=S.predict;
  const blocks=[
    {t:'predict',title:'Predict',mech:'Warm-up',hint:'Look at the photos and guess',img:'sheets/'+S.sheet,cap:'A sheet of photos: '+S.theme+'.',q:P.q,opts:P.opts,reveal:P.reveal},
    {t:'bingo',title:'Picture bingo',mech:'Bingo',hint:'Hear it, tap the photo',instr:'Listen. Tap the photo. 3 × 3',items:cards.map(c=>({say:c.w,img:c.img}))},
    {t:'reveal',title:'Guess the photo',mech:'Touch and guess',hint:'Open the tiles, choose the word',instr:'Open the tiles. What is it? Choose the word.',items:cards.map(c=>({img:c.img,opts:[c.w].concat(pick(words,c.w,2))}))},
    {t:'pic',title:'Listen and tap',mech:'Picture quiz',hint:'Hear it, tap the picture',instr:'Listen. Tap the picture.',imgOpts:true,items:cards.map(c=>({say:c.w,opts:[c.img].concat(pick(cards.map(x=>x.img),c.img,3)),ans:c.w}))},
    {t:'ltap',title:'Listen and choose',mech:'Listening',hint:'Hear it, tap the word',instr:'Listen. Tap the word.',items:cards.map(c=>({say:c.w,opts:[c.w].concat(pick(words,c.w,3)),ans:0}))},
    {t:'match',title:'Word and meaning',mech:'Matching',hint:'Tap a pair',instr:'Match the English word and the Russian word.',pairs:cards.slice(0,10).map(c=>[c.w,c.ru])},
    {t:'sents',title:'Listen, then read',mech:'Listen & read',hint:'Audio first, text later',instr:'Tap a line. Listen. Then read it.',sents:cards.map(c=>c.ex)},
    {t:'speed',title:'Speed game',mech:'15 seconds',hint:'Read before the ring ends',instr:'Read it in 15 seconds!',items:shuf(words)},
    {t:'speak',title:'Say it',mech:'Speaking',hint:'Photo and phrases',instr:'Look at the photo. Say it. Then say a sentence.',prompts:words.slice(0,8),patterns:S.pats,sec:40,imgs:cards.slice(0,8).map(c=>c.img)}
  ];
  return {id:S.id,name:S.title+' · flashcards',short:S.title,cardsLabel:'Flashcards',cards,blocks,count:cards.length,
    teach:'<b>Колода из листа '+S.sheet+(S.id==='E'?' + F':'')+'</b> ('+cards.length+' карточек). Порядок: Predict → Bingo → Guess the photo → Listen and tap → Listen and choose → Matching → Listen &amp; read → Speed game → Say it.<br>Слева карточка Quizlet: слово на лицевой стороне, перевод и пример на обороте. Всё нажатием, печатать не нужно. Примеры предложений и переводы на карточках — черновые, их можно заменить.'};
}
const lessons=SPEC.map(build);
D.paths.push({id:'cards',title:'Flashcards',sub:'Photo decks',units:[{title:'',lessons}]});
D.decks=lessons;
})();
