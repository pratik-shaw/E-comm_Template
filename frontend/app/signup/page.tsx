"use client"

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt with:", { 
      firstName, 
      lastName, 
      email, 
      password, 
      acceptTerms, 
      acceptMarketing 
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-[40vh] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[url('https://ap.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/women/2025/category/jewelry/color-blossom/JEWELRY_BLOSSOM_VISUAL_LVCOM_01_DI3.jpg?wid=4096')] bg-center bg-cover"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center text-white z-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-6xl tracking-wide mb-4 text-center">CREATE ACCOUNT</h1>
          <p className="text-xs md:text-sm tracking-widest max-w-xl mx-auto text-center px-6">
            JOIN THE MAISON AND ENJOY A PERSONALIZED EXPERIENCE
          </p>
        </motion.div>
      </section>
      
      {/* Signup Form Section */}
      <section className="py-16 md:py-24 px-4 md:px-12">
        <motion.div 
          className="max-w-lg mx-auto"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.form 
            variants={itemVariants} 
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="firstName" className="block text-xs tracking-widest uppercase">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="lastName" className="block text-xs tracking-widest uppercase">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  required
                />
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="signup-email" className="block text-xs tracking-widest uppercase">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="signup-password" className="block text-xs tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with letters, numbers, and special characters.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="confirm-password" className="block text-xs tracking-widest uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="mt-1 h-4 w-4 border border-gray-300 focus:ring-0 focus:ring-offset-0"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-xs">
                  I agree to the <a href="/terms" className="underline">Terms and Conditions</a> and <a href="/privacy" className="underline">Privacy Policy</a>
                </label>
              </div>
              
              <div className="flex items-start">
                <input
                  id="marketing"
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={() => setAcceptMarketing(!acceptMarketing)}
                  className="mt-1 h-4 w-4 border border-gray-300 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="marketing" className="ml-2 text-xs">
                  I would like to receive news, collection updates and personalized offers by email
                </label>
              </div>
            </motion.div>
            
            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full py-3 px-6 bg-black text-white text-xs tracking-widest hover:bg-gray-900 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              CREATE ACCOUNT
            </motion.button>
          </motion.form>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-sm mb-6">Already have an account?</p>
            <Link 
              href="/login" 
              className="inline-flex items-center text-xs tracking-widest group"
            >
              SIGN IN 
              <ChevronRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
}