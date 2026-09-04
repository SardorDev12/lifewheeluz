import type { Goal } from '../types';

export const initialScores = [6, 7, 5, 8, 7, 6, 4, 7];

// Fixed uuids (not crypto.randomUUID() at module-load time) so the seed
// data is stable across reloads/tests/snapshots.
const SEED_GOAL_1 = '2d60f1c1-4f23-40f6-8065-0ebe574d7413',
  SEED_GOAL_2 = 'c580db60-4b0a-4de2-8f4f-13a3ac34a4bb',
  SEED_GOAL_3 = '11d772af-7a1b-4176-99b7-abc49b1cf9d4',
  SEED_GOAL_4 = 'e6664238-37c0-4d8e-a78a-18985167f4d7',
  SEED_GOAL_5 = '2fbfd876-e6b8-4901-94a3-cf799361e151';

export const initialGoals: Goal[] = [
  {
    id: SEED_GOAL_1,
    parentId: null,
    area: 1,
    title: 'Product rahbari bo‘lish',
    progress: 64,
    year: '2029',
    note: 'Strategik fikrlash va jamoa yetakchiligini rivojlantirish.',
  },
  {
    id: SEED_GOAL_2,
    parentId: null,
    area: 2,
    title: 'Moliyaviy zaxira yaratish',
    progress: 42,
    year: '2028',
    note: '12 oylik xarajatlarni qoplaydigan xavfsizlik fondi.',
  },
  {
    id: SEED_GOAL_3,
    parentId: null,
    area: 5,
    title: 'Ingliz tilida erkin gapirish',
    progress: 78,
    year: '2027',
    note: 'Har kuni 30 daqiqa faol mashq.',
  },
  {
    id: SEED_GOAL_4,
    parentId: SEED_GOAL_3,
    area: 5,
    title: 'Har kuni 20 ta yangi so‘z yodlash',
    progress: 100,
    year: '2026',
    note: 'Kundalik lug‘at mashqi.',
  },
  {
    id: SEED_GOAL_5,
    parentId: SEED_GOAL_3,
    area: 5,
    title: 'Haftada 3 marta suhbat klubi',
    progress: 0,
    year: '2026',
    note: 'Amaliy gapirish mashqi.',
  },
];
