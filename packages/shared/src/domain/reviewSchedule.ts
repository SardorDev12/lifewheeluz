import { copy } from '../i18n/copy';
import { monthNames } from '../i18n/monthNames';
import type { Locale, Review } from '../types';

/**
 * Localized "{month} analysis" label for the month *before* `date` (the
 * app always reviews the month that just finished).
 */
export function monthlyLabelFor(date: Date, locale: Locale): string {
  if (Number.isNaN(date.getTime())) return '';
  const name = monthNames[locale][(date.getMonth() - 1 + 12) % 12],
    capitalized =
      locale === 'ru' ? name : name[0].toUpperCase() + name.slice(1);
  return copy[locale].monthlyAnalysisSubtitle.replace('{month}', capitalized);
}

export function hasReviewedThisMonth(
  reviews: Review[],
  now: Date = new Date(),
): boolean {
  return reviews.some((r) => {
    const created = new Date(r.createdAt);
    return (
      !Number.isNaN(created.getTime()) &&
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth()
    );
  });
}
