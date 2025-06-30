#!/usr/bin/env python3
"""
Test script for the YouTube audio API
"""

import requests
import json
import sys

def test_api(base_url="http://localhost:8000", query="shape of you ed sheeran"):
    """Test the /get-audio endpoint"""
    
    print(f"🔍 Testing API at: {base_url}")
    print(f"🎵 Query: {query}")
    print("-" * 50)
    
    try:
        # Test health endpoint first
        print("1. Testing health endpoint...")
        health_response = requests.get(f"{base_url}/health", timeout=10)
        
        if health_response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {health_response.status_code}")
            return
        
        # Test main endpoint
        print("2. Testing /get-audio endpoint...")
        
        params = {"query": query}
        response = requests.get(f"{base_url}/get-audio", params=params, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("success"):
                audio_data = data.get("data", {})
                print("✅ Request successful!")
                print(f"🎵 Title: {audio_data.get('title')}")
                print(f"⏱️  Duration: {audio_data.get('duration')} seconds")
                print(f"🔗 Audio URL: {audio_data.get('audio_url')[:100]}...")
                print(f"🖼️  Thumbnail: {audio_data.get('thumbnail')[:100]}...")
                
                # Test if the audio URL is accessible
                print("3. Testing audio URL accessibility...")
                try:
                    audio_response = requests.head(audio_data.get('audio_url'), timeout=10)
                    if audio_response.status_code in [200, 206]:  # 206 for partial content
                        print("✅ Audio URL is accessible")
                    else:
                        print(f"⚠️  Audio URL returned status: {audio_response.status_code}")
                except Exception as e:
                    print(f"⚠️  Could not test audio URL: {str(e)}")
            else:
                print(f"❌ API returned error: {data.get('error')}")
        else:
            print(f"❌ Request failed with status: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"Error: {response.text}")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {str(e)}")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    # Allow custom base URL and query from command line
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    query = sys.argv[2] if len(sys.argv) > 2 else "shape of you ed sheeran"
    
    test_api(base_url, query)
