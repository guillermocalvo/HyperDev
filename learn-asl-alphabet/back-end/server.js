// server.js
// where your node app starts

// init
var H = require("hyperweb");
var fs = require('fs');

app = H.blastOff();


var words = fs.readFileSync('words.txt').toString().split("\n");
for(var i in words) {
    console.log(words[i]);
}

app.get("/", function (request, response) {
  try {
    response.render('index.html', {
      title: "ASL fingerspelled alphabet practice",
      });
  } catch (err) {
    handleError(err, response);
  }
});

app.get("/word", function (request, response) {
  try {
    // get a random word
    var word = words[Math.floor(Math.random() * words.length)];
    response.send(word);
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