import { useState } from "react";
import NameInput from "@/components/NameInput";
import PairingSection from "@/components/PairingSection";
import { generatePairs } from "@/lib/utils";
import { Person } from "@shared/schema";

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [pairs, setPairs] = useState<Person[][]>([]);
  const [pairsGenerated, setPairsGenerated] = useState(false);

  const addPerson = (person: Person): boolean => {
    // Check if a person with the same name already exists
    if (persons.some(p => p.name === person.name)) {
      return false;
    }
    
    setPersons((prevPersons) => [...prevPersons, person]);
    return true;
  };

  const removePerson = (person: Person) => {
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

    // Filter out duplicates comparing with existing persons list
    const uniquePersons = newPersons.filter(newPerson => 
      !persons.some(existingPerson => existingPerson.name === newPerson.name)
    );
    
    const addedCount = uniquePersons.length;

    if (addedCount > 0) {
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
          <div className="flex justify-center mb-3">
            <img src="/assets/logo-abstract.svg" alt="Name Pairing Tool Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-100 mb-2">Name Pairing Tool</h1>
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
          <p>Name Pairing Tool - A simple utility for randomly pairing people with other people's profile links</p>
        </footer>
      </div>
    </div>
  );
}
