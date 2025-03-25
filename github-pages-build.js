// GitHub Pages Build Script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a client-only version for GitHub Pages
console.log('Building client-only version for GitHub Pages...');

// 1. Create a temporary localStorage service
const localStorageServicePath = path.join(__dirname, 'client/src/lib/localStorage.ts');
const localStorageServiceContent = `// Client-side localStorage service for GitHub Pages deployment
import { Person } from '@shared/schema';

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
`;

// 2. Create an updated Home component for GitHub Pages
const homeComponentPath = path.join(__dirname, 'client/src/pages/HomeGitHubPages.tsx');
const homeComponentContent = `import { useState, useEffect } from "react";
import NameInput from "@/components/NameInput";
import PairingSection from "@/components/PairingSection";
import { generatePairs } from "@/lib/utils";
import { Person } from "@shared/schema";
import * as localStorageService from "@/lib/localStorage";

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [pairs, setPairs] = useState<Person[][]>([]);
  const [pairsGenerated, setPairsGenerated] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedPersons = localStorageService.getPersons();
    if (storedPersons.length > 0) {
      setPersons(storedPersons);
    }
  }, []);

  const addPerson = (person: Person): boolean => {
    const success = localStorageService.addPerson(person);
    if (success) {
      setPersons((prevPersons) => [...prevPersons, person]);
    }
    return success;
  };

  const removePerson = (person: Person) => {
    localStorageService.removePerson(person);
    setPersons((prevPersons) => prevPersons.filter((p) => p.name !== person.name));
    
    if (pairsGenerated) {
      // Regenerate pairs if we're removing a person and pairs are already generated
      const newPersons = persons.filter((p) => p.name !== person.name);
      if (newPersons.length > 0) {
        const newPairs = generatePairs(newPersons);
        setPairs(newPairs);
      } else {
        setPairs([]);
        setPairsGenerated(false);
      }
    }
  };

  const clearPersons = () => {
    localStorageService.clearPersons();
    setPersons([]);
    setPairs([]);
    setPairsGenerated(false);
  };

  const handleGeneratePairs = () => {
    if (persons.length === 0) {
      return;
    }

    const newPairs = generatePairs(persons);
    setPairs(newPairs);
    setPairsGenerated(true);
  };

  const handleBulkAdd = (newPersons: Person[]) => {
    if (newPersons.length === 0) {
      return;
    }

    const addedCount = localStorageService.addPersons(newPersons);
    
    if (addedCount > 0) {
      // Filter out duplicates comparing with existing persons list
      const uniquePersons = newPersons.filter(newPerson => 
        !persons.some(existingPerson => existingPerson.name === newPerson.name)
      );
      
      setPersons((prevPersons) => [...prevPersons, ...uniquePersons]);
      
      if (pairsGenerated) {
        // Regenerate pairs if we're adding persons and pairs are already generated
        const updatedPersons = [...persons, ...uniquePersons];
        const newPairs = generatePairs(updatedPersons);
        setPairs(newPairs);
      }
    }
  };

  return (
    <div className="bg-gray-900 font-sans min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <header className="text-center mb-8" role="banner">
          <div className="font-options mb-6">
            <h1 className="text-5xl md:text-6xl font-fredoka text-gradient mb-2 tracking-wide py-2 leading-relaxed">
              Name Pairing Tool
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A simple utility for randomly pairing people with other people's profile links
          </p>
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex flex-col gap-8" role="main">
          <NameInput 
            persons={persons}
            onRemovePerson={removePerson} 
            onClearPersons={clearPersons}
            onAddPersons={handleBulkAdd}
            onGeneratePairs={handleGeneratePairs}
          />
          
          <PairingSection 
            persons={persons}
            pairs={pairs}
            pairsGenerated={pairsGenerated}
          />
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-400 text-sm py-4" role="contentinfo">
          <p>
            Name Pairing Tool &nbsp;&copy; {new Date().getFullYear()} &nbsp;
            <a 
              href="https://www.tylercochran.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:underline"
            >
              Tyler Cochran
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
`;

// 3. Create an updated App component for GitHub Pages
const appComponentPath = path.join(__dirname, 'client/src/AppGitHubPages.tsx');
const appComponentContent = `import Home from "@/pages/HomeGitHubPages";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useKeyboardMode } from "@/hooks/use-keyboard-mode";

function AppContent() {
  // Set up keyboard navigation detection for a11y
  useKeyboardMode();
  
  return (
    <>
      {/* Skip to main content link for keyboard accessibility */}
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Home />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
`;

// 4. Create an updated main.tsx for GitHub Pages
const mainComponentPath = path.join(__dirname, 'client/src/mainGitHubPages.tsx');
const mainComponentContent = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./AppGitHubPages";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

// Write files
fs.writeFileSync(localStorageServicePath, localStorageServiceContent);
fs.writeFileSync(homeComponentPath, homeComponentContent);
fs.writeFileSync(appComponentPath, appComponentContent);
fs.writeFileSync(mainComponentPath, mainComponentContent);

console.log('Created client-only files for GitHub Pages deployment');

// Update main.tsx temporarily for building
const originalMainPath = path.join(__dirname, 'client/src/main.tsx');
const originalMainContent = fs.readFileSync(originalMainPath, 'utf8');
fs.writeFileSync(originalMainPath, mainComponentContent);

try {
  // Build client with the temporary files
  console.log('Building client for GitHub Pages...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create a _config.yml file for GitHub Pages in the dist directory
  const configYmlPath = path.join(__dirname, 'dist', '_config.yml');
  fs.writeFileSync(configYmlPath, 'baseurl: /name-pairing-tool\n');
  
  // Create a .nojekyll file to disable Jekyll processing
  const nojekyllPath = path.join(__dirname, 'dist', '.nojekyll');
  fs.writeFileSync(nojekyllPath, '');
  
  console.log('GitHub Pages build completed!');
} finally {
  // Restore original main.tsx
  fs.writeFileSync(originalMainPath, originalMainContent);
  
  // Remove temporary files
  try {
    fs.unlinkSync(localStorageServicePath);
    fs.unlinkSync(homeComponentPath);
    fs.unlinkSync(appComponentPath);
    fs.unlinkSync(mainComponentPath);
  } catch (err) {
    console.log('Note: Some temporary files could not be removed.');
  }
}