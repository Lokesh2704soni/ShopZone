const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully! ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "ShopZone Backend is running 🚀",
  });
});

// API Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "ShopZone API is working perfectly!",
  });
});


// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



// Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
  {
    userId: user._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



// Cart API

// Add product to cart
app.post("/api/cart/add", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const {
      productId,
      title,
      price,
      image,
    } = req.body;

    if (!productId || !title || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Product information is required",
      });
    }

    let cart = await Cart.findOne({
      userId: decoded.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        userId: decoded.userId,
        items: [
          {
            productId,
            title,
            price,
            image,
            quantity: 1,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          productId,
          title,
          price,
          image,
          quantity: 1,
        });
      }

      await cart.save();
    }

    res.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add cart error:", error.message);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// Get user's cart
app.get("/api/cart", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const cart = await Cart.findOne({
      userId: decoded.userId,
    });

    res.json({
      success: true,
      cart: cart || {
        userId: decoded.userId,
        items: [],
      },
    });
  } catch (error) {
    console.error("Get cart error:", error.message);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// Remove product from cart
app.delete(
  "/api/cart/remove/:productId",
  async (req, res) => {
    try {
      const token =
        req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Please login first",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const cart = await Cart.findOne({
        userId: decoded.userId,
      });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      cart.items = cart.items.filter(
        (item) =>
          item.productId !==
          Number(req.params.productId)
      );

      await cart.save();

      res.json({
        success: true,
        message: "Product removed from cart",
        cart,
      });
    } catch (error) {
      console.error(
        "Remove cart error:",
        error.message
      );

      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }
);


// Increase cart quantity
app.put("/api/cart/increase/:productId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const cart = await Cart.findOne({
      userId: decoded.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId === Number(req.params.productId)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity += 1;

    await cart.save();

    res.json({
      success: true,
      message: "Quantity increased",
      cart,
    });
  } catch (error) {
    console.error(
      "Increase quantity error:",
      error.message
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// Decrease cart quantity
app.put("/api/cart/decrease/:productId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const cart = await Cart.findOne({
      userId: decoded.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId === Number(req.params.productId)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          item.productId !==
          Number(req.params.productId)
      );
    }

    await cart.save();

    res.json({
      success: true,
      message: "Quantity decreased",
      cart,
    });
  } catch (error) {
    console.error(
      "Decrease quantity error:",
      error.message
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// Clear cart
app.delete("/api/cart/clear", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const cart = await Cart.findOne({
      userId: decoded.userId,
    });

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart already empty",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error(
      "Clear cart error:",
      error.message
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// =============================
// ORDER API
// =============================

// Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const {
      total,
      paymentMethod,
      address,
      items,
    } = req.body;

    if (
      !total ||
      !paymentMethod ||
      !address ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order information is incomplete",
      });
    }

    const order = await Order.create({
      userId: decoded.userId,

      orderId: `SZ-${Date.now()}`,

      items,

      total,

      paymentMethod,

      address,

      status: "Ordered",
    });

    // Clear cart after successful order
    const cart = await Cart.findOne({
      userId: decoded.userId,
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error.message
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// Get logged-in user's orders
app.get("/api/orders", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const orders = await Order.find({
      userId: decoded.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error.message
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

// Cancel Order
app.put("/api/orders/cancel/:orderId", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId: decoded.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    order.status = "Cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Cancel order error:",
      error.message
    );

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});


// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`ShopZone server running on port ${PORT}`);
});