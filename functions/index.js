const { onRequest } = require("firebase-functions/v2/https"); // v2 for better features
const logger = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Allow max 10 instances
app.set("maxListeners", 10);

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Firebase Functions + Stripe is ready!" });
});

// Create PaymentIntent
app.post("/payment/create", async (req, res) => {
  try {
    const { total } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    logger.error("Stripe payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Export as Firebase Function
exports.api = onRequest(app);
