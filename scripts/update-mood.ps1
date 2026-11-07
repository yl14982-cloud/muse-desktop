param(
    [ValidateSet('Focused','Calm','A bit tired','Low energy','Stressed')]
    [Parameter(Mandatory=$true)] [string]$Mood
)
$tokenFile = Join-Path $env:APPDATA 'muse-desktop\bridge-token.txt'
if (-not (Test-Path $tokenFile)) { Write-Error 'Open Muse Desktop first to generate your local bridge token.'; exit 1 }
$token = (Get-Content $tokenFile -Raw).Trim()
$payload = @{ mood=$Mood; source='local-test' } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://127.0.0.1:43187/v1/state' -Method Post -Headers @{Authorization="Bearer $token"} -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($payload))
