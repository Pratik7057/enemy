# RadhaAPI FastAPI Backend Deployment Script for Heroku
# Run this script to deploy the YouTube audio streaming API

Write-Host "🚀 RadhaAPI FastAPI Backend Deployment" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if we're in the correct directory
if (!(Test-Path "main.py")) {
    Write-Host "❌ main.py not found! Make sure you're in the correct directory." -ForegroundColor Red
    exit 1
}

# Check if Heroku CLI is installed
try {
    $herokuVersion = heroku --version
    Write-Host "✅ Heroku CLI found: $herokuVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Heroku CLI not found! Please install it first:" -ForegroundColor Red
    Write-Host "   https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "🔧 Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for RadhaAPI FastAPI backend"
}

Write-Host "🔧 Pre-deployment checks..." -ForegroundColor Yellow

# Validate required files
$requiredFiles = @("main.py", "requirements.txt", "Procfile", "runtime.txt")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file found" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing!" -ForegroundColor Red
        exit 1
    }
}

# Check Python version in runtime.txt
$pythonVersion = Get-Content "runtime.txt"
Write-Host "🐍 Python version: $pythonVersion" -ForegroundColor White

# Check requirements.txt
Write-Host "📦 Dependencies:" -ForegroundColor White
Get-Content "requirements.txt" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }

Write-Host "`n🚀 Starting Heroku deployment..." -ForegroundColor Cyan

# Create Heroku app (you can change the app name)
$appName = Read-Host "Enter Heroku app name (or press Enter for auto-generated)"
if ([string]::IsNullOrWhiteSpace($appName)) {
    Write-Host "🔧 Creating Heroku app with auto-generated name..." -ForegroundColor Yellow
    heroku create
} else {
    Write-Host "🔧 Creating Heroku app: $appName..." -ForegroundColor Yellow
    heroku create $appName
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Heroku app!" -ForegroundColor Red
    exit 1
}

# Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow

# Set production environment
heroku config:set ENVIRONMENT=production

# MongoDB URI (you need to provide this)
Write-Host "`n⚠️  IMPORTANT: You need to set your MongoDB URI" -ForegroundColor Yellow
Write-Host "Example: heroku config:set MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/radhaapi'" -ForegroundColor White

$mongoUri = Read-Host "Enter your MongoDB URI (optional, you can set it later)"
if (![string]::IsNullOrWhiteSpace($mongoUri)) {
    heroku config:set MONGODB_URI="$mongoUri"
    Write-Host "✅ MongoDB URI set" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB URI not set. Set it later with:" -ForegroundColor Yellow
    Write-Host "   heroku config:set MONGODB_URI='your_mongodb_connection_string'" -ForegroundColor White
}

# Deploy to Heroku
Write-Host "`n🚀 Deploying to Heroku..." -ForegroundColor Cyan
git add .
git commit -m "Deploy RadhaAPI FastAPI backend to Heroku"
git push heroku main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    
    # Get app URL
    $appUrl = heroku info -s | Select-String "web_url" | ForEach-Object { $_.ToString().Split('=')[1] }
    
    Write-Host "`n🎉 Your RadhaAPI backend is live!" -ForegroundColor Green
    Write-Host "🌐 URL: $appUrl" -ForegroundColor White
    Write-Host "🏥 Health Check: ${appUrl}health" -ForegroundColor White
    Write-Host "📖 API Docs: ${appUrl}docs" -ForegroundColor White
    Write-Host "🎵 Get Audio: ${appUrl}get-audio?query=YOUR_QUERY" -ForegroundColor White
    
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Test your API endpoints" -ForegroundColor White
    Write-Host "2. Set up your MongoDB database and update MONGODB_URI" -ForegroundColor White
    Write-Host "3. Create API keys for users in your database" -ForegroundColor White
    Write-Host "4. Update your frontend to use this backend URL" -ForegroundColor White
    
    # Open the app
    $openApp = Read-Host "`nOpen the app in browser? (y/n)"
    if ($openApp -eq "y" -or $openApp -eq "Y") {
        heroku open
    }
    
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the logs with: heroku logs --tail" -ForegroundColor Yellow
}
