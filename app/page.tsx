'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Compass,
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
import {
  childrenOf,
  colors,
  computeWheelRideStats,
  copy,
  descendantIds,
  effectiveProgress,
  getAreaLabels,
  hasReviewedThisMonth as computeHasReviewedThisMonth,
  initialGoals,
  initialScores,
  monthlyLabelFor,
  polarPoint,
  type Goal,
  type Locale,
  type Review,
  type View,
} from '@lifewheeluz/shared';

function LifeWheel({ labels, scores }: { labels: string[]; scores: number[] }) {
  const size = 310,
    c = size / 2,
    r = 104,
    p = (i: number, v: number) => polarPoint(i, v, scores.length, r, c);
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

function WheelRide({
  scores,
  labels,
  title,
  smoothLabel,
  smoothCaption,
  unevenLabel,
  unevenCaption,
  roughLabel,
  roughCaption,
  whyTitle,
  whyHint,
  reassessLabel,
  onReassess,
}: {
  scores: number[];
  labels: string[];
  title: string;
  smoothLabel: string;
  smoothCaption: string;
  unevenLabel: string;
  unevenCaption: string;
  roughLabel: string;
  roughCaption: string;
  whyTitle: string;
  whyHint: string;
  reassessLabel: string;
  onReassess: () => void;
}) {
  const { bounce, duration, tier } = computeWheelRideStats(scores),
    [label, caption] =
      tier === 'smooth'
        ? [smoothLabel, smoothCaption]
        : tier === 'uneven'
          ? [unevenLabel, unevenCaption]
          : [roughLabel, roughCaption],
    c = 60,
    r = 42,
    p = (i: number, v: number) => polarPoint(i, v, scores.length, r, c);
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#dfe5df] bg-white shadow-[0_12px_40px_rgba(35,65,57,.06)]">
      <div className="px-6 pt-5">
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm font-semibold text-[#2f776a]">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{caption}</p>
      </div>
      <div className="relative mt-5 h-52 overflow-hidden bg-gradient-to-b from-[#eef3ee] to-[#e2e9e2]">
        <div
          className="absolute inset-x-0 bottom-14 h-[3px]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #97a89c 0 16px, transparent 16px 32px)',
            animation: `road-scroll ${duration}s linear infinite`,
          }}
        />
        <div
          className="absolute bottom-8 left-1/2 h-36 w-36 -translate-x-1/2"
          style={
            {
              '--bounce': `${bounce}px`,
              animation: `wheel-bounce ${duration}s ease-in-out infinite`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full"
            role="img"
            aria-label={`${label}: ${caption}`}
            style={{ animation: `wheel-spin ${duration}s linear infinite` }}
          >
            {scores.map((_, i) => {
              const [x, y] = p(i, 10);
              return (
                <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#bfe0d8" />
              );
            })}
            <polygon
              points={scores.map((v, i) => p(i, v).join(',')).join(' ')}
              fill="#8fc3b7"
              fillOpacity=".9"
              stroke="#2f776a"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx={c} cy={c} r="7" fill="#2f776a" />
          </svg>
        </div>
      </div>
      <div className="border-t border-slate-100 px-6 py-5">
        <h3 className="text-sm font-bold">{whyTitle}</h3>
        <p className="mt-0.5 text-xs text-slate-400">{whyHint}</p>
        <div className="mt-4">
          <LifeWheel labels={labels} scores={scores} />
        </div>
        <Button onClick={onReassess} variant="outline" className="mt-5 w-full">
          <Compass />
          {reassessLabel}
        </Button>
      </div>
    </section>
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

function ScoreDropdown({
  value,
  onChange,
  ariaLabel,
  meanings,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  meanings: string[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | globalThis.TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#dce4df] bg-[#fbfcfb] py-2.5 pr-3 pl-3.5 text-left text-sm outline-none transition-colors focus-visible:border-[#2f776a] focus-visible:ring-2 focus-visible:ring-[#2f776a]/20"
      >
        <span className="flex items-center gap-2.5 truncate">
          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#2f776a] text-[11px] font-bold text-white">
            {value}
          </span>
          <span className="truncate font-medium text-[#1f2c28]">
            {meanings[value - 1]}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`flex-none text-[#2f776a] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-[#dce4df] bg-white py-1.5 shadow-[0_12px_32px_rgba(35,65,57,.14)]"
        >
          {meanings.map((meaning, i) => {
            const n = i + 1,
              selected = n === value;
            return (
              <button
                key={meaning}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-[#f2f6f3] ${selected ? 'bg-[#f2f6f3]' : ''}`}
              >
                <span
                  className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] font-bold ${
                    selected
                      ? 'bg-[#2f776a] text-white'
                      : 'bg-[#e7ece8] text-slate-500'
                  }`}
                >
                  {n}
                </span>
                <span
                  className={
                    selected ? 'font-semibold text-[#1f2c28]' : 'text-slate-600'
                  }
                >
                  {meaning}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>('uz'),
    [view, setView] = useState<View>('today'),
    [scores, setScores] = useState(initialScores),
    [savedScores, setSavedScores] = useState(initialScores),
    [mobileNav, setMobileNav] = useState(false),
    [goals, setGoals] = useState<Goal[]>(initialGoals),
    [reviews, setReviews] = useState<Review[]>([]),
    [modal, setModal] = useState<'goal' | 'review' | 'profile' | null>(null),
    [selectedGoal, setSelectedGoal] = useState<string | null>(null),
    [addGoalParentId, setAddGoalParentId] = useState<string | null>(null),
    [toast, setToast] = useState(''),
    [profile, setProfile] = useState({
      name: 'Aziz Karimov',
      email: 'aziz@example.uz',
    }),
    [hydrated, setHydrated] = useState(false);
  const t = copy[locale],
    labels = useMemo(() => getAreaLabels(locale), [locale]),
    nav = [
      [t.today, LayoutDashboard, 'today'],
      [t.life, Compass, 'life'],
      [t.goals, Target, 'goals'],
      [t.reviews, RefreshCw, 'reviews'],
    ] as const,
    weakest = scores.indexOf(Math.min(...scores)),
    currentGoal = goals.find((g) => g.id === selectedGoal),
    lastMonthLabel = monthlyLabelFor(new Date(), locale),
    hasReviewedThisMonth = computeHasReviewedThisMonth(reviews);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('muvozanat-draft');
      if (raw) {
        const d = JSON.parse(raw);
        setScores(d.scores ?? initialScores);
        setSavedScores(d.scores ?? initialScores);
        setGoals(d.goals ?? initialGoals);
        setReviews(d.reviews ?? []);
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
          locale,
          profile,
        }),
      );
  }, [hydrated, savedScores, goals, reviews, locale, profile]);
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
      title = String(f.get('title') ?? '').trim(),
      parent = goals.find((g) => g.id === addGoalParentId);
    if (!title) return;
    setGoals([
      ...goals,
      {
        id: crypto.randomUUID(),
        parentId: addGoalParentId,
        title,
        area: parent ? parent.area : Number(f.get('area')),
        year: String(f.get('year') ?? parent?.year ?? ''),
        note: String(f.get('note') ?? ''),
        progress: 0,
      },
    ]);
    setModal(null);
    setAddGoalParentId(null);
    notify(t.goalCreated);
  }
  function addReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setReviews([
      {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(locale),
        createdAt: new Date().toISOString(),
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
    <section className="rounded-[24px] border border-[#dfe5df] bg-white shadow-[0_12px_40px_rgba(35,65,57,.06)]">
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
        <div className="space-y-4">
          {labels.map((l, i) => (
            <div key={l}>
              <span className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                {l}
              </span>
              <ScoreDropdown
                ariaLabel={l}
                value={scores[i]}
                meanings={t.scoreMeanings}
                onChange={(v) =>
                  setScores(scores.map((s, n) => (n === i ? v : s)))
                }
              />
            </div>
          ))}
          <Button
            className="w-full bg-[#2f776a]"
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
  const rootGoals = goals.filter((g) => g.parentId === null);
  const GoalsGrid = ({ limit }: { limit?: number }) => (
    <div className="grid gap-4 md:grid-cols-3">
      {rootGoals.slice(0, limit).map((g) => {
        const progress = effectiveProgress(g, goals),
          subCount = childrenOf(goals, g.id).length;
        return (
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
            {subCount > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                {subCount} {t.subgoals}
              </p>
            )}
            <div className="mt-5 flex justify-between text-xs">
              <span>{g.year}</span>
              <b>{progress}%</b>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: colors[g.area] }}
              />
            </div>
          </button>
        );
      })}
      {!rootGoals.length && (
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
                    onClick={() => {
                      setAddGoalParentId(null);
                      setModal('goal');
                    }}
                    className="bg-[#2f776a]"
                  >
                    <Plus />
                    {t.add}
                  </Button>
                </div>
                <div className="grid items-start gap-5 xl:grid-cols-[1.35fr_.85fr]">
                  <WheelRide
                    scores={scores}
                    labels={labels}
                    title={t.rideTitle}
                    smoothLabel={t.rideSmoothLabel}
                    smoothCaption={t.rideSmoothCaption}
                    unevenLabel={t.rideUnevenLabel}
                    unevenCaption={t.rideUnevenCaption}
                    roughLabel={t.rideRoughLabel}
                    roughCaption={t.rideRoughCaption}
                    whyTitle={t.rideWhy}
                    whyHint={t.rideWhyHint}
                    reassessLabel={t.reassess}
                    onReassess={() => setView('life')}
                  />
                  <div className="grid gap-5">
                    {!hasReviewedThisMonth && (
                      <section className="rounded-[24px] border bg-[#fff8f3] p-6">
                        <p className="text-xs font-bold uppercase text-[#bc6d4f]">
                          {t.monthlyAnalysis}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {lastMonthLabel}
                        </p>
                        <Button
                          onClick={() => setModal('review')}
                          variant="outline"
                          className="mt-6 w-full"
                        >
                          {t.start}
                          <ArrowRight />
                        </Button>
                      </section>
                    )}
                  </div>
                </div>
                <section className="mt-6 rounded-[24px] border bg-white p-6">
                  <div className="mb-5 flex justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold">
                        {t.progress}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {rootGoals.length} {t.goalCount}
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
                    subtitle={`${rootGoals.length} ${t.goalCount}`}
                  />
                  <Button
                    onClick={() => {
                      setAddGoalParentId(null);
                      setModal('goal');
                    }}
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
                  {reviews.map((r) => {
                    const reviewMonthLabel = monthlyLabelFor(
                      new Date(r.createdAt),
                      locale,
                    );
                    return (
                      <article
                        key={r.id}
                        className="rounded-[22px] border bg-white p-6"
                      >
                        <b className="flex items-center gap-2 text-[#2f776a]">
                          <CheckCircle2 size={18} />
                          {r.date}
                        </b>
                        {reviewMonthLabel && (
                          <p className="mt-1 text-xs text-slate-400">
                            {reviewMonthLabel}
                          </p>
                        )}
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
                    );
                  })}
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
      {modal === 'goal' &&
        (() => {
          const parentGoal = goals.find((g) => g.id === addGoalParentId),
            modalTitle = parentGoal ? t.addSubgoal : t.add;
          return (
            <Modal label={modalTitle} onClose={() => setModal(null)}>
              <h2 className="font-heading text-2xl font-bold">{modalTitle}</h2>
              {parentGoal && (
                <p className="mt-1 text-sm text-slate-500">
                  {parentGoal.title}
                </p>
              )}
              <p className="mt-4 rounded-xl bg-[#f2f6f3] px-3.5 py-3 text-xs text-[#4b6359]">
                💡 {parentGoal ? t.smartHintSub : t.smartHintBig}
              </p>
              <form onSubmit={addGoal} className="mt-4 space-y-4">
                {parentGoal ? (
                  <Field label={t.area}>
                    <span
                      className="flex h-11 items-center rounded-lg border px-3 text-sm font-semibold"
                      style={{ color: colors[parentGoal.area] }}
                    >
                      {labels[parentGoal.area]}
                    </span>
                  </Field>
                ) : (
                  <Field label={t.area}>
                    <select
                      name="area"
                      defaultValue={weakest}
                      className="h-11 w-full rounded-lg border px-3"
                    >
                      {labels.map((l, i) => (
                        <option value={i} key={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label={t.title}>
                  <Input
                    name="title"
                    required
                    placeholder={
                      parentGoal
                        ? t.subgoalTitlePlaceholder
                        : t.goalTitlePlaceholder
                    }
                    className="h-11"
                  />
                </Field>
                <Field label={t.year}>
                  <Input
                    name="year"
                    type="number"
                    defaultValue={parentGoal ? parentGoal.year : 2029}
                    className="h-11"
                  />
                </Field>
                <Field label={t.motivation}>
                  <Textarea name="note" />
                </Field>
                <Button type="submit" className="w-full bg-[#2f776a]">
                  <Plus />
                  {t.create}
                </Button>
              </form>
            </Modal>
          );
        })()}
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
      {currentGoal &&
        (() => {
          const parent = goals.find((g) => g.id === currentGoal.parentId),
            subgoals = childrenOf(goals, currentGoal.id),
            progress = effectiveProgress(currentGoal, goals);
          return (
            <Modal label={t.editGoal} onClose={() => setSelectedGoal(null)}>
              {parent && (
                <button
                  onClick={() => setSelectedGoal(parent.id)}
                  className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#2f776a]"
                >
                  <ChevronLeft size={16} />
                  {parent.title}
                </button>
              )}
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{
                  background: `${colors[currentGoal.area]}18`,
                  color: colors[currentGoal.area],
                }}
              >
                {labels[currentGoal.area]}
              </span>
              <h2 className="mt-3 pr-10 font-heading text-2xl font-bold">
                {currentGoal.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{currentGoal.note}</p>
              <div className="mt-7">
                {subgoals.length > 0 ? (
                  <>
                    <span className="flex justify-between">
                      <b>{t.progressLabel}</b>
                      <b>{progress}%</b>
                    </span>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: colors[currentGoal.area],
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {t.autoProgressHint}
                    </p>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      setGoals(
                        goals.map((g) =>
                          g.id === currentGoal.id
                            ? { ...g, progress: g.progress === 100 ? 0 : 100 }
                            : g,
                        ),
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfcfb] px-4 py-3.5 text-left"
                  >
                    <span
                      className={`grid h-6 w-6 flex-none place-items-center rounded-full border-2 ${
                        currentGoal.progress === 100
                          ? 'border-[#2f776a] bg-[#2f776a] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {currentGoal.progress === 100 && <Check size={14} />}
                    </span>
                    <span className="text-sm font-semibold">{t.markDone}</span>
                  </button>
                )}
              </div>
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <b className="text-sm">{t.subgoalsTitle}</b>
                  <button
                    onClick={() => {
                      setAddGoalParentId(currentGoal.id);
                      setSelectedGoal(null);
                      setModal('goal');
                    }}
                    className="flex items-center gap-1 text-sm font-semibold text-[#2f776a]"
                  >
                    <Plus size={16} />
                    {t.addSubgoal}
                  </button>
                </div>
                {subgoals.length ? (
                  <div className="mt-3 space-y-2">
                    {subgoals.map((k) => {
                      const kKids = childrenOf(goals, k.id),
                        kDone = k.progress === 100;
                      return (
                        <button
                          key={k.id}
                          onClick={() => setSelectedGoal(k.id)}
                          className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-[#fbfcfb] px-4 py-3 text-left hover:bg-slate-50"
                        >
                          <span className="flex items-center gap-2.5 text-sm font-semibold">
                            {!kKids.length && (
                              <span
                                className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 ${
                                  kDone
                                    ? 'border-[#2f776a] bg-[#2f776a] text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {kDone && <Check size={12} />}
                              </span>
                            )}
                            {k.title}
                          </span>
                          <span className="flex items-center gap-2 text-xs text-slate-400">
                            {kKids.length > 0 &&
                              `${effectiveProgress(k, goals)}%`}
                            <ChevronRight size={16} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">{t.noSubgoals}</p>
                )}
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const toRemove = new Set([
                      currentGoal.id,
                      ...descendantIds(goals, currentGoal.id),
                    ]);
                    setGoals(goals.filter((g) => !toRemove.has(g.id)));
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
          );
        })()}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#193f38] px-5 py-3 text-sm font-semibold text-white">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </main>
  );
}
