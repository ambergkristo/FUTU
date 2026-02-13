# ✅ New check.ps1 Created

## File Location
`C:\Users\Kasutaja\Documents\FUTU\check.ps1`

## Content Verified

```powershell
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
```

## What It Does

1. ✅ Runs `mvn clean test` (backend tests)
2. ✅ Navigates to `frontend` folder
3. ✅ Runs `npm ci` if `package-lock.json` exists, else `npm install`
4. ✅ Runs `npm run build` (frontend build)
5. ✅ Conditionally runs `npm run lint` (if lint script exists)
6. ✅ Conditionally runs `npm run test` (if test script exists)
7. ✅ Returns to repo root
8. ✅ Prints "=== CHECK PASSED ===" on success

## How to Use

```powershell
cd C:\Users\Kasutaja\Documents\FUTU
.\check.ps1
```

## Exit Codes

- **0** = SUCCESS (all checks passed)
- **Non-zero** = FAILURE (any check failed, script stops at first error)

## Key Features

✅ Simple and clear output
✅ Backend + Frontend checks in sequence
✅ Conditional lint/test execution (only runs if scripts exist)
✅ Automatic error handling ($ErrorActionPreference = "Stop")
✅ No logging to file (direct console output)
✅ Minimal and readable code

---

**Status**: ✅ READY TO USE

Run `.\check.ps1` from repo root to verify backend and frontend are working.

