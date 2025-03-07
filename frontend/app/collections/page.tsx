"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ChevronRight, Plus, Minus, ChevronDown } from "lucide-react";

// Product type definition
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  collection: string;
  gender: "him" | "her" | "unisex";
  description: string;
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

// Collection type definition
interface Collection {
  id: string;
  name: string;
  description: string;
  gender: "him" | "her" | "unisex";
  image: string;
  secondaryImage?: string;
  products: Product[];
}

// Mock collections data
const COLLECTIONS: Collection[] = [
  {
    id: "c1",
    name: "REVERIE",
    description: "A collection of refined formulations inspired by the French Riviera. Notes of citrus and Mediterranean herbs create an invigorating sensory experience.",
    gender: "her",
    image: "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/jewelry/color-blossom/JEWELRY_BLOSSOM_VISUAL_LVCOM_01_DI3.jpg?wid=4096",
    products: [
      {
        id: "p1",
        name: "REVITALIZING HAIR SERUM",
        price: 125,
        category: "Serums",
        collection: "REVERIE",
        gender: "her",
        description: "An intensive treatment that penetrates deep into the hair shaft to restore vitality and shine.",
        images: [
          "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Women_Accessories_WW_HP_Category_Push_DII.jpg?wid=730"
        ],
        isNew: true
      },
      {
        id: "p2",
        name: "HYDRATING SCALP TREATMENT",
        price: 95,
        category: "Treatments",
        collection: "REVERIE",
        gender: "her",
        description: "A luxurious treatment that nourishes the scalp and creates the optimal environment for healthy hair growth.",
        images: [
          "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Women_WSLG_WW_HP_Category_Push_DII.jpg?wid=730"
        ],
        isBestseller: true
      }
    ]
  },
  {
    id: "c2",
    name: "HERITAGE",
    description: "A sophisticated collection that draws inspiration from vintage barbershop traditions. Rich, woody notes evoke timeless masculinity.",
    gender: "him",
    image: "https://www.louisvuitton.com/images/is/image/lv/M_BC_NewFormalFW25_FEV25_01_DII.jpg?wid=4096",
    products: [
      {
        id: "p3",
        name: "VOLUMIZING LUXURY SHAMPOO",
        price: 85,
        category: "Cleansers",
        collection: "HERITAGE",
        gender: "him",
        description: "A sophisticated formula that cleanses while adding body and texture to all hair types.",
        images: [
          "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/men_accessories/Men_Belt_WW_HP_Category_Push_V20240517_DII.jpg?wid=730"
        ]
      },
      {
        id: "p4",
        name: "INTENSIVE REPAIR MASK",
        price: 110,
        category: "Treatments",
        collection: "HERITAGE",
        gender: "him",
        description: "A deeply conditioning treatment that repairs damage and strengthens hair from within.",
        images: [
          "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/perfumes/Perfumes_HP_Category_Push_20241115_DII.jpg?wid=730"
        ]
      }
    ]
  },
  {
    id: "c3",
    name: "ESSENCE",
    description: "A universal collection formulated with pure botanicals and essential oils. The perfect harmony of science and nature.",
    gender: "unisex",
    image: "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/perfumes/Perfumes_HP_Category_Push_20241115_DII.jpg?wid=730",
    products: [
      {
        id: "p5",
        name: "PROTECTIVE STYLING OIL",
        price: 78,
        category: "Oils",
        collection: "ESSENCE",
        gender: "unisex",
        description: "A lightweight oil that protects against heat damage while adding luminous shine.",
        images: [
          "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Men_Bags_WW_HP_Category_Push_DII.jpg?wid=730"
        ],
        isNew: true
      },
      {
        id: "p6",
        name: "DEFINING TEXTURE CREAM",
        price: 68,
        category: "Styling",
        collection: "ESSENCE",
        gender: "unisex",
        description: "A versatile styling cream that adds definition and separation with a natural finish.",
        images: [
          "https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg"
        ],
        isBestseller: true
      }
    ]
  }
];

export default function CollectionsPage() {
  const [activeGender, setActiveGender] = useState<"all" | "him" | "her" | "unisex">("all");
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const heroRef = useRef(null);
  
  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 300], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Filter collections based on gender
  const filteredCollections = activeGender === "all" 
    ? COLLECTIONS 
    : COLLECTIONS.filter(collection => collection.gender === activeGender);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const collectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const productVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light">
      <Navbar />
      
      {/* Hero Section - Optimized for Mobile */}
      <section ref={heroRef} className="h-[60vh] md:h-[80vh] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/accessories/W_BC_EYEWEAR_036_January25_DI3.jpg?wid=4096')] bg-center bg-cover"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center text-white z-10 px-4"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <h1 className="font-serif text-4xl md:text-7xl tracking-wide mb-4 md:mb-6 text-center">THE COLLECTIONS</h1>
          <p className="text-xs md:text-base tracking-widest max-w-xl mx-auto text-center px-6">
            CURATED FORMULATIONS DESIGNED WITH PRECISION AND PURE ARTISTIC VISION
          </p>
        </motion.div>
        
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-10 flex justify-center">
          <motion.div 
            className="w-6 h-10 border border-white/50 rounded-full flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1 h-1.5 bg-white rounded-full"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Filter Navigation - Mobile Dropdown & Desktop Tabs */}
      <section className="py-8 md:py-16 px-6 md:px-12 bg-white">
        <div className="max-w-screen-lg mx-auto">
          {isMobile ? (
            <div className="relative mb-6">
              <button 
                className="w-full py-3 px-4 border border-black flex justify-between items-center text-sm tracking-widest uppercase"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {activeGender === "all" ? "All Collections" : `For ${activeGender}`}
                <ChevronDown size={16} className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-black shadow-lg">
                  {["all", "her", "him", "unisex"].map((gender) => (
                    <button
                      key={gender}
                      className={`w-full text-left px-4 py-3 text-sm tracking-widest uppercase border-b border-gray-200 last:border-0 ${
                        activeGender === gender ? "font-medium bg-gray-50" : ""
                      }`}
                      onClick={() => {
                        setActiveGender(gender as "all" | "him" | "her" | "unisex");
                        setDropdownOpen(false);
                      }}
                    >
                      {gender === "all" ? "All Collections" : `For ${gender}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center space-x-6 md:space-x-12 border-b pb-8">
              {["all", "her", "him", "unisex"].map((gender) => (
                <button
                  key={gender}
                  className={`relative text-sm md:text-base tracking-widest uppercase py-2 ${
                    activeGender === gender ? "font-medium" : ""
                  }`}
                  onClick={() => setActiveGender(gender as "all" | "him" | "her" | "unisex")}
                >
                  {gender === "all" ? "All Collections" : `For ${gender}`}
                  {activeGender === gender && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 w-full h-px bg-black"
                      layoutId="genderIndicator"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Collections - Responsive Layout */}
      <section className="pb-16 md:pb-24 px-4 md:px-12">
        <motion.div 
          className="max-w-screen-xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCollections.map((collection) => (
            <motion.div
              key={collection.id}
              className="mb-16 md:mb-32"
              variants={collectionVariants}
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
                {/* Mobile-first image placement */}
                <motion.div 
                  className="h-[50vh] md:h-[85vh] relative overflow-hidden"
                  initial={{ opacity: 0, x: 0, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div 
                    className="h-full w-full bg-cover bg-center transition-transform duration-700"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  ></div>
                  
                  {collection.secondaryImage && (
                    <motion.div 
                      className="absolute top-4 right-4 w-24 h-24 md:w-64 md:h-64 bg-cover bg-center shadow-xl"
                      initial={{ x: 20, y: -20, opacity: 0 }}
                      whileInView={{ x: 0, y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true, margin: "-50px" }}
                      style={{ backgroundImage: `url(${collection.secondaryImage})` }}
                    ></motion.div>
                  )}
                </motion.div>
                
                <div>
                  <motion.div 
                    className="flex flex-col justify-center h-full py-6 md:py-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="py-2 md:py-8 px-0 md:px-12 lg:px-16">
                      <div className="text-xs tracking-widest text-gray-400 mb-2 uppercase">
                        {collection.gender === "him" ? "For Him" : collection.gender === "her" ? "For Her" : "Unisex"}
                      </div>
                      <h2 className="font-serif text-2xl md:text-5xl mb-4 md:mb-8 tracking-wider">{collection.name}</h2>
                      <p className="mb-6 md:mb-8 leading-relaxed text-gray-600 text-sm md:text-base">
                        {collection.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
                        <motion.button
                          className="py-3 px-4 md:px-6 bg-black text-white text-xs md:text-sm tracking-widest hover:bg-gray-900 transition-colors duration-300 w-full sm:w-auto"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          EXPLORE
                        </motion.button>
                        
                        <motion.button
                          className="py-3 px-4 md:px-6 border border-black text-black text-xs md:text-sm tracking-widest hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center sm:justify-start w-full sm:w-auto"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setExpandedCollection(expandedCollection === collection.id ? null : collection.id)}
                        >
                          {expandedCollection === collection.id ? (
                            <>VIEW LESS <Minus size={14} className="ml-2" /></>
                          ) : (
                            <>VIEW PRODUCTS <Plus size={14} className="ml-2" /></>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Expanded Product List - Mobile Optimized */}
              <AnimatePresence>
                {expandedCollection === collection.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <div className="max-w-screen-lg mx-auto pt-8 md:pt-12 pb-12 md:pb-24 border-t border-gray-200">
                      <h3 className="font-serif text-xl md:text-3xl mb-8 md:mb-12 tracking-wider text-center">COLLECTION PRODUCTS</h3>
                      
                      <motion.div 
                        className="grid md:grid-cols-2 gap-8 md:gap-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {collection.products.map((product) => (
                          <motion.div 
                            key={product.id}
                            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                            variants={productVariants}
                          >
                            <div className="w-full sm:w-32 h-48 sm:h-40 flex-shrink-0 overflow-hidden">
                              <div 
                                className="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                                style={{ backgroundImage: `url(${product.images[0]})` }}
                              ></div>
                            </div>
                            
                            <div className="flex flex-col justify-center flex-grow">
                              <div className="mb-2">
                                {product.isNew && (
                                  <span className="inline-block bg-black text-white text-xs tracking-widest px-2 py-1 mr-2">NEW</span>
                                )}
                                {product.isBestseller && (
                                  <span className="inline-block bg-white text-black text-xs tracking-widest px-2 py-0.5 border border-black">BESTSELLER</span>
                                )}
                              </div>
                              
                              <h4 className="text-base md:text-lg font-medium tracking-wide mb-1">{product.name}</h4>
                              <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">{product.category}</p>
                              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">{product.description}</p>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-sm">${product.price}</span>
                                <motion.button 
                                  className="text-xs tracking-widest flex items-center group"
                                  whileHover={{ x: 5 }}
                                >
                                  VIEW DETAILS 
                                  <ChevronRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Editorial Feature - Mobile Optimized */}
      <section className="py-16 md:py-24 px-4 md:px-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-12">
            <motion.div
              className="col-span-full md:col-span-2 h-[50vh] md:h-[80vh] relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="h-full w-full bg-[url('https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg')] bg-cover bg-center"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="font-serif text-2xl md:text-4xl mb-2 md:mb-4 tracking-wider">THE ART OF COLLECTION</h3>
                <p className="max-w-lg leading-relaxed text-white/80 text-sm md:text-base">
                  Our master craftsmen select only the finest ingredients, combining traditional techniques with cutting-edge innovation.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              className="col-span-full md:col-span-1 flex flex-col justify-center py-8 md:py-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="font-serif text-xl md:text-3xl mb-6 md:mb-8 tracking-wider">THE ARTISAN PROCESS</h3>
              
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h4 className="text-base md:text-lg font-medium tracking-wide mb-2">SOURCING</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    We source rare and precious ingredients from around the world, working directly with local producers who share our commitment to excellence.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base md:text-lg font-medium tracking-wide mb-2">FORMULATION</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Our laboratories combine ancient wisdom with modern science, creating formulations that deliver exceptional results while honoring tradition.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base md:text-lg font-medium tracking-wide mb-2">CRAFTSMANSHIP</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Every detail is perfected by hand, from the precise measurement of ingredients to the final inspection of each product.
                  </p>
                </div>
                
                <motion.button
                  className="py-3 px-6 bg-black text-white text-xs md:text-sm tracking-widest hover:bg-gray-900 transition-colors duration-300 self-start w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  DISCOVER OUR CRAFT
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Subscribe Section - Mobile Optimized */}
      <section className="py-16 md:py-24 px-4 md:px-12 bg-black text-white">
        <div className="max-w-screen-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="font-serif text-2xl md:text-4xl mb-4 md:mb-8 tracking-wider">JOIN THE MAISON</h2>
            <p className="mb-8 md:mb-12 max-w-lg mx-auto text-white/80 text-sm md:text-base">
              Subscribe to receive exclusive updates on new collections, limited edition releases, and personalized invitations to private events.
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 bg-transparent border border-white/30 sm:border-r-0 sm:border-t sm:border-l sm:border-b focus:outline-none focus:border-white text-white placeholder:text-white/50 mb-3 sm:mb-0"
                />
                <button className="px-6 py-3 bg-white text-black text-xs md:text-sm tracking-widest border border-white hover:bg-transparent hover:text-white transition-colors duration-300">
                  SUBSCRIBE
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}