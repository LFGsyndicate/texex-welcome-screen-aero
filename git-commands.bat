@echo off
echo Checking git status...
git status

echo.
echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "Обновлены ссылки: Telegram @ruhunt, WhatsApp @79097878786, кнопки оплаты"

echo.
echo Pushing to repository...
git push origin main

echo.
echo Done!
pause
