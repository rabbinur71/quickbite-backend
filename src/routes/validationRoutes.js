const express = require("express");
const router = express.Router();

// Simple address validation endpoint
router.post("/validate-address", (req, res) => {
  const { street, city, state, zipCode } = req.body;

  // Basic validation - in a real app, use a service like Google Maps API
  const errors = [];

  if (!street || street.trim().length < 5) {
    errors.push("Street address appears to be invalid");
  }

  if (!city || city.trim().length < 2) {
    errors.push("City appears to be invalid");
  }

  if (!state || state.trim().length < 2) {
    errors.push("State appears to be invalid");
  }

  if (!zipCode || !/^\d{4}$/.test(zipCode) || parseInt(zipCode, 10) < 1000) {
    errors.push("Please enter a valid Bangladesh postal code (e.g., 1205).");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      valid: false,
      errors,
    });
  }

  res.json({
    valid: true,
    message: "Address appears to be valid",
  });
});

module.exports = router;
