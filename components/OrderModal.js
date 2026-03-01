'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PremiumDeliveryCards from './PremiumDeliveryCards';

export default function OrderModal({ product, onClose }) {
  // Handle case where product data is missing or malformed
  if (!product || typeof product !== 'object') {
    return null;
  }

  const {
    _id = '',
    name = 'Unknown Product',
    price = 0,
    image = 'placeholder-image.jpg'
  } = product;

  // Validate required fields
  if (!_id || !name) {
    return null;
  }

  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    deliveryArea: 'dhaka' // Default value
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate delivery charge based on area and quantity
      let deliveryCharge = 0;
      if (formData.deliveryArea === 'dhaka') {
        deliveryCharge = 80;
      } else if (formData.deliveryArea === 'outside') {
        deliveryCharge = 150;
      }

      // If customer orders 3 or more items, delivery is free
      // For now, we're just storing the delivery charge since we don't have quantity in this form
      // But we can implement the free delivery logic here if needed later
      
      const orderData = {
        productId: _id,
        productName: name,
        deliveryCharge: deliveryCharge,
        ...formData
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Order placed successfully!');
        router.refresh();
        onClose();
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred while placing the order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-xl font-bold">Order: {name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <img 
              src={`/uploads/${image}`} 
              alt={name} 
              className="w-full h-32 object-cover rounded-md mb-2"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg'; // fallback image
              }}
            />
            <p className="text-lg font-bold text-green-600">৳{price}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                autoFocus // Focus on the first input when modal opens
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (Bangladesh format)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880-1XXX-XXXXXX"
                required
                pattern="^(\+88|88)?(01[3-9]\d{8})$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Format: +880-1XXX-XXXXXX</p>
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Delivery Area</label>
              <PremiumDeliveryCards 
                defaultValue={formData.deliveryArea} 
                onSelect={(value) => setFormData({...formData, deliveryArea: value})} 
              />
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}