import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shuffle an array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Function to generate pairs from an array
export function generatePairs<T>(items: T[]): T[][] {
  const shuffled = shuffleArray(items);
  const pairs: T[][] = [];
  
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    } else {
      // Handle odd number of names - create a solo person
      pairs.push([shuffled[i]]);
    }
  }
  
  return pairs;
}

// Function to validate a name
export function validateName(name: string): boolean {
  return name.length > 0 && /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(name);
}

// Parse bulk input text into an array of names
export function parseBulkInput(text: string): string[] {
  if (!text.trim()) return [];
  
  // Split by newlines and commas
  return text
    .split(/[\n,]+/)
    .map((name) => name.trim())
    .filter((name) => name && validateName(name));
}
