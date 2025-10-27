const { Pool } = require("pg");
require("dotenv").config();

const initProductionDatabase = async () => {
  // Use production database URL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔄 Initializing production database...");

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner')),
        image_urls TEXT[],
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS special_orders (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price_per_person DECIMAL(10,2) NOT NULL,
        image_urls TEXT[],
        is_available BOOLEAN DEFAULT true,
        min_people INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Production database tables created successfully!");

    // Create default admin user (password: admin123)
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ["admin@quickbite.com", hashedPassword, "QuickBite Admin", "admin"]
    );

    console.log(
      "✅ Default admin user created: admin@quickbite.com / admin123"
    );

    // Insert sample menu items
    await pool.query(`
      INSERT INTO menu_items (name, description, price, category, is_available) VALUES
      ('Bangladeshi Breakfast Platter', 'Traditional paratha with vegetables and tea', 120.00, 'breakfast', true),
      ('Chicken Biryani', 'Authentic Bangladeshi biryani with raita', 180.00, 'lunch', true),
      ('Beef Tehari', 'Flavorful rice dish with beef and spices', 200.00, 'dinner', true),
      ('Fish Curry', 'Traditional fish curry with rice', 150.00, 'lunch', true)
      ON CONFLICT DO NOTHING;
    `);

    // Insert sample special orders
    await pool.query(`
      INSERT INTO special_orders (name, description, price_per_person, min_people, is_available) VALUES
      ('Family Feast Package', 'Perfect for family gatherings with traditional dishes', 250.00, 4, true),
      ('Office Party Package', 'Ideal for office meetings with variety of snacks', 180.00, 10, true),
      ('Birthday Celebration', 'Complete birthday party package with cake and snacks', 220.00, 8, true)
      ON CONFLICT DO NOTHING;
    `);

    console.log("✅ Sample data inserted successfully!");
  } catch (error) {
    console.error("❌ Production database initialization failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

initProductionDatabase();
