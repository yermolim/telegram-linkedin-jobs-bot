const Telegraf = require("telegraf");
const Markup = require("telegraf/markup");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const session = require("telegraf/session");

const BotJobProvider = require("./bot-job-provider");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start(ctx => {
    ctx.reply("Welcome! You can use this bot to find most recent remote job offers from all over the world.\n" 
    + "All offers are scraped from public LinkedIn job search.\n\n"
    + "Type '/help' to get commands list\nor just use buttons below to find job offers:\n"
    + "'/location' button for searching by location\n'/title' button for searching by title", 
    Markup.keyboard([
        ["/location", "/title"], 
        ["/help"] 
    ]).resize().extra());
});

const locationScene = new WizardScene("locationWizard", async ctx => {
    await ctx.reply("Enter location to search jobs from:");
    return ctx.wizard.next();
},
async ctx => {
    const text = ctx.message.text;
    await sendJobsByLocation(ctx, text);
    return ctx.scene.leave();
});

const titleScene = new WizardScene("titleWizard", async ctx => {
    await ctx.reply("Enter title to search jobs with:");
    return ctx.wizard.next();
},
async ctx => {
    const text = ctx.message.text;
    await sendJobsByHeader(ctx, text);
    return ctx.scene.leave();
});

const stage = new Stage();
stage.register(locationScene);
stage.register(titleScene);
bot.use(session());
bot.use(stage.middleware());

bot.command("location", ctx => {
    ctx.reply("Select location to search:", 
        Markup.inlineKeyboard([
            [Markup.callbackButton("Enter location", "locationCustom")],
            [Markup.callbackButton("UA", "locationUA"), Markup.callbackButton("US", "locationUS")],            
            [Markup.callbackButton("Kyiv", "locationKyiv"), Markup.callbackButton("NY", "locationNY")],            
        ]).extra());
});

bot.command("title", ctx => {
    ctx.reply("Select search criteria:", 
        Markup.inlineKeyboard([
            [Markup.callbackButton("Enter title", "titleCustom")],
            [Markup.callbackButton("Desktop", "titleDesktop"), Markup.callbackButton("Web", "titleWeb")],
            [Markup.callbackButton("Frontend", "titleFe"), Markup.callbackButton("Backend", "titleBe")],
            [Markup.callbackButton("Fullstack", "titleFs"), Markup.callbackButton("API", "titleApi")],
            [Markup.callbackButton("C++", "titleC"), Markup.callbackButton(".NET", "titleNet")],            
            [Markup.callbackButton("Javascript", "titleJs"), Markup.callbackButton("Python", "titlePython")],            
            [Markup.callbackButton("Java", "titleJava"), Markup.callbackButton("PHP", "titlePhp")],            
            [Markup.callbackButton("Node.js", "titleNode"), Markup.callbackButton("Angular", "titleAngular")],            
            [Markup.callbackButton("React", "titleReact"), Markup.callbackButton("Vue", "titleVue")],            
        ]).extra());
});

bot.action("locationCustom", async ctx => ctx.scene.enter("locationWizard"));
bot.action("locationUA", ctx => sendJobsByLocation(ctx, "UA"));
bot.action("locationUS", ctx => sendJobsByLocation(ctx, "US"));
bot.action("locationKyiv", ctx => sendJobsByLocation(ctx, "Kyiv"));
bot.action("locationNY", ctx => sendJobsByLocation(ctx, "NY"));

bot.action("titleCustom", async ctx => ctx.scene.enter("titleWizard"));
bot.action("titleDesktop", ctx => sendJobsByHeader(ctx, "desktop"));
bot.action("titleWeb", ctx => sendJobsByHeader(ctx, "web"));
bot.action("titleFe", ctx => sendJobsByHeader(ctx, "front"));
bot.action("titleBe", ctx => sendJobsByHeader(ctx, "back"));
bot.action("titleFs", ctx => sendJobsByHeader(ctx, "full"));
bot.action("titleApi", ctx => sendJobsByHeader(ctx, "api"));
bot.action("titleC", ctx => sendJobsByHeader(ctx, "C++"));
bot.action("titleNet", ctx => sendJobsByHeader(ctx, ".net"));
bot.action("titleJs", ctx => sendJobsByHeader(ctx, "javascript"));
bot.action("titlePython", ctx => sendJobsByHeader(ctx, "python"));
bot.action("titleJava", ctx => sendJobsByHeader(ctx, "java"));
bot.action("titlePhp", ctx => sendJobsByHeader(ctx, "php"));
bot.action("titleNode", ctx => sendJobsByHeader(ctx, "node"));
bot.action("titleAngular", ctx => sendJobsByHeader(ctx, "angular"));
bot.action("titleReact", ctx => sendJobsByHeader(ctx, "react"));
bot.action("titleVue", ctx => sendJobsByHeader(ctx, "vue"));

bot.help(ctx => ctx.reply(
    "- '/help' command to show this info 😎\n\n" +
    "- '/start' command to reinitialize buttons\n\n" +
    "- '/location' button or command for searching by location\n\n" + 
    "- '/title' button or command for searching by title\n\n" +
    "- 'location/*' command to find some job offers in specified location (examples: 'location/ua' or 'location/dnipro')\n\n" + 
    "- 'title/*' command to find some job offers by searching provided keyword in offer headers (examples: 'header/senior' or 'header/react')\n\n" + 
    "- 'company/*' command to find some job offers by searching provided keyword in company names (examples: 'company/apple' or 'company/linkedin')\n\n"
));   

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

    if (requestType === "location") sendJobsByLocation(ctx, requestValue);
    else if (requestType === "company") sendJobsByCompany(ctx, requestValue);
    else if (requestType === "title") sendJobsByHeader(ctx, requestValue);
    else ctx.reply("Unknown request!");
});

async function sendJobsByLocation(ctx, location) {        
    const jobs = await new BotJobProvider().getJobsByLocation(location);
    if (jobs.length === 0) ctx.reply("No results found!");
    else {
        for (let job of jobs) {
            ctx.replyWithHTML(`<a href="${job.url}">${job.header}</a>`);
        }
    }
}

async function sendJobsByCompany(ctx, company) {
    const jobs = await new BotJobProvider().getJobsByCompany(company);
    if (jobs.length === 0) ctx.reply("No results found!");
    else {
        for (let job of jobs) {
            ctx.replyWithHTML(`<a href="${job.url}">${job.header}</a>`);
        }
    }
}

async function sendJobsByHeader(ctx, header) {
    const jobs = await new BotJobProvider().getJobsByHeader(header);
    if (jobs.length === 0) ctx.reply("No results found!");
    else {
        for (let job of jobs) {
            ctx.replyWithHTML(`<a href="${job.url}">${job.header}</a>`);
        }
    }
}

module.exports = bot;