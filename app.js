/* BARBELL — локальный трекер тренировок. Все данные хранятся только в этом браузере (localStorage). */

const STORAGE_KEY = 'zhelezo_state_v1';
const WD = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const WD_FULL = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const FIELD_META = {
  weight:  {label:'Вес, кг', short:'кг'},
  reps:    {label:'Повторы', short:'повт'},
  sets:    {label:'Подходы', short:'сет'},
  height:  {label:'Высота/наклон', short:'см'},
  duration:{label:'Время, мин', short:'мин'},
  distance:{label:'Дистанция, км', short:'км'},
};

/* ---------------- Библиотека упражнений по группам мышц (для подсказок при добавлении) ---------------- */
const EXERCISE_LIBRARY = {
  'Грудь': [
    {name:'Жим лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим гантелей лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим на наклонной скамье', fields:{weight:1,reps:1,sets:1,height:1}},
    {name:'Жим гантелей на наклонной скамье', fields:{weight:1,reps:1,sets:1,height:1}},
    {name:'Разведение гантелей лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Сведение рук в кроссовере', fields:{weight:1,reps:1,sets:1}},
    {name:'Отжимания на брусьях', fields:{reps:1,sets:1,weight:1}},
    {name:'Отжимания от пола', fields:{reps:1,sets:1}},
    {name:'Пуловер с гантелью', fields:{weight:1,reps:1,sets:1}},
  ],
  'Спина': [
    {name:'Становая тяга', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга штанги в наклоне', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга гантели в наклоне', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга верхнего блока', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга нижнего блока (горизонтальная)', fields:{weight:1,reps:1,sets:1}},
    {name:'Подтягивания', fields:{reps:1,sets:1}},
    {name:'Подтягивания с весом', fields:{weight:1,reps:1,sets:1}},
    {name:'Гиперэкстензия', fields:{reps:1,sets:1,weight:1}},
    {name:'Шраги со штангой', fields:{weight:1,reps:1,sets:1}},
  ],
  'Ноги': [
    {name:'Приседания со штангой', fields:{weight:1,reps:1,sets:1}},
    {name:'Фронтальные приседания', fields:{weight:1,reps:1,sets:1}},
    {name:'Присед в Смите', fields:{weight:1,reps:1,sets:1}},
    {name:'Гакк-присед', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим ногами', fields:{weight:1,reps:1,sets:1}},
    {name:'Румынская тяга', fields:{weight:1,reps:1,sets:1}},
    {name:'Выпады с гантелями', fields:{weight:1,reps:1,sets:1}},
    {name:'Болгарские сплит-приседания', fields:{weight:1,reps:1,sets:1}},
    {name:'Разгибание ног в тренажёре', fields:{weight:1,reps:1,sets:1}},
    {name:'Сгибание ног в тренажёре', fields:{weight:1,reps:1,sets:1}},
    {name:'Подъём на носки стоя', fields:{weight:1,reps:1,sets:1}},
  ],
  'Плечи': [
    {name:'Жим стоя (армейский жим)', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим гантелей сидя', fields:{weight:1,reps:1,sets:1}},
    {name:'Махи гантелями в стороны', fields:{weight:1,reps:1,sets:1}},
    {name:'Махи гантелями в наклоне (задняя дельта)', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга штанги к подбородку', fields:{weight:1,reps:1,sets:1}},
  ],
  'Руки': [
    {name:'Подъём штанги на бицепс', fields:{weight:1,reps:1,sets:1}},
    {name:'Подъём гантелей на бицепс', fields:{weight:1,reps:1,sets:1}},
    {name:'Молотки с гантелями', fields:{weight:1,reps:1,sets:1}},
    {name:'Французский жим', fields:{weight:1,reps:1,sets:1}},
    {name:'Разгибания на трицепс в блоке', fields:{weight:1,reps:1,sets:1}},
    {name:'Отжимания узким хватом', fields:{reps:1,sets:1}},
  ],
  'Ягодицы': [
    {name:'Ягодичный мост', fields:{weight:1,reps:1,sets:1}},
    {name:'Ягодичный мост со штангой (хип-траст)', fields:{weight:1,reps:1,sets:1}},
    {name:'Приседания сумо', fields:{weight:1,reps:1,sets:1}},
    {name:'Отведение ноги в кроссовере', fields:{weight:1,reps:1,sets:1}},
    {name:'Отведение ноги в тренажёре', fields:{weight:1,reps:1,sets:1}},
    {name:'Ходьба с резинкой (монстр-шаг)', fields:{reps:1,sets:1}},
  ],
  'Пресс': [
    {name:'Планка', fields:{duration:1,sets:1}},
    {name:'Скручивания', fields:{reps:1,sets:1}},
    {name:'Подъём ног в висе', fields:{reps:1,sets:1}},
    {name:'Косые скручивания', fields:{reps:1,sets:1}},
    {name:'Русский твист', fields:{reps:1,sets:1,weight:1}},
  ],
  'Кардио / функционалка': [
    {name:'Кардио (бег / велосипед)', fields:{duration:1,distance:1}},
    {name:'Берпи', fields:{reps:1,sets:1,duration:1}},
    {name:'Гребля', fields:{duration:1,distance:1}},
    {name:'Прыжки на скакалке', fields:{duration:1}},
    {name:'Толчок гири', fields:{weight:1,reps:1,sets:1}},
    {name:'Взятие штанги на грудь', fields:{weight:1,reps:1,sets:1}},
    {name:'Прыжки на тумбу', fields:{reps:1,sets:1,height:1}},
  ],
};
function findLibraryExercise(name){
  for(const group of Object.values(EXERCISE_LIBRARY)){
    const found = group.find(e=>e.name===name);
    if(found) return found;
  }
  return null;
}

/* ---------------- Готовые записи для рекордов (три базовых силовых движения + предложенные) ---------------- */
const MAIN_LIFTS = [
  {key:'squat', name:'Присед со штангой'},
  {key:'bench', name:'Жим лёжа'},
  {key:'deadlift', name:'Становая тяга'},
];
const RECORD_SUGGESTIONS = [
  'Жим гантелей лёжа на наклонной','Ягодичный мост со штангой (хип-траст)','Армейский жим (жим стоя)',
  'Тяга штанги в наклоне','Подтягивания с весом','Отжимания на брусьях с весом','Румынская тяга',
  'Жим ногами','Фронтальные приседания','Тяга гантели в наклоне',
];

/* ---------------- Templates (авторские схемы на основе методик известных силовых, бодибилдинг- и кроссфит-программ) ---------------- */
const TEMPLATES = [
  {
    id:'fullbody-beginner', name:'Фулбоди для новичка', level:['beginner'],
    basedOn:'На основе Starting Strength Марка Риппето — классической программы для новичков с линейной прогрессией на базовых движениях',
    desc:'Одна тренировка — всё тело, 3 раза в неделю. Простая линейная прогрессия на базе, без сплитов.',
    days:[[
      {name:'Приседания со штангой', fields:{weight:1,reps:1,sets:1}},
      {name:'Жим лёжа', fields:{weight:1,reps:1,sets:1}},
      {name:'Тяга штанги в наклоне', fields:{weight:1,reps:1,sets:1}},
      {name:'Становая тяга', fields:{weight:1,reps:1,sets:1}},
      {name:'Планка', fields:{duration:1,sets:1}},
    ]]
  },
  {
    id:'push-pull-legs', name:'Push / Pull / Legs', level:['intermediate','advanced'],
    basedOn:'Классический трёхдневный силовой сплит бодибилдинга — жим/тяга/ноги, используемый большинством современных атлетов',
    desc:'Трёхдневный силовой сплит: жим, тяга, ноги. Масштабируется на 3–6 тренировок в неделю по кругу.',
    days:[
      [{name:'Жим лёжа',fields:{weight:1,reps:1,sets:1}},{name:'Жим на наклонной скамье',fields:{weight:1,reps:1,sets:1,height:1}},{name:'Жим стоя (армейский жим)',fields:{weight:1,reps:1,sets:1}},{name:'Разведение гантелей лёжа',fields:{weight:1,reps:1,sets:1}},{name:'Французский жим',fields:{weight:1,reps:1,sets:1}}],
      [{name:'Становая тяга',fields:{weight:1,reps:1,sets:1}},{name:'Подтягивания',fields:{weight:1,reps:1,sets:1}},{name:'Тяга штанги в наклоне',fields:{weight:1,reps:1,sets:1}},{name:'Тяга верхнего блока',fields:{weight:1,reps:1,sets:1}},{name:'Подъём штанги на бицепс',fields:{weight:1,reps:1,sets:1}}],
      [{name:'Приседания со штангой',fields:{weight:1,reps:1,sets:1}},{name:'Румынская тяга',fields:{weight:1,reps:1,sets:1}},{name:'Жим ногами',fields:{weight:1,reps:1,sets:1}},{name:'Выпады с гантелями',fields:{weight:1,reps:1,sets:1}},{name:'Подъём на носки стоя',fields:{weight:1,reps:1,sets:1}}],
    ]
  },
  {
    id:'bodybuilding-mass', name:'Бодибилдинг: масса', level:['intermediate','advanced'],
    basedOn:'На основе классического сплита золотой эры бодибилдинга (Арнольд Шварценеггер) — фокус на объём и гипертрофию по группам мышц',
    desc:'Сплит на гипертрофию по группам мышц — классическая схема массонабора с акцентом на объём.',
    days:[
      [{name:'Жим лёжа',fields:{weight:1,reps:1,sets:1}},{name:'Жим на наклонной скамье',fields:{weight:1,reps:1,sets:1,height:1}},{name:'Сведение рук в кроссовере',fields:{weight:1,reps:1,sets:1}},{name:'Французский жим',fields:{weight:1,reps:1,sets:1}},{name:'Отжимания на брусьях',fields:{reps:1,sets:1,weight:1}}],
      [{name:'Тяга штанги в наклоне',fields:{weight:1,reps:1,sets:1}},{name:'Тяга верхнего блока',fields:{weight:1,reps:1,sets:1}},{name:'Гиперэкстензия',fields:{reps:1,sets:1,weight:1}},{name:'Подъём штанги на бицепс',fields:{weight:1,reps:1,sets:1}},{name:'Молотки с гантелями',fields:{weight:1,reps:1,sets:1}}],
      [{name:'Приседания со штангой',fields:{weight:1,reps:1,sets:1}},{name:'Жим ногами',fields:{weight:1,reps:1,sets:1}},{name:'Разгибание ног в тренажёре',fields:{weight:1,reps:1,sets:1}},{name:'Сгибание ног в тренажёре',fields:{weight:1,reps:1,sets:1}},{name:'Жим стоя (армейский жим)',fields:{weight:1,reps:1,sets:1}},{name:'Махи гантелями в стороны',fields:{weight:1,reps:1,sets:1}}],
    ]
  },
  {
    id:'wendler-531', name:'5/3/1', level:['intermediate','advanced'],
    basedOn:'На основе программы 5/3/1 Джима Уэндлера — одной из самых известных силовых программ для роста базовых показателей',
    desc:'Четырёхдневный силовой цикл вокруг четырёх основных движений с волнообразной нагрузкой по неделям.',
    days:[
      [{name:'Жим лёжа',fields:{weight:1,reps:1,sets:1}},{name:'Жим гантелей на наклонной скамье',fields:{weight:1,reps:1,sets:1,height:1}},{name:'Разгибания на трицепс в блоке',fields:{weight:1,reps:1,sets:1}}],
      [{name:'Приседания со штангой',fields:{weight:1,reps:1,sets:1}},{name:'Румынская тяга',fields:{weight:1,reps:1,sets:1}},{name:'Планка',fields:{duration:1,sets:1}}],
      [{name:'Жим стоя (армейский жим)',fields:{weight:1,reps:1,sets:1}},{name:'Тяга верхнего блока',fields:{weight:1,reps:1,sets:1}},{name:'Подъём гантелей на бицепс',fields:{weight:1,reps:1,sets:1}}],
      [{name:'Становая тяга',fields:{weight:1,reps:1,sets:1}},{name:'Подтягивания',fields:{reps:1,sets:1}},{name:'Гиперэкстензия',fields:{reps:1,sets:1,weight:1}}],
    ]
  },
  {
    id:'female-tone', name:'Тонус и рельеф', level:['beginner','intermediate'],
    basedOn:'Популярная схема фитнес-лагерей и бьюти-программ — акцент на ягодицы, ноги и кор при умеренной нагрузке на верх тела',
    desc:'Акцент на ягодицы, ноги и кор при умеренной нагрузке на верх тела.',
    days:[
      [{name:'Ягодичный мост со штангой (хип-траст)',fields:{weight:1,reps:1,sets:1}},{name:'Приседания сумо',fields:{weight:1,reps:1,sets:1}},{name:'Отведение ноги в кроссовере',fields:{weight:1,reps:1,sets:1}},{name:'Болгарские сплит-приседания',fields:{weight:1,reps:1,sets:1}},{name:'Ходьба с резинкой (монстр-шаг)',fields:{reps:1,sets:1}}],
      [{name:'Тяга верхнего блока',fields:{weight:1,reps:1,sets:1}},{name:'Жим гантелей сидя',fields:{weight:1,reps:1,sets:1}},{name:'Тяга гантели в наклоне',fields:{weight:1,reps:1,sets:1}},{name:'Скручивания',fields:{reps:1,sets:1}},{name:'Русский твист',fields:{reps:1,sets:1,weight:1}}],
    ]
  },
  {
    id:'functional', name:'Функциональный (кроссфит-стиль)', level:['intermediate','advanced'],
    basedOn:'Составлено по мотивам эталонных WOD CrossFit ("Girls" — Fran, Cindy) — сила и выносливость в одной тренировке',
    desc:'Высокоинтенсивные комплексы из функционального многоборья — сила и выносливость в одной тренировке.',
    days:[
      [{name:'Берпи',fields:{reps:1,sets:1,duration:1}},{name:'Взятие штанги на грудь',fields:{weight:1,reps:1,sets:1}},{name:'Прыжки на тумбу',fields:{reps:1,sets:1,height:1}},{name:'Подтягивания',fields:{reps:1,sets:1}}],
      [{name:'Толчок гири',fields:{weight:1,reps:1,sets:1}},{name:'Подтягивания',fields:{reps:1,sets:1}},{name:'Гребля',fields:{duration:1,distance:1}},{name:'Прыжки на скакалке',fields:{duration:1}}],
    ]
  },
];
const CARDIO_DEFAULT = [{name:'Кардио (бег / велосипед)', fields:{duration:1,distance:1}}];

/* ---------------- State ---------------- */
let state = load();
function defaultState(){
  return {
    onboarded:false,
    profile:{gender:null, level:null},
    schedule:{training:[], cardio:[]}, // индексы 0..6, Пн..Вс
    dayExercises:{0:[],1:[],2:[],3:[],4:[],5:[],6:[]}, // weekday -> [exerciseId]
    exercises:{}, // id -> {id,name,fields}
    logs:{}, // dateISO -> {exerciseId: {field:value}}
    planTemplateId:null,
    records:{
      lifts:{squat:null, bench:null, deadlift:null}, // {value, unit, date}
      custom:[], // {id, name, value, unit, date}
    },
  };
}
function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){ return defaultState(); }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function uid(){ return Math.random().toString(36).slice(2,9); }

/* ---------------- Date helpers ---------------- */
function toISO(d){
  // ВАЖНО: раньше тут был d.toISOString().slice(0,10) — он переводит время в UTC
  // и в часовых поясах восточнее UTC (вся Россия) сдвигает дату на день назад.
  // Из-за этого стрелка "вперёд" в "Сегодня" визуально не работала, а тап по дню
  // недели в "Неделе" открывал предыдущий день. Берём локальные компоненты даты.
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function fromISO(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function mondayIndex(jsDay){ return (jsDay+6)%7; } // JS: 0=Sun..6=Sat -> 0=Mon..6=Sun
function startOfWeek(d){ const i=mondayIndex(d.getDay()); const r=new Date(d); r.setDate(d.getDate()-i); r.setHours(0,0,0,0); return r; }
function addDays(d,n){ const r=new Date(d); r.setDate(d.getDate()+n); return r; }
function fmtDay(d){ return d.getDate(); }
function fmtMonthRange(weekStart){
  const end = addDays(weekStart,6);
  const mNames=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  if(weekStart.getMonth()===end.getMonth()) return `${fmtDay(weekStart)}–${fmtDay(end)} ${mNames[weekStart.getMonth()]}`;
  return `${fmtDay(weekStart)} ${mNames[weekStart.getMonth()]} – ${fmtDay(end)} ${mNames[end.getMonth()]}`;
}

function dayType(weekdayIdx){
  if(state.schedule.training.includes(weekdayIdx)) return 'training';
  if(state.schedule.cardio.includes(weekdayIdx)) return 'cardio';
  return 'rest';
}

/* Прогрессия: последнее сохранённое значение переносится вперёд на любую дату — неделю, месяц, год. */
function getSuggested(exerciseId, targetISO){
  let best=null;
  for(const d in state.logs){
    if(d<=targetISO && state.logs[d][exerciseId] && (!best || d>best)) best=d;
  }
  return best ? state.logs[best][exerciseId] : null;
}

/* ---------------- UI state (в памяти, не сохраняется) ---------------- */
let ui = {
  tab:'today',
  today: toISO(new Date()),
  viewDate: toISO(new Date()),
  weekStart: startOfWeek(new Date()),
};

/* ================= ONBOARDING ================= */
let obState = { step:0, gender:null, level:null, training:[], cardio:[], template:null };

function startOnboarding(){
  document.getElementById('onboarding').classList.remove('hidden');
  buildWeekdayPicker('pick-training','training');
  buildWeekdayPicker('pick-cardio','cardio');
  buildTemplateList();
  bindOnboardingNav();
  renderOnbStep();
}

function buildWeekdayPicker(containerId, kind){
  const el = document.getElementById(containerId);
  el.innerHTML='';
  WD.forEach((label,i)=>{
    const chip=document.createElement('button');
    chip.className='wd-chip'; chip.textContent=label; chip.dataset.kind=kind; chip.dataset.i=i;
    chip.addEventListener('click',()=>{
      const arr=obState[kind];
      const pos=arr.indexOf(i);
      if(pos>-1) arr.splice(pos,1); else arr.push(i);
      chip.classList.toggle('on');
      updateOnbNextEnabled();
    });
    el.appendChild(chip);
  });
}

function buildTemplateList(){
  const el = document.getElementById('template-list');
  el.innerHTML='';
  TEMPLATES.forEach(t=>{
    const card=document.createElement('button');
    card.className='template-card'; card.dataset.template=t.id;
    card.innerHTML=`<div class="t-name">${t.name}</div><div class="t-meta">${levelLabel(t.level)}</div><div class="t-desc">${t.desc}</div>${t.basedOn?`<div class="t-based">${t.basedOn}</div>`:''}`;
    card.addEventListener('click',()=>selectTemplate(t.id,card));
    el.appendChild(card);
  });
  document.querySelector('[data-template="custom"]').addEventListener('click',(e)=>selectTemplate('custom',e.currentTarget));
}
function levelLabel(levels){
  const map={beginner:'новичок',intermediate:'средний',advanced:'продвинутый'};
  return levels.map(l=>map[l]).join(' / ');
}
function selectTemplate(id, el){
  obState.template=id;
  document.querySelectorAll('.template-card,[data-template="custom"]').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  updateOnbNextEnabled();
}

function renderOnbStep(){
  document.querySelectorAll('.onb-step').forEach(s=>s.classList.toggle('hidden', Number(s.dataset.step)!==obState.step));
  document.querySelectorAll('.onb-progress .dot').forEach(d=>d.classList.toggle('active', Number(d.dataset.step)<=obState.step));
  document.getElementById('onb-back').classList.toggle('hidden', obState.step===0);
  document.getElementById('onb-next').textContent = obState.step===3 ? 'Начать' : 'Далее';
  updateOnbNextEnabled();
}
function updateOnbNextEnabled(){
  const btn=document.getElementById('onb-next');
  let ok=true;
  if(obState.step===0) ok=!!obState.gender;
  if(obState.step===1) ok=!!obState.level;
  if(obState.step===2) ok=obState.training.length>0;
  if(obState.step===3) ok=!!obState.template;
  btn.disabled=!ok;
}

function bindOnboardingNav(){
  document.querySelectorAll('.choice-tile[data-field]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const field=btn.dataset.field, val=btn.dataset.value;
      obState[field]=val;
      document.querySelectorAll(`.choice-tile[data-field="${field}"]`).forEach(b=>b.classList.toggle('selected', b===btn));
      updateOnbNextEnabled();
    });
  });
  document.getElementById('onb-next').addEventListener('click',()=>{
    if(obState.step<3){ obState.step++; renderOnbStep(); }
    else finishOnboarding();
  });
  document.getElementById('onb-back').addEventListener('click',()=>{
    if(obState.step>0){ obState.step--; renderOnbStep(); }
  });
}

function finishOnboarding(){
  state.profile.gender=obState.gender;
  state.profile.level=obState.level;
  state.schedule.training=[...obState.training].sort((a,b)=>a-b);
  state.schedule.cardio=[...obState.cardio].sort((a,b)=>a-b);
  state.planTemplateId=obState.template;
  applyTemplateToSchedule(obState.template);
  state.onboarded=true;
  save();
  document.getElementById('onboarding').classList.add('hidden');
  renderApp();
}

function applyTemplateToSchedule(templateId){
  // раскладываем шаблон по выбранным дням силовых, кардио получает дефолтную активность
  state.schedule.training.forEach((wd,idx)=>{
    if(templateId==='custom'){ state.dayExercises[wd]=state.dayExercises[wd]||[]; return; }
    const tpl = TEMPLATES.find(t=>t.id===templateId);
    const pattern = tpl.days[idx % tpl.days.length];
    state.dayExercises[wd] = pattern.map(ex=>{
      const id=uid();
      state.exercises[id]={id,name:ex.name,fields:Object.assign({weight:0,reps:0,sets:0,height:0,duration:0,distance:0},ex.fields)};
      return id;
    });
  });
  state.schedule.cardio.forEach(wd=>{
    state.dayExercises[wd] = CARDIO_DEFAULT.map(ex=>{
      const id=uid();
      state.exercises[id]={id,name:ex.name,fields:Object.assign({weight:0,reps:0,sets:0,height:0,duration:0,distance:0},ex.fields)};
      return id;
    });
  });
}

/* ================= APP SHELL ================= */
function renderApp(){
  const app=document.getElementById('app');
  app.innerHTML = `
    <div class="topbar">
      <div><div class="brand">BAR<b>BELL</b></div><div class="sub">${profileSummary()}</div></div>
    </div>
    <div id="tab-content"></div>
    <div class="tabbar">
      ${tabBtn('today','●','Сегодня')}
      ${tabBtn('week','▦','Неделя')}
      ${tabBtn('exercises','✚','Упражнения')}
      ${tabBtn('records','🏆','Рекорды')}
      ${tabBtn('settings','⚙','Настройки')}
    </div>
  `;
  app.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{ ui.tab=b.dataset.tab; renderApp(); }));
  renderTab();
}
function tabBtn(id,ic,label){
  return `<button class="tab-btn ${ui.tab===id?'active':''}" data-tab="${id}"><span class="ic">${ic}</span>${label}</button>`;
}
function profileSummary(){
  const g = state.profile.gender==='f'?'Девушка':'Парень';
  const lvl = {beginner:'новичок',intermediate:'средний',advanced:'продвинутый'}[state.profile.level]||'';
  return `${g} · ${lvl}`;
}
const TAB_ORDER = ['today','week','exercises','records','settings'];
function renderTab(){
  const c=document.getElementById('tab-content');
  if(ui.tab==='today') c.innerHTML=renderToday();
  if(ui.tab==='week') c.innerHTML=renderWeek();
  if(ui.tab==='exercises') c.innerHTML=renderExercisesTab();
  if(ui.tab==='records') c.innerHTML=renderRecords();
  if(ui.tab==='settings') c.innerHTML=renderSettings();
  bindTabEvents();
}

/* ---------------- Свайп между вкладками (Сегодня/Неделя/Упражнения/Рекорды/Настройки) ---------------- */
function bindSwipeNavigationOnce(){
  const root = document.getElementById('app');
  if(!root || root.dataset.swipeBound) return;
  root.dataset.swipeBound='1';
  let sx=0, sy=0, st=0, tracking=false;
  root.addEventListener('touchstart', (e)=>{
    if(e.touches.length!==1) return;
    // модальные окна добавляются в document.body отдельно от #app — если открыт оверлей, свайп не мешает
    sx=e.touches[0].clientX; sy=e.touches[0].clientY; st=Date.now(); tracking=true;
  }, {passive:true});
  root.addEventListener('touchend', (e)=>{
    if(!tracking) return; tracking=false;
    const touch=e.changedTouches[0];
    const dx=touch.clientX-sx, dy=touch.clientY-sy, dt=Date.now()-st;
    if(dt>700) return; // слишком медленно — это не свайп
    if(Math.abs(dx)<60 || Math.abs(dx)<Math.abs(dy)*1.4) return; // не горизонтальный / слишком короткий
    const idx=TAB_ORDER.indexOf(ui.tab);
    if(idx===-1) return;
    if(dx<0){ ui.tab = TAB_ORDER[(idx+1)%TAB_ORDER.length]; } // свайп влево -> следующая вкладка
    else{ ui.tab = TAB_ORDER[(idx-1+TAB_ORDER.length)%TAB_ORDER.length]; } // свайп вправо -> предыдущая
    renderApp();
  }, {passive:true});
}

/* ---------------- Today ---------------- */
function renderToday(){
  const d = fromISO(ui.viewDate);
  const wd = mondayIndex(d.getDay());
  const type = dayType(wd);
  const ids = state.dayExercises[wd]||[];
  const isToday = ui.viewDate===ui.today;
  return `
  <div class="card">
    <div class="day-heading">
      <div>
        <button class="icon-btn" id="day-prev" style="margin-right:8px">‹</button>
        <button class="icon-btn" id="day-next">›</button>
      </div>
      <span class="tag ${type}">${type==='training'?'Силовая':type==='cardio'?'Кардио':'Отдых'}</span>
    </div>
    <h2 style="margin-bottom:4px;">${WD_FULL[wd]}${isToday?' · сегодня':''}</h2>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:0 0 14px;">${fmtFullDate(d)}</p>
    ${type==='rest' && ids.length===0 ? `<div class="empty-state"><h3>День отдыха</h3><p>Можно добавить лёгкую активность, если хочется.</p></div>` : ''}
    ${ids.map(id=>renderExerciseCard(id, ui.viewDate)).join('')}
    <button class="add-exercise-btn" id="add-ex-today">+ Добавить упражнение на ${WD[wd]}</button>
  </div>`;
}
function fmtFullDate(d){
  const mNames=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${d.getDate()} ${mNames[d.getMonth()]} ${d.getFullYear()}`;
}

function renderExerciseCard(exId, dateISO){
  const ex = state.exercises[exId];
  if(!ex) return '';
  const saved = (state.logs[dateISO]||{})[exId];
  const suggested = getSuggested(exId, dateISO);
  const fieldsOn = Object.keys(ex.fields).filter(f=>ex.fields[f]);
  return `
  <div class="exercise" data-exid="${exId}">
    <div class="exercise-head">
      <div class="name">${ex.name}</div>
      <div class="actions">
        <button class="icon-btn ex-edit" data-exid="${exId}">✎</button>
        <button class="icon-btn ex-remove" data-exid="${exId}">✕</button>
      </div>
    </div>
    <div class="field-grid">
      ${fieldsOn.map(f=>{
        const val = saved ? saved[f] : (suggested ? suggested[f] : '');
        return `<div class="field">
          <label>${FIELD_META[f].label}</label>
          <input type="number" inputmode="decimal" data-field="${f}" value="${val ?? ''}" placeholder="—">
        </div>`;
      }).join('')}
    </div>
    ${suggested && !saved ? `<div class="suggested">Прошлый результат подставлен автоматически</div>` : ''}
    <div class="save-row">
      <button class="btn small ${saved?'saved':'primary'} save-ex-btn" data-exid="${exId}">${saved?'Сохранено ✓':'Сохранить'}</button>
    </div>
  </div>`;
}

function bindTabEvents(){
  if(ui.tab==='today'){
    document.getElementById('day-prev')?.addEventListener('click',()=>{ ui.viewDate=toISO(addDays(fromISO(ui.viewDate),-1)); renderTab(); });
    document.getElementById('day-next')?.addEventListener('click',()=>{ ui.viewDate=toISO(addDays(fromISO(ui.viewDate),1)); renderTab(); });
    document.getElementById('add-ex-today')?.addEventListener('click',()=>{
      const wd = mondayIndex(fromISO(ui.viewDate).getDay());
      openExerciseEditor(null, wd);
    });
    document.querySelectorAll('.save-ex-btn').forEach(b=>b.addEventListener('click',()=>saveExerciseLog(b.dataset.exid)));
    document.querySelectorAll('.ex-edit').forEach(b=>b.addEventListener('click',()=>{
      const wd = mondayIndex(fromISO(ui.viewDate).getDay());
      openExerciseEditor(b.dataset.exid, wd);
    }));
    document.querySelectorAll('.ex-remove').forEach(b=>b.addEventListener('click',()=>removeExerciseFromDay(b.dataset.exid)));
  }
  if(ui.tab==='week'){
    document.getElementById('wk-prev')?.addEventListener('click',()=>{ ui.weekStart=addDays(ui.weekStart,-7); renderTab(); });
    document.getElementById('wk-next')?.addEventListener('click',()=>{ ui.weekStart=addDays(ui.weekStart,7); renderTab(); });
    document.querySelectorAll('.wk-day').forEach(el=>el.addEventListener('click',()=>{
      ui.viewDate=el.dataset.date; ui.tab='today'; renderApp();
    }));
  }
  if(ui.tab==='exercises'){
    document.querySelectorAll('.day-add-btn').forEach(b=>b.addEventListener('click',()=>openExerciseEditor(null, Number(b.dataset.wd))));
    document.querySelectorAll('.day-ex-edit').forEach(b=>b.addEventListener('click',()=>openExerciseEditor(b.dataset.exid, Number(b.dataset.wd))));
    document.querySelectorAll('.day-ex-remove').forEach(b=>b.addEventListener('click',()=>{
      removeIdFromWeekday(b.dataset.exid, Number(b.dataset.wd)); renderTab();
    }));
  }
  if(ui.tab==='records'){
    document.querySelectorAll('.record-edit-lift').forEach(b=>b.addEventListener('click',()=>openRecordEditor({liftKey:b.dataset.lift})));
    document.getElementById('add-record-btn')?.addEventListener('click',()=>openRecordEditor({}));
    document.querySelectorAll('.record-edit-custom').forEach(b=>b.addEventListener('click',()=>openRecordEditor({customId:b.dataset.cid})));
    document.querySelectorAll('.record-remove-custom').forEach(b=>b.addEventListener('click',()=>{
      if(!confirm('Удалить этот рекорд?')) return;
      state.records.custom = state.records.custom.filter(r=>r.id!==b.dataset.cid);
      save(); renderTab();
    }));
  }
  if(ui.tab==='settings'){
    bindSettingsEvents();
  }
}

function saveExerciseLog(exId){
  const card = document.querySelector(`.exercise[data-exid="${exId}"]`);
  const values = {};
  card.querySelectorAll('input[data-field]').forEach(inp=>{
    values[inp.dataset.field] = inp.value===''? null : Number(inp.value);
  });
  state.logs[ui.viewDate] = state.logs[ui.viewDate] || {};
  state.logs[ui.viewDate][exId] = values;
  save();
  showToast('Результат сохранён — подставится и на следующие недели');
  renderTab();
}

function removeExerciseFromDay(exId){
  const wd = mondayIndex(fromISO(ui.viewDate).getDay());
  removeIdFromWeekday(exId, wd);
  renderTab();
}
function removeIdFromWeekday(exId, wd){
  state.dayExercises[wd] = (state.dayExercises[wd]||[]).filter(id=>id!==exId);
  save();
}

/* ---------------- Week ---------------- */
function renderWeek(){
  const ws = ui.weekStart;
  const cells = [...Array(7)].map((_,i)=>{
    const d = addDays(ws,i);
    const iso = toISO(d);
    const type = dayType(i);
    const isToday = iso===ui.today;
    const isSel = iso===ui.viewDate;
    return `<button class="wk-day type-${type} ${isToday?'is-today':''} ${isSel?'is-selected':''}" data-date="${iso}">${WD[i]}<span class="n">${fmtDay(d)}</span></button>`;
  }).join('');
  return `
  <div class="week-strip">
    <div class="week-strip-head">
      <button class="wk-nav-btn" id="wk-prev">‹</button>
      <span class="wk-label">${fmtMonthRange(ws)}</span>
      <button class="wk-nav-btn" id="wk-next">›</button>
    </div>
    <div class="wk-days">${cells}</div>
  </div>
  <div class="card">
    <h2 style="margin-bottom:10px;">Итоги недели</h2>
    ${weekSummary(ws)}
  </div>`;
}
function weekSummary(ws){
  let training=0, cardio=0, rest=0;
  for(let i=0;i<7;i++){ const t=dayType(i); if(t==='training')training++; else if(t==='cardio')cardio++; else rest++; }
  return `
    <div class="row-line"><span class="rl-label">Силовых дней</span><span class="rl-val">${training}</span></div>
    <div class="row-line"><span class="rl-label">Кардио дней</span><span class="rl-val">${cardio}</span></div>
    <div class="row-line"><span class="rl-label">Отдых</span><span class="rl-val">${rest}</span></div>
  `;
}

/* ---------------- Exercises tab (управление по всем дням) ---------------- */
function renderExercisesTab(){
  let out='';
  for(let wd=0; wd<7; wd++){
    const ids = state.dayExercises[wd]||[];
    const type = dayType(wd);
    out += `<div class="card">
      <div class="day-heading"><h2>${WD_FULL[wd]}</h2><span class="tag ${type}">${type==='training'?'Силовая':type==='cardio'?'Кардио':'Отдых'}</span></div>
      ${ids.length===0?'<div class="empty-state" style="padding:14px 0;"><p>Пока пусто</p></div>':''}
      ${ids.map(id=>renderExerciseListItem(id,wd)).join('')}
      <button class="add-exercise-btn day-add-btn" data-wd="${wd}">+ Добавить упражнение</button>
    </div>`;
  }
  return out;
}
function renderExerciseListItem(exId, wd){
  const ex = state.exercises[exId];
  if(!ex) return '';
  const fieldsOn = Object.keys(ex.fields).filter(f=>ex.fields[f]).map(f=>FIELD_META[f].short).join(' · ');
  return `<div class="exercise" data-exid="${exId}">
    <div class="exercise-head">
      <div class="name">${ex.name}<br><small style="color:var(--ink-faint);font-weight:500;">${fieldsOn}</small></div>
      <div class="actions">
        <button class="icon-btn day-ex-edit" data-exid="${exId}" data-wd="${wd}">✎</button>
        <button class="icon-btn day-ex-remove" data-exid="${exId}" data-wd="${wd}">✕</button>
      </div>
    </div>
  </div>`;
}

/* ---------------- Рекорды ---------------- */
function renderRecords(){
  const liftsHtml = MAIN_LIFTS.map(l=>{
    const r = state.records.lifts[l.key];
    return `
    <div class="record-row" data-lift="${l.key}">
      <div class="record-info">
        <div class="record-name">${l.name}</div>
        <div class="record-val">${r ? `${r.value} кг` : 'нет данных'}${r&&r.date?` <span class="record-date">· ${fmtShortDate(fromISO(r.date))}</span>`:''}</div>
      </div>
      <button class="btn small ghost record-edit-lift" data-lift="${l.key}">${r?'Изменить':'Добавить'}</button>
    </div>`;
  }).join('');

  const customHtml = state.records.custom.length===0
    ? `<div class="empty-state" style="padding:14px 0;"><p>Пока нет своих рекордов</p></div>`
    : state.records.custom.map(r=>`
      <div class="record-row" data-cid="${r.id}">
        <div class="record-info">
          <div class="record-name">${r.name}</div>
          <div class="record-val">${r.value} ${r.unit}${r.date?` <span class="record-date">· ${fmtShortDate(fromISO(r.date))}</span>`:''}</div>
        </div>
        <div class="actions">
          <button class="icon-btn record-edit-custom" data-cid="${r.id}">✎</button>
          <button class="icon-btn record-remove-custom" data-cid="${r.id}">✕</button>
        </div>
      </div>`).join('');

  return `
  <div class="card">
    <h2 style="margin-bottom:10px;">Основные движения</h2>
    ${liftsHtml}
  </div>
  <div class="card">
    <div class="day-heading"><h2>Свои рекорды</h2></div>
    ${customHtml}
    <button class="add-exercise-btn" id="add-record-btn">+ Добавить рекорд</button>
  </div>`;
}
function fmtShortDate(d){
  const mNames=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  return `${d.getDate()} ${mNames[d.getMonth()]}`;
}

function openRecordEditor({liftKey=null, customId=null}={}){
  const editingCustom = state.records.custom.find(r=>r.id===customId);
  const editingLift = liftKey ? MAIN_LIFTS.find(l=>l.key===liftKey) : null;
  const isCustomNew = !liftKey && !editingCustom;

  const overlay = document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML = `
    <div class="sheet">
      <div class="sheet-head"><h2>${editingLift?editingLift.name:(editingCustom?'Изменить рекорд':'Новый рекорд')}</h2><button class="icon-btn" id="rec-close">✕</button></div>
      ${isCustomNew ? `
        <div class="field" style="margin-bottom:14px;">
          <label>Название упражнения</label>
          <input id="rec-name" type="text" placeholder="Например, Ягодичный мост">
        </div>
        <div class="sched-label">Или выбери из предложенных</div>
        <div class="chip-row" id="rec-suggestions">
          ${RECORD_SUGGESTIONS.map(n=>`<button class="chip-toggle" data-name="${n}">${n}</button>`).join('')}
        </div>
      ` : `<div class="field" style="margin-bottom:14px;"><label>Название</label><input id="rec-name" type="text" value="${editingCustom?editingCustom.name:''}" ${editingLift?'disabled':''}></div>`}
      <div class="field-grid" style="margin-bottom:14px;">
        <div class="field">
          <label>Результат</label>
          <input id="rec-value" type="number" inputmode="decimal" value="${editingCustom?editingCustom.value:(editingLift&&state.records.lifts[liftKey]?state.records.lifts[liftKey].value:'')}" placeholder="0">
        </div>
        <div class="field">
          <label>Единица</label>
          <select id="rec-unit">
            <option value="кг" ${!editingCustom||editingCustom.unit==='кг'?'selected':''}>кг</option>
            <option value="повт" ${editingCustom&&editingCustom.unit==='повт'?'selected':''}>повторы</option>
            <option value="сек" ${editingCustom&&editingCustom.unit==='сек'?'selected':''}>сек</option>
          </select>
        </div>
      </div>
      <button class="btn primary block" id="rec-save">Сохранить</button>
      ${editingCustom?'<button class="btn danger block" id="rec-delete" style="margin-top:10px;">Удалить рекорд</button>':''}
    </div>`;
  document.body.appendChild(overlay);
  if(editingLift) overlay.querySelector('#rec-unit').value='кг';

  overlay.querySelectorAll('#rec-suggestions .chip-toggle').forEach(chip=>{
    chip.addEventListener('click',()=>{
      overlay.querySelector('#rec-name').value = chip.dataset.name;
      overlay.querySelectorAll('#rec-suggestions .chip-toggle').forEach(c=>c.classList.toggle('on', c===chip));
    });
  });
  overlay.querySelector('#rec-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#rec-save').addEventListener('click',()=>{
    const value = Number(overlay.querySelector('#rec-value').value);
    if(!value && value!==0){ overlay.remove(); return; }
    const unit = overlay.querySelector('#rec-unit')?.value || 'кг';
    const today = toISO(new Date());
    if(editingLift){
      state.records.lifts[liftKey] = {value, unit:'кг', date:today};
    } else {
      const name = overlay.querySelector('#rec-name').value.trim();
      if(!name){ overlay.remove(); return; }
      if(editingCustom){
        editingCustom.value=value; editingCustom.unit=unit; editingCustom.date=today; editingCustom.name=name;
      } else {
        state.records.custom.push({id:uid(), name, value, unit, date:today});
      }
    }
    save(); overlay.remove(); renderTab();
    showToast('Рекорд сохранён');
  });
  overlay.querySelector('#rec-delete')?.addEventListener('click',()=>{
    state.records.custom = state.records.custom.filter(r=>r.id!==customId);
    save(); overlay.remove(); renderTab();
  });
}

/* ---------------- Exercise editor sheet (создание / редактирование, включая переключатель "высота") ---------------- */
function openExerciseEditor(exId, weekday){
  const editing = !!exId;
  const ex = editing ? state.exercises[exId] : {name:'', fields:{weight:1,reps:1,sets:1,height:0,duration:0,distance:0}};
  const overlay = document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML = `
    <div class="sheet">
      <div class="sheet-head"><h2>${editing?'Изменить упражнение':'Новое упражнение'}</h2><button class="icon-btn" id="ex-close">✕</button></div>
      <div class="field" style="margin-bottom:14px;">
        <label>Название</label>
        <input id="ex-name" type="text" value="${ex.name}" placeholder="Например, Жим лёжа">
      </div>
      ${editing? '' : `
      <div class="sched-label">Или выбери из предложенных по группам мышц</div>
      <div class="lib-groups" id="ex-lib-groups">
        ${Object.keys(EXERCISE_LIBRARY).map(group=>`
          <div class="lib-group">
            <div class="lib-group-title">${group}</div>
            <div class="chip-row">
              ${EXERCISE_LIBRARY[group].map(item=>`<button class="chip-toggle lib-item" data-name="${item.name}">${item.name}</button>`).join('')}
            </div>
          </div>`).join('')}
      </div>`}
      <div class="sched-label">Какие поля показывать</div>
      <div class="chip-row" id="ex-fields">
        ${Object.keys(FIELD_META).map(f=>`<button class="chip-toggle ${ex.fields[f]?'on':''}" data-field="${f}">${FIELD_META[f].label}</button>`).join('')}
      </div>
      <p style="color:var(--ink-faint);font-size:12px;margin:-8px 0 16px;">Например, для жима лёжа поле «высота/наклон» обычно не нужно — просто выключи его.</p>
      <button class="btn primary block" id="ex-save">${editing?'Сохранить':'Добавить'}</button>
      ${editing?'<button class="btn danger block" id="ex-delete" style="margin-top:10px;">Удалить упражнение</button>':''}
    </div>`;
  document.body.appendChild(overlay);
  const fieldsState = Object.assign({},ex.fields);
  function refreshFieldChips(){
    overlay.querySelectorAll('#ex-fields .chip-toggle').forEach(chip=>{
      chip.classList.toggle('on', !!fieldsState[chip.dataset.field]);
    });
  }
  overlay.querySelectorAll('#ex-fields .chip-toggle').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const f=chip.dataset.field; fieldsState[f]=fieldsState[f]?0:1; chip.classList.toggle('on');
    });
  });
  overlay.querySelectorAll('.lib-item').forEach(chip=>{
    chip.addEventListener('click',()=>{
      overlay.querySelector('#ex-name').value = chip.dataset.name;
      overlay.querySelectorAll('.lib-item').forEach(c=>c.classList.toggle('on', c===chip));
      const libEx = findLibraryExercise(chip.dataset.name);
      if(libEx){
        Object.keys(FIELD_META).forEach(f=>{ fieldsState[f] = libEx.fields[f] ? 1 : 0; });
        refreshFieldChips();
      }
    });
  });
  overlay.querySelector('#ex-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#ex-save').addEventListener('click',()=>{
    const name = overlay.querySelector('#ex-name').value.trim();
    if(!name) return;
    if(editing){
      state.exercises[exId].name=name;
      state.exercises[exId].fields=fieldsState;
    } else {
      const id=uid();
      state.exercises[id]={id,name,fields:fieldsState};
      state.dayExercises[weekday]=state.dayExercises[weekday]||[];
      state.dayExercises[weekday].push(id);
    }
    save(); overlay.remove(); renderTab();
  });
  overlay.querySelector('#ex-delete')?.addEventListener('click',()=>{
    delete state.exercises[exId];
    for(const wd in state.dayExercises){ state.dayExercises[wd]=state.dayExercises[wd].filter(id=>id!==exId); }
    save(); overlay.remove(); renderTab();
  });
}

/* ---------------- Settings ---------------- */
function renderSettings(){
  return `
  <div class="card settings-section">
    <h3>Профиль</h3>
    <div class="row-line"><span class="rl-label">Пол</span><span class="rl-val" id="set-gender-val">${state.profile.gender==='f'?'Девушка':'Парень'}</span></div>
    <div class="chip-row">
      <button class="chip-toggle ${state.profile.gender==='f'?'on':''}" data-set="gender" data-val="f">Девушка</button>
      <button class="chip-toggle ${state.profile.gender==='m'?'on':''}" data-set="gender" data-val="m">Парень</button>
    </div>
    <div class="row-line"><span class="rl-label">Уровень</span></div>
    <div class="chip-row">
      <button class="chip-toggle ${state.profile.level==='beginner'?'on':''}" data-set="level" data-val="beginner">Новичок</button>
      <button class="chip-toggle ${state.profile.level==='intermediate'?'on':''}" data-set="level" data-val="intermediate">Средний</button>
      <button class="chip-toggle ${state.profile.level==='advanced'?'on':''}" data-set="level" data-val="advanced">Продвинутый</button>
    </div>
  </div>

  <div class="card settings-section">
    <h3>Дни силовых</h3>
    <div class="weekday-picker" id="set-training"></div>
  </div>
  <div class="card settings-section">
    <h3>Дни кардио</h3>
    <div class="weekday-picker" id="set-cardio"></div>
  </div>

  <div class="card settings-section">
    <h3>Готовый план</h3>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:-4px 0 12px;">Применить шаблон заново к дням силовых (текущие упражнения на этих днях будут заменены).</p>
    <div class="template-list" id="set-template-list"></div>
  </div>

  <div class="card settings-section">
    <h3>Данные</h3>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:-4px 0 12px;">Всё хранится локально в этом браузере/на этом устройстве — синхронизации с сервером нет.</p>
    <button class="btn danger block" id="reset-app">Сбросить всё и начать заново</button>
  </div>`;
}

function bindSettingsEvents(){
  buildSettingsWeekdayPicker('set-training','training');
  buildSettingsWeekdayPicker('set-cardio','cardio');
  buildSettingsTemplateList();

  document.querySelectorAll('.chip-toggle[data-set]').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const {set,val}=chip.dataset;
      state.profile[set]=val;
      save(); renderTab();
    });
  });
  document.getElementById('reset-app').addEventListener('click',()=>{
    if(confirm('Точно удалить все данные и настроить заново?')){
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      obState = { step:0, gender:null, level:null, training:[], cardio:[], template:null };
      document.getElementById('app').innerHTML='';
      startOnboarding();
    }
  });
}
function buildSettingsWeekdayPicker(containerId, kind){
  const el=document.getElementById(containerId);
  el.innerHTML='';
  WD.forEach((label,i)=>{
    const chip=document.createElement('button');
    chip.className='wd-chip'+(state.schedule[kind].includes(i)?' on':'');
    chip.dataset.kind=kind;
    chip.textContent=label;
    chip.addEventListener('click',()=>{
      const arr=state.schedule[kind];
      const otherKind = kind==='training'?'cardio':'training';
      const otherArr = state.schedule[otherKind];
      const pos=arr.indexOf(i);
      if(pos>-1){ arr.splice(pos,1); }
      else{
        arr.push(i);
        const op=otherArr.indexOf(i); if(op>-1) otherArr.splice(op,1); // день не может быть и тем и тем
      }
      save(); renderTab();
    });
    el.appendChild(chip);
  });
}
function buildSettingsTemplateList(){
  const el=document.getElementById('set-template-list');
  el.innerHTML='';
  TEMPLATES.forEach(t=>{
    const card=document.createElement('button');
    card.className='template-card'+(state.planTemplateId===t.id?' selected':'');
    card.innerHTML=`<div class="t-name">${t.name}</div><div class="t-meta">${levelLabel(t.level)}</div><div class="t-desc">${t.desc}</div>${t.basedOn?`<div class="t-based">${t.basedOn}</div>`:''}`;
    card.addEventListener('click',()=>{
      if(state.schedule.training.length===0){ alert('Сначала выбери хотя бы один день силовых.'); return; }
      if(!confirm(`Заменить упражнения в днях силовых на план «${t.name}»?`)) return;
      state.planTemplateId=t.id;
      applyTemplateToSchedule(t.id);
      save(); renderApp();
    });
    el.appendChild(card);
  });
}

/* ---------------- Toast ---------------- */
function showToast(msg){
  const t=document.createElement('div');
  t.className='toast'; t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}

/* ---------------- Boot ---------------- */
function boot(){
  bindSwipeNavigationOnce();
  if(state.onboarded){ renderApp(); }
  else{ startOnboarding(); }
}
boot();

/* Service worker для оффлайн-работы и установки на экран "Домой" */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
