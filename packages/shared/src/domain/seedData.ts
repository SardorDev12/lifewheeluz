import type { Goal } from '../types';

export const initialScores = [6, 7, 5, 8, 7, 6, 4, 7];

export const initialGoals: Goal[] = [
  {
    id: 1,
    parentId: null,
    area: 1,
    title: 'Product rahbari bo‘lish',
    progress: 64,
    year: '2029',
    note: 'Strategik fikrlash va jamoa yetakchiligini rivojlantirish.',
  },
  {
    id: 2,
    parentId: null,
    area: 2,
    title: 'Moliyaviy zaxira yaratish',
    progress: 42,
    year: '2028',
    note: '12 oylik xarajatlarni qoplaydigan xavfsizlik fondi.',
  },
  {
    id: 3,
    parentId: null,
    area: 5,
    title: 'Ingliz tilida erkin gapirish',
    progress: 78,
    year: '2027',
    note: 'Har kuni 30 daqiqa faol mashq.',
  },
  {
    id: 4,
    parentId: 3,
    area: 5,
    title: 'Har kuni 20 ta yangi so‘z yodlash',
    progress: 100,
    year: '2026',
    note: 'Kundalik lug‘at mashqi.',
  },
  {
    id: 5,
    parentId: 3,
    area: 5,
    title: 'Haftada 3 marta suhbat klubi',
    progress: 0,
    year: '2026',
    note: 'Amaliy gapirish mashqi.',
  },
];
