import { useState } from "react";
import NameInput from "@/components/NameInput";
import PairingSection from "@/components/PairingSection";
import InfoSection from "@/components/InfoSection";
import BulkAddModal from "@/components/BulkAddModal";
import { useToast } from "@/hooks/use-toast";
import { generatePairs } from "@/lib/utils";

export default function Home() {
  const [names, setNames] = useState<string[]>([]);
  const [pairs, setPairs] = useState<string[][]>([]);
  const [pairsGenerated, setPairsGenerated] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const { toast } = useToast();

  const addName = (name: string) => {
    if (names.includes(name)) {
      toast({
        title: "Name already exists",
        description: "This name is already in the list",
        variant: "destructive",
      });
      return false;
    }
    
    setNames((prevNames) => [...prevNames, name]);
    toast({
      title: "Name added",
      description: "Name added successfully",
    });
    return true;
  };

  const removeName = (nameToRemove: string) => {
    setNames((prevNames) => prevNames.filter((name) => name !== nameToRemove));
    
    if (pairsGenerated) {
      // Regenerate pairs if we're removing a name and pairs are already generated
      const newNames = names.filter((name) => name !== nameToRemove);
      if (newNames.length > 0) {
        const newPairs = generatePairs(newNames);
        setPairs(newPairs);
      } else {
        setPairs([]);
        setPairsGenerated(false);
      }
    }
  };

  const clearNames = () => {
    setNames([]);
    setPairs([]);
    setPairsGenerated(false);
    toast({
      title: "All names cleared",
      description: "Name list has been cleared",
    });
  };

  const handleGeneratePairs = () => {
    if (names.length === 0) {
      toast({
        title: "No names",
        description: "Please add at least one name first",
        variant: "destructive",
      });
      return;
    }

    const newPairs = generatePairs(names);
    setPairs(newPairs);
    setPairsGenerated(true);
    toast({
      title: "Pairs generated",
      description: "Pairs generated successfully",
    });
  };

  const handleBulkAdd = (bulkNames: string[]) => {
    if (bulkNames.length === 0) {
      toast({
        title: "No valid names",
        description: "No valid names found in the input",
        variant: "destructive",
      });
      return;
    }

    let addedCount = 0;
    const uniqueNames = bulkNames.filter(name => {
      if (!names.includes(name)) {
        addedCount++;
        return true;
      }
      return false;
    });

    if (addedCount > 0) {
      setNames((prevNames) => [...prevNames, ...uniqueNames]);
      
      if (pairsGenerated) {
        // Regenerate pairs if we're adding names and pairs are already generated
        const newPairs = generatePairs([...names, ...uniqueNames]);
        setPairs(newPairs);
      }
      
      toast({
        title: "Names added",
        description: `${addedCount} name${addedCount !== 1 ? 's' : ''} added successfully`,
      });
    } else {
      toast({
        title: "No new names",
        description: "No new names added - all were duplicates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Name Pairing Tool</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a list of names to generate random pairs. Perfect for team activities, 
            study groups, or any scenario requiring random partner assignments.
          </p>
        </header>

        {/* Main Content */}
        <main className="flex flex-col gap-8">
          <NameInput 
            names={names} 
            onAddName={addName} 
            onRemoveName={removeName} 
            onClearNames={clearNames}
            onBulkAdd={() => setIsBulkModalOpen(true)}
          />
          
          <PairingSection 
            names={names}
            pairs={pairs}
            pairsGenerated={pairsGenerated}
            onGeneratePairs={handleGeneratePairs}
          />

          <InfoSection />
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm py-4">
          <p>Name Pairing Tool - A simple utility for randomly pairing names</p>
        </footer>
      </div>

      {/* Bulk Add Modal */}
      <BulkAddModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)}
        onAddNames={handleBulkAdd}
      />
    </div>
  );
}
