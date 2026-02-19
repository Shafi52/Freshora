require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    // Vegetables (10)
    { name: "Fresh Tomatoes", price: 40, category: "Vegetables", brand: "FreshFarm", image: "/images/products/tomatoes.jpg", description: "Fresh red tomatoes", stock: 100, unit: "kg" },
    { name: "Organic Carrots", price: 50, category: "Vegetables", brand: "OrganicPro", image: "/images/products/carrots.jpg", description: "Organic carrots", stock: 80, unit: "kg" },
    { name: "Fresh Spinach", price: 30, category: "Vegetables", brand: "GreenLeaf", image: "/images/products/spinach.jpg", description: "Fresh green spinach", stock: 60, unit: "kg" },
    { name: "Potatoes", price: 25, category: "Vegetables", brand: "FreshFarm", image: "/images/products/potatoes.jpg", description: "Farm fresh potatoes", stock: 150, unit: "kg" },
    { name: "Onions", price: 35, category: "Vegetables", brand: "FreshFarm", image: "/images/products/onions.jpg", description: "Fresh onions", stock: 120, unit: "kg" },
    { name: "Bell Peppers", price: 60, category: "Vegetables", brand: "OrganicPro", image: "/images/products/bell-peppers.jpg", description: "Colorful bell peppers", stock: 50, unit: "kg" },
    { name: "Broccoli", price: 70, category: "Vegetables", brand: "GreenLeaf", image: "/images/products/broccoli.jpg", description: "Fresh broccoli", stock: 40, unit: "kg" },
    { name: "Cauliflower", price: 45, category: "Vegetables", brand: "FreshFarm", image: "/images/products/cauliflower.jpg", description: "White cauliflower", stock: 70, unit: "kg" },
    { name: "Cucumber", price: 30, category: "Vegetables", brand: "FreshFarm", image: "/images/products/cucumber.jpg", description: "Fresh cucumber", stock: 90, unit: "kg" },
    { name: "Lettuce", price: 40, category: "Vegetables", brand: "GreenLeaf", image: "/images/products/lettuce.jpg", description: "Crispy lettuce", stock: 55, unit: "kg" },

    // Fruits (10)
    { name: "Fresh Apples", price: 120, category: "Fruits", brand: "FruitKing", image: "/images/products/apples.jpg", description: "Crispy red apples", stock: 100, unit: "kg" },
    { name: "Bananas", price: 50, category: "Fruits", brand: "TropicalFresh", image: "/images/products/bananas.jpg", description: "Fresh yellow bananas", stock: 150, unit: "dozen" },
    { name: "Oranges", price: 80, category: "Fruits", brand: "CitrusFresh", image: "/images/products/oranges.jpg", description: "Juicy oranges", stock: 120, unit: "kg" },
    { name: "Strawberries", price: 200, category: "Fruits", brand: "BerryBest", image: "/images/products/strawberries.jpg", description: "Sweet strawberries", stock: 40, unit: "kg" },
    { name: "Grapes", price: 100, category: "Fruits", brand: "FruitKing", image: "/images/products/grapes.jpg", description: "Fresh grapes", stock: 60, unit: "kg" },
    { name: "Mangoes", price: 150, category: "Fruits", brand: "TropicalFresh", image: "/images/products/mangoes.jpg", description: "Sweet mangoes", stock: 80, unit: "kg" },
    { name: "Watermelon", price: 40, category: "Fruits", brand: "FruitKing", image: "/images/products/watermelon.jpg", description: "Fresh watermelon", stock: 50, unit: "piece" },
    { name: "Pineapple", price: 60, category: "Fruits", brand: "TropicalFresh", image: "/images/products/pineapple.jpg", description: "Sweet pineapple", stock: 45, unit: "piece" },
    { name: "Papaya", price: 50, category: "Fruits", brand: "TropicalFresh", image: "/images/products/papaya.jpg", description: "Ripe papaya", stock: 55, unit: "kg" },
    { name: "Pomegranate", price: 120, category: "Fruits", brand: "FruitKing", image: "/images/products/pomegranate.jpg", description: "Fresh pomegranate", stock: 40, unit: "kg" },

    // Dairy (7)
    { name: "Fresh Milk", price: 60, category: "Dairy", brand: "Amul", image: "/images/products/milk.jpg", description: "Full cream milk", stock: 200, unit: "l" },
    { name: "Cheese Slices", price: 150, category: "Dairy", brand: "Britannia", image: "/images/products/cheese.jpg", description: "Cheese slices", stock: 80, unit: "pack" },
    { name: "Yogurt", price: 50, category: "Dairy", brand: "Amul", image: "/images/products/yogurt.jpg", description: "Fresh yogurt", stock: 100, unit: "pack" },
    { name: "Butter", price: 120, category: "Dairy", brand: "Amul", image: "/images/products/butter.jpg", description: "Salted butter", stock: 90, unit: "pack" },
    { name: "Paneer", price: 200, category: "Dairy", brand: "Mother Dairy", image: "/images/products/paneer.jpg", description: "Fresh paneer", stock: 60, unit: "kg" },
    { name: "Eggs", price: 80, category: "Dairy", brand: "Mother Dairy", image: "/images/products/eggs.jpg", description: "Farm fresh eggs", stock: 150, unit: "dozen" },
    { name: "Fresh Cream", price: 100, category: "Dairy", brand: "Amul", image: "/images/products/cream.jpg", description: "Fresh cream", stock: 70, unit: "pack" },

    // Bakery (6)
    { name: "Bread", price: 40, category: "Bakery", brand: "Britannia", image: "/images/products/bread.jpg", description: "Whole wheat bread", stock: 100, unit: "pack" },
    { name: "Croissants", price: 80, category: "Bakery", brand: "Monginis", image: "/images/products/croissants.jpg", description: "Butter croissants", stock: 50, unit: "pack" },
    { name: "Chocolate Cake", price: 300, category: "Bakery", brand: "Monginis", image: "/images/products/cake.jpg", description: "Chocolate cake", stock: 30, unit: "piece" },
    { name: "Cookies", price: 60, category: "Bakery", brand: "Britannia", image: "/images/products/cookies.jpg", description: "Chocolate cookies", stock: 80, unit: "pack" },
    { name: "Muffins", price: 100, category: "Bakery", brand: "Monginis", image: "/images/products/muffins.jpg", description: "Blueberry muffins", stock: 40, unit: "pack" },
    { name: "Bagels", price: 70, category: "Bakery", brand: "Britannia", image: "/images/products/bagels.jpg", description: "Plain bagels", stock: 60, unit: "pack" },

    // Beverages (7)
    { name: "Orange Juice", price: 120, category: "Beverages", brand: "Tropicana", image: "/images/products/orange-juice.jpg", description: "Fresh orange juice", stock: 100, unit: "l" },
    { name: "Green Tea", price: 200, category: "Beverages", brand: "Lipton", image: "/images/products/green-tea.jpg", description: "Green tea bags", stock: 80, unit: "pack" },
    { name: "Coffee", price: 300, category: "Beverages", brand: "Nescafe", image: "/images/products/coffee.jpg", description: "Instant coffee", stock: 70, unit: "pack" },
    { name: "Mineral Water", price: 20, category: "Beverages", brand: "Bisleri", image: "/images/products/water.jpg", description: "Mineral water", stock: 200, unit: "l" },
    { name: "Cola", price: 40, category: "Beverages", brand: "Coca-Cola", image: "/images/products/cola.jpg", description: "Cola drink", stock: 150, unit: "l" },
    { name: "Energy Drink", price: 100, category: "Beverages", brand: "Red Bull", image: "/images/products/energy-drink.jpg", description: "Energy drink", stock: 60, unit: "pack" },
    { name: "Lemonade", price: 50, category: "Beverages", brand: "Tropicana", image: "/images/products/lemonade.jpg", description: "Fresh lemonade", stock: 80, unit: "l" },

    // Snacks (5)
    { name: "Potato Chips", price: 40, category: "Snacks", brand: "Lays", image: "/images/products/chips.jpg", description: "Crispy potato chips", stock: 120, unit: "pack" },
    { name: "Popcorn", price: 60, category: "Snacks", brand: "Act II", image: "/images/products/popcorn.jpg", description: "Butter popcorn", stock: 80, unit: "pack" },
    { name: "Chocolate Bar", price: 50, category: "Snacks", brand: "Cadbury", image: "/images/products/chocolate.jpg", description: "Milk chocolate", stock: 100, unit: "pack" },
    { name: "Mixed Nuts", price: 200, category: "Snacks", brand: "Nutraj", image: "/images/products/nuts.jpg", description: "Mixed dry fruits", stock: 60, unit: "pack" },
    { name: "Biscuits", price: 30, category: "Snacks", brand: "Parle", image: "/images/products/biscuits.jpg", description: "Glucose biscuits", stock: 150, unit: "pack" },

    // Meat (3)
    { name: "Chicken Breast", price: 250, category: "Meat", brand: "Venky's", image: "/images/products/chicken.jpg", description: "Fresh chicken breast", stock: 50, unit: "kg" },
    { name: "Mutton", price: 500, category: "Meat", brand: "FreshMeat", image: "/images/products/mutton.jpg", description: "Fresh mutton", stock: 30, unit: "kg" },
    { name: "Sausages", price: 180, category: "Meat", brand: "Venky's", image: "/images/products/sausages.jpg", description: "Chicken sausages", stock: 60, unit: "pack" },

    // Seafood (3)
    { name: "Salmon", price: 600, category: "Seafood", brand: "SeaFresh", image: "/images/products/salmon.jpg", description: "Fresh salmon", stock: 25, unit: "kg" },
    { name: "Prawns", price: 400, category: "Seafood", brand: "OceanCatch", image: "/images/products/prawns.jpg", description: "Fresh prawns", stock: 40, unit: "kg" },
    { name: "Tuna", price: 350, category: "Seafood", brand: "SeaFresh", image: "/images/products/tuna.jpg", description: "Fresh tuna", stock: 30, unit: "kg" },

    // Frozen (5)
    { name: "Frozen Peas", price: 80, category: "Frozen", brand: "McCain", image: "/images/products/frozen-peas.jpg", description: "Frozen green peas", stock: 100, unit: "pack" },
    { name: "Ice Cream", price: 150, category: "Frozen", brand: "Amul", image: "/images/products/ice-cream.jpg", description: "Vanilla ice cream", stock: 80, unit: "pack" },
    { name: "Frozen Pizza", price: 200, category: "Frozen", brand: "McCain", image: "/images/products/pizza.jpg", description: "Frozen pizza", stock: 50, unit: "piece" },
    { name: "French Fries", price: 100, category: "Frozen", brand: "McCain", image: "/images/products/fries.jpg", description: "Frozen french fries", stock: 90, unit: "pack" },
    { name: "Frozen Corn", price: 70, category: "Frozen", brand: "McCain", image: "/images/products/corn.jpg", description: "Frozen sweet corn", stock: 70, unit: "pack" },
];

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        await Product.insertMany(products);
        console.log(`✅ Successfully added ${products.length} products with LOCAL images!`);

        console.log("\n📦 Products by Category:");
        const categories = [...new Set(products.map((p) => p.category))];
        categories.forEach((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            console.log(`   ${cat}: ${count} products`);
        });

        console.log("\n🖼️  All products now use local images from /images/products/");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Error:", err);
        process.exit(1);
    });
