const router = require("express").Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const seller = require("../middleware/seller");

// ─── Public: Registered Seller Stores ───────────────────────────────────────
// Returns store names of all registered sellers (public, no auth required)
router.get("/public", async (req, res) => {
    try {
        const sellers = await User.find({ role: "seller", storeName: { $exists: true, $ne: "" } })
            .select("storeName");
        res.json(sellers.map(s => s.storeName));
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// ─────────────────────────────────────────────────────────────────────────────

// Get seller dashboard stats
router.get("/dashboard", seller, async (req, res) => {
    try {
        const sellerId = req.user.id;

        // Get seller's products
        const products = await Product.find({ seller: sellerId });
        const totalProducts = products.length;
        const approvedProducts = products.filter(p => p.isApproved).length;
        const pendingProducts = products.filter(p => !p.isApproved).length;

        // Get seller's orders (orders containing seller's products)
        const orders = await Order.find({ "items.product": { $in: products.map(p => p._id) } })
            .populate("items.product");

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
            // Calculate revenue only from seller's products in each order
            const sellerItems = order.items.filter(item =>
                products.some(p => p._id.toString() === item.product._id.toString())
            );
            return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        res.json({
            totalProducts,
            approvedProducts,
            pendingProducts,
            totalOrders,
            totalRevenue,
            recentProducts: products.slice(0, 5),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get seller analytics (sales trends)
router.get("/analytics", seller, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const products = await Product.find({ seller: sellerId });
        const productIds = products.map(p => p._id);

        // Get orders from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await Order.find({
            "items.product": { $in: productIds },
            createdAt: { $gte: thirtyDaysAgo }
        }).populate("items.product");

        // Group by date
        const salesByDate = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            const sellerItems = order.items.filter(item =>
                productIds.some(id => id.toString() === item.product._id.toString())
            );
            const revenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            if (!salesByDate[date]) {
                salesByDate[date] = { date, revenue: 0, orders: 0 };
            }
            salesByDate[date].revenue += revenue;
            salesByDate[date].orders += 1;
        });

        const salesData = Object.values(salesByDate).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        res.json({ salesData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get seller's products
router.get("/products", seller, async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id })
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get low stock products
router.get("/inventory/low-stock", seller, async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;
        const products = await Product.find({
            seller: req.user.id,
            stock: { $lte: threshold, $gt: 0 }
        }).sort({ stock: 1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get out of stock products
router.get("/inventory/out-of-stock", seller, async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user.id,
            stock: 0
        }).sort({ updatedAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get seller's orders
router.get("/orders", seller, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const products = await Product.find({ seller: sellerId });
        const productIds = products.map(p => p._id);

        const orders = await Order.find({
            "items.product": { $in: productIds }
        })
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        // Filter to only include seller's items in each order
        const sellerOrders = orders.map(order => {
            const sellerItems = order.items.filter(item =>
                productIds.some(id => id.toString() === item.product._id.toString())
            );

            return {
                ...order.toObject(),
                items: sellerItems,
                sellerTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        }).filter(order => order.items.length > 0);

        res.json(sellerOrders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get single product details
router.get("/products/:id", seller, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Create product (seller)
router.post("/products", seller, async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            seller: req.user.id,
            isApproved: false, // Needs admin approval
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update seller's product
router.put("/products/:id", seller, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        Object.assign(product, req.body);
        await product.save();

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete seller's product
router.delete("/products/:id", seller, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            seller: req.user.id
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
