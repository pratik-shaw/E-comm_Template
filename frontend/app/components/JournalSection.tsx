import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface JournalEntry {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  slug: string;
}

interface JournalSectionProps {
  title?: string;
  viewAllLink?: string;
  entries: JournalEntry[];
}

const JournalSection = ({ 
  title = "JOURNAL",
  viewAllLink = "/journal",
  entries = [
    {
      id: 1,
      title: "The Science of Luxury: Understanding Molecular Haircare",
      category: "BEAUTY RITUALS",
      excerpt: "Discover the intricate balance of science and luxury that defines our approach to haircare, with insights from our lead formulator...",
      image: "/images/journal-placeholder.jpg",
      slug: "/journal/science-of-luxury"
    },
    {
      id: 2,
      title: "Crafting Perfection: Behind Our Signature Scents",
      category: "INGREDIENTS",
      excerpt: "Journey through the world's finest botanical gardens and laboratories where we source and develop our distinctive fragrance profiles...",
      image: "/images/journal-placeholder.jpg",
      slug: "/journal/signature-scents"
    },
    {
      id: 3,
      title: "The Art of the Ritual: Elevating Your Hair Routine",
      category: "BEAUTY RITUALS",
      excerpt: "Transform your daily routine into a moment of mindfulness and self-care with our guide to creating your personal hair ritual...",
      image: "/images/journal-placeholder.jpg",
      slug: "/journal/hair-ritual"
    }
  ]
}: JournalSectionProps) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          className="flex justify-between items-baseline mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="font-serif text-3xl md:text-4xl tracking-wider">{title}</h2>
          <Link href={viewAllLink}>
            <a className="hidden md:inline-block text-sm tracking-widest relative group">
              VIEW ALL
              <span className="absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
            </a>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group"
            >
              <Link href={entry.slug}>
                <a className="block">
                  <div className="aspect-[4/3] overflow-hidden mb-6">
                    <div 
                      className="h-full w-full bg-gray-100 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${entry.image})` }}
                    ></div>
                  </div>
                  <div className="text-xs tracking-wider text-gray-500 mb-2">{entry.category}</div>
                  <h3 className="font-serif text-xl mb-3 group-hover:underline">{entry.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{entry.excerpt}</p>
                </a>
              </Link>
            </motion.article>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center md:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Link href={viewAllLink}>
            <a className="inline-block text-sm tracking-widest relative">
              VIEW ALL JOURNAL ENTRIES
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JournalSection;