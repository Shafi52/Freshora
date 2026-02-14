const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    min: [0, "Price cannot be negative"],
  },
  originalPrice: {
    type: Number,
    min: [0, "Original price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
    enum: {
      values: ["Vegetables", "Fruits", "Dairy", "Bakery", "Beverages", "Snacks", "Meat", "Seafood", "Frozen", "Other"],
      message: "Please select a valid category",
    },
  },
  subCategory: String,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // null means admin-added product
  },
  isApproved: {
    type: Boolean,
    default: true, // Admin products auto-approved, seller products need approval
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/400",
  },
  images: [String],
  stock: {
    type: Number,
    required: [true, "Please provide stock quantity"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  unit: {
    type: String,
    enum: ["kg", "g", "l", "ml", "piece", "dozen", "pack"],
    default: "piece",
  },
  unitValue: {
    type: Number,
    default: 1,
  },
  brand: String,
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes for performance
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isActive: 1 });

// Virtual for discounted price
ProductSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }
  return this.price;
});

// Virtual for in stock status
ProductSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

module.exports = mongoose.model("Product", ProductSchema);
