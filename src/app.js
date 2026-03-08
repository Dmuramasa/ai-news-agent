const express = require('express');
const cors = require('cors');
const { getDb } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/settings', async (req, res) => {
  const { userId, url, token, chatId, active } = req.body;
  try {
    const db = await getDb();
    await db.run(
      `INSERT OR REPLACE INTO users (id, url, tg_token, tg_chat_id, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, url, token, chatId, active ? 1 : 0]
    );
    res.json({ status: "success", message: "Settings saved to SQLite" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check (Good for testing if the server is alive)
app.get('/health', (req, res) => res.send('System Active 🚀'));

module.exports = app;