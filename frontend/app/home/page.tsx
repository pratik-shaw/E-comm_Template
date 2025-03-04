"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ExploreCollections from "@/app/components/ExploreCollections";
import Experience from "@/app/components/ExperienceGallery";
import Journal from "../components/JournalSection";
import ProductsCollection from "../components/Collections";

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeProduct, setActiveProduct] = useState(null);
  const containerRef = useRef(null);
  
  // Subtle parallax for hero section
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroImageScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-gray-900 font-light">
      {/* Using the Navbar component */}
      <Navbar />

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
      <ProductsCollection title={""} products={[]} />
      
      
      {/* Horizontal Scrolling Gallery */}
      <Experience images={[]}/>
      
      
      {/* Collections */}
      <ExploreCollections />
      
      
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
      <Journal articles={[]} />
      
      
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
      
     <Footer />
    </div>
  );
}