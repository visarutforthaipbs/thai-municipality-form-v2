const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const apiRoutes = require("./routes");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configure CORS with environment flexibility
const corsOptions = {
  origin: function (origin, callback) {
    // For Render deployment or other production environments
    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.CLIENT_URL, // Will be set in Render's environment variables
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps, curl requests, etc)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log blocked origins for debugging
      console.log(`CORS blocked request from origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  credentials: true,
};

// Apply CORS middleware before other middlewares
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Municipality Budget API Server is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `CORS configured for: ${process.env.CLIENT_URL || "local development"}`
  );
});

module.exports = app;
