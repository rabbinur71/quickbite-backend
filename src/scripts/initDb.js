const { pool } = require("../config/database");

const initDatabase = async () => {
  try {
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

    console.log("✅ Database tables created successfully!");

    // Create a default admin user (password: admin123)
    await pool.query(
      `
      INSERT INTO users (email, password_hash, name, role) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      [
        "admin@quickbite.com",
        "$2b$10$xcyYJaLiBn/aTtnT9Xy95OHzE7CEQqOkdfaMh3RC616dbynLAcwR6", // bcrypt hash for 'admin123'
        "QuickBite Admin",
        "admin",
      ]
    );

    console.log(
      "✅ Default admin user created: admin@quickbite.com / admin123"
    );
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  } finally {
    pool.end();
  }
};

initDatabase();
