/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface GalleryItem {
  id: number;
  image: string;
  alt: string;
}

interface ExperienceGalleryProps {
  title?: string;
  items: GalleryItem[];
}

const ExperienceGallery = ({ 
  title = "THE EXPERIENCE",
  items = [
    { id: 1, image: "/images/gallery-placeholder.jpg", alt: "Luxury hair product experience" },
    { id: 2, image: "/images/gallery-placeholder.jpg", alt: "Luxury hair product experience" },
    { id: 3, image: "/images/gallery-placeholder.jpg", alt: "Luxury hair product experience" },
    { id: 4, image: "/images/gallery-placeholder.jpg", alt: "Luxury hair product experience" },
    { id: 5, image: "/images/gallery-placeholder.jpg", alt: "Luxury hair product experience" }
  ]
}: ExperienceGalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Horizontal scroll progress for progress indicator
  const { scrollXProgress } = useScroll({
    container: galleryRef
  });
  
  return (
    <section className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0 opacity-5"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        style={{ backgroundImage: "url('/images/pattern.svg')", backgroundSize: "cover" }}
      />
      
      <div className="relative z-10">
        {title && (
          <motion.h2 
            className="font-serif text-3xl md:text-4xl mb-12 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {title}
          </motion.h2>
        )}
        
        <div 
          ref={galleryRef} 
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {items.map((item) => (
            <motion.div 
              key={item.id}
              className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[40vw] h-[70vh] px-4 snap-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div 
                className="h-full w-full bg-gray-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
                aria-label={item.alt}
              ></div>
            </motion.div>
          ))}
        </div>
        
        {/* Scroll progress indicator */}
        <motion.div 
          className="h-1 bg-gray-200 max-w-screen-lg mx-auto mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="h-full bg-black origin-left"
            style={{ scaleX: scrollXProgress }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceGallery;