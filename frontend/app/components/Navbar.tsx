/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  
  // Header animation based on scroll
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const headerBackdrop = useTransform(scrollY, [0, 100], [0, 1]);
  
  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  // Check login status on component mount
  useEffect(() => {
    // Check for token instead of just isLoggedIn flag
    const token = localStorage.getItem("userToken");
    
    if (token) {
      setIsLoggedIn(true);
      // Get userId from localStorage if available
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } else {
      setIsLoggedIn(false);
      // Clear userId if not logged in
      setUserId("");
    }
  }, []);

  // Handle cart icon click
  const handleCartClick = () => {
    const token = localStorage.getItem("userToken");
    
    // Get userId either from localStorage or parse from JWT token
    let userId = localStorage.getItem("userId");
    
    // If userId isn't directly stored, try to extract it from the token
    if (!userId && token) {
      try {
        // This is a simple JWT parsing approach - adjust based on your token structure
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const tokenData = JSON.parse(jsonPayload);
        userId = tokenData.id || tokenData._id || tokenData.userId || tokenData.user_id;
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
    
    if (token) {
      // Log for debugging
      console.log("Token found:", token.substring(0, 15) + "...");
      console.log("UserId found:", userId);
      
      if (userId) {
        // Use Next.js router for navigation with the userId parameter
        router.push(`/view-cart/${userId}`);
      } else {
        console.warn("No userId found, redirecting to default cart page");
        router.push('/view-cart');
      }
    } else {
      console.log("No token found, redirecting to login");
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      router.push('/login');
    }
  };

  return (
    <>
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6"
        style={{ 
          opacity: headerOpacity,
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-white backdrop-blur-md"
          style={{ opacity: headerBackdrop }}
        />
        
        <div className="relative flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="w-24 md:w-32">
            <a href="/">
            <h1 className="font-serif text-xl md:text-2xl tracking-widest text-black">MAISON</h1>
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-12 text-sm tracking-wider">
            <a href="/shop" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              SHOP
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/collections" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              COLLECTIONS
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/about" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              JOURNAL
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          
          <div className="flex items-center space-x-6">
            <button className="hidden md:block text-black hover:blur-[0.5px] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            
            {isLoggedIn ? (
              <a href="/user-dashboard" className="hidden md:block text-black hover:blur-[0.5px] transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>
            ) : (
              <a href="/login" className="hidden md:block text-black hover:blur-[0.5px] transition-all text-sm tracking-wider">
                LOGIN
              </a>
            )}
            
            {/* Updated cart icon with onClick handler */}
            <button 
              className="text-black hover:blur-[0.5px] transition-all cursor-pointer"
              onClick={handleCartClick}
              aria-label="View Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 20a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm-7-4h8a2 2 0 002-2V8a2 2 0 00-2-2H8.5L7 3H3a1 1 0 000 2h3l1.5 3H6a2 2 0 00-2 2v6a2 2 0 002 2h2v-1z" />
              </svg>
            </button>
            
            <button 
              className="md:hidden text-black hover:blur-[0.5px] transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-white z-40 px-6 py-24 flex flex-col"
          >
            <div className="flex flex-col space-y-8 text-2xl">
            <a href="/shop" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              SHOP
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/collections" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              COLLECTIONS
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/about" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
              JOURNAL
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            {isLoggedIn ? (
              <>
                <a href="/user-dashboard" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
                  PROFILE
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
                </a>
                {/* Added cart link to mobile menu */}
                <button 
                  onClick={handleCartClick}
                  className="py-2 relative group text-black hover:blur-[0.5px] transition-all text-left"
                >
                  CART
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
                </button>
              </>
            ) : (
              <a href="/login" className="py-2 relative group text-black hover:blur-[0.5px] transition-all">
                LOGIN
                <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
            </div>
            
            <motion.div 
              variants={menuItemVariants}
              className="mt-auto py-6 text-sm tracking-wide text-black"
            >
              © 2025 MAISON. All rights reserved.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}