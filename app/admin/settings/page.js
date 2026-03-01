'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    helpNumber: '+880-1XXX-XXXXXX',
    helpEmail: 'info@rjshopbd.com'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, you would fetch from an API endpoint
      // For now, we'll use default values
      setSettings({
        helpNumber: '+880-1XXX-XXXXXX',
        helpEmail: 'info@rjshopbd.com'
      });
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
      // In a real app, you would send this to an API endpoint
      // For now, we'll just show a success message
      setMessage('Settings updated successfully!');
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
        <h1 className="text-2xl font-bold mb-6">সেটিংস</h1>
        
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Help Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Help Number</label>
              <input
                type="text"
                name="helpNumber"
                value={settings.helpNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Help Email</label>
              <input
                type="email"
                name="helpEmail"
                value={settings.helpEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
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