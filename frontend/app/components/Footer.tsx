import React from 'react';

const Footer = () => {
  return (
    <footer className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div>
            <h3 className="font-serif text-xl mb-6">MAISON</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Luxury haircare crafted with precision and intention. Each product is a testament to our commitment to excellence.
            </p>
            <div className="flex space-x-4">
              {["instagram", "facebook", "pinterest"].map((social) => (
                <a key={social} href="#" className="text-gray-600 hover:text-black transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="18" y1="6" x2="18" y2="6.01" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {[
            { title: "SHOP", links: ["All Products", "Shampoo", "Conditioner", "Treatments", "Gift Sets"] },
            { title: "COMPANY", links: ["Our Story", "Sustainability", "Careers", "Press"] },
            { title: "SUPPORT", links: ["Contact Us", "FAQs", "Shipping & Returns", "Privacy Policy", "Terms of Service"] }
          ].map((column, index) => (
            <div key={index}>
              <h3 className="font-medium text-sm tracking-wider mb-6">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>© 2025 MAISON. All rights reserved.</div>
          <div className="mt-4 md:mt-0">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;