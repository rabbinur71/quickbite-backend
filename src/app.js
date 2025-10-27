const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS Configuration
// In production, only allow your frontend domains.
// ⚠️ YOU MUST SET THESE IN RENDER ENVIRONMENT VARIABLES OR HARD-CODE THEM BELOW.
// Option 1 (Recommended): Use environment variable for allowed origins (see note below).
// Option 2: Hard-code your frontend URLs (used here for clarity).

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://quickbite-frontend.onrender.com", // ← Replace with your actual Render frontend URL
          // 'https://www.yourcustomdomain.com',     // ← Uncomment & add if you have a custom domain
        ]
      : [
          "http://localhost:3000", // React default
          "http://localhost:5173", // Vite default
          "http://127.0.0.1:5173",
        ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
app.use("/uploads", express.static("src/uploads"));

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "QuickBite API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Test database connection route
app.get("/api/test-db", async (req, res) => {
  try {
    const db = require("./config/database");
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully!",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("DB test failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu-items", require("./routes/menuRoutes"));
app.use("/api/special-orders", require("./routes/specialOrdersRoutes"));
app.use("/api/validation", require("./routes/validationRoutes"));

// 404 handler for /api routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
