// controllers/productController.js
const Product = require('../models/Product');
const slugify = require('slugify');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrls, discount, tags, sku } = req.body;

    // Check for required fields
    if (!name || !description || !price || !category || !stock || !sku) {
      return res.status(400).json({ message: 'All required fields are missing' });
    }

    // Generate slug from product name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug was created properly
    if (!slug) {
      return res.status(400).json({ message: "Slug generation failed" });
    }

    // Check if a product with the same SKU or slug already exists
    const existingProduct = await Product.findOne({ $or: [{ slug }, { sku }] });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this name or SKU already exists' });
    }

    // Create a new product
    const product = new Product({ 
      name, 
      slug, 
      description, 
      price, 
      category, 
      stock, 
      imageUrls, 
      discount, 
      tags, 
      sku 
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, imageUrls, discount, tags, sku } = req.body;

    if (!name || !description || !price || !category || !stock || !sku) {
      return res.status(400).json({ message: 'All required fields are missing' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, stock, imageUrls, discount, tags, sku },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
