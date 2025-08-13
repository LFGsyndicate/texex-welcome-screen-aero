# Удаляем пустые директории
$emptyDirs = @(
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

foreach ($dir in $emptyDirs) {
    if (Test-Path $dir) {
        try {
            Remove-Item $dir -Force
            Write-Host "Удалена директория: $dir" -ForegroundColor Green
        } catch {
            Write-Host "Ошибка удаления: $dir" -ForegroundColor Red
        }
    }
}
