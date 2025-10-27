const { query } = require("../config/database");

// Get all special orders (for admin)
const getAllSpecialOrders = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM special_orders ORDER BY created_at DESC`
    );

    // Convert image_urls to full URLs
    const ordersWithFullUrls = result.rows.map((order) => ({
      ...order,
      image_urls: order.image_urls
        ? order.image_urls.map(
            (url) => `${req.protocol}://${req.get("host")}${url}`
          )
        : [],
    }));

    res.json(ordersWithFullUrls);
  } catch (error) {
    console.error("Get special orders error:", error);
    res.status(500).json({ error: "Failed to fetch special orders" });
  }
};

// Get available special orders (for public)
const getSpecialOrders = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM special_orders WHERE is_available = true ORDER BY created_at DESC`
    );

    // Convert image_urls to full URLs
    const ordersWithFullUrls = result.rows.map((order) => ({
      ...order,
      image_urls: order.image_urls
        ? order.image_urls.map(
            (url) => `${req.protocol}://${req.get("host")}${url}`
          )
        : [],
    }));

    res.json(ordersWithFullUrls);
  } catch (error) {
    console.error("Get special orders error:", error);
    res.status(500).json({ error: "Failed to fetch special orders" });
  }
};

// Create new special order
const createSpecialOrder = async (req, res) => {
  try {
    const {
      name,
      description,
      price_per_person,
      min_people = 1,
      is_available = true,
    } = req.body;

    // Handle uploaded images
    const image_urls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // Validate required fields
    if (!name || !price_per_person) {
      return res
        .status(400)
        .json({ error: "Name and price per person are required" });
    }

    const result = await query(
      `INSERT INTO special_orders (name, description, price_per_person, min_people, image_urls, is_available)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        name,
        description,
        parseFloat(price_per_person),
        parseInt(min_people),
        image_urls,
        is_available,
      ]
    );

    // Convert image_urls to full URLs for response
    const specialOrder = result.rows[0];
    specialOrder.image_urls = specialOrder.image_urls
      ? specialOrder.image_urls.map(
          (url) => `${req.protocol}://${req.get("host")}${url}`
        )
      : [];

    res.status(201).json(specialOrder);
  } catch (error) {
    console.error("Create special order error:", error);
    res.status(500).json({ error: "Failed to create special order" });
  }
};

// Update special order
const updateSpecialOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_per_person, min_people, is_available } =
      req.body;

    const result = await query(
      `UPDATE special_orders 
       SET name = $1, description = $2, price_per_person = $3, min_people = $4, is_available = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [
        name,
        description,
        parseFloat(price_per_person),
        parseInt(min_people),
        is_available,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Special order not found" });
    }

    // Convert image_urls to full URLs for response
    const specialOrder = result.rows[0];
    specialOrder.image_urls = specialOrder.image_urls
      ? specialOrder.image_urls.map(
          (url) => `${req.protocol}://${req.get("host")}${url}`
        )
      : [];

    res.json(specialOrder);
  } catch (error) {
    console.error("Update special order error:", error);
    res.status(500).json({ error: "Failed to update special order" });
  }
};

// Delete special order
const deleteSpecialOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM special_orders WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Special order not found" });
    }

    res.json({ message: "Special order deleted successfully" });
  } catch (error) {
    console.error("Delete special order error:", error);
    res.status(500).json({ error: "Failed to delete special order" });
  }
};

module.exports = {
  getAllSpecialOrders,
  getSpecialOrders,
  createSpecialOrder,
  updateSpecialOrder,
  deleteSpecialOrder,
};
