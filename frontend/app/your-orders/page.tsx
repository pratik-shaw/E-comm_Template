/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ShoppingBag, Clock, Truck, CheckCircle, XCircle, ChevronRight, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserOrdersPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          router.push('/login');
          return;
        }
        
        // Fetch orders
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setOrders(response.data.orders);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to load orders";
        setError(errorMessage);
        
        // Handle authentication errors
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Please login to view your orders');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, params.userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock size={18} className="text-yellow-500" />;
      case 'Processing':
        return <Clock size={18} className="text-blue-500" />;
      case 'Shipped':
        return <Truck size={18} className="text-blue-700" />;
      case 'Delivered':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'Cancelled':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrderId(orderId);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Cancel order API call
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update order status in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 'Cancelled' } 
            : order
        )
      );
      
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          toast.error('Session expired. Please login again');
          router.push('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to cancel order';
          toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setCancellingOrderId(null);
    }
  };

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
          <span className="text-black ml-2">MY ORDERS</span>
        </div>
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl mb-4 font-medium">MY ORDERS</h1>
          
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
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <ShoppingBag size={60} className="text-gray-300" />
              </div>
              <h2 className="text-xl mb-4">No orders found</h2>
              <p className="text-gray-500 mb-8">You haven&lsquo;t placed any orders yet.</p>
              <button 
                className="px-8 py-3 bg-black text-white text-sm tracking-widest inline-flex justify-center items-center gap-2 hover:bg-gray-900 transition-colors"
                onClick={continueShopping}
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-md overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <p className="text-sm font-medium mb-1">Order #{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Contents */}
                  <div className="p-4">
                    {/* Items preview (showing first 2 items) */}
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="h-16 w-16 bg-gray-100 flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{item.name}</p>
                            <div className="flex justify-between mt-1">
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500 mt-2">
                          + {order.items.length - 2} more {order.items.length - 2 === 1 ? 'item' : 'items'}
                        </p>
                      )}
                    </div>
                    
                    {/* Order summary & action buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm mb-1">
                          <span className="font-medium">Total:</span> ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.reduce((acc, item) => acc + item.quantity, 0)} {order.items.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      
                      <div className="flex gap-3 mt-4 sm:mt-0">
                        {['Pending', 'Processing'].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            className="px-4 py-2 border border-red-500 text-red-500 text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-900 transition-colors flex items-center"
                        >
                          View Details
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}