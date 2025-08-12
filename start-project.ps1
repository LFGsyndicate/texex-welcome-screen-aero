Write-Host "========================================" -ForegroundColor Green
Write-Host "    ЗАПУСК ПРОЕКТА TEXEX" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Остановка предыдущих процессов Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "Установка зависимостей..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Запуск проекта в режиме разработки..." -ForegroundColor Yellow
npm run dev

Write-Host ""
Write-Host "Проект запущен! Откройте http://localhost:5173" -ForegroundColor Green
Read-Host "Нажмите Enter для выхода"

