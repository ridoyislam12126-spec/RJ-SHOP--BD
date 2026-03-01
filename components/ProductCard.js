'use client';

export default function ProductCard({ product, onOrderClick }) {
  // Handle case where product data is missing or malformed
  if (!product || typeof product !== 'object') {
    return null;
  }

  const {
    _id = '',
    name = 'Unknown Product',
    price = 0,
    description = 'No description available',
    image = 'placeholder-image.jpg'
  } = product;

  // Validate required fields
  if (!_id || !name) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={`/uploads/${image}`} 
          alt={name || 'Product'} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'; // fallback image
          }}
        />
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-600">৳{price}</span>
          <button
            onClick={() => onOrderClick(product)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            অর্ডার করুন
          </button>
        </div>
      </div>
    </div>
  );
}