import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageEngine } from '@lifewheeluz/shared';

export const mobileStorageEngine: StorageEngine = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
};
