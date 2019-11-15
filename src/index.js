if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const schedule = require("node-schedule");
const scraper = require("./scraper");

const scheduledScraping = schedule.scheduleJob("37 * * * *", () => {
    new scraper().runUkraineLastWeek();
});

// new scraper().runWorldwideLastDay();
// new scraper().runUkraineLastWeek();
