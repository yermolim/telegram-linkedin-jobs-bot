const path = require("path");
const express = require("express");

// init app
const app = express();

// use paths
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// routing
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/help", function (req, res) {
  res.send("Help page!");
});

app.get("/json", function (req, res) {
  res.send({
    key: "some key",
    value: "some value"
  });
});

app.get("*", function (req, res) {
  res.redirect("/404.html");
});

// start server
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});