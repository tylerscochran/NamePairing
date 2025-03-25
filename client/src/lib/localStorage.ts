// Client-side localStorage service
import { Person } from './schema';

const STORAGE_KEY = 'name-pairing-tool-data';

interface StorageData {
  persons: Person[];
}

const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return { persons: [] };
};

const saveStorageData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getPersons = (): Person[] => {
  return getStorageData().persons;
};

export const addPerson = (person: Person): boolean => {
  const data = getStorageData();
  // Check if person already exists
  if (data.persons.some(p => p.name === person.name)) {
    return false;
  }
  
  data.persons.push(person);
  saveStorageData(data);
  return true;
};

export const removePerson = (person: Person): boolean => {
  const data = getStorageData();
  const initialLength = data.persons.length;
  
  data.persons = data.persons.filter(p => p.name !== person.name);
  
  if (data.persons.length !== initialLength) {
    saveStorageData(data);
    return true;
  }
  return false;
};

export const clearPersons = (): void => {
  saveStorageData({ persons: [] });
};

export const addPersons = (newPersons: Person[]): number => {
  const data = getStorageData();
  let addedCount = 0;
  
  newPersons.forEach(newPerson => {
    if (!data.persons.some(p => p.name === newPerson.name)) {
      data.persons.push(newPerson);
      addedCount++;
    }
  });
  
  if (addedCount > 0) {
    saveStorageData(data);
  }
  
  return addedCount;
};