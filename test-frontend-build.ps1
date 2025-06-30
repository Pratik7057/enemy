# Frontend Build Test Script
# This script builds the frontend with production settings and serves it locally for testing

$ErrorActionPreference = "Stop"

Write-Host "Starting Frontend Build Test..." -ForegroundColor Cyan

# Set the working directory to frontend
Set-Location -Path "frontend"

# Install dependencies if needed
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Create .env.production file if it doesn't exist
if (-not (Test-Path ".env.production")) {
    Write-Host "Creating .env.production file..." -ForegroundColor Yellow
    "REACT_APP_API_URL=https://www.radhaapi.me/api" | Out-File -FilePath ".env.production" -Encoding utf8
}

# Build the frontend with production settings
Write-Host "Building frontend with production settings..." -ForegroundColor Yellow
$env:REACT_APP_API_URL = "https://www.radhaapi.me/api"
npm run build

# Check if build was successful
if (-not (Test-Path "build\index.html")) {
    Write-Host "Error: Build failed - index.html not found in build directory" -ForegroundColor Red
    exit 1
}

Write-Host "Frontend built successfully!" -ForegroundColor Green
Write-Host "To test the production build locally, run: npx serve -s build" -ForegroundColor Cyan

# Optionally serve the build locally
$response = Read-Host "Would you like to serve the build locally to test it? (y/n)"
if ($response -eq "y") {
    Write-Host "Serving build on http://localhost:3000..." -ForegroundColor Yellow
    npx serve -s build
}

Write-Host "Build test complete." -ForegroundColor Green
