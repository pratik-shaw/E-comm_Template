/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

// Define TypeScript interfaces for our data
interface DateRange {
  startDate: string;
  endDate: string;
}

interface BestSellingProduct {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

interface Alert {
  _id: string;
  analyticsId: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  createdAt: string;
}

interface SalesDataPoint {
  date: string;
  sales: number;
}

interface DailyCustomerData {
  date: string;
  new: number;
  returning: number;
}

interface DailyVisit {
  date: string;
  visits: number;
}

interface TrafficData {
  dailyVisits: DailyVisit[];
  sourceBreakdown: Record<string, number>;
}

interface CustomerData {
  newCustomers: number;
  dailyData: DailyCustomerData[];
}

interface SummaryData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  bestSellingProducts: BestSellingProduct[];
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminData {
  message: string;
  // Add any other admin-specific data fields here
}

const Analytics = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Admin authentication states
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Verify admin status with backend
  const verifyAdminAccess = async (token: string) => {
    try {
      // Verify the user's token with the backend
      const response = await axios.get('http://localhost:5000/api/auth/current-user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data || response.data.role !== 'admin') {
        setError('You do not have permission to access admin features');
        setIsAdmin(false);
        router.push('/login');
        return false;
      }
      
      // Store user data
      setUserInfo(response.data);
      setIsAdmin(true);
      
      // Fetch admin-specific data
      await fetchAdminData(token);
      
      return true;
    } catch (error: any) {
      console.error("Error verifying admin access:", error);
      
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setError('Your session has expired. Please log in again.');
        router.push('/login');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access admin features');
        router.push('/login');
      } else if (error.response?.status === 404) {
        setError('API endpoint not found. Please check your API configuration.');
      } else if (error.message.includes('Network Error')) {
        setError('Could not connect to the server. Please check your connection and try again.');
      } else {
        setError(`Error: ${error.message || 'Unknown error occurred'}`);
      }
      
      setIsAdmin(false);
      setIsLoading(false);
      return false;
    }
  };
  
  // Fetch admin-specific data
  const fetchAdminData = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/admin-dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setAdminData(response.data);
      return true;
    } catch (error: any) {
      console.error("Error fetching admin dashboard data:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('You do not have permission to access admin features');
        setIsAdmin(false);
      } else {
        setError(`Error loading admin data: ${error.message || 'Unknown error'}`);
      }
      
      return false;
    }
  };

  // Fetch analytics data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Fetch all required data in parallel
      const [summaryRes, salesRes, customerRes, trafficRes, alertsRes] = await Promise.all([
        axios.get('/api/analytics/summary?period=monthly', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`/api/analytics/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`/api/analytics/customers?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`/api/analytics/traffic?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/analytics/alerts?read=false', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setSummaryData(summaryRes.data.data);
      setSalesData(salesRes.data.data.salesByTime);
      setCustomerData(customerRes.data.data);
      setTrafficData(trafficRes.data.data);
      setAlerts(alertsRes.data.data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching analytics data:', error);
      
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        router.push('/login');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access this data');
      } else {
        setError('Error loading analytics data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (!token || !storedUserInfo) {
      console.log("No token or user info found, redirecting to login");
      router.push('/login');
      return;
    }
    
    const initializeAdmin = async () => {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
        
        // Preliminary role check from local storage
        if (parsedUserInfo.role !== 'admin') {
          console.log("User is not an admin based on local storage, redirecting...");
          setError('Admin access required');
          router.push('/login');
          return;
        }
        
        // Set preliminary admin status (will be verified with backend)
        setIsAdmin(parsedUserInfo.role === 'admin');
        
        // Verify admin status with backend
        const isVerified = await verifyAdminAccess(token);
        
        // Only fetch dashboard data if admin verification was successful
        if (isVerified) {
          fetchData();
        }
      } catch (error: any) {
        console.error("Error in admin initialization:", error);
        setError("Failed to initialize admin view. Please try logging in again.");
        setIsLoading(false);
        router.push('/login');
      }
    };
    
    initializeAdmin();
  }, [router]);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyDateFilter = () => {
    fetchData();
  };

  const handleMarkAlertAsRead = async (analyticsId: string, alertId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await axios.patch(`/api/analytics/alerts/${analyticsId}/${alertId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (error: any) {
      console.error('Error marking alert as read:', error);
      
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        router.push('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  // Handle auth error with retry option
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Error</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
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
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Authorization required screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FiAlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Authorization Required</h2>
          <p className="mb-6 text-gray-600">You need admin privileges to view this page.</p>
          <button 
            onClick={() => router.push('/login')}
            className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Prepare data for pie chart
  const prepareSourceData = () => {
    if (!trafficData || !trafficData.sourceBreakdown) return [];
    
    return Object.keys(trafficData.sourceBreakdown).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: trafficData.sourceBreakdown[key]
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive overview of your store&apos;s performance and insights
          </p>
        </div>

        {/* Date range filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyDateFilter}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Sales */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {summaryData ? formatCurrency(summaryData.totalSales || 0) : '$0.00'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <FiShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {summaryData ? summaryData.totalOrders.toLocaleString() : '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {summaryData ? formatCurrency(summaryData.averageOrderValue || 0) : '$0.00'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <FiUsers className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">New Customers</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {customerData ? customerData.newCustomers.toLocaleString() : '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => formatDate(date)}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Revenue"
                    stroke="#3B82F6"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareSourceData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareSourceData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => (value as number).toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Acquisition */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Acquisition</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerData?.dailyData || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => formatDate(date)}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" name="New Customers" fill="#22C55E" />
                  <Bar dataKey="returning" name="Returning Customers" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Traffic</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trafficData?.dailyVisits || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => formatDate(date)}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => (value as number).toLocaleString()} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    name="Visitors"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Best Sellers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Best Selling Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData?.bestSellingProducts?.map((product, index) => (
                  <tr key={product.productId || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {product.unitsSold.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
                {(!summaryData?.bestSellingProducts || summaryData.bestSellingProducts.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {alerts.length} unread
            </span>
          </div>
          <ul className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <li key={alert._id} className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <FiAlertCircle 
                      className={`h-5 w-5 ${
                        alert.severity === 'high' 
                          ? 'text-red-500' 
                          : alert.severity === 'medium' 
                            ? 'text-yellow-500' 
                            : 'text-blue-500'
                      }`} 
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900 flex justify-between">
                      <span>{alert.message}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        alert.severity === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : alert.severity === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.type}
                      </span>
                      <button
                        onClick={() => handleMarkAlertAsRead(alert.analyticsId, alert._id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {alerts.length === 0 && (
              <li className="py-10 px-4 text-center">
                <p className="text-sm text-gray-500">No unread alerts</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;