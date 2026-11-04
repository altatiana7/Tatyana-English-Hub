/* Dasha's English — interactive textbook: Go Getter 1 · Unit 0 "Get started!"
   Exercises follow the Student's Book (SB pp. 4–9) and the Workbook (WB pp. 4–7) in book order.
   Everything is tap / choose (no typing). Book pictures live in img/book/.
   Each block: grp = book page group, tag = exercise number as in the book.
   In ltap / picq the FIRST option is the correct one (options are shuffled on screen). */
(function(){
const D=window.DASHA;
const find=id=>{let r=null;D.paths.forEach(P=>P.units.forEach(U=>U.lessons.forEach(L=>{if(L.id===id&&P.id==='gg')r=L;})));return r;};
const SB=p=>"Student's Book · page "+p, WB=p=>'Workbook · page '+p, EX='Extra practice';
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const others=(pool,not,n)=>shuf(pool.filter(x=>x!==not)).slice(0,n);
/* choice item: correct first, distractors from a pool */
const C=(q,right,pool,n,x)=>Object.assign({q,opts:[right].concat(others(pool,right,n==null?3:n)),ans:0},x||{});
const sayBtns=(words,cls)=>'<div class="rkeys'+(cls?' '+cls:'')+'">'+words.map(w=>'<button class="say" data-say="'+w.replace(/"/g,'&quot;')+'">'+w+'</button>').join('')+'</div>';

const NUM1=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const COL=['black','blue','brown','green','grey','orange','pink','purple','red','white','yellow'];
const COLHEX={black:'#16181D',blue:'#1E8FD8',brown:'#7A4316',green:'#5FAE2E',grey:'#8A8F96',orange:'#F08A12',pink:'#E8408F',purple:'#8A2A86',red:'#D8212A',white:'#FFFFFF',yellow:'#F6C400'};

/* ===================== 0.1  How do you spell that? ===================== */
const b01=[
 {t:'predict',grp:SB(4),tag:'Start',title:'Predict',mech:'Warm-up',hint:'Look and guess',img:'book/p4-hello',cap:'Four children and two adults introduce themselves.',q:'What do the people say?',opts:['Names, ages and hobbies','Numbers and colours','Classroom words'],reveal:"Today: Hello! I'm … / My name is … Names, ages and hobbies."},
 {t:'picq',grp:SB(4),tag:'Ex 1–2',title:'Read and answer',mech:'Photos',hint:'Look at the photos',instr:'Look at the photos and read.',img:'p4-hello',items:[
   {q:'Who is not from the UK?',opts:['Lucas','Jen','Alex','Lian']},
   {q:"Jen's hobby is …",img:'p4-jen',opts:['making cupcakes','computer games','skateboarding','music']},
   {q:"Alex's hobbies are computers and …",img:'p4-alex',opts:['computer games','Maths','sports','music']},
   {q:'Lian loves all …',img:'p4-lian',opts:['sports','cupcakes','computers','Maths']},
   {q:"Lucas's hobbies are … and Maths.",img:'p4-lucas',opts:['music','skateboarding','cupcakes','computers']}]},
 {t:'speak',grp:SB(5),tag:'Ex 3',title:'Game: stand in a line',mech:'Speaking',hint:'Ask and answer',instr:'Stand in a line. Ask and answer.',prompts:["Hi, I'm Mario. What's your name?","I'm Isabella. What's your name?","My name's David."],patterns:["What's your name?","I'm …","My name's …"],sec:40},
 {t:'rule',grp:SB(5),tag:'Ex 4',title:'The alphabet',mech:'Listen and say',hint:'Tap a letter',html:'<div class="note">Listen and say the alphabet.</div>'+sayBtns('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ').map(l=>l),'abc')},
 {t:'picq',grp:SB(5),tag:'Ex 5',title:'Complete the words',mech:'Missing letter',hint:'Choose the letter',instr:'Complete the words with the letters t h g x l s.',nosay:true,shuffle:false,items:[
   {q:'_ irl',img:'p5-girl',opts:['g','h','s','l'],say:'girl'},{q:'bo _',img:'p5-box',opts:['x','t','g','l'],say:'box'},{q:'_ andwich',img:'p5-sandwich',opts:['s','h','x','t'],say:'sandwich'},
   {q:'_ able',img:'p5-table',opts:['t','s','g','x'],say:'table'},{q:'_ ion',img:'p5-lion',opts:['l','h','t','s'],say:'lion'},{q:'fis _',img:'p5-fish',opts:['h','x','g','l'],say:'fish'}]},
 {t:'ltap',grp:SB(5),tag:'Ex 6',title:'Listen and tick the letters',mech:'Listening',hint:'Hear it, tap the letter',instr:'Listen. Which letter do you hear?',items:[
   ['A','E','I'],['G','J','C'],['W','U','Y'],['B','D','P'],['M','N','F'],['I','J','Y']].flatMap((row,k)=>{const heard=[['A','E'],['G','C'],['W','U'],['B','P'],['M','N'],['I','Y']][k];
     return heard.map(l=>({say:'The letter '+l+'.',q:row.join('   '),opts:[l].concat(row.filter(x=>x!==l)),ans:0}));})},
 {t:'speak',grp:SB(5),tag:'Ex 7',title:'Say the alphabet in pairs',mech:'Speaking',hint:'Stop! Next letter',instr:'Say the alphabet. Stop! Your partner says what comes next.',prompts:['A, B, C, D, …'],patterns:['Stop!','E!','LL = double L'],sec:40},
 {t:'ltap',grp:SB(5),tag:'Ex 8',title:'Listen to the surnames',mech:'Listening',hint:'Hear it, choose the surname',instr:'Listen to the surnames. Which one is it?',nosay:true,items:[
   {say:'N. E. W. M. A. N.',q:'_ E _ M _ N',opts:['NEWMAN','ORTIZ','CAVENDISH','HIGGINS'],ans:0},
   {say:'O. R. T. I. Z.',q:'_ R _ I _',opts:['ORTIZ','NEWMAN','CAVENDISH','HIGGINS'],ans:0},
   {say:'C. A. V. E. N. D. I. S. H.',q:'_ A _ E _ _ _ _ _',opts:['CAVENDISH','HIGGINS','NEWMAN','ORTIZ'],ans:0},
   {say:'H. I. double G. I. N. S.',q:'_ _ G _ _ N _',opts:['HIGGINS','CAVENDISH','ORTIZ','NEWMAN'],ans:0}]},
 {t:'speak',grp:SB(5),tag:'Ex 9',title:"Ask for your partner's surname",mech:'Speaking',hint:'Ask, answer, spell',instr:"Ask for your partner's surname.",prompts:["What's your surname?","Brown.","How do you spell that?","B-R-O-W-N."],patterns:["What's your surname?","How do you spell that?","B-R-O-W-N."],sec:40},
 {t:'speak',grp:SB(5),tag:'Ex 10',title:'Fun Spot: spelling competition',mech:'Speaking',hint:'Say the word and spell it',instr:'Have a class spelling competition.',prompts:['apple','notebook','sandwich','scissors','elephant','orange','pencil','umbrella'],patterns:['Apple. A-double P-L-E. Apple.'],sec:40},
 {t:'picq',grp:WB(4),tag:'WB 1',title:'Label the photos',mech:'Photos',hint:'Who is it?',instr:'Label the photos with the names.',nosay:true,items:[
   {q:'Who is it?',img:'p4-jen',opts:['Jen','Alex','Lian','Lucas']},{q:'Who is it?',img:'p4-alex',opts:['Alex','Jen','Lian','Lucas']},{q:'Who is it?',img:'p4-lian',opts:['Lian','Jen','Alex','Lucas']},{q:'Who is it?',img:'p4-lucas',opts:['Lucas','Jen','Alex','Lian']}]},
 {t:'ltap',grp:WB(4),tag:'WB 2',title:'Complete the sentences',mech:'Gap fill',hint:'Choose the word',instr:'Complete the sentences with the words in the box.',items:[
   C("Hello. My name's Alex. I love ___!",'computers',['computers','cupcakes','Maths','skateboarding','Spain','twelve']),
   C("I'm Jen. I'm ten. I love ___.",'cupcakes',['computers','cupcakes','Maths','skateboarding','Spain','twelve']),
   C("Hi. I'm Lian and I'm ___.",'twelve',['computers','cupcakes','Maths','skateboarding','Spain','twelve']),
   C("My hobby is ___.",'skateboarding',['computers','cupcakes','Maths','skateboarding','Spain','twelve']),
   C("My name's Lucas. I'm from ___.",'Spain',['computers','cupcakes','Maths','skateboarding','Spain','twelve']),
   C("My hobbies are music and ___.",'Maths',['computers','cupcakes','Maths','skateboarding','Spain','twelve'])]},
 {t:'ltap',grp:WB(4),tag:'WB 3',title:'Complete the words',mech:'Missing letter',hint:'Choose the letter',instr:'Complete the words with the letters in the box: c s a h m n.',nosay:true,items:[
   {say:'cupcake',q:'_ upcake',opts:['c','s','a','h'],ans:0},{say:'music',q:'_ usic',opts:['m','n','h','s'],ans:0},{say:'sport',q:'_ port',opts:['s','c','m','a'],ans:0},
   {say:'apple',q:'_ pple',opts:['a','h','c','n'],ans:0},{say:'hobby',q:'_ obby',opts:['h','m','s','a'],ans:0},{say:'name',q:'_ ame',opts:['n','m','c','h'],ans:0}]},
 {t:'build',grp:WB(4),tag:'WB 4',title:'Alphabetical order',mech:'Word builder',hint:'Tap the words in ABC order',instr:'Put the words in alphabetical order.',words:true,items:[{w:'apple cupcake hobby music name sport',q:'A → Z',say:''}]},
 {t:'build',grp:WB(4),tag:'WB 5',title:'Put the words in order',mech:'Word builder',hint:'Make a sentence',instr:'Put the words in the correct order to make sentences.',words:true,items:["What's your name?","How do you spell your surname?","I'm in the UK now.","My hobby is music.","I'm twelve years old."]},
 {t:'speed',grp:EX,tag:'Speed',title:'Speed game',mech:'15 seconds',hint:'Read before the ring ends',instr:'Read it in 15 seconds!',items:['Hello','name','surname','alphabet','hobby','cupcake','computers','skateboarding','music','Maths','Spain','twelve']}
];

/* ===================== 0.2  Numbers and colours ===================== */
const SEQ=(l)=>l;
const b02=[
 {t:'predict',grp:SB(6),tag:'Start',title:'Predict',mech:'Warm-up',hint:'Look and guess',img:'book/p6-dugkit',cap:'A dog in a red T-shirt, his superhero reflection in the mirror and a white cat in a pink dress.',q:'Who are they?',opts:['Dug and Kit','Jen and Alex','Mum and Dad'],reveal:'Meet Dug and Kit! Dug is also Superdug. Kit is his best friend.'},
 {t:'picq',grp:SB(6),tag:'Ex 1',title:'Look at the picture',mech:'Picture',hint:'Listen and read the captions',instr:'Look at the picture. Choose the correct answer.',img:'p6-dugkit',items:[
   {q:'Who is a superhero?',opts:['Dug','Kit']},{q:'Who is very clever?',opts:['Kit','Dug']},{q:"Who is Dug's best friend?",opts:['Kit','Superdug']},{q:'Dug is also …',opts:['Superdug','Kit']}]},
 {t:'rule',grp:SB(6),tag:'Ex 2',title:'Numbers 1–20',mech:'Listen and repeat',hint:'Tap a number',html:sayBtns(NUM1,'nums')},
 {t:'ltap',grp:SB(6),tag:'Ex 3',title:'Complete the numbers',mech:'Missing letters',hint:'Which number is it?',instr:'Complete the numbers.',nosay:false,items:[
   ['o _ e','one'],['_ w _','two'],['t _ r _ _','three'],['_ o _ r','four'],['f _ _ e','five'],['_ i _','six'],['_ e _ e _','seven'],['e i _ _ t','eight'],['_ i n _','nine'],['t _ _','ten'],['_ l e _ _ n','eleven'],['t _ e _ v _','twelve']].map(p=>C(p[0],p[1],NUM1.slice(0,12)))},
 {t:'ltap',grp:SB(6),tag:'Ex 4',title:'Write the answers in words',mech:'Sums',hint:'Choose the answer',instr:'Write the answers in words.',items:[
   ['six + six =','twelve'],['eighteen – three =','fifteen'],['two + eleven =','thirteen'],['twenty – nine =','eleven'],['seventeen – three =','fourteen'],['two + seven =','nine'],['five + two =','seven'],['sixteen – twelve =','four']].map(p=>C(p[0],p[1],NUM1.slice(0,19)))},
 {t:'rule',grp:SB(7),tag:'Ex 5',title:'Numbers 10–100',mech:'Listen and repeat',hint:'Tap a number',html:sayBtns(['ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety','a hundred'],'nums')},
 {t:'ltap',grp:SB(7),tag:'Ex 6',title:'Circle the correct number',mech:'Which number?',hint:'Read and choose',instr:'Circle the correct number.',nosay:true,items:[
   {say:'forty',q:'forty',opts:['40','14'],ans:0},{say:'fifteen',q:'fifteen',opts:['15','50'],ans:0},{say:'thirteen',q:'thirteen',opts:['13','30'],ans:0},{say:'eighty',q:'eighty',opts:['80','18'],ans:0},{say:'twenty',q:'twenty',opts:['20','12'],ans:0},{say:'sixteen',q:'sixteen',opts:['16','60'],ans:0}]},
 {t:'ltap',grp:SB(7),tag:'Ex 7',title:'Listen and write the number',mech:'Listening',hint:'Hear it, tap the number',instr:'Listen and choose the number you hear.',nosay:true,items:[
   ['twenty','20','12','22'],['seven','7','17','70'],['thirteen','13','30','3'],['forty','40','14','4'],['twelve','12','20','2'],['fifty','50','15','5'],['eight','8','18','80'],['nineteen','19','90','9']].map(a=>({say:a[0],opts:a.slice(1),ans:0}))},
 {t:'rule',grp:SB(7),tag:'Ex 8',title:'Colours',mech:'Listen and repeat',hint:'Tap a colour',html:'<div class="rkeys cols">'+COL.map(c=>'<button class="say col" data-say="'+c+'" style="border-color:'+COLHEX[c]+';color:'+(c==='white'?'#333':COLHEX[c])+'">'+c+'</button>').join('')+'</div>'},
 {t:'ltap',grp:SB(7),tag:'Ex 9',title:'Colours of the numbers',mech:'Look and choose',hint:'Which number has this colour?',instr:'Look at the numbers in Exercise 3. Which number is this colour?',nosay:true,
   hdr:'<div class="numrow">'+[['1','pink'],['2','brown'],['3','yellow'],['4','blue'],['5','green'],['6','grey'],['7','orange'],['8','purple'],['9','red'],['10','black'],['11','pink'],['12','white']].map(n=>'<span style="color:'+COLHEX[n[1]]+(n[1]==='white'||n[1]==='grey'?';-webkit-text-stroke:1px #556':'')+'">'+n[0]+'</span>').join('')+'</div>',
   items:[['red','9',['9','4','12']],['green','5',['5','2','10']],['pink','1',['1','6','8']],['pink (the second number)','11',['11','7','3']],['grey','6',['6','3','11']],['white','12',['12','9','1']],['black','10',['10','8','5']],['blue','4',['4','7','11']],['purple','8',['8','10','2']],['brown','2',['2','12','6']],['orange','7',['7','1','5']],['yellow','3',['3','9','11']]].map(a=>({q:a[0],color:COLHEX[a[0].split(' ')[0]],opts:[a[1]].concat(a[2].filter(x=>x!==a[1]).slice(0,3)),ans:0}))},
 {t:'speak',grp:SB(7),tag:'Ex 10',title:'Game: favourite colour',mech:'Speaking',hint:'Guess the colour',instr:'Student A: listen to Student B and guess! Then swap roles.',prompts:["What's your favourite colour?","Not pink, not brown, not white, not yellow, not green, not red, not blue, not grey, not black, not orange.","It's purple!"],patterns:["What's your favourite colour?","It's purple!"],sec:40},
 {t:'picq',grp:SB(7),tag:'Ex 11',title:'Look at the picture and match',mech:'Picture',hint:'Look at the picture, choose the colour',instr:'Look at the picture. Choose the colour.',img:'p7-zoo',items:[
   {q:'The elephants are …',opts:['grey','blue','red','pink']},{q:'The flowers are …',opts:['red','green','orange','black and white']},{q:'The zebras are …',opts:['black and white','grey','blue','pink']},{q:'The sky is …',opts:['blue','green','grey','red']},
   {q:'The oranges are …',opts:['orange','yellow','red','pink']},{q:'The lemons are …',opts:['yellow','orange','green','grey']},{q:'The trees are …',opts:['green','blue','brown','pink']},{q:'The flamingoes are …',opts:['pink','red','orange','black and white']}]},
 {t:'speak',grp:SB(7),tag:'Ex 12',title:'Game: finish the sentences',mech:'Speaking',hint:'Take turns',instr:'Finish the sentences.',prompts:['The elephants are …','The flowers are …','The zebras are …'],patterns:['… green.',"No! They're grey.",'Red!','Yes!'],sec:40},
 {t:'build',grp:WB(5),tag:'WB 1',title:'Put the words in order',mech:'Word builder',hint:'Make a sentence',instr:'Put the words in the correct order to make sentences.',words:true,items:['Dug is also Superdug.','He is a superhero.',"Kit is Dug's best friend.",'She is very clever.']},
 {t:'ltap',grp:WB(5),tag:'WB 2',title:'Write the numbers',mech:'Which number?',hint:'Choose the digits',instr:'Write the numbers.',nosay:true,items:[['five','5','50','15'],['sixteen','16','60','61'],['twelve','12','20','22'],['one','1','11','10'],['ten','10','1','100'],['eight','8','18','80'],['four','4','14','40'],['eleven','11','1','111'],['seventeen','17','70','71'],['six','6','16','60'],['three','3','13','30'],['twenty','20','2','12'],['fourteen','14','4','40'],['eighteen','18','80','8'],['seven','7','17','70'],['nineteen','19','90','9'],['nine','9','19','90'],['thirteen','13','30','3'],['two','2','12','20'],['fifteen','15','50','5']].map(a=>({say:a[0],q:a[0],opts:a.slice(1),ans:0}))},
 {t:'ltap',grp:WB(5),tag:'WB 3',title:'Complete the missing numbers',mech:'Number line',hint:'Which number is missing?',instr:'Complete the missing numbers.',nosay:true,items:[
   ['two · four · ___ · eight','six'],['six · eight · ten · ___ · fourteen','twelve'],['fourteen · ___ · eighteen','sixteen'],['eighteen · ___','twenty'],['one · three · ___ · seven','five'],['seven · ___ · eleven','nine'],['eleven · ___ · fifteen','thirteen'],['fifteen · ___ · nineteen','seventeen']].map(p=>C(p[0],p[1],NUM1))},
 {t:'ltap',grp:WB(5),tag:'WB 4',title:'Write the numbers',mech:'Which number?',hint:'Choose the digits',instr:'Write the numbers.',nosay:true,items:[['fifty-seven','57','75','47'],['twenty-three','23','32','13'],['seventy-one','71','17','70'],['thirteen','13','30','31'],['sixty-eight','68','86','58'],['nineteen','19','90','91'],['thirty','30','13','3'],['eighty-six','86','68','76'],['forty-two','42','24','52'],['a hundred','100','10','1000']].map(a=>({q:a[0],opts:a.slice(1),ans:0}))},
 {t:'ltap',grp:WB(5),tag:'WB 5',title:'Match the colours',mech:'Colours',hint:'What colour is it?',instr:'Match colours 1–11 to the words.',nosay:false,items:['blue','black','yellow','white','pink','purple','green','brown','grey','orange','red'].map(c=>({q:'',color:COLHEX[c],opts:[c].concat(others(COL,c,3)),ans:0}))},
 {t:'ltap',grp:WB(5),tag:'WB 6',title:'Colours of the number words',mech:'Look and choose',hint:'Find the word, choose its colour',instr:'Look at the box and choose the colour.',nosay:true,
   hdr:'<div class="wordbox"><b style="color:#8A8F96">eighteen</b> <b style="color:#7A4316">ninety</b> <b style="color:#1E8FD8">thirty</b> <b style="color:#16181D">sixteen</b> <b style="color:#F08A12">fourteen</b> <b style="color:#F6C400">seventeen</b> <b style="color:#fff;-webkit-text-stroke:1px #556">eighty</b> <b style="color:#E8408F">nineteen</b> <b style="color:#D8212A">thirteen</b> <b style="color:#5FAE2E">fifty</b></div>',
   items:[['14','orange'],['30','blue'],['17','yellow'],['90','brown'],['13','red'],['18','grey'],['19','pink'],['16','black'],['80','white'],['50','green']].map(p=>C(p[0],p[1],COL))},
 {t:'speed',grp:EX,tag:'Speed',title:'Speed game',mech:'15 seconds',hint:'Read before the ring ends',instr:'Read it in 15 seconds!',items:['thirteen','fifteen','seventeen','nineteen','forty','fifty','sixty','seventy','eighty','ninety','a hundred','purple','orange','yellow','brown','grey']}
];

/* ===================== 0.3  In the classroom ===================== */
const OBJ=['coloured pencils','book','pencil case','pencil','pen','scissors','notebook','ruler','rubber','pencil sharpener','sandwich'];
const TS={T:['Close your books.','Listen (to the story).','Look (at the photo).','Open your books.','Read (the text).','Sit down.','Stand up.','Work in pairs.','Write (your name).'],S:['Can you help me?','Can you repeat (that)?',"I'm ready.",'What’s kredka in English?']};
const b03=[
 {t:'predict',grp:SB(8),tag:'Start',title:'Predict',mech:'Warm-up',hint:'Look and guess',img:'book/p8-bag',cap:"Jen's yellow school bag and everything from it on the table.",q:"What's in Jen's bag?",opts:['School things','Toys','Fruit'],reveal:"Today: objects in a schoolbag and in the classroom. A notebook, a ruler, a pencil case, scissors…"},
 {t:'rule',grp:SB(8),tag:'Ex 1',title:'In my bag',mech:'Listen and repeat',hint:'Tap a word',html:sayBtns(['book','coloured pencil','notebook','pen','pencil','pencil case','pencil sharpener','rubber','ruler','sandwich','scissors'],'nums')},
 {t:'picq',grp:SB(8),tag:'Ex 1',title:"Name the objects in Jen's bag",mech:'Picture',hint:'Look at the numbers',instr:"Name the objects in Jen's school bag.",img:'p8-bag',shuffle:false,items:OBJ.map((w,k)=>({q:'What is number '+(k+1)+'?',opts:[w].concat(others(OBJ,w,3))}))},
 {t:'sort',grp:SB(8),tag:'Ex 2',title:'a or an?',mech:'Sorting',hint:'Tap a word, tap its box',instr:'Write a or an before the words.',buckets:[{k:'a'},{k:'an'}],items:[['notebook',0],['apple',1],['pencil',0],['egg',1],['ruler',0],['elephant',1],['book',0],['orange',1],['umbrella',1],['box',0]]},
 {t:'picq',grp:SB(8),tag:'Ex 3',title:"How many in Jen's bag?",mech:'Picture',hint:'Count the objects',instr:"Look at the picture. How many of these objects can you see in Jen's bag?",img:'p8-bag',shuffle:false,nosay:false,items:[
   {q:'How many notebooks?',opts:['Three notebooks.','Two notebooks.','Five notebooks.','One notebook.']},{q:'How many pencil sharpeners?',opts:['Two pencil sharpeners.','Three pencil sharpeners.','One pencil sharpener.','Four pencil sharpeners.']},
   {q:'How many rubbers?',opts:['Three rubbers.','Two rubbers.','One rubber.','Five rubbers.']},{q:'How many sandwiches?',opts:['Two sandwiches.','One sandwich.','Three sandwiches.','Four sandwiches.']},
   {q:'How many coloured pencils?',opts:['Eighteen coloured pencils.','Twelve coloured pencils.','Twenty coloured pencils.','Ten coloured pencils.']},{q:'How many pencil cases?',opts:['One pencil case.','Two pencil cases.','Three pencil cases.','No pencil case.']}]},
 {t:'rule',grp:SB(8),tag:'Ex 4',title:'Classroom objects',mech:'Listen and repeat',hint:'Tap a word',html:sayBtns(['bin','board','chair','clock','desk'],'nums')},
 {t:'speak',grp:SB(8),tag:'Ex 5',title:'Find objects in your classroom',mech:'Speaking',hint:'Point and say',instr:'Find the objects in your classroom and point to them. How many are there?',prompts:['bin','board','chair','clock','desk'],patterns:["It's a …","They're …"],sec:40},
 {t:'picq',grp:SB(9),tag:'Ex 6',title:'Guess the objects',mech:'Picture',hint:'What is it?',instr:'Guess what these objects are.',shuffle:false,items:[
   {q:"It's a …",img:'p9-1',opts:['pencil case','ruler','rubber','sandwich']},{q:"They're …",img:'p9-2',opts:['scissors','rulers','pens','pencils']},{q:"It's a …",img:'p9-3',opts:['bin','clock','chair','board']},
   {q:"It's a …",img:'p9-4',opts:['desk','board','book','chair']},{q:"It's a …",img:'p9-5',opts:['chair','clock','desk','bin']},{q:"They're …",img:'p9-6',opts:['notebooks','pencils','rubbers','scissors']}]},
 {t:'rule',grp:SB(9),tag:'Ex 7',title:'Classroom language',mech:'Listen and repeat',hint:'Tap a phrase',html:sayBtns(['Close your books.','Listen (to the story).','Look (at the photo).','Open your books.','Read (the text).','Sit down.','Stand up.','Work in pairs.','Write (your name).','Can you help me?','Can you repeat (that)?',"I'm ready.",'What’s kredka in English?'],'phr')},
 {t:'sort',grp:SB(9),tag:'Ex 8',title:'Teacher or student?',mech:'Sorting',hint:'Who usually says it?',instr:'Who usually says them: Teacher or Student?',buckets:[{k:'Teacher'},{k:'Student'}],items:TS.T.map(x=>[x,0]).concat(TS.S.map(x=>[x,1]))},
 {t:'match',grp:SB(9),tag:'Ex 9',title:'Match the dialogues',mech:'Matching',hint:'Question and answer',instr:'Match the sentences. Then act out the dialogues in pairs.',pairs:[['Can you repeat that, please?','Yes, Tomas. Giraffe. Giraffe. OK?'],['Can you help me, Miss?','Yes, Maria. How can I help you?'],['How do we say elefante in English?','We say elephant.'],["I'm ready!",'Good. Class, are you ready too?'],['What does amazing mean?','It means really good.']]},
 {t:'speak',grp:SB(9),tag:'Ex 10',title:'Game: be a teacher',mech:'Speaking',hint:'Tell the others what to do',instr:'Be a teacher. Tell other students what to do.',prompts:['Close your books.','Open your books.','Stand up.','Sit down.','Work in pairs.','Write your name, please.'],patterns:['Write your name, please.','Stand up, please!'],sec:40},
 {t:'picq',grp:WB(6),tag:'WB 1',title:'Circle the correct answer',mech:'Picture',hint:'What is it?',instr:'Circle the correct answer.',nosay:false,shuffle:false,items:[
   {q:'What is it?',img:'w6-sharpener',opts:['pencil sharpener','pencil case']},{q:'What is it?',img:'w6-rubber',opts:['rubber','pen']},{q:'What is it?',img:'w6-ruler',opts:['ruler','notebook']},
   {q:'What is it?',img:'w6-scissors',opts:['scissors','pencil']},{q:'What is it?',img:'w6-book',opts:['book','sandwich']},{q:'What is it?',img:'w6-colpencil',opts:['coloured pencil','pencil case']}]},
 {t:'sort',grp:WB(6),tag:'WB 2',title:'a or an?',mech:'Sorting',hint:'Tap a word, tap its box',instr:'Circle the correct word.',buckets:[{k:'a'},{k:'an'}],items:[['apple',1],['pencil',0],['sandwich',0],['notebook',0],['egg',1],['box',0]]},
 {t:'ltap',grp:WB(6),tag:'WB 3',title:'Plural forms',mech:'Gap fill',hint:'Choose the plural',instr:'Complete with the plural form of the words in Exercise 2.',items:[
   {q:'two ___ (apple)',opts:['apples','apple','applez'],ans:0},{q:'three ___ (pencil)',opts:['pencils','pencil','pencies'],ans:0},{q:'five ___ (sandwich)',opts:['sandwiches','sandwichs','sandwich'],ans:0},
   {q:'seven ___ (egg)',opts:['eggs','egg','egges'],ans:0},{q:'four ___ (box)',opts:['boxes','boxs','box'],ans:0},{q:'six ___ (notebook)',opts:['notebooks','notebook','notebookes'],ans:0}]},
 {t:'snake',grp:WB(6),tag:'WB 4',title:'Wordsnake',mech:'Word search',hint:'Tap the first and the last letter',instr:'Find and circle five words in the wordsnake.',text:'bindeskchairboardclock',words:['bin','desk','chair','board','clock']},
 {t:'ltap',grp:WB(6),tag:'WB 5',title:"It's or They're?",mech:'Gap fill',hint:'Choose',instr:"Complete with It's or They're.",items:[
   {q:'___ a bin.',opts:["It's","They're"],ans:0},{q:'___ clocks.',opts:["They're","It's"],ans:0},{q:'___ a board.',opts:["It's","They're"],ans:0},{q:'___ a desk.',opts:["It's","They're"],ans:0},{q:'___ chairs.',opts:["They're","It's"],ans:0},{q:'___ bins.',opts:["They're","It's"],ans:0}]},
 {t:'sort',grp:WB(6),tag:'WB 6',title:'Teacher or student?',mech:'Sorting',hint:'Who usually says it?',instr:'Who usually says them? Teacher or Student?',buckets:[{k:'Teacher'},{k:'Student'}],items:[['Open your books.',0],['Can you help me, please?',1],['Stand up.',0],['Work in pairs.',0],["What's elefante in English?",1],['Write your name.',0]]},
 {t:'build',grp:WB(6),tag:'WB 7',title:'Put the dialogue in order',mech:'Word builder',hint:'Tap the lines in order',instr:'Put the dialogue in the correct order.',sep:'|',items:[{w:'Hello, Mrs Gold. Can you help me, please?|Yes, Tom. How can I help?|What does brilliant mean?|It means very good.|Can you repeat that, please?|Yes. It means very good.',q:'Put the lines in order.',say:'Hello, Mrs Gold. Can you help me, please?'}]},
 {t:'ltap',grp:WB(7),tag:'Check 1',title:'Check yourself: circle the word',mech:'Vocabulary',hint:'Choose',instr:'Circle the correct word.',nosay:true,items:[
   {q:'13',opts:['thirteen','thirty'],ans:0},{q:'60',opts:['sixty','sixteen'],ans:0},{q:'32',opts:['thirty-two','twenty-three'],ans:0},{q:'',color:COLHEX.blue,opts:['blue','green'],ans:0},{q:'',color:COLHEX.yellow,opts:['yellow','red'],ans:0},{q:'',color:COLHEX.black,opts:['black','white'],ans:0}]},
 {t:'picq',grp:WB(7),tag:'Check 2',title:'Check yourself: look at the photos',mech:'Picture',hint:'What is it?',instr:'Look at the photos and choose the words.',nosay:false,shuffle:false,items:[
   {q:'What is it?',img:'w7-scissors',opts:['scissors','ruler','pen','pencil']},{q:'What is it?',img:'w7-pencilcase',opts:['pencil case','notebook','rubber','book']},{q:'What is it?',img:'w7-notebook',opts:['notebook','book','board','desk']},
   {q:'What is it?',img:'w7-chair',opts:['chair','desk','bin','clock']},{q:'What is it?',img:'w7-sandwich',opts:['sandwich','pencil','apple','egg']},{q:'What is it?',img:'w7-clock',opts:['clock','board','bin','desk']}]},
 {t:'ltap',grp:WB(7),tag:'Check 3',title:'Check yourself: grammar',mech:'Grammar',hint:'Choose',instr:'Circle the correct answer.',nosay:true,items:[
   {q:"It's a / an orange.",opts:['an','a'],ans:0},{q:"___ pens.",opts:["They're","It's"],ans:0},{q:"It's a / an ruler.",opts:['a','an'],ans:0},{q:"___ a coloured pencil.",opts:["It's","They're"],ans:0},{q:"It's a / an elephant.",opts:['an','a'],ans:0},{q:"___ eggs.",opts:["They're","It's an"],ans:0}]},
 {t:'picq',grp:WB(7),tag:'Check 4',title:'Check yourself: plurals',mech:'Picture',hint:'Choose the plural',instr:'Complete with the plural form of the words.',nosay:true,shuffle:false,items:[
   {q:'eight ___ (pencil)',img:'w7-pencils',opts:['pencils','pencil','pencies']},{q:'six ___ (orange)',img:'w7-oranges',opts:['oranges','orange','orangies']},{q:'two ___ (box)',img:'w7-boxes',opts:['boxes','boxs','box']},
   {q:'three ___ (bin)',img:'w7-bins',opts:['bins','bin','binies']},{q:'two ___ (umbrella)',img:'w7-umbrellas',opts:['umbrellas','umbrella','umbrellaes']},{q:'four ___ (rubber)',img:'w7-rubbers',opts:['rubbers','rubber','rubberes']}]},
 {t:'ltap',grp:WB(7),tag:'Check 5',title:'Check yourself: communication',mech:'Communication',hint:'Choose the word',instr:'Complete the sentences with the words in the box.',nosay:true,items:[
   C('Can you help me, ___?','please',['books','down','help','pairs','please','up']),C('Sit ___.','down',['books','down','pairs','please','up']),C('Close your ___.','books',['books','down','pairs','please','up']),C('Work in ___.','pairs',['books','down','pairs','please','up']),C('Stand ___.','up',['books','down','pairs','please','up']),C('Can you ___ me, please?','help',['books','down','help','pairs','up'])]},
 {t:'speed',grp:EX,tag:'Speed',title:'Speed game',mech:'15 seconds',hint:'Read before the ring ends',instr:'Read it in 15 seconds!',items:['notebook','ruler','rubber','pencil case','pencil sharpener','scissors','coloured pencils','sandwich','bin','board','chair','clock','desk','stand up','sit down','open your books']}
];

const T={
 '0.1':{blocks:b01,teach:'<b>Student’s Book pp. 4–5 + Workbook p. 4.</b> Задания идут в порядке учебника: сначала Student’s Book (Ex 1–10), потом Workbook (WB 1–5). Всё нажатием. Видео 0.1 и аудиозаписи учебника на сайте не используются: слова и буквы озвучивает естественный голос сайта. Текст Alphabet Rap не воспроизводится — вместо него алфавит кнопками.'},
 '0.2':{blocks:b02,teach:'<b>Student’s Book pp. 6–7 + Workbook p. 5.</b> Числа 1–100 и цвета. Ex 9 и Ex 11 — по картинке из учебника. Ответы взяты из Teacher’s Book.'},
 '0.3':{blocks:b03,teach:'<b>Student’s Book pp. 8–9 + Workbook pp. 6–7.</b> В конце — Check yourself! (WB p. 7). Ответы Ex 3 (сколько предметов в сумке Джен) — из Teacher’s Book.'}
};
Object.keys(T).forEach(id=>{const L=find(id);if(!L)return;L.blocks=T[id].blocks;L.teach=T[id].teach;L.book=true;});
})();
