Write-Host "Updating GitHub repository..." -ForegroundColor Green
Write-Host ""

Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Complete project update - full code replacement"

Write-Host ""
Write-Host "Force pushing to GitHub..." -ForegroundColor Yellow
git push origin main --force

Write-Host ""
Write-Host "Repository update completed!" -ForegroundColor Green
Read-Host "Press Enter to continue"
