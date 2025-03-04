"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
            <h1 className="font-serif text-xl md:text-2xl tracking-widest">MAISON</h1>
          </div>
          
          <nav className="hidden md:flex space-x-12 text-sm tracking-wider">
            <a href="#" className="py-2 relative group">
              SHOP
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="py-2 relative group">
              COLLECTIONS
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="py-2 relative group">
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="py-2 relative group">
              JOURNAL
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          
          <div className="flex items-center space-x-6">
            <button className="hidden md:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 20a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm-7-4h8a2 2 0 002-2V8a2 2 0 00-2-2H8.5L7 3H3a1 1 0 000 2h3l1.5 3H6a2 2 0 00-2 2v6a2 2 0 002 2h2v-1z" />
              </svg>
            </button>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              {["SHOP", "COLLECTIONS", "ABOUT", "JOURNAL"].map((item, index) => (
                <motion.a
                  key={index}
                  href="#"
                  variants={menuItemVariants}
                  className="border-b border-gray-100 pb-2"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            <motion.div 
              variants={menuItemVariants}
              className="mt-auto py-6 text-sm tracking-wide opacity-70"
            >
              © 2025 MAISON. All rights reserved.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}