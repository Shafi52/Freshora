require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery");
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

// Sample products data with Indian brands
const products = [
    // Vegetables (10)


    { name: "Potatoes", price: 25, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", stock: 200, unit: "kg", description: "Farm fresh potatoes" },
    { name: "Carrots", price: 35, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400", stock: 80, unit: "kg", description: "Organic carrots" },
    { name: "Broccoli", price: 60, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400", stock: 50, unit: "kg", description: "Fresh broccoli" },
    { name: "Spinach", price: 20, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", stock: 70, unit: "kg", description: "Fresh spinach leaves" },
    { name: "Bell Peppers", price: 80, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", stock: 60, unit: "kg", description: "Colorful bell peppers" },

    { name: "Cabbage", price: 25, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400", stock: 90, unit: "kg", description: "Green cabbage" },
    { name: "Cucumber", price: 30, category: "Vegetables", brand: "Fresho", image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400", stock: 75, unit: "kg", description: "Fresh cucumbers" },

    // Fruits (10)
    { name: "Apples", price: 120, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", stock: 100, unit: "kg", description: "Fresh red apples" },
    { name: "Bananas", price: 50, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", stock: 150, unit: "dozen", description: "Ripe bananas" },
    { name: "Oranges", price: 80, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400", stock: 120, unit: "kg", description: "Juicy oranges" },

    { name: "Mangoes", price: 150, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1605027990121-cbae9d3b5f5f?w=400", stock: 60, unit: "kg", description: "Sweet mangoes" },
    { name: "Strawberries", price: 200, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400", stock: 40, unit: "kg", description: "Fresh strawberries" },

    { name: "Pineapple", price: 60, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400", stock: 45, unit: "piece", description: "Fresh pineapple" },
    { name: "Kiwi", price: 180, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400", stock: 35, unit: "kg", description: "Fresh kiwi fruits" },
    { name: "Pomegranate", price: 120, category: "Fruits", brand: "Fresho", image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400", stock: 55, unit: "kg", description: "Fresh pomegranates" },

    // Dairy (8)
    { name: "Milk", price: 60, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", stock: 200, unit: "l", description: "Fresh cow milk" },
    { name: "Cheese", price: 400, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400", stock: 50, unit: "kg", description: "Cheddar cheese" },
    { name: "Yogurt", price: 50, category: "Dairy", brand: "Mother Dairy", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", stock: 100, unit: "kg", description: "Fresh yogurt" },
    { name: "Butter", price: 450, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400", stock: 80, unit: "kg", description: "Pure butter" },
    { name: "Paneer", price: 350, category: "Dairy", brand: "Mother Dairy", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400", stock: 60, unit: "kg", description: "Fresh paneer" },
    { name: "Cream", price: 200, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400", stock: 70, unit: "l", description: "Fresh cream" },
    { name: "Ghee", price: 500, category: "Dairy", brand: "Patanjali", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400", stock: 50, unit: "kg", description: "Pure ghee" },
    { name: "Buttermilk", price: 40, category: "Dairy", brand: "Mother Dairy", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", stock: 90, unit: "l", description: "Fresh buttermilk" },

    // Bakery (6)
    { name: "Bread", price: 40, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", stock: 150, unit: "piece", description: "Fresh bread loaf" },
    { name: "Buns", price: 30, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400", stock: 120, unit: "pack", description: "Soft buns" },
    { name: "Croissants", price: 80, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", stock: 60, unit: "pack", description: "Butter croissants" },
    { name: "Cookies", price: 100, category: "Bakery", brand: "Parle", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", stock: 80, unit: "pack", description: "Chocolate cookies" },
    { name: "Cake", price: 500, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", stock: 30, unit: "piece", description: "Fresh cake" },
    { name: "Muffins", price: 120, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", stock: 70, unit: "pack", description: "Blueberry muffins" },

    // Beverages (8)
    { name: "Orange Juice", price: 80, category: "Beverages", brand: "Tropicana", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", stock: 100, unit: "l", description: "Fresh orange juice" },
    { name: "Soda", price: 40, category: "Beverages", brand: "Thums Up", image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400", stock: 150, unit: "l", description: "Carbonated soda" },
    { name: "Coffee", price: 400, category: "Beverages", brand: "Tata Coffee", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", stock: 60, unit: "kg", description: "Premium coffee beans" },
    { name: "Tea", price: 300, category: "Beverages", brand: "Tata Tea", image: "https://images.unsplash.com/photo-1597318281699-33c9e5b5a7e3?w=400", stock: 80, unit: "kg", description: "Green tea leaves" },

    { name: "Coconut Water", price: 50, category: "Beverages", brand: "Dabur", image: "https://images.unsplash.com/photo-1585238341710-4a8e9e2a9fa5?w=400", stock: 70, unit: "l", description: "Fresh coconut water" },
    { name: "Lassi", price: 60, category: "Beverages", brand: "Amul", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400", stock: 80, unit: "l", description: "Sweet lassi" },
    { name: "Smoothie", price: 120, category: "Beverages", brand: "Tropicana", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400", stock: 50, unit: "l", description: "Mixed fruit smoothie" },

    // Snacks (6)
    { name: "Chips", price: 50, category: "Snacks", brand: "Lays India", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", stock: 120, unit: "pack", description: "Potato chips" },
    { name: "Biscuits", price: 40, category: "Snacks", brand: "Parle", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", stock: 150, unit: "pack", description: "Cream biscuits" },
    { name: "Namkeen", price: 60, category: "Snacks", brand: "Haldiram's", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", stock: 100, unit: "pack", description: "Spicy namkeen" },
    { name: "Popcorn", price: 80, category: "Snacks", brand: "Act II", image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400", stock: 90, unit: "pack", description: "Butter popcorn" },
    { name: "Mixed Nuts", price: 500, category: "Snacks", brand: "Nutraj", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400", stock: 60, unit: "kg", description: "Premium mixed nuts" },
    { name: "Chocolates", price: 200, category: "Snacks", brand: "Cadbury", image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400", stock: 80, unit: "pack", description: "Assorted chocolates" },

    // Meat (4)
    { name: "Chicken", price: 200, category: "Meat", brand: "Venky's", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400", stock: 100, unit: "kg", description: "Fresh chicken" },

    { name: "Fish", price: 400, category: "Meat", brand: "Licious", image: "https://images.unsplash.com/photo-1534766438357-2b3a7a6c3f9e?w=400", stock: 60, unit: "kg", description: "Fresh fish" },
    { name: "Prawns", price: 800, category: "Meat", brand: "Licious", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400", stock: 40, unit: "kg", description: "Fresh prawns" },

    // Seafood (3)
    { name: "Salmon", price: 1000, category: "Seafood", brand: "Licious", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", stock: 30, unit: "kg", description: "Fresh salmon" },
    { name: "Tuna", price: 900, category: "Seafood", brand: "Licious", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400", stock: 35, unit: "kg", description: "Fresh tuna" },
    { name: "Crab", price: 700, category: "Seafood", brand: "Licious", image: "https://images.unsplash.com/photo-1580217593608-61931cefc821?w=400", stock: 25, unit: "kg", description: "Fresh crab" },

    // Frozen (5)
    { name: "Ice Cream", price: 200, category: "Frozen", brand: "Amul", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", stock: 100, unit: "l", description: "Vanilla ice cream" },
    { name: "Frozen Vegetables", price: 150, category: "Frozen", brand: "McCain", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400", stock: 80, unit: "kg", description: "Mixed frozen vegetables" },
    { name: "Frozen Pizza", price: 300, category: "Frozen", brand: "McCain", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", stock: 60, unit: "piece", description: "Frozen pizza" },
    { name: "Frozen Fries", price: 120, category: "Frozen", brand: "McCain", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400", stock: 90, unit: "kg", description: "Frozen french fries" },
    { name: "Frozen Chicken", price: 250, category: "Frozen", brand: "Venky's", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400", stock: 70, unit: "kg", description: "Frozen chicken" },
];

// Sample users
const sampleUsers = [
    {
        name: "Admin User",
        email: "admin@freshora.com",
        password: "admin123",
        role: "admin",
    },
    {
        name: "Fresh Mart",
        email: "seller@freshmart.com",
        password: "seller123",
        role: "seller",
        storeName: "Fresh Mart",
        storeDescription: "Your one-stop shop for fresh vegetables and fruits",
        isVerified: true,
    },
    {
        name: "Regular User",
        email: "user@example.com",
        password: "user123",
        role: "user",
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create sample users
        console.log("👥 Creating sample users...");
        const createdUsers = await User.create(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Create products
        console.log("📦 Creating products...");
        const createdProducts = await Product.create(products);
        console.log(`✅ Created ${createdProducts.length} products`);

        console.log("\n🎉 Database seeded successfully!");
        console.log("\n📝 Sample Login Credentials:");
        console.log("Admin: admin@freshora.com / admin123");
        console.log("Seller: seller@freshmart.com / seller123");
        console.log("User: user@example.com / user123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
