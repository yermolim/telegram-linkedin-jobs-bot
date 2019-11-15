const Telegraf = require("telegraf");
const BotJobProvider = require("./bot-job-provider");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome! Type '/help' to get commands list."));
bot.help((ctx) => ctx.reply("Send me a sticker or sat 'hi'"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

module.exports = bot;