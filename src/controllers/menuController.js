const { query } = require("../config/database");

// Get all menu items (for admin)
const getAllMenuItems = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM menu_items ORDER BY category, created_at DESC`
    );

    // Convert image_urls to full URLs
    const itemsWithFullUrls = result.rows.map((item) => ({
      ...item,
      image_urls: item.image_urls
        ? item.image_urls.map(
            (url) => `${req.protocol}://${req.get("host")}${url}`
          )
        : [],
    }));

    res.json(itemsWithFullUrls);
  } catch (error) {
    console.error("Get menu items error:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Get available menu items (for public)
const getAvailableMenuItems = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM menu_items WHERE is_available = true ORDER BY category, created_at DESC`
    );

    // Convert image_urls to full URLs
    const itemsWithFullUrls = result.rows.map((item) => ({
      ...item,
      image_urls: item.image_urls
        ? item.image_urls.map(
            (url) => `${req.protocol}://${req.get("host")}${url}`
          )
        : [],
    }));

    res.json(itemsWithFullUrls);
  } catch (error) {
    console.error("Get available menu items error:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Create new menu item
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      is_available = true,
    } = req.body;

    // Handle uploaded images
    const image_urls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // Validate required fields
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ error: "Name, price, and category are required" });
    }

    const result = await query(
      `INSERT INTO menu_items (name, description, price, category, image_urls, is_available)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, parseFloat(price), category, image_urls, is_available]
    );

    // Convert image_urls to full URLs for response
    const menuItem = result.rows[0];
    menuItem.image_urls = menuItem.image_urls
      ? menuItem.image_urls.map(
          (url) => `${req.protocol}://${req.get("host")}${url}`
        )
      : [];

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, is_available } = req.body;

    const result = await query(
      `UPDATE menu_items 
       SET name = $1, description = $2, price = $3, category = $4, is_available = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [name, description, parseFloat(price), category, is_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Convert image_urls to full URLs for response
    const menuItem = result.rows[0];
    menuItem.image_urls = menuItem.image_urls
      ? menuItem.image_urls.map(
          (url) => `${req.protocol}://${req.get("host")}${url}`
        )
      : [];

    res.json(menuItem);
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM menu_items WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};

module.exports = {
  getAllMenuItems,
  getAvailableMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
