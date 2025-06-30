# PowerShell script to deploy backend to Heroku

Write-Output "RadhaAPI Backend Heroku Deployment Script"
Write-Output "========================================"

# Check if Heroku CLI is installed
if (-not (Get-Command heroku -ErrorAction SilentlyContinue)) {
    Write-Output "❌ Heroku CLI not found. Please install it first."
    Write-Output "Download from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
}

# Check if we're in the correct directory
if (-not (Test-Path "backend")) {
    Write-Output "❌ Backend folder not found. Please run this script from the project root."
    exit 1
}

Write-Output "✅ Heroku CLI found"

# Change to backend directory
Set-Location backend

# Check if Heroku is logged in
try {
    $user = heroku whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Output "✅ Logged in to Heroku as: $user"
    } else {
        Write-Output "❌ Not logged in to Heroku. Please run: heroku login"
        exit 1
    }
} catch {
    Write-Output "❌ Not logged in to Heroku. Please run: heroku login"
    exit 1
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Output "🔧 Initializing git repository..."
    git init
    Write-Output "✅ Git repository initialized"
}

# Create Heroku app (this will fail if app already exists, which is fine)
Write-Output "🚀 Creating Heroku app..."
$appName = Read-Host "Enter your Heroku app name (or press Enter for auto-generated name)"

if ([string]::IsNullOrWhiteSpace($appName)) {
    heroku create
} else {
    heroku create $appName
}

# Set environment variables
Write-Output "🔧 Setting up environment variables..."
Write-Output "Please provide the following environment variables:"

$mongoUri = Read-Host "MongoDB URI"
$jwtSecret = Read-Host "JWT Secret"
$youtubeApiKey = Read-Host "YouTube API Key"
$corsOrigin = Read-Host "CORS Origin (e.g., https://www.radhaapi.me)"

heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="$mongoUri"
heroku config:set JWT_SECRET="$jwtSecret"
heroku config:set YOUTUBE_API_KEY="$youtubeApiKey"
heroku config:set CORS_ORIGIN="$corsOrigin"
heroku config:set ADMIN_EMAIL="admin@radhaapi.me"
heroku config:set JWT_EXPIRY="7d"

Write-Output "✅ Environment variables set"

# Add files to git
Write-Output "📦 Preparing files for deployment..."
git add .
git commit -m "Deploy RadhaAPI backend to Heroku - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Deploy to Heroku
Write-Output "🚀 Deploying to Heroku..."
git push heroku main

# Check deployment status
Write-Output "📊 Checking deployment status..."
heroku ps

# Show app URL
$appInfo = heroku info --json | ConvertFrom-Json
$appUrl = $appInfo.web_url

Write-Output ""
Write-Output "🎉 Deployment completed!"
Write-Output "📱 App URL: $appUrl"
Write-Output "🔍 Health Check: ${appUrl}api/health"
Write-Output ""
Write-Output "📝 Next steps:"
Write-Output "1. Test your API endpoints"
Write-Output "2. Update your frontend REACT_APP_API_URL to: ${appUrl}api"
Write-Output "3. Configure your custom domain if needed"
Write-Output ""
Write-Output "📋 Useful commands:"
Write-Output "- View logs: heroku logs --tail"
Write-Output "- Restart app: heroku restart"
Write-Output "- Open app: heroku open"

# Return to original directory
Set-Location ..
