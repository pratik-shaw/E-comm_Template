'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <footer className="bg-gradient-to-b from-[#1A1412] to-black pt-24 pb-8 px-8 relative">
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
          variants={fadeInUp}
          {...fadeInUp}
        >
          <div className="col-span-1">
            <h3 className="text-2xl font-serif mb-6 text-amber-50">ABNOXIUS</h3>
            <p className="text-gray-400 mb-8 font-light leading-relaxed">
              Premium luxury hair and body care products crafted for the discerning individual.
            </p>
            <div className="flex space-x-6">
              <motion.a 
                href="#" 
                className="text-amber-50 hover:text-amber-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-amber-50 hover:text-amber-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-amber-50 hover:text-amber-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-amber-50 font-medium mb-6 tracking-wider">SHOP</h4>
            <ul className="space-y-4">
              {['Shampoo', 'Soaps', 'Accessories', 'Gift Sets'].map((item) => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={`/shop/${item.toLowerCase()}`} 
                    className="text-gray-400 hover:text-amber-400 transition-colors font-light"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-amber-50 font-medium mb-6 tracking-wider">ABOUT</h4>
            <ul className="space-y-4">
              {[
                { label: 'Our Story', url: '/about-us' },
                { label: 'Ingredients', url: '/ingredients' },
                { label: 'Sustainability', url: '/sustainability' },
                { label: 'Contact Us', url: '/contact' }
              ].map((item) => (
                <motion.li 
                  key={item.label}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={item.url} 
                    className="text-gray-400 hover:text-amber-400 transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-amber-50 font-medium mb-6 tracking-wider">CUSTOMER CARE</h4>
            <ul className="space-y-4">
              {[
                { label: 'Shipping & Returns', url: '/shipping' },
                { label: 'FAQ', url: '/faq' },
                { label: 'Privacy Policy', url: '/privacy-policy' },
                { label: 'Terms & Conditions', url: '/terms' }
              ].map((item) => (
                <motion.li 
                  key={item.label}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={item.url} 
                    className="text-gray-400 hover:text-amber-400 transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="border-t border-gray-800 mt-16 pt-8 text-center"
          variants={fadeInUp}
          {...fadeInUp}
        >
          <p className="text-gray-500 text-sm">
            © {currentYear} Abnoxius. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;