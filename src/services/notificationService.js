const axios = require('axios');

exports.sendTelegram = async (token, chatId, post) => {
  // Clean the title to remove characters that break Telegram Markdown
  const cleanTitle = post.title.replace(/[*_`[\]()]/g, ''); 

  return axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: `📢 *New Update!*\n\n${cleanTitle}\n\n🔗 [Read More](${post.url})`,
    parse_mode: 'Markdown'
  });
};