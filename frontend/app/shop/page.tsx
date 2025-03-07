/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ChevronDown, Filter, X, ShoppingBag } from "lucide-react";

// Product type definition
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

// Mock products data
const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "REVITALIZING HAIR SERUM",
    price: 125,
    category: "Serums",
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
    images: [
      "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Women_WSLG_WW_HP_Category_Push_DII.jpg?wid=730"
    ],
    isBestseller: true
  },
  {
    id: "p3",
    name: "VOLUMIZING LUXURY SHAMPOO",
    price: 85,
    category: "Cleansers",
    images: [
      "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/men_accessories/Men_Belt_WW_HP_Category_Push_V20240517_DII.jpg?wid=730"
    ]
  },
  {
    id: "p4",
    name: "INTENSIVE REPAIR MASK",
    price: 110,
    category: "Treatments",
    images: [
      "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/perfumes/Perfumes_HP_Category_Push_20241115_DII.jpg?wid=730"
    ]
  },
  {
    id: "p5",
    name: "PROTECTIVE STYLING OIL",
    price: 78,
    category: "Oils",
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
    images: [
      "https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg"
    ],
    isBestseller: true
  },
  {
    id: "p7",
    name: "OVERNIGHT REJUVENATION SERUM",
    price: 135,
    category: "Serums",
    images: [
      "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/accessories/W_BC_EYEWEAR_036_January25_DI3.jpg?wid=4096"
    ]
  },
  {
    id: "p8",
    name: "SIGNATURE FRAGRANCE HAIR MIST",
    price: 90,
    category: "Fragrances",
    images: [
      "https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/perfumes/Perfumes_HP_Category_Push_20241115_DII.jpg?wid=730"
    ]
  }
];

// Available categories for filtering
const CATEGORIES = ["All", "Serums", "Treatments", "Cleansers", "Oils", "Styling", "Fragrances"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const heroRef = useRef(null);
  const scrollRef = useRef(null);

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 300], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Filter products based on category
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory, products]);

  // Sort products
  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    
    switch (sortBy) {
      case "price-low":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
        break;
      case "bestsellers":
        sortedProducts.sort((a, b) => (a.isBestseller === b.isBestseller) ? 0 : a.isBestseller ? -1 : 1);
        break;
      default:
        // Featured - default sorting
        break;
    }
    
    setFilteredProducts(sortedProducts);
  }, [sortBy]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-dropdown') && showSortMenu) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu]);

  // Scroll to products when selecting a category on mobile
  const scrollToProducts = () => {
    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle category selection on mobile
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setShowFilters(false);
    scrollToProducts();
  };

  // Product card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="h-[50vh] sm:h-[60vh] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/accessories/W_BC_EYEWEAR_036_January25_DI3.jpg?wid=4096')] bg-center bg-cover"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center text-white z-10 px-4"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl tracking-wide mb-4 sm:mb-6 text-center">THE COLLECTION</h1>
          <p className="text-xs sm:text-sm md:text-base tracking-widest max-w-xl mx-auto text-center">
            DISCOVER THE ARTISTRY OF PREMIUM HAIR CARE, METICULOUSLY CRAFTED FOR EXCEPTIONAL RESULTS
          </p>
        </motion.div>
      </section>

      {/* Filter and Sort Section */}
      <section ref={scrollRef} className="py-4 sm:py-8 md:py-12 px-4 sm:px-6 md:px-12 bg-white sticky top-0 z-30 border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center gap-3 sm:gap-6">
            {/* Mobile Filter Button */}
            <button 
              className="md:hidden flex items-center gap-1 text-xs sm:text-sm tracking-widest"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X size={14} /> : <Filter size={14} />}
              {showFilters ? "CLOSE" : "FILTER"}
            </button>
            
            {/* Product Count - Mobile */}
            <div className="text-xs sm:text-sm tracking-widest md:hidden">
              {filteredProducts.length} PRODUCTS
            </div>
            
            {/* Categories - Desktop */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 overflow-x-auto hide-scrollbar">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`text-sm tracking-widest relative whitespace-nowrap ${
                    activeCategory === category ? "font-medium" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.toUpperCase()}
                  {activeCategory === category && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 w-full h-px bg-black"
                      layoutId="categoryIndicator"
                    />
                  )}
                </button>
              ))}
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative group sort-dropdown">
              <button 
                className="flex items-center gap-1 text-xs sm:text-sm tracking-widest"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <span className="hidden xs:inline">SORT BY:</span> {sortBy.replace("-", " ").toUpperCase()}
                <ChevronDown size={14} className={`transition-transform duration-300 ${showSortMenu ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-40 sm:w-48 bg-white shadow-md z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {["featured", "price-low", "price-high", "newest", "bestsellers"].map((option) => (
                      <button
                        key={option}
                        className={`block w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 ${
                          sortBy === option ? "font-medium" : ""
                        }`}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortMenu(false);
                        }}
                      >
                        {option.replace("-", " ").toUpperCase()}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Mobile Categories */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="md:hidden mt-4 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`text-xs sm:text-sm tracking-widest py-2 border ${
                      activeCategory === category
                        ? "border-black bg-black text-white"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.toUpperCase()}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Count - Desktop */}
            <h2 className="hidden md:block text-sm tracking-widest mb-8">
              {filteredProducts.length} PRODUCTS
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-3 sm:mb-4">
                    <div 
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    ></div>
                    
                    {/* Quick shop overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100">
                      <button className="mb-4 sm:mb-6 px-3 sm:px-6 py-1 sm:py-2 bg-white text-black text-xs sm:text-sm tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                        <span className="hidden xs:inline">QUICK VIEW</span>
                        <ShoppingBag size={16} className="xs:hidden" />
                      </button>
                    </div>
                    
                    {/* Product tags */}
                    {(product.isNew || product.isBestseller) && (
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        {product.isNew && (
                          <div className="bg-black text-white text-[10px] xs:text-xs tracking-widest px-2 sm:px-3 py-1 mb-1 sm:mb-2">
                            NEW
                          </div>
                        )}
                        {product.isBestseller && (
                          <div className="bg-white text-black text-[10px] xs:text-xs tracking-widest px-2 sm:px-3 py-1 border border-black">
                            BESTSELLER
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs sm:text-sm tracking-wide mb-1">{product.name}</h3>
                      <p className="text-[10px] xs:text-xs text-gray-500 tracking-wide">{product.category}</p>
                    </div>
                    <p className="text-xs sm:text-sm">${product.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center"
          >
            <div className="aspect-square bg-[url('https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg')] bg-cover bg-center"></div>
            
            <div className="text-center md:text-left px-2 sm:px-4 md:px-8 lg:px-16">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8 tracking-wider">THE SIGNATURE COLLECTION</h2>
              <p className="mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                Our most coveted formulations, curated to deliver exceptional results. Each product in this collection represents the pinnacle of luxury haircare innovation.
              </p>
              <motion.button 
                className="px-6 sm:px-8 py-2 sm:py-3 border border-black text-xs sm:text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                DISCOVER
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* As Seen In */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12 md:mb-16 tracking-wider text-center">AS SEEN IN</h2>
            
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-12 items-center">
              <div className="text-center text-gray-400 text-base sm:text-lg md:text-xl font-serif">VOGUE</div>
              <div className="text-center text-gray-400 text-base sm:text-lg md:text-xl font-serif">HARPER&apos;S</div>
              <div className="text-center text-gray-400 text-base sm:text-lg md:text-xl font-serif">ELLE</div>
              <div className="text-center text-gray-400 text-base sm:text-lg md:text-xl font-serif">VANITY FAIR</div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Add global styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 480px) {
          .xs\\:hidden {
            display: none;
          }
          .xs\\:inline {
            display: inline;
          }
        }
        @media (min-width: 481px) {
          .xs\\:hidden {
            display: inline;
          }
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}