const express = require("express");
const {
  getAllMenuItems,
  getAvailableMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { authenticateToken } = require("../middleware/auth");
const { uploadMultiple } = require("../middleware/upload");

const router = express.Router();

// Public route
router.get("/available", getAvailableMenuItems);

// Protected routes
router.get("/", authenticateToken, getAllMenuItems);
router.post("/", authenticateToken, uploadMultiple, createMenuItem); // Add upload middleware
router.put("/:id", authenticateToken, updateMenuItem);
router.delete("/:id", authenticateToken, deleteMenuItem);

module.exports = router;
