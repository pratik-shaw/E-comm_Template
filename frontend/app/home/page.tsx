// app/home/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import CategoryTabs from '@/app/components/CategoryTabs';
import MarqueeText from '@/app/components/MarqueeText';
import CategoryCard from '@/app/components/CategoryCard';
import FeaturedSection from '@/app/components/FeaturedSection';
import HeroSection from '@/app/components/HeroSection';

// Sample product data
const productsData = {
  shampoo: [
    { id: 's1', name: 'Argania Restoration Shampoo', price: 42.00, rating: 4.8, image: '/images/product1.jpg', category: 'Shampoo' },
    { id: 's2', name: 'Silk Protein Infusion', price: 38.00, rating: 4.7, image: '/images/product2.jpg', category: 'Shampoo' },
    { id: 's3', name: 'Moroccan Clay Purify', price: 45.00, rating: 4.9, image: '/images/product3.jpg', category: 'Shampoo' },
    { id: 's4', name: 'Alpine Herb Rejuvenation', price: 41.00, rating: 4.6, image: '/images/product4.jpg', category: 'Shampoo' },
  ],
  soaps: [
    { id: 'sp1', name: 'Damascus Rose Body Cleanser', price: 28.00, rating: 4.9, image: '/images/soap1.jpg', category: 'Soap' },
    { id: 'sp2', name: 'Neroli & Ylang Exfoliator', price: 32.00, rating: 4.8, image: '/images/soap2.jpg', category: 'Soap' },
    { id: 'sp3', name: 'Himalayan Salt Purify Bar', price: 24.00, rating: 4.7, image: '/images/soap3.jpg', category: 'Soap' },
    { id: 'sp4', name: 'Cedar & Sage Body Wash', price: 36.00, rating: 4.9, image: '/images/soap4.jpg', category: 'Soap' },
  ],
  accessories: [
    { id: 'a1', name: 'Olivewood Hair Brush', price: 68.00, rating: 4.9, image: '/images/acc1.jpg', category: 'Accessory' },
    { id: 'a2', name: 'Sisal Body Scrubber', price: 34.00, rating: 4.7, image: '/images/acc2.jpg', category: 'Accessory' },
    { id: 'a3', name: 'Marble Soap Dish', price: 42.00, rating: 4.8, image: '/images/acc3.jpg', category: 'Accessory' },
    { id: 'a4', name: 'Linen Wash Bag', price: 26.00, rating: 4.6, image: '/images/acc4.jpg', category: 'Accessory' },
  ],
};

const categoryData = [
  {
    title: "HAIR CARE",
    description: "Nourishing formulations created with rare botanicals to repair and strengthen every strand.",
    image: "/images/category1.jpg",
    url: "/shop/shampoo"
  },
  {
    title: "BODY CARE",
    description: "Indulgent cleansers and moisturizers enriched with essential oils for silky, radiant skin.",
    image: "/images/category2.jpg",
    url: "/shop/soaps"
  },
  {
    title: "ACCESSORIES",
    description: "Handcrafted tools and objects designed to elevate your daily self-care ritual.",
    image: "/images/category3.jpg",
    url: "/shop/accessories"
  }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('shampoo');

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Product Categories Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-serif text-gray-900 mb-16">OUR COLLECTION</h2>
          
          {/* Category Tabs */}
          <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsData[activeCategory as keyof typeof productsData].map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Marquee Text Section */}
      <MarqueeText text="ENJOY 20% OFF ALL PRODUCTS BEFORE CHRISTMAS WITH CODE: HOLIDAY20" />
      
      {/* Featured Section */}
      <section className="py-24">
        <FeaturedSection />
      </section>
      
      {/* Category Cards Section */}
      <section className="py-24 px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-serif text-gray-900 mb-16">EXPLORE OUR RANGES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryData.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Instagram Gallery Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-2xl font-serif text-gray-900 mb-8">FOLLOW US @ABNOXIUS</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square relative rounded-lg overflow-hidden">
                <Image 
                  src={`/images/instagram${item}.jpg`}
                  alt={`Instagram post ${item}`}
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}