// Unit-тест чистых функций валидации импорта (без браузера/DOM).
const HOMEWORK_STATUSES = ['none','assigned','completed','overdue'];
const LESSON_STATUSES = ['planned','done','cancelled'];

function isNonEmptyStr(v){ return typeof v === 'string' && v.trim().length > 0; }
function isStr(v){ return typeof v === 'string'; }
function isArrayOfStr(v){ return Array.isArray(v) && v.every(x=>typeof x==='string'); }
function isValidDateStr(v){
  if(typeof v !== 'string') return false;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + 'T00:00:00');
  return !isNaN(d.getTime());
}
function validateImport(parsed){
  const errors = [];
  if(parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)){
    errors.push('Корень должен быть объектом.');
    return {ok:false,errors};
  }
  if(!Array.isArray(parsed.students)) errors.push('Отсутствует массив students.');
  if(!Array.isArray(parsed.lessons)) errors.push('Отсутствует массив lessons.');
  if(errors.length) return {ok:false,errors};

  const studentIds = new Set();
  parsed.students.forEach((s,i)=>{
    const p = `students[${i}]`;
    if(!isNonEmptyStr(s.id)){ errors.push(`${p}: поле id обязательно.`); }
    else{
      if(studentIds.has(s.id)) errors.push(`${p}: дубликат id "${s.id}".`);
      studentIds.add(s.id);
    }
    if(!isNonEmptyStr(s.name)) errors.push(`${p}: поле name обязательно.`);
    if(!HOMEWORK_STATUSES.includes(s.homeworkStatus)) errors.push(`${p}: недопустимый статус ДЗ.`);
  });

  const lessonIds = new Set();
  parsed.lessons.forEach((l,i)=>{
    const p = `lessons[${i}]`;
    if(!isNonEmptyStr(l.id)){ errors.push(`${p}: поле id обязательно.`); }
    else{
      if(lessonIds.has(l.id)) errors.push(`${p}: дубликат id "${l.id}".`);
      lessonIds.add(l.id);
    }
    if(!isNonEmptyStr(l.studentId)) errors.push(`${p}: поле studentId обязательно.`);
    else if(!studentIds.has(l.studentId)) errors.push(`${p}: studentId "${l.studentId}" не найден среди учеников.`);
    if(!isValidDateStr(l.date)) errors.push(`${p}: дата должна быть в формате ГГГГ-ММ-ДД.`);
    if(!isNonEmptyStr(l.topic)) errors.push(`${p}: поле topic обязательно.`);
    if(!LESSON_STATUSES.includes(l.status)) errors.push(`${p}: недопустимый статус занятия.`);
    if(!HOMEWORK_STATUSES.includes(l.homeworkStatus)) errors.push(`${p}: недопустимый статус ДЗ.`);
  });
  return {ok: errors.length===0, errors};
}

let pass=0, fail=0;
function t(name, cond){
  if(cond){ pass++; console.log('PASS:', name); }
  else { fail++; console.log('FAIL:', name); }
}

// 1. Валидный импорт проходит
const good = {
  version: 2,
  students: [{id:'s-1',name:'А',textbook:'T',level:'A2',lastTopic:'',vocab:[],grammar:[],homework:'',homeworkStatus:'none',lessonKey:'',color:'#000',createdAt:'2026-10-27'}],
  lessons: [{id:'l-1',studentId:'s-1',date:'2026-10-27',topic:'T',homework:'',status:'done',homeworkStatus:'completed',notes:'',createdAt:'2026-10-27'}]
};
t('валидный импорт проходит', validateImport(good).ok === true);

// 2. Отсутствуют массивы -> ошибка
const r2 = validateImport({not:'x'});
t('отсутствуют массивы -> ошибка', r2.ok === false && r2.errors.length >= 2);

// 3. Ссылка на несуществующего ученика -> ошибка
const badRef = {
  version:2,
  students:[{id:'s-1',name:'А',textbook:'',level:'',lastTopic:'',vocab:[],grammar:[],homework:'',homeworkStatus:'none',lessonKey:'',color:'',createdAt:''}],
  lessons:[{id:'l-1',studentId:'s-99',date:'2026-10-27',topic:'T',homework:'',status:'done',homeworkStatus:'none',notes:'',createdAt:''}]
};
const r3 = validateImport(badRef);
t('ссылка на несуществующего ученика -> ошибка', r3.ok === false && r3.errors.some(e=>e.includes('не найден')));

// 4. Неверный формат даты -> ошибка
const badDate = {
  version:2,
  students:[{id:'s-1',name:'А',textbook:'',level:'',lastTopic:'',vocab:[],grammar:[],homework:'',homeworkStatus:'none',lessonKey:'',color:'',createdAt:''}],
  lessons:[{id:'l-1',studentId:'s-1',date:'not-a-date',topic:'T',homework:'',status:'done',homeworkStatus:'none',notes:'',createdAt:''}]
};
const r4 = validateImport(badDate);
t('неверный формат даты -> ошибка', r4.ok === false && r4.errors.some(e=>e.includes('дата')));

// 5. Дубликат id ученика -> ошибка
const dup = {
  version:2,
  students:[
    {id:'s-1',name:'А',textbook:'',level:'',lastTopic:'',vocab:[],grammar:[],homework:'',homeworkStatus:'none',lessonKey:'',color:'',createdAt:''},
    {id:'s-1',name:'Б',textbook:'',level:'',lastTopic:'',vocab:[],grammar:[],homework:'',homeworkStatus:'none',lessonKey:'',color:'',createdAt:''}
  ],
  lessons:[]
};
const r5 = validateImport(dup);
t('дубликат id ученика -> ошибка', r5.ok === false);

// 6. Дубликат id занятия -> ошибка
const dupL = {
  version:2,
  students:[{id:'s-1',name:'А',textbook:'',level:'',lastTopic:'',vocab:[],grammar:[],homework:'',homeworkStatus:'none',lessonKey:'',color:'',createdAt:''}],
  lessons:[
    {id:'l-1',studentId:'s-1',date:'2026-10-27',topic:'T',homework:'',status:'done',homeworkStatus:'none',notes:'',createdAt:''},
    {id:'l-1',studentId:'s-1',date:'2026-10-27',topic:'T2',homework:'',status:'done',homeworkStatus:'none',notes:'',createdAt:''}
  ]
};
const r6 = validateImport(dupL);
t('дубликат id занятия -> ошибка', r6.ok === false);

// 7. Локальная дата в формате YYYY-MM-DD
function localDateString(d = new Date()){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
t('локальная дата YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(localDateString(new Date(2026,9,27))));

console.log('\nRESULT:', pass, 'passed,', fail, 'failed');
process.exit(fail > 0 ? 1 : 0);
