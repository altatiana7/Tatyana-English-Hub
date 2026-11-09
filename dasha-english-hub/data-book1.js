/* Dasha's English — interactive textbook: Go Getter 1 · Unit 1 "Family and friends"
   Lessons follow the Teacher's Book stage by stage: Warm-up → Lead-in → Student's Book exercises in book order
   → Workbook → extra games → Finishing the lesson. Everything is tap / choose (no typing).
   Book pictures: img/book/p10…p19 (Student's Book), w8…w15 (Workbook). The first option is always the correct one.
   The long texts (photo story, cartoon, blogs) are read in the book; the old "Listen, then read" blocks stay where they were. */
(function(){
const D=window.DASHA;
const find=id=>{let r=null;D.paths.forEach(P=>P.units.forEach(U=>U.lessons.forEach(L=>{if(L.id===id&&P.id==='gg')r=L;})));return r;};
const WU='Warm-up and Lead-in', SB=p=>"Student's Book · page "+p, WB=p=>'Workbook · page '+p, EX='Extra games', FIN='Finishing the lesson';
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const others=(pool,not,n)=>shuf(pool.filter(x=>x!==not)).slice(0,n);
const C=(q,right,pool,n,x)=>Object.assign({q,opts:[right].concat(others(pool,right,n==null?3:n)),ans:0},x||{});
const say=t=>'<button class="say" data-say="'+String(t).replace(/"/g,'&quot;')+'">'+t+'</button>';
const sayBtns=ws=>'<div class="rkeys">'+ws.map(say).join('')+'</div>';
const ru=(en,r)=>'<tr><td>'+say(en)+'</td><td>'+r+'</td></tr>';
/* blocks made earlier for this lesson (their audio is already recorded): take one by its title */
const old=(id,title,x)=>{const L=find(id);const b=L&&(L._old||L.blocks).find(o=>o.title===title);return b?Object.assign({},b,{grp:EX},x||{}):null;};
['1.1','1.2','1.3','1.4','1.5','1.6','1.7'].forEach(id=>{const L=find(id);if(L)L._old=L.blocks;});

/* ---------- flags (simple drawings, no image files) ---------- */
const FL={
 pl:'<rect width="60" height="20" fill="#fff"/><rect y="20" width="60" height="20" fill="#DC143C"/>',
 it:'<rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/>',
 fr:'<rect width="20" height="40" fill="#0055A4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#EF4135"/>',
 es:'<rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect x="13" y="15" width="8" height="10" rx="2" fill="#AA151B"/>',
 cn:'<rect width="60" height="40" fill="#DE2910"/><path d="M12 5l2.1 6.4h6.7l-5.4 4 2 6.4-5.4-4-5.4 4 2-6.4-5.4-4h6.7z" fill="#FFDE00"/><circle cx="25" cy="5" r="1.6" fill="#FFDE00"/><circle cx="29" cy="10" r="1.6" fill="#FFDE00"/><circle cx="29" cy="16" r="1.6" fill="#FFDE00"/><circle cx="25" cy="21" r="1.6" fill="#FFDE00"/>',
 us:'<rect width="60" height="40" fill="#fff"/>'+[0,2,4,6,8,10,12].map(k=>'<rect y="'+(k*40/13).toFixed(2)+'" width="60" height="'+(40/13).toFixed(2)+'" fill="#B22234"/>').join('')+'<rect width="26" height="21.5" fill="#3C3B6E"/>'+[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>'<circle cx="'+(3+c*5)+'" cy="'+(3+r*5)+'" r="1" fill="#fff"/>').join('')).join(''),
 uk:'<rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="13"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="7"/>'
};
const F=(c,cls)=>'<svg class="flag'+(cls?' '+cls:'')+'" viewBox="0 0 60 40" aria-hidden="true">'+FL[c]+'</svg>';
const NAT=[['uk','the UK','British'],['es','Spain','Spanish'],['pl','Poland','Polish'],['it','Italy','Italian'],['fr','France','French'],['cn','China','Chinese'],['us','the USA','American']];
const NATS=NAT.map(n=>n[2]), CTRS=NAT.map(n=>n[1]);

/* ---------- Mark's family pyramid (SB p. 10): where each person is on the picture, in % ---------- */
const PYR={Mark:[54.2,12.6],Anna:[45.1,21.7],David:[62.4,21.7],Tom:[22,21.9],Lucy:[81,25.5],Peter:[19,40.4],Julia:[37.5,42.7],Rose:[51.2,43.3],Paul:[68.2,43.8],John:[31.9,67.4],Agatha:[63.4,68]};
const pyr=(tag,title,instr,rows,x)=>Object.assign({t:'hotspot',grp:SB(11),tag,title,mech:'Hotspot',hint:'Find the person',instr,img:'book/p10-pyramid',ratio:'1056/1376',spots:PYR,
  items:rows.map(r=>({q:r[0],say:r[0],ans:r[1],exp:r[2]}))},x||{});
const FAM=['mother','mum','father','dad','parents','grandfather','grandad','grandmother','granny','son','daughter','brother','sister','aunt','uncle','cousin'];
const FAMPIC=[['mum','gf1-mum'],['dad','gf1-dad'],['sister','gf1-sister'],['brother','gf1-brother'],['granny','gf1-grandma'],['grandad','gf1-grandpa'],['cousin','gf1-cousin'],['aunt','o-aunt'],['uncle','o-uncle'],['son','o-son'],['daughter','o-daughter'],['friend','gf1-friend']].map(x=>({w:x[0],img:x[1],say:x[0]}));
const self=(q,can)=>({t:'self',grp:FIN,tag:'Finish',title:'I can …',mech:'Check yourself',hint:'How was it?',q,can});

/* ============================== 1.1  Family ============================== */
const b11=[
 {t:'snowman',grp:WU,tag:'Warm-up',title:'Snowman',mech:'Word game',hint:'Guess the word',instr:'Guess the word from Unit 0. Choose a letter.',clue:'A word from Unit 0',n:5,
   words:['pencil','ruler','rubber','notebook','scissors','sandwich','yellow','purple','twelve','twenty','orange','chair']},
 {t:'speak',grp:WU,tag:'Speaking',title:'Family words I know',mech:'Speaking',hint:'Say what you know',instr:'Brainstorm: what family words do you know?',
   prompts:['Who is in your family?',"What's your mum's name?","What's your dad's name?",'Who is your best friend?'],patterns:['My mum is …','My dad is …','My brother is …','My sister is …','My best friend is …'],sec:30,imgs:['col-family','gf1-mum','gf1-dad','gf1-friend']},
 {t:'predict',grp:WU,tag:'Predict',title:'Family and friends',mech:'Prediction',hint:'Look and guess',img:'book/p10-pyramid',cap:"Mark's family pyramid",q:'What is this lesson about?',
   opts:['People in a family','Numbers and colours','Things in my bag'],reveal:'<b>Unit 1 · Family and friends.</b> Today: I can talk about people in a family.'},
 {t:'flipread',grp:SB(10),tag:'Ex 1',title:'I know that!',mech:'Flip cards',hint:'Read, then flip',instr:'Read these words. What do they mean?',
   items:[{w:'brother',ru:'брат'},{w:'dad',ru:'папа'},{w:'grandad',ru:'дедушка'},{w:'granny',ru:'бабушка'},{w:'mum',ru:'мама'},{w:'sister',ru:'сестра'}]},
 {t:'rule',grp:SB(11),tag:'Ex 2',title:'Vocabulary: Family',mech:'Listen and repeat',hint:'Tap a word',
   html:'<div class="note">Listen and repeat. <b>mum = mother</b>, <b>dad = father</b>, <b>granny = grandmother</b>, <b>grandad = grandfather</b>.</div>'+
   sayBtns(['mother','mum','father','dad','parents'])+sayBtns(['grandfather','grandad','grandmother','granny'])+sayBtns(['son','daughter','brother','sister'])+sayBtns(['aunt','uncle','cousin'])},
 pyr('Ex 2',"Find the people in Mark's family",'Find the people in Mark’s family pyramid. Use the colours to help you.',[
   ["Mark's mother",'Rose',"Rose is Mark's mother."],["Mark's father",'Paul',"Paul is Mark's father."],["Mark's sister",'Lucy',"Lucy is Mark's sister."],["Mark's brother",'David',"David is Mark's brother."],
   ["Mark's grandfather",'John',"John is Mark's grandfather."],["Mark's grandmother",'Agatha',"Agatha is Mark's grandmother."],["Mark's aunt",'Julia',"Julia is Mark's aunt."],["Mark's uncle",'Peter',"Peter is Mark's uncle."],
   ["Peter's son",'Tom',"Tom is Peter's son."],["Peter's daughter",'Anna',"Anna is Peter's daughter."]]),
 {t:'sort',grp:SB(11),tag:'Ex 3',title:'He or she?',mech:'Sorting',hint:'Tap a word, tap its box',instr:'Complete the family words. cousin = he or she.',buckets:[{k:'He'},{k:'She'}],
   items:[['father',0],['mother',1],['grandfather',0],['grandmother',1],['son',0],['daughter',1],['brother',0],['sister',1],['uncle',0],['aunt',1]]},
 {t:'match',grp:SB(11),tag:'Ex 4',title:'Match 1–4 to a–d',mech:'Matching',hint:'Tap a pair',instr:'Match the words.',pairs:[['father','dad'],['grandmother','granny'],['mother','mum'],['grandfather','grandad']]},
 {t:'rule',grp:SB(11),tag:'Look!',title:"Look! Mark's father",mech:'Grammar',hint:"'s = чей?",
   html:'<div class="rtwo"><table class="rtable"><tr><th>Look!</th><th></th></tr><tr><td>'+say("Paul = Mark's father")+'</td><td>Пол — папа <b>Марка</b></td></tr><tr><td>'+say("Lucy = Rose's daughter")+'</td><td>Люси — дочь <b>Роуз</b></td></tr></table></div>'+
   '<div class="note"><b class="hl">’s</b> после имени отвечает на вопрос <b>чей?</b> Mark<b class="hl">’s</b> dad = папа Марка. Здесь ’s — это <b>не</b> is.</div>'+sayBtns(["Mark's dad","Mark's sister","Rose's son","Peter's daughter"])},
 pyr('Ex 5','Write the names','Look at the family pyramid and find the people.',[
   ["Mark's grandfather",'John',"John"],["Mark's sister",'Lucy','Lucy'],["Mark's aunt",'Julia','Julia'],["Mark's brother",'David','David'],["Mark's cousins",['Tom','Anna'],'Tom and Anna'],
   ["Mark's grandmother",'Agatha','Agatha'],["Mark's uncle",'Peter','Peter'],["Mark's parents",['Rose','Paul'],'Rose and Paul']],{shuffle:false}),
 {t:'picq',grp:SB(11),tag:'Ex 6',title:'Complete the sentences',mech:'Gap fill',hint:'Choose the name',instr:'Look at the family pyramid again. Complete the sentences.',img:'p10-pyramid',nosay:true,shuffle:false,items:[
   {q:'Peter is ___ uncle.',opts:["Mark's","Julia's","Tom's","Peter's"]},{q:'Julia is ___ sister.',opts:["Paul's","Tom's","Mark's","Rose's"]},{q:'David is ___ son.',opts:["Rose's","Julia's","Tom's","Peter's"]},
   {q:'Anna is ___ daughter.',opts:["Peter's","Paul's","Rose's","Mark's"]},{q:'John and Agatha are ___ parents.',opts:["Julia's","Rose's","Tom's","Mark's"]},{q:'Lucy is ___ cousin.',opts:["Tom's","Paul's","Rose's","Mark's"]}]},
 {t:'lava',grp:SB(11),tag:'Ex 7',title:'Listen: true or false?',mech:'Floor is lava',hint:'Listen and choose',instr:'Listen and choose T (true) or F (false).',img:'book/p10-pyramid',items:[
   {q:'1 · John',say:"John is Julia's son.",ans:false,exp:"He's Julia's father."},{q:'2 · Anna',say:"Anna is Peter's daughter.",ans:true,exp:"Anna is Peter's daughter."},
   {q:'3 · Julia',say:"Julia is Agatha's mother.",ans:false,exp:"Julia is Agatha's daughter."},{q:'4 · Agatha',say:"Agatha is Tom's aunt.",ans:false,exp:"She's his grandmother."},
   {q:'5 · Paul',say:"Paul is John's son.",ans:true,exp:"Paul is John's son."},{q:'6 · Mark',say:"Mark is Anna's cousin.",ans:true,exp:"Mark is Anna's cousin."}]},
 {t:'speak',grp:SB(11),tag:'Ex 8',title:'My family pyramid',mech:'Speaking',hint:'Draw and tell',instr:'Draw your family pyramid. Write the names of the people from your family.',
   prompts:['Draw your family pyramid.','Tell me about your family.'],patterns:['My mum is …','My dad is …','My granny is …','My grandad is …','My sisters are …','My aunt is …'],sec:60,imgs:['col-family','col-family']},
 {t:'mystery',grp:SB(11),tag:'Extra',title:'Who is it?',mech:'Mystery box',hint:'Open a box',instr:"Open a box. Who is it in Mark's family?",n:12,items:[
   {q:'Peter',a:"Mark's uncle"},{q:'Julia',a:"Mark's aunt"},{q:'Rose',a:"Mark's mother"},{q:'Paul',a:"Mark's father"},{q:'John',a:"Mark's grandfather"},{q:'Agatha',a:"Mark's grandmother"},
   {q:'Lucy',a:"Mark's sister"},{q:'David',a:"Mark's brother"},{q:'Tom',a:"Mark's cousin"},{q:'Anna',a:"Mark's cousin"},{q:'Rose and Paul',a:"Mark's parents"},{q:'Tom and Anna',a:"Mark's cousins"}]},
 {t:'picq',grp:WB(8),tag:'WB 1',title:"Who is who in Sally's family?",mech:'Photo',hint:'Choose the letter',instr:"Who is who in Sally's family? Match a–g to 1–7.",img:'w8-sally',nosay:true,shuffle:false,items:[
   {q:"Sally's father",opts:['e','c','g','a']},{q:"Sally's mother",opts:['d','b','a','e']},{q:"Sally's parents",opts:['f','g','c','a']},{q:"Sally's grandfather",opts:['g','e','c','b']},
   {q:"Sally's grandmother",opts:['b','d','a','g']},{q:"Sally's brother",opts:['c','e','g','a']},{q:"Sally's sister",opts:['a','b','d','c']}]},
 {t:'match',grp:WB(8),tag:'WB 2',title:'Make family words',mech:'Matching',hint:'Tap two parts',instr:'Match the word fragments to make family words.',lspeak:false,
   pairs:[['daught','er'],['cous','in'],['unc','le'],['grand','ad'],['au','nt'],['gran','ny'],['s','on']]},
 {t:'picq',grp:WB(8),tag:'WB 3',title:"Mark's family tree",mech:'Gap fill',hint:'One word',instr:"Look at Mark's family tree. Complete the sentences with one word.",img:'w8-tree',nosay:true,shuffle:false,items:[
   {q:'Alan: Nick is my ___.',opts:['father','brother','son','uncle']},{q:"Alan: He's Mark's ___ too.",opts:['grandfather','father','uncle','cousin']},{q:'Holly: Ruth is my ___.',opts:['aunt','mother','sister','granny']},
   {q:"Holly: Steven and I are Mark's ___.",opts:['cousins','parents','sisters','brothers']},{q:"Holly: I am Helen and Rob's ___.",opts:['daughter','son','sister','aunt']},
   {q:'Steven: Holly is my ___.',opts:['sister','cousin','mother','daughter']},{q:"Steven: I'm Helen's ___.",opts:['son','brother','father','uncle']}]},
 {t:'ltap',grp:WB(8),tag:'WB 4',title:'Read and complete',mech:'Gap fill',hint:'Choose the word',instr:'Read and complete.',nosay:true,items:[
   C("Amy is Emily's mother. Emily is Amy's ___.",'daughter',FAM),C("Tom is Danny's father. Danny is Tom's ___.",'son',FAM),C("Sara is Ben's mother and Ted's aunt. Ben and Ted are ___.",'cousins',['cousins','brothers','parents','uncles']),
   C("Ada is Sam's mother. Sam is Rosa's father. Ada is Rosa's ___.",'grandmother',FAM),C("John is David's brother. David is Tina's father. John is Tina's ___.",'uncle',FAM)]},
 {t:'missing',grp:EX,tag:'Game',title:"What's missing?",mech:"What's missing?",hint:'Look and remember',instr:'Look at the photos. Which one is missing?',rounds:6,items:FAMPIC},
 {t:'bingo',grp:EX,tag:'Game',title:'Family bingo',mech:'Audio bingo',hint:'Listen and tap',instr:'Listen and find the photo.',items:FAMPIC},
 {t:'race',grp:EX,tag:'Game',title:'Family race',mech:'Race track',hint:'Answer and go',instr:'Who is it? Choose and move your car.',nosay:true,n:10,items:[
   C("your mum's mum",'granny',FAM),C("your mum's sister",'aunt',FAM),C("your dad's brother",'uncle',FAM),C("your dad's dad",'grandad',FAM),C("your aunt's son",'cousin',FAM),
   C('your mum and dad','parents',FAM),C("your parents' son",'brother',FAM),C("your parents' daughter",'sister',FAM),C("your granny's son",'dad',['dad','cousin','grandad','brother']),C("your grandad's daughter",'mum',['mum','cousin','granny','sister']),
   C('father =','dad',['dad','mum','son','uncle']),C('grandmother =','granny',['granny','grandad','aunt','mum'])]},
 old('1.1','Spell the word',{tag:'Game'}),
 old('1.1','Speed game',{tag:'Game'}),
 self('Can you talk about people in a family?',['I can say family words.',"I can say: Paul is Mark's father."])
];

/* ============================== 1.2  It's Granny's birthday! ============================== */
const BE=['am','is','are'], POS=['my','your','his','her'];
const b12=[
 {t:'bingo',grp:WU,tag:'Warm-up',title:'Family bingo',mech:'Audio bingo',hint:'Listen and tap',instr:'Listen to the family word. Find the photo.',items:FAMPIC},
 {t:'rule',grp:WU,tag:'Speaking',title:"What's the verb?",mech:'Lead-in',hint:'Listen and say',
   html:'<div class="note">Say the sentences. What is the verb?</div><table class="rtable"><tr><td>'+say('I am your teacher.')+'</td><td>I <b class="hl">am</b> …</td></tr><tr><td>'+say('You are my student.')+'</td><td>You <b class="hl">are</b> …</td></tr><tr><td>'+say('She is ten.')+'</td><td>She <b class="hl">is</b> …</td></tr></table>'+
   '<div class="note"><b>am / is / are</b> = глагол <b>to be</b> (быть). В русском мы его не говорим: «Я — учитель». В английском он нужен всегда.</div>'},
 {t:'reveal',grp:WU,tag:'Predict',title:'Guess the photo',mech:'Picture reveal',hint:'Open the tiles',instr:'Open the tiles. What can you see?',items:[
   {img:'book/p12-1',opts:["It's Granny's birthday.","It's a school lesson.","It's a football game."]},{img:'book/p12-3',opts:['A present for Granny','A bag for school','A red book']},{img:'book/p12-4',opts:['A cake in a box','A cat in a box','Pencils in a box']}]},
 {t:'rule',grp:SB(12),tag:'Lead-in',title:'New words',mech:'Listen and say',hint:'Tap a word',
   html:'<table class="rtable">'+ru('birthday','день рождения')+ru('cake','торт')+ru('present','подарок')+ru('card','открытка')+ru('Spain','Испания')+ru('school trip','школьная поездка')+'</table>'},
 {t:'picq',grp:SB(12),tag:'Ex 1',title:'Read and answer',mech:'Photo story',hint:'Look at the photos',instr:'Read the story on page 12. Answer the questions.',img:'p12-all',nosay:true,shuffle:false,items:[
   {q:"How old is Jen and Alex's granny today?",img:'p12-1',opts:['seventy','seven','seventeen']},{q:'Who is Jason?',img:'p12-3',opts:["Alex's cousin","Granny's son","Alex's brother"]}]},
 {t:'picq',grp:SB(12),tag:'Ex 1',title:'Who says it?',mech:'Who said it?',hint:'Listen and choose',instr:'Listen. Who says it?',img:'p12-all',nosay:true,items:[
   {say:'Hold this, please!',q:'Hold this, please!',img:'p12-2',opts:['Megan','Alex','Granny']},{say:"I've got it!",q:"I've got it!",img:'p12-2',opts:['Alex','Megan','Dad']},
   {say:"I'm so happy you're here.",q:'I’m so happy you’re here.',img:'p12-1',opts:['Granny','Jen','Mum']},{say:'Happy birthday, Mum!',q:'Happy birthday, Mum!',img:'p12-3',opts:['Megan','Granny','Dad']},
   {say:'Hello, sister!',q:'Hello, sister!',img:'p12-3',opts:['Dad','Megan','Alex']},{say:"We're ready for the cake!",q:'We’re ready for the cake!',img:'p12-4',opts:['Dad','Mum','Granny']}]},
 {t:'lava',grp:SB(12),tag:'Ex 2',title:'True or false?',mech:'Floor is lava',hint:'True or false?',instr:'Read the sentences. Choose T (true) or F (false). Correct the false sentences.',items:[
   {q:"Granny's name is Sophie.",ans:true},{q:"They are at Jen and Alex's house.",ans:false,exp:"They are at Granny's house."},{q:"There's a present for Granny in the box.",ans:false,exp:"There's a birthday cake in the box."},
   {q:'Jason is at home.',ans:false,exp:"He's in Spain."},{q:"Dad is Aunt Megan's brother.",ans:true}]},
 {t:'rule',grp:SB(12),tag:'Ex 3',title:'Say it!',mech:'Listen and repeat',hint:'Tap and repeat',
   html:'<div class="note">Listen and repeat. Find these expressions in the story.</div><table class="rtable">'+ru('Hold this, please!','Подержи это, пожалуйста!')+ru('Be careful!','Осторожно!')+ru("I've got it!",'Держу!')+'</table>'},
 {t:'predict',grp:SB(12),tag:'Ex 4–5',title:'Guess!',mech:'Prediction',hint:'Choose a, b or c',img:'book/p12-4',cap:'Mum and Dad with the box',q:"Jen and Alex's mum says ‘Oh, no!’ Why?",
   opts:['The cake is a mess.',"It's not Granny's cake.","There's a mouse in the box."],reveal:"<b>b</b> · It's not Granny's cake. It's the wrong cake: it's a baby's cake! <i>mess</i> = беспорядок, <i>mouse</i> = мышь."},
 {t:'rule',grp:SB(13),tag:'Grammar',title:'Get Grammar! to be',mech:'Grammar',hint:'Long and short forms',
   html:'<div class="rtwo"><table class="rtable"><tr><th>Long form</th><th>Short form</th></tr>'+[['I am ten.',"I'm ten."],['You are ten.',"You're ten."],['He is ten.',"He's ten."],['She is ten.',"She's ten."],['It is ten.',"It's ten."],['We are ten.',"We're ten."],['They are ten.',"They're ten."]].map(r=>'<tr><td>'+say(r[0])+'</td><td>'+say(r[1])+'</td></tr>').join('')+'</table>'+
   '<div class="note" style="max-width:340px"><b>I</b> → am<br><b>he, she, it</b> → is<br><b>you, we, they</b> → are<br><br>Короткая форма: буква пропадает, вместо неё <b class="hl">’</b><br>I a̶m = I<b class="hl">’m</b> · is = <b class="hl">’s</b> · are = <b class="hl">’re</b></div></div>'},
 {t:'ltap',grp:SB(13),tag:'Ex 6',title:'Find the missing word',mech:'Gap fill',hint:'Choose',instr:'Find the sentences in the story. Choose the missing word.',nosay:true,shuffle:false,items:[
   {q:'They ___ at her house.',opts:['are','is','am'],ans:0},{q:'‘I ___ so happy!’',opts:['’m','’s','’re'],ans:0},{q:'‘You ___ here!’',opts:['’re','’s','’m'],ans:0},
   {q:'‘It ___ Granny’s birthday cake.’',opts:['’s','’re','’m'],ans:0},{q:'‘Jason ___ in Spain.’',opts:['is','are','am'],ans:0},{q:'‘We ___ ready for the cake!’',opts:['’re','’s','’m'],ans:0}]},
 {t:'ltap',grp:SB(13),tag:'Ex 7',title:'Circle the correct answer',mech:'Choose',hint:'Choose',instr:'Choose the correct answer.',nosay:true,items:[
   {q:'You ___ ready.',opts:['are','is'],ans:0},{q:'I ___ here.',opts:['am','is'],ans:0},{q:'We ___ happy!',opts:['are','am'],ans:0},
   {q:"Jason ___ Jen's cousin.",opts:['is','am'],ans:0},{q:'It ___ a present for you.',opts:['is','are'],ans:0},{q:"Jen and Alex ___ at their Granny's house.",opts:['are','is'],ans:0}]},
 {t:'match',grp:SB(13),tag:'Ex 8',title:'Short forms',mech:'Matching',hint:'Long = short',instr:'Rewrite the sentences using short forms of the verb to be.',
   pairs:[['You are ready.',"You're ready."],['I am here.',"I'm here."],['We are happy!',"We're happy!"],['It is a present for you.',"It's a present for you."]]},
 {t:'rule',grp:SB(13),tag:'Look!',title:'Look! my, your, his, her',mech:'Grammar',hint:'Whose?',
   html:'<table class="rtable"><tr><th></th><th>чей?</th><th></th></tr>'+[['I','my',"It's my birthday. I'm ten!",'мой'],['you','your',"It's your birthday. You're eleven!",'твой'],['he','his',"It's his birthday. He's twelve.",'его'],['she','her',"It's her birthday. She's nine.",'её']].map(r=>'<tr><td><b>'+r[0]+'</b> → <b class="hl">'+r[1]+'</b></td><td>'+r[3]+'</td><td>'+say(r[2])+'</td></tr>').join('')+'</table>'+
   '<div class="note">Не путай: <b>your</b> = твой, а <b>you’re</b> = you are. <b>his</b> — про мальчика, <b>her</b> — про девочку.</div>'},
 {t:'ltap',grp:SB(13),tag:'Ex 9',title:'my, your, his or her?',mech:'Gap fill',hint:'Choose',instr:'Complete with my, your, his or her.',nosay:true,shuffle:false,items:[
   C("Alex: ‘Granny, here's ___ birthday card!’",'your',POS),C("Dad: ‘It's my mother's birthday. We are at ___ house.’",'her',POS),C("Sophie: ‘I'm very happy! ___ family is here!’",'My',['My','Your','His','Her']),
   C('Megan: ‘Jason is in Spain with ___ class.’','his',POS),C('Alex: ‘___ birthday cake is in this box, Granny.’','Your',['My','Your','His','Her'])]},
 {t:'ltap',grp:SB(13),tag:'Ex 10',title:'How old are they?',mech:'Listening',hint:'Listen and choose',instr:'How old are they? Listen and complete the sentences.',nosay:true,shuffle:false,items:[
   {say:"Lucas is Jen's new friend. He's eleven years old.",q:'Lucas: ‘I ___.’',opts:['’m eleven','’m ten','’m twelve','’m sixteen'],ans:0},
   {say:"Alex is in Lian's class. They are classmates. They're twelve.",q:'Lian: ‘Alex and I ___.’',opts:['are twelve','are ten','are eleven','are sixteen'],ans:0},
   {say:"Lucas's brother is in Spain now. He's sixteen years old.",q:'Lucas: ‘My brother ___.’',opts:['is sixteen','is ten','is eleven','is twelve'],ans:0},
   {say:"Jen is ten years old. She's Alex's sister!",q:'Lian to Jen: ‘You ___, right?’',opts:['are ten','are twelve','are eleven','are sixteen'],ans:0}]},
 {t:'cloze',grp:SB(13),tag:'Ex 11',title:'am, are or is?',mech:'Gap text',hint:'Tap the word',instr:'Read and complete with am, are or is.',img:'book/p13-lian',bank:BE,
   text:'My name [is] Lian and I [am] twelve years old. Alex and I [are] best friends and classmates. His sister, Jen, [is] ten years old. We [are] friends too.'},
 {t:'speak',grp:SB(13),tag:'Ex 12',title:'About me and my friends',mech:'Speaking',hint:'Say it about you',instr:'Look at Exercise 11. Tell about you and your friends.',
   prompts:["My name's … and I …",'… and I are best friends.','… is … years old.'],patterns:["My name's …","I'm … years old.",'… and I are best friends.',"She's … years old.","He's … years old."],sec:40},
 {t:'wheel',grp:SB(13),tag:'Ex 13',title:'Fun Spot: birthday wheel',mech:'Wheel',hint:'Spin and say',instr:'Read the poem on page 13. Then spin and change it for a friend.',
   items:['Ola · 11','Tom · 10','Anna · 12','Mark · 9','Lucy · 8','Jen · 10','Alex · 12','Lian · 12'],patterns:["Ola's eleven today.","Tom's ten today.",'Hip, hip, hooray!']},
 {t:'picq',grp:WB(9),tag:'WB 1',title:'Circle the correct word',mech:'Pictures',hint:'am, are or is',instr:'Look at the pictures. Choose the correct word.',img:'w9-party',nosay:true,shuffle:false,items:[
   {q:'Look. We ___ at a party.',opts:['are','am','is']},{q:'Tom ___ ten today.',opts:['is','am','are']},{q:'I ___ happy!',opts:['am','are','is']},
   {q:'He ___ a teacher.',img:'w9-student',opts:['is','am','are']},{q:'She ___ a student.',img:'w9-student',opts:['is','am','are']},{q:'They ___ at school.',img:'w9-student',opts:['are','am','is']},{q:'You ___ in this class.',img:'w9-student',opts:['are','am','is']}]},
 {t:'ltap',grp:WB(9),tag:'WB 2',title:'Short forms',mech:'Gap fill',hint:"'m, 's or 're",instr:'Complete the sentences using short forms of the verb to be.',nosay:true,shuffle:false,items:[
   {q:'Look. We___ at a party.',opts:['’re','’s','’m'],ans:0},{q:'Tom___ ten today.',opts:['’s','’re','’m'],ans:0},{q:'I___ happy!',opts:['’m','’s','’re'],ans:0},{q:'He___ a teacher.',opts:['’s','’m','’re'],ans:0},
   {q:'She___ a student.',opts:['’s','’re','’m'],ans:0},{q:'They___ at school.',opts:['’re','’s','’m'],ans:0},{q:'You___ in this class.',opts:['’re','’m','’s'],ans:0}]},
 {t:'cloze',grp:WB(9),tag:'WB 3',title:'Complete the dialogue',mech:'Gap text',hint:'am, are or is',instr:'Complete the dialogue with am, are or is.',bank:BE,
   text:'Harry: Hi. I [am] Harry.\nJack: Hi, Harry. I [am] Jack. You [are] in Class 2 with me. Welcome!\nHarry: Thanks.\nJack: This is Tony. He [is] my classmate. We [are] best friends too. Mrs Lee and Mr Brown [are] my favourite teachers.'},
 {t:'cloze',grp:WB(9),tag:'WB 4',title:'my, your, his or her?',mech:'Gap text',hint:'Tap the word',instr:'Complete with my, your, his or her.',img:'book/p12-3',bank:['my','your','His','Her'],
   text:'Jen: This is [my] brother. [His] name is Alex. The present is for granny. [Her] name is Sophie.\nAlex: This is [your] present, granny.'},
 {t:'cloze',grp:WB(9),tag:'WB 5',title:'Complete the text',mech:'Gap text',hint:'Words in the box',instr:'Complete the text with the words in the box.',bank:['am','are','Her','is','my','They'],
   text:'Hi! I [am] Tom. This is [my] family. My parents’ names [are] Amy and Andrew. [They] are teachers. My sister [is] thirteen. [Her] name is Katie.'},
 old('1.2','Error hunter',{tag:'Game',title:'Grammar Doctor'}),
 {t:'race',grp:EX,tag:'Game',title:'am, is, are race',mech:'Race track',hint:'Answer and go',instr:'Choose am, is or are and move your car.',nosay:true,n:10,items:[
   ['I ___ ten.','am'],['She ___ my sister.','is'],['We ___ friends.','are'],['You ___ ready.','are'],['He ___ my dad.','is'],['It ___ a cake.','is'],['They ___ at home.','are'],['I ___ happy.','am'],
   ['Jen and Alex ___ at school.','are'],['My mum ___ here.','is'],['My parents ___ teachers.','are'],['Jason ___ in Spain.','is']].map(r=>({q:r[0],opts:[r[1]].concat(BE.filter(x=>x!==r[1]))}))},
 old('1.2','Short forms',{tag:'Game',title:'Short forms: match'}),
 old('1.2','Speed game',{tag:'Game'}),
 self('Can you use the verb to be?',["I can say: I'm ten. She's my sister. We're friends.",'I can use my, your, his, her.'])
];

/* ============================== 1.3  Dug's family album ============================== */
const b13=[
 {t:'ltap',grp:WU,tag:'Warm-up',title:'am, are or is?',mech:'Quick check',hint:'Choose',instr:'Complete the sentences with am, are or is.',nosay:true,items:[
   ['The bag ___ blue.','is'],['Alex ___ twelve.','is'],['I ___ in my classroom.','am'],['You ___ the teacher.','are'],['We ___ cool.','are'],['Dug and Kit ___ best friends.','are']].map(r=>({q:r[0],opts:[r[1]].concat(BE.filter(x=>x!==r[1])),ans:0}))},
 {t:'speak',grp:WU,tag:'Speaking',title:'About me',mech:'Speaking',hint:'Short forms',instr:'Say it about you. Use short forms.',
   prompts:['How old are you?','Who is your best friend?','How old is your best friend?'],patterns:["I'm … years old.",'My best friend is …',"She's …","He's …","We're classmates."],sec:30},
 {t:'reveal',grp:WU,tag:'Predict',title:'Guess the picture',mech:'Picture reveal',hint:'Open the tiles',instr:'Open the tiles. What can you see?',items:[
   {img:'book/p14-1',opts:['Dug and Kit with a family album','Dug and Kit at school','Dug and Kit in the park']},{img:'book/p14-3',opts:["Dug's mum and dad","Dug's cousins","Kit's parents"]},{img:'book/p14-2',opts:['An uncle and an aunt','Two classmates','A teacher and a student']}]},
 {t:'rule',grp:SB(14),tag:'Lead-in',title:'New words',mech:'Listen and say',hint:'Tap a word',
   html:'<table class="rtable">'+ru('family album','семейный альбом')+ru('superhero','супергерой')+ru('happy','счастливый, довольный')+ru('hungry','голодный')+ru('Be careful!','Осторожно!')+'</table>'},
 {t:'picq',grp:SB(14),tag:'Ex 1–2',title:'Look, listen and read',mech:'Cartoon',hint:'Look at the cartoon',instr:'Look at the cartoon on page 14. Read and answer.',img:'p14-all',nosay:true,shuffle:false,items:[
   {q:'How many types of dogs can you see?',opts:['eight','five','six','ten']},{q:'What nationality is Uncle Roberto?',img:'p14-2',opts:['Spanish','French','British','Polish']}]},
 old('1.3','Dug and Kit',{grp:SB(14),tag:'Ex 2',title:'Listen, then read',mech:'Listen & read'}),
 {t:'lava',grp:SB(14),tag:'Ex 3',title:'True or false?',mech:'Floor is lava',hint:'True or false?',instr:'Read the sentences. Choose T (true) or F (false).',img:'book/p14-all',items:[
   {q:'Uncle Roberto is a superhero.',ans:true},{q:'Aunt Gigi is French.',ans:true},{q:"Dug's parents are superheroes.",ans:false,exp:"Dug's parents aren't superheroes."},
   {q:'Dug is happy in the photo.',ans:false,exp:"Dug isn't happy. He's hungry!"},{q:"Dug's mum is British.",ans:false,exp:"Dug's mum is Polish."}]},
 {t:'rule',grp:SB(15),tag:'Grammar',title:'Get Grammar! to be negative',mech:'Grammar',hint:'not',
   html:'<div class="rtwo"><table class="rtable"><tr><th>Long form</th><th>Short form</th></tr>'+[['I am not Spanish.',"I'm not Spanish."],['You are not Spanish.',"You aren't Spanish."],['He is not Spanish.',"He isn't Spanish."],['She is not Spanish.',"She isn't Spanish."],['We are not Spanish.',"We aren't Spanish."],['They are not Spanish.',"They aren't Spanish."]].map(r=>'<tr><td>'+say(r[0])+'</td><td>'+say(r[1])+'</td></tr>').join('')+'</table>'+
   '<div class="note" style="max-width:330px">«Не» = <b class="hl">not</b> после am / is / are.<br><br>is not = <b class="hl">isn’t</b><br>are not = <b class="hl">aren’t</b><br>I am not = <b class="hl">I’m not</b><br><br>Нельзя: I amn’t.</div></div>'},
 {t:'build',grp:SB(15),tag:'Ex 4',title:'Negative sentences',mech:'Sentence builder',hint:'Long form',instr:'Make negative sentences. Use the long form of the verb to be.',words:true,items:[
   {w:'Dug is not French.',q:'Dug is French.',say:'Dug is not French.'},{w:'Kit is not a dog.',q:'Kit is a dog.',say:'Kit is not a dog.'},{w:"Dug's parents are not superheroes.",q:"Dug's parents are superheroes.",say:"Dug's parents are not superheroes."},
   {w:'I am not happy.',q:'Dug: ‘I am happy.’',say:'I am not happy.'},{w:'You are not in the photo, Dug.',q:'Kit: ‘You are in the photo, Dug.’',say:'You are not in the photo, Dug.'},{w:'Dug is not hungry.',q:'Dug is hungry.',say:'Dug is not hungry.'}]},
 {t:'match',grp:SB(15),tag:'Ex 5',title:'Short forms',mech:'Matching',hint:'Long = short',instr:'Rewrite the sentences. Use the short form of the verb to be.',pairs:[
   ['Dug is not French.',"Dug isn't French."],['Kit is not a dog.',"Kit isn't a dog."],["Dug's parents are not superheroes.","Dug's parents aren't superheroes."],['I am not happy.',"I'm not happy."],['You are not in the photo.',"You aren't in the photo."],['Dug is not hungry.',"Dug isn't hungry."]]},
 {t:'rule',grp:SB(15),tag:'Ex 6',title:'Countries and nationalities',mech:'Look, listen and repeat',hint:'Tap and repeat',
   html:'<table class="rtable"><tr><th></th><th>Country</th><th>Nationality</th></tr>'+NAT.map(n=>'<tr><td>'+F(n[0],'sm')+'</td><td>'+say(n[1])+'</td><td>'+say(n[2])+'</td></tr>').join('')+'</table>'},
 {t:'ltap',grp:SB(15),tag:'Ex 7',title:'Look at the flags',mech:'Flags',hint:'is or isn’t',instr:"Look at the flags. Complete the sentences about Dug's family with is or isn't.",nosay:true,shuffle:false,items:[
   {h:F('pl'),q:'Aunt Teresa ___ Spanish.',opts:['isn’t','is'],ans:0,exp:'She is Polish.'},{h:F('it'),q:'Grandad Umberto ___ Chinese.',opts:['isn’t','is'],ans:0,exp:'He is Italian.'},{h:F('fr'),q:'Cousin Lulu ___ French.',opts:['is','isn’t'],ans:0},
   {h:F('cn'),q:'Cousin Chen ___ British.',opts:['isn’t','is'],ans:0,exp:'He is Chinese.'},{h:F('us'),q:'Granny Flossie ___ American.',opts:['is','isn’t'],ans:0}]},
 {t:'picq',grp:SB(15),tag:'Ex 8',title:"Kit's friends and family",mech:'Pictures',hint:'Choose the sentences',instr:"Choose the sentences about Kit's friends and family.",img:'p15-kit1',nosay:true,shuffle:false,one:true,items:[
   {q:'Italy ✕   the UK ✓',img:'p15-kit1',opts:["I'm not from Italy. I'm from the UK.","I'm from Italy. I'm not from the UK.","I isn't from Italy. I'm from the UK."]},
   {q:'We … · Spain ✕   the UK ✓',img:'p15-kit2',opts:["We aren't from Spain. We're from the UK.","We isn't from Spain. We're from the UK.","We're from Spain. We aren't from the UK."]},
   {q:'Granny Susie … · France ✕   the UK ✓',img:'p15-kit3',opts:["Granny Susie isn't from France. She's from the UK.","Granny Susie aren't from France. She's from the UK.","Granny Susie is from France. She isn't from the UK."]},
   {q:'My cousins … · the USA ✕   China ✓',img:'p15-kit4',opts:["My cousins aren't from the USA. They're from China.","My cousins isn't from the USA. They're from China.","My cousins are from the USA. They aren't from China."]}]},
 {t:'guess3',grp:SB(15),tag:'Ex 9',title:'Fun Spot: Three Guesses',mech:'Three guesses',hint:'Guess the nationality',instr:'Play the Three Guesses game. Guess my nationality!',q:'Guess my nationality!',rounds:5,
   guess:"You're …!",yes:"Yes, I'm ….",no:"No, I'm not ….",opts:NAT.map(n=>({t:n[2],h:F(n[0])}))},
 {t:'build',grp:WB(10),tag:'WB 1',title:'Short forms',mech:'Sentence builder',hint:'Short form',instr:'Rewrite the sentences using short forms of the verb to be.',words:true,items:[
   {w:"My friends aren't at home.",q:'My friends are not at home.'},{w:"You aren't right.",q:'You are not right.'},{w:"I'm not a superhero.",q:'I am not a superhero.'},
   {w:"Ben isn't my friend.",q:'Ben is not my friend.'},{w:"She isn't my aunt.",q:'She is not my aunt.'},{w:"They aren't my cousins.",q:'They are not my cousins.'}]},
 {t:'picq',grp:WB(10),tag:'WB 2',title:'Write negative sentences',mech:'Pictures',hint:'Look and choose',instr:'Look at the picture. Choose the negative sentence.',img:'w10-1',nosay:true,shuffle:false,one:true,items:[
   {q:"She's eleven.",img:'w10-1',opts:["She isn't eleven.","She aren't eleven.","She not eleven."]},{q:"She's at school.",img:'w10-1',opts:["She isn't at school.","She aren't at school.","She's not is at school."]},
   {q:"They're happy.",img:'w10-2',opts:["They aren't happy.","They isn't happy.","They not happy."]},{q:"They're at home.",img:'w10-2',opts:["They aren't at home.","They isn't at home.","They'm not at home."]},
   {q:"He's a teacher.",img:'w10-3',opts:["He isn't a teacher.","He aren't a teacher.","He not a teacher."]},{q:"He's ready for school.",img:'w10-3',opts:["He isn't ready for school.","He aren't ready for school.","He'm not ready for school."]}]},
 {t:'ltap',grp:WB(10),tag:'WB 3',title:'Countries and nationalities',mech:'Flags',hint:'Country / nationality',instr:'Look at the flag. Choose the country and the nationality.',nosay:true,items:NAT.map(n=>({h:F(n[0]),q:'',opts:[n[1]+' / '+n[2]].concat(others(NAT.map(x=>x[1]+' / '+x[2]),n[1]+' / '+n[2],3)),ans:0}))},
 {t:'speak',grp:WB(10),tag:'WB 4',title:'True for you',mech:'Speaking',hint:"am, 'm not, is, isn't, are, aren't",instr:"Say sentences that are true for you. Use am, 'm not, are, aren't, is or isn't.",
   prompts:['My school … in the USA.','My English teacher … British.','My friends … in China.','My parents … Polish.','I … Italian.','I … ten.'],patterns:['is',"isn't",'are',"aren't",'am',"'m not"],sec:30},
 {t:'cloze',grp:WB(10),tag:'WB 5',title:'Complete the dialogue',mech:'Gap text',hint:'✓ or ✕',instr:'Complete the dialogue with the verb to be: affirmative (✓) or negative (✕).',img:'book/w10-dug',
   text:"Kit: It [is|isn't] (✓) you, Dug! You [are|aren't] (✓) with your grandad and granny, right?\nDug: No, I ['m not|am] (✕). They [are|aren't] (✓) my parents. My dad [is|isn't] (✓) British, but my mother [isn't|is] (✕) British. She [is|isn't] (✓) Polish.\nKit: It [isn't|is] (✕) a new photo.\nDug: That's right. The photo [is|isn't] (✓) very old."},
 {t:'sort',grp:EX,tag:'Game',title:'Country or nationality?',mech:'Rapid categories',hint:'Tap a word, tap its box',instr:'Country or nationality?',buckets:[{k:'Country'},{k:'Nationality'}],items:NAT.flatMap(n=>[[n[1],0],[n[2],1]])},
 {t:'race',grp:EX,tag:'Game',title:'Flag race',mech:'Race track',hint:'Answer and go',instr:'Look at the flag. Choose the nationality and move your car.',n:10,items:NAT.map(n=>({h:F(n[0]),opts:[n[2]].concat(others(NATS,n[2],3))})).concat(NAT.slice(0,5).map(n=>({h:F(n[0]),q:"I'm from …",opts:[n[1]].concat(others(CTRS,n[1],3))})))},
 old('1.3','Error hunter: negatives',{tag:'Game',title:'Grammar Doctor'}),
 old('1.3','Speed game',{tag:'Game'}),
 {t:'ltap',grp:FIN,tag:'Finish',title:'No, he isn’t!',mech:'Correct me',hint:'Choose the answer',instr:'The sentence is false. Correct it.',nosay:true,one:true,items:[
   {q:"Dug's mum is British.",opts:["No, she isn't. She's Polish.","Yes, she is.","No, she isn't. She's French."],ans:0},{q:'Cousin Chen is French.',opts:["No, he isn't. He's Chinese.","Yes, he is.","No, he isn't. He's Italian."],ans:0},
   {q:'Granny Flossie is Spanish.',opts:["No, she isn't. She's American.","Yes, she is.","No, she isn't. She's Polish."],ans:0}]},
 self('Can you talk about countries and nationalities?',["I can say: I'm from … I'm …","I can say: I'm not Spanish. He isn't French. They aren't superheroes."])
];

/* ============================== 1.4  Nice to meet you! ============================== */
const b14=[
 {t:'lava',grp:WU,tag:'Warm-up',title:'True or false?',mech:'Floor is lava',hint:'True or false?',instr:'Negative sentences about the people from the book. True or false?',items:[
   {q:"Kit isn't a dog.",ans:true},{q:"Dug isn't a superhero.",ans:false,exp:'Dug is a superhero.'},{q:"Uncle Roberto isn't French.",ans:true,exp:"He's Spanish."},{q:"Jen isn't ten.",ans:false,exp:'Jen is ten.'},
   {q:"Jason isn't at home.",ans:true,exp:"He's in Spain."},{q:"Dug's parents aren't superheroes.",ans:true},{q:"Sophie isn't Jen's granny.",ans:false,exp:"Sophie is Jen's granny."},
   {q:"Alex isn't Jen's brother.",ans:false,exp:"Alex is Jen's brother."},{q:"Aunt Gigi isn't French.",ans:false,exp:'Aunt Gigi is French.'},{q:"Dug's mum isn't British.",ans:true,exp:"She's Polish."}]},
 {t:'predict',grp:WU,tag:'Predict',title:'Nice to meet you!',mech:'Prediction',hint:'Look and guess',img:'book/p16-photo',cap:'Jen, a boy and Jen’s mum in the kitchen',q:'Who is the boy?',
   opts:["Jen's new neighbour","Jen's teacher","Jen's dad"],reveal:'This is Lucas. He’s Jen’s new <b>neighbour</b> (сосед). Today: I can make introductions.'},
 {t:'picq',grp:SB(16),tag:'Ex 1',title:'Read and answer',mech:'Photo',hint:'Read the dialogue',instr:'Read the dialogue on page 16. Answer the questions.',img:'p16-photo',nosay:true,shuffle:false,items:[
   {q:"What's Jen's family name?",opts:['Newman','Ortiz','Smith','Hall']},{q:'Where are they?',opts:['at home','at school','in the park']},{q:'Lucas is Jen’s new …',opts:['neighbour','cousin','brother']}]},
 old('1.4','Nice to meet you!',{grp:SB(16),tag:'Ex 1',title:'Listen, then read',mech:'Listen & read'}),
 {t:'rule',grp:SB(16),tag:'Ex 2',title:'Communication: Introductions',mech:'Listen and repeat',hint:'Tap and repeat',
   html:'<table class="rtable"><tr><td><b>A</b></td><td>'+say('Mum, this is Lucas.')+say('He is my friend.')+say('Lucas, this is my mum.')+'</td></tr><tr><td><b>B</b></td><td>'+say('Hello, Lucas. Nice to meet you.')+'</td></tr><tr><td><b>C</b></td><td>'+say('Nice to meet you too.')+'</td></tr></table>'+
   '<div class="note"><b>This is …</b> = «Это …» — так знакомят людей. <b>Nice to meet you.</b> = Приятно познакомиться. В ответ: <b>Nice to meet you <span class="hl">too</span>.</b> Маму друга называют <b>Mrs</b> + фамилия.</div>'},
 {t:'build',grp:SB(16),tag:'Ex 3',title:'Put the dialogue in order',mech:'Text puzzle',hint:'Tap the lines in order',instr:'Put the dialogue in the correct order.',sep:'|',items:[
   {w:"Lisa, this is Desi. He's my best friend.|Desi, this is my cousin, Lisa.|Hello, Desi. Nice to meet you.|Nice to meet you too, Lisa.",q:'Adam · Adam · Lisa · Desi',say:"Lisa, this is Desi. He's my best friend."}]},
 {t:'speak',grp:SB(16),tag:'Ex 4',title:'Act out the dialogue',mech:'Role play',hint:'Three roles',instr:'Act out the dialogue in Exercise 3.',prompts:['You are Adam.','You are Lisa.','You are Desi.'],
   patterns:["Lisa, this is Desi. He's my best friend.",'Desi, this is my cousin, Lisa.','Hello, Desi. Nice to meet you.','Nice to meet you too, Lisa.'],sec:40},
 {t:'ltap',grp:SB(16),tag:'Ex 5',title:'Exam Spot: the best answer',mech:'Exam',hint:'Choose a, b or c',instr:'Choose the best answer.',nosay:true,shuffle:false,one:true,items:[
   {q:"A: Hello, I'm George.",opts:['Nice to meet you, George.','Very well, thanks.',"I've got it."],ans:0},{q:'A: Mum, this is Sam.',opts:['Hello, Sam.',"He's my classmate.",'Hold this, please.'],ans:0},
   {q:'A: Kate, this is my sister, Lisa.',opts:['Hi, Lisa. Nice to meet you.','Be careful!',"She's my friend."],ans:0}]},
 {t:'wheel',grp:SB(16),tag:'Ex 6',title:'Fun Spot: famous people',mech:'Wheel',hint:'Spin and introduce',instr:'Think of three famous people. Spin and introduce them to your friends!',
   items:['a famous pop star','a famous film star','a famous sports person','your best friend','your mum','your teacher'],patterns:['…, this is my friend, …',"He's a famous film star!","She's a famous pop star!",'Nice to meet you.','Nice to meet you too.']},
 {t:'picq',grp:WB(11),tag:'WB 1',title:'Complete the dialogues',mech:'Pictures',hint:'a, b or c',instr:'Complete the dialogues.',img:'w11-1',nosay:true,shuffle:false,items:[
   {q:'1',img:'w11-1',opts:['Hi, Mum!','Sorry, Mum!',"It's OK, Mum!"]},{q:'2',img:'w11-1',opts:['This is Amy.',"I'm Amy.",'You are here, Amy.']},
   {q:'3',img:'w11-2',opts:['Hello, Amy.',"You're Amy.",'Thank you, Amy.']},{q:'4',img:'w11-2',opts:['Nice to meet you, Mrs Wilson.','Nice to meet you, Jill.','Nice to meet you, Amy.']}]},
 {t:'cloze',grp:WB(11),tag:'WB 2',title:'Words in the box',mech:'Gap text',hint:'Tap the word',instr:'Complete the dialogue with the words in the box.',img:'book/w11-trio',bank:["He's",'Hi','Nice','this is','to meet you'],
   text:"Thomas: Hi, Stella, [this is] Frankie. [He's] my cousin.\nStella: [Hi], Frankie. Nice [to meet you].\nFrankie: [Nice] to meet you too, Stella."},
 {t:'cloze',grp:WB(11),tag:'WB 3',title:'Sentences a–d',mech:'Gap text',hint:'Tap the sentence',instr:'Complete the dialogue with sentences a–d.',bank:["She's my best friend at school.",'Hi, Auntie Sue.','Nice to meet you.','Nice to meet you too.'],
   text:"May: [Hi, Auntie Sue.]\nAuntie Sue: Oh, hello May!\nMay: And this is Nancy. [She's my best friend at school.]\nAuntie Sue: Hello, Nancy. [Nice to meet you.]\nNancy: Hello, Mrs Smith. [Nice to meet you too.]"},
 {t:'speak',grp:WB(11),tag:'WB 4',title:'Introduce your friend',mech:'Role play',hint:'You, your teacher, your friend',instr:'Make a dialogue like in Exercise 3. Introduce your English friend to your teacher.',prompts:['You','Teacher','Your friend'],
   patterns:['Hello, Mrs …','And this is …',"She's my best friend.","He's my best friend.",'Nice to meet you.','Nice to meet you too.'],sec:40},
 old('1.4','What do you say?',{tag:'Game',t:'race',mech:'Race track',hint:'Answer and go',title:'What do you say? Race'}),
 old('1.4','Question and answer',{tag:'Game'}),
 old('1.4','Error hunter',{tag:'Game',title:'Grammar Doctor'}),
 old('1.4','Speed game',{tag:'Game'}),
 self('Can you make introductions?',['I can say: Mum, this is Lucas. He is my friend.','I can say: Nice to meet you. Nice to meet you too.'])
];

/* ============================== 1.5  My family album ============================== */
const PLACES=['at home','at school','at a party','in the garden','in the park','on holiday'];
const b15=[
 {t:'wheel',grp:WU,tag:'Warm-up',title:'Introduce a star',mech:'Wheel',hint:'Spin and introduce',instr:'Spin the wheel. Introduce a famous person to your teacher.',
   items:['a famous pop star','a famous film star','a famous sports person','a famous cartoon hero','your best friend','your granny'],patterns:['…, this is my friend, …',"He's a famous …","She's a famous …",'Nice to meet you.','Nice to meet you too.']},
 {t:'reveal',grp:WU,tag:'Predict',title:'Guess the photo',mech:'Picture reveal',hint:'Open the tiles',instr:'Open the tiles. Who is in the photo?',items:[
   {img:'book/p17-a',opts:['A granny and two girls','A mum and two boys','Three classmates']},{img:'book/p17-b',opts:['Three children in the park','Three children at school','A family at home']},{img:'book/p17-c',opts:['A family and a dog','A teacher and a class','Two brothers and a cat']}]},
 {t:'rule',grp:SB(17),tag:'Lead-in',title:'New words',mech:'Listen and say',hint:'Tap a word',
   html:'<table class="rtable">'+ru('family album','семейный альбом')+ru('favourite','любимый')+ru('fun','весёлый')+ru('near','рядом с')+ru('great','замечательный')+ru('on holiday','на каникулах, в отпуске')+'</table>'},
 {t:'picq',grp:SB(17),tag:'Ex 1',title:'Find Alice in the photos',mech:'Photos',hint:'How old is Alice?',instr:"Read Alice's blog on page 17. How old is Alice in the photo?",img:'p17-alice',nosay:true,shuffle:false,items:[
   {q:'Photo A: Alice is …',img:'p17-a',opts:['four','six','nine']},{q:'Photo B: Alice is …',img:'p17-b',opts:['nine','ten','eleven']},{q:'Photo C: Alice is …',img:'p17-c',opts:['eleven','thirteen','twelve']}]},
 old('1.5',"Alice's family album",{grp:SB(17),tag:'Ex 1',title:'Listen, then read',mech:'Listen & read'}),
 {t:'ltap',grp:SB(17),tag:'Ex 2',title:'Complete with one word',mech:'Gap fill',hint:'Choose',instr:'Complete the sentences about the text with one word.',nosay:true,shuffle:false,items:[
   {q:"Isabel is Alice's ___.",opts:['sister','cousin','aunt','mum'],ans:0},{q:"Alice's mum and aunt are ___.",opts:['French','British','Spanish','Polish'],ans:0},{q:"Vincent is ___ Jackie's dog.",opts:['Aunt','Uncle','Granny','Cousin'],ans:0},
   {q:"Tommy is Isabel's ___.",opts:['cousin','brother','uncle','dad'],ans:0},{q:"Granny is ___'s mum.",opts:['Dad','Mum','Aunt Jackie','Tommy'],ans:0}]},
 {t:'lava',grp:SB(17),tag:'Ex 3',title:'Exam Spot: true or false?',mech:'Floor is lava',hint:'True or false?',instr:'Read the sentences. Choose T (true) or F (false).',items:[
   {q:'Alice is eleven in Photo C.',ans:true},{q:"They're on holiday in France in Photo A.",ans:false,exp:"In Photo A they're at Granny's house in London."},{q:'They are in the park in Photo B.',ans:true},
   {q:'Tommy is eleven in Photo B.',ans:false,exp:'Tommy is ten.'},{q:"Photo A is Alice's favourite.",ans:true}]},
 {t:'rule',grp:SB(17),tag:'Ex 4',title:'Vocabulary: Places',mech:'Listen and repeat',hint:'Tap and repeat',
   html:'<div class="note">Listen and repeat. Смотри на маленькое слово: <b class="hl">at</b>, <b class="hl">in</b>, <b class="hl">on</b>.</div><table class="rtable">'+ru('at home','дома')+ru('at school','в школе')+ru('at a party','на празднике')+ru('in the garden','в саду')+ru('in the park','в парке')+ru('on holiday','на каникулах')+'</table>'},
 {t:'picq',grp:SB(17),tag:'Ex 5',title:'Look and choose the place',mech:'Pictures',hint:'Where is it?',instr:'Look at the pictures and choose the places.',img:'p17-pa',shuffle:false,items:[
   {q:'a',img:'p17-pa',opts:['in the park'].concat(others(PLACES,'in the park',3))},{q:'b',img:'p17-pb',opts:['at school'].concat(others(PLACES,'at school',3))},{q:'c',img:'p17-pc',opts:['on holiday'].concat(others(PLACES,'on holiday',3))},
   {q:'d',img:'p17-pd',opts:['at a party'].concat(others(PLACES,'at a party',3))},{q:'e',img:'p17-pe',opts:['at home'].concat(others(PLACES,'at home',3))},{q:'f',img:'p17-pf',opts:['in the garden'].concat(others(PLACES,'in the garden',3))}]},
 {t:'pic',grp:SB(17),tag:'Ex 6',title:'Listen and match',mech:'Listen & tap',hint:'Listen and tap the place',instr:'Listen to the conversations. Tap the place.',imgOpts:true,items:[
   {say:"Hey, that's a nice photo. It's my favourite. I'm at a party with Tommy. He's my cousin.",opts:['book/p17-pd','book/p17-pa','book/p17-pb','book/p17-pc'],ans:'at a party'},
   {say:"I'm with you and your mum in this photo. We're in the park. No, we aren't. We're in your garden!",opts:['book/p17-pf','book/p17-pa','book/p17-pe','book/p17-pd'],ans:'in the garden'},
   {say:"Look! It's you! Oh, yes! I'm at school.",opts:['book/p17-pb','book/p17-pe','book/p17-pc','book/p17-pf'],ans:'at school'},
   {say:"It's a photo of my uncle and aunt. They're at home with their dog Vincent.",opts:['book/p17-pe','book/p17-pc','book/p17-pa','book/p17-pb'],ans:'at home'}]},
 {t:'speak',grp:SB(17),tag:'Ex 7',title:'Describe the photos',mech:'Speaking',hint:'Describe a photo',instr:'Describe the photos (page 106). Use the example to help.',prompts:['Photo A','Photo B','Photo C','Photo D'],imgs:['book/p106-a','book/p106-b','book/p106-c','book/p106-d'],
   patterns:["It's mum, dad and three sons.",'They are on holiday.','They are in the garden.','They are in the park.','They are at home.'],sec:30},
 {t:'pic',grp:SB(17),tag:'Ex 7',title:'Which photo is it?',mech:'Image choice',hint:'Listen and tap the photo',instr:'Listen to your partner. Which photo is it?',imgOpts:true,items:[
   {say:"It's mum, dad and three sons. They are on holiday.",opts:['book/p106-a','book/p106-b','book/p106-c','book/p106-d'],ans:'Photo A'},{say:"It's grandad and his family. They are in the garden.",opts:['book/p106-b','book/p106-a','book/p106-c','book/p106-d'],ans:'Photo B'},
   {say:"It's mum, dad, two sons and a dog. They are in the park.",opts:['book/p106-c','book/p106-a','book/p106-b','book/p106-d'],ans:'Photo C'},{say:"It's mum and four sons. They are at home.",opts:['book/p106-d','book/p106-a','book/p106-b','book/p106-c'],ans:'Photo D'}]},
 {t:'picq',grp:WB(12),tag:'WB 1',title:'Match texts to photos',mech:'Photos',hint:'Text 1, 2 or 3',instr:'Read the texts in the Workbook (page 12). Match texts 1–3 to photos A–C.',img:'w12-a',nosay:true,shuffle:false,items:[
   {q:'Photo A',img:'w12-a',opts:['Text 3','Text 1','Text 2']},{q:'Photo B',img:'w12-b',opts:['Text 1','Text 2','Text 3']},{q:'Photo C',img:'w12-c',opts:['Text 2','Text 1','Text 3']}]},
 {t:'match',grp:WB(12),tag:'WB 2',title:'Match 1–6 to a–f',mech:'Matching',hint:'Tap a pair',instr:'Read the texts again. Match 1–6 to a–f.',lspeak:false,pairs:[["Hi. My name's",'Silvia.'],["I'm",'12.'],['My brother is','9.'],['Ellie is','my aunt.'],['Bea is','my friend.'],['Sweep is','a dog.']]},
 {t:'ltap',grp:WB(12),tag:'WB 3',title:'British, Italian or Spanish?',mech:'Gap fill',hint:'Choose',instr:'Complete the sentences with British, Italian or Spanish. Check your answers in the texts.',nosay:true,shuffle:false,items:[
   ['Silvia is ___.','British'],['Nick is ___.','British'],["Silvia's dad is ___.",'Spanish'],['Aunt Ellie is ___.','Spanish'],["Bea's mother is ___.",'Italian'],["Bea's father is ___.",'British']].map(r=>({q:r[0],opts:[r[1]].concat(['British','Italian','Spanish'].filter(x=>x!==r[1])),ans:0}))},
 {t:'picq',grp:WB(12),tag:'WB 4',title:'Look and complete the words',mech:'Photos',hint:'Choose the word',instr:'Look at the photos and complete the words.',img:'w12-balloon',shuffle:false,items:[
   {q:"I'm at a p _ _ _ _ today.",img:'w12-balloon',opts:['party','park','photo','pen']},{q:"We aren't at s _ _ _ _ _ today.",img:'w12-board',opts:['school','sister','Spain','sports']},
   {q:'My sister and my mother are in the g _ _ _ _ _.',img:'w12-cans',opts:['garden','granny','green','girl']},{q:'My granny and my grandad are in the p _ _ _.',img:'w12-bench',opts:['park','party','pink','pens']}]},
 old('1.5','at, in, on',{tag:'Rule'}),
 old('1.5','at, in or on?',{tag:'Game',title:'at, in or on? Sorting'}),
 old('1.5','Choose: at, in or on',{tag:'Game',t:'race',mech:'Race track',hint:'Answer and go',title:'at, in, on race'}),
 old('1.5','Place phrases',{tag:'Game'}),
 old('1.5','Speed game',{tag:'Game'}),
 self('Can you understand a text about family photos?',['I can read about a family album.','I can say: at home, at school, in the park, on holiday.'])
];

/* ============================== 1.6  Best friends ============================== */
const b16=[
 {t:'pic',grp:WU,tag:'Warm-up',title:'Whispers: where is it?',mech:'Listen & tap',hint:'Listen and tap the place',instr:'Listen to the word from Lesson 1.5. Tap the picture.',imgOpts:true,items:[
   ['in the park','pa'],['at school','pb'],['on holiday','pc'],['at a party','pd'],['at home','pe'],['in the garden','pf']].map(r=>({say:r[0],ans:r[0],opts:['book/p17-'+r[1]].concat(others(['pa','pb','pc','pd','pe','pf'],r[1],3).map(x=>'book/p17-'+x))}))},
 {t:'speak',grp:WU,tag:'Speaking',title:'Where are you?',mech:'Speaking',hint:'Places',instr:'Answer the questions. Use the places from Lesson 1.5.',prompts:['Where are you now?','Where is your mum now?','Where are your friends now?','Where is your granny now?'],
   patterns:["I'm at home.","She's at home.","They're at school.","She's in the garden.","They're in the park."],sec:30},
 {t:'predict',grp:WU,tag:'Ex 1',title:'Look at the website',mech:'Prediction',hint:'Look and guess',img:'book/p18-site',cap:'A radio show website',q:'What is the radio show about?',opts:['Best friends','Family photos','Birthday presents'],
   reveal:"It's about <b>best friends</b>. International Friendship Day = Международный день дружбы. Today: I can understand and write short texts about best friends."},
 {t:'pic',grp:SB(18),tag:'Ex 2',title:'Listen to the radio show',mech:'Who said it?',hint:'Listen and tap the photo',instr:'Listen to the radio show. Tap the photo of the best friend.',imgOpts:true,items:[
   {say:"Hi! I'm Tom. My best friend is my cousin Monica. She's eleven. Monica's from France. Now she's in the UK with her family.",opts:['book/p18-c','book/p18-a','book/p18-b'],ans:'Tom → C'},
   {say:"Hello. My best friend's name is Jack. He isn't from Argentina. He's Chinese. Oh, and he's two years old!",opts:['book/p18-b','book/p18-a','book/p18-c'],ans:'Maria → B'},
   {say:"Hi! My two best friends aren't my classmates. They're my neighbours, Giorgia and Toni. They're from Italy.",opts:['book/p18-a','book/p18-b','book/p18-c'],ans:'Juan → A'}]},
 {t:'ltap',grp:SB(18),tag:'Ex 3',title:'Exam Spot: listen again',mech:'Listening',hint:'A number or a country',instr:'Read the questions. Listen again. Choose a number or a country.',nosay:true,shuffle:false,items:[
   {say:"Hi! I'm Tom. My best friend is my cousin Monica. She's eleven. Monica's from France. Now she's in the UK with her family.",q:'How old is Monica?',opts:['11','12','10','2'],ans:0},
   {say:"Hi! I'm Tom. My best friend is my cousin Monica. She's eleven. Monica's from France. Now she's in the UK with her family.",q:'Where is Monica now?',opts:['in the UK','in France','in Italy','in China'],ans:0},
   {say:"Hello. My best friend's name is Jack. He isn't from Argentina. He's Chinese. Oh, and he's two years old!",q:'How old is Jack?',opts:['two','ten','eleven','twelve'],ans:0},
   {say:"Hi! My two best friends aren't my classmates. They're my neighbours, Giorgia and Toni. They're from Italy.",q:'Where are Giorgia and Toni from?',opts:['Italy','Spain','France','the UK'],ans:0}]},
 {t:'speak',grp:SB(18),tag:'Ex 4',title:"Who's your best friend?",mech:'Speaking',hint:'Name, age, who?',instr:"Who's your best friend? Tell the class.",prompts:['1 · Name','2 · Age','3 · Classmate / Neighbour / Family?'],
   patterns:['My best friend is …',"She's … years old.","He's … years old.","She's my classmate.","He's my neighbour.","She's my cousin."],sec:40,imgs:['gf1-friend','gf1-friend','gf1-friend']},
 {t:'picq',grp:SB(18),tag:'Ex 5',title:'Complete the table',mech:'Table',hint:'Read and choose',instr:"Read Jen's blog on page 18 and complete the table.",img:'p18-jen',nosay:true,shuffle:false,items:[
   {q:'Me · Name',opts:['Jen','Lucas','Lian','Alex']},{q:'Me · Age',opts:['10','11','12','9']},{q:'Me · Nationality',opts:['British','Spanish','French','Italian']},{q:'Me · Country',opts:['the UK','Spain','France','the USA']},
   {q:'My best friend · Name',opts:['Lucas','Jen','Alex','Jason']},{q:'My best friend · Age',opts:['11','10','12','16']},{q:'My best friend · Nationality',opts:['Spanish','British','Polish','Chinese']},{q:'My best friend · Country',opts:['Spain','the UK','Italy','Poland']}]},
 old('1.6',"Jen's blog",{grp:SB(18),tag:'Ex 5',title:'Listen, then read',mech:'Listen & read'}),
 {t:'rule',grp:SB(18),tag:'Writing',title:'Writing: Capital letters',mech:'Rule',hint:'Big letters',
   html:'<div class="note"><b>Большая буква (capital letter):</b> имена людей, страны и национальности, слово <b class="hl">I</b> и начало каждого предложения.</div>'+
   '<table class="rtable"><tr><td>'+say('My best friend is Jack.')+'</td><td><b class="hl">M</b>y … <b class="hl">J</b>ack</td></tr><tr><td>'+say("I'm from France.")+'</td><td><b class="hl">I</b>’m … <b class="hl">F</b>rance</td></tr><tr><td>'+say('Giorgia and Toni are Italian.')+'</td><td><b class="hl">G</b>iorgia … <b class="hl">T</b>oni … <b class="hl">I</b>talian</td></tr></table>'+
   '<div class="note">В русском «итальянский» пишем с маленькой, а в английском <b>Italian</b> — всегда с большой.</div>'},
 old('1.6','Capital or small?',{grp:SB(18),tag:'Ex 6',title:'Capital or small?'}),
 old('1.6','Capital letters',{grp:SB(18),tag:'Ex 6',title:'Find the capital letters',mech:'Error hunter'}),
 {t:'speak',grp:SB(18),tag:'Ex 7',title:'Writing Time: me and my best friend',mech:'Writing plan',hint:'Find ideas · Draft · Check',instr:'Write about you and your best friend.',
   prompts:['Find ideas: find a photo of you and your best friend.','Draft: write about your name, age, country and nationality.','Write the same about your best friend.','Check all the capital letters.'],
   patterns:["My name's …","I'm ten.","I'm from …","I'm …",'My best friend is …',"She's from …","He's from …"],sec:60},
 {t:'hunt',grp:WB(13),tag:'WB 3',title:'Add capital letters',mech:'Error hunter',hint:'Tap the wrong words',instr:'Correct the text. Tap the words that need a capital letter.',items:[
   '~clara and ~bianca are best friends.|Clara/Bianca','~clara is nine and ~bianca is ten.|Clara/Bianca','~clara is from the UK.|Clara',"~she's ~british.|She's/British",'~bianca is from ~italy.|Bianca/Italy',"~she's ~italian.|She's/Italian"]},
 {t:'picq',grp:WB(13),tag:'WB 4',title:'Complete the table',mech:'Table',hint:'Read and choose',instr:'Read the text in Exercise 3 again. Complete the table.',img:'w13-clara',nosay:true,shuffle:false,items:[
   {q:'Clara · Age',opts:['9','10','11','12']},{q:'Clara · Country',opts:['the UK','Italy','Spain','France']},{q:'Clara · Nationality',opts:['British','Italian','Spanish','French']},
   {q:'Bianca · Age',opts:['10','9','11','12']},{q:'Bianca · Country',opts:['Italy','the UK','Spain','France']},{q:'Bianca · Nationality',opts:['Italian','British','Spanish','French']}]},
 {t:'build',grp:WB(13),tag:'WB 5',title:'Write about Pierre and Pedro',mech:'Sentence builder',hint:'Make the sentence',instr:'Look at the information and write about Pierre and Pedro.',words:true,shuffle:false,items:[
   {w:'Pierre and Pedro are best friends.',q:'Pierre + Pedro'},{w:'Pierre is twelve.',q:'Pierre · Age: 12'},{w:'He is from France.',q:'Pierre · Country: France'},{w:'He is French.',q:'Pierre · Nationality: French'},
   {w:'Pedro is eleven.',q:'Pedro · Age: 11'},{w:'He is from Spain.',q:'Pedro · Country: Spain'},{w:'He is Spanish.',q:'Pedro · Nationality: Spanish'}]},
 old('1.6','Which is correct?',{tag:'Game',t:'race',mech:'Race track',hint:'Answer and go',title:'Capital letters race'}),
 old('1.6','Floor is lava',{tag:'Game'}),
 old('1.6','Speed game',{tag:'Game'}),
 old('1.6','30-second talk: My best friend',{tag:'Speaking'}),
 self('Can you understand and write short texts about best friends?',['I can listen and read about best friends.','I can use capital letters: Jack, France, Italian, I.'])
];

/* ============================== 1.7  Language Revision ============================== */
const b17=[
 {t:'ltap',grp:WU,tag:'Warm-up',title:'Unit 1 quiz',mech:'Quiz',hint:'Choose',instr:'What do you remember from Unit 1?',nosay:true,items:[
   {q:"My mum's sister is my …",opts:['aunt','uncle','cousin','granny'],ans:0},{q:'Who is Sophie?',opts:["Alex and Jen's granny","Alex and Jen's aunt","Jen's best friend","Dug's mum"],ans:0},{q:'How old is Sophie?',opts:['70','17','7','60'],ans:0},
   {q:'What nationality is Uncle Roberto?',opts:['Spanish','French','British','Polish'],ans:0},{q:'Who is Kit?',opts:["Dug's best friend","Dug's sister","Jen's cat","Dug's mum"],ans:0}]},
 {t:'wheel',grp:WU,tag:'Speaking',title:'Talk wheel',mech:'Wheel',hint:'Spin and speak',instr:'Spin the wheel and talk about it.',items:['My mum','My dad','My granny','My best friend','My country','My family','My teacher','Me'],
   patterns:["My mum's name is …","She's …","He's …","I'm from …","I'm …","My best friend isn't my classmate."]},
 {t:'build',grp:SB(19),tag:'Ex 1',title:'Complete the family words',mech:'Word builder',hint:'Listen and build',instr:'Complete the family words.',items:['grandad','granny','uncle','aunt','mum','dad','cousin','sister','brother']},
 {t:'mystery',grp:SB(19),tag:'Ex 1',title:'Seven other family words',mech:'Mystery box',hint:'Open a box',instr:'What seven other family words do you know? Open a box and check.',n:8,items:[
   {q:'grand + father',a:'grandfather'},{q:'grand + mother',a:'grandmother'},{q:'mum =',a:'mother'},{q:'dad =',a:'father'},{q:'mum and dad =',a:'parents'},{q:'He is my mum’s …',a:'son'},{q:'She is my mum’s …',a:'daughter'},{q:'My aunt’s son is my …',a:'cousin'}]},
 {t:'odd',grp:SB(19),tag:'Ex 2',title:'Odd one out',mech:'Odd one out',hint:'Which word is different?',instr:'Choose the odd one out.',q:'Choose the odd one out.',items:[
   {ws:['Chinese','Spain','the UK'],odd:0},{ws:['the USA','Italian','the UK'],odd:1},{ws:['France','Poland','American'],odd:2},{ws:['Spanish','British','China'],odd:2},{ws:['French','the USA','Polish'],odd:1}]},
 {t:'picq',grp:SB(19),tag:'Ex 3',title:'Look at the pictures',mech:'Pictures',hint:'a, b or c',instr:'Look at the pictures. Choose a, b or c.',img:'p19-1',shuffle:false,items:[
   {q:'1',img:'p19-1',opts:['at school','in the park','in the garden']},{q:'2',img:'p19-2',opts:['at a party','at home','on holiday']},{q:'3',img:'p19-3',opts:['on holiday','at home','in the garden']}]},
 {t:'sort',grp:SB(19),tag:'Ex 4',title:'Pronunciation: /v/ or /b/?',mech:'Sorting',hint:'Listen and sort',instr:'Listen and repeat (page 19). Then sort the words: /v/ or /b/?',buckets:[{k:'/v/',s:'зубы касаются губы'},{k:'/b/',s:'губы вместе'}],
   items:[['Viv',0],['best',1],['Vincent',0],['Brad',1],['bad',1],['brown',1],['very',0],['big',1]]},
 {t:'build',grp:SB(19),tag:'Ex 5',title:'Possessive ’s',mech:'Sentence builder',hint:'Make the sentence',instr:'Make sentences with possessive ’s.',words:true,shuffle:false,items:[
   {w:"It's Luke's cake.",q:'Luke / cake'},{w:"It's Granny's birthday.",q:'Granny / birthday'},{w:"Jason is Megan's son.",q:'Megan / son'},{w:"Megan is Dad's sister.",q:'Dad / sister'}]},
 {t:'cloze',grp:SB(19),tag:'Ex 6',title:"Maria's profile",mech:'Gap text',hint:'am, are or is',instr:"Read and complete Maria's profile with am, are or is.",img:'book/p19-maria',bank:BE,
   text:"My name's Maria. I [am] thirteen. I [am] from the USA. My best friend [is] Isabel. Her family [is] English. We [are] classmates. Her two brothers [are] my friends too."},
 {t:'match',grp:SB(19),tag:'Ex 7',title:'Match 1–5 to a–e',mech:'Matching',hint:'Make sentences',instr:'Match 1–5 to a–e.',lspeak:false,pairs:[["Jane's best",'friend is her neighbour.'],['Your brother is','in my class.'],["It's my",'birthday today!'],["That isn't",'your schoolbag.'],['His cousin','George is eleven.']]},
 {t:'ltap',grp:SB(19),tag:'Ex 8',title:'Negative sentences',mech:'Choose',hint:'Make it negative',instr:'Choose the negative sentence. Which sentences are true for you?',nosay:true,shuffle:false,one:true,items:[
   {q:"I'm fifteen.",opts:["I'm not fifteen.","I isn't fifteen.","I aren't fifteen."],ans:0},{q:'My best friend is my cat.',opts:["My best friend isn't my cat.","My best friend aren't my cat.","My best friend not my cat."],ans:0},
   {q:"My brother's name is Ben.",opts:["My brother's name isn't Ben.","My brother's name aren't Ben.","My brother's name not Ben."],ans:0},{q:"We're at home.",opts:["We aren't at home.","We isn't at home.","We'm not at home."],ans:0},
   {q:"It's my birthday.",opts:["It isn't my birthday.","It aren't my birthday.","It not my birthday."],ans:0},{q:'My neighbours are my classmates.',opts:["My neighbours aren't my classmates.","My neighbours isn't my classmates.","My neighbours not my classmates."],ans:0}]},
 {t:'cloze',grp:SB(19),tag:'Ex 9',title:'Complete the dialogue',mech:'Gap text',hint:'Tap the word',instr:'Complete the dialogue with the words in the box. Then act it out.',bank:['Nice','this','meet'],
   text:'Jamie: Mum, [this] is my friend, David. David, [this] is my mum.\nDavid: Hello, Mrs Smith. [Nice] to meet you.\nMum: Nice to [meet] you too, David.'},
 {t:'ltap',grp:WB(14),tag:'WB 1',title:'Complete the pairs',mech:'Gap fill',hint:'Choose',instr:'Complete the pairs.',nosay:true,shuffle:false,items:[
   C('___ and uncle','aunt',FAM),C('mother and ___','father',FAM),C('___ and sister','brother',FAM),C('son and ___','daughter',FAM),C('___ and grandad','granny',FAM)]},
 {t:'picq',grp:WB(14),tag:'WB 2',title:'Look and complete the words',mech:'Photos',hint:'Choose the word',instr:'Look and complete the words.',img:'w14-0',shuffle:false,items:[
   {q:"She's from P _ _ _ _ _.",img:'w14-0',opts:['Poland','Polish','park','party']},{q:"He's in the g _ _ _ _ _.",img:'w14-1',opts:['garden','granny','green','grandad']},{q:"She's A _ _ _ _ _ _ _.",img:'w14-2',opts:['American','aunt','at home','Agatha']},
   {q:'They are at s _ _ _ _ _.',img:'w14-3',opts:['school','Spain','sister','Spanish']},{q:'Paris is in F _ _ _ _ _.',img:'w14-4',opts:['France','French','family','friend']},{q:"She's at h _ _ _.",img:'w14-5',opts:['home','her','hair','hello']}]},
 {t:'ltap',grp:WB(14),tag:'WB 3',title:'to be: ✓ or ✕',mech:'Gap fill',hint:'Affirmative or negative',instr:'Complete the sentences with the verb to be: affirmative (✓) or negative (✕).',nosay:true,shuffle:false,items:[
   {q:'My best friends ___ (✓) Maya and Jane.',opts:['are',"aren't",'is','am'],ans:0},{q:'Maya ___ (✓) Italian.',opts:['is',"isn't",'are','am'],ans:0},{q:'Jane and I ___ (✕) Italian.',opts:["aren't",'are',"isn't","'m not"],ans:0},
   {q:'We ___ (✓) from the UK.',opts:['are',"aren't",'is','am'],ans:0},{q:'I ___ (✕) in the UK in this photo!',opts:["'m not",'am',"isn't","aren't"],ans:0}]},
 {t:'picq',grp:WB(14),tag:'WB 4',title:'Circle the correct answer',mech:'Pictures',hint:'Choose',instr:'Choose the correct answer.',img:'w14-jack',nosay:true,shuffle:false,items:[
   {q:'This is Jack, and this is ___ cousin.',img:'w14-jack',opts:["Jack's",'Jack']},{q:'___ name is Freddie.',img:'w14-jack',opts:['His','Her']},{q:'They are with ___ dog, Wolfie.',img:'w14-jack',opts:["Freddie's",'Freddie']},
   {q:'This is Clara, and this is ___ best friend, Nadia.',img:'w14-clara',opts:['her','his']},{q:'___ mum and …',img:'w14-clara',opts:["Nadia's",'Nadia']},{q:'… ___ mum are best friends too.',img:'w14-clara',opts:["Clara's",'Clara']}]},
 {t:'cloze',grp:WB(14),tag:'WB 5',title:'One word in each gap',mech:'Gap text',hint:'Tap the word',instr:'Complete the dialogue with one word in each gap.',
   text:'A: Jack, this [is|are|am] my friend, Harry.\nB: [Hi|Bye|Sorry], Harry. [Nice|Happy|Good] to meet you.\nC: Hi, Jack. Nice to [meet|be|say] you [too|two|to].'},
 {t:'picq',grp:WB(15),tag:'Word blog',title:'My photos',mech:'Photos',hint:'Who is it?',instr:'Look and complete.',img:'w15-1',shuffle:false,items:[
   {q:"my mum's brother = my …",img:'w15-1',opts:['uncle','aunt','cousin','grandad']},{q:"my parents' daughter = my …",img:'w15-2',opts:['sister','brother','aunt','mother']},
   {q:"my dad's mum = my …",img:'w15-3',opts:['granny','aunt','mum','sister']},{q:"my aunt's sons = my …",img:'w15-4',opts:['cousins','brothers','uncles','parents']}]},
 {t:'ltap',grp:WB(15),tag:'Word blog',title:'My quiz: say hello!',mech:'Flags',hint:'Which language?',instr:'Match: in which language do you say hello like this?',nosay:true,items:[
   ['pl','Say Cześć!','in Polish'],['fr','Say Bonjour!','in French'],['it','Say Ciao!','in Italian'],['es','Say ¡Hola!','in Spanish'],['uk','Say Hello!','in English'],['cn','Say Nihao!','in Chinese']].map(r=>({h:F(r[0]),q:r[1],opts:[r[2]].concat(others(['in Polish','in French','in Italian','in Spanish','in English','in Chinese'],r[2],3)),ans:0}))},
 {t:'snake',grp:WB(15),tag:'Word blog',title:'Wordsnake: birthday words',mech:'Wordsnake',hint:'Tap the first and the last letter',instr:'Find four birthday words. Tap the first and the last letter of a word.',text:'awpartykzepresentjouballoonubcake',words:['party','present','balloon','cake']},
 {t:'pic',grp:WB(15),tag:'Fun Spot',title:'Match sentences to photos',mech:'Image choice',hint:'Read and tap the photo',instr:'Read the sentence. Tap the photo.',imgOpts:true,items:[
   ['This is my brother, Josh.','pc'],["He's at school.",'pa'],["This is my cousin. She's ten.",'pd'],["She's in the park.",'pd'],['Mr Thomson is 30.','pa'],['This is my granny.','pb'],["He's at home.",'pc'],["She's my mum's mother.",'pb'],["He's my teacher.",'pa'],["She's 60 years old.",'pb']].map(r=>({q:r[0],ans:r[0],opts:['book/w15-'+r[1]].concat(['pa','pb','pc','pd'].filter(x=>x!==r[1]).map(x=>'book/w15-'+x))}))},
 {t:'jeopardy',grp:EX,tag:'Game',title:'Unit 1 Jeopardy',mech:'Jeopardy',hint:'Choose a card',instr:'Choose a category and points.',cats:[
   {name:'Family',qs:[{q:'mother =',opts:['mum','dad','aunt']},{q:"your mum's sister",opts:['aunt','uncle','cousin','granny']},{q:"your uncle's son",opts:['cousin','brother','dad','son']},{q:"Paul = Mark___ father",opts:['’s','s’','is']}]},
   {name:'to be',qs:[{q:'I ___ ten.',opts:['am','is','are']},{q:'We ___ friends.',opts:['are','is','am']},{q:"She is not = she ___",opts:['isn’t','aren’t','’m not']},{q:'Dug’s parents ___ superheroes.',opts:['aren’t','isn’t','’m not']}]},
   {name:'Countries',qs:[{h:F('uk'),q:'',opts:['the UK','the USA','France']},{h:F('es'),q:'Nationality?',opts:['Spanish','Spain','Polish']},{h:F('pl'),q:'Nationality?',opts:['Polish','Poland','Italian']},{h:F('cn'),q:"I'm from China. I'm …",opts:['Chinese','China','French']}]},
   {name:'my · your · his · her',qs:[{q:"I'm Jen. ___ name is Jen.",opts:['My','Your','His']},{q:"He's Alex. ___ name is Alex.",opts:['His','Her','My']},{q:"She's my granny. ___ name is Sophie.",opts:['Her','His','Your']},{q:"You're ten. It's ___ birthday!",opts:['your','my','his']}]},
   {name:'Say it!',qs:[{q:'Hello, Lucas. Nice to meet you.',opts:['Nice to meet you too.','Be careful!',"I've got it!"]},{q:'Mum, ___ is Lucas.',opts:['this','he','it']},{q:'I’m ___ home.',opts:['at','in','on']},{q:'We’re ___ holiday.',opts:['on','at','in']}]}]},
 old('1.7','Error hunter',{tag:'Game',title:'Grammar Doctor'}),
 old('1.7','Floor is lava',{tag:'Game'}),
 old('1.7','Speed game',{tag:'Game'}),
 self('Check yourself! Unit 1',['I can talk about people in a family.','I can talk about countries and nationalities.','I can use possessive ’s.','I can use the affirmative and negative forms of the verb to be.','I can use my, your, his, her.','I can make introductions.'])
];

const hw=p=>' <b>Домашнее задание по Teacher’s Book:</b> Workbook, с. '+p+'.';
const T={
 '1.1':{name:'Family',short:'Family',blocks:b11,teach:'<b>Student’s Book с. 10–11 + Workbook с. 8. Vocabulary: family members.</b><br><b>Warm-up (TB):</b> Snowman со словами Unit 0 — буквы нажатием. <b>Lead-in:</b> мозговой штурм «семейные слова» (блок Speaking), затем прогноз по картинке-пирамиде.<br>'+
   '<b>Ex 1:</b> «I know that!» — читает слово, переворачивает карточку, показывает большой палец. <b>Ex 2:</b> слушаем и повторяем, затем находим людей на пирамиде (цвета одежды помогают: зелёные — семья Марка, красные — семья дяди). <b>Ex 3:</b> слева мужские слова, справа женские; cousin — и он, и она. <b>Ex 4:</b> после задания спросить: слова 1–4 официальные или разговорные? <b>Look!:</b> показать на картинке Mark → dad → Mark’s dad; ’s здесь не is.<br>'+
   '<b>Ответы:</b> Ex 5 — John; Lucy; Julia; David; Tom, Anna; Agatha; Peter; Rose, Paul. Ex 6 — Mark’s, Paul’s, Rose’s, Peter’s, Julia’s, Tom’s. Ex 7 — F, T, F, F, T, T (аудио 1.17 озвучено голосом сайта).<br><b>Ex 8:</b> рисует свою пирамиду в тетради и рассказывает полными предложениями: My dad is … My sisters are …<br><b>Extra activity (TB):</b> «Who is it?» — имя из коробки, ученик называет родство. <b>Fast finishers:</b> закрыть книгу и назвать все семейные слова.'+hw(8)},
 '1.2':{name:'It’s Granny’s birthday! · to be + my, your, his, her',short:'to be · my, your',blocks:b12,teach:'<b>Student’s Book с. 12–13 + Workbook с. 9. Grammar: to be affirmative; my, your, his, her.</b><br><b>Warm-up (TB):</b> «чтение по губам» — беззвучно произнесите семейное слово, ученик угадывает (на экране — Family bingo). Затем предложения с to be: What’s the verb?<br>'+
   '<b>Lead-in:</b> по фото — Who is he/she? Ввести cake, present, card, Spain. <b>Ex 1:</b> историю читаем в учебнике (с. 12); видео учебника на сайте нет. Ответы: 70; Megan’s son / Jen and Alex’s cousin. <b>Ex 2:</b> T, F (at Granny’s house), F (a birthday cake), F (He’s in Spain), T. <b>Ex 3:</b> повторяем фразы, находим их в истории. <b>Ex 4–5:</b> сначала голосуем, потом проверяем: b.<br>'+
   '<b>Get Grammar:</b> показать сокращение пальцами: I am → I’m. <b>Ответы:</b> Ex 6 — are, ’m, ’re, ’s, is, ’re. Ex 7 — are, am, are, is, is, are. Ex 9 — your, her, My, his, Your. Ex 10 — ’m eleven; are twelve; is sixteen; are ten. Ex 11 — is, am, are, is, are.<br><b>Look!:</b> проверить разницу your / you’re. <b>Ex 12:</b> пишет в тетради о себе и друзьях. <b>Ex 13:</b> стихотворение читаем по учебнику (с. 13), хлопаем ритм; колесо меняет имя и возраст.<br><b>Extra video activity (TB):</b> сыграть сцену 2 по ролям.'+hw(9)},
 '1.3':{name:'Dug’s family album · to be negative · Countries',short:'to be negative · Countries',blocks:b13,teach:'<b>Student’s Book с. 14–15 + Workbook с. 10. Grammar: to be negative. Vocabulary: countries and nationalities.</b><br><b>Warm-up (TB):</b> шесть предложений с пропуском am/are/is; потом спросить, кто может сделать их отрицательными.<br>'+
   '<b>Lead-in:</b> Who’s he? (Superdug.) Who’s she? (Kit.) Ввести family album, happy (покачать головой: Dug isn’t … happy!), hungry (потереть живот).<br><b>Ответы:</b> Ex 1 — восемь пород собак. Ex 2 — Spanish. Ex 3 — T, T, F, F, F.<br><b>Get Grammar:</b> формы you’re not / he’s not не вводим — это запутает.<br>'+
   'Ex 5 — Dug isn’t French. Kit isn’t a dog. Dug’s parents aren’t superheroes. I’m not happy. You aren’t in the photo, Dug. Dug isn’t hungry. Ex 7 — isn’t (She is Polish); isn’t (He is Italian); is; isn’t (He is Chinese); is. Ex 8 — We aren’t from Spain. We’re from the UK. / Granny Susie isn’t from France. She’s from the UK. / My cousins aren’t from the USA. They’re from China.<br>'+
   '<b>Ex 9:</b> Three Guesses — компьютер загадывает национальность, у ученика три попытки; потом поменяться: загадывает ученик, угадываете вы. <b>Finishing (TB):</b> неверные утверждения — ученик исправляет.'+hw(10)},
 '1.4':{name:'Nice to meet you! · Introductions',short:'Introductions',blocks:b14,teach:'<b>Student’s Book с. 16 + Workbook с. 11. Communication: making introductions.</b><br><b>Warm-up (TB):</b> отрицательные предложения о героях, одно ложное — True / False. Затем представьте ученику воображаемого гостя: X, this is Y. She’s my student.<br>'+
   '<b>Lead-in:</b> Who’s she? Where are they? Ввести neighbour (нарисовать два дома). <b>Culture note:</b> маму друга или учительницу в Британии называют Mrs + фамилия.<br><b>Ответы:</b> Ex 1 — Newman. Ex 3 — b, d, c, a. Ex 5 — c, b, b.<br><b>Ex 4:</b> разыграть диалог втроём (вы берёте две роли). <b>Ex 6:</b> знаменитость тоже отвечает: Nice to meet you too.<br><b>Extra activity (TB):</b> цепочка: Hello. I’m X. — Hello. I’m Y. This is X.'+hw(11)},
 '1.5':{name:'My family album · Reading · Places',short:'Family album · Places',blocks:b15,teach:'<b>Student’s Book с. 17 + Workbook с. 12. Reading: a text about family photos. Vocabulary: places.</b><br><b>Warm-up (TB):</b> представить знаменитость (как в 1.4, Ex 6). Спросить: Do you read blogs?<br>'+
   '<b>Lead-in:</b> по каждому фото — какие слова знаем, сколько лет людям. <b>Ex 1:</b> блог читаем в учебнике; подчеркнуть возраст Алисы в каждом абзаце (four, nine, eleven); fun, near, great — угадать по контексту.<br><b>Ответы:</b> Ex 2 — sister, French, Aunt, cousin, Dad. Ex 3 — T, F, T, F, T. Ex 5 — in the park, at school, on holiday, at a party, at home, in the garden. Ex 6 — d, f, b, e (аудио 1.29 озвучено голосом сайта).<br>'+
   '<b>Ex 7:</b> фото со с. 106: ученик описывает, вы угадываете; потом наоборот (блок «Which photo is it?»). Workbook: тексты «My photo album» читаем в тетради (с. 12). WB 1 — 1 B, 2 C, 3 A.'+hw(12)},
 '1.6':{name:'Best friends · Listening and Writing',short:'Best friends',blocks:b16,teach:'<b>Student’s Book с. 18 + Workbook с. 13. Listening: a radio show about friends. Writing: a text about a best friend; capital letters.</b><br><b>Warm-up (TB):</b> «испорченный телефон» со словами 1.5 — на экране слушаем слово и находим картинку. Вопрос на русском: почему друзья важны?<br>'+
   '<b>Ответы:</b> Ex 1 — о лучших друзьях. Ex 2 — Tom C, Maria B, Juan A. Ex 3 — 11; in the UK; two; Italy (аудио 1.30 озвучено голосом сайта). Ex 5 — Jen, 10, British, the UK; Lucas, 11, Spanish, Spain.<br><b>Ex 4:</b> опоры: Name, Age, Classmate / Neighbour / Family? <b>Writing:</b> сравнить правила с русским (национальности в русском — с маленькой). <b>Ex 7:</b> пишет в тетради: сначала устно по фразам с экрана.<br>'+
   'Workbook с. 13: Ex 1–2 идут по видео учебника — на сайте их нет, делаем Ex 3–5.'+hw(13)},
 '1.7':{name:'Language Revision · Unit 1',short:'Revision',blocks:b17,teach:'<b>Student’s Book с. 19 + Workbook с. 14–15 (Check yourself! и Word blog).</b><br><b>Warm-up (TB):</b> пять вопросов по юниту. <b>Lead-in:</b> какие уроки юнита понравились больше всего и почему?<br>'+
   '<b>Ответы:</b> Ex 1 — grandad, granny, uncle, aunt, mum, dad, cousin, sister, brother. Ex 2 — Chinese, Italian, American, China, the USA. Ex 3 — b, c, a. Ex 4 — /v/: зубы касаются нижней губы; /b/: губы вместе; скороговорку читаем по учебнику. Ex 5 — It’s Granny’s birthday. Jason is Megan’s son. Megan is Dad’s sister. Ex 6 — am, am, is, is, are, are. Ex 7 — c, d, e, a, b. Ex 9 — this, this, Nice, meet.<br>'+
   'Workbook: Ex 1 — aunt, father, brother, daughter, granny. Ex 2 — garden, American, school, France, home. Ex 3 — are, is, aren’t, are, ’m not. Ex 4 — His, Freddie’s, her, Nadia’s, Clara’s. Ex 5 — is, Hi, Nice, meet, too.<br><b>Finishing:</b> Check yourself! — ученик отмечает, что умеет.'+hw('14–15')}
};
Object.keys(T).forEach(id=>{const L=find(id);if(!L)return;const t=T[id];L.blocks=t.blocks.filter(Boolean);L.teach=t.teach;L.name=t.name;L.short=t.short;L.book=true;});
})();
