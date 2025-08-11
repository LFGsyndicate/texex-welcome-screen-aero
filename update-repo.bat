@echo off
echo Updating GitHub repository...
echo.

echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Complete project update - full code replacement"

echo.
echo Force pushing to GitHub...
git push origin main --force

echo.
echo Repository update completed!
pause
