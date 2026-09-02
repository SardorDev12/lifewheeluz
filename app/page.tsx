'use client';

import {
  FormEvent,
  KeyboardEvent,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleUserRound,
  Compass,
  Flag,
  Languages,
  LayoutDashboard,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Locale = 'uz' | 'en' | 'ru';
type View = 'today' | 'life' | 'goals' | 'reviews' | 'settings';
type Goal = {
  id: number;
  area: number;
  title: string;
  progress: number;
  year: string;
  note: string;
};
type Review = {
  id: number;
  date: string;
  win: string;
  lesson: string;
  next: string;
};
const copy = {
  uz: {
    greeting: 'Xayrli tong, Aziz',
    subtitle: 'Bugun hayotingizni bir qadam oldinga olib boring.',
    today: 'Bugun',
    life: 'Hayotim',
    goals: 'Maqsadlar',
    reviews: 'Tahlillar',
    settings: 'Sozlamalar',
    overview: 'Bugungi ko‘rinish',
    focus: 'Asosiy e’tibor',
    focusText: 'Sog‘liq sohasini 6 dan 7 ga olib chiqish',
    next: 'Keyingi qadam',
    walk: '30 daqiqa piyoda yuring',
    due: 'Bugun, 18:00',
    done: 'Bajarildi',
    wheel: 'Hayot g‘ildiragi',
    wheelHint: 'Har bir sohani 1 dan 10 gacha baholang.',
    update: 'Baholashni saqlash',
    progress: 'Faol maqsadlar',
    allGoals: 'Barcha maqsadlar',
    years: 'Uzoq muddatli',
    review: 'Keyingi oylik tahlil',
    reviewDate: '1 sentabr',
    start: 'Tahlilni boshlash',
    add: 'Maqsad qo‘shish',
    health: 'Sog‘liq',
    career: 'Kasb',
    finance: 'Moliya',
    relations: 'Munosabatlar',
    family: 'Oila',
    growth: 'Rivojlanish',
    fun: 'Hordiq',
    environment: 'Muhit',
    title: 'Maqsad nomi',
    area: 'Hayot sohasi',
    year: 'Maqsad yili',
    motivation: 'Nega bu muhim?',
    create: 'Maqsad yaratish',
    cancel: 'Bekor qilish',
    saved: 'Saqlandi',
    assessment: 'Baholash',
    assessmentText:
      'Hozirgi holatingizni halol baholang. Natija keyingi ustuvorlikni aniqlashga yordam beradi.',
    reset: 'Qayta boshlash',
    avg: 'O‘rtacha ball',
    weakest: 'E’tibor talab qiladi',
    goalCount: 'faol maqsad',
    noGoals: 'Hozircha maqsad yo‘q',
    editGoal: 'Maqsadni boshqarish',
    progressLabel: 'Jarayon',
    delete: 'O‘chirish',
    monthly: 'Oylik tahlil',
    win: 'Bu oyda eng yaxshi natijangiz nima bo‘ldi?',
    lesson: 'Nimani o‘rgandingiz?',
    nextMonth: 'Keyingi oyda asosiy e’tibor nimada?',
    finish: 'Tahlilni yakunlash',
    history: 'Tahlillar tarixi',
    noReviews: 'Birinchi tahlilingizni boshlang.',
    profile: 'Profil',
    name: 'Ism',
    email: 'Elektron pochta',
    language: 'Til',
    saveSettings: 'Sozlamalarni saqlash',
    offline: 'Qurilmada saqlanmoqda',
    offlineHint:
      'Supabase ulangach ma’lumotlar hisobingiz bilan sinxronlanadi.',
    completedAction: 'Bugungi qadam bajarildi!',
    assessmentSaved: 'Yangi baholash saqlandi.',
    goalCreated: 'Yangi maqsad yaratildi.',
    reviewSaved: 'Oylik tahlil yakunlandi.',
  },
  en: {
    greeting: 'Good morning, Aziz',
    subtitle: 'Move your life one intentional step forward today.',
    today: 'Today',
    life: 'My Life',
    goals: 'Goals',
    reviews: 'Reviews',
    settings: 'Settings',
    overview: 'Today at a glance',
    focus: 'Priority focus',
    focusText: 'Move Health from a 6 to a 7',
    next: 'Next action',
    walk: 'Take a 30-minute walk',
    due: 'Today, 18:00',
    done: 'Complete',
    wheel: 'Wheel of Life',
    wheelHint: 'Rate each area from 1 to 10.',
    update: 'Save assessment',
    progress: 'Active goals',
    allGoals: 'View all goals',
    years: 'Long-term',
    review: 'Next monthly review',
    reviewDate: 'September 1',
    start: 'Start review',
    add: 'Add goal',
    health: 'Health',
    career: 'Career',
    finance: 'Finances',
    relations: 'Relationships',
    family: 'Family',
    growth: 'Growth',
    fun: 'Recreation',
    environment: 'Environment',
    title: 'Goal title',
    area: 'Life area',
    year: 'Target year',
    motivation: 'Why does this matter?',
    create: 'Create goal',
    cancel: 'Cancel',
    saved: 'Saved',
    assessment: 'Assessment',
    assessmentText:
      'Rate where you are honestly. The result helps you choose your next priority.',
    reset: 'Start over',
    avg: 'Average score',
    weakest: 'Needs attention',
    goalCount: 'active goals',
    noGoals: 'No goals yet',
    editGoal: 'Manage goal',
    progressLabel: 'Progress',
    delete: 'Delete',
    monthly: 'Monthly review',
    win: 'What was your biggest win this month?',
    lesson: 'What did you learn?',
    nextMonth: 'What will you focus on next month?',
    finish: 'Complete review',
    history: 'Review history',
    noReviews: 'Start your first review.',
    profile: 'Profile',
    name: 'Name',
    email: 'Email',
    language: 'Language',
    saveSettings: 'Save settings',
    offline: 'Saving on this device',
    offlineHint:
      'Your data will sync with your account after Supabase is connected.',
    completedAction: 'Today’s action is complete!',
    assessmentSaved: 'New assessment saved.',
    goalCreated: 'New goal created.',
    reviewSaved: 'Monthly review completed.',
  },
  ru: {
    greeting: 'Доброе утро, Азиз',
    subtitle: 'Сделайте сегодня один осознанный шаг вперёд.',
    today: 'Сегодня',
    life: 'Моя жизнь',
    goals: 'Цели',
    reviews: 'Обзоры',
    settings: 'Настройки',
    overview: 'Сегодняшний обзор',
    focus: 'Главный фокус',
    focusText: 'Повысить «Здоровье» с 6 до 7',
    next: 'Следующее действие',
    walk: 'Прогуляться 30 минут',
    due: 'Сегодня, 18:00',
    done: 'Выполнить',
    wheel: 'Колесо жизни',
    wheelHint: 'Оцените каждую сферу от 1 до 10.',
    update: 'Сохранить оценку',
    progress: 'Активные цели',
    allGoals: 'Все цели',
    years: 'Долгосрочная',
    review: 'Следующий месячный обзор',
    reviewDate: '1 сентября',
    start: 'Начать обзор',
    add: 'Добавить цель',
    health: 'Здоровье',
    career: 'Карьера',
    finance: 'Финансы',
    relations: 'Отношения',
    family: 'Семья',
    growth: 'Развитие',
    fun: 'Отдых',
    environment: 'Окружение',
    title: 'Название цели',
    area: 'Сфера жизни',
    year: 'Целевой год',
    motivation: 'Почему это важно?',
    create: 'Создать цель',
    cancel: 'Отмена',
    saved: 'Сохранено',
    assessment: 'Оценка',
    assessmentText:
      'Честно оцените текущее состояние. Результат поможет выбрать следующий приоритет.',
    reset: 'Начать заново',
    avg: 'Средний балл',
    weakest: 'Требует внимания',
    goalCount: 'активных целей',
    noGoals: 'Целей пока нет',
    editGoal: 'Управление целью',
    progressLabel: 'Прогресс',
    delete: 'Удалить',
    monthly: 'Ежемесячный обзор',
    win: 'Каков ваш главный результат за месяц?',
    lesson: 'Чему вы научились?',
    nextMonth: 'На чём сосредоточитесь в следующем месяце?',
    finish: 'Завершить обзор',
    history: 'История обзоров',
    noReviews: 'Начните свой первый обзор.',
    profile: 'Профиль',
    name: 'Имя',
    email: 'Электронная почта',
    language: 'Язык',
    saveSettings: 'Сохранить настройки',
    offline: 'Сохраняется на устройстве',
    offlineHint:
      'После подключения Supabase данные синхронизируются с аккаунтом.',
    completedAction: 'Сегодняшний шаг выполнен!',
    assessmentSaved: 'Новая оценка сохранена.',
    goalCreated: 'Новая цель создана.',
    reviewSaved: 'Ежемесячный обзор завершён.',
  },
};
const initialScores = [6, 7, 5, 8, 7, 6, 4, 7],
  colors = [
    '#e26552',
    '#5b7fbd',
    '#e2a849',
    '#b56797',
    '#4b9a8c',
    '#7768b6',
    '#d47b43',
    '#60946b',
  ];
const initialGoals: Goal[] = [
  {
    id: 1,
    area: 1,
    title: 'Product rahbari bo‘lish',
    progress: 64,
    year: '2029',
    note: 'Strategik fikrlash va jamoa yetakchiligini rivojlantirish.',
  },
  {
    id: 2,
    area: 2,
    title: 'Moliyaviy zaxira yaratish',
    progress: 42,
    year: '2028',
    note: '12 oylik xarajatlarni qoplaydigan xavfsizlik fondi.',
  },
  {
    id: 3,
    area: 5,
    title: 'Ingliz tilida erkin gapirish',
    progress: 78,
    year: '2027',
    note: 'Har kuni 30 daqiqa faol mashq.',
  },
];

function LifeWheel({ labels, scores }: { labels: string[]; scores: number[] }) {
  const size = 310,
    c = size / 2,
    r = 104,
    p = (i: number, v: number) => {
      const a = (Math.PI * 2 * i) / scores.length - Math.PI / 2,
        d = (r * v) / 10;
      return [c + Math.cos(a) * d, c + Math.sin(a) * d];
    };
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[310px]"
      aria-label={labels.map((l, i) => `${l}: ${scores[i]}/10`).join(', ')}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full overflow-visible"
        role="img"
      >
        {[2, 4, 6, 8, 10].map((n) => (
          <polygon
            key={n}
            points={scores.map((_, i) => p(i, n).join(',')).join(' ')}
            fill="none"
            stroke="#dfe5df"
          />
        ))}
        {scores.map((_, i) => {
          const [x, y] = p(i, 10);
          return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#e6eae6" />;
        })}
        <polygon
          points={scores.map((v, i) => p(i, v).join(',')).join(' ')}
          fill="#2f776a"
          fillOpacity=".18"
          stroke="#2f776a"
          strokeWidth="2.5"
        />
        {scores.map((v, i) => {
          const [x, y] = p(i, v);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={colors[i]}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      {labels.map((l, i) => {
        const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        return (
          <span
            key={l}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold text-slate-500"
            style={{
              left: `${50 + Math.cos(a) * 45}%`,
              top: `${50 + Math.sin(a) * 45}%`,
            }}
          >
            {l}
          </span>
        );
      })}
    </div>
  );
}
function Modal({
  children,
  onClose,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}
function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7">
      <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function ScoreSlider({
  value,
  onChange,
  ariaLabel,
  min = 1,
  max = 10,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function valueFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const fraction = rect.width
      ? Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      : 0;
    const raw = min + fraction * (max - min);
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(valueFromClientX(e.clientX));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.buttons === 0) return;
    onChange(valueFromClientX(e.clientX));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    }
  }

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      className="relative flex h-6 w-full touch-none items-center select-none"
    >
      <div className="pointer-events-none absolute inset-x-0 h-2 rounded-full bg-[#e7ece8]" />
      <div
        className="pointer-events-none absolute h-2 rounded-full bg-[#2f776a]"
        style={{ width: `${percent}%` }}
      />
      <div
        className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-[#2f776a] shadow-[0_1px_4px_rgba(35,65,57,.3)]"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>('uz'),
    [view, setView] = useState<View>('today'),
    [scores, setScores] = useState(initialScores),
    [savedScores, setSavedScores] = useState(initialScores),
    [completed, setCompleted] = useState(false),
    [mobileNav, setMobileNav] = useState(false),
    [goals, setGoals] = useState<Goal[]>(initialGoals),
    [reviews, setReviews] = useState<Review[]>([]),
    [modal, setModal] = useState<'goal' | 'review' | 'profile' | null>(null),
    [selectedGoal, setSelectedGoal] = useState<number | null>(null),
    [toast, setToast] = useState(''),
    [profile, setProfile] = useState({
      name: 'Aziz Karimov',
      email: 'aziz@example.uz',
    }),
    [hydrated, setHydrated] = useState(false);
  const t = copy[locale],
    labels = useMemo(
      () => [
        t.health,
        t.career,
        t.finance,
        t.relations,
        t.family,
        t.growth,
        t.fun,
        t.environment,
      ],
      [t],
    ),
    nav = [
      [t.today, LayoutDashboard, 'today'],
      [t.life, Compass, 'life'],
      [t.goals, Target, 'goals'],
      [t.reviews, RefreshCw, 'reviews'],
    ] as const,
    weakest = scores.indexOf(Math.min(...scores)),
    currentGoal = goals.find((g) => g.id === selectedGoal);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('muvozanat-draft');
      if (raw) {
        const d = JSON.parse(raw);
        setScores(d.scores ?? initialScores);
        setSavedScores(d.scores ?? initialScores);
        setGoals(d.goals ?? initialGoals);
        setReviews(d.reviews ?? []);
        setCompleted(d.completed ?? false);
        setLocale(d.locale ?? 'uz');
        setProfile(d.profile ?? profile);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated)
      localStorage.setItem(
        'muvozanat-draft',
        JSON.stringify({
          scores: savedScores,
          goals,
          reviews,
          completed,
          locale,
          profile,
        }),
      );
  }, [hydrated, savedScores, goals, reviews, completed, locale, profile]);
  const notify = (m: string) => {
      setToast(m);
      window.setTimeout(() => setToast(''), 2400);
    },
    go = (v: View) => {
      setView(v);
      setMobileNav(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  function addGoal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      title = String(f.get('title') ?? '').trim();
    if (!title) return;
    setGoals([
      ...goals,
      {
        id: Date.now(),
        title,
        area: Number(f.get('area')),
        year: String(f.get('year')),
        note: String(f.get('note') ?? ''),
        progress: 0,
      },
    ]);
    setModal(null);
    notify(t.goalCreated);
  }
  function addReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setReviews([
      {
        id: Date.now(),
        date: new Date().toLocaleDateString(locale),
        win: String(f.get('win')),
        lesson: String(f.get('lesson')),
        next: String(f.get('next')),
      },
      ...reviews,
    ]);
    setModal(null);
    notify(t.reviewSaved);
  }
  const WheelEditor = () => (
    <section className="overflow-hidden rounded-[24px] border border-[#dfe5df] bg-white shadow-[0_12px_40px_rgba(35,65,57,.06)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="font-heading text-xl font-bold">{t.wheel}</h2>
          <p className="mt-1 text-xs text-slate-400">{t.wheelHint}</p>
        </div>
        <button
          onClick={() => setScores(savedScores)}
          className="rounded-xl bg-[#f2f6f3] p-2.5 text-[#2f776a]"
        >
          <RefreshCw size={17} />
        </button>
      </div>
      <div className="grid items-center gap-4 p-5 md:grid-cols-2 md:p-7">
        <LifeWheel labels={labels} scores={scores} />
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          {labels.map((l, i) => (
            <div key={l}>
              <span className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-500">
                <span>{l}</span>
                <b>{scores[i]}</b>
              </span>
              <ScoreSlider
                ariaLabel={l}
                value={scores[i]}
                onChange={(v) =>
                  setScores(scores.map((s, n) => (n === i ? v : s)))
                }
              />
            </div>
          ))}
          <Button
            className="col-span-2 mt-2 bg-[#2f776a]"
            onClick={() => {
              setSavedScores(scores);
              notify(t.assessmentSaved);
            }}
          >
            <Save />
            {t.update}
          </Button>
        </div>
      </div>
    </section>
  );
  const GoalsGrid = ({ limit }: { limit?: number }) => (
    <div className="grid gap-4 md:grid-cols-3">
      {goals.slice(0, limit).map((g) => (
        <button
          key={g.id}
          onClick={() => setSelectedGoal(g.id)}
          className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex justify-between">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{
                background: `${colors[g.area]}18`,
                color: colors[g.area],
              }}
            >
              {labels[g.area]}
            </span>
            <span className="text-xs text-slate-400">{t.years}</span>
          </div>
          <h3 className="mt-4 min-h-12 font-heading font-bold">{g.title}</h3>
          <div className="mt-5 flex justify-between text-xs">
            <span>{g.year}</span>
            <b>{g.progress}%</b>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${g.progress}%`, background: colors[g.area] }}
            />
          </div>
        </button>
      ))}
      {!goals.length && (
        <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-slate-400">
          {t.noGoals}
        </div>
      )}
    </div>
  );
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen max-w-[1580px] lg:grid-cols-[248px_1fr]">
        {mobileNav && (
          <button
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setMobileNav(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r bg-[#f8faf7] p-5 transition-transform lg:sticky lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button
            onClick={() => go('today')}
            className="mb-9 flex items-center gap-3 px-2 text-left"
          >
            <span className="grid size-10 place-items-center rounded-[14px] bg-[#2f776a] text-white">
              <Sparkles size={19} />
            </span>
            <span>
              <b className="font-heading text-lg">Muvozanat</b>
              <small className="block text-[10px] uppercase tracking-[.18em] text-slate-400">
                Life, intentionally
              </small>
            </span>
          </button>
          <nav className="space-y-1">
            {nav.map(([l, I, k]) => (
              <button
                key={k}
                onClick={() => go(k)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${view === k ? 'bg-white text-[#25685d] shadow-sm' : 'text-slate-500'}`}
              >
                <I size={18} />
                {l}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t pt-4">
            <button
              onClick={() => go('settings')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500"
            >
              <Settings size={18} />
              {t.settings}
            </button>
            <button
              onClick={() => setModal('profile')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white"
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#e7bda5] text-sm font-bold">
                AK
              </span>
              <span className="min-w-0">
                <b className="block truncate text-sm">{profile.name}</b>
                <small className="block truncate text-xs text-slate-400">
                  {profile.email}
                </small>
              </span>
            </button>
          </div>
        </aside>
        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex h-20 items-center border-b bg-white/85 px-5 backdrop-blur-xl md:px-10">
            <button
              onClick={() => setMobileNav(true)}
              className="rounded-xl border p-2 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Languages size={17} />
              <select
                aria-label={t.language}
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold"
              >
                <option value="uz">O‘zbekcha</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
              <button
                onClick={() => setModal('profile')}
                className="grid size-10 place-items-center rounded-full bg-[#f0f3ef]"
              >
                <CircleUserRound size={20} />
              </button>
            </div>
          </header>
          <div className="mx-auto max-w-[1240px] px-5 py-8 md:px-10 md:py-10">
            {view === 'today' && (
              <>
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#c56d50]">
                      {t.overview}
                    </p>
                    <h1 className="font-heading text-3xl font-bold md:text-[42px]">
                      {t.greeting}
                    </h1>
                    <p className="mt-2 text-slate-500">{t.subtitle}</p>
                  </div>
                  <Button
                    onClick={() => setModal('goal')}
                    className="bg-[#2f776a]"
                  >
                    <Plus />
                    {t.add}
                  </Button>
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
                  <WheelEditor />
                  <div className="grid gap-5">
                    <section className="rounded-[24px] bg-[#244f48] p-6 text-white">
                      <div className="flex justify-between">
                        <p className="text-xs font-bold uppercase text-emerald-100/70">
                          {t.focus}
                        </p>
                        <Flag size={17} />
                      </div>
                      <h2 className="mt-4 font-heading text-2xl font-bold">
                        {t.focusText}
                      </h2>
                      <div className="mt-6 rounded-2xl bg-white/10 p-4">
                        <p className="text-[10px] uppercase">{t.next}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setCompleted(!completed);
                              if (!completed) notify(t.completedAction);
                            }}
                            className={`grid size-9 place-items-center rounded-full border ${completed ? 'bg-[#efad8f] text-[#244f48]' : ''}`}
                          >
                            {completed && <Check />}
                          </button>
                          <div>
                            <p
                              className={
                                completed ? 'line-through opacity-60' : ''
                              }
                            >
                              {t.walk}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs opacity-60">
                              <CalendarDays size={12} />
                              {t.due}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="rounded-[24px] border bg-[#fff8f3] p-6">
                      <p className="text-xs font-bold uppercase text-[#bc6d4f]">
                        {t.review}
                      </p>
                      <h2 className="mt-3 font-heading text-2xl font-bold">
                        {t.reviewDate}
                      </h2>
                      <Button
                        onClick={() => setModal('review')}
                        variant="outline"
                        className="mt-6 w-full"
                      >
                        {t.start}
                        <ArrowRight />
                      </Button>
                    </section>
                  </div>
                </div>
                <section className="mt-6 rounded-[24px] border bg-white p-6">
                  <div className="mb-5 flex justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold">
                        {t.progress}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {goals.length} {t.goalCount}
                      </p>
                    </div>
                    <button
                      onClick={() => go('goals')}
                      className="text-sm font-semibold text-[#2f776a]"
                    >
                      {t.allGoals}
                    </button>
                  </div>
                  <GoalsGrid limit={3} />
                </section>
              </>
            )}
            {view === 'life' && (
              <>
                <PageTitle title={t.assessment} subtitle={t.assessmentText} />
                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-white p-5">
                    <small>{t.avg}</small>
                    <b className="mt-2 block text-2xl">
                      {(scores.reduce((a, b) => a + b, 0) / 8).toFixed(1)}
                    </b>
                  </div>
                  <div className="rounded-2xl border bg-white p-5">
                    <small>{t.weakest}</small>
                    <b className="mt-2 block text-2xl">
                      {labels[weakest]} · {scores[weakest]}/10
                    </b>
                  </div>
                </div>
                <WheelEditor />
                <Button
                  variant="outline"
                  onClick={() => setScores(initialScores)}
                  className="mt-4"
                >
                  <RefreshCw />
                  {t.reset}
                </Button>
              </>
            )}
            {view === 'goals' && (
              <>
                <div className="flex justify-between">
                  <PageTitle
                    title={t.goals}
                    subtitle={`${goals.length} ${t.goalCount}`}
                  />
                  <Button
                    onClick={() => setModal('goal')}
                    className="bg-[#2f776a]"
                  >
                    <Plus />
                    {t.add}
                  </Button>
                </div>
                <GoalsGrid />
              </>
            )}
            {view === 'reviews' && (
              <>
                <div className="flex justify-between">
                  <PageTitle title={t.history} subtitle={t.monthly} />
                  <Button
                    onClick={() => setModal('review')}
                    className="bg-[#2f776a]"
                  >
                    <Plus />
                    {t.start}
                  </Button>
                </div>
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <article
                      key={r.id}
                      className="rounded-[22px] border bg-white p-6"
                    >
                      <b className="flex gap-2 text-[#2f776a]">
                        <CheckCircle2 size={18} />
                        {r.date}
                      </b>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {[
                          [t.win, r.win],
                          [t.lesson, r.lesson],
                          [t.nextMonth, r.next],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <small className="font-bold text-slate-400">
                              {l}
                            </small>
                            <p className="mt-1 text-sm">{v}</p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                  {!reviews.length && (
                    <button
                      onClick={() => setModal('review')}
                      className="w-full rounded-[24px] border border-dashed bg-white/60 p-14 text-slate-500"
                    >
                      {t.noReviews}
                    </button>
                  )}
                </div>
              </>
            )}
            {view === 'settings' && (
              <>
                <PageTitle title={t.settings} subtitle={t.offlineHint} />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    notify(t.saved);
                  }}
                  className="max-w-2xl space-y-4 rounded-[24px] border bg-white p-6"
                >
                  <div className="rounded-2xl bg-[#f1f6f3] p-4">
                    <b className="text-[#2f776a]">{t.offline}</b>
                    <p className="text-sm text-slate-500">{t.offlineHint}</p>
                  </div>
                  <Field label={t.name}>
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="h-11"
                    />
                  </Field>
                  <Field label={t.email}>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="h-11"
                    />
                  </Field>
                  <Button type="submit" className="bg-[#2f776a]">
                    <Save />
                    {t.saveSettings}
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
      {modal === 'goal' && (
        <Modal label={t.add} onClose={() => setModal(null)}>
          <h2 className="font-heading text-2xl font-bold">{t.add}</h2>
          <form onSubmit={addGoal} className="mt-6 space-y-4">
            <Field label={t.title}>
              <Input name="title" required autoFocus className="h-11" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t.area}>
                <select
                  name="area"
                  className="h-11 w-full rounded-lg border px-3"
                >
                  {labels.map((l, i) => (
                    <option value={i} key={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.year}>
                <Input
                  name="year"
                  type="number"
                  defaultValue={2029}
                  className="h-11"
                />
              </Field>
            </div>
            <Field label={t.motivation}>
              <Textarea name="note" />
            </Field>
            <Button type="submit" className="w-full bg-[#2f776a]">
              <Plus />
              {t.create}
            </Button>
          </form>
        </Modal>
      )}
      {modal === 'review' && (
        <Modal label={t.monthly} onClose={() => setModal(null)}>
          <h2 className="font-heading text-2xl font-bold">{t.monthly}</h2>
          <form onSubmit={addReview} className="mt-6 space-y-4">
            <Field label={t.win}>
              <Textarea name="win" required />
            </Field>
            <Field label={t.lesson}>
              <Textarea name="lesson" required />
            </Field>
            <Field label={t.nextMonth}>
              <Textarea name="next" required />
            </Field>
            <Button type="submit" className="w-full bg-[#2f776a]">
              <Check />
              {t.finish}
            </Button>
          </form>
        </Modal>
      )}
      {modal === 'profile' && (
        <Modal label={t.profile} onClose={() => setModal(null)}>
          <h2 className="font-heading text-2xl font-bold">{profile.name}</h2>
          <p className="text-slate-500">{profile.email}</p>
          <Button
            onClick={() => {
              setModal(null);
              go('settings');
            }}
            variant="outline"
            className="mt-6"
          >
            <Pencil />
            {t.settings}
          </Button>
        </Modal>
      )}
      {currentGoal && (
        <Modal label={t.editGoal} onClose={() => setSelectedGoal(null)}>
          <h2 className="pr-10 font-heading text-2xl font-bold">
            {currentGoal.title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{currentGoal.note}</p>
          <div className="mt-7">
            <span className="flex justify-between">
              <b>{t.progressLabel}</b>
              <b>{currentGoal.progress}%</b>
            </span>
            <ScoreSlider
              ariaLabel={t.progressLabel}
              min={0}
              max={100}
              step={5}
              value={currentGoal.progress}
              onChange={(v) =>
                setGoals(
                  goals.map((g) =>
                    g.id === currentGoal.id ? { ...g, progress: v } : g,
                  ),
                )
              }
            />
          </div>
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setGoals(goals.filter((g) => g.id !== currentGoal.id));
                setSelectedGoal(null);
              }}
              className="text-red-600"
            >
              <Trash2 />
              {t.delete}
            </Button>
            <Button
              onClick={() => {
                setSelectedGoal(null);
                notify(t.saved);
              }}
              className="bg-[#2f776a]"
            >
              <Save />
              {t.saved}
            </Button>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#193f38] px-5 py-3 text-sm font-semibold text-white">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </main>
  );
}
