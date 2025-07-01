#!/usr/bin/env python3
"""
Test script for /get-audio API endpoint
Demonstrates how to use the FastAPI backend from different clients
"""

import requests
import json
import asyncio
import aiohttp

# Configuration
API_BASE_URL = "https://www.radhaapi.me"  # Change to your deployed URL
API_KEY = "your_api_key_here"  # Replace with actual API key

def test_sync_requests():
    """Test using synchronous requests library"""
    print("🔄 Testing with requests library (sync)...")
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Test query
    query = "lofi hip hop study music"
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/get-audio",
            params={"query": query},
            headers=headers,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(json.dumps(data, indent=2))
            
            # Extract audio URL for testing
            audio_url = data.get("data", {}).get("audio_url")
            if audio_url:
                print(f"\n🎵 Audio URL: {audio_url}")
                print("You can test this URL in a media player or browser")
        else:
            print("❌ Error!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

async def test_async_aiohttp():
    """Test using async aiohttp library"""
    print("\n🔄 Testing with aiohttp library (async)...")
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    query = "relaxing piano music"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{API_BASE_URL}/get-audio",
                params={"query": query},
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                
                print(f"Status Code: {response.status}")
                
                if response.status == 200:
                    data = await response.json()
                    print("✅ Success!")
                    print(json.dumps(data, indent=2))
                else:
                    text = await response.text()
                    print("❌ Error!")
                    print(f"Response: {text}")
                    
    except aiohttp.ClientError as e:
        print(f"❌ Request failed: {e}")

def test_javascript_fetch_example():
    """Generate JavaScript fetch example"""
    print("\n📝 JavaScript fetch() example:")
    
    js_code = f'''
// Frontend JavaScript example
const API_KEY = "{API_KEY}";
const API_BASE_URL = "{API_BASE_URL}";

async function getAudio(query) {{
    try {{
        const response = await fetch(`${{API_BASE_URL}}/get-audio?query=${{encodeURIComponent(query)}}`, {{
            method: 'GET',
            headers: {{
                'Authorization': `Bearer ${{API_KEY}}`,
                'Content-Type': 'application/json'
            }}
        }});
        
        if (response.ok) {{
            const data = await response.json();
            console.log('Success:', data);
            
            // Use the audio URL
            const audioUrl = data.data.audio_url;
            const audioElement = new Audio(audioUrl);
            audioElement.play();
            
            return data;
        }} else {{
            const error = await response.json();
            console.error('Error:', error);
            throw new Error(error.error || 'API request failed');
        }}
    }} catch (error) {{
        console.error('Network error:', error);
        throw error;
    }}
}}

// Usage example
getAudio("lofi hip hop study music")
    .then(result => {{
        console.log("Title:", result.data.title);
        console.log("Duration:", result.data.duration, "seconds");
        console.log("Audio URL:", result.data.audio_url);
        console.log("Thumbnail:", result.data.thumbnail);
    }})
    .catch(error => {{
        console.error("Failed to get audio:", error);
    }});
'''
    
    print(js_code)

def test_curl_example():
    """Generate curl command example"""
    print("\n📝 cURL command example:")
    
    curl_cmd = f'''
# Basic curl request
curl -X GET "{API_BASE_URL}/get-audio?query=lofi%20hip%20hop%20study%20music" \\
     -H "Authorization: Bearer {API_KEY}" \\
     -H "Content-Type: application/json"

# With verbose output
curl -v -X GET "{API_BASE_URL}/get-audio?query=relaxing%20piano%20music" \\
     -H "Authorization: Bearer {API_KEY}" \\
     -H "Content-Type: application/json"
'''
    
    print(curl_cmd)

def main():
    """Main test function"""
    print("🎵 RadhaAPI /get-audio Endpoint Test")
    print("=" * 50)
    
    # Check if API key is set
    if API_KEY == "your_api_key_here":
        print("⚠️  Please set your API_KEY in the script before running tests!")
        print("You can get an API key from your RadhaAPI dashboard")
        return
    
    # Test health endpoint first
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("Make sure the FastAPI server is running on the correct port")
        return
    
    # Run tests
    test_sync_requests()
    
    # Run async test
    asyncio.run(test_async_aiohttp())
    
    # Show examples
    test_javascript_fetch_example()
    test_curl_example()
    
    print("\n✅ Testing complete!")
    print("\n📖 API Documentation:")
    print(f"- Root: {API_BASE_URL}/")
    print(f"- Health: {API_BASE_URL}/health")
    print(f"- Get Audio: {API_BASE_URL}/get-audio?query=YOUR_QUERY")
    print("\n🔐 Authentication:")
    print("Include 'Authorization: Bearer <API_KEY>' header in all requests")

if __name__ == "__main__":
    main()
