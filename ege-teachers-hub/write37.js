/* Тренажёр «Письмо 37» (электронное письмо личного характера).
   Содержание собрано из материалов учителя: критерии и стратегии из книги-пособия (с. 79–83), две презентации по заданию 37
   (алгоритм, лист самопроверки, дополнительная схема оценивания, упражнения, разбор писем, мифы), карточки вопросов,
   тренировка вопросов по темам, 30 вариантов для устной подготовки, письма о России, сборник писем.
   Сверено с методическими материалами ФИПИ (2026): объём, подсчёт слов, мостики, завершение письма, вопросы другу.
   Каждый раздел при открытии начинается с начала; сохраняется только черновик письма. */
const main=$('#main'),tabs=$('#tabs'),KEY='ege27k-w37';
const L0=window.W37||[],ABC=window.W37ABC||[],RU=window.W37RU||[],QB=window.W37QB||[];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const nz=s=>String(s).toLowerCase().replace(/[^a-z]/g,'');
const H=s=>esc(s).replace(/\n/g,'<br>');
const ul=a=>'<ul>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';

/* ================= ДАННЫЕ ================= */

/* Типовые задания из презентаций (с разбором и образцами) */
const PT=[
 {name:'Peter',g:'his',subject:'Environmental protection',body:'… I am doing a project on environmental protection. Are you and your friends interested in this problem and why/why not? What are some environmental problems in your country? How do you protect the environment in your city?\n… Yesterday was my father’s birthday …',about:'his father’s birthday',
  model:'Dear Peter,\n\nThank you very much for your letter. I’m always happy to hear from you.\n\nIn your email you asked me some questions about environmental protection and I’m ready to answer them now. My friends and I are interested in environmental protection because we want the world to have clean air and clean drinking water. Sorry to say, there are some environmental problems in our country. They are massive deforestation and water and air pollution. Like many other people in our city, I try to protect the environment. I don’t litter in the street, use water-saving devices and plant trees in spring.\n\nGive my best birthday wishes to your dad! Where did he celebrate his birthday? Did he invite many guests? What presents did he get for his birthday?\n\nThat’s all for now. Please, write back soon.\n\nYours,\nOlya'},
 {name:'Tom',g:'his',subject:'Famous water sights',body:'… Last week our family went to the famous Niagara Falls. It was my first visit there and it was fun! We enjoyed the weather and the splashes of falling water on our faces. It reminded us of our last rafting trip. Where can you see beautiful water sights in Russia, if at all? Have you ever gone rafting? What do you think about extreme sports in general?\n… By the way, we are going to Greece this summer …',about:'his trip to Greece',
  model:'Dear Tom,\n\nThank you for your recent letter. It was great to hear from you again.\n\nIn your letter you asked me about beautiful water sights in Russia. We have wonderful places in our country and waterfalls are among them. There are some in our Primorsky region, I was there last year. I’ve never gone rafting but I wish I could do it soon. I know that extreme sports are dangerous but I’m sure that everyone should experience it at least once in a lifetime.\n\nIn your letter you mention that you are going to Greece. I envy you! Who are you going to go with? What places do you want to visit? How long are you going to stay in Greece?\n\nSorry, I have to go now. Write back soon.\n\nBest wishes,\nKate'},
 {name:'Andrea',g:'her',subject:'Pocket money',body:'… My mum often complains that I spend too much money on shopping. To tell you the truth, I like to buy beautiful things and spend all my pocket money on small souvenirs. I collect souvenirs. Do you or your friends collect anything? What do you and your friends do with your pocket money and why? What’s your parents’ attitude towards it?\n… As for the latest news, I have just entered courses …',about:'her courses',
  model:'Dear Andrea,\n\nThank you for your email. I was happy to hear from you again.\n\nIn your message you show a deep interest in my hobbies. Personally, I collect small things and most of them are small figures of penguins. As for my friends, two of them have postcards and coins collections. I usually buy new items for my collection on my pocket money. Besides, I and my friends like spending our pocket money on clothes and snacks. My mother doesn’t like it and we often argue.\n\nIn your email you mention that you have just entered courses. What are the courses about? Where are they held? How often will you attend them?\n\nKeep in touch.\n\nBest wishes,\nKatya'},
 {name:'Tom',g:'his',subject:'Visiting museums',body:'… Last month our class went to Washington to visit the National Museum of American History. It was my first visit there and it was fun! How often do you go to museums with your class, if at all? Which museum is your favourite or what museum would you like to visit? Why do you think people should go there?\n… This summer we plan to go hiking with my parents …',about:'his summer plans',
  model:'Dear Tom,\n\nThank you for your letter. I am always glad to get letters from you. Sorry, I haven’t answered your letter at once. How are you?\n\nGlad to hear that last month you visited the National Museum of American History. As for me, I have never been there. But I would like to visit it someday. We usually go to museums with our class once in two months. Most of all I like the Tretyakov Gallery. I think people should often go to museums to broaden their outlook, to enjoy the beauty of the pictures and to learn more about Russian history and history of other nations.\n\nBy the way, where are you planning to go hiking? Will it be in June or July? How long are you going hiking?\n\nHope to hear from you soon.\n\nBest wishes,\nSveta'},
 {name:'Jason',g:'his',subject:'Inventions of the mankind',body:'… At school we are doing a project about inventions. What do you think is the greatest invention of the mankind and why do you think so? What inventions is Russia famous for? What future inventions will be like in your opinion?\n… As for the latest news, my sister has just got married …',about:'his sister’s wedding'},
 {name:'Amanda',g:'her',subject:'Favourite films',body:'… I love watching documentaries but my friends find them boring. What is your opinion about documentaries? Which do you prefer — documentaries or feature films and why? What is your favourite film and why do you like it?\n… As for the latest news, my family is going on a picnic at the weekend …',about:'the picnic'},
 {name:'Sam',g:'his',subject:'Dividing household duties',body:'… My younger sister doesn’t have any household duties and I don’t think it’s fair! How should household duties be divided among the family members, in your opinion? What do you do about the house to help your mother? Do you think it’s difficult to run a house, why or why not?\n… As for the latest news, yesterday I went to the cinema to see that new blockbuster …',about:'the new film'},
 {name:'Lynn',g:'her',subject:'The Day of Remembrance and Sorrow',body:'… I’m doing a project on “Holidays in Different Countries of the World”. I’ve learnt that in Russia, the Day of Remembrance and Sorrow is celebrated on June 22nd. Why is it important for Russian people? What else can you tell me about it? How is this day connected with the Great Patriotic War and Victory Day?\n… I’ve recently started learning some Russian words …',about:'her efforts to learn Russian words',
  model:'Dear Lynn,\n\nThanks for your email. I hope you’re doing well.\n\nIn your email you asked me about the Day of Remembrance and Sorrow in Russia. This day is closely connected with the Great Patriotic War and Victory Day because the war began on June 22, 1941, and ended in May 1945. May 9 is now celebrated as Victory Day. Millions of our fellow citizens died in the war, and this day reminds us of their courage and sacrifice. That’s why it is so important to Russians. Every year, memorial ceremonies and other events dedicated to the history of the war are held across the country on this day.\n\nBy the way, it’s great that you’ve started learning Russian. Do you use any apps or websites to learn Russian words? What helps you remember new words? What do you do to remember their spelling?\n\nWrite back soon.\n\nBest wishes,\nZhenya'}
];
const qOf=body=>(body.match(/[^.?!…]*\?/g)||[]).map(s=>s.trim());

/* Единый список писем для письма и банка */
const SRC={col:'Сборник писем',fipi:'Банк ФИПИ',abc:'30 вариантов',ru:'Письма о России',pt:'Типовые задания'};
const LETTERS=[];
L0.forEach(x=>LETTERS.push({key:'b'+x.id+x.name,name:x.name,g:x.g,subject:x.subject||x.topic,body:'…'+x.lead+' '+x.q.map(q=>q.t).join(' ')+'\n…'+x.trig+' …',qs:x.q.map(q=>q.t),about:x.about,ans:x.ans,ask:x.ask,model:x.model,mkey:'lt.'+x.id+'-'+x.name,src:x.src==='pdf'?'col':'fipi',tt:x.tt}));
ABC.forEach(a=>{const m=LETTERS.find(l=>l.qs.some(q=>nz(q)===nz(a.qs[0].t)));if(m)m.abc=a;else LETTERS.push({key:'a'+a.n,name:a.name,g:a.g,subject:a.subject,body:a.body,qs:a.qs.map(q=>q.t),about:a.about,abc:a,src:'abc'});});
RU.forEach((r,i)=>LETTERS.push({key:'r'+i,name:r.name,g:r.g,subject:r.title,body:r.body,qs:qOf(r.body),about:r.about,sup:r.sup,src:'ru'}));
PT.forEach((p,i)=>{const qs=qOf(p.body);if(LETTERS.some(l=>l.qs.some(q=>nz(q)===nz(qs[0]))))return;LETTERS.push(Object.assign({key:'p'+i,qs:qs,src:'pt'},p));});
LETTERS.forEach((l,i)=>l.n=i+1);

/* Типы вопросов друга (банк писем) */
const TYPES={
 habit:{n:'О себе: привычки и вкусы',c:'#2f6f9f',how:'Отвечай о себе в Present Simple: одна-две фразы с деталью.',fr:'I usually … · I’m keen on … · My favourite … is … because …'},
 country:{n:'О России и ровесниках',c:'#2c7f78',how:'Вопрос не о тебе: пиши о подростках, стране или своём регионе.',fr:'Most Russian teenagers … · In my country … · In my region …'},
 opinion:{n:'Мнение и причина',c:'#a8802a',how:'Нужна позиция и объяснение. Без because ответ неполный.',fr:'I think … because … · In my opinion, … · To my mind, …'},
 would:{n:'Would: мечты и советы',c:'#a0742c',how:'В вопросе would – в ответе тоже would. На «If you could …, what would …?» отвечай: If I could, I would … because …',fr:'I’d like to … because … · I’d advise you to … · If I were you, I’d …'},
 past:{n:'Прошлое и опыт',c:'#66549a',how:'Время как в вопросе: Past Simple или Present Perfect.',fr:'When I was a child, I … · I have never … · The last … I’ve … was …'},
 future:{n:'Планы и будущее',c:'#b0683a',how:'Планы – going to, прогноз – will.',fr:'I’m going to … · I’m planning to … · I think … will …'}
};
const TK=Object.keys(TYPES);
const ALLQ=[];L0.forEach(x=>x.q.forEach((q,i)=>ALLQ.push({t:q.t,k:q.k,d:q.d,lead:i===0?x.lead:'',ans:x.ans[i],ek:'lt.'+x.id+'-'+x.name+'.'+i+'.a',name:x.name})));
const CNT={};TK.forEach(k=>CNT[k]=ALLQ.filter(q=>q.k===k).length);const DBL=ALLQ.filter(q=>q.d).length;
const TENSE={past:['Уже случилось','Past Simple: Where did you …? What was …? Who gave you …?'],present:['Происходит сейчас','Present Simple или Continuous: What is … like? How often do you …? What are you …ing?'],future:['Ещё впереди','Future: When are you going to …? What will you …? Who is coming …?']};

/* Критерии ФИПИ (книга-пособие, с. 79) */
const CRIT=[
 ['К1 · Решение коммуникативной задачи',
  ['<b>Задание выполнено полностью:</b> содержание отражает все аспекты, указанные в задании (даны полные и точные ответы на все вопросы, заданы правильно 3 вопроса по указанной теме); стилевое оформление речи выбрано правильно с учётом цели высказывания и адресата; соблюдены принятые в языке нормы вежливости. <b>Допускается 1 неполный или неточный аспект.</b>',
   '<b>Задание выполнено не полностью:</b> содержание отражает не все аспекты, указанные в задании (все случаи, не указанные в оценивании на 2 балла и 0 баллов).',
   '<b>Задание не выполнено:</b> 3 и более аспекта содержания отсутствуют, ИЛИ 6 аспектов раскрыты неполно / неточно, ИЛИ 1 аспект не раскрыт и 4–5 раскрыты неполно / неточно, ИЛИ 2 аспекта не раскрыты и 2–4 раскрыты неполно / неточно, ИЛИ ответ не соответствует требуемому объёму.']],
 ['К2 · Организация текста',
  ['Высказывание логично; средства логической связи использованы правильно; текст верно разделён на абзацы; структурное оформление текста соответствует нормам, принятым в стране изучаемого языка. <b>Допускается 1 ошибка в организации текста.</b>',
   'Имеются 2–3 ошибки в организации текста.',
   'Имеются 4 и более ошибки в организации текста.']],
 ['К3 · Языковое оформление текста',
  ['Используемый словарный запас и грамматические структуры соответствуют базовому уровню сложности задания, орфографические и пунктуационные ошибки практически отсутствуют (<b>допускаются 1–2 лексико-грамматические ошибки И/ИЛИ 1–2 орфографические и пунктуационные ошибки</b>).',
   'Словарный запас и грамматические структуры не полностью соответствуют базовому уровню: имеются 3–4 лексико-грамматические ошибки И/ИЛИ 3–4 орфографические и пунктуационные ошибки.',
   'Словарный запас и грамматические структуры не соответствуют базовому уровню: имеются 5 и более лексико-грамматических ошибок И/ИЛИ 5 и более орфографических и пунктуационных ошибок.']]];
const ASPECTS=['Ответ на вопрос 1 дан','Ответ на вопрос 2 дан','Ответ на вопрос 3 дан','Три вопроса о … (тема из инструкции) заданы','Нормы вежливости соблюдены: благодарность за полученное письмо; надежда на последующие контакты','Стилевое оформление выбрано правильно: обращение, завершающая фраза, подпись автора в соответствии с неофициальным стилем'];
const ORGS=['Логичность','Деление на абзацы','Средства логической связи','Обращение на отдельной строке','Завершающая фраза на отдельной строке','Подпись на отдельной строке'];

/* Подсчёт слов */
const WC=[['can’t',1,'Краткая форма – одно слово.'],['I’m',1,'Краткая форма – одно слово.'],['2009',1,'Число цифрами – одно слово.'],['126 204',1,'Число цифрами – одно слово.'],['25%',1,'Число со знаком процента – одно слово.'],['twenty-five',1,'Сложное слово через дефис – одно слово.'],['one hundred',2,'Числительные словами считаются как слова.'],['good-looking',1,'Сложное слово – одно слово.'],['English-speaking',1,'Сложное слово – одно слово.'],['USA',1,'Сокращение – одно слово.'],['e-mail',1,'Сокращение – одно слово.'],['TV',1,'Сокращение – одно слово.'],['Dear Tom,',2,'Обращение тоже считается.'],['Best wishes,',2,'Завершающая фраза считается.'],['Anna',1,'Подпись тоже считается.'],['From: Tom@mail.uk',0,'Рамку и строки From / To / Subject не переписывают и не считают.']];

/* Части письма: порядок */
const PARTS=[['Обращение','Dear Kevin,','Hello Kevin, · Hi, Kevin, · Kevin,','На отдельной строке слева, после имени – запятая.'],
 ['Благодарность за письмо','Thanks a lot for your email. I’m happy to hear from you.','Thank you for your email. · Many thanks for the email! I hope you’re OK.','Новый абзац с заглавной буквы.'],
 ['Мостик к ответам','In your message you asked me some questions.','In your email you asked me about … · Now it’s time to answer your questions about …','Начало второго абзаца.'],
 ['Ответы на три вопроса','For a start, … Besides, … In addition, …','Полно, точно, в том же времени, логично связано.','На каждый вопрос – ответ; двойной вопрос – два ответа.'],
 ['Мостик к вопросам','Anyway, you mentioned the trip.','By the way, I’d like to ask you about … · Tell me more about …','Начало третьего абзаца.'],
 ['Три вопроса другу','Where …? How long …? Did you …?','Прямые, по теме, в нужном времени.','Не о том, что друг уже сообщил.'],
 ['Надежда на дальнейший контакт','Hope to hear from you soon.','Write back soon. · Keep in touch.','Отдельной строкой, в конце – точка.'],
 ['Завершающая фраза','Best wishes,','All the best, · Love, · Yours,','Отдельной строкой, после неё – запятая.'],
 ['Подпись','Anna','Только имя, без фамилии.','Отдельной строкой, без точки.']];

/* Фразы-опоры: карточки по частям письма */
const PHR=[
 ['Обращение / приветствие','Dear Kevin, · Hello Kevin, · Hello, Kevin, · Hi Kevin, · Hi, Kevin, · Kevin, · Hi,','После обращения – запятая. В книге есть ещё Hi! · Hello again! · Hi there! – но ФИПИ считает восклицательный знак в приветствии ошибкой («Hey, Kevin!»). На экзамене – с запятой.'],
 ['Благодарность за письмо','Thank you for your email. · Thanks a lot for your email / email message. I’m happy to hear from you. · Thanks for your email. I’m always glad to get emails from you. · Many thanks for the email! I hope you’re OK. · Thank you for your email. I’m happy to hear from you again. · Thanks for your recent email. · Thanks for your message. · Thanks for writing to me. · I was very glad to hear from you again. · I’m always glad to get messages from you. · Thanks for your email. I hope you’re doing well. / It was great to hear from you.','Можно ограничиться благодарностью или написать, что всегда рад письмам друга.'],
 ['Извинение, что долго не писал (необязательно)','Sorry for not writing for so long, I was busy with my studying. · I am sorry I haven’t written for so long but I’ve been really busy with … · I’m sorry I’ve taken such a long time to reply to your letter. · I really should have written sooner … · I must apologize for not writing earlier.','Необязательная часть: за её отсутствие балл не снижают.'],
 ['Ссылка на предыдущие контакты (необязательно)','It was great to hear from you again. · I’m always glad to get your letters. · It was good to hear from you.','Необязательна, но возможна – ошибкой не является. Не пиши «I was glad to receive your letter again» – получается, что одно письмо пришло дважды.'],
 ['Реакция на новость друга (необязательно)','It’s great news about … · I’m happy to learn about … · Glad to hear that …','Можно в первом абзаце или как мостик к вопросам.'],
 ['Мостик к ответам','In your email / email message you ask / asked me about … · In your email you ask / asked me several questions about … · Now it’s time to answer your questions about … · In your message you asked me some questions. · I’d like to answer your questions. · I’ll try to answer your questions. · I’m glad to answer your questions about …','ФИПИ: вводное Well, и By the way не годятся как переход от благодарности к ответам.'],
 ['Связки внутри ответов','For a start · Besides · Also · Truly enough · Then · In addition · Moreover · Furthermore · In my opinion · In any case · However · By the way','Ответы – единый текст, а не три разрозненных ответа.'],
 ['Мостик к вопросам','Anyway, you mentioned … · In your email / letter you write / wrote that … · Tell me more about … · By the way, I’d like to ask you about … · Now I’d like to ask you some questions. · In your email you mention that … · By the way, it’s great that you’ve started …','Голое «By the way,» и сразу вопросы – ошибка (ФИПИ). С днём рождения: Give my best birthday wishes to your dad! – congratulations для дня рождения не используют.'],
 ['Почему заканчиваю письмо (необязательно)','That’s all for now. · Sorry, I have to go now. · Anyway, I must go and get on with my work. · Sorry, my mum is calling me. · I guess it’s time I got on with that studying I’ve been avoiding.','Необязательно: за отсутствие балл не снижают.'],
 ['Надежда на дальнейший контакт','Hope to hear from you soon. · Write back soon. · Please, write to me soon. · Keep in touch. · Take care, and write again soon. · Looking forward to hearing from you.','Не годятся: I look forward to … (официальное письмо), I will write you soon, See you soon (это обещание, а не надежда) – ФИПИ.'],
 ['Завершающая фраза','Best wishes, · With best wishes, · All the best, · Love, · With love, · Lots of love, · Much love, · Hugs, · Yours,','Отдельной строкой, после неё – запятая. Только одна фраза: две подряд – логическая ошибка. Не годятся: Yours sincerely, Yours faithfully, Yours truly, Sincerely, Best regards.'],
 ['Подпись','Mary · Oleg · Anna','Только имя – без фамилии и отчества, отдельной строкой, без точки.']];

/* Сокращения в электронном письме */
const ABBR=[['ASAP','as soon as possible'],['B4','before'],['BBFN','bye bye for now'],['BFN','bye for now'],['BTW','by the way'],['F2F','face-to-face'],['4ever','forever'],['IDK','I don’t know'],['IMO','in my opinion'],['IMHO','in my humble opinion'],['IOW','in other words'],['J4F','just for fun'],['LOL','laughing out loud'],['NTM','not to mention'],['s/thing','something'],['TAFN','that’s all for now'],['THX','thanks'],['TYVM','thank you very much'],['TTYTT','to tell you the truth'],['Y/N','“yes or no” answer']];

/* Сортировка фраз по функциям */
const FUN=['Ссылка на предыдущие контакты*','Извинение, что не писал раньше*','Переход к ответам','Переход к вопросам','Надежда на контакты','Почему заканчиваю письмо*','Завершающая фраза'];
const SORT=[['Hope to hear from you soon.',4],['It was great to hear from you again.',0],['I’ll try to answer your questions.',2],['I am sorry I haven’t written for so long but I’ve been really busy with …',1],['Write back soon.',4],['I’m always glad to get your letters.',0],['All the best,',6],['I’m happy to learn about …',3],['It was good to hear from you.',0],['I’m sorry I’ve taken such a long time to reply to your letter.',1],['I guess it’s time I got on with that studying I’ve been avoiding.',5],['It’s great news about …',3],['Lots of love,',6],['I really should have written sooner …',1],['Keep in touch.',4],['Much love,',6],['Best wishes,',6],['Anyway, I must go and get on with my work.',5],['I must apologize for not writing earlier.',1],['Sorry, my mum is calling me.',5],['Take care, and write again soon.',4],['I’m glad to answer your questions about …',2]];

/* Правила: ответы на вопросы */
const RULES_A=[
 ['Полно и точно','На каждый вопрос – ответ. Точный – именно о том, о чём спрашивают; полный – на весь вопрос. ФИПИ: «The weather is nice» на вопрос о погоде летом – неполно и неточно: не сказано, где и когда.'],
 ['Двойной вопрос – два ответа','Where … and why? – отвечаем на ДВА вопроса. Why / why not – обязательно причина. «Are you and your friends interested …?» – ответ и о себе, и о друзьях. Каждая часть – отдельный аспект для эксперта.'],
 ['То же время','Отвечаем в том времени, в котором задан вопрос: из вопросительного предложения делаем утвердительное или отрицательное.'],
 ['Единый текст','Ответы логически связаны между собой – связки For a start, Besides, In addition, However … Начинать каждый ответ вводной фразой не нужно. Порядок ответов любой, легче – как в задании.'],
 ['Абзацы','Ответы можно дать в одном абзаце или в двух, но абзац не может состоять из одного простого предложения. Рекомендуется один абзац.'],
 ['«I don’t know» не принимается','Ответ «Я не знаю» считается нераскрытым. Если вопрос не требует обязательных знаний, можно: I don’t know but probably … / I guess … / I think … ФИПИ: «не знаю, какая погода во всех регионах – Россия огромная, но в моём городе летом …»'],
 ['Без отрицательных отписок','«Не знаю, какие писатели популярны», «любимого писателя у меня нет» – создают впечатление, что ты не хочешь продолжать переписку.'],
 ['Без лишнего','Не включай подробности не по заданию, особенно куски заученных топиков. Но отвечай развёрнуто: мнение + причина.'],
 ['Люди и книги','Имя и фамилия – правильно: Alexander Pushkin. Названия – по-английски: War and Peace, Crime and Punishment. «Voina i mir» другу ничего не скажет (ФИПИ).'],
 ['Места и блюда','Общепринятые названия: the Kremlin, Red Square, the Hermitage, the Bolshoi Theatre. Нет эквивалента – транслитерация с пояснением: Spasskoye-Lutovinovo is the place where … Блюда из словаря: blini, shashlik, borsch / borscht; иначе с пояснением: okroshka, a cold soup usually cooked in summer; solyanka – a spicy soup with many ingredients.'],
 ['Праздники','Точное название и дата. Хотя бы минимум об официальном праздновании: official (military) ceremonies, memorial events, festive concerts, flower-laying ceremonies … are held on this day. Различай официальное празднование и то, как проводят день семьи: spending time together, visiting relatives, going for a walk.'],
 ['Исторические даты','Точная дата: день, год. Не помнишь – хотя бы век; не помнишь место – хотя бы направление: on the north / south of Russia.'],
 ['Скрытые вопросы друга','Косвенные вопросы похожи на повествовательные предложения: I wonder …, I’d like to know … На них тоже нужно ответить (ФИПИ).'],
 ['Лексика и орфография','Сложная лексика не нужна – достаточно простой, но разнообразной. За формальную лексику балл за стиль не снижают: по стилю оценивают обращение, завершающую фразу и подпись. Британский или американский вариант – последовательно; одно слово в другом варианте – орфографическая ошибка.']];

/* Правила: вопросы другу */
const RULES_Q=[
 ['Строго по теме из инструкции','Тема – в строке «ask 3 questions about …» под письмом: в самом письме она может быть сформулирована не так чётко. Задание: о путешествии брата – вопрос «Сколько лет брату?» не засчитают.'],
 ['Время + ситуация','Правильный вопрос складывается из времени и ситуации. Уже случилось – Past; происходит или бывает регулярно – Present; впереди – going to / will.'],
 ['Не спрашивай известное','Вчера был день рождения отца – нельзя «When was your father’s birthday?». Друг идёт в поход с родителями летом – нельзя спрашивать, с кем и в какое время года.'],
 ['Три разных вопроса','Вопросы не должны дублировать друг друга по смыслу. Постарайся задавать вопросы разных типов.'],
 ['Только прямые вопросы','Непрямые – «Can you tell me about …?» – не примут. «I wonder how you travel around?» – ошибка: косвенный вопрос с вопросительным знаком.'],
 ['Неэтичные не примут','Никаких вопросов, которые неудобно задавать другу.'],
 ['Как построить вопрос','WH + do / does + подлежащее + глагол: Where does the group meet? · WH + did + подлежащее + глагол: Why did you join the group? · Am / Is / Are / Was / Were / Can / Will + подлежащее: Is membership free?'],
 ['Порядок слов','How you celebrated it? → How did you celebrate it? · What your present was? → What was your present? · What is about the film? → What is the film about? (ФИПИ: непонятный вопрос).'],
 ['О теме, а не об адресате','Вопрос должен быть о том, что названо в задании, а не о самом друге (ФИПИ: «последний вопрос задан не о дяде, а об адресате письма»).'],
 ['Развёрнутые и понятные','Вопросы должны быть развёрнутыми и понятными без письма друга.'],
 ['Отдельный абзац с мостиком','Вопросы – в третьем абзаце, перед ними мостик: Anyway, you mentioned … · Tell me more about … · By the way, I’d like to ask you about … Голое «By the way,» – ошибка.']];

/* Вопрос верный или с ошибкой */
const JUDGE=[
 ['… Yesterday was my father’s birthday …','his father’s birthday','When was your father’s birthday?',0,'Ответ уже есть в письме: день рождения был вчера.'],
 ['… Yesterday was my father’s birthday …','his father’s birthday','Where did he celebrate his birthday?',1,'По теме, в прошедшем времени, спрашивает новое.'],
 ['… This summer we plan to go hiking with my parents …','his summer plans','Will you go with your class or with your parents?',0,'Друг уже написал, что идёт с родителями.'],
 ['… This summer we plan to go hiking with my parents …','his summer plans','Where are you planning to go hiking?',1,'По теме, о будущем, новая информация.'],
 ['… My elder brother is going to Nepal next month …','his brother’s trip to Nepal','How old is your brother?',0,'Вопрос о брате, а не о его поездке.'],
 ['… My elder brother is going to Nepal next month …','his brother’s trip to Nepal','Who is your brother going to travel with?',1,'О поездке, в будущем времени.'],
 ['… I’m going to a summer arts camp in August …','the summer arts camp','Can you tell me about the camp?',0,'Непрямой вопрос – не примут.'],
 ['… I’m going to a summer arts camp in August …','the summer arts camp','What activities does it offer?',1,'Прямой вопрос по теме.'],
 ['… Last weekend my friends and I visited an arts exhibition …','the exhibition','What will you see at the exhibition?',0,'Выставка уже была: вопрос в будущем времени не примут.'],
 ['… Last weekend my friends and I visited an arts exhibition …','the exhibition','What kind of art was on display at the exhibition?',1,'Прошедшее время, по теме.'],
 ['… Yesterday my friends and I went to the cinema to watch a new film …','the new film','What is about the film?',0,'Порядок слов делает вопрос непонятным. Верно: What is the film about?'],
 ['… You’ve mentioned that it was your mother’s birthday last week …','your mother’s birthday','How you celebrated it?',0,'Нет вспомогательного глагола. Верно: How did you celebrate it?'],
 ['… I’ve recently started learning some Russian words …','her efforts to learn Russian words','Do you use any apps or websites to learn Russian words?',1,'По теме, Present Simple – учит сейчас.'],
 ['… By the way, we are going to Greece this summer …','his trip to Greece','Do you like travelling?',0,'Вопрос об адресате, а не о поездке в Грецию.'],
 ['… I’ve got a new pet …','her new pet','What is your pet’s name?',1,'По теме, новая информация.'],
 ['… We have two new classmates. They have just moved to our town …','her new classmates','Where are your new classmates from?',1,'По теме: откуда они, в письме не сказано.']];

/* Найди ошибку: фрагменты писем */
const FRAG=[
 ['Dear John Smith,\nI’m glad to get your letter. In your letter you ask me questions about my plans for the future.','1) Обращение – только имя: Dear John. 2) Нарушено деление на абзацы: «In your letter you ask me …» – со следующего абзаца.'],
 ['Dear Tom,\nThank you for writing me back. It looks like you had a fun time there.','Ошибок нет.'],
 ['That is all for now. Hope to hear from you soon.\nYours sincerely.\nKate','Нарушен стиль: Yours sincerely – для официальной, а не личной переписки.'],
 ['Looking forward to hearing from you soon.\nLove,\nPetr Ivanov','Нарушен стиль подписи: только имя – Petr.'],
 ['Dear Ann Smith,\nI am happy to inform you that I received your letter yesterday.','Обращение – только имя: Dear Ann; нет благодарности; «I am happy to inform you …» – фраза официального письма.'],
 ['Zagorodnaya street.\nKanakovo\nRussia\n\nDear Peter,\nI was glad to receive your letter again.','1) Адрес и дата в электронном письме не нужны. 2) «I was glad to receive your letter again» – нелогично: одно письмо получено дважды. Верно: I was happy to hear from you again. / I’m always glad to receive your letters. / Thank you for your letter.'],
 ['Write back soon. Love,\nOlga','Завершающая фраза Love, – на отдельной строке.'],
 ['Samara\nRussia\nDear Ann, How are you? As for me, I am well.','Адрес не нужен; обращение – на отдельной строке; нет благодарности или радости от получения письма.'],
 ['Thanks for your letter. I haven’t heard from you for ages. Unfortunately, there aren’t many rivers in Russia, let alone waterfalls. The most famous one is the Volga river. It is the largest river in Russia. I have gone rafting once with my mother. It was awesome!','1) Деление на абзацы: «Unfortunately, there aren’t many rivers …» – с нового абзаца. 2) «It is the largest river in Russia» – фактическая ошибка.'],
 ['Russia,\nTula\n12.04.15\nDear Mary, I was happy to receive your letter yesterday.','Адрес и дата не нужны; обращение – на отдельной строке.'],
 ['I hope to hear from you soon.\nBye, Peter','Завершающая фраза Bye и подпись Peter – на отдельных строках.'],
 ['Write to me soon,\n\nLove\n\nKate.','Write to me soon. – точка вместо запятой; Love, – нужна запятая; Kate – без точки.'],
 ['I wonder how you travel around? What is the most cheap kind transport? What is the traffic situation alike in your town?','I wonder how you travel around the town. · What is the cheapest means of transport? · What is the traffic situation like in your town?'],
 ['You’ve mentioned that it was your mother’s birthday last week. How you celebrated it? What your present was? Your mother liked it?','How did you celebrate it? What was your present? Did your mother like it?']];
const GREET=[['Dear Richard,',1],['Dear Madam,',0],['Dear Aunt Mary,',1],['Dear Mr Fountain,',0],['Dear Alice,',1],['To whom it may concern',0],['Dear Sir,',0],['Dear Editor,',0],['Dear Mike,',1],['Dear, Mike,',0],['Hello, Mike,',1],['Hello Mike',0],['Dear Mike!',0],['Hi, Ann,',1],['Hi, Mike!',0],['Good day, Mary!',0]];
const CLOSE=[['Yours faithfully,',0],['Love,',1],['Yours sincerely,',0],['Best wishes,',1],['Yours,',1],['Much love,',1],['All the best,',1],['Yours truly,',0],['Sincerely,',0],['Best regards,',0],['Lots of love,',1],['With best wishes,',1]];
const SVETA={task:PT[3],letter:'12 Pushkin Str.\nMoscow\nRussia\n\nDear Tom Brown,\nThank you for your letter. Sorry, I haven’t answered your letter at once. How is your health? How is your mother? I hope you are well.\nGlad to hear that last month you went to Washington to visit the National Museum of American History. As for me, I have never been there. But I would like to visit it some day. We usually go to the museums with our class once in two months. Last summer we went to Moscow and visited a lot of different museums. Most of all I liked the Tretyakov Gallery. Now it’s my favourite museum. I want to be a painter, that’s why it’s important for me to see the pictures of famous Russian artists. I think people should often go to museums to broaden their outlook, to discover something new, to enjoy the beauty of the pictures and to learn better our history and history of different nations.\nWhen are you planning to go hiking? Will you go with your class or with your parents? Will it be in June or July?\nSorry, my mum is calling me. I must finish my letter.\nHope to here from you soon,\nBest wishes\nSveta',
 fix:['В электронном письме не нужно указывать адрес и дату.','Ссылка на предыдущие контакты и фраза «Sorry, my mum is calling me» необязательны. Письмо большое по объёму (хотя и в пределах требований) – рекомендуется удалить одну из этих фраз.','В обращении – только имя, фамилия не нужна.','Вопросы: заданы те, ответ на которые уже есть в письме друга – с кем поедет (с родителями) и когда (летом). «Will it be in June or July?» к тому же дублирует вопрос «когда?».','Лексико-грамматические ошибки: How is your health? → How are you?; не нужен артикль: go to museums; вместо different лучше other.','Орфография и пунктуация: some day → someday, here → hear. После фразы о надежде на контакты – точка, после завершающей фразы – запятая.']};

/* Мифы и вопросы на понимание */
const MYTH=[
 ['На вопрос можно ответить «I don’t know».',0,'Нет. Ответ считается нераскрытым. Допустимо только с дополнением: I don’t know but probably … / I guess … / I think …'],
 ['Каждый ответ нужно начинать с вводной фразы.',0,'Нет. Письмо – единый текст. Но абзац с ответами и абзац с вопросами начинаются с обязательных мостиков.'],
 ['Чтобы получить высокий балл, нужна сложная лексика.',0,'Нет. Достаточно простой, но разнообразной лексики.'],
 ['За формальную лексику снижают балл.',0,'Нет. По стилю оцениваются обращение, завершающая фраза и подпись.'],
 ['Письмо нужно писать печатными буквами.',0,'Нет. Можно своим почерком, главное – разборчиво.'],
 ['Предложение можно начать с And или But.',1,'Да, внутри абзаца. Начинать с них абзац не следует.'],
 ['Нужно переписать рамку From / To / Subject и поставить дату.',0,'Нет. Рамку, адрес и дату не пишут – это ошибка в организации текста. Начинай с № 37 и обращения.'],
 ['Полные формы (I have, do not) в личном письме – ошибка.',0,'Нет. Краткие формы характерны для неофициального стиля и рекомендуются, но полные ошибкой не считаются.'],
 ['Ссылка на предыдущие контакты обязательна.',0,'Нет. Она необязательна, но и ошибкой не является.'],
 ['Извинение или объяснение, почему заканчиваешь письмо, обязательно.',0,'Нет. За их отсутствие балл не снижается.'],
 ['Отвечать на вопросы нужно строго по порядку.',0,'Нет. Порядок любой, но текст должен быть логичным. Легче – как в задании.'],
 ['Ответы на вопросы можно разделить на два абзаца.',1,'Да. Но абзац с ответами не должен состоять из одного простого предложения.'],
 ['«I look forward to hearing from you» подходит для личного письма.',0,'Нет. ФИПИ: формула I look forward to … – только для официального письма.'],
 ['«See you soon» и «I will write you soon» – это надежда на контакт.',0,'Нет. Это обещание автора, а не выражение надежды (ФИПИ).'],
 ['Британское и американское написание можно смешивать.',0,'Нет. Вариант выбирают один; отдельное слово в другом варианте – орфографическая ошибка.'],
 ['Можно поставить две завершающие фразы подряд.',0,'Нет. Две формулы прощания перед подписью – логическая ошибка.'],
 ['Congratulations подходит, чтобы поздравить с днём рождения.',0,'Нет. Congratulate / congratulations – только с достижением. С днём рождения: Give my best birthday wishes to your dad!'],
 ['Абзацы можно выделить красной строкой, пропуском строки или и тем и другим.',1,'Да, допустим любой из трёх вариантов.'],
 ['После имени в обращении ставят восклицательный знак, как в русском.',0,'Нет. После обращения – запятая: Dear Mike,'],
 ['Если слов меньше 90, проверят только содержание.',0,'Нет. Меньше 90 слов – задание не проверяют, 0 баллов.']];
const THEORY=[
 ['Какие части письма связаны с нормами вежливости?','Благодарность за письмо, ссылка на предыдущие контакты, ссылка на будущие контакты.'],
 ['В каких частях письма ярче всего виден неофициальный стиль?','Обращение, завершающая фраза, подпись.'],
 ['Полные или краткие формы глаголов характерны для личного письма?','Краткие (I’ve, didn’t, he’ll) – их рекомендуется употреблять, но полные формы ошибкой не считаются.'],
 ['Какие части обязательны во вступлении, основной части и заключении?','Вступление – обращение, благодарность (ссылка на предыдущие контакты – по желанию). Основная часть – ответы на 3 вопроса друга и 3 вопроса другу. Заключение – ссылка на будущие контакты, завершающая фраза, подпись.']];

/* Самопроверка */
const SELF=['Количество слов – не менее 90 и не более 154.','Письмо начинается с обращения (адрес и дата не нужны, рамку не переписываю).','Обращение (Dear / Hi / Hello + имя) отделено запятой.','Абзацы выделены красной или пропущенной строкой.','Выражена благодарность за полученное письмо и/или радость от его получения.','Есть ответы на все вопросы друга – полные и точные, на обе части двойных вопросов.','В отдельном абзаце, после мостика, заданы три вопроса другу.','Вопросы – строго о теме из инструкции, в нужном времени, не о том, что друг уже сообщил, не повторяют друг друга.','Выражена надежда на продолжение общения.','Есть одна стандартная завершающая фраза, после неё – запятая.','Подпись – только имя, на отдельной строке, без точки.','Текст логичен, средства связи использованы правильно, текст верно разделён на абзацы.','Нет лексических, грамматических, орфографических и пунктуационных ошибок.','Работа заняла не более 20 минут.'];

/* Алгоритм выполнения (презентация, 13 шагов) */
const ALGO=['Внимательно прочитайте инструкцию. Она состоит из двух частей: одна – до письма-стимула, вторая – после него. Не потеряйте часть задания под письмом. Изучите критерии и дополнительную схему оценивания.','Распределите 20 минут: до 3 минут – анализ задания и план (на английском, ни в коем случае не по-русски), 2–3 минуты – список слов и выражений, 12–13 минут – письмо, 2–3 минуты – проверка.','С планом и списком выражений черновик не понадобится: нужно просто превратить словосочетания в законченные предложения.','План вырастает из письма-стимула: выпишите 3 вопроса друга, затем – о чём должны быть ваши вопросы (или сразу напишите их).','Набросайте список полезных слов и выражений.','Перечитайте письмо-стимул и сверьте с планом.','Начните с номера задания – № 37. На новой строке слева – обращение к другу (имя из задания) и запятая, ни в коем случае не восклицательный знак.','В первом абзаце поблагодарите друга за письмо и/или выразите радость от его получения.','Второй абзац – ответы на вопросы друга; в начале – связующая фраза: I’d like to answer your questions.','Третий абзац – вопросы другу по теме из инструкции; перед ними – связующая фраза: Now I’d like to ask you some questions.','В конце – надежда на последующее общение (Write back soon), завершающая фраза и подпись – только имя.','Делите письмо на абзацы: красная строка или пустая строка между абзацами при ровном левом крае.','Проверьте письмо, сверяя с письмом-стимулом, по листу самопроверки.'];

/* Разбор писем по шагам */
const WALK={
 lynn:{task:PT[7],title:'Lynn · 10 шагов',steps:[
  ['Шаг 1. Выделяем главное','Внимательно читаем задание и выделяем: 1) тему письма, 2) три вопроса, 3) завершение письма-стимула, 4) то, о чём нужно задать три вопроса другу.',''],
  ['Шаг 2. Нумеруем вопросы','Нумеруем вопросы и выделяем в них важные слова – так не пропустим ни один. 1. Why is it important for Russian people? 2. What else can you tell me about it? 3. How is this day connected with the Great Patriotic War and Victory Day?',''],
  ['Шаг 3. Обращение и благодарность','Пишем номер задания, обращение (запятая) и благодарность за письмо и/или радость от его получения. Обязательно: обращение и благодарность. Необязательно, но можно: извинение, что долго не писал, реакция на письмо-стимул, ссылка на предыдущие контакты. Рамку не переписываем, дату не пишем.','Dear Lynn,\n\nThanks for your email. I hope you’re doing well.'],
  ['Шаг 4. Мостик к ответам','«Мостик» к основной части – по теме из задания.','\n\nIn your email you asked me about the Day of Remembrance and Sorrow in Russia.'],
  ['Шаг 5. Ответы','Точные (именно о том, о чём спрашивают) и полные (на каждый вопрос целиком). Порядок любой, но текст логичный: здесь сначала вопрос 3, потом 1, потом 2. Один абзац или два, но не одно простое предложение. Абзацы – красная строка, пропуск строки или и то и другое.',' This day is closely connected with the Great Patriotic War and Victory Day because the war began on June 22, 1941, and ended in May 1945. May 9 is now celebrated as Victory Day. Millions of our fellow citizens died in the war, and this day reminds us of their courage and sacrifice. That’s why it is so important to Russians. Every year, memorial ceremonies and other events dedicated to the history of the war are held across the country on this day.'],
  ['Шаг 6. Мостик к вопросам','«Мостик» к абзацу с вопросами другу.','\n\nBy the way, it’s great that you’ve started learning Russian.'],
  ['Шаг 7. Три вопроса','Три вопроса точно по заданию – об усилиях Lynn выучить русские слова.',' Do you use any apps or websites to learn Russian words? What helps you remember new words? What do you do to remember their spelling?'],
  ['Шаг 8. Надежда на контакты','Извинение или объяснение, почему заканчиваешь письмо, необязательно – за их отсутствие балл не снижают.','\n\nWrite back soon.'],
  ['Шаг 9. Завершение и подпись','Завершающая фраза (с запятой) и подпись (только имя, без точки).','\n\nBest wishes,\nZhenya'],
  ['Шаг 10. Проверка','Перечитываем, считаем слова, проверяем ошибки. Здесь 150 слов: больше 140, но меньше 154 – допустимо.','']]},
 peter:{task:PT[0],title:'Peter · с комментарием',steps:[
  ['1. План на полях','Подчеркни ключевые слова в вопросах и запиши на полях слова для ответа (номера – как в дополнительной схеме оценивания): 1 – we are interested in environmental protection · clean air · clean drinking water; 2 – massive deforestation · water and air pollution; 3 – don’t litter in the street · use water-saving devices · plant trees in spring; 4 – Where did he celebrate his birthday? Did he invite many guests? What presents did he get for his birthday?',''],
  ['2. Обращение и благодарность','№ 37, с новой строки – обращение (только имя, запятая), со следующего абзаца с большой буквы – благодарность. Ссылка на предыдущие контакты не обязательна, но возможна. Абзацы – красная строка или пропуск строки.','Dear Peter,\n\nThank you very much for your letter. I’m always happy to hear from you.'],
  ['3. Ответы','Начни абзац с фразы-связки; уместно выразить готовность ответить. В первом вопросе скрыты два: «Are you and your friends …» и «and why / why not». Нет ответа о друзьях или о причине – ответ неполный, балл по К1 снизят. Ответы на все три вопроса рекомендуется давать в одном абзаце. Краткие формы рекомендуются, полные – не ошибка.','\n\nIn your email you asked me some questions about environmental protection and I’m ready to answer them now. My friends and I are interested in environmental protection because we want the world to have clean air and clean drinking water. Sorry to say, there are some environmental problems in our country. They are massive deforestation and water and air pollution. Like many other people in our city, I try to protect the environment. I don’t litter in the street, use water-saving devices and plant trees in spring.'],
  ['4. Переход к вопросам','Просто «By the way, …» и вопросы – не вполне вежливо и логично. Уместно передать поздравление папе друга, но congratulate / congratulations – только с достижением. Универсальная формула – best wishes.','\n\nGive my best birthday wishes to your dad!'],
  ['5. Вопросы','Разные по типу, точно по заданию, в прошедшем времени: день рождения был вчера. Нельзя спрашивать то, что уже известно: When was your father’s birthday?',' Where did he celebrate his birthday? Did he invite many guests? What presents did he get for his birthday?'],
  ['6. Завершение','Подходящая завершающая фраза, надежда на продолжение общения, подпись – только имя, без точки.','\n\nThat’s all for now. Please, write back soon.\n\nYours,\nOlya'],
  ['7. Проверка','Пересчитай слова: здесь 140 – в норме. Проверь грамматику, лексику, орфографию и средства логической связи.','']]},
 tom:{task:PT[1],title:'Tom · по частям',steps:[
  ['1. Что нужно сделать?','Прочитай задание. На какие вопросы нужно ответить и о чём спросить? Ответь вслух, потом читай дальше. Вопрос 1 – где в России есть красивые водные достопримечательности. Вопрос 2 – приходилось ли сплавляться на плоту. Вопрос 3 – что думаешь об экстремальных видах спорта. Спросить – о поездке в Грецию, которая ещё впереди.',''],
  ['2. Начало письма','Всё, что пишется до ответов: обращение и благодарность.','Dear Tom,\n\nThank you for your recent letter. It was great to hear from you again.'],
  ['3. Ответы','Мостик и ответы на три вопроса.','\n\nIn your letter you asked me about beautiful water sights in Russia. We have wonderful places in our country and waterfalls are among them. There are some in our Primorsky region, I was there last year. I’ve never gone rafting but I wish I could do it soon. I know that extreme sports are dangerous but I’m sure that everyone should experience it at least once in a lifetime.'],
  ['4. Вопросы другу','Мостик и три вопроса о поездке – в будущем времени.','\n\nIn your letter you mention that you are going to Greece. I envy you! Who are you going to go with? What places do you want to visit? How long are you going to stay in Greece?'],
  ['5. Завершение','Надежда на контакты, завершающая фраза, подпись.','\n\nSorry, I have to go now. Write back soon.\n\nBest wishes,\nKate']]},
 andrea:{task:PT[2],title:'Andrea · допиши',steps:[
  ['Начало дано','Прочитай задание и начало письма. Допиши письмо устно, потом сравни с образцом по частям.','Dear Andrea,\n\nThank you for your email. I was happy to hear from you again.'],
  ['Ответы','Мостик и ответы: собирают ли что-то ты и друзья; на что тратите карманные деньги и почему; как к этому относятся родители.','\n\nIn your message you show a deep interest in my hobbies. Personally, I collect small things and most of them are small figures of penguins. As for my friends, two of them have postcards and coins collections. I usually buy new items for my collection on my pocket money. Besides, I and my friends like spending our pocket money on clothes and snacks. My mother doesn’t like it and we often argue.'],
  ['Вопросы о курсах','Мостик и три вопроса о курсах.','\n\nIn your email you mention that you have just entered courses. What are the courses about? Where are they held? How often will you attend them?'],
  ['Завершение','','\n\nKeep in touch.\n\nBest wishes,\nKatya']]}};

/* Шаблон из книги (с. 83) */
const TEMPLATE='Dear X,\n\nThank you for your email. Sorry for not writing for so long, I was busy with my project.\n\nIn your message you asked me some questions. Well, 1) … … … 2) … … 3) In addition, …\n\nAnyway, you mentioned (the vacations). 1) … … … … 2) … … … … 3) … … … …\n\nSorry, I have to go now. Looking forward to hearing from you.\n\nBest wishes,\nYour name';

/* ================= КАРКАС ================= */
const SECT=[
 ['Правила'],
 ['task','Задание и баллы',0],['struct','Структура письма',0],['phr','Фразы-опоры',0],['answ','Ответы на вопросы',0],['ques','Вопросы другу',0],['err','Найди ошибку',0],['myth','Мифы и проверь себя',0],
 ['Разбор'],
 ['walk','Письмо по шагам',0],
 ['Практика'],
 ['oral','Устно · 30 вариантов',0],['russia','Письма о России',0],['qbank','Задай 3 вопроса',0],['write','Пишу письмо',20],['bank','Банк писем',0],['check','Самопроверка и баллы',0]];
const SEC=SECT.filter(s=>s.length===3);
let cur=0,sub={};
const S={};/* состояние разделов; сбрасывается при открытии страницы */
function paintTabs(){tabs.innerHTML='';let k=0;SECT.forEach(s=>{if(s.length===1){tabs.append(el('div','sgrp',s[0]));return;}const i=k++;const b=el('button','sbtn'+(i===cur?' on':''),'<i>'+(i+1)+'</i><span>'+s[1]+'</span>');b.type='button';b.onclick=()=>go(i);tabs.append(b);});}
function go(i,keep){cur=i;if(!keep)sub[SEC[i][0]]=sub[SEC[i][0]]||0;Clock.set(SEC[i][2]*60);redraw();}
function redraw(){paintTabs();main.innerHTML='';VIEW[SEC[cur][0]]();}
function goTo(id){const i=SEC.findIndex(s=>s[0]===id);if(i>=0)go(i);}
/* верхняя строка раздела: заголовок, вкладки, источник */
function hdr(title,segs,src){const t=el('div','top');t.append(el('h1',null,title));const id=SEC[cur][0];
  if(segs){const g=el('div','seg');segs.forEach((n,i)=>{const b=el('button','segb'+((sub[id]||0)===i?' on':''),n);b.type='button';b.onclick=()=>{sub[id]=i;redraw();};g.append(b);});t.append(g);}
  if(src)t.append(el('span','src',src));main.append(t);return sub[id]||0;}
function body(cls){const b=el('div','body'+(cls?' '+cls:''));main.append(b);return b;}
function panel(cls,h){const p=el('div','panel'+(cls?' '+cls:''),h||'');return p;}
function overlay(title,node){const ov=el('div','overlay'),t=el('div','teach');t.append(el('h4',null,title));if(typeof node==='string')t.append(el('div',null,node));else t.append(node);t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
/* переворачивающаяся карточка */
function flip(front,back,cls,label){const f=el('div','flip'+(cls?' '+cls:'')),inn=el('div','in');inn.append(el('div','fa',front+'<span class="fl">'+(label||'нажми, чтобы перевернуть')+'</span>'),el('div','fb',back));f.append(inn);f.onclick=()=>{f.classList.toggle('on');fitFlip(f);};setTimeout(()=>fitFlip(f),0);return f;}
/* высота карточки – по видимой стороне */
function fitFlip(f){if(!f.isConnected)return;const face=f.querySelector(f.classList.contains('on')?'.fb':'.fa');f.style.height='';const base=f.offsetHeight,need=face.scrollHeight;if(need>base+1)f.style.height=need+'px';}
/* карточки по страницам: n на экран */
function pager(items,per,make,host,key,cols){S[key]=S[key]||0;const pages=Math.ceil(items.length/per);if(S[key]>=pages)S[key]=0;
  const g=el('div','cards');g.style.setProperty('--n',cols||Math.min(per,4));items.slice(S[key]*per,S[key]*per+per).forEach((x,i)=>g.append(make(x,S[key]*per+i)));
  const nav=el('div','row');nav.append(btn('← Назад',()=>{S[key]=(S[key]-1+pages)%pages;redraw();},'sm'),el('b',null,(S[key]+1)+' / '+pages),btn('Вперёд →',()=>{S[key]=(S[key]+1)%pages;redraw();},'sm'));
  host.append(g,nav);return g;}
/* карточка Quizlet: одна карточка, переворот, стрелки, счётчик */
function quizlet(deck,key,front,back){S[key]=S[key]||{i:0,on:false,order:deck.map((x,i)=>i)};const st=S[key],w=el('div','qz'),c=el('div','qzcard'+(st.on?' on':'')),inn=el('div','in');const x=deck[st.order[st.i]];
  inn.append(el('div','fa',front(x)),el('div','fb',back(x)));c.append(inn);c.onclick=()=>{st.on=!st.on;c.classList.toggle('on',st.on);};
  const nav=el('div','qznav');const mv=d=>{st.i=(st.i+d+deck.length)%deck.length;st.on=false;redraw();};
  nav.append(btn('←',()=>mv(-1)),el('span','cnt',(st.i+1)+' / '+deck.length),btn('→',()=>mv(1)),btn('Перемешать',()=>{st.order=shuffle(st.order);st.i=0;st.on=false;redraw();},'sm'));
  w.append(c,nav);return w;}
/* задание в формате КИМ */
function kim(x,marks){const q=x.qs||[];let b=esc(x.body);if(marks)q.forEach((s,i)=>{b=b.replace(esc(s),'<mark class="q"><sup>'+(i+1)+'</sup> '+esc(s)+'</mark>');});b=b.replace(/\n/g,'<br>');
  return '<div class="kim"><p class="task">You have received an email message from your English-speaking pen-friend '+esc(x.name)+':</p><div class="stim"><div class="hd">From: '+esc(x.name)+'@mail.uk<br>To: Russian_friend@ege.ru<br>Subject: '+esc(x.subject)+'</div>'+b+'</div><p class="task">Write an email to '+esc(x.name)+'.<br>In your message:<br>– answer '+x.g+' questions;<br>– ask 3 questions about '+(marks?'<mark>'+esc(x.about)+'</mark>':esc(x.about))+'.</p><p class="task">Write 100–140 words.<br>Remember the rules of email writing.</p></div>';}
const model=x=>x.model?(x.mkey?ED.t(x.mkey+'.model',x.model):esc(x.model)):'';

/* ================= РАЗДЕЛЫ ================= */
const VIEW={};

/* 1. Задание и баллы */
VIEW.task=function(){
  const s=hdr('Задание и баллы',['Задание и время','Критерии К1–К3','Объём и подсчёт слов'],'Критерии ФИПИ · максимум 6 баллов');
  if(s===0){const b=body(),a=panel('w40'),m=panel('grow'),r=panel('w30');
    a.innerHTML='<h3>Как устроено задание</h3>'+kim(PT[0],true)+'<p class="note">Инструкция из двух частей: до письма-стимула и после него. Не потеряй часть под письмом – там тема твоих вопросов.</p>';
    m.innerHTML='<h3>Что нужно сделать</h3><p>Написать <b>связный, логичный текст</b> – письмо другу по переписке: точно, полно и развёрнуто ответить на его вопросы и запросить информацию – задать 3 вопроса. Ключевая задача – не «ответить на 3 вопроса», а <b>написать письмо</b>.</p>'+
     '<h4>Разметка задания</h4><ol><li>Выдели тему письма.</li><li>Пронумеруй три вопроса и подчеркни в них важные слова.</li><li>Найди завершение письма-стимула – новость друга.</li><li>Выдели, о чём задать три вопроса: строка «ask 3 questions about …».</li></ol>'+
     '<h4>Стратегии</h4><ol><li>Считать слова: минимум 90, максимум 154.</li><li>Найти и отметить ВСЕ вопросы и логично, связно ответить на них.</li><li>Задать три прямых вопроса по стимулу из задания – ask 3 questions about ___.</li><li>Неофициальный стиль, формат электронного письма, нормы вежливости.</li></ol>';
    r.innerHTML='<h3>Время</h3><p>По инструкции – <b>20 минут</b>:</p><div class="kv"><span class="tag">до 3 мин</span><span>анализ задания и план – на английском</span><span class="tag">2–3 мин</span><span>список слов и выражений</span><span class="tag">12–13 мин</span><span>письмо</span><span class="tag">2–3 мин</span><span>проверка</span></div><p class="note" style="margin-top:6px">С планом и списком выражений черновик не нужен. Книга-пособие советует на экзамене уложиться в 10–15 минут.</p><h3>Бланк</h3><p>Ответ – в бланке ответов № 2: номер задания (37), затем письмо, начиная с обращения. Писать разборчиво; ошибку – аккуратно зачеркнуть и надписать.</p>';
    r.append(btn('Алгоритм полностью · 13 шагов',()=>overlay('Алгоритм выполнения задания 37',el('ol',null,ALGO.map(x=>'<li>'+x+'</li>').join(''))),'main'));
    b.append(a,m,r);return;}
  if(s===1){const b=body('col'),t=panel('grow');let h='<table class="crit"><tr><th>Баллы</th>'+CRIT.map(c=>'<th>'+c[0]+'</th>').join('')+'</tr>';[0,1,2].forEach(r=>{h+='<tr><td>'+(2-r)+'</td>'+CRIT.map(c=>'<td>'+c[1][r]+'</td>').join('')+'</tr>';});h+='</table>';
    t.innerHTML=h+'<div class="row" style="margin-top:6px;align-items:flex-start"><div class="warn" style="flex:1"><b>Примечания.</b> 1) 0 баллов по К1 – 0 за всё задание. 2) Правильное использование средств логической связи предполагает обязательные логические связки-переходы между частями письма.</div><div class="box" style="flex:1"><b>Дополнительная схема (К1) – 6 аспектов:</b><ol style="margin:3px 0 0">'+ASPECTS.map(a=>'<li>'+a+'</li>').join('')+'</ol></div><div class="box" style="flex:.8"><b>К2 – эксперт смотрит:</b> '+ORGS.join(' · ')+'.<br><span class="note">Расхождение экспертов на 2 балла и больше – письмо проверяет третий эксперт.</span></div></div>';
    b.append(t);return;}
  const b=body(),a=panel('w40'),g=panel('grow');
  a.innerHTML='<h3>Объём: 100–140 слов</h3><p>Допустимое отклонение – 10 %.</p><div class="kv"><span class="tag bad">меньше 90</span><span>задание не проверяют – <b>0 баллов</b></span><span class="tag ok">90–154</span><span>проверяют всё письмо</span><span class="tag acc">больше 154</span><span>проверяют только первые 140 слов от начала – конец письма (вопросы, прощание) потеряется</span></div>'+
   '<h4>Как считают</h4><ul><li>Все слова с первого по последнее: вспомогательные глаголы, предлоги, артикли, частицы.</li><li>Обращение и подпись считаются.</li><li>Краткие формы (can’t, I’m) – одно слово.</li><li>Числа цифрами (1, 2009, 126 204) и с процентом (25%) – одно слово.</li><li>Числительные словами – как слова.</li><li>Сложные слова (good-looking, twenty-five) – одно слово.</li><li>Сокращения (USA, e-mail, TV, CD-rom) – одно слово.</li></ul>'+
   '<h4>Если много</h4><p>Убери избыточные предложения, сократи завершающую фразу и фразу о надежде на контакт, лишние прилагательные.</p><h4>Если мало</h4><p>Чаще всего не хватает слов из-за неполных ответов: проверь, все ли аспекты раскрыты полно. Добавь прилагательные и наречия. Посчитай заранее, сколько слов у тебя в одной строке.</p>';
  g.append(el('h3',null,'Сколько слов засчитают?'));S.wc=S.wc||{};const grid=el('div','cards');grid.style.setProperty('--n',4);
  WC.forEach((w,i)=>{const c=el('div','jcard'),ans=S.wc[i];c.append(el('div','q',esc(w[0])));const o=el('div','opts');o.style.setProperty('--n',4);
    [0,1,2,3].forEach(n=>{const bt=el('button','opt'+(ans!=null?(n===w[1]?' ok':(n===ans?' bad':' dim')):''),String(n));bt.type='button';bt.style.textAlign='center';bt.onclick=()=>{if(S.wc[i]!=null)return;S.wc[i]=n;redraw();};o.append(bt);});
    c.append(o);if(ans!=null)c.append(el('div','note',esc(w[2])));grid.append(c);});
  const done=Object.keys(S.wc).length,ok=Object.keys(S.wc).filter(i=>S.wc[i]===WC[i][1]).length;
  g.append(grid,el('div','row',''));g.lastChild.append(el('span','score','Верно: '+ok+' из '+done),btn('Сначала',()=>{S.wc={};redraw();},'sm'));b.append(a,g);
};

/* 2. Структура */
VIEW.struct=function(){
  const s=hdr('Структура письма',['Собери письмо','Схема и шаблон'],'Формат электронного письма: без адреса, даты и рамки');
  if(s===0){S.so=S.so||{order:shuffle(PARTS.map((p,i)=>i)),placed:0,miss:0};const st=S.so,done=st.placed===PARTS.length;
    const b=body(),a=panel('grow'),r=panel('w40');
    a.append(el('h3',null,done?'Готово: структура письма':'Выбирай части справа по порядку'));
    PARTS.forEach((p,i)=>{const on=i<st.placed;a.append(el('div','skrow'+(on?' on':''),'<i>'+(i+1)+'</i><div>'+(on?'<b>'+p[0]+'</b><span class="ph">'+esc(p[1])+'</span></div><div class="alt">'+(done?esc(p[2])+'<br>':'')+p[3]:'<span class="ph">…</span></div>')+'</div>'));});
    if(done){r.innerHTML='<h3>Три абзаца минимум</h3><p>1 – благодарность и/или радость от письма; 2 – мостик и ответы; 3 – мостик и вопросы. Абзацы – красная строка, пропуск строки или и то и другое.</p><h3>Оформление</h3><ul><li>Обращение – слева, после имени запятая, не восклицательный знак.</li><li>Текст после обращения – с новой строки, с заглавной буквы.</li><li>Надежда на контакт – отдельной строкой.</li><li>Завершающая фраза – отдельной строкой, запятая.</li><li>Подпись – только имя, без точки.</li></ul><p class="note">Ошибок: '+st.miss+'</p>';r.append(btn('Собрать ещё раз',()=>{S.so=null;redraw();},'main'));}
    else{r.append(el('div','note','Ошибок: '+st.miss));st.order.forEach(i=>{if(i<st.placed)return;const t=btn('<b>'+PARTS[i][0]+'</b>'+esc(PARTS[i][1]),()=>{if(i===st.placed){st.placed++;redraw();}else{st.miss++;t.classList.add('bad');r.firstChild.textContent='Ошибок: '+st.miss;setTimeout(()=>t.classList.remove('bad'),500);}},'part');r.append(t);});}
    b.append(a,r);return;}
  const b=body(),a=panel('w30'),m=panel('grow'),r=panel('w30');
  a.innerHTML='<h3>Схема письма</h3><ol><li><b>Обращение</b> – после него обязательно запятая</li><li><b>Благодарность</b> за письмо и/или радость от его получения</li><li><b>Мостик и ответы</b> на 3 вопроса друга</li><li><b>Мостик и 3 вопроса</b> другу строго о том, что указано в задании</li><li><b>Надежда</b> на последующие контакты (точка)</li><li><b>Завершающая фраза</b> (запятая)</li><li><b>Подпись</b> – только имя, без точки</li></ol><h4>План из книги</h4><p>Приветствие → благодарность за письмо → ответы на вопросы друга → вопросы другу по теме, о которой спрашивается → «слиться» (почему заканчиваю) → пожелания → имя.</p>';
  m.innerHTML='<h3>Шаблон</h3><pre class="letter">'+esc(TEMPLATE)+'</pre><p class="note" style="margin-top:5px">«Well,» после мостика «In your message you asked me some questions.» – уже внутри ответа. Сам по себе Well, как переход от благодарности к ответам ФИПИ не принимает.</p>';
  r.innerHTML='<h3>Обязательно</h3><ul><li>Обращение и благодарность и/или радость от письма</li><li>Мостики перед ответами и перед вопросами</li><li>Ответы на все вопросы, 3 вопроса другу</li><li>Надежда на контакт, завершающая фраза, подпись</li></ul><h3>Можно, но необязательно</h3><ul><li>Извинение, что долго не писал</li><li>Реакция на письмо-стимул</li><li>Ссылка на предыдущие контакты</li><li>Объяснение, почему заканчиваешь письмо</li></ul><h3>Нельзя</h3><ul><li>Адрес, дата, рамка, строки From / To / Subject</li><li>Две завершающие фразы подряд</li><li>Фамилия или отчество в подписи и обращении</li></ul>';
  b.append(a,m,r);
};

/* 3. Фразы-опоры */
VIEW.phr=function(){
  const s=hdr('Фразы-опоры',['Карточки и сортировка','Сокращения'],'* – необязательная часть письма');
  if(s===0){const b=body(),a=panel('w40'),m=panel('grow'),r=panel('w30');
    a.append(el('h3',null,'1. Часть письма → фразы'),quizlet(PHR,'phr',x=>'<div class="qzterm">'+x[0]+'</div><div class="qzsub">какие фразы подходят? нажми</div>',x=>'<ul>'+x[1].split(' · ').map(p=>'<li class="en">'+esc(p)+'</li>').join('')+'</ul><p class="note" style="margin:6px 0 0">'+esc(x[2])+'</p>'));
    S.sr=S.sr||{order:shuffle(SORT.map((x,i)=>i)),i:0,ok:0,pick:null};const st=S.sr;
    if(st.i<st.order.length){const x=SORT[st.order[st.i]];m.append(el('h3',null,'2. Куда эта фраза? · '+(st.i+1)+' из '+SORT.length),el('div','box','<span style="font-size:18px" class="en">'+esc(x[0])+'</span>'));
      const o=el('div','opts');o.style.setProperty('--n',1);FUN.forEach((f,k)=>{const bt=el('button','opt'+(st.pick!=null?(k===x[1]?' ok':(k===st.pick?' bad':' dim')):''),f);bt.type='button';bt.onclick=()=>{if(st.pick!=null)return;st.pick=k;if(k===x[1])st.ok++;redraw();};o.append(bt);});m.append(o);
      const nv=el('div','row');nv.style.marginTop='6px';nv.append(el('span','score','Верно: '+st.ok));if(st.pick!=null)nv.append(btn('Следующая фраза →',()=>{st.i++;st.pick=null;redraw();},'main'));m.append(nv);}
    else m.append(el('h3',null,'2. Куда эта фраза? Готово: '+st.ok+' из '+SORT.length),btn('Ещё раз',()=>{S.sr=null;redraw();},'main'));
    r.innerHTML='<h3>Не подходит для личного письма</h3><ul><li><b>Dear Sir, Dear Madam, Dear Mr …, To whom it may concern, Dear Editor</b> – официальные обращения</li><li><b>Hey, Kevin!</b> и восклицательный знак после имени</li><li><b>Well, …</b> или <b>By the way, …</b> сразу после благодарности как переход к ответам</li><li>Голое <b>By the way,</b> перед вопросами</li><li><b>I look forward to …</b> – официальное письмо</li><li><b>I will write you soon, See you soon</b> – обещание, а не надежда</li><li><b>Yours sincerely, Yours faithfully, Yours truly, Sincerely, Best regards</b></li><li>Две завершающие фразы подряд</li><li><b>Congratulations</b> с днём рождения → Give my best birthday wishes to …</li><li><b>I am happy to inform you that I received your letter</b> – официальный стиль</li></ul><p class="note">Слова из задания: email, email message (верно и email, и e-mail). Предлог: on the internet.</p>';
    b.append(a,m,r);return;}
  const b=body(),a=panel('grow'),r=panel('w35');a.append(el('h3',null,'Сокращения: расшифруй, потом переверни'),quizlet(ABBR,'abbr',x=>'<div class="qzterm">'+esc(x[0])+'</div>',x=>'<div class="qzterm" style="text-align:center;margin:auto">'+esc(x[1])+'</div>'));
  r.innerHTML='<h3>Можно ли сокращать?</h3><p>В личном электронном письме допускаются традиционные для электронной среды акронимы, аббревиатуры и сокращения, но в экзаменационной работе <b>злоупотреблять ими не стоит</b>.</p><p>Помни: аббревиатура при подсчёте даёт всего <b>одно слово</b>.</p>';
  r.append(el('h4',null,'Все сокращения'),el('div','kv',ABBR.map(x=>'<b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span>').join('')));b.append(a,r);
};

/* 4. Ответы на вопросы */
VIEW.answ=function(){
  const s=hdr('Ответы на вопросы друга',['Правила','Типы вопросов и устные ответы'],'Книга-пособие · презентации · ФИПИ');
  if(s===0){const b=body('col'),p=panel('grow');p.append(el('p','note','14 правил: нажми на карточку – на обороте объяснение и примеры.'));const g=el('div','cards');g.style.setProperty('--n',5);
    RULES_A.forEach((r,i)=>g.append(flip('<b class="t">'+(i+1)+'. '+r[0]+'</b>',esc(r[1]))));p.append(g);b.append(p);return;}
  const b=body(),a=panel('w40'),g=el('div','cards');{S.typ=S.typ||'habit';g.style.setProperty('--n',2);
    TK.forEach(k=>{const T=TYPES[k],t=el('button','tile'+(k===S.typ?' sel':''),'<b>'+T.n+'</b> <span class="note">· '+CNT[k]+' · '+Math.round(CNT[k]/ALLQ.length*100)+'%</span>');t.type='button';t.onclick=()=>{S.typ=k;redraw();};g.append(t);});
    a.append(el('h3',null,'1. Что спрашивает друг: '+ALLQ.length+' вопросов из '+L0.length+' писем'),g);
    const T=TYPES[S.typ],ex=ALLQ.filter(q=>q.k===S.typ);a.append(el('h4',null,T.n),el('p',null,'<b>Как отвечать.</b> '+T.how),el('p','box',esc(T.fr)));
    ex.slice(0,1).forEach(q=>a.append(el('p',null,'<b class="en">'+esc(q.t)+'</b><br><span class="ex">'+ED.t(q.ek,q.ans)+'</span>')));a.querySelector('h4').style.color=T.c;
    a.append(el('div','warn','<b>Двойные вопросы: '+DBL+' из '+ALLQ.length+'.</b> «…, and why?», «why or why not?» – ответ только на первую часть неполный.'));}
  S.an=S.an||{pool:shuffle(ALLQ),i:0,stage:0,pick:null,dpick:null,show:false,score:0};const st=S.an,q=st.pool[st.i],r=panel('grow');const a0=a;{const a=r;a.append(el('h3',null,'2. Отвечаю устно'));
  a.append(el('div','note','Вопрос '+(st.i+1)+' из '+st.pool.length+' · письмо от '+esc(q.name)+' · верных определений: '+st.score));if(q.lead)a.append(el('div','note',esc(q.lead)));
  a.append(el('div','box','<span style="font-size:19px" class="en">'+esc(q.t)+'</span>'));
  if(st.stage===0){const o=el('div','opts');TK.forEach(k=>{const bt=el('button','opt',TYPES[k].n);bt.type='button';bt.onclick=()=>{st.pick=k;if(k===q.k)st.score++;st.stage=1;redraw();};o.append(bt);});a.append(el('p',null,'<b>1. Какой это вопрос?</b>'),o);}
  else{const T=TYPES[q.k],ok=st.pick===q.k;a.append(el('div','verdict '+(ok?'ok':'bad'),'<b>'+(ok?'Верно.':'Не совсем.')+'</b> Это «'+T.n+'». '+T.how+' <i>'+esc(T.fr)+'</i>'));
    if(st.stage===1){const o=el('div','opts');o.style.setProperty('--n',2);[['Одна часть',false],['Две части – ответить на обе',true]].forEach(([n,v])=>{const bt=el('button','opt',n);bt.type='button';bt.onclick=()=>{st.dpick=v;if(v===q.d)st.score++;st.stage=2;redraw();};o.append(bt);});a.append(el('p',null,'<b>2. Сколько частей в вопросе?</b>'),o);}
    else{const k2=st.dpick===q.d;a.append(el('div','verdict '+(k2?'ok':'bad'),'<b>'+(k2?'Верно.':'Не совсем.')+'</b> '+(q.d?'Вопрос двойной: нужен ответ на обе части.':'Здесь одна часть.')),el('p',null,'<b>3. Ответь вслух</b> одной-двумя фразами, потом открой образец.'));
      if(st.show)a.append(el('div','verdict','<b>Образец:</b> <span class="en">'+ED.t(q.ek,q.ans)+'</span>'));
      const nv=el('div','row');if(!st.show)nv.append(btn('Показать образец',()=>{st.show=true;redraw();}));nv.append(btn('Следующий вопрос →',()=>{st.i=(st.i+1)%st.pool.length;st.stage=0;st.pick=st.dpick=null;st.show=false;redraw();},'main'));a.append(nv);}}
  a.append(el('p','note','Порядок: тип вопроса → вторая часть (and why? why or why not?) → ответ вслух в том же времени, с деталью или причиной → образец. Образцы – примерные, а не единственно верные.'));}
  b.append(a0,r);
};

/* 5. Вопросы другу */
VIEW.ques=function(){
  const s=hdr('Вопросы другу',['Правила','Тренировка: ошибка и время'],'Книга-пособие · презентации · ФИПИ');
  if(s===0){const b=body('col'),p=panel('grow');p.append(el('div','row','<span class="note">Правильные вопросы складываются из двух вещей: <b>время</b> и <b>ситуация</b>. Нажми на карточку – на обороте объяснение.</span>'));const g=el('div','cards');g.style.setProperty('--n',4);
    RULES_Q.forEach((r,i)=>g.append(flip('<b class="t">'+(i+1)+'. '+r[0]+'</b>',esc(r[1]))));p.append(g);b.append(p);return;}
  const b=body();{S.jd=S.jd||{order:shuffle(JUDGE.map((x,i)=>i)),ans:{}};const st=S.jd,p=panel('grow');
    const ok=Object.keys(st.ans).filter(i=>st.ans[i]===JUDGE[i][3]).length;p.append(el('h3',null,'1. Вопрос верный или с ошибкой?'),el('div','row','<span class="note">Друг сообщает новость. Объяснение появится после ответа.</span><span class="sp score">Верно: '+ok+' из '+Object.keys(st.ans).length+'</span>'));
    pager(st.order,4,(i)=>{const x=JUDGE[i],c=el('div','jcard'),a=st.ans[i];c.append(el('div','stim','<span class="en">'+esc(x[0])+'</span><br>ask 3 questions about <b>'+esc(x[1])+'</b>'),el('div','q en',esc(x[2])));
      const two=el('div','two');[['Вопрос верный',1],['Есть ошибка',0]].forEach(([n,v])=>{const bt=el('button','opt'+(a!=null?(v===x[3]?' ok':(v===a?' bad':' dim')):''),n);bt.type='button';bt.onclick=()=>{if(st.ans[i]!=null)return;st.ans[i]=v;redraw();};two.append(bt);});c.append(two);
      if(a!=null)c.append(el('div','verdict '+(a===x[3]?'ok':'bad'),esc(x[4])));return c;},p,'jdp',2);
    p.lastChild.append(btn('Сначала',()=>{S.jd=null;S.jdp=0;redraw();},'sm'));b.append(p);}
  const pool=L0.filter(x=>x.tt);S.tn=S.tn||{order:shuffle(pool.map((x,i)=>i)),ans:{}};const st=S.tn,p=panel('w35');
  p.append(el('h3',null,'2. Когда это происходит?'),el('div','note','От этого зависит время в твоих вопросах.'));
  pager(st.order,3,(i)=>{const x=pool[i],c=el('div','jcard'),a=st.ans[i];c.append(el('div','q en','… '+esc(x.trig)+' …'),el('div','stim','ask 3 questions about <b>'+esc(x.about)+'</b>'));
    const o=el('div','opts');Object.keys(TENSE).forEach(k=>{const bt=el('button','opt'+(a!=null?(k===x.tt?' ok':(k===a?' bad':' dim')):''),TENSE[k][0]);bt.type='button';bt.onclick=()=>{if(st.ans[i]!=null)return;st.ans[i]=k;redraw();};o.append(bt);});c.append(o);
    if(a!=null)c.append(el('div','note',esc(TENSE[x.tt][1])),el('div','verdict','<b>Образец:</b> <span class="en">'+x.ask.map(esc).join(' ')+'</span>'));return c;},p,'tnp',1);
  b.append(p);
};

/* 6. Найди ошибку */
VIEW.err=function(){
  const s=hdr('Найди ошибку',['Обращения','Завершающие фразы','Фрагменты писем','Отредактируй письмо'],'Упражнения из презентации');
  if(s<2){const set=s===0?GREET:CLOSE,k=s===0?'gr':'cl';S[k]=S[k]||{sel:{},chk:false};const st=S[k],b=body(),a=panel('grow'),r=panel('w30');
    a.append(el('h3',null,s===0?'Выбери обращения, правильно написанные для личного письма. Смотри и на пунктуацию.':'Выбери завершающие фразы, которые подходят для личного письма.'));
    const g=el('div','cards');g.style.setProperty('--n',4);set.forEach((x,i)=>{let c='tile';if(st.chk)c+=x[1]?(st.sel[i]?' ok':' miss'):(st.sel[i]?' bad':'');else if(st.sel[i])c+=' sel';const t=el('button',c,'<span class="en" style="font-size:17px">'+esc(x[0])+'</span>');t.type='button';t.onclick=()=>{if(st.chk)return;st.sel[i]=!st.sel[i];redraw();};g.append(t);});
    a.append(g);const nv=el('div','row');nv.style.marginTop='8px';
    if(!st.chk)nv.append(btn('Проверить',()=>{st.chk=true;redraw();},'main'));else{const right=set.filter((x,i)=>!!st.sel[i]===!!x[1]).length;nv.append(el('b',null,'Верно: '+right+' из '+set.length),btn('Ещё раз',()=>{S[k]=null;redraw();},'sm'));}
    a.append(nv);
    r.innerHTML=s===0?'<h3>Правило</h3><p>Письмо начинается с обращения в левом верхнем углу. Можно с приветствием Hello / Hi. После приветствия по правилам нужна запятая (Hello, Ann,), хотя носители её часто не ставят. После обращения запятая обязательна. Восклицательный знак, как в русском, – никогда.</p><p>Только имя: без фамилии, без Mr / Mrs, без Sir / Madam.</p><p class="note">После проверки: зелёная – верно выбрано, пунктир – пропущено, красная – выбрано ошибочно.</p>':'<h3>Правило</h3><p>Завершающая фраза – отдельной строкой слева, зависит от степени близости автора и адресата. После неё, перед подписью, – запятая.</p><p>Yours faithfully, Yours sincerely, Yours truly, Sincerely, Best regards – для официальной переписки.</p><p class="note">После проверки: зелёная – верно выбрано, пунктир – пропущено, красная – выбрано ошибочно.</p>';
    b.append(a,r);return;}
  if(s===2){const b=body('col'),p=panel('grow');p.append(el('div','note','Найди ошибки во фрагменте, скажи вслух, потом переверни карточку.'));
    pager(FRAG,6,(x,i)=>{const f=flip('<b>Фрагмент '+(i+1)+'</b><pre class="letter" style="margin-top:4px">'+esc(x[0])+'</pre>','<b>Ответ</b><p>'+esc(x[1])+'</p>');f.style.minHeight='190px';return f;},p,'frp',3);b.append(p);return;}
  S.sv=S.sv||0;const b=body(),a=panel('w30'),m=panel('grow'),r=panel('w30');a.innerHTML='<h3>Задание</h3>'+kim(SVETA.task);
  m.innerHTML='<h3>Письмо ученицы: что исправить, чтобы получить максимум?</h3><pre class="letter">'+esc(SVETA.letter)+'</pre>';
  r.append(el('h3',null,'Исправления: '+S.sv+' из '+SVETA.fix.length),el('ol',null,SVETA.fix.slice(0,S.sv).map(x=>'<li>'+esc(x)+'</li>').join('')));
  const nv=el('div','row');if(S.sv<SVETA.fix.length)nv.append(btn('Показать следующее',()=>{S.sv++;redraw();},'main'));nv.append(btn('Исправленный вариант',()=>overlay('Возможный вариант после правки',el('pre','model',model(SVETA.task)))),btn('Сначала',()=>{S.sv=0;redraw();},'sm'));r.append(nv);b.append(a,m,r);
};

/* 7. Мифы */
VIEW.myth=function(){
  hdr('Мифы и проверь себя',null,'Презентации · ФИПИ');S.my=S.my||{ans:{}};const st=S.my,b=body(),p=panel('grow'),r=panel('w30');const ok=Object.keys(st.ans).filter(i=>st.ans[i]===MYTH[i][1]).length;
  p.append(el('h3',null,'1. Правда или миф?'),el('div','row','<span class="note">Выбери, потом прочитай объяснение.</span><span class="sp score">Верно: '+ok+' из '+Object.keys(st.ans).length+'</span>'));
  pager(MYTH.map((x,i)=>i),6,(i)=>{const x=MYTH[i],c=el('div','jcard'),a=st.ans[i];c.append(el('div','q',esc(x[0])));const two=el('div','two');[['Правда',1],['Миф',0]].forEach(([n,v])=>{const bt=el('button','opt'+(a!=null?(v===x[1]?' ok':(v===a?' bad':' dim')):''),n);bt.type='button';bt.onclick=()=>{if(st.ans[i]!=null)return;st.ans[i]=v;redraw();};two.append(bt);});c.append(two);
    if(a!=null)c.append(el('div','verdict '+(a===x[1]?'ok':'bad'),esc(x[2])));return c;},p,'myp',2);p.lastChild.append(btn('Сначала',()=>{S.my=null;S.myp=0;redraw();},'sm'));
  r.append(el('h3',null,'2. Вопросы на понимание'),el('p','note','Ответь вслух, потом переверни.'));const g=el('div','cards');g.style.setProperty('--n',1);THEORY.forEach(x=>g.append(flip('<b class="t">'+esc(x[0])+'</b>',esc(x[1]))));r.append(g);b.append(p,r);
};

/* 8. Письмо по шагам */
VIEW.walk=function(){
  const keys=Object.keys(WALK),s=hdr('Письмо по шагам',keys.map(k=>WALK[k].title),'Разбор писем из презентаций');const w=WALK[keys[s]];S.wk=S.wk||{};const i=S.wk[keys[s]]||0,st=w.steps[i];
  const b=body(),a=panel('w30'),m=panel('w35'),r=panel('grow');a.innerHTML='<h3>Задание</h3>'+kim(w.task,i<2||keys[s]==='tom'&&i===0);
  m.append(el('h3',null,st[0]),el('p',null,esc(st[1])));const prog=el('div','note','Шаг '+(i+1)+' из '+w.steps.length);m.append(prog);
  const nv=el('div','row');nv.style.marginTop='8px';nv.append(btn('← Назад',()=>{S.wk[keys[s]]=Math.max(0,i-1);redraw();},'sm'));if(i<w.steps.length-1)nv.append(btn('Дальше →',()=>{S.wk[keys[s]]=i+1;redraw();},'main'));else nv.append(btn('Сначала',()=>{S.wk[keys[s]]=0;redraw();},'sm'));m.append(nv);
  let txt='';w.steps.forEach((x,k)=>{if(k>i||!x[2])return;txt+=k===i?'<span class="nw">'+esc(x[2])+'</span>':esc(x[2]);});
  r.append(el('h3',null,'Письмо'+(i===w.steps.length-1?' · '+words(w.task.model)+' слов':'')),el('pre','letter',txt||'<span class="note">Письмо появится по мере шагов.</span>'));b.append(a,m,r);
};

/* 9. Устно: 30 вариантов */
VIEW.oral=function(){
  S.or=S.or||{i:0};const st=S.or,x=ABC[st.i],t=hdr('Устная подготовка');
  const tp=main.lastChild,sel=el('select','pick');ABC.forEach((y,k)=>sel.append(new Option((k+1)+'. '+y.subject+' · '+y.name,k)));sel.value=st.i;sel.onchange=()=>{st.i=+sel.value;redraw();};
  tp.append(btn('←',()=>{st.i=(st.i+ABC.length-1)%ABC.length;redraw();},'sm'),sel,btn('→',()=>{st.i=(st.i+1)%ABC.length;redraw();},'sm'),el('span','src','Этап 1 – ответь вслух · этап 2 – опоры · этап 3 – модели'));
  const lt={name:x.name,g:x.g,subject:x.subject,body:x.body,about:x.about,qs:x.qs.map(q=>q.t)};
  const b=body(),a=panel('w30'),m=panel('grow'),r=panel('w25');a.innerHTML='<h3>Этап 1. Прочитай и ответь устно</h3>'+kim(lt,true)+'<p class="note">Сначала говори, письмо пока не пиши.</p>';
  const nv=el('div','row');nv.append(btn('Этап 2: лексика и справка',()=>overlay('Опоры · вариант '+(st.i+1),'<h3>Лексика</h3><p>'+(x.vocab?esc(x.vocab):'<span class="note">В этом варианте отдельной лексики нет.</span>')+'</p><h3>Справка</h3><p>'+esc(x.bg)+'</p><h3>Как составить три верных вопроса</h3><div class="kv"><b>WH (Present)</b><span>WH + do / does + подлежащее + глагол: Where does the group meet?</span><b>WH (Past)</b><span>WH + did + подлежащее + глагол: Why did you join the group?</span><b>BE / модальный</b><span>Am / Is / Are / Was / Were / Can / Will + подлежащее: Is membership free?</span></div><p class="warn" style="margin-top:6px">Тема вопросов: <b>'+esc(x.about)+'</b>. Не спрашивай то, что уже сказано в письме.</p>'),'main'),btn('Написать это письмо',()=>{const k=LETTERS.findIndex(l=>l.abc===x);S.wr={i:k<0?0:k};goTo('write');},'sm'));a.append(nv);
  m.append(el('h3',null,'Этап 3. Ответы: 3 модели на каждый вопрос'));const g=el('div','cards');g.style.setProperty('--n',1);
  x.qs.forEach((q,k)=>g.append(flip('<b class="t">Q'+(k+1)+'. <span class="en">'+esc(q.t)+'</span></b><span class="note">Ответь вслух, потом переверни.</span>','<b>Q'+(k+1)+'. '+esc(q.t)+'</b><ol style="margin:4px 0 0;padding-left:20px">'+q.m.map(z=>'<li class="en">'+esc(z[0])+'<br><span class="note">Почему засчитают: '+esc(z[1])+'</span></li>').join('')+'</ol>')));
  g.querySelectorAll('.flip').forEach(f=>f.style.minHeight='150px');m.append(g);
  r.append(el('h3',null,'Вопросы другу: 3 набора'));x.sets.forEach((set,k)=>{const f=flip('<b class="t">Набор '+(k+1)+'</b><span class="note">о: '+esc(x.about)+'</span>','<ol style="margin:0;padding-left:18px">'+set.map(z=>'<li class="en">'+esc(z[0])+'<br><span class="note">'+esc(z[1])+'</span></li>').join('')+'</ol>');f.style.minHeight='150px';f.style.marginBottom='6px';r.append(f);});
  r.append(el('p','note','Модели – примерные: засчитают и другие верные ответы и вопросы. Проверка К1: прямой и полный ответ · точно по вопросу · новая информация · без повторов · грамматика и вежливость.'));b.append(a,m,r);
};

/* 10. Письма о России */
VIEW.russia=function(){
  S.ru=S.ru||{i:0,sup:false};const st=S.ru,x=RU[st.i];hdr('Письма о России',null,'18 тем · фразы-опоры для ответа');
  const lt={name:x.name,g:x.g,subject:x.title,body:x.body,about:x.about,qs:qOf(x.body)};
  const b=body(),a=panel('w25'),m=panel('grow'),r=panel('w30'),list=el('div','blist');
  RU.forEach((y,k)=>{const bt=el('button','bitem'+(k===st.i?' on':''),(k+1)+'. '+esc(y.title)+'<small>ask about: '+esc(y.about)+'</small>');bt.type='button';bt.onclick=()=>{st.i=k;st.sup=false;redraw();};list.append(bt);});a.append(list);
  m.innerHTML='<h3>'+(st.i+1)+'. '+esc(x.title)+'</h3>'+kim(lt,true);const nv=el('div','row');nv.append(btn('Написать это письмо',()=>{const k=LETTERS.findIndex(l=>l.src==='ru'&&l.name===x.name&&l.subject===x.title);S.wr={i:k<0?0:k};goTo('write');},'main'));m.append(nv);
  r.append(el('h3',null,'Фразы-опоры для ответа'));if(st.sup)r.append(el('ul',null,x.sup.map(z=>'<li class="en">'+esc(z)+'</li>').join('')));else r.append(el('p','note','Сначала попробуй ответить на вопросы сам – вслух или в плане на английском.'),btn('Показать опоры',()=>{st.sup=true;redraw();},'main'));
  r.append(el('div','warn','<b>Помни:</b> правильные названия (the Hermitage, War and Peace), точные даты праздников и событий, блюда – из словаря или с пояснением.'));
  if(a.querySelector('.on'))setTimeout(()=>{const o=a.querySelector('.on');if(o)o.scrollIntoView({block:'nearest'});},0);b.append(a,m,r);
};

/* 11. Задай 3 вопроса */
VIEW.qbank=function(){
  const topics=['Все'].concat([...new Set(QB.map(q=>q.topic==='kate'?'Карточки':q.topic))]);S.qf=S.qf||0;
  hdr('Задай 3 вопроса',null,QB.length+' ситуаций · вопросы на обороте');const g=el('select','pick');topics.forEach((n,i)=>g.append(new Option(n==='Карточки'?'Карточки с вопросами':n,i)));g.value=S.qf;g.onchange=()=>{S.qf=+g.value;S.qbp=0;redraw();};main.lastChild.insertBefore(g,main.lastChild.lastChild);
  const pool=QB.filter(q=>S.qf===0||(q.topic==='kate'?'Карточки':q.topic)===topics[S.qf]);const b=body('col'),p=panel('grow');
  p.append(el('div','note','Прочитай новость, задай три вопроса вслух – по теме, в нужном времени, не о том, что уже известно. Потом переверни карточку.'));
  pager(pool,12,x=>{const f=flip('<span class="en" style="font-size:17px">'+esc(x.stim)+'</span><span style="margin-top:6px">ask 3 questions about <b class="en">'+esc(x.about)+'</b></span>','<b>Возможные вопросы</b><ol style="margin:4px 0 0;padding-left:20px">'+x.q.map(z=>'<li class="en">'+esc(z)+'</li>').join('')+'</ol>');f.style.minHeight='180px';return f;},p,'qbp',4);b.append(p);
};

/* 12. Пишу письмо */
function checks(t){const lines=t.split('\n').map(s=>s.trim()).filter(Boolean),w=words(t),low=t.toLowerCase(),last=lines[lines.length-1]||'',prev=lines[lines.length-2]||'',paras=t.trim().split(/\n\s*\n/).filter(x=>x.trim()).length;
  return [['Обращение в первой строке, после имени запятая',/^(dear|hi|hello)\b[^!]*,\s*$/i.test(lines[0]||'')],['Нет адреса, даты и рамки From / To / Subject',!/^(from|to|subject)\s*:/im.test(t)&&!/\d{1,2}[./]\d{1,2}[./]\d{2,4}/.test(t)],['Благодарность за письмо',/thank|glad to|great to hear|nice to hear|good to hear|happy to hear|always glad/.test(low)],
   ['Абзацы выделены (не меньше пяти блоков с прощанием)',paras>=5,paras+' блоков'],['Три вопроса другу',(t.match(/\?/g)||[]).length>=3,(t.match(/\?/g)||[]).length+' из 3'],['Надежда на дальнейший контакт',/write back|hope to hear|hear from you|keep in touch|write to me|write again|looking forward/.test(low)&&!/i look forward/.test(low)],
   ['Завершающая фраза на отдельной строке, запятая',/^(best wishes|with best wishes|all the best|love|with love|lots of love|much love|hugs|yours),$/i.test(prev)],['Подпись: только имя, без точки',lines.length>3&&/^[A-Za-z]+$/.test(last)],
   ['Объём 100–140 слов',w>=100&&w<=140,w+(w>=90&&w<100||w>140&&w<=154?' · допустимо':w<90&&w?' · меньше 90 – 0 баллов':w>154?' · проверят первые 140':'')]];}
VIEW.write=function(){
  S.wr=S.wr||{i:0,f:'all'};const st=S.wr;const t=hdr('Пишу письмо · 20 минут');const tp=main.lastChild;
  const fs=el('select','pick');[['all','Все письма ('+LETTERS.length+')']].concat(Object.keys(SRC).map(k=>[k,SRC[k]+' ('+LETTERS.filter(l=>l.src===k).length+')'])).forEach(o=>fs.append(new Option(o[1],o[0])));fs.value=st.f;fs.onchange=()=>{st.f=fs.value;const f=LETTERS.findIndex(l=>st.f==='all'||l.src===st.f);st.i=f<0?0:f;redraw();};
  const pool=LETTERS.filter(l=>st.f==='all'||l.src===st.f),sel=el('select','pick');pool.forEach(l=>sel.append(new Option(l.n+'. '+l.subject+' · '+l.name,l.n-1)));if(!pool.includes(LETTERS[st.i]))st.i=pool[0].n-1;sel.value=st.i;sel.onchange=()=>{st.i=+sel.value;redraw();};
  tp.append(fs,sel,btn('Случайное',()=>{st.i=pool[Math.floor(Math.random()*pool.length)].n-1;redraw();},'sm'),el('span','src','Таймер – внизу слева'));
  const x=LETTERS[st.i],dk=KEY+'-d-'+x.key,b=body(),a=panel('w30'),m=el('div','grow'),c=panel('w25');m.style.display='flex';m.style.flexDirection='column';m.style.gap='6px';m.style.minHeight='0';
  a.innerHTML='<div class="row" style="margin-bottom:4px"><span class="tag">'+SRC[x.src]+'</span></div>'+kim(x);
  const ta=el('textarea','lt');ta.spellcheck=false;ta.placeholder='№ 37\n\nПиши письмо здесь, начиная с обращения. Черновик сохраняется в этом браузере.';try{ta.value=localStorage.getItem(dk)||'';}catch(e){}
  const paint=()=>{c.innerHTML='<h3>Автопроверка</h3>';checks(ta.value).forEach(r=>c.append(el('div','ck'+(r[1]?' ok':''),'<i>'+(r[1]?'✓':'')+'</i><div>'+r[0]+(r[2]?' <span>'+r[2]+'</span>':'')+'</div>')));c.append(el('p','note','Автопроверка видит только форму. Полноту ответов, тему и время вопросов проверь по листу самопроверки.'));};
  ta.oninput=()=>{try{localStorage.setItem(dk,ta.value);}catch(e){}paint();};paint();
  const msg=el('span','note'),nv=el('div','row');
  nv.append(btn('Отправить учителю на проверку',()=>{const tx='Письмо 37 · №'+x.n+' '+x.subject+' ('+x.name+') · '+words(ta.value)+' слов\n\n'+ta.value;(navigator.clipboard?navigator.clipboard.writeText(tx):Promise.reject()).then(()=>{msg.textContent='Скопировано – вставь в сообщение учителю.';}).catch(()=>{msg.textContent='Не получилось скопировать: выдели текст и скопируй вручную.';});},'main'));
  if(x.model)nv.append(btn('Образец письма',()=>overlay('Образец · '+words(x.model)+' слов',el('pre','model',model(x)))));
  if(x.abc)nv.append(btn('Модели ответов',()=>overlay('Модели ответов и вопросов','<p class="note">'+esc(x.abc.bg)+'</p>'+x.abc.qs.map((q,k)=>'<h4>Q'+(k+1)+'. '+esc(q.t)+'</h4><ul>'+q.m.map(z=>'<li>'+esc(z[0])+'</li>').join('')+'</ul>').join('')+'<h4>Вопросы о: '+esc(x.abc.about)+'</h4>'+x.abc.sets.map((s,k)=>'<p><b>Набор '+(k+1)+':</b> '+s.map(z=>esc(z[0])).join(' ')+'</p>').join(''))));
  if(x.sup)nv.append(btn('Фразы-опоры',()=>overlay('Фразы-опоры для ответа',ul(x.sup.map(esc)))));
  nv.append(btn('Лист самопроверки',()=>{const box=el('div');SELF.forEach(s=>{const l=el('label','ck'),i=el('input');i.type='checkbox';l.append(i,el('div',null,esc(s)));box.append(l);});overlay('Лист самопроверки',box);}),btn('Очистить',()=>{ta.value='';try{localStorage.removeItem(dk);}catch(e){}paint();},'sm'),msg);
  m.append(ta,nv);b.append(a,m,c);
};

/* 13. Банк писем */
VIEW.bank=function(){
  S.bk=S.bk||{i:0,q:'',f:'all',open:{}};const st=S.bk;hdr('Банк писем',null,'Сборник писем · банк ФИПИ · 30 вариантов · письма о России · типовые задания');
  const b=body(),a=panel('w25'),m=panel('grow'),r=panel('w30');
  const fs=el('select','pick');fs.style.width='100%';fs.style.marginBottom='5px';[['all','Все письма']].concat(Object.keys(SRC).map(k=>[k,SRC[k]])).forEach(o=>fs.append(new Option(o[1],o[0])));fs.value=st.f;fs.onchange=()=>{st.f=fs.value;fill();};
  const inp=el('input','bsearch');inp.type='search';inp.placeholder='Поиск: тема, имя, вопрос…';inp.value=st.q;const list=el('div','blist'),cnt=el('div','note');
  const fill=()=>{list.innerHTML='';const q=st.q.toLowerCase();let n=0;LETTERS.forEach((y,i)=>{if(st.f!=='all'&&y.src!==st.f)return;if(q&&!(y.subject+' '+y.name+' '+y.about+' '+y.body).toLowerCase().includes(q))return;n++;const bt=el('button','bitem'+(i===st.i?' on':''),y.n+'. '+esc(y.subject)+' · '+esc(y.name)+'<small>'+SRC[y.src]+' · о: '+esc(y.about)+'</small>');bt.type='button';bt.onclick=()=>{st.i=i;st.open={};redraw();};list.append(bt);});cnt.textContent='показано: '+n;};
  inp.oninput=()=>{st.q=inp.value;fill();};fill();a.append(fs,inp,cnt,list);
  const x=LETTERS[st.i];m.innerHTML='<div class="row" style="margin-bottom:4px"><span class="tag">'+SRC[x.src]+'</span></div>'+kim(x);
  const nv=el('div','row');nv.append(btn('Написать это письмо',()=>{S.wr={i:st.i,f:'all'};goTo('write');},'main'));if(x.model)nv.append(btn('Готовое письмо',()=>overlay('Образец · '+words(x.model)+' слов',el('pre','model',model(x)))));m.append(nv);
  r.append(el('h3',null,'Ответы и вопросы'));
  if(x.ans)x.qs.forEach((q,i)=>{const d=el('div','bq','<b class="en">Q'+(i+1)+'. '+esc(q)+'</b>');if(st.open[i])d.append(el('div','a en',ED.t(x.mkey+'.'+i+'.a',x.ans[i])));else d.append(btn('Примерный ответ',()=>{st.open[i]=1;redraw();},'sm'));r.append(d);});
  else if(x.abc)x.abc.qs.forEach((q,i)=>{const d=el('div','bq','<b class="en">Q'+(i+1)+'. '+esc(q.t)+'</b>');if(st.open[i])d.append(el('div','a en',q.m.map(z=>esc(z[0])).join('<br>')));else d.append(btn('Модели ответа',()=>{st.open[i]=1;redraw();},'sm'));r.append(d);});
  else if(x.sup){const d=el('div','bq','<b>Фразы-опоры</b>');if(st.open.s)d.append(el('div','a',ul(x.sup.map(esc))));else d.append(btn('Показать',()=>{st.open.s=1;redraw();},'sm'));r.append(d);}
  else r.append(el('p','note','К этому заданию нет образцов ответов: напиши письмо и отправь учителю.'));
  const asks=x.ask||(x.abc?x.abc.sets[0].map(z=>z[0]):null);if(asks){const d=el('div','bq','<b>3 вопроса о: '+esc(x.about)+'</b>');if(st.open.ask)d.append(el('div','a en',asks.map(esc).join('<br>')));else d.append(btn('Примерные вопросы',()=>{st.open.ask=1;redraw();},'sm'));r.append(d);}
  b.append(a,m,r);const on=list.querySelector('.on');if(on)setTimeout(()=>on.scrollIntoView({block:'nearest'}),0);
};

/* 14. Самопроверка и баллы */
VIEW.check=function(){
  S.ck=S.ck||{asp:[2,2,2,2,2,2],org:0,lg:0,op:0,vol:1};const st=S.ck;hdr('Самопроверка и баллы',null,'Лист самопроверки · критерии и дополнительная схема ФИПИ');
  const b=body(),a=panel('w35'),m=panel('grow'),r=panel('w25');
  a.append(el('h3',null,'Лист самопроверки'));SELF.forEach(s=>{const l=el('label','ck'),i=el('input');i.type='checkbox';l.append(i,el('div',null,esc(s)));a.append(l);});
  m.append(el('h3',null,'Оцени письмо по схеме эксперта'));const vol=el('div','row');vol.append(el('b',null,'Объём:'));[['90–154 слова',1],['меньше 90',0]].forEach(([n,v])=>{const bt=btn(n,()=>{st.vol=v;redraw();},'sm'+(st.vol===v?' main':''));vol.append(bt);});m.append(vol);
  m.append(el('h4',null,'К1 · аспекты'));['Ответ на вопрос 1','Ответ на вопрос 2','Ответ на вопрос 3','Три вопроса по теме из инструкции','Вежливость: благодарность, надежда на контакт','Стиль: обращение, завершающая фраза, подпись'].forEach((as,k)=>{const rw=el('div','row');rw.style.margin='2px 0';rw.append(el('span',null,(k+1)+'. '+as));const g=el('div','seg sp');[['раскрыт',2],['неполно',1],['нет',0]].forEach(([n,v])=>{const bt=el('button','segb'+(st.asp[k]===v?' on':''),n);bt.type='button';bt.onclick=()=>{st.asp[k]=v;redraw();};g.append(bt);});rw.append(g);m.append(rw);});
  const ctr=(lab,key,max)=>{const rw=el('div','ctr');rw.append(el('span',null,lab),btn('−',()=>{st[key]=Math.max(0,st[key]-1);redraw();},'sm'),el('b',null,String(st[key])),btn('+',()=>{st[key]=Math.min(max,st[key]+1);redraw();},'sm'));return rw;};
  m.append(el('h4',null,'К2 · ошибки в организации текста'),el('p','note',ORGS.join(' · ')+'; адрес и дата; две завершающие фразы.'),ctr('Ошибок:','org',9),el('h4',null,'К3 · языковые ошибки'),ctr('Лексико-грамматических:','lg',9),ctr('Орфографических и пунктуационных:','op',9));
  const miss=st.asp.filter(v=>v===0).length,part=st.asp.filter(v=>v===1).length;
  let k1;if(!st.vol||miss>=3||part===6||(miss===1&&part>=4)||(miss===2&&part>=2))k1=0;else if(miss===0&&part<=1)k1=2;else k1=1;
  const k2=st.org<=1?2:st.org<=3?1:0,f=n=>n<=2?2:n<=4?1:0,k3=Math.min(f(st.lg),f(st.op)),tot=k1===0?0:k1+k2+k3;
  r.append(el('h3',null,'Результат'),el('div','kv','<span>К1</span><b>'+k1+'</b><span>К2</span><b>'+(k1===0?0:k2)+'</b><span>К3</span><b>'+(k1===0?0:k3)+'</b>'),el('div','big',tot+' / 6'));
  if(k1===0)r.append(el('div','verdict bad','0 по К1 – 0 за всё задание.'));
  r.append(el('p','note','К1 = 2: все аспекты раскрыты, допускается 1 неполный. К2 = 2: не больше 1 ошибки. К3 = 2: не больше 1–2 ошибок каждого вида.'),btn('Сбросить',()=>{S.ck=null;redraw();},'sm'));
  b.append(a,m,r);
};

Clock.mount();paintTabs();go(0);
