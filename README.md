# Name Pairing Tool

A web application for generating random pairs from a list of names, designed to simplify team matching, group assignments, and random pairing tasks.

## Features

- Generate random pairs from a list of names
- Import names with URLs via CSV file upload
- Drag-and-drop CSV import functionality
- Dark mode support
- Responsive design for all device sizes
- Export pairs as HTML file
- Client-side storage for saving your data

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser at `http://localhost:5000`

## Deploying to GitHub Pages

This project includes a custom build script to create a client-only version suitable for GitHub Pages deployment.

### Manual Deployment

1. Run the GitHub Pages build script:
   ```
   ./build-github-pages.sh
   ```
2. This will create a build in the `dist` directory optimized for GitHub Pages
3. Push the contents of the `dist` directory to the `gh-pages` branch of your repository

### Automated Deployment via GitHub Actions

This repository includes a GitHub Actions workflow for automatic deployment to GitHub Pages:

1. Go to your repository's Settings > Pages
2. Set the source to "GitHub Actions"
3. Push to the main branch to trigger the deployment workflow
4. Your app will be deployed to `https://[your-username].github.io/name-pairing-tool/`

## CSV Import Format

The CSV file should have the following format:

```csv
name,url
John Doe,https://example.com/john
Jane Smith,https://example.com/jane
```

- The `name` field is required
- The `url` field is optional (use an empty cell if no URL is available)
- A sample template is available via the "Download Template" button in the app

## License

© 2025 Tyler Cochran