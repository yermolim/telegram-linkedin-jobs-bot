const Telegraf = require("telegraf");
const TelegrafInlineMenu = require("telegraf-inline-menu");
const BotJobProvider = require("./bot-job-provider");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start(ctx => ctx.reply("Welcome! Type '/help' to get commands list."));
bot.help(ctx => ctx.reply("- '/menu' to open search menu with some default search options\n\n" + 
    "- 'location/*' to find some job offers in specified location (examples: 'location/ua' or 'location/dnipro')\n\n" + 
    "- 'header/*' to find some job offers by searching provided keyword in offer headers (examples: 'header/senior' or 'header/react')\n\n" + 
    "- 'company/*' to find some job offers by searching provided keyword in company names (examples: 'company/apple' or 'company/linkedin')\n\n"));    

bot.on("sticker", ctx => ctx.reply("👍"));
bot.hears("hi", ctx => ctx.reply("Hey there"));

const searchMenu = new TelegrafInlineMenu("Search menu");
const locationSubmenu = new TelegrafInlineMenu("Select location to search for");
const headerSubmenu = new TelegrafInlineMenu("Select header to search for");

searchMenu.submenu("Search by location", "openLocationSubmenu", locationSubmenu);
searchMenu.submenu("Search by header", "openHeaderSubmenu", headerSubmenu);

//#region menu buttons

locationSubmenu.simpleButton("UA", "searchUA", {
    doFunc: ctx => sendJobsByLocation(ctx, "UA"),
    setParentMenuAfter: true
});
locationSubmenu.simpleButton("US", "searchUS", {
    doFunc: ctx => sendJobsByLocation(ctx, "US"),
    setParentMenuAfter: true
});
locationSubmenu.simpleButton("Kyiv", "searchKyiv", {
    doFunc: ctx => sendJobsByLocation(ctx, "Kyiv"),
    setParentMenuAfter: true
});

headerSubmenu.simpleButton(".NET", "searchNET", {
    doFunc: ctx => sendJobsByHeader(ctx, ".NET"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("JavaScript", "searchJavaScript", {
    doFunc: ctx => sendJobsByHeader(ctx, "JavaScript"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Python", "searchPython", {
    doFunc: ctx => sendJobsByHeader(ctx, "Python"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("C++", "searchC", {
    doFunc: ctx => sendJobsByHeader(ctx, "C++"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Web", "searchWeb", {
    doFunc: ctx => sendJobsByHeader(ctx, "Web"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Fullstack", "searchFull", {
    doFunc: ctx => sendJobsByHeader(ctx, "Full"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Backend", "searchBack", {
    doFunc: ctx => sendJobsByHeader(ctx, "Back"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Node", "searchNode", {
    doFunc: ctx => sendJobsByHeader(ctx, "Node"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Frontend", "searchFront", {
    doFunc: ctx => sendJobsByHeader(ctx, "Front"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Angular", "searchAngular", {
    doFunc: ctx => sendJobsByHeader(ctx, "Angular"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("React", "searchReact", {
    doFunc: ctx => sendJobsByHeader(ctx, "React"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Vue", "searchVue", {
    doFunc: ctx => sendJobsByHeader(ctx, "Vue"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("QA", "searchQA", {
    doFunc: ctx => sendJobsByHeader(ctx, "QA"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Senior", "searchSenior", {
    doFunc: ctx => sendJobsByHeader(ctx, "Senior"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Middle", "searchMiddle", {
    doFunc: ctx => sendJobsByHeader(ctx, "Middle"),
    setParentMenuAfter: true
});
headerSubmenu.simpleButton("Junior", "searchJunior", {
    doFunc: ctx => sendJobsByHeader(ctx, "Junior"),
    setParentMenuAfter: true
});

//#endregion menu buttons

searchMenu.setCommand("menu");
bot.use(searchMenu.init({
    mainMenuButtonText: "Return to search menu"
}));

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
    else if (requestType === "header") sendJobsByHeader(ctx, requestValue);
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