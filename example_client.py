"""
Simple example client for RadhaAPI /get-audio endpoint
This demonstrates how to use the API from a Python client
"""

import requests
import json
import sys
from typing import Dict, Any

class RadhaAPIClient:
    """Simple client for RadhaAPI YouTube audio streaming"""
    
    def __init__(self, base_url: str, api_key: str):
        """
        Initialize the client
        
        Args:
            base_url: API base URL (e.g., "http://localhost:8000")
            api_key: Your RadhaAPI key
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def health_check(self) -> Dict[str, Any]:
        """Check if the API is healthy"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Health check failed: {e}")
    
    def get_audio(self, query: str) -> Dict[str, Any]:
        """
        Get audio stream information for a YouTube search query
        
        Args:
            query: YouTube search query
            
        Returns:
            Dictionary with title, duration, audio_url, and thumbnail
            
        Raises:
            Exception: If the API request fails
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty")
        
        try:
            response = self.session.get(
                f"{self.base_url}/get-audio",
                params={'query': query.strip()},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    return data['data']
                else:
                    raise Exception(f"API returned success=false: {data.get('error', 'Unknown error')}")
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', f'HTTP {response.status_code}')
                except:
                    error_msg = f'HTTP {response.status_code}: {response.text}'
                raise Exception(f"API request failed: {error_msg}")
                
        except requests.exceptions.Timeout:
            raise Exception("Request timed out - the API might be slow or down")
        except requests.exceptions.ConnectionError:
            raise Exception("Cannot connect to API - check if server is running")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error: {e}")

def format_duration(seconds: int) -> str:
    """Format duration in seconds to human readable format"""
    if seconds < 60:
        return f"{seconds}s"
    elif seconds < 3600:
        minutes = seconds // 60
        secs = seconds % 60
        return f"{minutes}m {secs}s"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        return f"{hours}h {minutes}m {secs}s"

def main():
    """Example usage of the RadhaAPI client"""
    
    # Configuration - UPDATE THESE VALUES
    API_BASE_URL = "http://localhost:8000"  # Change to your API URL
    API_KEY = "your_api_key_here"  # Change to your actual API key
    
    print("🎵 RadhaAPI Client Example")
    print("=" * 40)
    
    # Check configuration
    if API_KEY == "your_api_key_here":
        print("❌ Please update the API_KEY in this script!")
        print("Set API_KEY to your actual RadhaAPI key")
        return
    
    # Initialize client
    try:
        client = RadhaAPIClient(API_BASE_URL, API_KEY)
        print(f"✅ Client initialized with base URL: {API_BASE_URL}")
    except Exception as e:
        print(f"❌ Failed to initialize client: {e}")
        return
    
    # Test health endpoint
    print("\n🏥 Testing health endpoint...")
    try:
        health = client.health_check()
        print(f"✅ API is healthy: {health.get('status', 'unknown')}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        print("Make sure the API server is running")
        return
    
    # Test queries
    test_queries = [
        "lofi hip hop study music",
        "relaxing piano music",
        "nature sounds rain"
    ]
    
    print(f"\n🎵 Testing audio requests...")
    
    for query in test_queries:
        print(f"\n🔍 Searching: '{query}'")
        try:
            result = client.get_audio(query)
            
            print(f"✅ Success!")
            print(f"   📝 Title: {result['title']}")
            print(f"   ⏱️  Duration: {format_duration(result['duration'])}")
            print(f"   🎵 Audio URL: {result['audio_url'][:80]}...")
            print(f"   🖼️  Thumbnail: {'✅ Available' if result['thumbnail'] else '❌ None'}")
            
        except Exception as e:
            print(f"❌ Failed: {e}")
    
    # Interactive mode
    print(f"\n🎹 Interactive mode - enter your own queries:")
    print("Type 'quit' to exit")
    
    while True:
        try:
            query = input("\n🔍 Enter search query: ").strip()
            
            if query.lower() in ['quit', 'exit', 'q']:
                break
            
            if not query:
                print("Please enter a search query")
                continue
            
            print(f"🔄 Searching for: '{query}'...")
            result = client.get_audio(query)
            
            print(f"✅ Found: {result['title']}")
            print(f"⏱️  Duration: {format_duration(result['duration'])}")
            print(f"🎵 Audio URL: {result['audio_url']}")
            
            if result['thumbnail']:
                print(f"🖼️  Thumbnail: {result['thumbnail']}")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n👋 Goodbye!")

if __name__ == "__main__":
    main()
