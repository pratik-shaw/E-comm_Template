import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  // Use server-side compatible way to get the current year
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <h3 className="text-xl font-serif mb-6 text-gray-800">ABNOXIUS</h3>
            <p className="text-gray-600 mb-6 font-light">
              Premium luxury hair and body care products crafted for the discerning individual.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-amber-800 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-amber-800 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-amber-800 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-gray-800 mb-6">SHOP</h4>
            <ul className="space-y-3">
              <li><Link href="/shop/shampoo" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Shampoo</Link></li>
              <li><Link href="/shop/soaps" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Soaps</Link></li>
              <li><Link href="/shop/accessories" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Accessories</Link></li>
              <li><Link href="/shop/gift-sets" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Gift Sets</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-gray-800 mb-6">ABOUT</h4>
            <ul className="space-y-3">
              <li><Link href="/about-us" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Our Story</Link></li>
              <li><Link href="/ingredients" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Ingredients</Link></li>
              <li><Link href="/sustainability" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Sustainability</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-gray-800 mb-6">CUSTOMER CARE</h4>
            <ul className="space-y-3">
              <li><Link href="/shipping" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-amber-800 transition-colors font-light">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-amber-800 transition-colors font-light">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 text-center">
          <p className="text-gray-600 text-sm">© {currentYear} Abnoxius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;