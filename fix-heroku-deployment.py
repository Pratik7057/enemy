#!/usr/bin/env python3
"""
Quick fix script for common Heroku deployment issues
Run this before deploying to Heroku
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and return success/failure"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - Success")
            return True
        else:
            print(f"❌ {description} - Failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description} - Error: {e}")
        return False

def main():
    """Main fix function"""
    print("🛠️  RadhaAPI Heroku Deployment Fix")
    print("=" * 40)
    
    # Check current directory
    if not Path("main.py").exists():
        print("❌ main.py not found! Run this script from the project root.")
        sys.exit(1)
    
    print("✅ Project root detected")
    
    # Fix 1: Check Python runtime
    print("\n1. Checking Python runtime...")
    with open("runtime.txt", "r") as f:
        runtime = f.read().strip()
    
    if runtime == "python-3.11.9":
        print("✅ Python runtime is correct")
    else:
        print(f"🔧 Updating Python runtime from {runtime} to python-3.11.9")
        with open("runtime.txt", "w") as f:
            f.write("python-3.11.9\n")
    
    # Fix 2: Check Procfile
    print("\n2. Checking Procfile...")
    with open("Procfile", "r") as f:
        procfile = f.read().strip()
    
    expected_procfile = "web: gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT"
    
    if expected_procfile in procfile:
        print("✅ Procfile is correct")
    else:
        print("🔧 Updating Procfile...")
        with open("Procfile", "w") as f:
            f.write(expected_procfile + "\n")
    
    # Fix 3: Check requirements.txt
    print("\n3. Checking requirements.txt...")
    required_packages = [
        "fastapi",
        "uvicorn",
        "gunicorn",
        "yt-dlp",
        "motor",
        "python-dotenv"
    ]
    
    with open("requirements.txt", "r") as f:
        requirements = f.read()
    
    missing_packages = []
    for package in required_packages:
        if package not in requirements:
            missing_packages.append(package)
    
    if not missing_packages:
        print("✅ All required packages are listed")
    else:
        print(f"⚠️  Missing packages: {missing_packages}")
    
    # Fix 4: Test Python syntax
    print("\n4. Testing Python syntax...")
    if run_command("python -m py_compile main.py", "Compiling main.py"):
        print("✅ Python syntax is valid")
    else:
        print("❌ Python syntax errors found!")
        sys.exit(1)
    
    # Fix 5: Test imports
    print("\n5. Testing imports...")
    try:
        import fastapi
        import uvicorn
        import yt_dlp
        import motor.motor_asyncio
        print("✅ All imports are available")
    except ImportError as e:
        print(f"⚠️  Import error: {e}")
        print("Run: pip install -r requirements.txt")
    
    # Fix 6: Git preparation
    print("\n6. Preparing git repository...")
    
    if not Path(".git").exists():
        run_command("git init", "Initializing git repository")
    
    # Add all files
    run_command("git add .", "Adding files to git")
    
    # Check if there are changes to commit
    result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
    if result.stdout.strip():
        run_command('git commit -m "Fix Heroku deployment configuration"', "Committing changes")
        print("✅ Git repository is ready")
    else:
        print("✅ No changes to commit")
    
    print("\n🎉 Pre-deployment fixes completed!")
    print("\n📋 Next steps:")
    print("1. Make sure you have Heroku CLI installed")
    print("2. Login to Heroku: heroku login")
    print("3. Create Heroku app: heroku create your-app-name")
    print("4. Set MongoDB URI: heroku config:set MONGODB_URI='your_mongodb_uri'")
    print("5. Deploy: git push heroku main")
    print("\n🚀 Or run the automated deployment script:")
    print("   .\\deploy-fastapi-heroku.ps1")

if __name__ == "__main__":
    main()
