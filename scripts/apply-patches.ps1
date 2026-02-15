<#
.SYNOPSIS
  Apply .patch files from a directory to the current repo, with safety checks.

.DESCRIPTION
  Looks for patch files ("*.patch" or "*.diff") in a directory (default: ./patches),
  runs `git apply --check` to validate them, applies them to the working tree,
  optionally creates commits per-patch, and can push the branch.

  This script prefers simple unified diff patches that `git apply` understands. If
  you need to import email-style patches, use `git am` separately.

.PARAMETER PatchesDir
  Directory containing patch files (default: ./patches)

.PARAMETER Message
  Commit message prefix used when creating commits for applied patches.

.PARAMETER Commit
  If set, create a commit for each applied patch.

.PARAMETER Push
  If set, push the current branch after applying (and committing) patches.

.PARAMETER SetUpstream
  If set alongside -Push, push with -u origin <branch>.

.PARAMETER DryRun
  Print the commands that would run, but don't execute them.

.PARAMETER ContinueOnError
  If set, continue applying remaining patches even if one fails the check.

.EXAMPLE
  .\apply-patches.ps1 -PatchesDir .\patches -Message "Apply fixes" -Commit -Push -SetUpstream
#>

param(
  [string]$PatchesDir = '.\patches',
  [string]$Message = 'Apply patch',
  [switch]$Commit,
  [switch]$Push,
  [switch]$SetUpstream,
  [switch]$DryRun,
  [switch]$ContinueOnError
)

$ErrorActionPreference = 'Stop'

function Write-Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Warn($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Write-Err($m)  { Write-Host "[ERROR] $m" -ForegroundColor Red }

# Basic env checks
try { git --version > $null 2>&1 } catch { Write-Err "git not found on PATH"; exit 2 }
if (-not (git rev-parse --is-inside-work-tree 2>$null)) { Write-Err "Not inside a git repository"; exit 2 }

if (-not (Test-Path $PatchesDir)) { Write-Warn "Patches directory '$PatchesDir' not found. Exiting."; exit 0 }

$patchFiles = Get-ChildItem -Path $PatchesDir -Filter *.patch -File -ErrorAction SilentlyContinue | Sort-Object Name
if (-not $patchFiles) { $patchFiles = Get-ChildItem -Path $PatchesDir -Filter *.diff -File -ErrorAction SilentlyContinue | Sort-Object Name }
if (-not $patchFiles) { Write-Warn "No .patch or .diff files found in $PatchesDir. Exiting."; exit 0 }

# Determine current branch
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
if (-not $branch) { Write-Err "Unable to determine current branch"; exit 2 }
Write-Info "Current branch: $branch"

foreach ($f in $patchFiles) {
    $patchPath = $f.FullName
    Write-Info "Processing patch: $($f.Name)"

    # 1) Check
    $checkCmd = "git apply --check --verbose -- ""$patchPath"""
    if ($DryRun) {
        Write-Host "DRYRUN: $checkCmd"
    } else {
        Write-Info "Checking patch applies cleanly..."
        $checkOutput = & git apply --check --verbose -- $patchPath 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Err "Patch check failed for $($f.Name):`n$checkOutput"
            if ($ContinueOnError) { Write-Warn "Continuing because -ContinueOnError is set"; continue } else { exit 1 }
        }
    }

    # 2) Apply
    $applyCmd = "git apply -- ""$patchPath"""
    if ($DryRun) {
        Write-Host "DRYRUN: $applyCmd"
        continue
    }

    Write-Info "Applying patch..."
    $applyOutput = & git apply -- $patchPath 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Err "git apply failed for $($f.Name):`n$applyOutput"; if ($ContinueOnError) { continue } else { exit 1 } }

    if ($Commit) {
        $commitMsg = "$Message: $($f.Name)"
        Write-Info "Staging changes and committing: $commitMsg"
        git add -A
        if ($LASTEXITCODE -ne 0) { Write-Err "git add failed"; exit $LASTEXITCODE }

        $commitOutput = & git commit -m $commitMsg 2>&1
        if ($LASTEXITCODE -ne 0) {
            # If nothing to commit, warn and continue
            if ($commitOutput -match 'nothing to commit' -or $commitOutput -match 'no changes added to commit') {
                Write-Warn "No changes to commit after applying $($f.Name)"
            } else {
                Write-Err "git commit failed: `n$commitOutput"; if ($ContinueOnError) { continue } else { exit 1 }
            }
        } else { Write-Info "Committed $($f.Name)" }
    } else {
        Write-Info "Patch applied to working tree (not committed)."
    }
}

if ($Push -and $Commit) {
    $pushArgs = @()
    if ($SetUpstream) { $pushArgs += '-u' }
    $pushArgs += 'origin'
    $pushArgs += $branch
    $pushCmd = "git push $($pushArgs -join ' ')"
    if ($DryRun) { Write-Host "DRYRUN: $pushCmd" } else {
        Write-Info "Pushing: $pushCmd"
        $pushOutput = & git @pushArgs 2>&1
        if ($LASTEXITCODE -ne 0) { Write-Err "git push failed:`n$pushOutput"; exit $LASTEXITCODE }
    }
}

Write-Info "All done."
exit 0

