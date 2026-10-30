
const express = require("express");
const cors = require("cors");
const requestIp = require("request-ip");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const path = require("path");

// Load environment variables
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const app = express();

// Environment variables
const MONGO_CONNECT = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3030;

// Validate MongoDB connection string
if (!MONGO_CONNECT) {
  console.error("Error: MONGODB_URI is missing.");
  process.exit(1);
}

if (!/^mongodb(\+srv)?:\/\//.test(MONGO_CONNECT)) {
  console.error("Error: Invalid MongoDB connection string.");
  process.exit(1);
}

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(requestIp.mw());

// Import models and routes
const User = require("./models/user");
const publicRoutes = require("./routes/public");

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully!",
  });
});

// User tracking middleware
app.use(async (req, res, next) => {
  try {
    const clientIp = req.clientIp || "unknown";

    let user = await User.findOne({ ip: clientIp });

    if (!user) {
      const useragent = req.headers["user-agent"] || "";

      const parser = new UAParser(useragent);
      const parserResults = parser.getResult();

      user = new User({
        ip: clientIp,
        deviceInfo: parserResults,
        activity: [],
      });

      await user.save();
    }

    req.users = user;
    next();
  } catch (error) {
    console.error("User tracking error:", error);

    // Continue API requests even if tracking fails
    next();
  }
});

// API routes
app.use(publicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Connect MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_CONNECT);

    console.log("MongoDB Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
