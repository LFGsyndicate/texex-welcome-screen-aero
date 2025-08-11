# Manual deployment script for GitHub Pages
# Use this if GitHub Actions is not available

Write-Host "🚀 Starting manual deployment to GitHub Pages..." -ForegroundColor Green

# Step 1: Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Step 2: Navigate to dist folder
Write-Host "📁 Preparing deployment files..." -ForegroundColor Yellow
Set-Location dist

# Step 3: Initialize git in dist folder
git init
git add .
git commit -m "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Step 4: Push to gh-pages branch
Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
git remote add origin https://github.com/LFGsyndicate/texex-welcome-screen-aero.git 2>$null
git push -f origin main:gh-pages

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Step 5: Return to project root
Set-Location ..

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🔗 Your site will be available at: https://lfgsyndicate.github.io/texex-welcome-screen-aero/" -ForegroundColor Cyan
Write-Host "⏱️  It may take a few minutes for changes to appear." -ForegroundColor Yellow

# Clean up dist folder git
Remove-Item -Recurse -Force dist\.git -ErrorAction SilentlyContinue

Write-Host "✨ Done!" -ForegroundColor Green