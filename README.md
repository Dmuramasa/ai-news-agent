🤖 AI-News-Agent: Automated Intelligence Scraper

An automated pipeline designed to monitor web sources, extract meaningful news using LLMs, and deliver rich-media notifications via Telegram. This agent transforms messy web data into structured, actionable intelligence.
🏗 System Architecture

The project follows a modular service-oriented architecture. Here is how the data flows through the system:

    Trigger: A Cron-like interval initiates the agentService.

    Scrape: Firecrawl fetches target URLs and converts them to clean Markdown.

    Process: Groq (Llama 3.3) analyzes the text, filters for relevance, and generates a JSON payload.

    Notify: Telegram API delivers the formatted news card with images.

    Persist: SQLite logs the transaction to prevent duplicate notifications.

🛠 Tech Stack

    Runtime: Node.js (v24+)

    Database: SQLite (Lightweight, zero-config persistence)

    Scraping: Firecrawl (Bypasses anti-bot headers)

    Inference: Groq Cloud (Llama 3.3 70B for ultra-fast extraction)

    Logging: Winston (Professional log rotation and error tracking)

🚀 Getting Started
1. Prerequisites

    Node.js installed on your machine.

    API Keys for Firecrawl and Groq.

    A Telegram Bot Token (from @BotFather).

2. Installation
Bash

# Clone the repository
git clone https://github.com/Dmuramasa/telegram-ai-agent.git

# Install dependencies
npm install

3. Environment Setup

Create a .env file in the root directory (use .env.example as a template):
Extrait de code

PORT=3000
FIRECRAWL_KEY=your_firecrawl_api_key
GROQ_KEY=your_groq_api_key
TELEGRAM_TOKEN=your_bot_token

4. Database Initialization

The system will automatically create database.sqlite on the first run. To seed an initial agent, you can use the built-in user controller or manually insert a row into the users table.
📁 Project Structure
Plaintext

├── src/
│   ├── controllers/    # Express route handlers
│   ├── routes/         # API endpoint definitions
│   ├── services/       # Core logic (AI, Scraper, Notification)
│   └── utils/          # Logger and database connections
├── logs/               # Auto-generated error and activity logs
├── server.js           # Entry point
└── .gitignore          # Protected files (node_modules, .env, DB)

📊 Logging & Monitoring

The agent uses a dual-logging system:

    Console: Color-coded real-time status updates via Chalk.

    Files: logs/error.log for debugging and logs/combined.log for audit trails.

📝 License

Distributed under the MIT License. See LICENSE for more information.
