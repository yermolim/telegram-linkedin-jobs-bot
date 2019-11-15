const mongoose = require("mongoose");

const connectionString = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    url: {
        type: String,
        require: true,
        trim: true
    },
    header: {
        type: String,
        require: true,
        trim: true
    },
    company: {
        type: String,
        require: true,
        trim: true
    },
    location: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Date,
        require: true
    },
});

const Job = mongoose.model("Job", userSchema);

module.exports = Job;