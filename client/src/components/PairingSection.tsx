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
    }
    h1 {
      color: #2563eb;
      margin-bottom: 20px;
    }
    p {
      margin: 12px 0;
    }
    a {
      color: #2563eb;
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
  
  // Generate HTML content for each pair
  pairs.forEach((pair, index) => {
    html += `  <h2>Pair ${index + 1}</h2>\n`;
    
    if (pair.length >= 2) {
      const person1 = pair[0];
      const person2 = pair[1];
      const url1 = person1.url || "#";
      
      // Create the HTML entry in the format: <p><a href="[URL1]" alt="[Name1]">[Name2]</a></p>
      html += `  <p><a href="${url1}" alt="${person1.name}">${person2.name}</a></p>\n`;
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
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-medium text-gray-800">Generated Pairs</h2>
          <p className="text-gray-600 text-sm">Names and URLs will be randomly paired when you generate</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onGeneratePairs}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={persons.length === 0}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            {pairsGenerated ? "Regenerate Pairs" : "Generate Pairs"}
          </Button>
          
          {pairsGenerated && (
            <Button
              onClick={() => downloadHTML(pairs)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
          )}
        </div>
      </div>

      {/* Initial State - No Pairs */}
      {!pairsGenerated && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-gray-400 mb-2">
            <Users2 className="h-12 w-12 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No pairs generated yet</h3>
          <p className="text-gray-500 text-sm">
            Import data above and click "Generate Pairs" to create random pairs
          </p>
        </div>
      )}

      {/* Pairs Generated Confirmation */}
      {pairsGenerated && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-green-50">
          <div className="text-gray-400 mb-2 text-green-500">
            <Users2 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Pairs generated successfully!
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {pairs.length} pairs have been created. Click the "Export HTML" button to download.
          </p>
          <Button
            onClick={() => downloadHTML(pairs)}
            variant="default"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>
        </div>
      )}
    </section>
  );
}
