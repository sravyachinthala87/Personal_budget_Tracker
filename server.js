require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/budgetDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ Error connecting to MongoDB:", err));

// Define Schema
const transactionSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  transactionType: String,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes

// ➤ Add Transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { amount, category, transactionType } = req.body;
    const newTransaction = new Transaction({ amount, category, transactionType });
    await newTransaction.save();
    res.status(201).json({ message: "Transaction Added!", transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// ➤ Get All Transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// ➤ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
