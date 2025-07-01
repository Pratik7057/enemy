#!/bin/bash

# Installation script for RadhaAPI FastAPI Backend
# This script installs all required dependencies for the YouTube audio streaming API

echo "🚀 Installing RadhaAPI FastAPI Backend Dependencies..."
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip and try again."
    exit 1
fi

echo "✅ pip found: $(pip3 --version)"

# Create virtual environment (optional but recommended)
read -p "📦 Create virtual environment? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Creating virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    source venv/bin/activate
    echo "✅ Virtual environment created and activated"
else
    echo "⚠️  Installing globally (not recommended for production)"
fi

# Install dependencies
echo "📥 Installing Python packages..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ All dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Check the error messages above."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env 2>/dev/null || echo "MONGODB_URI=mongodb://localhost:27017/radhaapi" > .env
    echo "✅ Created .env file. Please update it with your configuration."
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your MongoDB connection string"
echo "2. Make sure MongoDB is running"
echo "3. Start the FastAPI server:"
echo "   python main.py"
echo ""
echo "4. Test the API:"
echo "   python test_get_audio_api.py <YOUR_API_KEY> 'test song'"
echo ""
echo "📚 Read GET_AUDIO_API_DOCS.md for detailed usage instructions"
