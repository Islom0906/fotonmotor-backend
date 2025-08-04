const TelegramBot = require('node-telegram-bot-api');
// const token = '6947180504:AAH9DR_ayksfd2MwZLeD4e0fXawPknLYJws';
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token);

module.exports=bot