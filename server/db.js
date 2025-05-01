const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/municipality-budget";

// Flag to indicate if we're using in-memory data instead of real MongoDB
let usingInMemoryData = false;
// In-memory storage for when MongoDB is unavailable
const inMemoryStorage = {
  municipalities: [],
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    usingInMemoryData = false;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("⚠️ Using in-memory storage instead of MongoDB");
    usingInMemoryData = true;
    // Don't exit process, let the app continue with in-memory storage
    // process.exit(1);
  }
};

// Define Municipality Schema
const municipalitySchema = new mongoose.Schema({
  muniCode: { type: String, required: true, unique: true },
  muniName: { type: String, required: true },
  province: { type: String, required: true },
  website: { type: String },
  totalBudget: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  plans: [
    {
      category: { type: String, required: true },
      plan: { type: String, required: true },
      budget: { type: Number, default: 0 },
      actual: { type: Number, default: 0 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create or use existing model
const MunicipalityModel =
  mongoose.models.Municipality ||
  mongoose.model("Municipality", municipalitySchema);

// Mock implementation for when MongoDB is unavailable
const mockModel = {
  find: async () => {
    return inMemoryStorage.municipalities;
  },
  findOne: async ({ muniCode }) => {
    return (
      inMemoryStorage.municipalities.find((m) => m.muniCode === muniCode) ||
      null
    );
  },
  // Mock implementation that simulates saving a municipality
  save: async function () {
    const existingIndex = inMemoryStorage.municipalities.findIndex(
      (m) => m.muniCode === this.muniCode
    );

    if (existingIndex >= 0) {
      inMemoryStorage.municipalities[existingIndex] = { ...this };
      this.updatedAt = new Date();
      return this;
    } else {
      this.createdAt = new Date();
      this.updatedAt = new Date();
      inMemoryStorage.municipalities.push({ ...this });
      return this;
    }
  },
};

// Export real or mock model based on connection status
const getModel = () => {
  if (usingInMemoryData) {
    console.log("Using mock municipality model");
    return mockModel;
  }
  return MunicipalityModel;
};

module.exports = {
  connectDB,
  get MunicipalityModel() {
    return getModel();
  },
  isUsingInMemoryData: () => usingInMemoryData,
};
