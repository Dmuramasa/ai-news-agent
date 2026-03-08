const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

/**
 * Connects to the SQLite file.
 * If the file doesn't exist, it will be created automatically.
 */
async function getDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

/**
 * Initializes the database structure.
 * Run this once when the server starts.
 */
async function initDb() {
  const db = await getDb();
  
  // Create Users Table (Added email and password for Auth)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, 
      email TEXT UNIQUE,
      password TEXT,
      url TEXT, 
      tg_token TEXT, 
      tg_chat_id TEXT, 
      is_active INTEGER DEFAULT 0
    );
  `);

  // Create History Table (Stores what has already been sent to Telegram)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      user_id TEXT, 
      post_title TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  console.log("✅ SQLite Database & Tables Initialized");
}

module.exports = { getDb, initDb };