import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Person } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isDragging, setIsDragging] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset state when the modal opens/closes
  const resetState = () => {
    setCsvFile(null);
    setParsedData([]);
    setError(null);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleFileSelect = (file: File) => {
    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setError("Please upload a CSV file.");
      setCsvFile(null);
      return;
    }
    
    setCsvFile(file);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const persons = parseCSV(csv);
        
        if (persons.length === 0) {
          setError("No valid entries found in the CSV file.");
        } else {
          setParsedData(persons);
        }
      } catch (err) {
        setError("Failed to parse CSV file. Please check the format.");
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    
    reader.readAsText(file);
  };
  
  const parseCSV = (csv: string): Person[] => {
    const lines = csv.split(/\r?\n/).filter(line => line.trim());
    const persons: Person[] = [];
    
    // Check if the first line is a header
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('name') && firstLine.includes('url');
    
    // Start from index 1 if it has a header, otherwise from 0
    const startIdx = hasHeader ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Split by comma but handle quoted values
      const values = line.match(/(?:^|,)("(?:[^"]*(?:""[^"]*)*)"|[^,]*)/g);
      
      if (values && values.length >= 1) {
        // Clean up the values
        const cleanValues = values.map(v => {
          // Remove leading comma if exists
          let value = v.startsWith(',') ? v.slice(1) : v;
          // Remove surrounding quotes and replace double quotes with single
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
          }
          return value.trim();
        });
        
        const name = cleanValues[0];
        const url = cleanValues.length > 1 ? cleanValues[1] : '';
        
        if (name) {
          persons.push({ name, url });
        }
      }
    }
    
    return persons;
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleSubmit = () => {
    if (parsedData.length > 0) {
      onAddPersons(parsedData);
      resetState();
      onClose();
    } else if (!error && csvFile) {
      setError("No valid entries found in the CSV file.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Names & URLs</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing names and URLs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } transition-colors duration-200 cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".csv"
              className="hidden"
            />
            
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {csvFile ? csvFile.name : "Drag and drop your CSV file here"}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {csvFile 
                ? `${parsedData.length} entries found` 
                : "Or click to browse (CSV format only)"}
            </p>
          </div>
          
          <div className="text-sm">
            <h4 className="font-medium mb-1">CSV Format</h4>
            <p className="text-gray-600 mb-2">Your CSV file should have the following format:</p>
            <div className="bg-gray-100 p-2 rounded text-xs font-mono">
              Name,URL<br />
              John Smith,https://example.com/john<br />
              Jane Doe,https://linkedin.com/in/jane
            </div>
            <p className="mt-2 text-gray-600 text-xs">
              The URL column is optional. If your CSV doesn't have a header row, 
              the first column will be treated as names and the second as URLs.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!csvFile || parsedData.length === 0}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {parsedData.length > 0 
              ? `Import ${parsedData.length} Entries` 
              : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
