#!/bin/bash

# Manual deployment script for GitHub Pages
# Use this if GitHub Actions is not available

echo "🚀 Starting manual deployment to GitHub Pages..."

# Step 1: Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 2: Navigate to dist folder
echo "📁 Preparing deployment files..."
cd dist

# Step 3: Initialize git in dist folder
git init
git add .
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# Step 4: Push to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
git remote add origin https://github.com/LFGsyndicate/texex-welcome-screen-aero.git 2>/dev/null || true
git push -f origin main:gh-pages

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    cd ..
    exit 1
fi

# Step 5: Return to project root
cd ..

echo "🎉 Deployment completed successfully!"
echo "🔗 Your site will be available at: https://lfgsyndicate.github.io/texex-welcome-screen-aero/"
echo "⏱️  It may take a few minutes for changes to appear."

# Clean up dist folder git
rm -rf dist/.git 2>/dev/null || true

echo "✨ Done!"