import { Button } from "@/components/ui/button";
import { Person } from "@shared/schema";
import { Download, Shuffle, Users2 } from "lucide-react";

// Helper function to convert pairs to HTML format
const convertToHTML = (pairs: Person[][]): string => {
  // HTML header with basic styling
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Pairs</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      background-color: #1f2937;
      color: #e5e7eb;
    }
    h1 {
      color: #60a5fa;
      margin-bottom: 20px;
    }
    p {
      margin: 12px 0;
    }
    a {
      color: #60a5fa;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Generated Pairs</h1>
`;
  
  // Generate HTML content for each pair - without titles
  pairs.forEach((pair) => {
    if (pair.length >= 2) {
      const person = pair[0];
      const pairedWith = pair[1];
      const url = pairedWith.url || "#"; // Use the paired person's URL
      
      // Create the HTML entry with accessibility attributes
      html += `  <p><a href="${url}" aria-label="${person.name} paired with ${pairedWith.name}">${person.name}</a></p>\n`;
    } else if (pair.length === 1) {
      // For single person (no partner)
      html += `  <p>Solo: ${pair[0].name}</p>\n`;
    }
  });
  
  // Close HTML tags
  html += `</body>\n</html>`;
  
  return html;
};

// Helper function to download HTML
const downloadHTML = (pairs: Person[][]): void => {
  const htmlContent = convertToHTML(pairs);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'person_pairs.html');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface PairingSectionProps {
  persons: Person[];
  pairs: Person[][];
  pairsGenerated: boolean;
  onGeneratePairs: () => void;
}

export default function PairingSection({
  persons,
  pairs,
  pairsGenerated,
  onGeneratePairs,
}: PairingSectionProps) {
  return (
    <section className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-medium text-gray-100">Generated Pairs</h2>
          <p className="text-gray-300 text-sm">Names and URLs will be randomly paired when you generate</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onGeneratePairs}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={persons.length === 0}
            aria-label={pairsGenerated ? "Regenerate random pairs" : "Generate random pairs"}
          >
            <Shuffle className="h-4 w-4 mr-2" aria-hidden="true" />
            {pairsGenerated ? "Regenerate Pairs" : "Generate Pairs"}
          </Button>
          
          {pairsGenerated && (
            <Button
              onClick={() => downloadHTML(pairs)}
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-gray-800"
              aria-label="Export generated pairs as HTML file"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Export HTML
            </Button>
          )}
        </div>
      </div>

      {/* Initial State - No Pairs */}
      {!pairsGenerated && (
        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
          <div className="text-gray-400 mb-2">
            <Users2 className="h-12 w-12 mx-auto text-gray-500" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-1">No pairs generated yet</h3>
          <p className="text-gray-400 text-sm">
            Import data above and click "Generate Pairs" to create random pairs
          </p>
        </div>
      )}

      {/* Pairs Generated Confirmation */}
      {pairsGenerated && (
        <div 
          className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700"
          role="region"
          aria-live="polite"
          aria-label="Pairing results"
        >
          <div className="text-gray-300 mb-2 text-green-400">
            <Users2 className="h-12 w-12 mx-auto text-green-400" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-1">
            Pairs generated successfully!
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {pairs.length} pairs have been created. Click the "Export HTML" button to download.
          </p>
          <Button
            onClick={() => downloadHTML(pairs)}
            variant="default"
            className="bg-green-600 text-white hover:bg-green-700"
            aria-label="Download generated pairs as HTML file"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Download HTML
          </Button>
        </div>
      )}
    </section>
  );
}
