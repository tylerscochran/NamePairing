
import { Person } from '@shared/schema';

const STORAGE_KEY = 'name-pairing-data';

export interface StorageData {
  persons: Person[];
}

export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { persons: [] };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { persons: [] };
  }
};

export const saveStorageData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
