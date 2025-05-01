const express = require("express");
const router = express.Router();
const cors = require("cors");
const { MunicipalityModel, isUsingInMemoryData } = require("./db");

// Configure CORS for routes
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "null"],
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

// Apply CORS to all routes
router.use(cors(corsOptions));

// Simple logging middleware for routes
router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.path}`);
  next();
});

// API health check
router.get("/", cors(corsOptions), (req, res) => {
  res.json({
    status: "ok",
    message: "Municipality Budget API Server is running",
    timestamp: new Date().toISOString(),
    databaseStatus: isUsingInMemoryData()
      ? "using in-memory storage (MongoDB unavailable)"
      : "connected to MongoDB",
  });
});

// GET all municipalities
router.get("/municipalities", cors(corsOptions), async (req, res) => {
  try {
    let municipalities;

    if (isUsingInMemoryData()) {
      // For in-memory storage
      municipalities = await MunicipalityModel.find();
    } else {
      // For real MongoDB
      municipalities = await MunicipalityModel.find({}).select(
        "muniCode muniName province website totalBudget totalSpent"
      );
    }

    res.json({ success: true, data: municipalities });
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET municipality by code
router.get("/municipalities/:code", cors(corsOptions), async (req, res) => {
  try {
    const municipality = await MunicipalityModel.findOne({
      muniCode: req.params.code,
    });

    if (!municipality) {
      return res
        .status(404)
        .json({ success: false, message: "Municipality not found" });
    }

    res.json({ success: true, data: municipality });
  } catch (error) {
    console.error("Error fetching municipality:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST save/update municipality data
router.post("/saveFormData", cors(corsOptions), async (req, res) => {
  try {
    // Check for authentication if needed (uncomment and implement this)
    /*
    if (!req.isAuthenticated()) {
      return res.status(403).json({
        success: false,
        message: "Authentication required to save data",
      });
    }
    */

    const {
      muniCode,
      muniName,
      province,
      website,
      totalBudget,
      totalSpent,
      plans,
    } = req.body;

    // Validate required fields
    if (!muniCode || !muniName || !province) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Validate data types
    if (
      typeof muniCode !== "string" ||
      typeof muniName !== "string" ||
      typeof province !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data types for required fields",
      });
    }

    let operation;

    // Handle differently based on whether we're using MongoDB or in-memory storage
    if (isUsingInMemoryData()) {
      // In-memory implementation
      const inMemoryMunicipality = {
        muniCode,
        muniName,
        province,
        website,
        totalBudget,
        totalSpent,
        plans,
        updatedAt: new Date(),
        save: async function () {
          return this;
        },
      };

      // Check if it exists
      const exists = await MunicipalityModel.findOne({ muniCode });

      if (exists) {
        // Update existing
        await inMemoryMunicipality.save();
        operation = "updated";
      } else {
        // Create new
        inMemoryMunicipality.createdAt = new Date();
        await inMemoryMunicipality.save();
        operation = "inserted";
      }

      return res.status(exists ? 200 : 201).json({
        success: true,
        message: `Municipality data ${
          operation === "updated" ? "updated" : "saved"
        } successfully (in-memory)`,
        operation,
      });
    } else {
      // MongoDB implementation
      // Try to find existing municipality first
      const existingMunicipality = await MunicipalityModel.findOne({
        muniCode,
      });

      if (existingMunicipality) {
        // Update existing
        existingMunicipality.muniName = muniName;
        existingMunicipality.province = province;
        existingMunicipality.website = website;
        existingMunicipality.totalBudget = totalBudget;
        existingMunicipality.totalSpent = totalSpent;
        existingMunicipality.plans = plans;
        existingMunicipality.updatedAt = Date.now();

        await existingMunicipality.save();

        return res.json({
          success: true,
          message: "Municipality data updated successfully",
          operation: "updated",
        });
      }

      // Create new municipality
      const newMunicipality = new MunicipalityModel({
        muniCode,
        muniName,
        province,
        website,
        totalBudget,
        totalSpent,
        plans,
      });

      await newMunicipality.save();

      res.status(201).json({
        success: true,
        message: "Municipality data saved successfully",
        operation: "inserted",
      });
    }
  } catch (error) {
    console.error("Error saving municipality data:", error);

    // Check for mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate municipality code",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
