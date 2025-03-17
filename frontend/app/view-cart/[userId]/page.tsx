/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ShoppingBag, Trash, Plus, Minus, ArrowLeft } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Cart and CartItem interfaces
interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrls: {
      public_id: string;
      url: string;
    }[];
  };
  quantity: number;
  name: string;
  price: number;
  image: string;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export default function ViewCartPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          router.push('/login');
          return;
        }
        
        // Fetch cart
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setCart(response.data);
      } catch (error: any) {
        console.error("Error fetching cart:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to load cart";
        setError(errorMessage);
        
        // Handle authentication errors
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Please login to view your cart');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router, userId]);

  // Update cart item quantity
  const updateItemQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(productId);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Update quantity
      const response = await axios.put(
        'http://localhost:5000/api/cart/update',
        {
          productId,
          quantity: newQuantity
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setCart(response.data);
      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Error updating cart:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Session expired. Please login again');
          router.push('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to update cart';
          toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      setRemovingItem(productId);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Remove item
      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Error removing item:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Session expired. Please login again');
          router.push('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to remove item';
          toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setRemovingItem(null);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setClearingCart(true);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Clear cart
      const response = await axios.delete(
        'http://localhost:5000/api/cart/clear',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setCart(response.data.cart);
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Session expired. Please login again');
          router.push('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to clear cart';
          toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setClearingCart(false);
    }
  };

  // Navigate to checkout
  const proceedToCheckout = () => {
    router.push('/order-details');
  };

  // Continue shopping
  const continueShopping = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light pt-16">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 text-xs text-gray-500">
          <span className="hover:text-black cursor-pointer" onClick={continueShopping}>HOME</span> / 
          <span className="text-black ml-2">SHOPPING CART</span>
        </div>
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl mb-4 font-medium">YOUR CART</h1>
          <p className="text-sm text-gray-500">
            {cart?.items.length 
              ? `You have ${cart.items.length} item${cart.items.length !== 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-24">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              className="px-4 py-2 border border-black text-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : cart && cart.items.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cart Items Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead className="border-b border-gray-200">
                  <tr className="text-left">
                    <th className="py-4 pr-2 font-medium text-sm">PRODUCT</th>
                    <th className="py-4 px-2 font-medium text-sm hidden sm:table-cell">PRICE</th>
                    <th className="py-4 px-2 font-medium text-sm">QUANTITY</th>
                    <th className="py-4 px-2 font-medium text-sm text-right">TOTAL</th>
                    <th className="py-4 pl-2 font-medium text-sm sr-only">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <motion.tr 
                        key={item.product._id}
                        className="border-b border-gray-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Product */}
                        <td className="py-6 pr-2">
                          <div className="flex items-center">
                            <div className="h-20 w-20 mr-4 bg-gray-50 flex-shrink-0">
                              <img 
                                src={item.image || (item.product.imageUrls && item.product.imageUrls.length > 0 ? item.product.imageUrls[0].url : '')} 
                                alt={item.name || item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.name || item.product.name}</p>
                              <p className="text-xs text-gray-500 mt-1 sm:hidden">${(item.price || item.product.price).toFixed(2)}</p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Price */}
                        <td className="py-6 px-2 hidden sm:table-cell">
                          <p className="text-sm">${(item.price || item.product.price).toFixed(2)}</p>
                        </td>
                        
                        {/* Quantity */}
                        <td className="py-6 px-2">
                          <div className="flex border border-gray-300 w-24">
                            <button 
                              className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                              onClick={() => updateItemQuantity(item.product._id, item.quantity - 1)}
                              disabled={updatingItem === item.product._id || item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <div className="flex-1 text-center py-1 border-x border-gray-300 text-sm">
                              {updatingItem === item.product._id ? (
                                <div className="animate-pulse w-full h-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                </div>
                              ) : (
                                item.quantity
                              )}
                            </div>
                            <button 
                              className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                              onClick={() => updateItemQuantity(item.product._id, item.quantity + 1)}
                              disabled={updatingItem === item.product._id}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        
                        {/* Total */}
                        <td className="py-6 px-2 text-right">
                          <p className="text-sm">${((item.price || item.product.price) * item.quantity).toFixed(2)}</p>
                        </td>
                        
                        {/* Remove */}
                        <td className="py-6 pl-2 text-right">
                          <button 
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeItem(item.product._id)}
                            disabled={removingItem === item.product._id}
                          >
                            {removingItem === item.product._id ? (
                              <div className="animate-spin h-4 w-4 border border-gray-400 border-t-transparent rounded-full"></div>
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* Cart Actions and Summary */}
            <div className="flex flex-col md:flex-row md:justify-between gap-8 mt-10">
              {/* Left Side - Actions */}
              <div className="md:w-1/2 flex flex-col">
                <button 
                  className="flex items-center text-sm hover:underline mb-6"
                  onClick={continueShopping}
                >
                  <ArrowLeft size={14} className="mr-2" />
                  Continue Shopping
                </button>
                
                <button 
                  className="w-full sm:w-auto px-6 py-3 border border-black text-sm tracking-widest flex justify-center items-center hover:bg-gray-50 transition-colors"
                  onClick={clearCart}
                  disabled={clearingCart}
                >
                  {clearingCart ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                      CLEARING...
                    </>
                  ) : (
                    'CLEAR CART'
                  )}
                </button>
              </div>
              
              {/* Right Side - Summary */}
              <div className="md:w-1/2 bg-gray-50 p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm">${cart.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm">Shipping:</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between py-3 mb-6">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">${cart.total.toFixed(2)}</span>
                </div>
                
                <motion.button 
                  className="w-full py-3 bg-black text-white text-sm tracking-widest flex justify-center items-center gap-2 hover:bg-gray-900 transition-colors"
                  onClick={proceedToCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag size={16} />
                  PROCEED TO CHECKOUT
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Empty Cart
          <motion.div 
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven&lsquo;t added any products to your cart yet.</p>
            
            <motion.button 
              className="px-8 py-3 bg-black text-white text-sm tracking-widest inline-flex justify-center items-center gap-2 hover:bg-gray-900 transition-colors"
              onClick={continueShopping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START SHOPPING
            </motion.button>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}