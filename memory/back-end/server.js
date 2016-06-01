// server.js
// where your node app starts

// init
var H = require("hyperweb");

app = H.blastOff();

app.get("/", function (request, response) {
  try {
    response.render("index.html");
  } catch (err) {
    handleError(err, response);
  }
});

function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}
