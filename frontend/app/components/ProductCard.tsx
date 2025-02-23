// components/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number; // Add this prop to pass review count from parent
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id, 
  name, 
  price, 
  rating, 
  reviewCount, // Use the prop instead of Math.random()
  image, 
  category 
}) => {
  return (
    <motion.div 
      className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-80 overflow-hidden rounded-t-xl">
        <Image 
          src={image} 
          alt={name} 
          layout="fill"
          objectFit="cover"
          className="transform transition-transform duration-700 group-hover:scale-110"
        />
        <motion.div 
          className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-light text-gray-200">{category}</span>
        </motion.div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-100 mb-2 group-hover:text-amber-400 transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                fill={i < rating ? "currentColor" : "none"} 
                className={i < rating ? "" : "text-gray-600"} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            ({reviewCount})
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-100 font-medium">${price.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300
                       hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View More
          </motion.button>
          <motion.button 
            className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium
                       hover:bg-amber-700 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;