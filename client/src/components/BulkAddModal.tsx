import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Person } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPersons: (persons: Person[]) => void;
}

export default function BulkAddModal({
  isOpen,
  onClose,
  onAddPersons,
}: BulkAddModalProps) {
  const [activeTab, setActiveTab] = useState("manual");
  const [personEntries, setPersonEntries] = useState<Person[]>([{ name: "", url: "" }]);
  const [bulkText, setBulkText] = useState("");
  
  // Reset state when the modal opens/closes
  const resetState = () => {
    setPersonEntries([{ name: "", url: "" }]);
    setBulkText("");
    setActiveTab("manual");
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  // Handle adding a new empty entry
  const addEntry = () => {
    setPersonEntries([...personEntries, { name: "", url: "" }]);
  };
  
  // Handle removing an entry
  const removeEntry = (index: number) => {
    const newEntries = [...personEntries];
    newEntries.splice(index, 1);
    if (newEntries.length === 0) {
      newEntries.push({ name: "", url: "" });
    }
    setPersonEntries(newEntries);
  };
  
  // Handle updating an entry
  const updateEntry = (index: number, field: keyof Person, value: string) => {
    const newEntries = [...personEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setPersonEntries(newEntries);
  };
  
  // Handle parsing bulk text
  const parseBulkText = () => {
    // Split by lines
    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    
    const entries: Person[] = [];
    
    for (const line of lines) {
      // Check if the line has a URL using a simple pattern
      const urlPattern = /\[(https?:\/\/[^\s\]]+)\]/;
      const match = line.match(urlPattern);
      
      if (match) {
        // Extract the name (everything before the URL part)
        const url = match[1];
        const name = line.replace(urlPattern, '').trim();
        if (name) {
          entries.push({ name, url });
        }
      } else {
        // If no URL, just add the name
        const name = line.trim();
        if (name) {
          entries.push({ name, url: "" });
        }
      }
    }
    
    return entries;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    let persons: Person[] = [];
    
    if (activeTab === "manual") {
      // Filter out empty entries
      persons = personEntries.filter(person => person.name.trim() !== "");
    } else {
      persons = parseBulkText();
    }
    
    if (persons.length > 0) {
      onAddPersons(persons);
      resetState();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Names & URLs</DialogTitle>
          <DialogDescription>
            Add names and optional URLs for each person.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="bulk">Text Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="py-4">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {personEntries.map((person, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={person.name}
                        onChange={(e) => updateEntry(index, "name", e.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`url-${index}`}>URL (optional)</Label>
                      <Input
                        id={`url-${index}`}
                        value={person.url || ""}
                        onChange={(e) => updateEntry(index, "url", e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEntry(index)}
                    className="self-center mt-5"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={addEntry}
              className="mt-4 w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Another Person
            </Button>
          </TabsContent>
          
          <TabsContent value="bulk" className="py-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-text">Enter names and URLs in format: "Name [URL]"</Label>
              <Textarea
                id="bulk-text"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="John Smith [https://example.com/john]&#10;Jane Doe&#10;Mike Johnson [https://linkedin.com/in/mike]"
                className="min-h-60"
              />
              <p className="text-xs text-gray-500">One entry per line. URLs are optional and should be in square brackets.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Names
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
