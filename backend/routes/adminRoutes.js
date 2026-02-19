const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin only." });
    }
};

// Get Dashboard Stats
router.get("/stats", auth, admin, async (req, res) => {
    try {
        // Total Sales
        const orders = await Order.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Total Orders
        const totalOrders = orders.length;

        // Total Users
        const totalUsers = await User.countDocuments();

        // Total Products
        const totalProducts = await Product.countDocuments();

        // Sales data for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await Order.find({
            createdAt: { $gte: sevenDaysAgo },
        });

        // Group sales by date
        const salesByDate = {};
        recentOrders.forEach((order) => {
            const date = order.createdAt.toISOString().split("T")[0];
            if (!salesByDate[date]) {
                salesByDate[date] = 0;
            }
            salesByDate[date] += order.totalPrice;
        });

        const salesData = Object.keys(salesByDate)
            .sort()
            .map((date) => ({
                date,
                sales: salesByDate[date],
            }));

        // Order status distribution
        const orderStatusData = [
            {
                status: "Pending",
                count: orders.filter((o) => o.status === "Pending").length,
            },
            {
                status: "Confirmed",
                count: orders.filter((o) => o.status === "Confirmed").length,
            },
            {
                status: "Shipped",
                count: orders.filter((o) => o.status === "Shipped").length,
            },
            {
                status: "Delivered",
                count: orders.filter((o) => o.status === "Delivered").length,
            },
            {
                status: "Cancelled",
                count: orders.filter((o) => o.status === "Cancelled").length,
            },
        ];

        // Recent orders (last 10)
        const recentOrdersList = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalSales,
            totalOrders,
            totalUsers,
            totalProducts,
            salesData,
            orderStatusData,
            recentOrders: recentOrdersList,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Users
router.get("/users", auth, admin, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update User
router.put("/users/:id", auth, admin, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete User
router.delete("/users/:id", auth, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Orders (Admin)
router.get("/orders", auth, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Order Status
router.put("/orders/:id/status", auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("userId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create Product (Admin)
router.post("/products", auth, admin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Product (Admin)
router.put("/products/:id", auth, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Product (Admin)
router.delete("/products/:id", auth, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
