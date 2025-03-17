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
import { Package, Truck, ShoppingBag, Check, Clock, X, Eye } from 'lucide-react';

// Define interfaces for TypeScript
interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminOrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Status options for the orders
  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
      
      // Fetch orders once admin verification is successful
      fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://localhost:5000/api/orders/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders with status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data.orders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error loading orders. Please try again later.');
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Your session has expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
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

      // Update the order in the local state
      await fetchOrders();
      
      // If the updated order is currently selected, update the selected order too
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = await response.json();
        setSelectedOrder(updatedOrder.order);
      }
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} className="mr-1" />;
      case 'Processing':
        return <ShoppingBag size={16} className="mr-1" />;
      case 'Shipped':
        return <Truck size={16} className="mr-1" />;
      case 'Delivered':
        return <Check size={16} className="mr-1" />;
      case 'Cancelled':
        return <X size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    return (
      (statusFilter === 'All' || order.status === statusFilter) &&
      (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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
            Order Management
          </h1>
          <p className="text-xs md:text-sm tracking-widest max-w-xl mx-auto text-center px-6">
            VIEW AND MANAGE ALL CUSTOMER ORDERS
          </p>
        </motion.div>
      </section>
      
      {/* Dashboard Content */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-medium mb-4">Filter Orders</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Search by order number or customer name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-6 border border-gray-100 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium">All Orders</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Total: {filteredOrders.length}
                </span>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No orders found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-xs text-gray-500">{order.items.length} item(s)</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.shippingAddress.fullName}</div>
                            <div className="text-xs text-gray-500">{order.shippingAddress.phoneNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${order.totalAmount.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye size={18} />
                              </button>
                              {order.status === 'Pending' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'Processing')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Process
                                </button>
                              )}
                              {order.status === 'Processing' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'Shipped')}
                                  className="text-purple-600 hover:text-purple-900"
                                >
                                  Ship
                                </button>
                              )}
                              {order.status === 'Shipped' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Deliver
                                </button>
                              )}
                              {['Pending', 'Processing'].includes(order.status) && (
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to cancel this order?')) {
                                      updateOrderStatus(order._id, 'Cancelled');
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Order Details</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Order Information</h4>
                  <p className="mb-1"><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</p>
                  <p className="mb-1"><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p className="mb-1">
                    <span className="font-medium">Status:</span> 
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p className="mb-1"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Customer Details</h4>
                  <p className="mb-1"><span className="font-medium">Name:</span> {selectedOrder.shippingAddress.fullName}</p>
                  <p className="mb-1"><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phoneNumber}</p>
                  <p className="mb-1"><span className="font-medium">Address:</span> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.pincode}</p>
                </div>
              </div>
              
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Order Items</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.image ? (
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-10 w-10 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/40?text=No+Image';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                                <Package size={16} className="text-gray-400" />
                              </div>
                            )}
                            <div className="text-sm text-gray-900">{item.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total Amount:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Order actions */}
              {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Update Order Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'Pending' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder._id, 'Processing');
                          setShowOrderModal(false);
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Mark as Processing
                      </button>
                    )}
                    {selectedOrder.status === 'Processing' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder._id, 'Shipped');
                          setShowOrderModal(false);
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {selectedOrder.status === 'Shipped' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder._id, 'Delivered');
                          setShowOrderModal(false);
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {['Pending', 'Processing'].includes(selectedOrder.status) && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            updateOrderStatus(selectedOrder._id, 'Cancelled');
                            setShowOrderModal(false);
                          }
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}