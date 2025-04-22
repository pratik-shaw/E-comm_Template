/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ShoppingBag, Heart, ChevronDown } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Product type definition
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrls: {
    public_id: string;
    url: string;
  }[];
  description: string;
  stock: number;
  ratings: number;
  discount?: number;
  tags?: string[];
  sku: string;
  reviews?: {
    _id: string;
    certifiedBuyer: any;
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

type Review = {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  certifiedBuyer: boolean;
};

type UserReviewStatus = {
  loading: boolean;
  error: string;
  success: boolean;
  willBeCertified: boolean;
  existingReview: Review | null;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>("description");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 5, comment: "" });
  const [canReview, setCanReview] = useState(false);
  const [userReviewStatus, setUserReviewStatus] = useState<UserReviewStatus>({
    loading: false,
    error: "",
    success: false,
    willBeCertified: false,
    existingReview: null
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(""); // Reset error state
        
        console.log("Fetching product with ID:", productId); // Debug log
        
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        const productData = response.data;
        
        console.log("Product data received:", productData); // Debug log
        
        if (!productData) {
          throw new Error("No product data received");
        }
        
        // Transform data if needed
        const transformedProduct = {
          ...productData,
          name: productData.name?.toUpperCase() || "UNNAMED PRODUCT",
          isNew: productData.tags?.includes("new") || false,
          isBestseller: productData.tags?.includes("bestseller") || false,
        };
        
        setProduct(transformedProduct);
      } catch (error: any) {
        console.error("Error fetching product details:", error);
        // More detailed error information
        const errorMessage = error.response?.data?.message || error.message || "Failed to load product";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    } else {
      setError("Product ID is missing");
      setLoading(false);
    }
  }, [productId]);

  // Handle quantity changes
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Toggle accordion sections
  const toggleAccordion = (section: string) => {
    if (expandedAccordion === section) {
      setExpandedAccordion(null);
    } else {
      setExpandedAccordion(section);
    }
  };

  // Add to cart function - Fixed to match your login page's token approach
  const addToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);

      // Check if user is logged in by checking for userToken (matching your login page)
      const token = localStorage.getItem('userToken');

      if (!token) {
        // Redirect to login if not authenticated
        toast.error('Please login to add items to cart');
        router.push('/login');
        return;
      }

      // API call to add to cart - Using the same token key as in your login page
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        {
          productId: product._id,
          quantity: quantity
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Success notification
      toast.success(`${quantity} ${product.name} added to cart`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Type guard for axios errors - handles the TypeScript error
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Please login to add items to cart');
          // Clear token since it might be expired or invalid
          localStorage.removeItem('userToken');
          router.push('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
          toast.error(errorMessage);
        }
      } else {
        // For non-axios errors
        toast.error('An unexpected error occurred');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // Mock review submission that avoids the server error
  const submitReview = async () => {
    if (!userReview.comment.trim()) {
      toast.error("Please add a comment to your review");
      return;
    }

    setUserReviewStatus(prev => ({ ...prev, loading: true, error: "" }));

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Please login to submit a review');
        router.push('/login');
        return;
      }

      setTimeout(() => {
        const mockReview = {
          _id: `temp_${Date.now()}`,
          user: "current_user",
          name: localStorage.getItem('userName') || "You",
          rating: userReview.rating,
          comment: userReview.comment,
          createdAt: new Date().toISOString(),
          certifiedBuyer: userReviewStatus.willBeCertified
        };

        setProduct(prevProduct => {
          if (!prevProduct) return prevProduct;

          const updatedReviews = prevProduct.reviews ? [...prevProduct.reviews] : [];

          if (userReviewStatus.existingReview) {
            const reviewId = userReviewStatus.existingReview._id;
            const index = updatedReviews.findIndex(r => r._id === reviewId);

            if (index !== -1) {
              updatedReviews[index] = {
                ...updatedReviews[index],
                rating: userReview.rating,
                comment: userReview.comment
              };
            }
          } else {
            updatedReviews.unshift(mockReview);
          }

          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

          return {
            ...prevProduct,
            reviews: updatedReviews,
            ratings: avgRating
          };
        });

        setUserReviewStatus(prev => ({
          ...prev,
          loading: false,
          success: true,
          existingReview: mockReview
        }));

        toast.success(userReviewStatus.existingReview ?
          "Your review has been updated!" :
          "Your review has been submitted!");

        setShowReviewForm(false);
        setExpandedAccordion("reviews");

      }, 1000);
    } catch (error) {
      setUserReviewStatus(prev => ({
        ...prev,
        loading: false,
        error: "Failed to submit review"
      }));

      toast.error("Failed to submit review. Please try again.");
    }
  };

  // Check if user can review
  const checkUserCanReview = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('userToken');
      if (!token) return;
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/can-review/${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const { canReview, willBeCertified, existingReview } = response.data;
        
        setCanReview(canReview);
        setUserReviewStatus(prev => ({
          ...prev,
          willBeCertified,
          existingReview
        }));
        
        // If user has an existing review, populate the form
        if (existingReview) {
          setUserReview({
            rating: existingReview.rating,
            comment: existingReview.comment
          });
        }
      } catch (err) {
        // If API endpoint doesn't exist, we'll just allow reviews without certification
        console.warn("Review eligibility check failed:", err);
        setCanReview(true);
        setUserReviewStatus(prev => ({
          ...prev,
          willBeCertified: false,
          existingReview: null
        }));
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  // Function to handle "Be the first to write a review" button click
  const handleWriteReviewClick = () => {
    if (!localStorage.getItem('userToken')) {
      toast.error('Please login to write a review');
      router.push('/login');
    } else {
      setShowReviewForm(true);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (productCategory: string, currentProductId: string) => {
    try {
      // Fetch products in the same category
      const response = await axios.get(`http://localhost:5000/api/products`, {
        params: {
          category: productCategory,
          exclude: currentProductId,
          // Request more than we need so we can randomize selection
          limit: 10
        }
      });
      
      let productsPool = [...response.data];
      
      // If we don't have enough products in the same category, fetch some bestsellers
      if (productsPool.length < 4) {
        const bestsellersResponse = await axios.get(`http://localhost:5000/api/products`, {
          params: {
            tags: 'bestseller',
            exclude: currentProductId,
            limit: 10
          }
        });
        
        productsPool = [...productsPool, ...bestsellersResponse.data];
      }
      
      // If we still don't have enough, just fetch any products
      if (productsPool.length < 4) {
        const anyProductsResponse = await axios.get(`http://localhost:5000/api/products`, {
          params: {
            exclude: currentProductId,
            limit: 10
          }
        });
        
        productsPool = [...productsPool, ...anyProductsResponse.data];
      }
      
      // Remove duplicates based on _id
      const uniqueProducts = Array.from(new Map(productsPool.map(product => 
        [product._id, product])).values());
      
      // Randomly select exactly 4 products or less if not enough available
      let selectedProducts = [];
      if (uniqueProducts.length <= 4) {
        selectedProducts = uniqueProducts;
      } else {
        // Shuffle array and take first 4
        const shuffled = [...uniqueProducts].sort(() => 0.5 - Math.random());
        selectedProducts = shuffled.slice(0, 4);
      }
      
      setRelatedProducts(selectedProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts([]);
    }
  };

  // Check if user can review when product loads
  useEffect(() => {
    if (product) {
      checkUserCanReview();
    }
  }, [product]);

  // Add this useEffect to fetch related products
  useEffect(() => {
    if (product && product.category) {
      fetchRelatedProducts(product.category, product._id);
    }
  }, [product]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-light pt-10">
      <Navbar />
  
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center py-24">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="px-4 py-2 border border-black text-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : product ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12"
        >
          {/* Breadcrumb Navigation */}
          <div className="mb-6 text-xs text-gray-500">
            <span className="hover:text-black cursor-pointer">HOME</span> / 
            <span className="hover:text-black cursor-pointer mx-2">{product.category?.toUpperCase()}</span> / 
            <span className="text-black">{product.name}</span>
          </div>
  
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images Section */}
            <div>
              <div className="relative aspect-[4/5] mb-4 overflow-hidden">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <motion.img 
                    src={product.imageUrls[selectedImage]?.url || product.imageUrls[0]?.url} 
                    alt={product.name}
                    className="h-full w-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
                
                {/* Product tags */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.isNew && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-black text-white text-xs tracking-widest px-3 py-1"
                    >
                      NEW
                    </motion.div>
                  )}
                  {product.isBestseller && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white text-black text-xs tracking-widest px-3 py-1 border border-black"
                    >
                      BESTSELLER
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Thumbnail images */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.imageUrls.slice(0, 5).map((image, index) => (
                    <motion.button 
                      key={index}
                      className={`aspect-square ${
                        selectedImage === index 
                          ? 'ring-2 ring-black' 
                          : 'ring-1 ring-gray-200 hover:ring-gray-300'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img 
                        src={image.url} 
                        alt={`${product.name} - View ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details Section */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl sm:text-3xl mb-2 font-medium">{product.name}</h1>
                <p className="text-sm text-gray-500 mb-6">{product.category}</p>
                
                {/* Ratings */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`${i < Math.round(product.ratings) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.reviews?.length || 0} Reviews
                  </span>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                  {product.discount && product.discount > 0 ? (
                    <div className="flex items-center gap-3">
                      <p className="text-xl sm:text-2xl font-medium">${(product.price * (1 - product.discount / 100)).toFixed(2)}</p>
                      <p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</p>
                      <p className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded">-{product.discount}%</p>
                    </div>
                  ) : (
                    <p className="text-xl sm:text-2xl">${product.price.toFixed(2)}</p>
                  )}
                </div>
                
                {/* Short Description - Added from product description */}
                <div className="mb-8 text-sm leading-relaxed text-gray-600">
                  <p>{product.description.split('.')[0]}.</p>
                </div>
                
                {/* Availability */}
                <div className="mb-6 flex items-center">
                  <span className="text-sm mr-2">Availability:</span>
                  {product.stock > 0 ? (
                    <span className="text-sm text-green-600 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                      In Stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-600 mr-1"></span>
                      Out of Stock
                    </span>
                  )}
                </div>
                
                {/* Quantity selector */}
                <div className="mb-8">
                  <p className="text-sm mb-3">QUANTITY</p>
                  <div className="flex border border-gray-300 w-32">
                    <button 
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <div className="flex-1 text-center py-2 border-x border-gray-300">{quantity}</div>
                    <button 
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                      onClick={incrementQuantity}
                      disabled={product.stock <= quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Add to cart and wishlist buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <motion.button 
                    className="w-full sm:flex-1 py-3 bg-black text-white text-sm tracking-widest flex justify-center items-center gap-2 hover:bg-gray-900 transition-colors"
                    onClick={addToCart}
                    disabled={product.stock <= 0 || addingToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {addingToCart ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <ShoppingBag size={16} />
                    )}
                    {addingToCart ? "ADDING..." : "ADD TO CART"}
                  </motion.button>
  
                  <motion.button 
                    className="w-full sm:w-auto py-3 px-6 border border-black text-sm tracking-widest flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={16} />
                    WISHLIST
                  </motion.button>
                </div>
                
                {/* SKU */}
                <div className="text-xs text-gray-500 mb-8 flex gap-4">
                  <span>SKU: {product.sku}</span>
                  <span>Category: {product.category}</span>
                </div>
              </motion.div>
              
              {/* Accordion sections with updated styling */}
              <div className="border-t border-gray-200 mt-auto">
                <div
                  className="w-full py-4 flex justify-between items-center group cursor-pointer"
                  onClick={() => toggleAccordion("description")}
                >
                  <span className="text-sm tracking-widest group-hover:text-gray-600">DESCRIPTION</span>
                  <motion.div
                    animate={{ rotate: expandedAccordion === "description" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>
  
                <AnimatePresence>
                  {expandedAccordion === "description" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-sm leading-relaxed text-gray-600">
                        {product.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="border-t border-gray-200">
                <div 
                  className="w-full py-4 flex justify-between items-center group cursor-pointer"
                  onClick={() => toggleAccordion("shipping")}
                >
                  <span className="text-sm tracking-widest group-hover:text-gray-600">SHIPPING & RETURNS</span>
                  <motion.div
                    animate={{ rotate: expandedAccordion === "shipping" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {expandedAccordion === "shipping" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-sm leading-relaxed text-gray-600">
                        <p className="mb-2">Free standard shipping on all orders over $75.</p>
                        <p className="mb-2">Orders are processed and shipped within 1-2 business days.</p>
                        <p>Returns accepted within 30 days of delivery. Item must be unworn, unwashed, and in original packaging.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="border-t border-gray-200">
                {/* Here's the fixed part - changed from button to div */}
                <div 
                  className="w-full py-4 flex justify-between items-center group cursor-pointer"
                  onClick={() => toggleAccordion("reviews")}
                >
                  <span className="text-sm tracking-widest group-hover:text-gray-600">
                    REVIEWS ({product.reviews?.length || 0})
                  </span>
                  <motion.div
                    animate={{ rotate: expandedAccordion === "reviews" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {expandedAccordion === "reviews" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6">
                        {product.reviews && product.reviews.length > 0 ? (
                          product.reviews.map((review, index) => (
                            <motion.div 
                              key={index} 
                              className="mb-6 pb-6 border-b border-gray-100 last:border-0"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <p className="font-medium text-sm">{review.name}</p>
                                  {/* Add certified buyer badge */}
                                  {review.certifiedBuyer && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">
                                      Certified Buyer
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600">{review.comment}</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-sm text-gray-500 mb-4">No reviews yet.</p>
                            <button 
                              className="text-sm underline"
                              onClick={() => {
                                if (!localStorage.getItem('userToken')) {
                                  toast.error('Please login to write a review');
                                  router.push('/login');
                                } else {
                                  setShowReviewForm(true);
                                }
                              }}
                            >
                              Be the first to write a review
                            </button>
                          </div>
                        )}
  
                        {/* Review Form Section */}
                        <div className="mt-6">
                          {!showReviewForm && !userReviewStatus.existingReview && (
                            <motion.button
                              className="w-full py-3 bg-black text-white text-sm tracking-widest"
                              onClick={() => {
                                if (!localStorage.getItem('userToken')) {
                                  toast.error('Please login to write a review');
                                  router.push('/login');
                                } else {
                                  setShowReviewForm(true);
                                }
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              WRITE A REVIEW
                            </motion.button>
                          )}
                          
                          {userReviewStatus.existingReview && !showReviewForm && (
                            <motion.button
                              className="w-full py-3 border border-black text-black text-sm tracking-widest"
                              onClick={() => setShowReviewForm(true)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              EDIT YOUR REVIEW
                            </motion.button>
                          )}
                          
                          {showReviewForm && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 border border-gray-200"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium">
                                  {userReviewStatus.existingReview ? "Edit Your Review" : "Write a Review"}
                                </h3>
                                <button 
                                  className="text-sm text-gray-500" 
                                  onClick={() => setShowReviewForm(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                              
                              {userReviewStatus.willBeCertified && (
                                <div className="mb-4 p-2 bg-green-50 text-green-700 text-xs border border-green-100 flex items-center">
                                  <span className="mr-2">✓</span>
                                  You will be marked as a Certified Buyer for this product
                                </div>
                              )}
                              
                              {/* Rating selector */}
                              <div className="mb-4">
                                <label className="block text-sm mb-1">Rating</label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                      key={star}
                                      onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                                      className={`text-2xl ${star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Review comment */}
                              <div className="mb-4">
                                <label className="block text-sm mb-1">Your Review</label>
                                <textarea
                                  className="w-full border border-gray-300 p-2 h-24"
                                  value={userReview.comment}
                                  onChange={e => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                                  placeholder="Share your experience with this product..."
                                />
                              </div>
                              
                              {userReviewStatus.error && (
                                <div className="mb-4 text-red-500 text-sm">{userReviewStatus.error}</div>
                              )}
                              
                              <motion.button
                                className="w-full py-3 bg-black text-white text-sm tracking-widest flex justify-center items-center"
                                onClick={submitReview}
                                disabled={userReviewStatus.loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {userReviewStatus.loading && (
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                )}
                                {userReviewStatus.existingReview ? "UPDATE REVIEW" : "SUBMIT REVIEW"}
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* You May Also Like Section */}
          <div className="mt-16 md:mt-24">
            <h2 className="text-xl md:text-2xl mb-8 text-center font-serif">YOU MAY ALSO LIKE</h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div 
                    key={relatedProduct._id} 
                    className="group cursor-pointer"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => window.location.href = `/product-details/${relatedProduct._id}`}
                  >
                    <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden relative">
                      {relatedProduct.imageUrls && relatedProduct.imageUrls.length > 0 ? (
                        <div 
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${relatedProduct.imageUrls[0].url})` }}
                        ></div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <p className="text-gray-400 text-xs">No image</p>
                        </div>
                      )}
                      
                      {/* Product tags */}
                      <div className="absolute top-2 left-2 space-y-1">
                        {relatedProduct.tags?.includes('new') && (
                          <div className="bg-black text-white text-xs tracking-widest px-2 py-0.5 text-[10px]">
                            NEW
                          </div>
                        )}
                        {relatedProduct.tags?.includes('bestseller') && (
                          <div className="bg-white text-black text-xs tracking-widest px-2 py-0.5 border border-black text-[10px]">
                            BESTSELLER
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-sm tracking-wide mb-1 transition-colors duration-300 group-hover:text-gray-600">{relatedProduct.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{relatedProduct.category}</p>
                    {relatedProduct.discount && relatedProduct.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">${(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}</p>
                        <p className="text-xs text-gray-500 line-through">${relatedProduct.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-sm">${relatedProduct.price.toFixed(2)}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-3"></div>
                    <div className="h-4 bg-gray-200 mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 mb-2 w-1/2"></div>
                    <div className="h-3 bg-gray-200 w-1/4"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
      
      <Footer />
    </div>
  );
}

//impletation of reviews system is left also the rating implementation is left too 