// components/CategoryTabs.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';

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
      <div className="inline-flex rounded-md p-1 bg-gray-100">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-8 py-3 rounded-md text-sm font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-white text-amber-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;