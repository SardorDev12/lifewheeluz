export * from './types';
export * from './theme';

export { copy } from './i18n/copy';
export type { Copy } from './i18n/copy';
export { monthNames } from './i18n/monthNames';
export { getAreaLabels } from './i18n/areaLabels';

export { initialScores, initialGoals } from './domain/seedData';
export { colors } from './domain/areaColors';
export {
  childrenOf,
  effectiveProgress,
  descendantIds,
} from './domain/goalTree';
export { polarPoint } from './domain/wheelGeometry';
export { computeWheelRideStats } from './domain/wheelRideStats';
export type { WheelRideStats, WheelRideTier } from './domain/wheelRideStats';
export { monthlyLabelFor, hasReviewedThisMonth } from './domain/reviewSchedule';

export type { DataStore, StorageEngine } from './persistence/store';
export {
  DRAFT_STORAGE_KEY,
  defaultDraft,
  defaultProfile,
  parseDraft,
  serializeDraft,
} from './persistence/draft';
export { createLocalStore } from './persistence/localStore';
export { migrateLocalToCloud } from './entitlement';
