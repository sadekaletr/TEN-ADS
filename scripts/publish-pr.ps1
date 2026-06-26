# Publish Benchmark UI Sprint branch and open PR (requires: gh auth login)
$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) { $gh = "gh" }

& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: gh auth login"
  exit 1
}

$remote = $null
try { $remote = git remote get-url origin 2>$null } catch { $remote = $null }
if (-not $remote) {
  git remote add origin https://github.com/sadekaletr/TEN-ADS.git
  $remote = "https://github.com/sadekaletr/TEN-ADS.git"
} elseif ($remote -notmatch "TEN-ADS") {
  git remote set-url origin https://github.com/sadekaletr/TEN-ADS.git
  $remote = "https://github.com/sadekaletr/TEN-ADS.git"
}

git branch main 6e82b36 2>$null
git push -u origin feat/benchmark-ui-sprint

& $gh pr create `
  --base main `
  --head feat/benchmark-ui-sprint `
  --title "feat(ui): Benchmark UI Sprint - cards, ATF, ROI, analytics funnel" `
  --body-file "docs/launch-evidence/BENCHMARK-PR-BODY.md"

Write-Host "PR created."
