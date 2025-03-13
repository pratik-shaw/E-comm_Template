const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      maxLength: [8, 'Price cannot exceed 8 figures'],
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      maxLength: [5, 'Stock cannot exceed 5 figures'],
      default: 0,
    },
    imageUrls: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    discount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    sku: {
      type: String,
      required: [true, 'Please enter product SKU'],
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
