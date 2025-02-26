/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  name,
  price,
  rating,
  reviewCount,
  image,
  category
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative bg-[#231815] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, rotateY: 3, z: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Category Badge */}
      <motion.div
        className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-xs font-light text-amber-50">{category}</span>
      </motion.div>

      {/* Image Container with Overlay */}
      <div className="relative h-80 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/80 via-[#1A1412]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Quick Action Buttons */}
        <motion.div 
          className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.button
            className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={18} />
          </motion.button>
          <motion.button
            className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6 bg-gradient-to-b from-[#201715] to-[#2A1F1C]">
        <h3 className="text-lg font-medium text-amber-50 mb-2 group-hover:text-amber-400 transition-colors">
          {name}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex text-amber-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? "currentColor" : "none"}
                className={i < rating ? "" : "text-gray-600"}
              />
            ))}
          </div>
          <span className="text-sm text-amber-100/60">
            ({reviewCount})
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-amber-50 font-serif text-lg">${price.toFixed(2)}</span>
          
          {/* Availability Indicator */}
          <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full">
            In Stock
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 rounded-md text-sm font-medium 
                     hover:from-amber-600 hover:to-amber-500 transition-all duration-300 group-hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;