'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-md'
            : 'bg-gradient-to-b from-black/50 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-amber-50 hover:text-amber-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8 items-center">
              <Link 
                href="/shop" 
                className="text-amber-50 text-sm tracking-wider hover:text-amber-400 transition-colors"
              >
                SHOP
              </Link>
              <Link 
                href="/about-us" 
                className="text-amber-50 text-sm tracking-wider hover:text-amber-400 transition-colors"
              >
                ABOUT US
              </Link>
              <Link 
                href="/wash-and-learn" 
                className="text-amber-50 text-sm tracking-wider hover:text-amber-400 transition-colors"
              >
                WASH & LEARN
              </Link>
            </div>

            {/* Logo */}
            <Link 
              href="/" 
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <motion.h1 
                className="text-2xl font-serif tracking-wider text-amber-50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                ABNOXIUS
              </motion.h1>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-amber-50 hover:text-amber-400 transition-colors">
                <Search size={20} />
              </button>
              <button className="text-amber-50 hover:text-amber-400 transition-colors">
                <User size={20} />
              </button>
              <button className="text-amber-50 hover:text-amber-400 transition-colors">
                <ShoppingBag size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-lg z-40 lg:hidden"
          >
            <div className="py-8 px-6 space-y-6">
              <Link 
                href="/shop" 
                className="block text-amber-50 text-lg tracking-wider hover:text-amber-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                SHOP
              </Link>
              <Link 
                href="/about-us" 
                className="block text-amber-50 text-lg tracking-wider hover:text-amber-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT US
              </Link>
              <Link 
                href="/wash-and-learn" 
                className="block text-amber-50 text-lg tracking-wider hover:text-amber-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                WASH & LEARN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;