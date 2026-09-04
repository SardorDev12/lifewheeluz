import { copy } from './copy';
import type { Locale } from '../types';

export function getAreaLabels(locale: Locale): string[] {
  const t = copy[locale];
  return [
    t.health,
    t.career,
    t.finance,
    t.relations,
    t.family,
    t.growth,
    t.fun,
    t.environment,
  ];
}
