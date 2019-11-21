if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const schedule = require("node-schedule");
const scraper = require("./scraper/scraper");
const bot = require("./bot/bot");
const app = require("./app");

// eslint-disable-next-line no-unused-vars
const scheduledWorldwideScraping = schedule.scheduleJob("30 * * * *", () => {
    new scraper().runWorldwide();
});
// eslint-disable-next-line no-unused-vars
const scheduledUkraineScraping = schedule.scheduleJob("40 * * * *", () => {
    new scraper().runUkraine();
});

bot.launch();

//dummy app to prevent heroku from shutting down webapp
app.listen(process.env.PORT);