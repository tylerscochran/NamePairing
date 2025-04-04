import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Person } from "@/lib/schema";
import { Upload, Trash2, DownloadCloud, AlertCircle, Shuffle } from "lucide-react";

interface NameInputProps {
  persons: Person[];
  onRemovePerson: (person: Person) => void;
  onClearPersons: () => void;
  onAddPersons: (persons: Person[]) => void;
  onGeneratePairs: () => void;
}

export default function NameInput({
  persons,
  onRemovePerson,
  onClearPersons,
  onAddPersons,
  onGeneratePairs,
}: NameInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setError(null);
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

  const handleFileSelect = (file: File) => {
    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setError("Please upload a CSV file.");
      return;
    }
    
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const persons = parseCSV(csv);
        
        if (persons.length === 0) {
          setError("No valid entries found in the CSV file.");
        } else {
          onAddPersons(persons);
          resetState();
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
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const downloadSampleCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    const csvContent = "Name,URL\nJohn Smith,https://example.com/john\nJane Doe,https://linkedin.com/in/jane\nMichael Johnson,\nSarah Williams,https://github.com/sarah\nRobert Brown,https://twitter.com/robert";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'name-pairs-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-100 mb-1">Names List</h2>
          <p className="text-gray-300 text-sm">Import names and URLs from a CSV file</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty state with drag and drop */}
      {persons.length === 0 && (
        <div 
          className={`text-center py-12 border-2 border-dashed rounded-lg mb-4 cursor-pointer ${
            isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600'
          } transition-colors duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            // Trigger click when Enter or Space is pressed
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Import CSV file"
          aria-describedby="csv-import-description"
          data-state={isDragging ? 'dragging' : 'idle'}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".csv"
            className="hidden"
            aria-hidden="true"
            id="csv-file-input"
          />
          <div className="text-gray-400 mb-2">
            <Upload className="h-12 w-12 mx-auto text-gray-500" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-1" id="csv-import-heading">No data imported yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-3" id="csv-import-description">
            Drag and drop a CSV file here, or click to browse
          </p>
          <div className="flex justify-center">
            <button 
              onClick={downloadSampleCSV}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 underline"
              aria-label="Download sample CSV template"
              type="button"
            >
              <DownloadCloud className="h-3 w-3" aria-hidden="true" /> 
              Download sample CSV template
            </button>
          </div>
        </div>
      )}

      {/* Summary Display */}
      {persons.length > 0 && (
        <div 
          className="py-8 px-6 rounded-lg bg-gray-700 border border-gray-600 text-center mb-4"
          role="region"
          aria-labelledby="import-summary-heading"
          aria-live="polite"
        >
          <div className="text-4xl font-bold text-blue-400 mb-2" aria-live="polite">
            {persons.length}
          </div>
          <div className="text-lg text-blue-300" id="import-summary-heading">
            {persons.length === 1 ? 'Name' : 'Names'} Imported
          </div>
          <div className="text-sm text-blue-400 mt-1">
            Ready for pairing
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600 flex flex-wrap gap-3 justify-center">
            <Button
              onClick={onGeneratePairs}
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={persons.length === 0}
              aria-label="Generate random pairs"
              type="button"
            >
              <Shuffle className="h-4 w-4 mr-2" aria-hidden="true" />
              Generate Pairs
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500"
              aria-label="Import more names from a CSV file"
              type="button"
            >
              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
              Import More Names
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-gray-200 bg-gray-700 hover:bg-gray-600 border-gray-600"
                  disabled={persons.length === 0}
                  aria-label="Clear all names"
                  type="button"
                >
                  <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent 
                className="bg-gray-800 border-gray-700 text-gray-100"
                role="alertdialog"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle id="alert-dialog-title" className="text-gray-100">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription id="alert-dialog-description" className="text-gray-300">
                    This will clear all entries from your list. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onClearPersons} 
                    className="bg-red-600 text-white hover:bg-red-700"
                    aria-label="Confirm clearing all names from the list"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".csv"
              className="hidden"
              aria-hidden="true"
              id="csv-file-input-more"
            />
          </div>
        </div>
      )}

      {/* Helper text */}
      {persons.length > 0 && (
        <div className="text-gray-300 text-center mt-4">
          Click "Generate Pairs" to create random pairs from your imported names.
        </div>
      )}
    </section>
  );
}
