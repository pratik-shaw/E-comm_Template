/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrls: {
    public_id: string;
    url: string;
  }[];
  discount: number;
  tags: string[];
  sku: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

const initialProductState: Product = {
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  imageUrls: [],
  discount: 0,
  tags: [],
  sku: ''
};

// Sample categories - you can replace with actual categories from your backend
const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive'
];

export default function EditProducts() {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProductState);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (!token || !storedUserInfo) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      // Check if user is admin
      if (parsedUserInfo.role === 'admin') {
        setIsAdmin(true);
        // Verify token with backend
        verifyAdminAccess(token);
      } else {
        // Redirect non-admin users
        router.push('/user-dashboard');
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
      router.push('/login');
    }
  }, [router]);

  const verifyAdminAccess = async (token: string) => {
    try {
      // Verify admin role with backend
      const response = await fetch('http://localhost:5000/api/auth/current-user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Handle unauthorized - likely invalid/expired token
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          router.push('/login');
          return;
        }
        
        const errorData = await response.json().catch(() => null);
        throw new Error(`Server returned ${response.status}: ${errorData?.message || 'Unknown error'}`);
      }
      
      const userData = await response.json();
      
      // Update user info and admin status
      setUserInfo(userData);
      if (userData.role !== 'admin') {
        router.push('/user-dashboard');
        return;
      }
      
      setIsAdmin(true);
      setError(null);
      
      // Fetch products once admin verification is successful
      fetchProducts();
    } catch (error: any) {
      console.error("Error verifying admin access:", error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. Please make sure your backend is running.');
      } else {
        setError(`Error: ${error.message}`);
      }
      
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products with status: ${response.status}`);
      }
      const data = await response.json();
      setProductList(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error loading products. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!currentProduct.name || !currentProduct.description || 
          currentProduct.price <= 0 || !currentProduct.category || 
          currentProduct.stock < 0 || !currentProduct.sku) {
        alert('Please fill all required fields correctly');
        return;
      }

      const url = isEditing 
        ? `http://localhost:5000/api/products/${currentProduct._id}` 
        : 'http://localhost:5000/api/products';
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Your session has expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(currentProduct),
      });

      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          setError('Your session has expired. Please login again.');
          router.push('/login');
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status: ${response.status}`);
      }

      await fetchProducts();
      resetForm();
      alert(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error instanceof Error ? error.message : 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Your session has expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          setError('Your session has expired. Please login again.');
          router.push('/login');
          return;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setCurrentProduct(initialProductState);
    setIsEditing(false);
    setTagInput('');
    setImageUrl('');
    setImagePublicId('');
  };

  const addTag = () => {
    if (tagInput.trim() !== '' && !currentProduct.tags.includes(tagInput.trim())) {
      setCurrentProduct({
        ...currentProduct,
        tags: [...currentProduct.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentProduct({
      ...currentProduct,
      tags: currentProduct.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addImage = () => {
    if (imageUrl.trim() !== '' && imagePublicId.trim() !== '') {
      const newImage = {
        public_id: imagePublicId.trim(),
        url: imageUrl.trim()
      };
      setCurrentProduct({
        ...currentProduct,
        imageUrls: [...currentProduct.imageUrls, newImage]
      });
      setImageUrl('');
      setImagePublicId('');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...currentProduct.imageUrls];
    updatedImages.splice(index, 1);
    setCurrentProduct({
      ...currentProduct,
      imageUrls: updatedImages
    });
  };

  // Handle auth error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              localStorage.removeItem('userToken');
              localStorage.removeItem('userInfo');
              router.push('/login');
            }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition duration-200"
          >
            Go to Login
          </button>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Refresh the page to retry authentication
              window.location.reload();
            }}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render the page if user is authenticated as admin
  if (!isAdmin) {
    return null; // This will be shown briefly before redirecting to login or dashboard
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-[30vh] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-gradient-to-r from-gray-800 to-black bg-center bg-cover"></div>
        </div>
        
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center text-white z-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-3xl md:text-5xl tracking-wide mb-2 text-center">
            Manage Products
          </h1>
          <p className="text-xs md:text-sm tracking-widest max-w-xl mx-auto text-center px-6">
            ADD, EDIT AND REMOVE PRODUCTS FROM YOUR INVENTORY
          </p>
        </motion.div>
      </section>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 md:mx-12 my-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Content */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Form Section */}
            <motion.div 
              className="col-span-1 md:col-span-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-50 p-6 rounded-md shadow-sm mb-8">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  {isEditing ? 'Edit Product' : 'Create New Product'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Product Name*</label>
                      <input
                        type="text"
                        placeholder="Product name"
                        value={currentProduct.name}
                        onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                        required
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">SKU*</label>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={currentProduct.sku}
                        onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})}
                        required
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description*</label>
                    <textarea
                      placeholder="Product description"
                      value={currentProduct.description}
                      onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                      required
                      className="w-full p-2 border border-gray-200 rounded min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Price ($)*</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={currentProduct.price}
                        onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                        required
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Stock*</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={currentProduct.stock}
                        onChange={(e) => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
                        required
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Discount"
                        value={currentProduct.discount}
                        onChange={(e) => setCurrentProduct({...currentProduct, discount: parseInt(e.target.value)})}
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Category*</label>
                    <select
                      value={currentProduct.category}
                      onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                      required
                      className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="flex-grow p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button 
                        type="button" 
                        onClick={addTag}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                      >
                        Add
                      </button>
                    </div>
                    
                    {currentProduct.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentProduct.tags.map((tag, index) => (
                          <div key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center">
                            <span>{tag}</span>
                            <button 
                              type="button"
                              onClick={() => removeTag(tag)} 
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Images</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Public ID"
                        value={imagePublicId}
                        onChange={(e) => setImagePublicId(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={addImage}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200 mb-2"
                    >
                      Add Image
                    </button>
                    
                    {currentProduct.imageUrls.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {currentProduct.imageUrls.map((image, index) => (
                          <div key={index} className="border border-gray-200 p-2 rounded">
                            <div className="aspect-square relative">
                              <img 
                                src={image.url} 
                                alt={`Product image ${index + 1}`} 
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Error';
                                }}
                              />
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs truncate">{image.public_id}</span>
                              <button 
                                type="button"
                                onClick={() => removeImage(index)} 
                                className="text-gray-500 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
  
                  <div className="flex space-x-4">
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
                    >
                      {isEditing ? 'Update Product' : 'Create Product'}
                    </button>
                    {isEditing && (
                      <button 
                        type="button" 
                        onClick={resetForm} 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded transition duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
            
            {/* Product List Section */}
            <motion.div
              className="col-span-1 md:col-span-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 border border-gray-100 rounded-md shadow-sm">
                <h2 className="text-2xl font-medium mb-6">Product Inventory</h2>
                
                <div className="space-y-4">
                  {productList.length === 0 ? (
                    <p className="text-gray-400">No products found. Create your first product above.</p>
                  ) : (
                    productList.map((product) => (
                      <div key={product._id} className="bg-gray-50 p-6 rounded-md border border-gray-100 flex justify-between items-center hover:bg-gray-100 transition duration-200">
                        <div className="flex items-center">
                          {product.imageUrls.length > 0 ? (
                            <div className="w-16 h-16 mr-4">
                              <img 
                                src={product.imageUrls[0].url} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 mr-4 bg-gray-200 rounded flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-xl mb-1">{product.name}</h3>
                            <div className="text-gray-500 text-sm">
                              <span>SKU: {product.sku}</span>
                              <span className="mx-2">•</span>
                              <span>${product.price.toFixed(2)}</span>
                              <span className="mx-2">•</span>
                              <span>Stock: {product.stock}</span>
                              <span className="mx-2">•</span>
                              <span>{product.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-x-3">
                          <button 
                            onClick={() => {
                              setCurrentProduct(product);
                              setIsEditing(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id!)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}