// components/CategoryCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, image, url }) => {
  return (
    <Link href={url}>
      <motion.div 
        className="relative rounded-xl overflow-hidden group cursor-pointer h-96"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt={title} 
            layout="fill"
            objectFit="cover"
            className="transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-white font-serif text-3xl mb-3 relative z-10 group-hover:text-amber-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-200 font-light max-w-xs relative z-10 group-hover:text-white transition-colors">
            {description}
          </p>
          <motion.div 
            className="mt-6 border-b border-white/40 w-16 relative z-10"
            whileHover={{ width: '100px' }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;