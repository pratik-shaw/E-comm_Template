import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

interface CollectionsProps {
  title?: string;
  collections: CollectionItem[];
}

const Collections = ({ 
  title = "EXPLORE COLLECTIONS", 
  collections = [
    { 
      id: "essential", 
      name: "THE ESSENTIALS", 
      description: "Foundation for everyday luxury",
      image: "/images/collection-placeholder.jpg",
      link: "/collections/essential"
    },
    { 
      id: "signature", 
      name: "SIGNATURE", 
      description: "Our distinguished classics",
      image: "/images/collection-placeholder.jpg",
      link: "/collections/signature"
    },
    { 
      id: "limited", 
      name: "LIMITED EDITION", 
      description: "Exclusive seasonal offerings",
      image: "/images/collection-placeholder.jpg",
      link: "/collections/limited"
    }
  ]
}: CollectionsProps) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        {title && (
          <motion.h2 
            className="font-serif text-3xl md:text-4xl mb-16 md:mb-24 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {title}
          </motion.h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative bg-gray-50 aspect-[3/4] overflow-hidden"
            >
              <div 
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${collection.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl mb-2 text-white">{collection.name}</h3>
                <p className="text-sm text-white/80 mb-6">{collection.description}</p>
                <Link href={collection.link}>
                  <a className="inline-block text-sm tracking-widest text-white relative w-fit">
                    DISCOVER
                    <span className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;