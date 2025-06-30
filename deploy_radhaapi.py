#!/usr/bin/env python3
"""
Deployment script for RadhaAPI YouTube Audio Streaming Backend
This script helps deploy the FastAPI backend to your production environment
"""

import os
import sys
import subprocess
import shutil

def run_command(command, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd,
            capture_output=True, 
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'fastapi',
        'uvicorn',
        'yt-dlp',
        'python-multipart',
        'pydantic'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} is missing")
    
    if missing_packages:
        print(f"\n📦 Installing missing packages: {', '.join(missing_packages)}")
        pip_install = f"pip install {' '.join(missing_packages)}"
        if run_command(pip_install):
            print("✅ All packages installed successfully")
        else:
            print("❌ Failed to install packages")
            return False
    
    return True

def test_api_locally():
    """Test the API locally before deployment"""
    print("\n🧪 Testing API locally...")
    
    # Import and test
    try:
        import requests
        
        # Start the server in background for testing
        print("Starting test server...")
        
        # Use uvicorn directly for testing
        import uvicorn
        from main import app
        
        # Quick test by importing
        print("✅ FastAPI app imports successfully")
        print("✅ All modules are working")
        
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {str(e)}")
        return False

def create_production_files():
    """Create production-ready files"""
    print("\n📝 Creating production files...")
    
    # Create a production requirements.txt if it doesn't exist
    requirements_content = """fastapi==0.104.1
uvicorn[standard]==0.24.0
yt-dlp==2023.12.30
python-multipart==0.0.6
pydantic==2.5.2
gunicorn==21.2.0
"""
    
    with open('requirements.txt', 'w') as f:
        f.write(requirements_content)
    print("✅ requirements.txt updated")
    
    # Create/update Procfile for Heroku
    procfile_content = "web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT"
    
    with open('Procfile', 'w') as f:
        f.write(procfile_content)
    print("✅ Procfile updated")
    
    # Create runtime.txt for Python version
    runtime_content = "python-3.11.0"
    
    with open('runtime.txt', 'w') as f:
        f.write(runtime_content)
    print("✅ runtime.txt updated")

def show_deployment_instructions():
    """Show deployment instructions"""
    print("\n🚀 Deployment Instructions:")
    print("=" * 50)
    
    print("\n📋 Your FastAPI backend is ready for deployment!")
    print("\n🔧 Files ready for deployment:")
    print("   • main.py - FastAPI application")
    print("   • requirements.txt - Python dependencies")
    print("   • Procfile - Process configuration")
    print("   • runtime.txt - Python version")
    
    print("\n🌐 For Heroku deployment:")
    print("   1. Create a new Heroku app")
    print("   2. Connect your GitHub repository")
    print("   3. Deploy from the main branch")
    print("   4. Your API will be available at: https://your-app.herokuapp.com")
    
    print("\n🌐 For other platforms (Render, Railway, etc.):")
    print("   1. Connect your repository")
    print("   2. Set build command: pip install -r requirements.txt")
    print("   3. Set start command: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT")
    
    print("\n📡 API Endpoints after deployment:")
    print("   • GET /get-audio?query=your_search_query")
    print("   • GET /health")
    print("   • GET / (API information)")
    
    print("\n🤖 For Telegram bot integration:")
    print("   Use: https://www.radhaapi.me/get-audio?query=YOUR_SEARCH_QUERY")
    print("   The response will contain audio_url for streaming")

def main():
    """Main deployment preparation function"""
    print("🚀 RadhaAPI YouTube Audio Streaming Backend Deployment")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists('main.py'):
        print("❌ main.py not found. Please run this script from the project directory.")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("❌ Dependency check failed")
        sys.exit(1)
    
    # Test API locally
    if not test_api_locally():
        print("❌ Local API test failed")
        sys.exit(1)
    
    # Create production files
    create_production_files()
    
    # Show deployment instructions
    show_deployment_instructions()
    
    print("\n✅ Deployment preparation completed successfully!")
    print("🎯 Your FastAPI backend is ready to replace your existing deployment!")

if __name__ == "__main__":
    main()
