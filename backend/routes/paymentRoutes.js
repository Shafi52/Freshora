const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth");
const Order = require("../models/Order");

// Create payment intent
router.post("/create-payment-intent", auth, async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: "inr",
            metadata: {
                orderId: orderId || "",
                userId: req.user.id,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("Payment intent error:", error);
        res.status(500).json({ message: "Payment processing error", error: error.message });
    }
});

// Webhook to handle Stripe events
router.post("/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log("PaymentIntent was successful!", paymentIntent.id);

            // Update order payment status
            if (paymentIntent.metadata.orderId) {
                try {
                    await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
                        paymentStatus: "Paid",
                        paidAt: new Date(),
                    });
                } catch (error) {
                    console.error("Error updating order:", error);
                }
            }
            break;

        case "payment_intent.payment_failed":
            const failedPayment = event.data.object;
            console.log("PaymentIntent failed:", failedPayment.id);

            // Update order payment status
            if (failedPayment.metadata.orderId) {
                try {
                    await Order.findByIdAndUpdate(failedPayment.metadata.orderId, {
                        paymentStatus: "Failed",
                    });
                } catch (error) {
                    console.error("Error updating order:", error);
                }
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Get payment status
router.get("/status/:paymentIntentId", auth, async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            req.params.paymentIntentId
        );

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
        });
    } catch (error) {
        console.error("Error retrieving payment:", error);
        res.status(500).json({ message: "Error retrieving payment status", error: error.message });
    }
});

module.exports = router;
