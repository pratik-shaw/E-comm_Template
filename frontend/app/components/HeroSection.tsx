// components/HeroSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import hero from "../images/hero-section.jpg"

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full">
      <motion.div 
        className="absolute inset-0 mx-8 my-16 rounded-2xl overflow-hidden"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src={hero}
          alt="Abnoxius Premium Products"
          layout="fill"
          objectFit="cover"
          priority
          className="filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      </motion.div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <motion.h1 
          className="text-5xl md:text-7xl font-serif mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          ABNOXIUS
        </motion.h1>
        
        <motion.p 
          className="text-xl font-light tracking-widest mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          LUXURY HAIR & BODY CARE
        </motion.p>
        
        <Link href="/shop">
          <motion.button 
            className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-10 py-3 rounded-md
                       hover:bg-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            EXPLORE COLLECTION
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;