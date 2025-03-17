/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

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

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");

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
        
        if (response.data.items.length === 0) {
          toast.error('Your cart is empty');
          router.push('/products');
          return;
        }
        
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
  }, [router]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    for (const [key, value] of Object.entries(shippingAddress)) {
      if (!value.trim()) {
        toast.error(`Please enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    
    // Phone number validation
    if (!/^\d{10}$/.test(shippingAddress.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Pincode validation
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    
    try {
      setOrderProcessing(true);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Create order
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {
          shippingAddress,
          paymentMethod
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setOrderSuccess(true);
      setOrderNumber(response.data.order.orderNumber);
      toast.success('Order placed successfully!');
      
      // Wait 3 seconds before redirecting
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Session expired. Please login again');
          router.push('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to place order';
          toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setOrderProcessing(false);
    }
  };

  // Continue shopping
  const continueShopping = () => {
    router.push('/products');
  };
  
  // Go back to cart
  const backToCart = () => {
    router.push('/view-cart');
  };

  // Order success display
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-light pt-16">
        <Navbar />
        
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
          <motion.div 
            className="max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <CheckCircle size={60} className="text-green-500" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl mb-4 font-medium">Order Placed!</h1>
            
            <p className="text-lg mb-2">Thank you for your order.</p>
            <p className="text-sm text-gray-500 mb-6">Your order number is: <span className="font-medium">{orderNumber}</span></p>
            
            <p className="text-sm text-gray-500 mb-8">
              You will receive an email confirmation shortly.
              <br />
              Redirecting you to your orders page...
            </p>
            
            <button 
              className="px-8 py-3 bg-black text-white text-sm tracking-widest inline-flex justify-center items-center gap-2 hover:bg-gray-900 transition-colors"
              onClick={() => router.push('/products')}
            >
              CONTINUE SHOPPING
            </button>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light pt-16">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 text-xs text-gray-500">
          <span className="hover:text-black cursor-pointer" onClick={continueShopping}>HOME</span> / 
          <span className="hover:text-black cursor-pointer ml-2" onClick={backToCart}>CART</span> /
          <span className="text-black ml-2">CHECKOUT</span>
        </div>
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl mb-4 font-medium">CHECKOUT</h1>
          <p className="text-sm text-gray-500">
            Please enter your shipping details to complete your order
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
        ) : cart ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Order Form */}
            <div className="lg:w-7/12">
              <form onSubmit={handleSubmit}>
                <div className="bg-gray-50 p-6 mb-8">
                  <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black"
                        required
                        pattern="[0-9]{6}"
                        title="Pincode must be 6 digits"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={shippingAddress.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black"
                        required
                        pattern="[0-9]{10}"
                        title="Phone number must be 10 digits"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 mb-8">
                  <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-black"
                    />
                    <label htmlFor="cod" className="text-sm">Cash on Delivery (COD)</label>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-3 bg-black text-white text-sm tracking-widest flex justify-center items-center gap-2 hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                  disabled={orderProcessing}
                >
                  {orderProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      PLACE ORDER
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Right Side - Order Summary */}
            <div className="lg:w-5/12">
              <div className="bg-gray-50 p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="mb-6 max-h-60 overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex py-3 border-b border-gray-200">
                      <div className="h-16 w-16 bg-gray-100 mr-4 flex-shrink-0">
                        <img 
                          src={item.image || (item.product.imageUrls && item.product.imageUrls.length > 0 ? item.product.imageUrls[0].url : '')} 
                          alt={item.name || item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{item.name || item.product.name}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm">${((item.price || item.product.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm">${cart.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm">Shipping:</span>
                  <span className="text-sm">FREE</span>
                </div>
                
                <div className="flex justify-between py-3 mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">${cart.total.toFixed(2)}</span>
                </div>
                
                <button 
                  className="flex items-center text-sm hover:underline mt-4"
                  onClick={backToCart}
                  type="button"
                >
                  <ArrowLeft size={14} className="mr-2" />
                  Return to Cart
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      <Footer />
    </div>
  );
}