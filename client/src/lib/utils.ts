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

// Function to generate pairs where each person is guaranteed to be paired with someone else
export function generatePairs<T>(items: T[]): T[][] {
  // If we have fewer than 2 items, just return the original item as a "solo"
  if (items.length < 2) {
    return items.map(item => [item]);
  }
  
  // For even number of items, we'll ensure no one gets paired with themselves
  const pairs: T[][] = [];
  
  // Create a copy of items to work with
  const itemsCopy = [...items];
  
  // If we have an odd number, extract one person to be solo
  let solo: T | null = null;
  if (itemsCopy.length % 2 !== 0) {
    const randomIndex = Math.floor(Math.random() * itemsCopy.length);
    solo = itemsCopy.splice(randomIndex, 1)[0];
  }
  
  // Shuffle remaining items for randomness
  const shuffled = shuffleArray(itemsCopy);
  
  // Create a second shuffled array that's guaranteed to be different from the first
  // This ensures no person is paired with themselves
  let secondShuffle: T[] = [];
  
  // If there are just 2 people, swap them
  if (shuffled.length === 2) {
    secondShuffle = [shuffled[1], shuffled[0]];
  } else {
    // For 3+ people, use a derangement (permutation where no element appears in its original position)
    let attempts = 0;
    const maxAttempts = 100; // Safeguard against infinite loops
    
    while (attempts < maxAttempts) {
      secondShuffle = shuffleArray([...shuffled]);
      
      // Check if this is a valid derangement (no element in its original position)
      let isValid = true;
      for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] === secondShuffle[i]) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) break;
      attempts++;
    }
    
    // If we couldn't find a complete derangement, manually fix any matches
    for (let i = 0; i < shuffled.length; i++) {
      if (shuffled[i] === secondShuffle[i]) {
        // Find another position to swap with
        for (let j = 0; j < secondShuffle.length; j++) {
          if (i !== j && shuffled[j] !== secondShuffle[j]) {
            // Swap to fix the match
            [secondShuffle[i], secondShuffle[j]] = [secondShuffle[j], secondShuffle[i]];
            break;
          }
        }
      }
    }
  }
  
  // Form pairs from the two shuffled arrays
  for (let i = 0; i < shuffled.length; i++) {
    pairs.push([shuffled[i], secondShuffle[i]]);
  }
  
  // Add the solo person if we had an odd number
  if (solo !== null) {
    pairs.push([solo]);
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
