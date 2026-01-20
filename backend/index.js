require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cors=require("cors");

const HoldingsModel = require('./model/HoldingsModel');

const { PositionsModel } = require("./model/PositionsModel");
const {OrdersModel}=require("./model/OrdersModel");
const UserModel = require("./model/UserModel");


const PORT=process.env.PORT || 3002;
const uri=process.env.MONGO_URL;

const app=express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());



app.get('/allHoldings',async(req,res)=>{
    let allHoldings=await HoldingsModel.find({});
    res.json(allHoldings);
})

app.get('/allPositions',async(req,res)=>{
    let allPositions=await PositionsModel.find({});
    res.json(allPositions);
})

app.post("/newOrder",async(req,res)=>{
  let newOrder=new OrdersModel({
     name: req.body.name,
    qty:req.body.qty,
    price:req.body.price,
    mode: req.body.mode,
  });

  newOrder.save();
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


app.get("/positions", async (req, res) => {
  try {
    const orders = await OrdersModel.find();

    const positionsMap = {};

    orders.forEach(order => {
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

    // remove closed positions (qty = 0)
    const positions = Object.values(positionsMap).filter(
      p => p.qty !== 0
    );

    res.json(positions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.get("/holdings", async (req, res) => {
  const orders = await OrdersModel.find({});

  const map = {};

  orders.forEach(o => {
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
    .filter(h => h.qty === 0 && h.buyValue > 0)
    .map(h => ({
      name: h.name,
      invested: h.buyValue,
      returns: h.sellValue,
      pnl: h.sellValue - h.buyValue,
    }));

  res.json(holdings);
});



//signup
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

    // 🔐 CREATE TOKEN
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

res.status(201).json({
  message: "Signup successful",
});

  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});


//login

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 CREATE TOKEN
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

res.json({
  message: "Login successful",
});

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

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

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected!");
    app.listen(process.env.PORT || 3002, () =>
      console.log("Server started")
    );
  })
  .catch(err => console.error(err));