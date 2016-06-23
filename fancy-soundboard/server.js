// server.js
// where your node app starts

// init
var H = require("hyperweb");

app = H.blastOff();

app.get("/", function (request, response) {
  response.render('index.html', {
    title: "YOLO",
  });
});