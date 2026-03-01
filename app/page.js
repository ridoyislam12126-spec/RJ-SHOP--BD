'use client';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import OrderModal from '../components/OrderModal';
import PixelInjector from '../components/PixelInjector';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        // Ensure data.products is an array and filter out any invalid products
        const validProducts = Array.isArray(data.products) 
          ? data.products.filter(product => 
              product && 
              typeof product === 'object' && 
              product._id && 
              product.name &&
              product.image !== undefined
            ) 
          : [];
        setProducts(validProducts);
      } else {
        console.error('Failed to fetch products:', res.status, res.statusText);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="bg-orange-600 text-white py-2 px-4 flex justify-end">
        <div className="flex items-center">
          <span className="mr-2">📞</span>
          <a href="tel:01312669663" className="font-medium">01312669663</a>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-gray-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">RJ Shop BD</h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90">Bangladesh's Trusted Online Store</p>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">✔</span>
              <span>Cash On Delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">✔</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">✔</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">✔</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose RJ Shop BD?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">We provide the best shopping experience with trusted service and quality products</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Cash On Delivery</h3>
              <p className="text-gray-600">Pay when you receive your product. No advance payment required.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is available round the clock to assist you.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick delivery across Bangladesh with our reliable logistics network.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Multiple secure payment options with bank-level encryption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Products</h2>
          <p className="text-gray-600 text-center mb-12">Discover our premium collection of quality products</p>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onOrderClick={openOrderModal} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {showOrderModal && selectedProduct && (
        <OrderModal 
          product={selectedProduct}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}