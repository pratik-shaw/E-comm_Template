/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 300], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Timeline scroll animation
  const { scrollYProgress: timelineScrollProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  
  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };
  
  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const timelineItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light">
      <Navbar />
      
      {/* Hero Section - Mobile optimized height */}
      <section ref={heroRef} className="h-[80vh] md:h-[85vh] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[url('https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg')] bg-center bg-cover"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center text-white z-10 px-4"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <h1 className="font-serif text-4xl md:text-7xl tracking-wide mb-6 text-center">OUR LEGACY</h1>
          <p className="text-xs md:text-base tracking-widest max-w-xl mx-auto text-center px-4 md:px-6">
            CRAFTING EXCELLENCE THROUGH GENERATIONS OF ARTISANAL MASTERY
          </p>
        </motion.div>
        
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <motion.div 
            className="w-6 h-10 border border-white/50 rounded-full flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1 h-1.5 bg-white rounded-full"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Brand Story - Improved mobile spacing */}
      <section className="py-16 md:py-24 px-4 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-24">
            <motion.div
              className="flex flex-col justify-center"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 className="font-serif text-2xl md:text-5xl mb-6 md:mb-10 tracking-wider">THE ARTISANAL HERITAGE</h2>
              <p className="mb-6 md:mb-8 leading-relaxed text-gray-600">
                Founded in 2005, our maison has cultivated an unwavering commitment to excellence. Through meticulous attention to detail and respect for traditional craftsmanship, we have established a legacy defined by sophistication and timeless elegance.
              </p>
              <p className="leading-relaxed text-gray-600">
                Each creation represents the culmination of our expertise—a harmonious blend of heritage techniques and forward-thinking innovation. Our artisans bring decades of experience to their work, ensuring that every product bears the distinctive mark of human touch.
              </p>
            </motion.div>
            
            <motion.div
              className="h-[50vh] md:h-[70vh] relative overflow-hidden"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div 
                className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/jewelry/color-blossom/JEWELRY_BLOSSOM_VISUAL_LVCOM_01_DI3.jpg?wid=4096')" }}
              ></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Philosophy Section - Mobile optimized spacing */}
      <section className="py-16 md:py-24 px-4 md:px-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-24">
            <motion.div
              className="h-[50vh] md:h-[70vh] relative overflow-hidden order-2 md:order-1"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div 
                className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('https://www.louisvuitton.com/images/is/image/lv/M_BC_NewFormalFW25_FEV25_01_DII.jpg?wid=4096')" }}
              ></div>
            </motion.div>
            
            <motion.div
              className="flex flex-col justify-center order-1 md:order-2"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="text-xs tracking-widest text-gray-400 mb-2 uppercase">
                Our Philosophy
              </div>
              <h2 className="font-serif text-2xl md:text-5xl mb-6 md:mb-10 tracking-wider">GUIDED BY EXCELLENCE</h2>
              
              <div className="space-y-6 md:space-y-10">
                <div>
                  <h3 className="text-lg md:text-xl font-medium tracking-wide mb-2 md:mb-3">UNCOMPROMISING QUALITY</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We source only the finest materials and employ precise techniques to create products of exceptional caliber. Every detail is carefully considered and executed to perfection.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg md:text-xl font-medium tracking-wide mb-2 md:mb-3">ARTISANAL CRAFTSMANSHIP</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our master artisans bring generations of expertise to their craft, combining time-honored techniques with innovative approaches to create products that transcend trends.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg md:text-xl font-medium tracking-wide mb-2 md:mb-3">SUSTAINABLE LUXURY</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our commitment to ethical practices and environmental stewardship informs every aspect of our process—from responsible sourcing to thoughtful production methods.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Timeline Section - Enhanced scroll animations */}
      <section className="py-16 md:py-24 px-4 md:px-12" ref={timelineRef}>
        <div className="max-w-screen-lg mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-20"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="font-serif text-2xl md:text-5xl mb-4 md:mb-6 tracking-wider">OUR JOURNEY</h2>
            <p className="max-w-2xl mx-auto text-gray-600 px-2">
              Tracing our evolution from a single artisan&apos;s vision to a globally recognized maison dedicated to exceptional quality and timeless elegance.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline progress indicator */}
            <motion.div 
              className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-black z-10"
              style={{ 
                height: useTransform(timelineScrollProgress, [0, 1], ["0%", "100%"]),
                originY: "top"
              }}
            ></motion.div>
            
            {/* Timeline line background */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 transform md:translate-x-[-0.5px]"></div>
            
            {/* Timeline items */}
            <div className="space-y-16 md:space-y-24">
              <motion.div 
                className="relative" 
                variants={timelineItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex flex-col md:flex-row items-start">
                  <div className="pl-8 md:pl-0 md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                    <div className="text-sm md:text-base font-medium tracking-widest mb-2">2005</div>
                    <h3 className="text-xl md:text-2xl font-serif mb-3">THE BEGINNING</h3>
                    <p className="text-gray-600">
                      Our founder establishes the maison with a vision to create luxurious products that honor traditional craftsmanship while embracing contemporary aesthetics.
                    </p>
                  </div>
                  
                  <motion.div 
                    className="absolute left-0 md:left-1/2 w-4 h-4 bg-black rounded-full transform top-0 md:translate-x-[-2px] z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                  ></motion.div>
                  
                  <div className="pl-8 md:pl-12 md:w-1/2">
                    <div className="w-full h-40 md:h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Women_Accessories_WW_HP_Category_Push_DII.jpg?wid=730')" }}></div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative" 
                variants={timelineItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex flex-col md:flex-row items-start">
                  <div className="order-2 md:order-1 pl-8 md:pl-0 md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                    <div className="w-full h-40 md:h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/men_accessories/Men_Belt_WW_HP_Category_Push_V20240517_DII.jpg?wid=730')" }}></div>
                  </div>
                  
                  <motion.div 
                    className="absolute left-0 md:left-1/2 w-4 h-4 bg-black rounded-full transform top-0 md:translate-x-[-2px] z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                  ></motion.div>
                  
                  <div className="order-1 md:order-2 pl-8 md:pl-12 md:w-1/2">
                    <div className="text-sm md:text-base font-medium tracking-widest mb-2">2010</div>
                    <h3 className="text-xl md:text-2xl font-serif mb-3">GLOBAL EXPANSION</h3>
                    <p className="text-gray-600">
                      With growing recognition, we establish our presence in key international markets, bringing our vision of artisanal luxury to discerning clientele worldwide.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative" 
                variants={timelineItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex flex-col md:flex-row items-start">
                  <div className="pl-8 md:pl-0 md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                    <div className="text-sm md:text-base font-medium tracking-widest mb-2">2015</div>
                    <h3 className="text-xl md:text-2xl font-serif mb-3">NEW HORIZONS</h3>
                    <p className="text-gray-600">
                      Embracing innovation while honoring tradition, we introduce pioneering formulations and techniques that set new standards in the luxury sector.
                    </p>
                  </div>
                  
                  <motion.div 
                    className="absolute left-0 md:left-1/2 w-4 h-4 bg-black rounded-full transform top-0 md:translate-x-[-2px] z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                  ></motion.div>
                  
                  <div className="pl-8 md:pl-12 md:w-1/2">
                    <div className="w-full h-40 md:h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/perfumes/Perfumes_HP_Category_Push_20241115_DII.jpg?wid=730')" }}></div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative" 
                variants={timelineItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex flex-col md:flex-row items-start">
                  <div className="order-2 md:order-1 pl-8 md:pl-0 md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                    <div className="w-full h-40 md:h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Men_Bags_WW_HP_Category_Push_DII.jpg?wid=730')" }}></div>
                  </div>
                  
                  <motion.div 
                    className="absolute left-0 md:left-1/2 w-4 h-4 bg-black rounded-full transform top-0 md:translate-x-[-2px] z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                  ></motion.div>
                  
                  <div className="order-1 md:order-2 pl-8 md:pl-12 md:w-1/2">
                    <div className="text-sm md:text-base font-medium tracking-widest mb-2">TODAY</div>
                    <h3 className="text-xl md:text-2xl font-serif mb-3">THE CONTINUUM</h3>
                    <p className="text-gray-600">
                      We continue our pursuit of excellence, guided by our founding principles while embracing responsible practices that ensure our legacy endures for generations to come.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ateliers Section - Mobile optimized */}
      <section className="py-16 md:py-24 px-4 md:px-12 bg-black text-white">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-20"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="font-serif text-2xl md:text-5xl mb-4 md:mb-6 tracking-wider">OUR ATELIERS</h2>
            <p className="max-w-2xl mx-auto text-white/80 px-2">
              Where tradition meets innovation—our ateliers serve as the beating heart of our maison, where master craftsmen transform vision into reality.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <motion.div 
              className="relative overflow-hidden h-[50vh] md:h-[60vh] group"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Women_WSLG_WW_HP_Category_Push_DII.jpg?wid=730')" }}
              ></div>
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl mb-2 tracking-wider">PARIS</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Our historic flagship atelier where our most exclusive creations are conceived and crafted by hand.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden h-[50vh] md:h-[60vh] group"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/accessories/W_BC_EYEWEAR_036_January25_DI3.jpg?wid=4096')" }}
              ></div>
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl mb-2 tracking-wider">MILAN</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Where time-honored Italian craftsmanship informs our approach to texture, form, and composition.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden h-[50vh] md:h-[60vh] group"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://www.givenchy.com/coremedia/resource/blob/1692686/f022fe53c7e2c992d7d2ddf32d4ade6e/givenchy-2025-campaign-4x5-15-data.jpg')" }}
              ></div>
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl mb-2 tracking-wider">TOKYO</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Our innovation center where tradition meets cutting-edge technology to push the boundaries of luxury.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Leadership Section - Mobile optimized */}
      <section className="py-16 md:py-24 px-4 md:px-12">
        <div className="max-w-screen-lg mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-20"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="font-serif text-2xl md:text-5xl mb-4 md:mb-6 tracking-wider">VISIONARY LEADERSHIP</h2>
            <p className="max-w-2xl mx-auto text-gray-600 px-2">
              Meet the individuals whose expertise and creative vision guide our maison forward while honoring our rich heritage.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            <motion.div 
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="mb-4 overflow-hidden">
                <div className="w-full h-64 md:h-80 bg-cover bg-center bg-gray-200 transition-transform duration-500 hover:scale-105"></div>
              </div>
              <h3 className="font-serif text-lg md:text-xl mb-1">ALEXANDRA BEAUMONT</h3>
              <div className="text-gray-500 text-sm mb-3">CREATIVE DIRECTOR</div>
              <p className="text-gray-600 text-sm">
                With over two decades of experience in haute couture, Alexandra brings her refined aesthetic and innovative vision to every collection.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-4 overflow-hidden">
                <div className="w-full h-64 md:h-80 bg-cover bg-center bg-gray-200 transition-transform duration-500 hover:scale-105"></div>
              </div>
              <h3 className="font-serif text-lg md:text-xl mb-1">JAMES LOMBARDI</h3>
              <div className="text-gray-500 text-sm mb-3">MASTER ARTISAN</div>
              <p className="text-gray-600 text-sm">
                A fourth-generation craftsman, James leads our traditional techniques program, ensuring each creation meets our exacting standards.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="sm:col-span-2 md:col-span-1"
            >
              <div className="mb-4 overflow-hidden">
                <div className="w-full h-64 md:h-80 bg-cover bg-center bg-gray-200 transition-transform duration-500 hover:scale-105"></div>
              </div>
              <h3 className="font-serif text-lg md:text-xl mb-1">SOPHIA CHEN</h3>
              <div className="text-gray-500 text-sm mb-3">INNOVATION DIRECTOR</div>
              <p className="text-gray-600 text-sm">
                Sophia bridges tradition and innovation, developing sustainable approaches that honor our heritage while advancing our environmental commitments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-lg mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="flex flex-col justify-center"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="font-serif text-3xl md:text-5xl mb-10 tracking-wider">EXPERIENCE OUR WORLD</h2>
              <p className="mb-8 leading-relaxed text-gray-600">
                We invite you to discover our maison—whether through a private consultation, an exclusive event, or a visit to one of our flagship boutiques.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium tracking-wide mb-2">PRIVATE APPOINTMENTS</h3>
                  <p className="text-gray-600 text-sm">
                    Schedule a personalized consultation with our specialists for a curated experience tailored to your preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium tracking-wide mb-2">FLAGSHIP BOUTIQUES</h3>
                  <p className="text-gray-600 text-sm">
                    Visit our elegantly appointed spaces in Paris, New York, London, Tokyo, and Shanghai.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium tracking-wide mb-2">ATELIER TOURS</h3>
                  <p className="text-gray-600 text-sm">
                    By invitation only, witness our master craftsmen at work in our historic Parisian atelier.
                  </p>
                </div>
                
                <motion.button
                  className="py-3 px-6 bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition-colors duration-300 self-start mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  CONTACT US
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              className="h-[70vh] relative overflow-hidden"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div 
                className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/perfumes/Perfumes_HP_Category_Push_20241115_DII.jpg?wid=730')" }}
              ></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-screen-md mx-auto text-center">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="font-serif text-5xl md:text-7xl mb-8">&quot;</div>
            <p className="font-serif text-2xl md:text-3xl mb-10 leading-relaxed">
              True luxury is not merely about exclusivity or price, but about the human touch—the countless hours of dedication that transform rare materials into works of art.
            </p>
            <div className="text-sm tracking-widest uppercase">FOUNDER & CREATIVE DIRECTOR</div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}