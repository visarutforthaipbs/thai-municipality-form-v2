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

// Simplified CORS configuration - allow all origins during development
app.use(
  cors({
    origin: true, // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

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
  console.log(`Server is accepting requests from all origins (CORS enabled)`);
});

module.exports = app;
