@echo off
chcp 65001 >nul
echo ========================================
echo    ОБНОВЛЕНИЕ GITHUB РЕПОЗИТОРИЯ
echo ========================================
echo.

echo Текущая директория:
cd
echo.

echo Добавление всех файлов в git...
git add .

echo.
echo Создание коммита...
git commit -m "Complete project update - full code replacement"

echo.
echo Отправка изменений в GitHub...
git push origin main --force

echo.
echo ========================================
echo    ОБНОВЛЕНИЕ ЗАВЕРШЕНО!
echo ========================================
echo.
echo Нажмите любую клавишу для выхода...
pause >nul
