require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const express = require("express");
app.set("trust proxy", 1);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const HoldingsModel = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const UserModel = require("./model/UserModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

/* ================= CORS CONFIG (PRODUCTION SAFE) ================= */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ================= MARKET DATA ROUTES ================= */

app.get("/allHoldings", async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  const newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  await newOrder.save();
  res.send("Order saved!");
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await OrdersModel.find().sort({ _id: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= POSITIONS ================= */

app.get("/positions", async (req, res) => {
  try {
    const orders = await OrdersModel.find();
    const positionsMap = {};

    orders.forEach((order) => {
      const { name, qty, price, mode } = order;

      if (!positionsMap[name]) {
        positionsMap[name] = {
          product: "CNC",
          name,
          qty: 0,
          avg: 0,
          price,
          totalCost: 0,
        };
      }

      if (mode === "BUY") {
        positionsMap[name].qty += qty;
        positionsMap[name].totalCost += qty * price;
      } else if (mode === "SELL") {
        positionsMap[name].qty -= qty;
      }

      if (positionsMap[name].qty > 0) {
        positionsMap[name].avg =
          positionsMap[name].totalCost / positionsMap[name].qty;
      }
    });

    const positions = Object.values(positionsMap).filter(
      (p) => p.qty !== 0
    );

    res.json(positions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= HOLDINGS ================= */

app.get("/holdings", async (req, res) => {
  const orders = await OrdersModel.find({});
  const map = {};

  orders.forEach((o) => {
    if (!map[o.name]) {
      map[o.name] = {
        name: o.name,
        qty: 0,
        buyValue: 0,
        sellValue: 0,
      };
    }

    if (o.mode === "BUY") {
      map[o.name].qty += o.qty;
      map[o.name].buyValue += o.qty * o.price;
    } else {
      map[o.name].qty -= o.qty;
      map[o.name].sellValue += o.qty * o.price;
    }
  });

  const holdings = Object.values(map)
    .filter((h) => h.qty === 0 && h.buyValue > 0)
    .map((h) => ({
      name: h.name,
      invested: h.buyValue,
      returns: h.sellValue,
      pnl: h.sellValue - h.buyValue,
    }));

  res.json(holdings);
});

/* ================= AUTH ROUTES ================= */

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new UserModel({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// AUTH CHECK
app.get("/auth/check", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Logged out" });
});

/* ================= DATABASE CONNECT ================= */

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));