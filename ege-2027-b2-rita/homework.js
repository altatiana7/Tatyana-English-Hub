/* ДОМАШНЕЕ ЗАДАНИЕ Риты (только её сайт; у Кати – свой файл).
   На их сайте открыто только то, что записано в HW.items; всё остальное закрыто.
   Татьяна пишет после урока, что не успели, – эти задания добавляются сюда.

   Как записывать задания:
     'block1:g2'   – блок 1, грамматика, текст 2   (g1–g12)
     'block1:w3'   – блок 1, словообразование, текст 3 (w1–w8)
     'block1:r1'   – блок 1, чтение, текст 1       (r1–r3)
     'block1:l2'   – блок 1, письмо 37, письмо 2   (l1–l4)
     'lessonw1:words' / 'lessonw1:hunt' / 'lessonw1:match' – карточки слов, Error hunter, Match
     'lessonw1:t1-1', 't1-2' – задание 1, текст 1 или 2
     'lessonw1:t2-1', 't2-2' – задание 2, объявление 1 или 2
     'lessonw1:iv1', 'iv2', 'iv3' – задание 3, набор интервью 1–3
     'lessonw1:t4-1' – задание 4 по фото, 'lessonw1:t4-2' – монолог Your best friend
     'lesson1', 'home1', 'write37', 'write38', 'russia' – страница целиком */
window.HW={
  set:'',          /* дата, когда задано, например '16 Oct' */
  due:'',          /* к какому уроку, например '20 Oct' */
  items:[]
};

(function(){
  const BB=()=>window.B1||{};
  const N={g:'Grammar',w:'Word formation',r:'Reading',l:'Letter 37'};
  const W={words:'Words · cards',hunt:'Error hunter',match:'Match',
    't1-1':'Task 1 · reading aloud · text 1','t1-2':'Task 1 · reading aloud · text 2',
    't2-1':'Task 2 · questions · advert 1','t2-2':'Task 2 · questions · advert 2',
    iv1:'Task 3 · interview · set 1',iv2:'Task 3 · interview · set 2',iv3:'Task 3 · interview · set 3',
    't4-1':'Task 4 · photos','t4-2':'Monologue · your best friend'};
  const P={lesson1:'Diagnostic test',home1:'Diagnostic · home part',write37:'Letter 37 · trainer',write38:'Essay 38 · trainer',russia:'Russia · speaking'};
  /* открыто ли задание: id вида 'block1:g2' или страница 'write37' */
  HW.has=id=>HW.items.indexOf(id)>=0;
  /* открыта ли страница хоть одним заданием */
  HW.page=pg=>HW.items.some(x=>x===pg||x.indexOf(pg+':')===0);
  /* задания этой страницы: ['g2','iv1', …] */
  HW.of=pg=>HW.items.filter(x=>x.indexOf(pg+':')===0).map(x=>x.slice(pg.length+1));
  HW.label=id=>{const [pg,k]=id.split(':');if(!k)return P[pg]||pg;
    if(pg==='block1'){const t=k[0],n=+k.slice(1);let name='';try{const B=BB();const L={g:B.grammar,w:B.wf,r:B.reading,l:B.letters}[t];name=t==='l'?L[n-1].subject:L[n-1].t;}catch(e){}return 'Block 1 · '+N[t]+' · text '+n+(name?' · '+name:'');}
    return 'Lesson 1 · '+(W[k]||k);};
  HW.href=id=>{const [pg,k]=id.split(':');return pg+'.html'+(k?'#'+k:'');};
})();
