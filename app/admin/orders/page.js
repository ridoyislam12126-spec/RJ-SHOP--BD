'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        // Refresh the orders list
        fetchOrders();
      } else {
        const data = await res.json();
        alert(`Error updating order: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
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
        <h1 className="text-2xl font-bold mb-6">অর্ডার সমূহ</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateStatus(order._id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          অর্ডার কনফার্ম
                        </button>
                        <button 
                          onClick={() => updateStatus(order._id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          অর্ডার বাতিল
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found.
          </div>
        )}
      </main>
    </div>
  );
}