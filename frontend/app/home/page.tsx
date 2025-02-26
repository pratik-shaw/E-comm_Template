"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";



export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeProduct, setActiveProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const productSectionRef = useRef(null);
  const headerRef = useRef(null);
  
  // Products data
  const featuredProducts = [
    { id: 1, name: "ELIXIR N°1", category: "SHAMPOO", image: "/images/product-1.jpg", price: "$120" },
    { id: 2, name: "ESSENCE DE LUXE", category: "CONDITIONER", image: "/images/product-2.jpg", price: "$135" },
    { id: 3, name: "CRÈME SUBLIME", category: "TREATMENT", image: "/images/product-3.jpg", price: "$195" }
  ];
  
  // Collections data
  const collections = [
    { id: "essential", name: "THE ESSENTIALS", description: "Foundation for everyday luxury" },
    { id: "signature", name: "SIGNATURE", description: "Our distinguished classics" },
    { id: "limited", name: "LIMITED EDITION", description: "Exclusive seasonal offerings" }
  ];

  // Horizontal scroll for product gallery
  const { scrollXProgress } = useScroll({
    container: productSectionRef
  });
  
  // Header animation based on scroll
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const headerBackdrop = useTransform(scrollY, [0, 100], [0, 1]);
  
  // Subtle parallax for hero section
  const heroTextY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroImageScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  
  // Product hover animation
  const productHoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  };
  
  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-gray-900 font-light">
      {/* Header */}
      <motion.header 
        ref={headerRef}
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

      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-10">
          <motion.div 
            className="absolute inset-0"
            style={{ scale: heroImageScale }}
          >
            <div className="h-full w-full bg-[url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/accessories/W_BC_FancyAcc_059_January25_DI3.jpg?wid=4096')] bg-center bg-cover"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </motion.div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-white z-20">
          <motion.div 
            className="text-center px-4"
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wide mb-6">THE ART OF ESSENCE</h1>
            <p className="text-sm md:text-base lg:text-lg tracking-widest max-w-xl mx-auto mb-8 font-light">
              LUXURY HAIR CARE CRAFTED WITH PRECISION AND PURE INTENTION
            </p>
            <motion.button 
              className="mt-4 px-8 py-3 border border-white/80 text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              DISCOVER COLLECTION
            </motion.button>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
          <motion.div 
            className="w-6 h-10 border border-white/50 rounded-full flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1 h-1.5 bg-white rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="aspect-[3/4] bg-[url('https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg')] bg-cover bg-center"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-lg"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-12 tracking-wider">THE PHILOSOPHY</h2>
            <p className="mb-6 leading-relaxed">
              At MAISON, we believe in the transformative power of ritual. Each product is meticulously crafted with rare ingredients sourced from around the world, selected for their exceptional purity and efficacy.
            </p>
            <p className="mb-12 leading-relaxed">
              Our commitment to perfection extends beyond formulation to the sensorial experience—the weight of the bottle in your hand, the subtle fragrance that lingers, the texture that transforms under your touch.
            </p>
            <a href="#" className="inline-block text-sm tracking-widest relative group">
              LEARN MORE
              <span className="absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <motion.h2 
            className="font-serif text-3xl md:text-4xl mb-16 md:mb-24 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            SIGNATURE COLLECTION
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group"
              >
                <motion.div 
                  className="aspect-[4/5] mb-6 overflow-hidden"
                  variants={productHoverVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <div className="h-full w-full bg-gray-100 bg-[url('/images/product-placeholder.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                </motion.div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs tracking-wider text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                    <div className="text-sm">{product.price}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 md:mt-24 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <a href="#" className="inline-block px-8 py-3 border border-black text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300">
              VIEW ALL PRODUCTS
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Horizontal Scrolling Gallery */}
      <section className="py-24 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0 opacity-5"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundImage: "url('/images/pattern.svg')", backgroundSize: "cover" }}
        />
        
        <div className="relative z-10">
          <motion.h2 
            className="font-serif text-3xl md:text-4xl mb-12 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            THE EXPERIENCE
          </motion.h2>
          
          <div 
            ref={productSectionRef} 
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth" }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div 
                key={item}
                className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[40vw] h-[70vh] px-4 snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="h-full w-full bg-gray-100 bg-[url('/images/gallery-placeholder.jpg')] bg-cover bg-center"></div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="h-1 bg-gray-200 max-w-screen-lg mx-auto mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="h-full bg-black origin-left"
              style={{ scaleX: scrollXProgress }}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Collections */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <motion.h2 
            className="font-serif text-3xl md:text-4xl mb-16 md:mb-24 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            EXPLORE COLLECTIONS
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group relative bg-gray-50 aspect-[3/4] overflow-hidden"
              >
                <div className="h-full w-full bg-[url('/images/collection-placeholder.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="font-serif text-2xl mb-2 text-white">{collection.name}</h3>
                  <p className="text-sm text-white/80 mb-6">{collection.description}</p>
                  <a href="#" className="inline-block text-sm tracking-widest text-white relative w-fit">
                    DISCOVER
                    <span className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-serif italic mb-12 leading-relaxed">
              &quot;The difference is immediate and profound. After years of searching, I&apos;ve found products that truly understand the relationship between science and luxury.&quot;
            </p>
            <div className="text-sm tracking-widest uppercase">VOGUE MAGAZINE</div>
          </motion.div>
        </div>
      </section>
      
      {/* Journal */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="flex justify-between items-baseline mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-serif text-3xl md:text-4xl tracking-wider">JOURNAL</h2>
            <a href="#" className="hidden md:inline-block text-sm tracking-widest relative group">
              VIEW ALL
              <span className="absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
            </a>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group"
              >
                <div className="aspect-[4/3] overflow-hidden mb-6">
                  <div className="h-full w-full bg-gray-100 bg-[url('/images/journal-placeholder.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                </div>
                <div className="text-xs tracking-wider text-gray-500 mb-2">BEAUTY RITUALS</div>
                <h3 className="font-serif text-xl mb-3 group-hover:underline">The Science of Luxury: Understanding Molecular Haircare</h3>
                <p className="text-sm text-gray-600 line-clamp-2">Discover the intricate balance of science and luxury that defines our approach to haircare, with insights from our lead formulator...</p>
              </motion.a>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center md:hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <a href="#" className="inline-block text-sm tracking-widest relative">
              VIEW ALL JOURNAL ENTRIES
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-8 tracking-wider">SUBSCRIBE</h2>
            <p className="mb-12 max-w-lg mx-auto">Join our community and be the first to discover new arrivals, exclusive offers, and insights into the art of luxury haircare.</p>
            
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 bg-white border-t border-l border-b border-black focus:outline-none"
                />
                <button className="px-6 py-3 bg-black text-white text-sm tracking-widest border border-black hover:bg-white hover:text-black transition-colors duration-300">
                  SUBSCRIBE
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
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
    </div>
  );
}