const cheerio = require("cheerio");
const Nightmare = require("nightmare");
const Job = require("./db/mongoose");
const chalk = require("chalk");

class LinkedInJobsScraper {
    jobsWorldwideLastDayUrl = "https://www.linkedin.com/jobs/search?" +
        "keywords=Remote&location=Worldwide&trk=guest_job_search_jobs-search-bar_search-submit&redirect=false&position=1&pageNum=0&f_TP=1";
    jobsUkraineLastWeek = "https://www.linkedin.com/jobs/search?" + 
        "keywords=Remote&location=Ukraine&trk=guest_job_search_jobs-search-bar_search-submit&redirect=false&position=1&pageNum=0&f_TP=1%2C2";

    constructor() { }
    
    runUkraineLastWeek() {
        this.run(this.jobsUkraineLastWeek);
    }
        
    runWorldwideLastDay() {
        this.run(this.jobsWorldwideLastDayUrl);
    }

    async run(url) {        
        console.log(chalk.green("Scrapper: ") + `job scraping started at: ${new Date().toISOString()}`);

        const html = await this.getHtml(url);
        const jobs = Array.from(this.getJobs(html));
        await this.saveJobsToDb(jobs);

        console.log(chalk.green("Scrapper: ") + `job scraping ended at: ${new Date().toISOString()}`);
    }

    async getHtml(url) {
        const nightmare = Nightmare({ show: true, 
            webPreferences: {
                images: false,
            }});

        await nightmare.goto(url).wait(4000);
      
        while (await nightmare.exists("button.see-more-jobs")) {            
            await nightmare.click("button.see-more-jobs");
            await nightmare.wait(4000);
        }

        // eslint-disable-next-line no-undef
        let html = await nightmare.evaluate(() => document
            .querySelector("body").innerHTML);
        await nightmare.end();

        return html;
    }

    getJobs(html) {
        const $ = cheerio.load(html);
        let lis = $("ul.jobs-search__results-list li");

        return lis.map((i, li) => {
            return new Job({
                url: $(li).find("a").attr("href"),   
                header: $(li).find("span.screen-reader-text").text(),
                company: $(li).find("a.result-card__subtitle-link.job-result-card__subtitle-link").text(),
                location: $(li).find("span.job-result-card__location").text(),
                description: $(li).find("p.job-result-card__snippet").text(),
                date: Date.parse($(li).find("time.job-result-card__listdate").attr("datetime")),
            });
        }).filter((i, li) => {
            return !isNaN(li.date);
        });
    }

    async saveJobsToDb(jobs) {
        for (const job of jobs) {
            const jobInDb = await Job.findOne({
                header: job.header,
                company: job.company,
                location: job.location,
                description: job.description,
                date: job.date
            }).exec();
            if (!jobInDb) {
                await job.save();
            }
        }
    }
}

module.exports = LinkedInJobsScraper;