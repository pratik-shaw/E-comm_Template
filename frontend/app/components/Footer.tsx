import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerColumns = [
    { 
      title: "SHOP", 
      links: [
        { name: "All Products", href: "/shop" },
        { name: "Shampoo", href: "/shop/shampoo" },
        { name: "Conditioner", href: "/shop/conditioner" },
        { name: "Treatments", href: "/shop/treatments" },
        { name: "Gift Sets", href: "/shop/gift-sets" }
      ] 
    },
    { 
      title: "COMPANY", 
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" }
      ] 
    },
    { 
      title: "SUPPORT", 
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
        { name: "Shipping & Returns", href: "/shipping-returns" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" }
      ] 
    }
  ];
  
  const socialLinks = [
    { name: "instagram", href: "https://instagram.com", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="18" y1="6" x2="18" y2="6.01" />
      </svg>
    )},
    { name: "facebook", href: "https://facebook.com", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    )},
    { name: "pinterest", href: "https://pinterest.com", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    )}
  ];

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
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {footerColumns.map((column, index) => (
            <div key={index}>
              <h3 className="font-medium text-sm tracking-wider mb-6">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <a className="text-sm text-gray-600 hover:text-black transition-colors">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>© {currentYear} MAISON. All rights reserved.</div>
          <div className="mt-4 md:mt-0">
            <Link href="/privacy">
              <a className="hover:text-black transition-colors">Privacy Policy</a>
            </Link>
            <span className="mx-2">·</span>
            <Link href="/terms">
              <a className="hover:text-black transition-colors">Terms of Service</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;