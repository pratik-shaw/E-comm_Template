// components/FeaturedSection.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      <div className="relative h-screen max-h-[600px]">
        <Image
          src="/images/model.jpg" 
          alt="Abnoxius Model"
          layout="fill"
          objectFit="cover"
        />
      </div>
      
      <div className="bg-gray-100 h-screen max-h-[600px] flex flex-col justify-center px-12 lg:px-20">
        <span className="text-amber-800 font-light tracking-wider mb-3">THE LUXURIOUS EXPERIENCE</span>
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Indulge in Natural Elegance</h2>
        <p className="text-gray-700 font-light leading-relaxed mb-8 max-w-lg">
          Our handcrafted formulas combine rare botanicals with modern science to provide an unparalleled hair and body care experience.
          Each product tells a story of sustainable luxury and timeless sophistication.
        </p>
        <Link href="/about-us">
          <button className="border border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white transition-colors px-10 py-3 tracking-wider font-light">
            DISCOVER MORE
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedSection;