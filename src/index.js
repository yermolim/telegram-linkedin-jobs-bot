if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const schedule = require("node-schedule");
const scraper = require("./scraper");

// eslint-disable-next-line no-unused-vars
const scheduledScraping = schedule.scheduleJob("42 * * * *", () => {
    new scraper().runUkraineLastWeek();
});

// new scraper().runWorldwideLastDay();
// new scraper().runUkraineLastWeek();
