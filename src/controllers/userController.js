const userService = require('../services/userService');
const { runScrapeCycle } = require('../services/agentService');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    // The Controller asks the Service to do the hard work
    const result = await userService.registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    // We get the userId from the decoded JWT token (passed by middleware)
    const userId = req.user.userId; 
    const settings = req.body;
    
    const result = await userService.saveSettings(userId, settings);
    res.json(result);
    runScrapeCycle(); // Trigger the scrape cycle immediately after settings update
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login, updateSettings };