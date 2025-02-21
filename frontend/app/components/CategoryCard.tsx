// components/CategoryCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, image, url }) => {
  return (
    <Link href={url}>
      <div className="relative rounded-xl overflow-hidden group cursor-pointer h-96">
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt={title} 
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-white font-serif text-3xl mb-3 relative z-10">{title}</h3>
          <p className="text-white/90 font-light max-w-xs relative z-10">{description}</p>
          <div className="mt-6 border-b border-white/40 w-16 relative z-10"></div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;