import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateApiKey, getApiKeyDetails, getApiUsageLogs } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const ApiGenerator = () => {
  const { user, updateUserData } = useAuth();
  const [apiDetails, setApiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApiDetails();
    fetchApiLogs();
  }, []);

  const fetchApiDetails = async () => {
    try {
      setLoading(true);
      const response = await getApiKeyDetails();
      if (response.data.success) {
        setApiDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching API details:', error);
      if (error.response?.status !== 404) {
        // Only show error if it's not a "No API key found" error
        toast.error('Failed to load API key details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchApiLogs = async () => {
    try {
      setLogsLoading(true);
      const response = await getApiUsageLogs();
      if (response.data.success) {
        setLogs(response.data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching API logs:', error);
      toast.error('Failed to load API usage logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      setGenerating(true);
      const response = await generateApiKey();
      if (response.data.success) {
        setApiDetails(response.data.data);
        toast.success('API key generated successfully');
        updateUserData(); // Update user data to reflect the new API key status
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <PageHeader 
        title="YouTube API Generator" 
        description="Generate and manage your unique YouTube API key for Telegram bots"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900">API Key Status</h2>
          {loading ? (
            <div className="mt-4 flex items-center justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
              <span className="ml-2 text-gray-500">Loading API key details...</span>
            </div>
          ) : apiDetails ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your API Key</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    key
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={apiDetails.apiKey}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm border-gray-300 bg-gray-50"
                  />
                  <Button 
                    className="ml-2"
                    onClick={() => copyToClipboard(apiDetails.apiKey)} 
                    variant={copied ? "success" : "secondary"}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Keep this key secret and secure.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Integration URL</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={apiDetails.integrationUrl}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md sm:text-sm border-gray-300 bg-gray-50"
                  />
                  <Button 
                    className="ml-2" 
                    onClick={() => copyToClipboard(apiDetails.integrationUrl)} 
                    variant="secondary"
                  >
                    Copy
                  </Button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Add your search query at the end of this URL.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(apiDetails.apiKeyCreatedAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expires At</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(apiDetails.apiKeyExpiresAt)}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button onClick={handleGenerateApiKey} loading={generating} disabled={generating}>
                  Generate New API Key
                </Button>
                <p className="mt-1 text-sm text-red-500">
                  Warning: This will invalidate your current API key.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 py-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No API Key</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't generated an API key yet.
                </p>
                <div className="mt-6">
                  <Button onClick={handleGenerateApiKey} loading={generating} disabled={generating}>
                    Generate API Key
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card title="Developer Instructions">
          <div className="prose max-w-none">
            <h3>How to integrate with your Telegram Bot</h3>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Copy your API key and integration URL from above.</li>
              <li>Use the integration URL in your Telegram bot's code.</li>
              <li>Add your search query parameter at the end of the URL.</li>
              <li>The API will return a JSON response with audio URLs that you can use in your bot.</li>
            </ol>

            <h3 className="mt-4">Example Bot Integration (Python)</h3>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
{`import requests
from pyrogram import Client, filters
from pyrogram.types import Message
from pytgcalls import PyTgCalls

# Initialize your bot
app = Client("music_bot")
pytgcalls = PyTgCalls(app)

@app.on_message(filters.command("play"))
async def play_song(client, message: Message):
    query = " ".join(message.command[1:])
    if not query:
        await message.reply("Please specify a song to play")
        return
        
    api_url = "${apiDetails?.integrationUrl || 'https://yourdomain.xyz/api/youtube?key=YOUR_API_KEY&q='}"
    response = requests.get(f"{api_url}{query}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            await message.reply(f"Now playing: {data['title']} by {data['author']}")
            # Play the audio in voice chat using pytgcalls
            await pytgcalls.join_group_call(
                message.chat.id,
                data['audio_url'],
                stream_type=StreamType().pulse_stream,
            )
        else:
            await message.reply("Error: Could not find audio stream")
    else:
        await message.reply("Error: API request failed")
`}
            </pre>

            <h3 className="mt-4">Supported Frameworks</h3>
            <p>This API is compatible with the following Telegram bot frameworks:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Pyrogram with PyTgCalls</li>
              <li>Telethon</li>
              <li>Node-Telegram-Bot-API</li>
              <li>python-telegram-bot</li>
            </ul>
          </div>
        </Card>

        <Card 
          title="API Usage Logs" 
          subtitle="Recent API requests made with your key"
        >
          {logsLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
              <span className="ml-2 text-gray-500">Loading logs...</span>
            </div>
          ) : logs.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.query}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No API usage logs found. Your logs will appear here when your key is used.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ApiGenerator;
