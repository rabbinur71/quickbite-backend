const express = require("express");
const {
  getAllSpecialOrders,
  getSpecialOrders,
  createSpecialOrder,
  updateSpecialOrder,
  deleteSpecialOrder,
} = require("../controllers/specialOrdersController");
const { authenticateToken } = require("../middleware/auth");
const { uploadMultiple } = require("../middleware/upload");

const router = express.Router();

// Public route
router.get("/", getSpecialOrders);

// Protected admin routes
router.get("/admin", authenticateToken, getAllSpecialOrders);
router.post("/", authenticateToken, uploadMultiple, createSpecialOrder);
router.put("/:id", authenticateToken, updateSpecialOrder);
router.delete("/:id", authenticateToken, deleteSpecialOrder);

module.exports = router;
