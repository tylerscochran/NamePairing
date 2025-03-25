import { useState, useEffect } from "react";
import NameInput from "@/components/NameInput";
import PairingSection from "@/components/PairingSection";
import { generatePairs } from "@/lib/utils";
import { Person } from "@/lib/schema";
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

    // Save to localStorage and get count of added persons
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
