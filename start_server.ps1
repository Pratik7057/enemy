# RadhaAPI FastAPI Server Startup Script
# Run this script to start the YouTube audio streaming API server

Write-Host "🎵 RadhaAPI YouTube Audio Streaming Server" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if we're in the correct directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath
Write-Host "📁 Working directory: $scriptPath" -ForegroundColor Green

# Check if requirements are installed
Write-Host "🔍 Checking requirements..." -ForegroundColor Yellow

if (Test-Path "requirements.txt") {
    Write-Host "✅ Found requirements.txt" -ForegroundColor Green
    
    # Check if virtual environment exists
    if (Test-Path "venv" -PathType Container) {
        Write-Host "✅ Found virtual environment" -ForegroundColor Green
        Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
        & "venv\Scripts\Activate.ps1"
    } else {
        Write-Host "⚠️  No virtual environment found. Consider creating one:" -ForegroundColor Yellow
        Write-Host "   python -m venv venv" -ForegroundColor White
        Write-Host "   venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host "   pip install -r requirements.txt" -ForegroundColor White
    }
} else {
    Write-Host "❌ requirements.txt not found!" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ Found .env configuration file" -ForegroundColor Green
} else {
    Write-Host "⚠️  No .env file found. Create one for configuration:" -ForegroundColor Yellow
    Write-Host "   MONGODB_URI=mongodb://localhost:27017/radhaapi" -ForegroundColor White
    Write-Host "   PORT=8000" -ForegroundColor White
    Write-Host "   ENVIRONMENT=development" -ForegroundColor White
}

# Server configuration
$port = if ($env:PORT) { $env:PORT } else { "8000" }
$host = "0.0.0.0"

Write-Host "`n🚀 Starting FastAPI server..." -ForegroundColor Cyan
Write-Host "🌐 Host: $host" -ForegroundColor White
Write-Host "🔌 Port: $port" -ForegroundColor White
Write-Host "`n📖 API Documentation: http://localhost:$port/docs" -ForegroundColor Green
Write-Host "🏥 Health Check: http://localhost:$port/health" -ForegroundColor Green
Write-Host "🎵 Get Audio: http://localhost:$port/get-audio?query=YOUR_QUERY" -ForegroundColor Green
Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    # Start the server
    python -m uvicorn main:app --host $host --port $port --reload --log-level info
} catch {
    Write-Host "`n❌ Error starting server: $_" -ForegroundColor Red
    Write-Host "Make sure Python and dependencies are installed:" -ForegroundColor Yellow
    Write-Host "   pip install -r requirements.txt" -ForegroundColor White
    exit 1
}
