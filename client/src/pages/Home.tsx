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

        {/* Logo Showcase */}
        <section className="mt-12 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 text-center">Logo Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Original Options */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Option 1: Abstract Logo</h3>
              <div className="flex justify-center p-4 bg-gray-800 rounded-lg mb-4">
                <img src="/assets/logo-abstract.svg" alt="Abstract Logo" className="w-32 h-32" />
              </div>
              <p className="text-gray-300 text-sm">
                A minimalist abstract logo representing the concept of pairing with two circles 
                connected by a line with golden connection points.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Option 2: Text Logo (Original)</h3>
              <div className="flex justify-center p-4 bg-gray-800 rounded-lg mb-4">
                <img src="/assets/logo-text.svg" alt="Text Logo" className="w-64" />
              </div>
              <p className="text-gray-300 text-sm">
                A stylized text-based logo with "Name" and "Pairing" prominently displayed and 
                connected by a flowing line that represents the pairing process.
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-100 mt-8 mb-4 text-center">New Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 3: Improved Text Logo with Enhanced Icon */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Option 3: Connected Nodes</h3>
              <div className="flex justify-center p-4 bg-gray-800 rounded-lg mb-4">
                <img src="/assets/logo-text-improved.svg" alt="Improved Text Logo" className="w-64" />
              </div>
              <p className="text-gray-300 text-sm">
                Two connected nodes with curved paths, decorative dots, and pulsing rings to represent pairing.
              </p>
              <div className="mt-2 bg-gray-700 p-2 rounded-lg">
                <div className="flex justify-center p-2 bg-gray-800 rounded-lg">
                  <img src="/favicon.svg" alt="Icon Detail" className="w-12 h-12" />
                </div>
              </div>
            </div>
            
            {/* Option 4: Network Nodes Icon */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Option 4: Network Hub</h3>
              <div className="flex justify-center p-4 bg-gray-800 rounded-lg mb-4">
                <img src="/assets/logo-text-option4.svg" alt="Network Nodes Logo" className="w-64" />
              </div>
              <p className="text-gray-300 text-sm">
                A central hub connected to multiple satellite nodes in different colors, emphasizing the 
                concept of one-to-many connections.
              </p>
              <div className="mt-2 bg-gray-700 p-2 rounded-lg">
                <div className="flex justify-center p-2 bg-gray-800 rounded-lg">
                  <img src="/assets/favicon-option4.svg" alt="Icon Detail" className="w-12 h-12" />
                </div>
              </div>
            </div>
            
            {/* Option 5: Puzzle Pieces Icon */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Option 5: Puzzle Pieces</h3>
              <div className="flex justify-center p-4 bg-gray-800 rounded-lg mb-4">
                <img src="/assets/logo-text-option5.svg" alt="Puzzle Pieces Logo" className="w-64" />
              </div>
              <p className="text-gray-300 text-sm">
                Interlocking puzzle pieces in complementary colors, representing a perfect fit between pairs.
              </p>
              <div className="mt-2 bg-gray-700 p-2 rounded-lg">
                <div className="flex justify-center p-2 bg-gray-800 rounded-lg">
                  <img src="/assets/favicon-option5.svg" alt="Icon Detail" className="w-12 h-12" />
                </div>
              </div>
            </div>
            
            {/* Option 6: DNA Helix Icon */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-3">Option 6: DNA Helix</h3>
              <div className="flex justify-center p-4 bg-gray-800 rounded-lg mb-4">
                <img src="/assets/logo-text-option6.svg" alt="DNA Helix Logo" className="w-64" />
              </div>
              <p className="text-gray-300 text-sm">
                A DNA-inspired double helix design with connecting rungs, symbolizing the fundamental concept of pairing.
              </p>
              <div className="mt-2 bg-gray-700 p-2 rounded-lg">
                <div className="flex justify-center p-2 bg-gray-800 rounded-lg">
                  <img src="/assets/favicon-option6.svg" alt="Icon Detail" className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-400 text-sm py-4" role="contentinfo">
          <p>Name Pairing Tool - A simple utility for randomly pairing people with other people's profile links</p>
        </footer>
      </div>
    </div>
  );
}
