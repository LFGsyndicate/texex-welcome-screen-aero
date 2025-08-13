# Скрипт очистки ненужных компонентов
Write-Host "Начинаю очистку компонентов..." -ForegroundColor Green

# Удаляем ненужные компоненты Tinkoff
$componentsToRemove = @(
    "src\components\TinkoffPaymentOfficial",
    "src\components\TinkoffPaymentIframeCorrect", 
    "src\components\TinkoffPaymentDirect",
    "src\components\TinkoffPaymentSimple",
    "src\components\TinkoffPaymentIframe",
    "src\components\TinkoffPaymentScript",
    "src\components\TinkoffPaymentButton",
    "src\components\PaymentButtonSimple",
    "src\components\TinkoffIframe",
    "src\components\TinkoffPayment",
    "src\components\SimplePaymentButton",
    "src\components\PaymentNotification",
    "src\components\PaymentModal"
)

foreach ($component in $componentsToRemove) {
    if (Test-Path $component) {
        Write-Host "Удаляю: $component" -ForegroundColor Yellow
        Remove-Item $component -Recurse -Force
    } else {
        Write-Host "Не найден: $component" -ForegroundColor Gray
    }
}

Write-Host "Очистка завершена!" -ForegroundColor Green
