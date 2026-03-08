const logger = require('./loggerService');
const firecrawlService = require('./firecrawlService');
const aiService = require('./aiService');
const notificationService = require('./notificationService');
const { getDb } = require('../config/db');
// ... other imports

async function runScrapeCycle() {
  logger.info('🚀 Starting automated scrape cycle...');
  const db = await getDb();
  
  try {
    const activeUsers = await db.all("SELECT * FROM users WHERE is_active = 1");
    logger.info(`Found ${activeUsers.length} active agent(s).`);

    for (const user of activeUsers) {
      try {
        logger.info(`🔍 Scraping: ${user.url} (User: ${user.id})`);
        const markdown = await firecrawlService.scrapeUrl(user.url);
        
        logger.info(`🧠 AI Analyzing content... (${markdown.length} chars)`);
        const posts = await aiService.extractPosts(markdown);

        let newPostsFound = 0;
        for (const post of posts) {
          const alreadyPosted = await db.get(
            "SELECT id FROM history WHERE user_id = ? AND post_title = ?", 
            [user.id, post.title]
          );

          if (!alreadyPosted) {
            await notificationService.sendTelegram(user.tg_token, user.tg_chat_id, post);
            await db.run("INSERT INTO history (user_id, post_title) VALUES (?, ?)", [user.id, post.title]);
            logger.info(`✅ Sent to Telegram: "${post.title}"`);
            newPostsFound++;
          }
        }
        
        if (newPostsFound === 0) {
          logger.info(`😴 No new updates for user ${user.id}.`);
        }

      } catch (err) {
        logger.error(`❌ User ${user.id} Failed: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`🚨 Global Cycle Error: ${err.message}`);
  }
}
module.exports = { runScrapeCycle };