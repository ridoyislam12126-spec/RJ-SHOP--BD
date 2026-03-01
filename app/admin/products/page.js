'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    stock: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageFilename = 'placeholder-image.jpg'; // Default image
      
      // Upload image if provided
      if (formData.imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadRes.ok) {
          throw new Error('Image upload failed');
        }

        const uploadData = await uploadRes.json();
        imageFilename = uploadData.filename;
      }

      // Prepare product data with image filename
      const productData = {
        ...formData,
        image: imageFilename, // Use the image filename
        imageFile: undefined // Remove the file object from the data
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }

      const data = await res.json();

      if (res.ok) {
        setMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setFormData({ name: '', price: '', description: '', category: '', stock: 0, imageFile: null });
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts(); // Refresh the list
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      imageFile: null // Reset image file when editing
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!productId) {
      setMessage('Invalid Product ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true); // Show loading indicator
    try {
      console.log('Attempting to delete product with ID:', productId);
      
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      console.log('Delete response status:', res.status);
      
      if (res.ok) {
        setMessage('Product deleted successfully!');
        fetchProducts(); // Refresh the list
      } else {
        const data = await res.json();
        console.error('Delete error response:', data);
        setMessage(data.message || 'Failed to delete product');
      }
    } catch (error) {
      setMessage('An error occurred while deleting the product');
      console.error('Delete error:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', category: '', imageUrl: '', stock: 0 });
    setShowForm(false);
  };

  if (loading && products.length === 0) {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">পণ্যসমূহ</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', price: '', description: '', category: '', stock: 0, imageFile: null });
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            পণ্য যোগ করুন
          </button>
        </div>

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({
                        ...prev,
                        imageFile: file
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.imageFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected: {formData.imageFile.name}</p>
                  </div>
                )}
              </div>
              

              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Save')}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={`/uploads/${product.image || 'placeholder-image.jpg'}`} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">৳{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      সম্পাদনা করুন
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900 font-medium ml-4"
                    >
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-500">
            No products found. Click "পণ্য যোগ করুন" to add a new product.
          </div>
        )}
      </main>
    </div>
  );
}