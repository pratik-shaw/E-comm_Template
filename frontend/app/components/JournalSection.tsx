"use client"

import { motion } from "framer-motion";

interface Article {
  id: string;
  image: string;
  category: string;
  title: string;
  excerpt: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Journal = ({ articles }: { articles: Article[] }) => {
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
        <h2 className="font-serif text-3xl md:text-4xl tracking-wider">JOURNAL</h2>
        <a href="#" className="hidden md:inline-block text-sm tracking-widest relative group">
          VIEW ALL
          <span className="absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
        </a>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item, index) => (
          <motion.a
            key={item}
            href="#"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            viewport={{ once: true, margin: "-100px" }}
            className="group"
          >
            <div className="aspect-[4/3] overflow-hidden mb-6">
              <div className="h-full w-full bg-gray-100 bg-[url('/images/journal-placeholder.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
            </div>
            <div className="text-xs tracking-wider text-gray-500 mb-2">BEAUTY RITUALS</div>
            <h3 className="font-serif text-xl mb-3 group-hover:underline">The Science of Luxury: Understanding Molecular Haircare</h3>
            <p className="text-sm text-gray-600 line-clamp-2">Discover the intricate balance of science and luxury that defines our approach to haircare, with insights from our lead formulator...</p>
          </motion.a>
        ))}
      </div>
      
      <motion.div 
        className="mt-12 text-center md:hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <a href="#" className="inline-block text-sm tracking-widest relative">
          VIEW ALL JOURNAL ENTRIES
          <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
        </a>
      </motion.div>
    </div>
  </section>
  );
};

export default Journal;