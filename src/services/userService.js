const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const registerUser = async (email, password) => {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = Date.now().toString(); 
  
  await db.run(
    "INSERT INTO users (id, email, password) VALUES (?, ?, ?)", 
    [userId, email, hashedPassword]
  );
  return { userId };
};

const loginUser = async (email, password) => {
  const db = await getDb();
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return { token, userId: user.id };
};

const saveSettings = async (userId, settings) => {
  const db = await getDb();
  const { url, tg_token, tg_chat_id, is_active } = settings;
  
  await db.run(
    `UPDATE users SET url = ?, tg_token = ?, tg_chat_id = ?, is_active = ? WHERE id = ?`,
    [url, tg_token, tg_chat_id, is_active ? 1 : 0, userId]
  );
  
  return { message: "Settings updated successfully" };
};

module.exports = { registerUser, loginUser , saveSettings};