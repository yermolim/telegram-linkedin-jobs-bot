if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const schedule = require("node-schedule");
const scraper = require("./scraper/scraper");
const bot = require("./bot/bot");

// eslint-disable-next-line no-unused-vars
const scheduledScraping = schedule.scheduleJob("59 * * * *", () => {
    new scraper().runUkraine();
});

// new scraper().runWorldwide();
// new scraper().runUkraine();

bot.launch();