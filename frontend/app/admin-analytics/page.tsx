/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types based on your Analytics model
interface SalesData {
  daily: number;
  weekly: number;
  monthly: number;
}

interface OrderData {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  refunded: number;
}

interface ProductView {
  productId: string;
  name: string;
  views: number;
}

interface BestSeller {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

interface TopLocation {
  location: string;
  orderCount: number;
}

interface PaymentMethod {
  method: string;
  count: number;
  amount: number;
}

interface TrafficSource {
  source: string;
  count: number;
}

interface AnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  bestSellingProducts: BestSeller[];
  lowStockProducts: any[];
  topLocations: TopLocation[];
  paymentMethodBreakdown: PaymentMethod[];
}

interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  salesByTime: {
    date: string;
    sales: number;
    orders: number;
  }[];
}

interface TrafficInsights {
  totalVisits: number;
  sourceBreakdown: {
    direct: number;
    social: number;
    organic: number;
    referral: number;
    email: number;
    other: number;
  };
  dailyVisits: {
    date: string;
    visits: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [trafficInsights, setTrafficInsights] = useState<TrafficInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data for demo/development until API is ready
  const sampleSummary: AnalyticsSummary = {
    totalSales: 124580,
    totalOrders: 1876,
    totalCustomers: 956,
    averageOrderValue: 66.41,
    conversionRate: 3.2,
    bestSellingProducts: [
      { productId: "1", name: "Product A", unitsSold: 245, revenue: 14700 },
      { productId: "2", name: "Product B", unitsSold: 187, revenue: 9350 },
      { productId: "3", name: "Product C", unitsSold: 156, revenue: 7800 },
      { productId: "4", name: "Product D", unitsSold: 134, revenue: 6700 },
      { productId: "5", name: "Product E", unitsSold: 89, revenue: 4450 }
    ],
    lowStockProducts: [],
    topLocations: [
      { location: "New York", orderCount: 342 },
      { location: "Los Angeles", orderCount: 253 },
      { location: "Chicago", orderCount: 184 },
      { location: "Houston", orderCount: 142 },
      { location: "Miami", orderCount: 98 }
    ],
    paymentMethodBreakdown: [
      { method: "Credit Card", count: 1243, amount: 82450 },
      { method: "PayPal", count: 425, amount: 28360 },
      { method: "Bank Transfer", count: 154, amount: 10230 },
      { method: "Crypto", count: 54, amount: 3540 }
    ]
  };

  const sampleSalesMetrics: SalesMetrics = {
    totalSales: 124580,
    totalOrders: 1876,
    averageOrderValue: 66.41,
    conversionRate: 3.2,
    salesByTime: [
      { date: "Jan 1", sales: 4500, orders: 68 },
      { date: "Jan 2", sales: 4200, orders: 62 },
      { date: "Jan 3", sales: 5100, orders: 75 },
      { date: "Jan 4", sales: 4800, orders: 71 },
      { date: "Jan 5", sales: 5400, orders: 82 },
      { date: "Jan 6", sales: 4900, orders: 74 },
      { date: "Jan 7", sales: 5200, orders: 78 }
    ]
  };

  const sampleTrafficInsights: TrafficInsights = {
    totalVisits: 28450,
    sourceBreakdown: {
      direct: 8535,
      social: 5690,
      organic: 7112,
      referral: 4267,
      email: 2276,
      other: 570
    },
    dailyVisits: []
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Try to fetch from the API
        let summaryData, salesData, trafficData;
        try {
          // Fetch summary data
          const summaryRes = await fetch(`/api/analytics/summary?period=${period}`);
          if (!summaryRes.ok) throw new Error(`HTTP error! status: ${summaryRes.status}`);
          summaryData = await summaryRes.json();
          
          // Fetch sales metrics
          const salesRes = await fetch('/api/analytics/sales');
          if (!salesRes.ok) throw new Error(`HTTP error! status: ${salesRes.status}`);
          salesData = await salesRes.json();
          
          // Fetch traffic insights
          const trafficRes = await fetch('/api/analytics/traffic');
          if (!trafficRes.ok) throw new Error(`HTTP error! status: ${trafficRes.status}`);
          trafficData = await trafficRes.json();
          
          if (summaryData.success) setSummary(summaryData.data);
          if (salesData.success) setSalesMetrics(salesData.data);
          if (trafficData.success) setTrafficInsights(trafficData.data);
        } catch (apiError) {
          console.warn('API fetch failed, using sample data:', apiError);
          
          // Fall back to sample data
          setSummary(sampleSummary);
          setSalesMetrics(sampleSalesMetrics);
          setTrafficInsights(sampleTrafficInsights);
          
          // Only show error if you want to, commented out to show the UI with sample data
          // setError(`API not ready: ${apiError.message}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in analytics page:', err);
        setError('Failed to load analytics data');
        
        // Fall back to sample data even on serious errors
        setSummary(sampleSummary);
        setSalesMetrics(sampleSalesMetrics);
        setTrafficInsights(sampleTrafficInsights);
        
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  // Prepare chart data for payment methods
  const paymentMethodChartData = summary?.paymentMethodBreakdown.map(method => ({
    name: method.method,
    value: method.amount
  })) || [];

  // Prepare chart data for traffic
  const trafficSourceData = trafficInsights ? [
    { name: 'Direct', value: trafficInsights.sourceBreakdown.direct },
    { name: 'Social', value: trafficInsights.sourceBreakdown.social },
    { name: 'Organic', value: trafficInsights.sourceBreakdown.organic },
    { name: 'Referral', value: trafficInsights.sourceBreakdown.referral },
    { name: 'Email', value: trafficInsights.sourceBreakdown.email },
    { name: 'Other', value: trafficInsights.sourceBreakdown.other }
  ] : [];

  // Define some colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
            Admin Analytics Dashboard
          </h1>
          <p className="text-xs md:text-sm tracking-widest max-w-xl mx-auto text-center px-6">
            MONITOR YOUR BUSINESS PERFORMANCE
          </p>
        </motion.div>
      </section>
      
      {/* Dashboard Content */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Period selector */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-medium mb-4">Time Period</h2>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${period === 'daily' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setPeriod('daily')}
                >
                  Daily
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${period === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setPeriod('weekly')}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${period === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setPeriod('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Sales</h3>
                  <p className="text-2xl font-bold text-gray-800">${summary?.totalSales.toLocaleString()}</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                  <p className="text-2xl font-bold text-gray-800">{summary?.totalOrders.toLocaleString()}</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Customers</h3>
                  <p className="text-2xl font-bold text-gray-800">{summary?.totalCustomers.toLocaleString()}</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Avg. Order Value</h3>
                  <p className="text-2xl font-bold text-gray-800">${summary?.averageOrderValue.toFixed(2)}</p>
                </motion.div>
              </motion.div>
              
              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sales chart */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesMetrics?.salesByTime || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#0088FE" name="Sales ($)" />
                        <Line type="monotone" dataKey="orders" stroke="#00C49F" name="Orders" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                {/* Traffic sources */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Traffic Sources</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {trafficSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
              
              {/* Bottom row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Best selling products */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Best Selling Products</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={summary?.bestSellingProducts || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="unitsSold" fill="#8884d8" name="Units Sold" />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                {/* Payment methods */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {paymentMethodChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
              
              {/* Top locations table */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow border border-gray-100"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-4">Top Customer Locations</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {summary?.topLocations.map((location, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.orderCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
// this route is still not protected, so any one can access it.
// make sure you protect it in the future so the analytics data can be accessed only by the admin.