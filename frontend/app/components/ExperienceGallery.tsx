"use client"

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

interface ExperienceProps {
  images: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Experience = ({ images }: ExperienceProps) => {
  const productSectionRef = useRef(null);
  
  // Horizontal scroll for product gallery
  const { scrollXProgress } = useScroll({
    container: productSectionRef
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
          <motion.h2 
            className="font-serif text-3xl md:text-4xl mb-12 tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            THE EXPERIENCE
          </motion.h2>
          
          <div 
            ref={productSectionRef} 
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth" }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div 
                key={item}
                className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[40vw] h-[70vh] px-4 snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="h-full w-full bg-gray-100 bg-[url('/images/gallery-placeholder.jpg')] bg-cover bg-center"></div>
              </motion.div>
            ))}
          </div>
          
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

export default Experience;