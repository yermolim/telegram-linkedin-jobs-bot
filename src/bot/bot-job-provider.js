const Job = require("../db/mongoose");

class BotJobProvider {
    constructor() { }

    async getJobsByLocation(location, limit = 10) {
        var searchRegex = new RegExp(location, "i");
        return await Job.find({
            location: searchRegex
        }).sort({
            date: -1
        }).limit(limit).exec();
    }

    async getJobsByCompany(company, limit = 10) {
        var searchRegex = new RegExp(company, "i");
        return await Job.find({
            company: searchRegex
        }).sort({
            date: -1
        }).limit(limit).exec();
    }
    
    async getJobsByHeader(header, limit = 10) {
        var searchRegex = new RegExp(header, "i");
        return await Job.find({
            header: searchRegex
        }).sort({
            date: -1
        }).limit(limit).exec();
    }
}

module.exports = BotJobProvider;