// components/CategoryTabs.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'shampoo', label: 'Shampoo' },
    { id: 'soaps', label: 'Soaps' },
    { id: 'accessories', label: 'Accessories' }
  ];

  return (
    <div className="flex justify-center mb-12">
      <motion.div 
        className="inline-flex rounded-md p-1 bg-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categories.map(category => (
          <motion.button
            key={category.id}
            className={`px-8 py-3 rounded-md text-sm font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-gray-700 text-amber-400'
                : 'text-gray-300 hover:text-amber-400'
            }`}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {category.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryTabs;