// components/HeroSection.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 mx-8 my-16 rounded-2xl overflow-hidden">
        <Image
          src="/images/hero-image.jpg"
          alt="Abnoxius Premium Products"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl md:text-7xl font-serif mb-4">ABNOXIUS</h1>
        <p className="text-xl font-light tracking-widest mb-8">LUXURY HAIR & BODY CARE</p>
        <Link href="/shop">
          <button className="bg-white text-gray-900 px-10 py-3 rounded-md hover:bg-gray-200 transition-colors">
            EXPLORE COLLECTION
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;