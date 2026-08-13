/* BARBELL — локальный трекер тренировок. Все данные хранятся только в этом браузере (localStorage). */

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
const TAB_ORDER = ['today','week','records','settings'];
const REST_OPTIONS = [30,60,90,120,180,240];

/* ---------------- Templates ----------------
   Каждая программа собрана по мотивам публично известных и хорошо задокументированных
   тренировочных подходов — это не дословные личные планы этих людей, а стиль/структура,
   которой они широко известны. Можно и нужно менять любое упражнение под себя. */
const TEMPLATES = [
  {
    id:'fullbody-beginner', name:'Starting Strength', level:['beginner'],
    author:'по мотивам стартовой программы Марка Риппето (Mark Rippetoe)',
    desc:'Классика для первых месяцев: два простых дня на всё тело, упор на технику базовых движений и медленный рост весов.',
    days:[
      [
        {name:'Приседания со штангой', fields:{weight:1,reps:1,sets:1}},
        {name:'Жим лёжа', fields:{weight:1,reps:1,sets:1}},
        {name:'Тяга штанги в наклоне', fields:{weight:1,reps:1,sets:1}},
        {name:'Планка', fields:{duration:1,sets:1}},
      ],
      [
        {name:'Приседания со штангой', fields:{weight:1,reps:1,sets:1}},
        {name:'Жим стоя', fields:{weight:1,reps:1,sets:1}},
        {name:'Становая тяга', fields:{weight:1,reps:1,sets:1}},
        {name:'Скручивания', fields:{reps:1,sets:1}},
      ],
    ]
  },
  {
    id:'push-pull-legs', name:'Push / Pull / Legs', level:['intermediate','advanced'],
    author:'высокообъёмный стиль в духе тренировок Ронни Коулмана (Ronnie Coleman)',
    desc:'Трёхдневный силовой сплит: жим, тяга, ноги — с акцентом на большие рабочие веса и объём. Масштабируется на 3–6 тренировок в неделю по кругу.',
    days:[
      [
        {name:'Жим лёжа',fields:{weight:1,reps:1,sets:1}},
        {name:'Жим гантелей на наклонной скамье',fields:{weight:1,reps:1,sets:1,height:1}},
        {name:'Жим стоя',fields:{weight:1,reps:1,sets:1}},
        {name:'Разведение гантелей в стороны',fields:{weight:1,reps:1,sets:1}},
        {name:'Разгибания на трицепс на блоке',fields:{weight:1,reps:1,sets:1}},
      ],
      [
        {name:'Становая тяга',fields:{weight:1,reps:1,sets:1}},
        {name:'Подтягивания',fields:{reps:1,sets:1}},
        {name:'Тяга штанги в наклоне',fields:{weight:1,reps:1,sets:1}},
        {name:'Тяга гантели одной рукой',fields:{weight:1,reps:1,sets:1}},
        {name:'Подъём штанги на бицепс',fields:{weight:1,reps:1,sets:1}},
      ],
      [
        {name:'Приседания со штангой',fields:{weight:1,reps:1,sets:1}},
        {name:'Румынская тяга',fields:{weight:1,reps:1,sets:1}},
        {name:'Жим ногами',fields:{weight:1,reps:1,sets:1}},
        {name:'Выпады с гантелями',fields:{weight:1,reps:1,sets:1}},
        {name:'Подъём на носки стоя',fields:{weight:1,reps:1,sets:1}},
      ],
    ]
  },
  {
    id:'bodybuilding-mass', name:'Золотая эра бодибилдинга', level:['intermediate','advanced'],
    author:'по мотивам классического сплита Арнольда Шварценеггера (Arnold Schwarzenegger)',
    desc:'Сплит на гипертрофию по группам мышц: грудь-спина, плечи-руки, ноги-пресс — узнаваемая схема золотой эры бодибилдинга.',
    days:[
      [
        {name:'Жим лёжа',fields:{weight:1,reps:1,sets:1}},
        {name:'Тяга штанги в наклоне',fields:{weight:1,reps:1,sets:1}},
        {name:'Разведение гантелей лёжа',fields:{weight:1,reps:1,sets:1}},
        {name:'Подтягивания широким хватом',fields:{reps:1,sets:1}},
      ],
      [
        {name:'Жим стоя',fields:{weight:1,reps:1,sets:1}},
        {name:'Разведение гантелей в стороны',fields:{weight:1,reps:1,sets:1}},
        {name:'Подъём штанги на бицепс',fields:{weight:1,reps:1,sets:1}},
        {name:'Французский жим лёжа',fields:{weight:1,reps:1,sets:1}},
      ],
      [
        {name:'Приседания со штангой',fields:{weight:1,reps:1,sets:1}},
        {name:'Жим ногами',fields:{weight:1,reps:1,sets:1}},
        {name:'Сгибание ног в тренажёре',fields:{weight:1,reps:1,sets:1}},
        {name:'Скручивания на пресс',fields:{reps:1,sets:1}},
      ],
    ]
  },
  {
    id:'glute-focus', name:'Ягодицы и низ тела', level:['beginner','intermediate'],
    author:'по мотивам методики Брета Контрераса (Bret Contreras) — известного как «Glute Guy»',
    desc:'Акцент на ягодицы и ноги через тазобедренные движения (мост, тяги), плюс лёгкий день на верх тела и кор.',
    days:[
      [
        {name:'Ягодичный мост со штангой',fields:{weight:1,reps:1,sets:1}},
        {name:'Приседания сумо',fields:{weight:1,reps:1,sets:1}},
        {name:'Румынская тяга',fields:{weight:1,reps:1,sets:1}},
        {name:'Отведение ноги в кроссовере',fields:{weight:1,reps:1,sets:1}},
      ],
      [
        {name:'Тяга верхнего блока',fields:{weight:1,reps:1,sets:1}},
        {name:'Жим гантелей сидя',fields:{weight:1,reps:1,sets:1}},
        {name:'Скручивания',fields:{reps:1,sets:1}},
        {name:'Боковая планка',fields:{duration:1,sets:1}},
      ],
    ]
  },
  {
    id:'functional', name:'Функциональный многоборец', level:['intermediate','advanced'],
    author:'кроссфит-стиль в духе тренировок Рича Фронинга (Rich Froning)',
    desc:'Высокоинтенсивные комплексы из функционального многоборья — сила и выносливость в одной тренировке.',
    days:[
      [
        {name:'Берпи',fields:{reps:1,sets:1,duration:1}},
        {name:'Взятие штанги на грудь',fields:{weight:1,reps:1,sets:1}},
        {name:'Прыжки на тумбу',fields:{reps:1,sets:1,height:1}},
        {name:'Подтягивания',fields:{reps:1,sets:1}},
      ],
      [
        {name:'Толчок гири',fields:{weight:1,reps:1,sets:1}},
        {name:'Приседания со штангой над головой',fields:{weight:1,reps:1,sets:1}},
        {name:'Гребля',fields:{duration:1,distance:1}},
        {name:'Отжимания на брусьях',fields:{reps:1,sets:1}},
      ],
    ]
  },
  {
    id:'powerlifting', name:'Пауэрлифтинг: база', level:['intermediate','advanced'],
    author:'периодизация в духе методик Эда Коана (Ed Coan)',
    desc:'Фокус на трёх соревновательных движениях — присед, жим, тяга — с добавочными упражнениями на слабые места.',
    days:[
      [
        {name:'Приседания со штангой',fields:{weight:1,reps:1,sets:1}},
        {name:'Жим лёжа',fields:{weight:1,reps:1,sets:1}},
        {name:'Гиперэкстензия',fields:{weight:1,reps:1,sets:1}},
      ],
      [
        {name:'Становая тяга',fields:{weight:1,reps:1,sets:1}},
        {name:'Жим узким хватом',fields:{weight:1,reps:1,sets:1}},
        {name:'Подтягивания с отягощением',fields:{weight:1,reps:1,sets:1}},
      ],
    ]
  },
];
const CARDIO_DEFAULT = [{name:'Кардио (бег / велосипед)', fields:{duration:1,distance:1}}];

/* ---------------- Каталог упражнений для быстрого выбора при добавлении ---------------- */
const EXERCISE_CATALOG = {
  'Грудь': [
    {name:'Жим лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим гантелей на наклонной скамье', fields:{weight:1,reps:1,sets:1,height:1}},
    {name:'Разведение гантелей лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Отжимания на брусьях', fields:{reps:1,sets:1}},
    {name:'Жим в тренажёре Смита', fields:{weight:1,reps:1,sets:1}},
    {name:'Отжимания от пола', fields:{reps:1,sets:1}},
    {name:'Сведение рук в кроссовере', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим гантелей лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Пуловер с гантелью', fields:{weight:1,reps:1,sets:1}},
  ],
  'Спина': [
    {name:'Становая тяга', fields:{weight:1,reps:1,sets:1}},
    {name:'Подтягивания', fields:{reps:1,sets:1}},
    {name:'Тяга штанги в наклоне', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга верхнего блока', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга гантели одной рукой', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга нижнего блока сидя', fields:{weight:1,reps:1,sets:1}},
    {name:'Гиперэкстензия', fields:{weight:1,reps:1,sets:1}},
    {name:'Шраги со штангой', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга Т-грифа', fields:{weight:1,reps:1,sets:1}},
  ],
  'Плечи': [
    {name:'Жим стоя', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим гантелей сидя', fields:{weight:1,reps:1,sets:1}},
    {name:'Разведение гантелей в стороны', fields:{weight:1,reps:1,sets:1}},
    {name:'Махи гантелями в наклоне', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим Арнольда', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга штанги к подбородку', fields:{weight:1,reps:1,sets:1}},
    {name:'Разведение в кроссовере на плечи', fields:{weight:1,reps:1,sets:1}},
  ],
  'Руки': [
    {name:'Подъём штанги на бицепс', fields:{weight:1,reps:1,sets:1}},
    {name:'Сгибания на бицепс с гантелями', fields:{weight:1,reps:1,sets:1}},
    {name:'Французский жим лёжа', fields:{weight:1,reps:1,sets:1}},
    {name:'Разгибания на трицепс на блоке', fields:{weight:1,reps:1,sets:1}},
    {name:'Отжимания узким хватом', fields:{reps:1,sets:1}},
    {name:'Молотковые сгибания с гантелями', fields:{weight:1,reps:1,sets:1}},
    {name:'Сгибания на бицепс на блоке', fields:{weight:1,reps:1,sets:1}},
    {name:'Отжимания на брусьях (трицепс)', fields:{reps:1,sets:1}},
    {name:'Разгибание одной рукой из-за головы', fields:{weight:1,reps:1,sets:1}},
  ],
  'Ноги': [
    {name:'Приседания со штангой', fields:{weight:1,reps:1,sets:1}},
    {name:'Румынская тяга', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим ногами', fields:{weight:1,reps:1,sets:1}},
    {name:'Выпады с гантелями', fields:{weight:1,reps:1,sets:1}},
    {name:'Сгибание ног в тренажёре', fields:{weight:1,reps:1,sets:1}},
    {name:'Подъём на носки стоя', fields:{weight:1,reps:1,sets:1}},
    {name:'Разгибание ног в тренажёре', fields:{weight:1,reps:1,sets:1}},
    {name:'Приседания со штангой над головой', fields:{weight:1,reps:1,sets:1}},
    {name:'Болгарские выпады', fields:{weight:1,reps:1,sets:1}},
    {name:'Жим ногами узкой постановкой', fields:{weight:1,reps:1,sets:1}},
  ],
  'Ягодицы': [
    {name:'Ягодичный мост со штангой', fields:{weight:1,reps:1,sets:1}},
    {name:'Приседания сумо', fields:{weight:1,reps:1,sets:1}},
    {name:'Отведение ноги в кроссовере', fields:{weight:1,reps:1,sets:1}},
    {name:'Тяга на прямых ногах', fields:{weight:1,reps:1,sets:1}},
    {name:'Ходьба с резинкой', fields:{reps:1,sets:1}},
    {name:'Гиперэкстензия с акцентом на ягодицы', fields:{weight:1,reps:1,sets:1}},
  ],
  'Кор': [
    {name:'Планка', fields:{duration:1,sets:1}},
    {name:'Боковая планка', fields:{duration:1,sets:1}},
    {name:'Скручивания', fields:{reps:1,sets:1}},
    {name:'Подъём ног в висе', fields:{reps:1,sets:1}},
    {name:'Скручивания на блоке', fields:{weight:1,reps:1,sets:1}},
    {name:'Русские скручивания', fields:{reps:1,sets:1}},
    {name:'Велосипед на пресс', fields:{reps:1,sets:1}},
  ],
  'Кардио': [
    {name:'Бег', fields:{duration:1,distance:1}},
    {name:'Велосипед', fields:{duration:1,distance:1}},
    {name:'Скакалка', fields:{duration:1,reps:1}},
    {name:'Гребля', fields:{duration:1,distance:1}},
    {name:'Плавание', fields:{duration:1,distance:1}},
    {name:'Эллипсоид', fields:{duration:1,distance:1}},
    {name:'Ходьба в гору (наклон)', fields:{duration:1,distance:1,height:1}},
  ],
  'Функциональные': [
    {name:'Берпи', fields:{reps:1,sets:1,duration:1}},
    {name:'Взятие штанги на грудь', fields:{weight:1,reps:1,sets:1}},
    {name:'Толчок гири', fields:{weight:1,reps:1,sets:1}},
    {name:'Прыжки на тумбу', fields:{reps:1,sets:1,height:1}},
    {name:'Рывок гири', fields:{weight:1,reps:1,sets:1}},
    {name:'Броски мяча в стену', fields:{weight:1,reps:1,sets:1}},
    {name:'Ходьба фермера', fields:{weight:1,duration:1,sets:1}},
  ],
};

/* ---------------- Предложенные упражнения для рекордов ---------------- */
const RECORD_SUGGESTIONS = [
  {name:'Становая тяга', unit:'кг'},
  {name:'Присед со штангой', unit:'кг'},
  {name:'Жим лёжа', unit:'кг'},
  {name:'Жим стоя', unit:'кг'},
  {name:'Ягодичный мост со штангой', unit:'кг'},
  {name:'Жим гантелей в наклоне', unit:'кг'},
  {name:'Подтягивания', unit:'повт'},
  {name:'Отжимания', unit:'повт'},
  {name:'Планка', unit:'сек'},
];

/* ---------------- Профили на устройстве ---------------- */
const PROFILES_KEY = 'barbell_profiles_v1';
const ACTIVE_KEY = 'barbell_active_profile';
const LEGACY_KEY = 'zhelezo_state_v1';

function loadProfiles(){
  try{ return JSON.parse(localStorage.getItem(PROFILES_KEY)) || []; }catch(e){ return []; }
}
function saveProfiles(list){ localStorage.setItem(PROFILES_KEY, JSON.stringify(list)); }
function stateKeyFor(id){ return 'barbell_state_'+id; }
function getActiveProfileId(){ return localStorage.getItem(ACTIVE_KEY); }
function setActiveProfileId(id){ localStorage.setItem(ACTIVE_KEY, id); }

function ensureProfiles(){
  let profiles = loadProfiles();
  if(profiles.length===0){
    const legacy = localStorage.getItem(LEGACY_KEY); // миграция старых данных (до появления профилей)
    const id = uid();
    profiles = [{id, name:'Я'}];
    saveProfiles(profiles);
    setActiveProfileId(id);
    if(legacy) localStorage.setItem(stateKeyFor(id), legacy);
  }
  if(!getActiveProfileId()) setActiveProfileId(profiles[0].id);
  return profiles;
}

/* ---------------- Режим тренера (на уровне устройства, не привязан к профилю) ----------------
   Пароль тренера нигде не хранится в открытом виде — сохраняется только SHA-256 хэш.
   Это защита «от чужого пальца», а не криптографическая защита от того, кто открыл код в консоли. */
const TRAINER_KEY = 'barbell_trainer_v1';
const TRAINER_DRAFTS_KEY = 'barbell_trainer_drafts_v1';
let trainerUnlocked = sessionStorage.getItem('barbell_trainer_unlocked')==='1';

function loadTrainerAuth(){ try{ return JSON.parse(localStorage.getItem(TRAINER_KEY)) || {passHash:null}; }catch(e){ return {passHash:null}; } }
function saveTrainerAuth(a){ localStorage.setItem(TRAINER_KEY, JSON.stringify(a)); }
async function sha256Hex(text){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function loadDrafts(){ try{ return JSON.parse(localStorage.getItem(TRAINER_DRAFTS_KEY)) || []; }catch(e){ return []; } }
function saveDrafts(list){ localStorage.setItem(TRAINER_DRAFTS_KEY, JSON.stringify(list)); }
function newDraft(name){
  return { id:uid(), name, schedule:{training:[],cardio:[]}, dayExercises:{0:[],1:[],2:[],3:[],4:[],5:[],6:[]}, exercises:{} };
}

/* ---------------- State ---------------- */
let state = null;
function defaultState(){
  return {
    onboarded:false,
    profile:{gender:null, level:null},
    schedule:{training:[], cardio:[]}, // индексы 0..6, Пн..Вс
    dayExercises:{0:[],1:[],2:[],3:[],4:[],5:[],6:[]}, // weekday -> [exerciseId]
    exercises:{}, // id -> {id,name,fields,note}
    logs:{}, // dateISO -> {exerciseId: {field:value}}
    records:{}, // id -> {id,name,unit,entries:[{date,value}]}
    planTemplateId:null,
    restSeconds:90, // время отдыха по умолчанию
    trainerProgram:null, // {name, importedAt} — метка активной программы от тренера
  };
}
function load(){
  try{
    const raw = localStorage.getItem(stateKeyFor(getActiveProfileId()));
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){ return defaultState(); }
}
function save(){ localStorage.setItem(stateKeyFor(getActiveProfileId()), JSON.stringify(state)); }

function uid(){ return Math.random().toString(36).slice(2,9); }

/* ---------------- Date helpers ---------------- */
/* Важно: считаем ISO-дату по ЛОКАЛЬНОМУ времени, а не через toISOString() (тот уходит в UTC
   и на часовых поясах впереди UTC — например, Европа — сдвигает дату на день назад). */
function toISO(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
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
function fmtFullDate(d){
  const mNames=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${d.getDate()} ${mNames[d.getMonth()]} ${d.getFullYear()}`;
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

/* Максимальный вес, когда-либо сохранённый по упражнению (для автоопределения рекорда) */
function getMaxWeight(exerciseId, excludeISO){
  let max=null;
  for(const d in state.logs){
    if(d===excludeISO) continue;
    const v = state.logs[d][exerciseId];
    if(v && v.weight!=null && (max===null || v.weight>max)) max=v.weight;
  }
  return max;
}

/* История рабочего веса по упражнению — для графика прогресса */
function getWeightHistory(exerciseId){
  const out=[];
  for(const d in state.logs){
    const v = state.logs[d][exerciseId];
    if(v && v.weight!=null && v.weight!==''){ out.push({date:d, value:Number(v.weight)}); }
  }
  out.sort((a,b)=> a.date<b.date?-1:(a.date>b.date?1:0));
  return out;
}

/* Стрик: сколько тренировочных/кардио дней подряд закрыто без пропуска (дни отдыха не считаются) */
function computeStreak(){
  let streak=0;
  let cursor = fromISO(ui.today);
  for(let guard=0; guard<3650; guard++){
    const wd = mondayIndex(cursor.getDay());
    const iso = toISO(cursor);
    const type = dayType(wd);
    if(type==='rest'){ cursor = addDays(cursor,-1); continue; }
    const hasLog = state.logs[iso] && Object.keys(state.logs[iso]).length>0;
    if(iso===ui.today && !hasLog){ cursor = addDays(cursor,-1); continue; } // сегодня ещё не считаем пропуском
    if(!hasLog) break;
    streak++;
    cursor = addDays(cursor,-1);
  }
  return streak;
}

/* Тоннаж (вес × повторы × подходы) за день/неделю */
function dayTonnage(iso){
  const dayLogs = state.logs[iso]; if(!dayLogs) return 0;
  let sum=0;
  Object.values(dayLogs).forEach(v=>{
    const w=Number(v.weight)||0, r=Number(v.reps)||0, s=Number(v.sets)||0;
    if(w && r && s) sum += w*r*s;
  });
  return sum;
}
function weekTonnage(ws){
  let sum=0;
  for(let i=0;i<7;i++) sum += dayTonnage(toISO(addDays(ws,i)));
  return sum;
}

/* ---------------- Шаринг текстом (Web Share API с запасным копированием) ---------------- */
async function shareText(title, text){
  if(navigator.share){
    try{ await navigator.share({title, text}); }catch(e){ /* пользователь отменил — не ошибка */ }
    return;
  }
  try{ await navigator.clipboard.writeText(text); showToast('Скопировано в буфер обмена'); }
  catch(e){ window.prompt('Скопируй текст:', text); }
}
function buildDaySummary(){
  const d = fromISO(ui.viewDate);
  const wd = mondayIndex(d.getDay());
  const ids = state.dayExercises[wd]||[];
  const lines = [`BARBELL · ${fmtFullDate(d)}`];
  ids.forEach(id=>{
    const ex = state.exercises[id]; if(!ex) return;
    const v = (state.logs[ui.viewDate]||{})[id];
    if(v){
      const parts = Object.keys(ex.fields).filter(f=>ex.fields[f]).map(f=>`${FIELD_META[f].short} ${v[f]??'—'}`).join(', ');
      lines.push(`• ${ex.name}: ${parts}`);
    } else {
      lines.push(`• ${ex.name}: не сохранено`);
    }
  });
  return lines.join('\n');
}
function buildWeekSummary(ws){
  const lines = [`BARBELL · неделя ${fmtMonthRange(ws)}`];
  lines.push(`Силовых дней: ${state.schedule.training.length}, кардио: ${state.schedule.cardio.length}`);
  lines.push(`Тоннаж недели: ${Math.round(weekTonnage(ws)).toLocaleString('ru-RU')} кг`);
  return lines.join('\n');
}

/* ---------------- Шаринг программы (AES-GCM, защищено паролем) ----------------
   Важное честное уточнение: код защищает саму программу от посторонних, у которых нет пароля.
   Он не «прячет» исходники приложения — репозиторий на GitHub публичный, и это неизбежно
   для любого статического клиентского приложения. */
function buildProgramExportObject(name){
  const usedIds = new Set();
  Object.values(state.dayExercises).forEach(arr=>arr.forEach(id=>usedIds.add(id)));
  const exercises={};
  usedIds.forEach(id=>{ if(state.exercises[id]) exercises[id]=state.exercises[id]; });
  return { v:2, name:name||null, schedule:state.schedule, dayExercises:state.dayExercises, exercises, planTemplateId:state.planTemplateId };
}
function buildDraftExportObject(draft){
  return { v:2, name:draft.name||null, schedule:draft.schedule, dayExercises:draft.dayExercises, exercises:draft.exercises, planTemplateId:null };
}
function bufToB64(buf){
  let bin='';
  const bytes = new Uint8Array(buf);
  for(let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64ToBuf(b64){
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
  return bytes;
}
async function encryptProgram(password, name){
  const payload = JSON.stringify(buildProgramExportObject(name));
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:150000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, false, ['encrypt']);
  const cipher = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(payload));
  const bundle = new Uint8Array(salt.length + iv.length + cipher.byteLength);
  bundle.set(salt,0); bundle.set(iv,salt.length); bundle.set(new Uint8Array(cipher), salt.length+iv.length);
  return 'BARBELL1:' + bufToB64(bundle);
}
async function encryptDraftProgram(draft, password){
  const payload = JSON.stringify(buildDraftExportObject(draft));
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:150000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, false, ['encrypt']);
  const cipher = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(payload));
  const bundle = new Uint8Array(salt.length + iv.length + cipher.byteLength);
  bundle.set(salt,0); bundle.set(iv,salt.length); bundle.set(new Uint8Array(cipher), salt.length+iv.length);
  return 'BARBELL1:' + bufToB64(bundle);
}
async function decryptProgram(code, password){
  if(!code.startsWith('BARBELL1:')) throw new Error('bad-format');
  const bytes = b64ToBuf(code.slice(9));
  const salt = bytes.slice(0,16), iv = bytes.slice(16,28), cipher = bytes.slice(28);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:150000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}
function applyImportedProgram(data){
  const idMap={};
  const newExercises={};
  Object.entries(data.exercises||{}).forEach(([oldId,ex])=>{
    const newId=uid();
    idMap[oldId]=newId;
    newExercises[newId]=Object.assign({},ex,{id:newId});
  });
  const newDayExercises={0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
  Object.entries(data.dayExercises||{}).forEach(([wd,ids])=>{
    newDayExercises[wd]=(ids||[]).map(oid=>idMap[oid]).filter(Boolean);
  });
  state.schedule = data.schedule || state.schedule;
  state.dayExercises = newDayExercises;
  state.exercises = Object.assign({}, state.exercises, newExercises);
  state.planTemplateId = data.planTemplateId || null;
  state.trainerProgram = { name: data.name || 'Без названия', importedAt: toISO(new Date()) };
  save();
}

/* ---------------- Резервная копия (без пароля, для себя) ---------------- */
function exportBackup(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`barbell-backup-${toISO(new Date())}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function importBackupFile(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const parsed = JSON.parse(reader.result);
      state = Object.assign(defaultState(), parsed);
      save(); renderApp();
      showToast('Данные восстановлены');
    }catch(e){ alert('Не удалось прочитать файл — проверь, что это тот самый JSON.'); }
  };
  reader.readAsText(file);
}

/* ---------------- Таймер отдыха ---------------- */
let timerState = null; // {remaining, total, intervalId}
function startRestTimer(seconds){
  stopRestTimer(false);
  timerState = { remaining:seconds, total:seconds, intervalId:null };
  renderTimerBar();
  timerState.intervalId = setInterval(()=>{
    timerState.remaining--;
    if(timerState.remaining<=0){ stopRestTimer(true); return; }
    updateTimerBar();
  },1000);
}
function stopRestTimer(finished){
  if(timerState && timerState.intervalId) clearInterval(timerState.intervalId);
  const el=document.getElementById('rest-timer-bar');
  if(el) el.remove();
  if(finished) beep();
  timerState=null;
}
function renderTimerBar(){
  let el=document.getElementById('rest-timer-bar');
  if(!el){
    el=document.createElement('div');
    el.id='rest-timer-bar';
    el.className='timer-bar';
    document.body.appendChild(el);
  }
  updateTimerBar();
}
function updateTimerBar(){
  const el=document.getElementById('rest-timer-bar');
  if(!el || !timerState) return;
  el.innerHTML = `<span>Отдых: ${timerState.remaining}с</span>
    <button class="btn small ghost" id="timer-plus">+30</button>
    <button class="btn small ghost" id="timer-stop">Стоп</button>`;
  el.querySelector('#timer-plus').addEventListener('click',()=>{ timerState.remaining+=30; timerState.total+=30; updateTimerBar(); });
  el.querySelector('#timer-stop').addEventListener('click',()=>stopRestTimer(false));
}
function openRestPicker(){
  const overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML=`<div class="sheet">
    <div class="sheet-head"><h2>Таймер отдыха</h2><button class="icon-btn" id="rp-close">✕</button></div>
    <div class="chip-row">
      ${REST_OPTIONS.map(s=>`<button type="button" class="chip-toggle rp-opt ${s===(state.restSeconds||90)?'on':''}" data-sec="${s}">${s<60?s+'с':(s/60)+' мин'}</button>`).join('')}
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#rp-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelectorAll('.rp-opt').forEach(b=>b.addEventListener('click',()=>{
    startRestTimer(Number(b.dataset.sec));
    overlay.remove();
  }));
}
function beep(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value=880; g.gain.value=0.15;
    o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, 350);
  }catch(e){}
  if(navigator.vibrate) navigator.vibrate([200,100,200]);
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
    card.innerHTML=`<div class="t-name">${t.name}</div><div class="t-meta">${levelLabel(t.level)}${t.author?' · '+t.author:''}</div><div class="t-desc">${t.desc}</div>`;
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
      <div><div class="brand">BAR<b>BELL</b></div><div class="sub">${profileSummary()}${computeStreak()>0?` · 🔥 ${computeStreak()}`:''}</div></div>
    </div>
    ${state.trainerProgram ? `<div class="trainer-badge">📋 Программа тренера: <b>${state.trainerProgram.name}</b></div>` : ''}
    <div id="tab-content"></div>
    <div class="tabbar">
      ${tabBtn('today','●','Сегодня')}
      ${tabBtn('week','▦','Неделя')}
      ${tabBtn('records','🏆','Рекорды')}
      ${tabBtn('settings','⚙','Настройки')}
    </div>
  `;
  app.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{ ui.tab=b.dataset.tab; renderApp(); }));
  renderTab();
  attachSwipe();
}
function tabBtn(id,ic,label){
  return `<button class="tab-btn ${ui.tab===id?'active':''}" data-tab="${id}"><span class="ic">${ic}</span>${label}</button>`;
}
function profileSummary(){
  const g = state.profile.gender==='f'?'Девушка':'Парень';
  const lvl = {beginner:'новичок',intermediate:'средний',advanced:'продвинутый'}[state.profile.level]||'';
  return `${g} · ${lvl}`;
}
function renderTab(){
  const c=document.getElementById('tab-content');
  if(ui.tab==='today') c.innerHTML=renderToday();
  if(ui.tab==='week') c.innerHTML=renderWeek();
  if(ui.tab==='records') c.innerHTML=renderRecords();
  if(ui.tab==='settings') c.innerHTML=renderSettings();
  bindTabEvents();
}

/* Свайп: на вкладке "Сегодня" листает дни, на "Неделе" — недели. Вкладки свайпом не переключаются. */
let swipeStartX=null, swipeStartY=null;
function attachSwipe(){
  const el=document.getElementById('tab-content');
  if(!el) return;
  el.addEventListener('touchstart', e=>{
    swipeStartX=e.touches[0].clientX; swipeStartY=e.touches[0].clientY;
  }, {passive:true});
  el.addEventListener('touchend', e=>{
    if(swipeStartX===null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX;
    const dy = e.changedTouches[0].clientY - swipeStartY;
    swipeStartX=null;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5){
      if(ui.tab==='today'){
        ui.viewDate = toISO(addDays(fromISO(ui.viewDate), dx<0?1:-1));
        renderTab();
      } else if(ui.tab==='week'){
        ui.weekStart = addDays(ui.weekStart, dx<0?7:-7);
        renderTab();
      }
    }
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
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="tag ${type}">${type==='training'?'Силовая':type==='cardio'?'Кардио':'Отдых'}</span>
        <button class="icon-btn" id="share-day" title="Поделиться">↗</button>
      </div>
    </div>
    <h2 style="margin-bottom:4px;">${WD_FULL[wd]}${isToday?' · сегодня':''}</h2>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:0 0 14px;">${fmtFullDate(d)}</p>
    ${type==='rest' && ids.length===0 ? `<div class="empty-state"><h3>День отдыха</h3><p>Можно добавить лёгкую активность, если хочется.</p></div>` : ''}
    ${ids.map(id=>renderExerciseCard(id, ui.viewDate)).join('')}
    <button class="add-exercise-btn" id="add-ex-today">+ Добавить упражнение на ${WD[wd]}</button>
  </div>`;
}

function renderExerciseCard(exId, dateISO){
  const ex = state.exercises[exId];
  if(!ex) return '';
  const saved = (state.logs[dateISO]||{})[exId];
  const suggested = getSuggested(exId, dateISO);
  const fieldsOn = Object.keys(ex.fields).filter(f=>ex.fields[f]);
  const wd = mondayIndex(fromISO(dateISO).getDay());
  const list = state.dayExercises[wd]||[];
  const pos = list.indexOf(exId);
  const hasHistory = ex.fields.weight && getWeightHistory(exId).length>1;
  return `
  <div class="exercise" data-exid="${exId}">
    <div class="exercise-head">
      <div class="name">${ex.name}${ex.note?`<div class="ex-note">${ex.note}</div>`:''}</div>
      <div class="actions">
        ${hasHistory?`<button class="icon-btn ex-chart" data-exid="${exId}" title="Прогресс">📈</button>`:''}
        <button class="icon-btn ex-up" data-exid="${exId}" ${pos<=0?'disabled':''} title="Выше">↑</button>
        <button class="icon-btn ex-down" data-exid="${exId}" ${pos>=list.length-1?'disabled':''} title="Ниже">↓</button>
        <button class="icon-btn ex-edit" data-exid="${exId}">✎</button>
        <button class="icon-btn ex-remove" data-exid="${exId}">✕</button>
      </div>
    </div>
    <div class="field-grid">
      ${fieldsOn.map(f=>{
        const val = saved ? saved[f] : (suggested ? suggested[f] : '');
        if(f==='height'){
          return `<div class="field">
            <label>${FIELD_META[f].label}</label>
            <input type="text" data-field="${f}" value="${val ?? ''}" placeholder="напр. 10-15-20">
          </div>`;
        }
        return `<div class="field">
          <label>${FIELD_META[f].label}</label>
          <input type="number" inputmode="decimal" data-field="${f}" value="${val ?? ''}" placeholder="—">
        </div>`;
      }).join('')}
    </div>
    ${fieldsOn.includes('height')?'<div class="suggested">В «Высоте» можно вписать несколько чисел через пробел или дефис: 10-15-20</div>':''}
    ${suggested && !saved ? `<div class="suggested">Прошлый результат подставлен автоматически</div>` : ''}
    <div class="save-row">
      ${ex.fields.weight?`<button class="icon-btn ex-rest" data-exid="${exId}" title="Таймер отдыха">⏱</button>`:''}
      <button class="btn small ${saved?'saved':'primary'} save-ex-btn" data-exid="${exId}">${saved?'Сохранено ✓':'Сохранить'}</button>
    </div>
  </div>`;
}

function bindTabEvents(){
  if(ui.tab==='today'){
    document.getElementById('day-prev')?.addEventListener('click',()=>{ ui.viewDate=toISO(addDays(fromISO(ui.viewDate),-1)); renderTab(); });
    document.getElementById('day-next')?.addEventListener('click',()=>{ ui.viewDate=toISO(addDays(fromISO(ui.viewDate),1)); renderTab(); });
    document.getElementById('share-day')?.addEventListener('click',()=>shareText('BARBELL — тренировка', buildDaySummary()));
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
    document.querySelectorAll('.ex-chart').forEach(b=>b.addEventListener('click',()=>openProgressChart(b.dataset.exid)));
    document.querySelectorAll('.ex-rest').forEach(b=>b.addEventListener('click',openRestPicker));
    document.querySelectorAll('.ex-up').forEach(b=>b.addEventListener('click',()=>{
      const wd = mondayIndex(fromISO(ui.viewDate).getDay());
      moveExerciseInDay(b.dataset.exid, wd, -1); renderTab();
    }));
    document.querySelectorAll('.ex-down').forEach(b=>b.addEventListener('click',()=>{
      const wd = mondayIndex(fromISO(ui.viewDate).getDay());
      moveExerciseInDay(b.dataset.exid, wd, 1); renderTab();
    }));
  }
  if(ui.tab==='week'){
    document.getElementById('wk-prev')?.addEventListener('click',()=>{ ui.weekStart=addDays(ui.weekStart,-7); renderTab(); });
    document.getElementById('wk-next')?.addEventListener('click',()=>{ ui.weekStart=addDays(ui.weekStart,7); renderTab(); });
    document.getElementById('share-week')?.addEventListener('click',()=>shareText('BARBELL — неделя', buildWeekSummary(ui.weekStart)));
    document.querySelectorAll('.wk-day').forEach(el=>el.addEventListener('click',()=>{
      ui.viewDate=el.dataset.date; ui.tab='today'; renderApp();
    }));
  }
  if(ui.tab==='records'){
    document.getElementById('add-record-btn')?.addEventListener('click', openRecordAdder);
    document.querySelectorAll('.rec-add').forEach(b=>b.addEventListener('click',()=>openAddAttempt(b.dataset.recid)));
    document.querySelectorAll('.rec-remove').forEach(b=>b.addEventListener('click',()=>{
      if(!confirm('Удалить этот рекорд и всю историю попыток?')) return;
      delete state.records[b.dataset.recid]; save(); renderTab();
    }));
  }
  if(ui.tab==='settings'){
    bindSettingsEvents();
  }
}

function saveExerciseLog(exId){
  const card = document.querySelector(`.exercise[data-exid="${exId}"]`);
  const ex = state.exercises[exId];
  const values = {};
  card.querySelectorAll('input[data-field]').forEach(inp=>{
    const f=inp.dataset.field;
    if(f==='height'){ values[f] = inp.value.trim()===''? null : inp.value.trim(); }
    else{ values[f] = inp.value===''? null : Number(inp.value); }
  });
  const prevMax = ex.fields.weight ? getMaxWeight(exId, ui.viewDate) : null;
  state.logs[ui.viewDate] = state.logs[ui.viewDate] || {};
  state.logs[ui.viewDate][exId] = values;
  save();
  const isRecord = ex.fields.weight && values.weight!=null && (prevMax===null || values.weight>prevMax);
  showToast(isRecord ? `Новый рекорд в «${ex.name}»! 🎉` : 'Результат сохранён — подставится и на следующие недели');
  renderTab();
  if(dayType(mondayIndex(fromISO(ui.viewDate).getDay()))==='training' && ex.fields.weight){
    startRestTimer(state.restSeconds || 90);
  }
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
/* Переставить упражнение в дне местами, не удаляя (dir: -1 вверх, +1 вниз) */
function moveExerciseInDay(exId, wd, dir){
  const list = state.dayExercises[wd]||[];
  const i = list.indexOf(exId);
  const j = i+dir;
  if(i<0 || j<0 || j>=list.length) return;
  [list[i],list[j]] = [list[j],list[i]];
  save();
}

/* ---------------- Прогресс по рабочему весу ---------------- */
function openProgressChart(exId){
  const ex = state.exercises[exId]; if(!ex) return;
  const history = getWeightHistory(exId);
  const overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML=`<div class="sheet">
    <div class="sheet-head"><h2>${ex.name}</h2><button class="icon-btn" id="chart-close">✕</button></div>
    <div class="chart-wrap">
      ${renderProgressSvg(history)}
      <div class="chart-meta"><span>${fmtShortDate(history[0].date)}</span><span>${fmtShortDate(history[history.length-1].date)}</span></div>
    </div>
    <div class="chart-points">
      ${[...history].reverse().map(p=>`<div class="chart-point-row"><span>${fmtShortDate(p.date)}</span><span class="cp-val">${p.value} кг</span></div>`).join('')}
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#chart-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
}
function fmtShortDate(iso){
  const d=fromISO(iso);
  const mNames=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  return `${d.getDate()} ${mNames[d.getMonth()]}`;
}
function renderProgressSvg(history){
  const w=320,h=140,pad=24;
  const vals=history.map(e=>e.value);
  const min=Math.min(...vals), max=Math.max(...vals);
  const range=(max-min)||1;
  const pts = history.map((e,i)=>{
    const x = pad + i*((w-pad*2)/Math.max(1,history.length-1));
    const y = h-pad - ((e.value-min)/range)*(h-pad*2);
    return {x,y,v:e.value};
  });
  const line = pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dots = pts.map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="var(--brass)"/>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%; height:${h}px; display:block;">
    <text x="${pad}" y="14" fill="var(--ink-faint)" font-size="11">${max} кг</text>
    <text x="${pad}" y="${h-pad+16}" fill="var(--ink-faint)" font-size="11">${min} кг</text>
    <polyline points="${line}" fill="none" stroke="var(--cobalt)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
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
    <button class="btn ghost block" id="share-week" style="margin-top:12px;">Поделиться неделей</button>
  </div>`;
}
function weekSummary(ws){
  let training=0, cardio=0, rest=0;
  for(let i=0;i<7;i++){ const t=dayType(i); if(t==='training')training++; else if(t==='cardio')cardio++; else rest++; }
  return `
    <div class="row-line"><span class="rl-label">Силовых дней</span><span class="rl-val">${training}</span></div>
    <div class="row-line"><span class="rl-label">Кардио дней</span><span class="rl-val">${cardio}</span></div>
    <div class="row-line"><span class="rl-label">Отдых</span><span class="rl-val">${rest}</span></div>
    <div class="row-line"><span class="rl-label">Тоннаж недели</span><span class="rl-val">${Math.round(weekTonnage(ws)).toLocaleString('ru-RU')} кг</span></div>
  `;
}

/* ---------------- Records ---------------- */
function renderRecords(){
  const ids = Object.keys(state.records||{});
  return `
  <div class="card">
    <div class="day-heading"><h2>Личные рекорды</h2></div>
    ${ids.length===0?'<div class="empty-state"><h3>Пока пусто</h3><p>Добавь первый рекорд — становую, присед, жим или своё упражнение.</p></div>':''}
    ${ids.map(id=>renderRecordCard(id)).join('')}
    <button class="add-exercise-btn" id="add-record-btn">+ Добавить рекорд</button>
  </div>`;
}
function renderRecordCard(id){
  const r = state.records[id];
  const entries = [...r.entries].sort((a,b)=> a.date<b.date?-1:(a.date>b.date?1:0));
  const best = entries.reduce((m,e)=> (m===null||e.value>m)?e.value:m, null);
  return `<div class="exercise" data-recid="${id}">
    <div class="exercise-head">
      <div class="name">${r.name}</div>
      <div class="actions">
        <button class="icon-btn rec-add" data-recid="${id}">+</button>
        <button class="icon-btn rec-remove" data-recid="${id}">✕</button>
      </div>
    </div>
    <div style="display:flex; align-items:baseline; gap:8px; margin:6px 0 8px;">
      <span style="font-family:'Bebas Neue',sans-serif; font-size:34px; color:var(--brass); line-height:1;">${best??'—'}</span>
      <span style="color:var(--ink-faint); font-size:13px;">${r.unit}${entries.length? ' · '+entries.length+' попыт'+(entries.length===1?'ка':'ки'):''}</span>
    </div>
    ${entries.length>1?renderSparkline(entries):''}
  </div>`;
}
function renderSparkline(entries){
  const w=280,h=56,pad=8;
  const vals=entries.map(e=>e.value);
  const min=Math.min(...vals), max=Math.max(...vals);
  const range=(max-min)||1;
  const pts = entries.map((e,i)=>{
    const x = pad + i*((w-pad*2)/Math.max(1,entries.length-1));
    const y = h-pad - ((e.value-min)/range)*(h-pad*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%; height:56px; display:block;">
    <polyline points="${pts}" fill="none" stroke="var(--cobalt)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
function openRecordAdder(){
  const existingNames = Object.values(state.records||{}).map(r=>r.name);
  const overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML=`<div class="sheet">
    <div class="sheet-head"><h2>Новый рекорд</h2><button class="icon-btn" id="rec-close">✕</button></div>
    <div class="sched-label">Предложенные</div>
    <div class="chip-row">
      ${RECORD_SUGGESTIONS.filter(s=>!existingNames.includes(s.name)).map(s=>`<button type="button" class="chip-toggle rec-suggest" data-name="${s.name}" data-unit="${s.unit}">${s.name}</button>`).join('')}
    </div>
    <div class="sched-label" style="margin-top:14px;">Или своё упражнение</div>
    <div class="field" style="margin-bottom:10px;"><label>Название</label><input id="rec-name" type="text" placeholder="Например, Жим гантелей в наклоне"></div>
    <div class="field" style="margin-bottom:16px;"><label>Единица</label><input id="rec-unit" type="text" value="кг" placeholder="кг / повт / сек"></div>
    <button class="btn primary block" id="rec-create">Добавить</button>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#rec-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelectorAll('.rec-suggest').forEach(b=>b.addEventListener('click',()=>{
    createRecord(b.dataset.name, b.dataset.unit); overlay.remove();
  }));
  overlay.querySelector('#rec-create').addEventListener('click',()=>{
    const name=overlay.querySelector('#rec-name').value.trim();
    const unit=overlay.querySelector('#rec-unit').value.trim()||'кг';
    if(!name) return;
    createRecord(name, unit); overlay.remove();
  });
}
function createRecord(name, unit){
  const id=uid();
  state.records = state.records||{};
  state.records[id]={id,name,unit,entries:[]};
  save(); renderTab();
  openAddAttempt(id);
}
function openAddAttempt(id){
  const r=state.records[id];
  const overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML=`<div class="sheet">
    <div class="sheet-head"><h2>${r.name}</h2><button class="icon-btn" id="att-close">✕</button></div>
    <div class="field" style="margin-bottom:16px;"><label>Результат, ${r.unit}</label><input id="att-value" type="number" inputmode="decimal" placeholder="0"></div>
    <button class="btn primary block" id="att-save">Сохранить попытку</button>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#att-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#att-save').addEventListener('click',()=>{
    const raw = overlay.querySelector('#att-value').value;
    if(raw==='') return;
    const v = Number(raw);
    r.entries.push({date:toISO(new Date()), value:v});
    save(); overlay.remove(); renderTab();
    showToast('Попытка сохранена');
  });
}

/* ---------------- Exercise editor sheet (создание / редактирование) ---------------- */
function openExerciseEditor(exId, weekday){
  const editing = !!exId;
  const ex = editing ? state.exercises[exId] : {name:'', note:'', fields:{weight:1,reps:1,sets:1,height:0,duration:0,distance:0}};
  const overlay = document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML = `
    <div class="sheet">
      <div class="sheet-head"><h2>${editing?'Изменить упражнение':'Новое упражнение'}</h2><button class="icon-btn" id="ex-close">✕</button></div>

      <div class="sched-label">Быстрый выбор по группе мышц</div>
      <div class="chip-row" id="ex-cats">
        ${Object.keys(EXERCISE_CATALOG).map(cat=>`<button type="button" class="chip-toggle cat-chip" data-cat="${cat}">${cat}</button>`).join('')}
      </div>
      <div class="chip-row" id="ex-suggestions"></div>

      <div class="field" style="margin:14px 0;">
        <label>Название (или впиши своё)</label>
        <input id="ex-name" type="text" value="${ex.name}" placeholder="Например, Жим лёжа">
      </div>
      <div class="sched-label">Какие поля показывать</div>
      <div class="chip-row" id="ex-fields">
        ${Object.keys(FIELD_META).map(f=>`<button type="button" class="chip-toggle ${ex.fields[f]?'on':''}" data-field="${f}">${FIELD_META[f].label}</button>`).join('')}
      </div>
      <p style="color:var(--ink-faint);font-size:12px;margin:-8px 0 16px;">Например, для жима лёжа поле «высота/наклон» обычно не нужно — просто выключи его. В «Высоте» можно вписывать несколько значений через пробел или дефис (10-15-20).</p>
      <div class="field" style="margin-bottom:16px;">
        <label>Заметка/подсказка по технике (видна тому, кто занимается)</label>
        <textarea id="ex-note" rows="2" placeholder="Например: спина прямая, не сводить колени">${ex.note||''}</textarea>
      </div>
      <button class="btn primary block" id="ex-save">${editing?'Сохранить':'Добавить'}</button>
      ${editing?'<button class="btn danger block" id="ex-delete" style="margin-top:10px;">Удалить упражнение</button>':''}
    </div>`;
  document.body.appendChild(overlay);

  const fieldsState = Object.assign({},ex.fields);

  overlay.querySelectorAll('#ex-fields .chip-toggle').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const f=chip.dataset.field; fieldsState[f]=fieldsState[f]?0:1; chip.classList.toggle('on');
    });
  });
  overlay.querySelectorAll('.cat-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      overlay.querySelectorAll('.cat-chip').forEach(c=>c.classList.toggle('on', c===chip));
      const box = overlay.querySelector('#ex-suggestions');
      box.innerHTML = EXERCISE_CATALOG[chip.dataset.cat].map(item=>`<button type="button" class="chip-toggle pick-item" data-name="${item.name}">${item.name}</button>`).join('');
      box.querySelectorAll('.pick-item').forEach(btn=>{
        btn.addEventListener('click',()=>{
          box.querySelectorAll('.pick-item').forEach(x=>x.classList.toggle('on', x===btn));
          const item = EXERCISE_CATALOG[chip.dataset.cat].find(x=>x.name===btn.dataset.name);
          overlay.querySelector('#ex-name').value = item.name;
          Object.keys(FIELD_META).forEach(f=>{ fieldsState[f]=item.fields[f]?1:0; });
          overlay.querySelectorAll('#ex-fields .chip-toggle').forEach(fc=>{
            fc.classList.toggle('on', !!fieldsState[fc.dataset.field]);
          });
        });
      });
    });
  });

  overlay.querySelector('#ex-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#ex-save').addEventListener('click',()=>{
    const name = overlay.querySelector('#ex-name').value.trim();
    const note = overlay.querySelector('#ex-note').value.trim();
    if(!name) return;
    if(editing){
      state.exercises[exId].name=name;
      state.exercises[exId].fields=fieldsState;
      state.exercises[exId].note=note;
    } else {
      const id=uid();
      state.exercises[id]={id,name,note,fields:fieldsState};
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
/* ---------------- Режим тренера: раздел настроек ---------------- */
function renderTrainerSection(){
  const auth = loadTrainerAuth();
  if(!auth.passHash){
    return `<div class="card settings-section">
      <h3>Режим тренера</h3>
      <p class="trainer-locked-note">Составляй программы для учеников и делись ими кодом с паролем. Чтобы режим тренера не включил кто попало, задай отдельный пароль для него.</p>
      <button class="btn ghost block" id="trainer-setup">Настроить режим тренера</button>
    </div>`;
  }
  if(!trainerUnlocked){
    return `<div class="card settings-section">
      <h3>Режим тренера</h3>
      <p class="trainer-locked-note">Заблокирован. Введи пароль тренера, чтобы составлять программы для учеников.</p>
      <button class="btn ghost block" id="trainer-unlock">Войти в режим тренера</button>
    </div>`;
  }
  const drafts = loadDrafts();
  return `<div class="card settings-section">
    <h3>Режим тренера — включён</h3>
    <p class="trainer-locked-note">Составляй программы для учеников здесь и отправляй код с паролем — они увидят программу у себя в приложении после импорта (раздел «Поделиться программой» выше, но для программы ученика используй экспорт прямо из карточки ниже).</p>
    <div class="draft-list">
      ${drafts.map(d=>`<div class="draft-card" data-did="${d.id}">
        <div class="d-name">${d.name}</div>
        <div class="d-actions">
          <button class="btn small ghost draft-edit" data-did="${d.id}">Редактировать</button>
          <button class="btn small primary draft-export" data-did="${d.id}">Экспорт для ученика</button>
          <button class="btn small danger draft-delete" data-did="${d.id}">Удалить</button>
        </div>
      </div>`).join('')}
    </div>
    <button class="add-exercise-btn" id="draft-add" style="margin-top:6px;">+ Новая программа для ученика</button>
    <button class="btn ghost block" id="trainer-lock" style="margin-top:14px;">Выключить режим тренера</button>
  </div>`;
}

function renderSettings(){
  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
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
    <h3>Время отдыха между подходами</h3>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:-4px 0 12px;">Таймер запускается автоматически после сохранения силового подхода. Можно выбрать своё время и на самой карточке упражнения кнопкой ⏱.</p>
    <div class="chip-row">
      ${REST_OPTIONS.map(s=>`<button class="chip-toggle ${ (state.restSeconds||90)===s?'on':''}" data-rest="${s}">${s<60?s+'с':(s/60)+' мин'}</button>`).join('')}
    </div>
  </div>

  ${state.trainerProgram?`<div class="card settings-section">
    <h3>Текущая программа</h3>
    <div class="row-line"><span class="rl-label">📋 ${state.trainerProgram.name}</span><span class="rl-val">от тренера</span></div>
  </div>`:''}

  <div class="card settings-section">
    <h3>Профили на этом устройстве</h3>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:-4px 0 12px;">Заведи отдельный профиль для друга, который тренируется с твоего телефона — данные не смешиваются.</p>
    ${profiles.map(p=>`<div class="row-line">
      <span class="rl-label">${p.name}${p.id===activeId?' · активен':''}</span>
      <span style="display:flex; gap:6px;">
        ${p.id!==activeId?`<button class="btn small ghost profile-switch" data-id="${p.id}">Выбрать</button>`:''}
        <button class="icon-btn profile-rename" data-id="${p.id}">✎</button>
        ${profiles.length>1?`<button class="icon-btn profile-delete" data-id="${p.id}">✕</button>`:''}
      </span>
    </div>`).join('')}
    <button class="add-exercise-btn" id="profile-add" style="margin-top:10px;">+ Добавить профиль</button>
  </div>

  <div class="card settings-section">
    <h3>Поделиться программой</h3>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:-4px 0 12px;">Экспортирует расписание и упражнения (без личных результатов) в код, зашифрованный паролем. Без пароля код не читается и не импортируется. Учти: сам код приложения открыт в публичном репозитории на GitHub — это защищает именно код программы, а не приложение целиком.</p>
    <div class="field" style="margin-bottom:10px;"><label>Название программы (покажется у получателя)</label><input id="share-name" type="text" placeholder="Например, Моя программа"></div>
    <div class="field" style="margin-bottom:10px;"><label>Пароль для кода</label><input id="share-pass" type="password" placeholder="Придумай пароль"></div>
    <button class="btn primary block" id="share-generate">Сгенерировать код</button>
    <textarea id="share-code" rows="3" style="width:100%; margin-top:10px; display:none;" readonly></textarea>
    <button class="btn ghost block" id="share-copy" style="margin-top:8px; display:none;">Скопировать / Поделиться</button>

    <div style="height:1px; background:var(--line); margin:18px 0;"></div>

    <p style="color:var(--ink-faint);font-size:12.5px;margin:0 0 10px;">Есть код от друга? Вставь его и введите тот же пароль.</p>
    <div class="field" style="margin-bottom:10px;"><label>Код программы</label><textarea id="import-code" rows="3" placeholder="BARBELL1:..."></textarea></div>
    <div class="field" style="margin-bottom:12px;"><label>Пароль</label><input id="import-pass" type="password" placeholder="Пароль от друга"></div>
    <button class="btn ghost block" id="import-program">Импортировать программу</button>
  </div>

  ${renderTrainerSection()}

  <div class="card settings-section">
    <h3>Резервная копия</h3>
    <p style="color:var(--ink-faint);font-size:12.5px;margin:-4px 0 12px;">Полная копия всех твоих данных без пароля — только для себя, например при смене телефона.</p>
    <button class="btn ghost block" id="export-backup">Скачать копию данных</button>
    <input type="file" id="import-backup-file" accept="application/json" style="display:none;">
    <button class="btn ghost block" id="import-backup" style="margin-top:10px;">Загрузить копию</button>
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

  document.querySelectorAll('.chip-toggle[data-rest]').forEach(chip=>{
    chip.addEventListener('click',()=>{
      state.restSeconds = Number(chip.dataset.rest);
      save(); renderTab();
    });
  });

  bindTrainerEvents();

  document.querySelectorAll('.chip-toggle[data-set]').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const {set,val}=chip.dataset;
      state.profile[set]=val;
      save(); renderTab();
    });
  });

  document.querySelectorAll('.profile-switch').forEach(b=>b.addEventListener('click',()=>switchProfile(b.dataset.id)));
  document.querySelectorAll('.profile-rename').forEach(b=>b.addEventListener('click',()=>{
    const profiles=loadProfiles();
    const p=profiles.find(x=>x.id===b.dataset.id);
    const name=window.prompt('Новое имя профиля:', p.name);
    if(!name) return;
    p.name=name.trim(); saveProfiles(profiles); renderTab();
  }));
  document.querySelectorAll('.profile-delete').forEach(b=>b.addEventListener('click',()=>{
    if(!confirm('Удалить профиль и все его данные без возможности восстановления?')) return;
    let profiles=loadProfiles();
    profiles=profiles.filter(x=>x.id!==b.dataset.id);
    saveProfiles(profiles);
    localStorage.removeItem(stateKeyFor(b.dataset.id));
    if(getActiveProfileId()===b.dataset.id) switchProfile(profiles[0].id);
    else renderTab();
  }));
  document.getElementById('profile-add')?.addEventListener('click',()=>{
    const name=window.prompt('Имя профиля (например, имя друга):');
    if(!name) return;
    const profiles=loadProfiles();
    const id=uid();
    profiles.push({id, name:name.trim()});
    saveProfiles(profiles);
    switchProfile(id);
  });

  document.getElementById('share-generate')?.addEventListener('click', async ()=>{
    const pass = document.getElementById('share-pass').value;
    const name = document.getElementById('share-name').value.trim();
    if(!pass){ alert('Сначала придумай пароль.'); return; }
    try{
      const code = await encryptProgram(pass, name);
      const box=document.getElementById('share-code');
      box.value=code; box.style.display='block';
      document.getElementById('share-copy').style.display='block';
    }catch(e){ alert('Не получилось создать код.'); }
  });
  document.getElementById('share-copy')?.addEventListener('click',()=>{
    shareText('Моя программа BARBELL', document.getElementById('share-code').value);
  });
  document.getElementById('import-program')?.addEventListener('click', async ()=>{
    const code = document.getElementById('import-code').value.trim();
    const pass = document.getElementById('import-pass').value;
    if(!code || !pass) return;
    if(!confirm('Импорт заменит упражнения на днях силовых/кардио текущим расписанием из кода друга. Продолжить?')) return;
    try{
      const data = await decryptProgram(code, pass);
      applyImportedProgram(data);
      renderApp();
      showToast('Программа импортирована');
    }catch(e){ alert('Неверный код или пароль.'); }
  });

  document.getElementById('export-backup')?.addEventListener('click', exportBackup);
  document.getElementById('import-backup')?.addEventListener('click', ()=>{
    document.getElementById('import-backup-file').click();
  });
  document.getElementById('import-backup-file')?.addEventListener('change', (e)=>{
    const file=e.target.files[0]; if(file) importBackupFile(file);
  });

  document.getElementById('reset-app').addEventListener('click',()=>{
    if(confirm('Точно удалить все данные этого профиля и настроить заново?')){
      localStorage.removeItem(stateKeyFor(getActiveProfileId()));
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
    card.innerHTML=`<div class="t-name">${t.name}</div><div class="t-meta">${levelLabel(t.level)}${t.author?' · '+t.author:''}</div><div class="t-desc">${t.desc}</div>`;
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

/* ---------------- Режим тренера: логика ---------------- */
function bindTrainerEvents(){
  document.getElementById('trainer-setup')?.addEventListener('click', async ()=>{
    const p1 = window.prompt('Придумай пароль тренера:');
    if(!p1) return;
    const p2 = window.prompt('Повтори пароль:');
    if(p1!==p2){ alert('Пароли не совпадают.'); return; }
    saveTrainerAuth({ passHash: await sha256Hex(p1) });
    trainerUnlocked = true; sessionStorage.setItem('barbell_trainer_unlocked','1');
    renderTab();
  });
  document.getElementById('trainer-unlock')?.addEventListener('click', async ()=>{
    const p = window.prompt('Пароль тренера:');
    if(!p) return;
    const auth = loadTrainerAuth();
    if(await sha256Hex(p) !== auth.passHash){ alert('Неверный пароль.'); return; }
    trainerUnlocked = true; sessionStorage.setItem('barbell_trainer_unlocked','1');
    renderTab();
  });
  document.getElementById('trainer-lock')?.addEventListener('click',()=>{
    trainerUnlocked = false; sessionStorage.removeItem('barbell_trainer_unlocked');
    renderTab();
  });
  document.getElementById('draft-add')?.addEventListener('click',()=>{
    const name = window.prompt('Имя программы (например, «Программа для Марии»):');
    if(!name) return;
    const drafts = loadDrafts();
    const d = newDraft(name.trim());
    drafts.push(d); saveDrafts(drafts);
    openDraftEditor(d.id);
  });
  document.querySelectorAll('.draft-edit').forEach(b=>b.addEventListener('click',()=>openDraftEditor(b.dataset.did)));
  document.querySelectorAll('.draft-delete').forEach(b=>b.addEventListener('click',()=>{
    if(!confirm('Удалить эту программу-черновик без возможности восстановления?')) return;
    saveDrafts(loadDrafts().filter(d=>d.id!==b.dataset.did));
    renderTab();
  }));
  document.querySelectorAll('.draft-export').forEach(b=>b.addEventListener('click', async ()=>{
    const draft = loadDrafts().find(d=>d.id===b.dataset.did); if(!draft) return;
    const pass = window.prompt('Придумай пароль для ученика (сообщи ему отдельно):');
    if(!pass) return;
    try{
      const code = await encryptDraftProgram(draft, pass);
      await shareText('Программа BARBELL — '+draft.name, code);
    }catch(e){ alert('Не получилось создать код.'); }
  }));
}

/* Черновик программы: редактор дней и упражнений тренера */
function openDraftEditor(draftId){
  const overlay = document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML = `<div class="sheet"><div class="sheet-head"><h2>Программа ученика</h2><button class="icon-btn" id="de-close">✕</button></div><div id="de-body"></div></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#de-close').addEventListener('click',()=>{ overlay.remove(); renderTab(); });
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay){ overlay.remove(); renderTab(); } });
  renderDraftEditorBody(overlay, draftId);
}
function renderDraftEditorBody(overlay, draftId){
  const drafts = loadDrafts();
  const draft = drafts.find(d=>d.id===draftId); if(!draft) return;
  const body = overlay.querySelector('#de-body');
  body.innerHTML = `
    <div class="field" style="margin-bottom:16px;"><label>Название программы</label><input id="de-name" type="text" value="${draft.name}"></div>
    <div class="sched-label">Силовые дни</div>
    <div class="weekday-picker" id="de-training" style="margin-bottom:14px;"></div>
    <div class="sched-label">Кардио дни</div>
    <div class="weekday-picker" id="de-cardio" style="margin-bottom:16px;"></div>
    ${[0,1,2,3,4,5,6].map(wd=>`
      <div class="draft-day">
        <h3>${WD_FULL[wd]}</h3>
        ${(draft.dayExercises[wd]||[]).map(exId=>{
          const ex=draft.exercises[exId]; if(!ex) return '';
          const fieldsOn = Object.keys(ex.fields).filter(f=>ex.fields[f]).map(f=>FIELD_META[f].short).join(' · ');
          return `<div class="exercise" data-exid="${exId}">
            <div class="exercise-head">
              <div class="name">${ex.name}${ex.note?`<div class="ex-note">${ex.note}</div>`:''}<br><small style="color:var(--ink-faint);font-weight:500;">${fieldsOn}</small></div>
              <div class="actions">
                <button class="icon-btn de-ex-edit" data-wd="${wd}" data-exid="${exId}">✎</button>
                <button class="icon-btn de-ex-remove" data-wd="${wd}" data-exid="${exId}">✕</button>
              </div>
            </div>
          </div>`;
        }).join('')}
        <button class="add-exercise-btn de-ex-add" data-wd="${wd}">+ Добавить упражнение</button>
      </div>
    `).join('')}
  `;
  body.querySelector('#de-name').addEventListener('change', e=>{
    draft.name = e.target.value.trim()||draft.name; saveDrafts(drafts);
  });
  buildDraftWeekdayPicker(body, draft, drafts, 'de-training','training');
  buildDraftWeekdayPicker(body, draft, drafts, 'de-cardio','cardio');
  body.querySelectorAll('.de-ex-add').forEach(b=>b.addEventListener('click',()=>{
    openDraftExerciseEditor(draft, drafts, null, Number(b.dataset.wd), ()=>renderDraftEditorBody(overlay, draftId));
  }));
  body.querySelectorAll('.de-ex-edit').forEach(b=>b.addEventListener('click',()=>{
    openDraftExerciseEditor(draft, drafts, b.dataset.exid, Number(b.dataset.wd), ()=>renderDraftEditorBody(overlay, draftId));
  }));
  body.querySelectorAll('.de-ex-remove').forEach(b=>b.addEventListener('click',()=>{
    const wd=Number(b.dataset.wd);
    draft.dayExercises[wd] = (draft.dayExercises[wd]||[]).filter(id=>id!==b.dataset.exid);
    saveDrafts(drafts); renderDraftEditorBody(overlay, draftId);
  }));
}
function buildDraftWeekdayPicker(body, draft, drafts, containerId, kind){
  const el = body.querySelector('#'+containerId);
  el.innerHTML='';
  WD.forEach((label,i)=>{
    const chip=document.createElement('button');
    chip.className='wd-chip'+(draft.schedule[kind].includes(i)?' on':'');
    chip.textContent=label;
    chip.addEventListener('click',()=>{
      const arr=draft.schedule[kind];
      const other = kind==='training'?'cardio':'training';
      const pos=arr.indexOf(i);
      if(pos>-1) arr.splice(pos,1);
      else{ arr.push(i); const op=draft.schedule[other].indexOf(i); if(op>-1) draft.schedule[other].splice(op,1); }
      saveDrafts(drafts);
      chip.classList.toggle('on');
    });
    el.appendChild(chip);
  });
}
/* Мини-редактор упражнения внутри черновика тренера (аналог openExerciseEditor, но пишет в draft) */
function openDraftExerciseEditor(draft, drafts, exId, weekday, onDone){
  const editing = !!exId;
  const ex = editing ? draft.exercises[exId] : {name:'', note:'', fields:{weight:1,reps:1,sets:1,height:0,duration:0,distance:0}};
  const overlay = document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML = `
    <div class="sheet">
      <div class="sheet-head"><h2>${editing?'Изменить упражнение':'Новое упражнение'}</h2><button class="icon-btn" id="dex-close">✕</button></div>
      <div class="sched-label">Быстрый выбор по группе мышц</div>
      <div class="chip-row" id="dex-cats">
        ${Object.keys(EXERCISE_CATALOG).map(cat=>`<button type="button" class="chip-toggle cat-chip" data-cat="${cat}">${cat}</button>`).join('')}
      </div>
      <div class="chip-row" id="dex-suggestions"></div>
      <div class="field" style="margin:14px 0;"><label>Название</label><input id="dex-name" type="text" value="${ex.name}" placeholder="Например, Жим лёжа"></div>
      <div class="sched-label">Какие поля показывать</div>
      <div class="chip-row" id="dex-fields">
        ${Object.keys(FIELD_META).map(f=>`<button type="button" class="chip-toggle ${ex.fields[f]?'on':''}" data-field="${f}">${FIELD_META[f].label}</button>`).join('')}
      </div>
      <div class="field" style="margin:14px 0 16px;"><label>Заметка/подсказка по технике (увидит ученик)</label><textarea id="dex-note" rows="2" placeholder="Например: спина прямая">${ex.note||''}</textarea></div>
      <button class="btn primary block" id="dex-save">${editing?'Сохранить':'Добавить'}</button>
      ${editing?'<button class="btn danger block" id="dex-delete" style="margin-top:10px;">Удалить упражнение</button>':''}
    </div>`;
  document.body.appendChild(overlay);
  const fieldsState = Object.assign({},ex.fields);
  overlay.querySelectorAll('#dex-fields .chip-toggle').forEach(chip=>{
    chip.addEventListener('click',()=>{ const f=chip.dataset.field; fieldsState[f]=fieldsState[f]?0:1; chip.classList.toggle('on'); });
  });
  overlay.querySelectorAll('.cat-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      overlay.querySelectorAll('.cat-chip').forEach(c=>c.classList.toggle('on', c===chip));
      const box = overlay.querySelector('#dex-suggestions');
      box.innerHTML = EXERCISE_CATALOG[chip.dataset.cat].map(item=>`<button type="button" class="chip-toggle pick-item" data-name="${item.name}">${item.name}</button>`).join('');
      box.querySelectorAll('.pick-item').forEach(btn=>{
        btn.addEventListener('click',()=>{
          box.querySelectorAll('.pick-item').forEach(x=>x.classList.toggle('on', x===btn));
          const item = EXERCISE_CATALOG[chip.dataset.cat].find(x=>x.name===btn.dataset.name);
          overlay.querySelector('#dex-name').value = item.name;
          Object.keys(FIELD_META).forEach(f=>{ fieldsState[f]=item.fields[f]?1:0; });
          overlay.querySelectorAll('#dex-fields .chip-toggle').forEach(fc=>{ fc.classList.toggle('on', !!fieldsState[fc.dataset.field]); });
        });
      });
    });
  });
  overlay.querySelector('#dex-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#dex-save').addEventListener('click',()=>{
    const name = overlay.querySelector('#dex-name').value.trim();
    const note = overlay.querySelector('#dex-note').value.trim();
    if(!name) return;
    if(editing){
      draft.exercises[exId].name=name; draft.exercises[exId].fields=fieldsState; draft.exercises[exId].note=note;
    } else {
      const id=uid();
      draft.exercises[id]={id,name,note,fields:fieldsState};
      draft.dayExercises[weekday]=draft.dayExercises[weekday]||[];
      draft.dayExercises[weekday].push(id);
    }
    saveDrafts(drafts); overlay.remove(); onDone();
  });
  overlay.querySelector('#dex-delete')?.addEventListener('click',()=>{
    delete draft.exercises[exId];
    for(const wd in draft.dayExercises){ draft.dayExercises[wd]=draft.dayExercises[wd].filter(id=>id!==exId); }
    saveDrafts(drafts); overlay.remove(); onDone();
  });
}

/* ---------------- Профили: переключение ---------------- */
function switchProfile(id){
  setActiveProfileId(id);
  state = load();
  ui = { tab:'today', today:toISO(new Date()), viewDate:toISO(new Date()), weekStart:startOfWeek(new Date()) };
  stopRestTimer(false);
  if(state.onboarded){
    document.getElementById('onboarding').classList.add('hidden');
    renderApp();
  } else {
    obState = { step:0, gender:null, level:null, training:[], cardio:[], template:null };
    document.getElementById('app').innerHTML='';
    startOnboarding();
  }
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
  ensureProfiles();
  state = load();
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
