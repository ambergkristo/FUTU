Write-Host "=== FUTU Project Check ==="
$ErrorActionPreference = "Stop"

Write-Host "-> Backend: mvn clean test"
mvn clean test

Write-Host "-> Frontend: npm install (ci if lock exists)"
Set-Location frontend

if (Test-Path package-lock.json) {
    npm ci
} else {
    npm install
}

Write-Host "-> Frontend: build"
npm run build

if (npm run | Select-String "lint") {
    Write-Host "-> Frontend: lint"
    npm run lint
}

if (npm run | Select-String "test") {
    Write-Host "-> Frontend: test"
    npm run test
}

Set-Location ..

Write-Host "=== CHECK PASSED ==="

