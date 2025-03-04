/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";

interface Product {
  id: string | number;
  image: string;
  category: string;
  name: string;
  price: string;
}

interface ProductsCollectionProps {
  title: string;
  products: Product[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductsCollection = ({ title, products }: ProductsCollectionProps) => {
  // Product hover animation
  const productHoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  };

  // Products data
  const featuredProducts = [
    { id: 1, name: "ELIXIR N°1", category: "SHAMPOO", image: "https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-keepall-bandouliere-25--N00148_PM1_Worn%20view.png?wid=1440&hei=1440", price: "$120" },
    { id: 2, name: "ESSENCE DE LUXE", category: "CONDITIONER", image: "https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-keepall-bandouliere-25--M14026_PM1_Worn%20view.png?wid=1440&hei=1440", price: "$135" },
    { id: 3, name: "CRÈME SUBLIME", category: "TREATMENT", image: "https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-noe-cargo--M13985_PM1_Worn%20view.png?wid=1440&hei=1440", price: "$195" }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        <motion.h2
          className="font-serif text-3xl md:text-4xl mb-16 md:mb-24 tracking-wider text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          SIGNATURE COLLECTION
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group"
            >
              <motion.div
                className="aspect-[4/5] mb-6 overflow-hidden"
                variants={productHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs tracking-wider text-gray-500 mb-1">{product.category}</div>
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <div className="text-sm">{product.price}</div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <a href="#" className="inline-block px-8 py-3 border border-black text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300">
            VIEW ALL PRODUCTS
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsCollection;
