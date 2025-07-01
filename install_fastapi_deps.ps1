# PowerShell installation script for RadhaAPI FastAPI Backend
# This script installs all required dependencies for the YouTube audio streaming API

Write-Host "🚀 Installing RadhaAPI FastAPI Backend Dependencies..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Check if pip is installed
try {
    $pipVersion = pip --version 2>&1
    Write-Host "✅ pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pip is not installed. Please install pip and try again." -ForegroundColor Red
    exit 1
}

# Ask about virtual environment
$createVenv = Read-Host "📦 Create virtual environment? (y/n)"
if ($createVenv -eq "y" -or $createVenv -eq "Y") {
    Write-Host "🔨 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    
    # Activate virtual environment
    if (Test-Path "venv\Scripts\Activate.ps1") {
        & "venv\Scripts\Activate.ps1"
        Write-Host "✅ Virtual environment created and activated" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Virtual environment created but couldn't activate. Run 'venv\Scripts\Activate.ps1' manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Installing globally (not recommended for production)" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "📥 Installing Python packages..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies. Check the error messages above." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    } else {
        "MONGODB_URI=mongodb://localhost:27017/radhaapi" | Out-File -FilePath ".env" -Encoding UTF8
    }
    Write-Host "✅ Created .env file. Please update it with your configuration." -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Installation completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update the .env file with your MongoDB connection string" -ForegroundColor White
Write-Host "2. Make sure MongoDB is running" -ForegroundColor White
Write-Host "3. Start the FastAPI server:" -ForegroundColor White
Write-Host "   python main.py" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Test the API:" -ForegroundColor White
Write-Host "   python test_get_audio_api.py <YOUR_API_KEY> 'test song'" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Read GET_AUDIO_API_DOCS.md for detailed usage instructions" -ForegroundColor Cyan
