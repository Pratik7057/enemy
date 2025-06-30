@echo off
echo ========================================
echo RadhaAPI Backend Heroku Deployment
echo ========================================

:: Check if we're in the right directory
if not exist "backend" (
    echo Error: Backend folder not found. Please run this script from the project root.
    pause
    exit /b 1
)

:: Navigate to backend directory
cd backend

:: Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
)

:: Add all files
echo Adding files to git...
git add .

:: Commit changes
echo Committing changes...
git commit -m "Deploy RadhaAPI backend to Heroku"

:: Deploy to Heroku (assumes app is already created and remote is set)
echo Deploying to Heroku...
git push heroku main

echo.
echo Deployment completed!
echo.
echo Next steps:
echo 1. Check your app status: heroku ps
echo 2. View logs: heroku logs --tail
echo 3. Test your API: heroku open
echo.
pause
