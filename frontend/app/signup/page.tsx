"use client"

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    
    try {
      // Call register API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      
      // Redirect to login page after successful registration
      router.push('/login?registered=true');
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-[40vh] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[url('https://www.givenchy.com/coremedia/resource/blob/1692676/582e4fef5c5d2e85b40f0a694df9ab50/givenchy-2025-campaign-4x5-04-data.jpg')] bg-center bg-cover"></div>
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
            JOIN US TO DISCOVER EXCLUSIVE OFFERS AND PERSONALIZED EXPERIENCES
          </p>
        </motion.div>
      </section>
      
      {/* Signup Form Section */}
      <section className="py-16 md:py-24 px-4 md:px-12">
        <motion.div 
          className="max-w-md mx-auto"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <motion.form 
            variants={itemVariants} 
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="name" className="block text-xs tracking-widest uppercase">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="email" className="block text-xs tracking-widest uppercase">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="password" className="block text-xs tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  required
                  minLength={6}
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
                Must be at least 6 characters
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
            
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="h-4 w-4 border border-gray-300 focus:ring-0 focus:ring-offset-0"
                  required
                />
              </div>
              <div className="ml-3 text-xs">
                <label htmlFor="terms" className="font-light text-gray-700">
                  I agree to the <Link href="/terms" className="underline">Terms and Conditions</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
                </label>
              </div>
            </motion.div>
            
            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full py-3 px-6 bg-black text-white text-xs tracking-widest hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
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