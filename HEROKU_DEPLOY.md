# Heroku Deployment Guide

This guide will help you deploy the Name Pairing Tool application to Heroku.

## Prerequisites

- A Heroku account
- Heroku CLI installed locally
- Git installed locally

## Deployment Steps

### 1. Prepare your application

Make sure you've committed all your changes to Git:

```bash
git add .
git commit -m "Prepare for Heroku deployment"
```

### 2. Create a Heroku app (if you haven't already)

```bash
heroku create your-app-name
```

### 3. Set up Node.js version

Create a `package.json` engines field to specify Node.js version. Heroku will use this to set up the environment.

```bash
heroku config:set NODE_ENV=production
```

### 4. Run the enhanced build script before deployment

Before pushing to Heroku, run the enhanced build script locally:

```bash
node build.js
```

This script properly bundles all necessary files for production.

### 5. Deploy to Heroku

```bash
git push heroku main
```

### 6. Troubleshooting

If you encounter module not found errors:

1. Check Heroku logs:
   ```bash
   heroku logs --tail
   ```

2. Make sure all dependencies are in `dependencies` (not `devDependencies`) in package.json
   
3. Try adding the following buildpacks:
   ```bash
   heroku buildpacks:clear
   heroku buildpacks:add heroku/nodejs
   ```

4. Check if your application needs specific environment variables:
   ```bash
   heroku config:set KEY=value
   ```

### 7. Testing the build locally

You can test your production build locally before deploying:

```bash
npm run build
NODE_ENV=production node dist/index.js
```

## Additional Resources

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku Troubleshooting](https://devcenter.heroku.com/categories/troubleshooting)