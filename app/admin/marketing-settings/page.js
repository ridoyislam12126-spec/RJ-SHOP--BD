'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function MarketingSettings() {
  const [settings, setSettings] = useState({
    tiktokPixelId: '',
    metaPixelId: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          tiktokPixelId: data.settings?.tiktokPixelId || '',
          metaPixelId: data.settings?.metaPixelId || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Marketing settings updated successfully!');
      } else {
        setMessage(data.message || 'Failed to update settings');
      }
    } catch (error) {
      setMessage('An error occurred while updating settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-screen">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Marketing Settings</h1>
        
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Pixel Integration</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                name="tiktokPixelId"
                value={settings.tiktokPixelId}
                onChange={handleInputChange}
                placeholder="Enter TikTok Pixel ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Example: C7834GHJ89234</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Meta Pixel ID</label>
              <input
                type="text"
                name="metaPixelId"
                value={settings.metaPixelId}
                onChange={handleInputChange}
                placeholder="Enter Meta Pixel ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Example: 1234567890123456</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}