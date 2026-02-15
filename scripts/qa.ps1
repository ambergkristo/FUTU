$ErrorActionPreference = "Stop"

Write-Host "=== Backend: mvn test ==="
mvn -B test

Write-Host "=== Frontend: npm ci + lint + build ==="
Push-Location .\frontend
if (Test-Path .\package-lock.json) { npm ci } else { npm install }
npm run lint
npm run build
Pop-Location

Write-Host "QA PASS"

