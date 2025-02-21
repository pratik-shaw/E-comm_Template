/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, rating, image, category }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mb-6">
      <div className="relative h-80 overflow-hidden rounded-t-xl">
        <Image 
          src={image} 
          alt={name} 
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-light text-gray-800">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{name}</h3>
        
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < rating ? "currentColor" : "none"} 
                className={i < rating ? "" : "text-gray-300"} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({Math.floor(Math.random() * 100) + 10})</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-900 font-medium">${price.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View More
          </button>
          <button className="px-4 py-2 bg-amber-800 text-white rounded-md text-sm font-medium hover:bg-amber-900 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;