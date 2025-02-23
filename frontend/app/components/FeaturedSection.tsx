// components/FeaturedSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import model from '@/app/images/model.jpg';

const FeaturedSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      <motion.div 
        className="relative h-screen max-h-[600px]"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Image
          src={model} 
          alt="Abnoxius Model"
          layout="fill"
          objectFit="cover"
          className="filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </motion.div>
      
      <motion.div 
        className="bg-gray-800 h-screen max-h-[600px] flex flex-col justify-center px-12 lg:px-20"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.span 
          className="text-amber-400 font-light tracking-wider mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          THE LUXURIOUS EXPERIENCE
        </motion.span>
        
        <motion.h2 
          className="text-4xl md:text-5xl font-serif text-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Indulge in Natural Elegance
        </motion.h2>
        
        <motion.p 
          className="text-gray-300 font-light leading-relaxed mb-8 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Our handcrafted formulas combine rare botanicals with modern science to provide an unparalleled hair and body care experience.
          Each product tells a story of sustainable luxury and timeless sophistication.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/about-us">
            <motion.button 
              className="border border-amber-400 text-amber-400 px-10 py-3 tracking-wider font-light
                         hover:bg-amber-400 hover:text-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DISCOVER MORE
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeaturedSection;