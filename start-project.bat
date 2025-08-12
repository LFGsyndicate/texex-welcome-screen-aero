@echo off
chcp 65001 >nul
echo ========================================
echo    ЗАПУСК ПРОЕКТА TEXEX
echo ========================================
echo.

echo Остановка предыдущих процессов Node.js...
taskkill /f /im node.exe 2>nul

echo.
echo Установка зависимостей...
npm install

echo.
echo Запуск проекта в режиме разработки...
npm run dev

echo.
echo Проект запущен! Откройте http://localhost:5173
pause

