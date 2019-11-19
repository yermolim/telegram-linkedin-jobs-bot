const Telegraf = require("telegraf");
const BotJobProvider = require("./bot-job-provider");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start(ctx => ctx.reply("Welcome! Type '/help' to get commands list."));
bot.help(ctx => ctx.reply("- 'location/*' to find some job offers in specified location (examples: 'location/ua' or 'location/dnipro')\n\n" + 
    "- 'header/*' to find some job offers by searching provided keyword in offer headers (examples: 'header/senior' or 'header/react')\n\n" + 
    "- 'company/*' to find some job offers by searching provided keyword in company names (examples: 'company/apple' or 'company/linkedin')\n\n"));

bot.on("sticker", ctx => ctx.reply("👍"));
bot.hears("hi", ctx => ctx.reply("Hey there"));

bot.on("text", async ctx => {
    const request = ctx.message.text.split("/");
    let requestType = request[0];
    let requestValue = request[1];
    
    if (requestType === undefined) {
        ctx.reply("No request provided!");
        return;
    }
    if (requestValue === undefined) {
        ctx.reply("No request value provided!");
        return;
    }

    requestType = requestType.trim();
    requestValue = requestValue.trim();

    if (requestType === "location") {
        const jobs = await new BotJobProvider().getJobsByLocation(requestValue);
        if (jobs.length === 0) ctx.reply("No results found!");
        else {
            for (let job of jobs) {
                ctx.replyWithHTML(`<a href="${job.url}">${job.header}</a>`);
            }
        }
    } else if (requestType === "company") {
        const jobs = await new BotJobProvider().getJobsByCompany(requestValue);
        if (jobs.length === 0) ctx.reply("No results found!");
        else {
            for (let job of jobs) {
                ctx.replyWithHTML(`<a href="${job.url}">${job.header}</a>`);
            }
        }
    } else if (requestType === "header") {
        const jobs = await new BotJobProvider().getJobsByHeader(requestValue);
        if (jobs.length === 0) ctx.reply("No results found!");
        else {
            for (let job of jobs) {
                ctx.replyWithHTML(`<a href="${job.url}">${job.header}</a>`);
            }
        }
    } else {        
        ctx.reply("Unknown request!");
    }
});


module.exports = bot;