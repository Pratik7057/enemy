#!/usr/bin/env python3
"""
Test script for the RadhaAPI YouTube Audio Streaming endpoint
Demonstrates how to use the /get-audio endpoint with API key authentication
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000"  # Change to your FastAPI server URL
API_KEY = "your_api_key_here"  # Replace with a valid API key from the database

def test_get_audio(query, api_key):
    """Test the /get-audio endpoint with API key authentication"""
    
    # Prepare headers with Bearer token
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Make the request
    url = f"{BASE_URL}/get-audio"
    params = {"query": query}
    
    try:
        print(f"🎵 Testing /get-audio endpoint")
        print(f"📝 Query: {query}")
        print(f"🔑 API Key: {api_key[:12]}...{api_key[-8:] if len(api_key) > 20 else api_key}")
        print(f"🌐 URL: {url}")
        print("-" * 50)
        
        response = requests.get(url, headers=headers, params=params)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📨 Response Headers: {dict(response.headers)}")
        print("-" * 50)
        
        # Parse JSON response
        try:
            data = response.json()
            print(f"📄 Response JSON:")
            print(json.dumps(data, indent=2))
            
            if response.status_code == 200 and data.get("success"):
                audio_data = data.get("data", {})
                print("\n✅ SUCCESS!")
                print(f"🎵 Title: {audio_data.get('title')}")
                print(f"⏱️ Duration: {audio_data.get('duration')} seconds")
                print(f"🔗 Audio URL: {audio_data.get('audio_url')[:50]}..." if audio_data.get('audio_url') else "❌ No audio URL")
                print(f"🖼️ Thumbnail: {audio_data.get('thumbnail')[:50]}..." if audio_data.get('thumbnail') else "❌ No thumbnail")
            else:
                print(f"\n❌ ERROR: {data.get('error', 'Unknown error')}")
                
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False
    
    return response.status_code == 200

def test_without_api_key(query):
    """Test the endpoint without API key (should fail)"""
    url = f"{BASE_URL}/get-audio"
    params = {"query": query}
    
    print(f"\n🔒 Testing without API key (should fail)")
    print("-" * 50)
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 403:
            print("✅ Correctly rejected request without API key")
        else:
            print("❌ Should have rejected request without API key")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

def test_health_endpoint():
    """Test the health endpoint"""
    url = f"{BASE_URL}/health"
    
    print(f"\n❤️ Testing /health endpoint")
    print("-" * 50)
    
    try:
        response = requests.get(url)
        data = response.json()
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
            
    except Exception as e:
        print(f"❌ Health check failed: {e}")

def test_root_endpoint():
    """Test the root endpoint"""
    url = f"{BASE_URL}/"
    
    print(f"\n🏠 Testing root endpoint")
    print("-" * 50)
    
    try:
        response = requests.get(url)
        data = response.json()
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            print("✅ Root endpoint working")
        else:
            print("❌ Root endpoint failed")
            
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")

if __name__ == "__main__":
    print("🧪 RadhaAPI YouTube Audio Streaming - Test Suite")
    print("=" * 60)
    
    # Test basic endpoints first
    test_root_endpoint()
    test_health_endpoint()
    
    # Test authentication
    test_without_api_key("test song")
    
    # Test with API key (if provided)
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        query = sys.argv[2] if len(sys.argv) > 2 else "relaxing music"
        test_get_audio(query, api_key)
    else:
        print(f"\n💡 To test with API key, run:")
        print(f"   python {sys.argv[0]} <API_KEY> [search_query]")
        print(f"\n💡 Example:")
        print(f"   python {sys.argv[0]} sk_1234567890abcdef 'lofi hip hop'")
    
    print("\n🏁 Test completed!")
