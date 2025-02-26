/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import CategoryTabs from '@/app/components/CategoryTabs';
import MarqueeText from '@/app/components/MarqueeText';
import CategoryCard from '@/app/components/CategoryCard';
import FeaturedSection from '@/app/components/FeaturedSection';
import HeroSection from '@/app/components/HeroSection';
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValue, useReducedMotion } from 'framer-motion';

// Your existing product data
const productsData = {
  shampoo: [
    { id: 's1', name: 'Argania Restoration Shampoo', price: 42.00, rating: 4.8, reviewCount: 124, image: 'https://fimgs.net/photogram/p1200/wk/5i/l16A88lG388c3wXV.jpg', category: 'Shampoo' },
    { id: 's2', name: 'Silk Protein Infusion', price: 38.00, rating: 4.7, reviewCount: 98, image: 'https://www.myperfumeshop.com.au/cdn/shop/products/gucci-guilty-edp-travel-set-for-women-gift-set-713740.jpg?v=1671827882&width=1500', category: 'Shampoo' },
    { id: 's3', name: 'Moroccan Clay Purify', price: 45.00, rating: 4.9, reviewCount: 156, image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ae8392108556161.5fc01347d69ff.jpg', category: 'Shampoo' },
    { id: 's4', name: 'Alpine Herb Rejuvenation', price: 41.00, rating: 4.6, reviewCount: 87, image: 'https://th.bing.com/th/id/OIP.a3K1bTK8emJQ_3PJLduGVwHaIK?rs=1&pid=ImgDetMain', category: 'Shampoo' },
  ],
  soaps: [
    { id: 'sp1', name: 'Damascus Rose Body Cleanser', price: 28.00, rating: 4.9, reviewCount: 172, image: 'https://3.bp.blogspot.com/-8r5RwT0VOcE/W9iDrmZzUTI/AAAAAAAAEQI/o_eeaJgreyUR8V1URfEajG-eQuOMdY-NACEwYBhgL/s1600/011.JPG', category: 'Soap' },
    { id: 'sp2', name: 'Neroli & Ylang Exfoliator', price: 32.00, rating: 4.8, reviewCount: 103, image: 'https://i.pinimg.com/originals/54/79/2e/54792e108297c7317a441a830bd9dbf9.jpg', category: 'Soap' },
    { id: 'sp3', name: 'Himalayan Salt Purify Bar', price: 24.00, rating: 4.7, reviewCount: 91, image: 'https://pura.com/cdn/shop/files/EC_1_20_500x.png?v=1662065311', category: 'Soap' },
    { id: 'sp4', name: 'Cedar & Sage Body Wash', price: 36.00, rating: 4.9, reviewCount: 134, image: 'https://th.bing.com/th/id/OIP.uh6TWnaYeHbQvWyey1sEPQHaIy?w=1200&h=1425&rs=1&pid=ImgDetMain', category: 'Soap' },
  ],
  accessories: [
    { id: 'a1', name: 'Olivewood Hair Brush', price: 68.00, rating: 4.9, reviewCount: 76, image: 'https://sothebys-com.brightspotcdn.com/dims4/default/7b25018/2147483647/strip/true/crop/3308x4962+0+0/resize/684x1026!/quality/90/?url=http%3A%2F%2Fsothebys-brightspot.s3.amazonaws.com%2Fdotcom%2F0f%2F74%2F723bb34844c0bcc09dcac8cece8f%2Fsotheby-13.JPG', category: 'Accessory' },
    { id: 'a2', name: 'Sisal Body Scrubber', price: 34.00, rating: 4.7, reviewCount: 64, image: 'https://th.bing.com/th/id/OIP.nVIQV4JpTi4y-s5DdMhUgwHaJQ?pid=ImgDet&w=195&h=243&c=7&dpr=2', category: 'Accessory' },
    { id: 'a3', name: 'Marble Soap Dish', price: 42.00, rating: 4.8, reviewCount: 88, image: 'https://th.bing.com/th/id/OIP.w2hg0T7cg1-KZTdzg2_k7wHaJQ?w=819&h=1024&rs=1&pid=ImgDetMain', category: 'Accessory' },
    { id: 'a4', name: 'Linen Wash Bag', price: 26.00, rating: 4.6, reviewCount: 52, image: 'https://cdn.shopify.com/s/files/1/0424/1457/products/FYB_S2211618.5x11copy_1024x1024.jpg?v=1646947297', category: 'Accessory' },
  ],
};

const categoryData = [
  {
    title: "HAIR CARE",
    description: "Nourishing formulations created with rare botanicals to repair and strengthen every strand.",
    image: "/images/category1.jpg",
    url: "/shop/shampoo"
  },
  {
    title: "BODY CARE",
    description: "Indulgent cleansers and moisturizers enriched with essential oils for silky, radiant skin.",
    image: "/images/category2.jpg",
    url: "/shop/soaps"
  },
  {
    title: "ACCESSORIES",
    description: "Handcrafted tools and objects designed to elevate your daily self-care ritual.",
    image: "/images/category3.jpg",
    url: "/shop/accessories"
  }
];

// Enhanced parallax effect with mobile optimization
const useParallax = (value: MotionValue<number>, distance: number, damping = 25) => {
  const prefersReducedMotion = useReducedMotion();
  const springConfig = {
    stiffness: 80,
    damping,
    mass: 0.5,
    restDelta: 0.001
  };
  
  if (prefersReducedMotion) {
    return useSpring(0, springConfig);
  }
  
  const springValue = useSpring(value, springConfig);
  return useTransform(springValue, [0, 1], [0, distance]);
};

// Elegant scroll-linked animations with mobile consideration
const useSmoothTransform = (value: MotionValue<number>, inputRange: number[], outputRange: number[]) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return useMotionValue(0);
  }
  
  const springValue = useSpring(value, {
    stiffness: 40,
    damping: 25,
    mass: 0.5
  });
  return useTransform(springValue, inputRange, outputRange);
};

// Custom hook for device detection
const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isMobile;
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('shampoo');
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceDetection();
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Refined smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    mass: 0.5,
    restDelta: 0.001
  });

  // Elegant transform values with mobile consideration
  const transformScale = isMobile ? 0.97 : 0.95;
  const rotationScale = isMobile ? 0.5 : 1;

  const heroY = useParallax(smoothProgress, isMobile ? 50 : 150, 30);
  const heroRotateX = useSmoothTransform(smoothProgress, [0, 0.2], [0, -10 * rotationScale]);
  const heroScale = useSmoothTransform(smoothProgress, [0, 0.2], [1, transformScale]);
  
  const collectionsY = useParallax(smoothProgress, isMobile ? 30 : 100, 25);
  const collectionsRotateX = useSmoothTransform(smoothProgress, [0.1, 0.3], [10 * rotationScale, -3 * rotationScale]);
  
  const featuredY = useParallax(smoothProgress, isMobile ? 20 : 80, 20);
  const featuredRotateX = useSmoothTransform(smoothProgress, [0.4, 0.6], [3 * rotationScale, -7 * rotationScale]);

  // Refined floating animation
  const floatingAnimation = isMobile ? {
    y: [0, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {
    y: [0, -10, 0],
    rotateX: [0, 2, 0],
    rotateY: [0, 3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Elegant hover animation variants
  const hoverVariants = {
    desktop: {
      scale: 1.05,
      rotateY: 5,
      z: 100,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    },
    mobile: {
      scale: 1.02,
      transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-[#1A1412] via-[#231815] to-[#1A1412] overflow-hidden"
      style={{ 
        perspective: isMobile ? "1000px" : "2000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Refined noise overlay */}
      <motion.div 
        className="fixed inset-0 bg-[url('/images/noise.png')] mix-blend-overlay pointer-events-none z-10"
        animate={{ 
          opacity: [0.02, 0.03, 0.02],
          transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <Navbar />

      {/* Elegant Hero Section */}
      <motion.div 
        className="relative z-20 pt-8"
        style={{ 
          y: heroY,
          rotateX: heroRotateX,
          scale: heroScale,
          transformStyle: "preserve-3d",
          transformOrigin: "center center"
        }}
      >
        <HeroSection />
      </motion.div>

      {/* Refined Product Categories Section */}
      <motion.section 
        className={`relative py-12 md:py-24 px-4 md:px-8 ${isMobile ? 'mt-8' : ''}`}
        style={{ 
          y: collectionsY,
          rotateX: collectionsRotateX,
          scale: useTransform(smoothProgress, [0.1, 0.3], [0.95, 1]),
          transformStyle: "preserve-3d",
          transformOrigin: "center top"
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#231815] to-transparent"
          style={{
            opacity: useTransform(smoothProgress, [0.1, 0.3], [0, 0.8])
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="text-center text-3xl md:text-4xl font-serif text-amber-50 mb-8 md:mb-16"
          >
            OUR COLLECTION
          </motion.h2>

          <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            style={{ perspective: isMobile ? "1000px" : "1500px" }}
          >
            {productsData[activeCategory as keyof typeof productsData].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.8, 
                    delay: isMobile ? index * 0.1 : index * 0.15,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }
                }}
                whileHover={isMobile ? hoverVariants.mobile : hoverVariants.desktop}
                animate={!prefersReducedMotion && floatingAnimation}
                style={{ transformStyle: "preserve-3d" }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <ProductCard {...product} />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Elegant Marquee Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-[#2C1810] via-[#3C2415] to-[#2C1810] backdrop-blur-sm"
        style={{ 
          y: useParallax(smoothProgress, isMobile ? 20 : 40, 35),
          rotateX: useTransform(smoothProgress, [0.3, 0.5], [3 * rotationScale, -3 * rotationScale])
        }}
      >
        <MarqueeText text="ENJOY 20% OFF ALL PRODUCTS BEFORE CHRISTMAS WITH CODE: HOLIDAY20" />
      </motion.div>

      {/* Mobile-optimized Featured Section */}
      <motion.section 
        className="py-12 md:py-24 relative"
        style={{ 
          y: featuredY,
          rotateX: featuredRotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center"
        }}
      >
        <FeaturedSection />
      </motion.section>

      {/* Refined Category Cards Section */}
      <motion.section 
        className="py-12 md:py-24 px-4 md:px-8 relative bg-[#2A1F1C]"
        style={{ 
          y: useParallax(smoothProgress, isMobile ? 30 : 60, 15),
          transformStyle: "preserve-3d"
        }}
      >
        <div className="max-w-7xl mx-auto relative z-20">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
            style={{ perspective: isMobile ? "1000px" : "1500px" }}
          >
            {categoryData.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 1, 
                    delay: isMobile ? index * 0.1 : index * 0.2,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }
                }}
                whileHover={isMobile ? hoverVariants.mobile : hoverVariants.desktop}
                animate={!prefersReducedMotion && floatingAnimation}
                style={{ transformStyle: "preserve-3d" }}
                className="group"
              >
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Refined Instagram Gallery */}
      <motion.section 
        className="py-8 md:py-16 px-4 md:px-8 relative bg-gradient-to-b from-[#2A1F1C] to-[#1A1412]"
        style={{ 
          y: useParallax(smoothProgress, isMobile ? 20 : 40, 15),
          transformStyle: "preserve-3d"
        }}
      >
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"
          style={{ perspective: isMobile ? "1000px" : "1500px" }}
        >
          {[1, 2, 3, 4].map((item) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1,
                transition: { 
                  duration: 0.8, 
                  delay: item * 0.1,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }
              }}
              whileHover={isMobile ? hoverVariants.mobile : hoverVariants.desktop}
              className="aspect-square relative rounded-lg overflow-hidden group"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image 
                src={`/images/instagram${item}.jpg`}
                alt={`Instagram post ${item}`}
                layout="fill"
                objectFit="cover"
                className="transform transition-all duration-700 group-hover:scale-110"
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/90 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  );
}