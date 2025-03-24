import { useState } from "react";
import NameInput from "@/components/NameInput";
import PairingSection from "@/components/PairingSection";
import InfoSection from "@/components/InfoSection";
import BulkAddModal from "@/components/BulkAddModal";
import { useToast } from "@/hooks/use-toast";
import { generatePairs } from "@/lib/utils";
import { Person } from "@shared/schema";

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [pairs, setPairs] = useState<Person[][]>([]);
  const [pairsGenerated, setPairsGenerated] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const { toast } = useToast();

  const addPerson = (person: Person): boolean => {
    // Check if a person with the same name already exists
    if (persons.some(p => p.name === person.name)) {
      toast({
        title: "Name already exists",
        description: "This name is already in the list",
        variant: "destructive",
      });
      return false;
    }
    
    setPersons((prevPersons) => [...prevPersons, person]);
    toast({
      title: "Person added",
      description: "Person added successfully",
    });
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
    toast({
      title: "All entries cleared",
      description: "Person list has been cleared",
    });
  };

  const handleGeneratePairs = () => {
    if (persons.length === 0) {
      toast({
        title: "No entries",
        description: "Please add at least one person first",
        variant: "destructive",
      });
      return;
    }

    const newPairs = generatePairs(persons);
    setPairs(newPairs);
    setPairsGenerated(true);
    toast({
      title: "Pairs generated",
      description: "Pairs generated successfully",
    });
  };

  const handleBulkAdd = (newPersons: Person[]) => {
    if (newPersons.length === 0) {
      toast({
        title: "No valid entries",
        description: "No valid persons found in the input",
        variant: "destructive",
      });
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
      
      toast({
        title: "Entries added",
        description: `${addedCount} person${addedCount !== 1 ? 's' : ''} added successfully`,
      });
    } else {
      toast({
        title: "No new entries",
        description: "No new entries added - all were duplicates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Name Pairing Tool</h1>
        </header>

        {/* Main Content */}
        <main className="flex flex-col gap-8">
          <NameInput 
            persons={persons}
            onRemovePerson={removePerson} 
            onClearPersons={clearPersons}
            onBulkAdd={() => setIsBulkModalOpen(true)}
          />
          
          <PairingSection 
            persons={persons}
            pairs={pairs}
            pairsGenerated={pairsGenerated}
            onGeneratePairs={handleGeneratePairs}
          />

          <InfoSection />
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm py-4">
          <p>Name Pairing Tool - A simple utility for randomly pairing people with their profile links</p>
        </footer>
      </div>

      {/* Bulk Add Modal */}
      <BulkAddModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)}
        onAddPersons={handleBulkAdd}
      />
    </div>
  );
}
