const router = require("express").Router();
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

// Get user's cart
router.get("/", auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Add item to cart
router.post("/", auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate("items.product");

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update cart item quantity
router.put("/:productId", auth, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product");

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Remove item from cart
router.delete("/:productId", auth, async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate("items.product");

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Clear cart
router.delete("/", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
