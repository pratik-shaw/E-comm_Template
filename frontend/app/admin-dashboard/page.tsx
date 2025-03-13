/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Heart, LogOut, Settings, Users, Package, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function UserDashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      }
      
      // Verify token with backend
      fetchUserData(token);
      
      // If admin, fetch admin specific data
      if (parsedUserInfo.role === 'admin') {
        fetchAdminData(token);
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
      router.push('/login');
    }
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      // Using the correct endpoint from your backend routes
      const response = await fetch('http://localhost:5000/api/auth/current-user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server response error:", response.status, errorData);
        
        if (response.status === 401) {
          // Handle unauthorized - likely invalid/expired token
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          router.push('/login');
          return;
        }
        
        throw new Error(`Server returned ${response.status}: ${errorData?.message || 'Unknown error'}`);
      }
      
      const userData = await response.json();
      setUserInfo(userData);
      
      // Update admin status based on the returned data
      setIsAdmin(userData.role === 'admin');
      
      setError(null);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. Please make sure your backend is running.');
      } else {
        setError(`Error: ${error.message}`);
      }
      
      // Continue with locally stored data
    } finally {
      if (!isAdmin) {
        setLoading(false);
      }
    }
  };

  const fetchAdminData = async (token: string) => {
    try {
      // Using the correct admin endpoint from your backend routes
      const response = await fetch('http://localhost:5000/api/auth/admin-dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server response error:", response.status, errorData);
        
        if (response.status === 401 || response.status === 403) {
          // Handle unauthorized or forbidden
          setError('You do not have permission to access admin features');
          setIsAdmin(false);
        } else {
          throw new Error(`Server returned ${response.status}: ${errorData?.message || 'Unknown error'}`);
        }
      } else {
        const adminData = await response.json();
        setAdminData(adminData);
        setError(null);
      }
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. Please make sure your backend is running.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Dashboard sections for regular users
  const userDashboardSections = [
    {
      title: 'My Profile',
      icon: <User size={20} />,
      onClick: () => console.log('Profile clicked'),
    },
    {
      title: 'My Orders',
      icon: <ShoppingBag size={20} />,
      onClick: () => console.log('Orders clicked'),
    },
    {
      title: 'Wishlist',
      icon: <Heart size={20} />,
      onClick: () => console.log('Wishlist clicked'),
    },
    {
      title: 'Account Settings',
      icon: <Settings size={20} />,
      onClick: () => console.log('Settings clicked'),
    },
    {
      title: 'Sign Out',
      icon: <LogOut size={20} />,
      onClick: handleLogout,
    },
  ];

  // Additional sections for admin users
  const adminDashboardSections = [
    {
      title: 'Manage Users',
      icon: <Users size={20} />,
      onClick: () => console.log('Manage Users clicked'),
    },
    {
      title: 'Manage Orders',
      icon: <ShoppingBag size={20} />,
      onClick: () => console.log('Orders clicked'),
    },
    {
      title: 'Manage Products',
      icon: <Package size={20} />,
      onClick: () => router.push('/edit-products'),
    },
    {
      title: 'Analytics',
      icon: <Activity size={20} />,
      onClick: () => console.log('Analytics clicked'),
    },
    ...userDashboardSections
  ];

  // Choose sections based on role
  const dashboardSections = isAdmin ? adminDashboardSections : userDashboardSections;

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
            Welcome, {userInfo?.name.split(' ')[0]}
          </h1>
          <p className="text-xs md:text-sm tracking-widest max-w-xl mx-auto text-center px-6">
            {isAdmin ? 'ADMIN DASHBOARD' : 'YOUR PERSONAL ACCOUNT DASHBOARD'}
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
                Using locally stored profile data. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Content */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div 
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-50 p-6 rounded-md">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  {isAdmin ? 'Admin Controls' : 'My Account'}
                </h2>
                
                <ul className="space-y-2">
                  {dashboardSections.map((section, index) => (
                    <li key={index}>
                      <button
                        onClick={section.onClick}
                        className="flex items-center text-sm w-full py-2 px-3 hover:bg-gray-100 rounded transition-colors"
                      >
                        <span className="mr-3">{section.icon}</span>
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Main Content */}
            <motion.div 
              className="col-span-1 md:col-span-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 border border-gray-100 rounded-md">
                <h2 className="text-2xl font-medium mb-6">
                  {isAdmin ? 'Admin Overview' : 'Account Overview'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="border border-gray-100 rounded-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Personal Information</h3>
                      <button className="text-xs text-gray-600 hover:text-black">
                        Edit
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-gray-500">Name:</span> {userInfo?.name || "N/A"}
                        </p>
                        <p>
                            <span className="text-gray-500">Email:</span> {userInfo?.email || "N/A"}
                        </p>
                        <p>
                            <span className="text-gray-500">Account Type:</span> {userInfo?.role ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) : "N/A"}
                        </p>
                    </div>
                  </div>
                  
                  {/* Admin Status or Recent Orders */}
                  <div className="border border-gray-100 rounded-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">
                        {isAdmin ? 'Admin Status' : 'Recent Orders'}
                      </h3>
                      {!isAdmin && (
                        <button className="text-xs text-gray-600 hover:text-black">
                          View All
                        </button>
                      )}
                    </div>
                    
                    {isAdmin ? (
                      <div className="text-sm">
                        <p className="text-green-600 mb-2">
                          {adminData?.message || "Admin verification successful"}
                        </p>
                        <p className="text-gray-600">
                          You have full access to admin controls and management features
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 h-28 flex items-center justify-center">
                        <p>You have no recent orders</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Admin Specific Content */}
                {isAdmin && (
                  <div className="mt-6 border border-gray-100 rounded-md p-6">
                    <h3 className="font-medium mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-500 text-xs">Total Users</p>
                        <p className="text-2xl font-medium">--</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-500 text-xs">Total Orders</p>
                        <p className="text-2xl font-medium">--</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-500 text-xs">Total Products</p>
                        <p className="text-2xl font-medium">--</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}