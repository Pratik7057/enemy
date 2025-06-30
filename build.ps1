# Script to build and prepare the app for deployment
$ErrorActionPreference = 'Stop'

Write-Host "========== Starting build process ==========" -ForegroundColor Green

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Root npm install failed" -ForegroundColor Red
    exit 1
}

# Create necessary directories
Write-Host "Creating necessary directories..." -ForegroundColor Cyan
if (-not (Test-Path -Path ".\backend\public")) {
    New-Item -Path ".\backend\public" -ItemType Directory -Force | Out-Null
    Write-Host "Created backend/public directory" -ForegroundColor Green
}

# Build backend
Write-Host "Installing and building backend..." -ForegroundColor Cyan
Set-Location -Path ".\backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend npm install failed" -ForegroundColor Red
    exit 1
}

# Create a basic favicon if it doesn't exist
if (-not (Test-Path -Path ".\public\favicon.ico")) {
    Write-Host "Creating placeholder favicon..." -ForegroundColor Yellow
    $faviconContent = @"
<!--
This is a placeholder favicon.ico file.
Replace with a real favicon for production use.
-->
"@
    Set-Content -Path ".\public\favicon.ico" -Value $faviconContent
    Write-Host "Placeholder favicon created" -ForegroundColor Green
}

Set-Location -Path ".."

# Build frontend
Write-Host "Installing and building frontend..." -ForegroundColor Cyan
Set-Location -Path ".\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend npm install failed" -ForegroundColor Red
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed" -ForegroundColor Red
    exit 1
}

# Create a basic favicon for frontend if it doesn't exist
if (-not (Test-Path -Path ".\public\favicon.ico")) {
    Write-Host "Creating placeholder frontend favicon..." -ForegroundColor Yellow
    $faviconContent = @"
<!--
This is a placeholder favicon.ico file.
Replace with a real favicon for production use.
-->
"@
    if (-not (Test-Path -Path ".\public")) {
        New-Item -Path ".\public" -ItemType Directory -Force | Out-Null
    }
    Set-Content -Path ".\public\favicon.ico" -Value $faviconContent
    Write-Host "Placeholder frontend favicon created" -ForegroundColor Green
}

Set-Location -Path ".."
Write-Host "========== Build process completed ==========" -ForegroundColor Green
Write-Host "Frontend build folder is available at ./frontend/build" -ForegroundColor Green
Write-Host "You can now deploy the application or run it locally" -ForegroundColor Cyan
Write-Host "To run locally:" -ForegroundColor Cyan
Write-Host "  1. Start backend: cd backend && npm start" -ForegroundColor White
Write-Host "  2. Start frontend: cd frontend && npm start" -ForegroundColor White
