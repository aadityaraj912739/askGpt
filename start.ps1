# AskGPT Startup Script for PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting AskGPT Chatbot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Checking environment..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
Write-Host "[2/3] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev" -WindowStyle Normal

# Wait for backend to initialize
Write-Host "Waiting for backend port file..." -ForegroundColor Yellow
# Wait up to 15 seconds for server/.port to appear
$portFile = Join-Path $PSScriptRoot 'server\.port'
$timeout = 15
$elapsed = 0
while (-not (Test-Path $portFile) -and $elapsed -lt $timeout) {
	Start-Sleep -Seconds 1
	$elapsed += 1
}

if (Test-Path $portFile) {
	$backendPort = Get-Content $portFile | Out-String | ForEach-Object { $_.Trim() }
	Write-Host "Detected backend port: $backendPort" -ForegroundColor Green
	# Update client/.env VITE_API_URL
	$clientEnv = Join-Path $PSScriptRoot 'client\.env'
	if (Test-Path $clientEnv) {
		$envContent = Get-Content $clientEnv | ForEach-Object { $_ }
		$newLine = "VITE_API_URL=http://localhost:$backendPort/api"
		$found = $false
		$out = @()
		foreach ($line in $envContent) {
			if ($line -match '^VITE_API_URL=') {
				$out += $newLine
				$found = $true
			} else {
				$out += $line
			}
		}
		if (-not $found) { $out += $newLine }
		$out | Set-Content -Path $clientEnv -Encoding UTF8
		Write-Host "Updated client/.env with VITE_API_URL=http://localhost:$backendPort/api" -ForegroundColor Green
	}
} else {
	Write-Host "Timed out waiting for backend port file; proceeding without updating client/.env" -ForegroundColor Yellow
}

# Start Frontend
Write-Host "[3/3] Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: Will run on port 5000 (or next available)" -ForegroundColor White
Write-Host "Frontend: Will run on port 5173 (or next available)" -ForegroundColor White
Write-Host ""
Write-Host "Check the opened PowerShell windows for exact URLs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
