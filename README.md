# Name Pairing Tool

A web application for generating random pairs from a list of names, designed to simplify team matching, group assignments, and random pairing tasks.

## Features

- Import names via CSV file with drag-and-drop support
- Generate random pairings using a derangement algorithm (no one is paired with themselves)
- Export pairings as an HTML file
- Fully client-side with localStorage data persistence
- Dark mode support
- Responsive design
- Accessibility optimized

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### GitHub Pages Deployment

This project can be deployed to GitHub Pages using one of two methods:

#### Automated Deployment (Recommended)

1. Push your code to a GitHub repository
2. Enable GitHub Pages in your repository settings (Settings > Pages)
3. Select "GitHub Actions" as the source
4. The workflow will automatically build and deploy the app when you push to the main branch

#### Manual Deployment

1. Build the client-side application:
   ```bash
   ./build-github-pages.sh
   ```
2. The built files will be in the `dist` directory
3. Test the build locally:
   ```bash
   npx serve dist
   ```
4. Upload the contents of the `dist` directory to your hosting provider

## CSV Import Format

The application accepts CSV files with the following format:

```csv
Name,URL
John Smith,https://example.com/john
Jane Doe,https://linkedin.com/in/jane
Michael Johnson,
Sarah Williams,https://github.com/sarah
```

- The first column should contain the person's name (required)
- The second column should contain the associated URL (optional)
- A header row is optional but recommended
- The URL can be left blank if not available
- If URLs are not provided, the HTML export will use "#" as the href value

## How It Works

1. **Import Names**: Upload a CSV file with names and optional URLs
2. **Generate Pairs**: The application uses a derangement algorithm to ensure no person is paired with themselves
3. **Export Results**: Download the pairings as an HTML file for distribution

## Using the HTML Export

The generated HTML file includes:
- Responsive design with dark/light mode support
- Accessible markup with appropriate ARIA attributes
- Skip-to-content link for keyboard users
- Clean, minimal design that works well on all devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.