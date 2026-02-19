require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    // Vegetables (8 products)

    { name: "Organic Carrots", description: "Crunchy and sweet organic carrots", price: 50, category: "Vegetables", brand: "OrganicPro", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400", stock: 120, unit: "kg" },
    { name: "Fresh Spinach", description: "Nutrient-rich fresh spinach leaves", price: 30, category: "Vegetables", brand: "GreenLeaf", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", stock: 100, unit: "kg" },
    { name: "Potatoes", description: "Fresh farm potatoes, versatile for all dishes", price: 25, category: "Vegetables", brand: "FreshFarm", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", stock: 200, unit: "kg" },

    { name: "Bell Peppers", description: "Colorful bell peppers, rich in vitamins", price: 80, category: "Vegetables", brand: "GreenLeaf", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", stock: 90, unit: "kg" },
    { name: "Broccoli", description: "Fresh green broccoli, packed with nutrients", price: 60, category: "Vegetables", brand: "OrganicPro", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400", stock: 75, unit: "kg" },

    { name: "Cucumber", description: "Fresh green cucumber", price: 30, category: "Vegetables", brand: "FreshFarm", image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400", stock: 100, unit: "kg" },
    { name: "Lettuce", description: "Crisp iceberg lettuce", price: 40, category: "Vegetables", brand: "GreenLeaf", image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400", stock: 80, unit: "piece" },

    // Fruits (10 products)
    { name: "Fresh Apples", description: "Crisp and sweet apples", price: 120, category: "Fruits", brand: "FruitKing", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", stock: 150, unit: "kg" },
    { name: "Bananas", description: "Ripe yellow bananas, rich in potassium", price: 50, category: "Fruits", brand: "TropicalFresh", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", stock: 200, unit: "dozen" },
    { name: "Oranges", description: "Juicy oranges packed with Vitamin C", price: 80, category: "Fruits", brand: "CitrusFresh", image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400", stock: 130, unit: "kg" },
    { name: "Strawberries", description: "Sweet and fresh strawberries", price: 200, category: "Fruits", brand: "BerryBest", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400", stock: 60, unit: "kg" },

    { name: "Mangoes", description: "Sweet and juicy mangoes", price: 150, category: "Fruits", brand: "TropicalFresh", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", stock: 100, unit: "kg" },

    { name: "Pineapple", description: "Sweet tropical pineapple", price: 60, category: "Fruits", brand: "TropicalFresh", image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400", stock: 70, unit: "piece" },
    { name: "Papaya", description: "Ripe sweet papaya", price: 40, category: "Fruits", brand: "TropicalFresh", image: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400", stock: 70, unit: "kg" },
    { name: "Pomegranate", description: "Juicy pomegranate", price: 180, category: "Fruits", brand: "FruitKing", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400", stock: 60, unit: "kg" },

    // Dairy (7 products)
    { name: "Fresh Milk", description: "Pure and fresh cow milk", price: 60, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", stock: 200, unit: "l" },
    { name: "Cheddar Cheese", description: "Premium cheddar cheese", price: 400, category: "Dairy", brand: "Britannia", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400", stock: 50, unit: "kg" },
    { name: "Greek Yogurt", description: "Creamy Greek yogurt", price: 120, category: "Dairy", brand: "Mother Dairy", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", stock: 100, unit: "kg" },
    { name: "Butter", description: "Fresh dairy butter", price: 500, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400", stock: 80, unit: "kg" },
    { name: "Paneer", description: "Fresh cottage cheese", price: 350, category: "Dairy", brand: "Mother Dairy", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400", stock: 60, unit: "kg" },
    { name: "Eggs", description: "Farm fresh eggs", price: 60, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", stock: 200, unit: "dozen" },
    { name: "Cream", description: "Fresh dairy cream", price: 200, category: "Dairy", brand: "Amul", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400", stock: 80, unit: "l" },

    // Bakery (6 products)
    { name: "Whole Wheat Bread", description: "Freshly baked whole wheat bread", price: 40, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", stock: 100, unit: "piece" },
    { name: "Croissants", description: "Buttery and flaky croissants", price: 150, category: "Bakery", brand: "Monginis", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", stock: 50, unit: "pack" },
    { name: "Chocolate Cake", description: "Rich chocolate cake", price: 500, category: "Bakery", brand: "Monginis", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", stock: 30, unit: "piece" },
    { name: "Cookies", description: "Assorted butter cookies", price: 100, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", stock: 120, unit: "pack" },
    { name: "Muffins", description: "Chocolate chip muffins", price: 120, category: "Bakery", brand: "Monginis", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", stock: 80, unit: "pack" },
    { name: "Bagels", description: "Fresh baked bagels", price: 100, category: "Bakery", brand: "Britannia", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", stock: 60, unit: "pack" },

    // Beverages (7 products)
    { name: "Orange Juice", description: "Fresh squeezed orange juice", price: 80, category: "Beverages", brand: "Tropicana", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", stock: 100, unit: "l" },
    { name: "Green Tea", description: "Premium green tea bags", price: 200, category: "Beverages", brand: "Lipton", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400", stock: 150, unit: "pack" },
    { name: "Coffee Beans", description: "Arabica coffee beans", price: 600, category: "Beverages", brand: "Nescafe", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", stock: 80, unit: "kg" },
    { name: "Mineral Water", description: "Pure mineral water", price: 20, category: "Beverages", brand: "Bisleri", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400", stock: 300, unit: "l" },
    { name: "Coca Cola", description: "Refreshing cola drink", price: 40, category: "Beverages", brand: "Coca-Cola", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", stock: 200, unit: "l" },


    // Snacks (5 products)
    { name: "Potato Chips", description: "Crispy salted potato chips", price: 20, category: "Snacks", brand: "Lays", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", stock: 200, unit: "pack" },
    { name: "Popcorn", description: "Butter flavored popcorn", price: 50, category: "Snacks", brand: "Act II", image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400", stock: 150, unit: "pack" },
    { name: "Chocolate Bar", description: "Milk chocolate bar", price: 30, category: "Snacks", brand: "Cadbury", image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400", stock: 250, unit: "piece" },
    { name: "Nuts Mix", description: "Roasted mixed nuts", price: 300, category: "Snacks", brand: "Nutraj", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400", stock: 100, unit: "kg" },
    { name: "Biscuits", description: "Cream biscuits", price: 40, category: "Snacks", brand: "Parle", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", stock: 180, unit: "pack" },

    // Meat (3 products)
    { name: "Chicken Breast", description: "Fresh boneless chicken breast", price: 250, category: "Meat", brand: "Venky's", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400", stock: 80, unit: "kg" },


    // Seafood (3 products)
    { name: "Fresh Salmon", description: "Premium Atlantic salmon", price: 800, category: "Seafood", brand: "SeaFresh", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", stock: 40, unit: "kg" },
    { name: "Prawns", description: "Large fresh prawns", price: 600, category: "Seafood", brand: "SeaFresh", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400", stock: 60, unit: "kg" },
    { name: "Tuna", description: "Fresh tuna fish", price: 500, category: "Seafood", brand: "OceanCatch", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400", stock: 50, unit: "kg" },

    // Frozen (5 products)

    { name: "Ice Cream", description: "Vanilla ice cream", price: 200, category: "Frozen", brand: "Amul", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", stock: 100, unit: "l" },
    { name: "Frozen Pizza", description: "Cheese burst pizza", price: 300, category: "Frozen", brand: "McCain", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", stock: 80, unit: "piece" },
    { name: "Frozen French Fries", description: "Crispy frozen french fries", price: 150, category: "Frozen", brand: "McCain", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400", stock: 150, unit: "kg" },
    { name: "Frozen Corn", description: "Sweet corn kernels", price: 90, category: "Frozen", brand: "McCain", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400", stock: 110, unit: "kg" },
];

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        await Product.insertMany(products);
        console.log(`✅ Successfully added ${products.length} products!`);

        console.log("\n📦 Products by Category:");
        const categories = [...new Set(products.map((p) => p.category))];
        categories.forEach((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            console.log(`   ${cat}: ${count} products`);
        });

        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Error:", err);
        process.exit(1);
    });
