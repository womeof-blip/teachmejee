# One-click deploy — run after any edit in C:\TeachMeJEE
# Usage: right-click → Run with PowerShell, or:  .\deploy.ps1 "your message"
param([string]$m="")
if (!$m) { $m = "update $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
git add .
git commit -m $m
git push
Write-Host "Pushed to https://github.com/soosdeuce/teachmejee → Pages will update in ~40s" -ForegroundColor Green
