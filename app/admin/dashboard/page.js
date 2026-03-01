'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);

      if (productsRes.ok && ordersRes.ok) {
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setStats({
          totalProducts: Array.isArray(productsData.products) ? productsData.products.length : 0,
          totalOrders: Array.isArray(ordersData.orders) ? ordersData.orders.length : 0,
          pendingOrders: Array.isArray(ordersData.orders) 
            ? ordersData.orders.filter(order => order.status === 'pending').length 
            : 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">ড্যাশবোর্ড</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">মোট পণ্য</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">মোট অর্ডার</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">অপেক্ষারত অর্ডার</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">ওয়েলকাম টু RJ Shop BD এডমিন প্যানেল</h2>
          <p className="text-gray-600">
            এখানে আপনি পণ্য যোগ করতে, অর্ডার পর্যবেক্ষণ করতে এবং সেটিংস পরিবর্তন করতে পারবেন।
          </p>
        </div>
      </main>
    </div>
  );
}