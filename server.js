require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { initDb } = require('./src/config/db');
const { runScrapeCycle } = require('./src/services/agentService');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());

// API: This is what your Expo app will call later


const PORT = 3000;

// THIS IS THE MOMENT: When this function runs, database.sqlite is born
const start = async () => {
  await initDb(); 
  
  app.listen(PORT, () => {
    console.log(`🚀 Server alive at http://localhost:${PORT}`);
    console.log(`📂 Check your folder... database.sqlite should be there now!`);
  });
  app.use('/api/user', userRoutes);
  // Run the agent every 5 minutes
   runScrapeCycle();
   cron.schedule('*/5 * * * *', () => {
  console.log('⏰ Cron Job: Starting automated scrape cycle...');
  runScrapeCycle();
});
};

start();