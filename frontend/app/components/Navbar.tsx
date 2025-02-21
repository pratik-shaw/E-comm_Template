// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
    <nav className={`fixed w-full z-50 px-8 py-6 transition-all duration-300 ${
      scrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex space-x-8 items-center">
          <Link href="/shop" className="text-gray-800 font-light hover:text-amber-800 transition-colors">
            SHOP
          </Link>
          <Link href="/about-us" className="text-gray-800 font-light hover:text-amber-800 transition-colors">
            ABOUT US
          </Link>
          <Link href="/wash-and-learn" className="text-gray-800 font-light hover:text-amber-800 transition-colors">
            WASH & LEARN
          </Link>
        </div>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-serif tracking-wider text-gray-900">ABNOXIUS</h1>
        </Link>

        <div className="flex space-x-6 items-center">
          <button className="text-gray-800 hover:text-amber-800 transition-colors">
            <Search size={20} />
          </button>
          <button className="text-gray-800 hover:text-amber-800 transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;