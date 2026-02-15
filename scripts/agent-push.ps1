<#
.SYNOPSIS
  Safe helper to add, commit and push changes to the current git branch.

.DESCRIPTION
  Stages all changes, creates a commit with the provided message (or prompts for one),
  and pushes to the remote. Supports safe force push, setting upstream, and dry-run.

.PARAMETER Message
  Commit message. If not provided, the script will prompt the user.

.PARAMETER Force
  If provided, push will include --force-with-lease.

.PARAMETER Branch
  Target branch to push. Defaults to the current branch.

.PARAMETER SetUpstream
  If provided, pushes with -u origin <branch> to set upstream.

.PARAMETER DryRun
  If provided, show the commands that would be run without executing them.

.EXAMPLE
  .\agent-push.ps1 -Message "Fix typo" -SetUpstream

.NOTES
  - Requires `git` on PATH.
  - Exits with non-zero code on failures.
#>

param(
  [Parameter(Mandatory=$true)][string]$Message,
  [switch]$Frontend,
  [switch]$Backend,

  [switch]$Force,

  [string]$Branch = $(git rev-parse --abbrev-ref HEAD 2>$null),

  [switch]$SetUpstream,

  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Preliminary checks
try {
    git --version >$null 2>&1
} catch {
    Write-Err "git not found in PATH. Install git or add it to PATH."; exit 2
}

if (-not (git rev-parse --is-inside-work-tree 2>$null)) {
    Write-Err "This directory is not inside a git repository."; exit 2
}

if (-not $Branch) {
    $Branch = (git rev-parse --abbrev-ref HEAD 2>$null)
}

if (-not $Branch) {
    Write-Err "Unable to determine current branch. Provide -Branch explicitly."; exit 2
}

# Functions to run frontend build and backend tests
function Run-Frontend {
  if (Test-Path ".\frontend\package.json") {
    Push-Location .\frontend
    if (Test-Path ".\package-lock.json") { npm ci } else { npm install }
    npm run build
    Pop-Location
  } else {
    Write-Host "No frontend/package.json found, skipping frontend build."
  }
}

function Run-Backend {
  if (Test-Path ".\pom.xml") {
    mvn test
  } else {
    Write-Host "No pom.xml found, skipping backend tests."
  }
}

# 1) Validate
if ($Frontend) { Run-Frontend }
if ($Backend) { Run-Backend }

# 2) Commit+push if changes exist
$changes = git status --porcelain
if (-not $changes) {
  Write-Host "No changes to commit. Exiting."
  exit 0
}

# Stage changes
Write-Info "Staging all changes..."
if ($DryRun) {
    Write-Host "git add -A"
} else {
    git add -A
    if ($LASTEXITCODE -ne 0) { Write-Err "git add failed."; exit $LASTEXITCODE }
}

# Commit
Write-Info "Committing: $Message"
if ($DryRun) {
    Write-Host "git commit -m ""$Message"""
} else {
    $commitOutput = git commit -m "$Message" 2>&1
    if ($LASTEXITCODE -ne 0) {
        # If there was nothing to commit, inform and exit cleanly
        if ($commitOutput -match 'nothing to commit' -or $commitOutput -match 'no changes added to commit') {
            Write-Warn "Nothing to commit. Exiting without pushing."; exit 0
        } else {
            Write-Err "git commit failed:`n$commitOutput"; exit $LASTEXITCODE
        }
    }
}

# Prepare push arguments
$pushArgs = @()
if ($SetUpstream) { $pushArgs += '-u' }
$pushArgs += 'origin'
$pushArgs += $Branch
if ($Force) { $pushArgs += '--force-with-lease' }

$pushCmd = "git push $($pushArgs -join ' ')"
Write-Info "Pushing to remote: $pushCmd"
if ($DryRun) {
    Write-Host $pushCmd
    exit 0
}

$pushOutput = & git @pushArgs 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "git push failed:`n$pushOutput"; exit $LASTEXITCODE
}

Write-Info "Push succeeded."
exit 0

