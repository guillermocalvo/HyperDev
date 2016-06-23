// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var sentiment = require('sentiment');

var datastore = require("./datastore").sync;
datastore.initializeApp(app);
var sync = require("synchronize");

var nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.render('index.html')
});

app.post("/sentiment", function (request, response, next) {
  // Let's make sure it's Slack sending us this message
  if (request.body.token !== process.env.SLACK_TOKEN) {
    response.status(404).send("Unauthorized");
  }
  
  sync.fiber(function() {
    try {
      var sentiments = datastore.get("sentiments");
      sentiments = sentiments || [];
      sentiments.push({date: Date.now(), channel: request.body.channel_name, score: sentiment(request.body.text)});
      datastore.set("sentiments", sentiments);
    } catch (err) {
      handleError(err, response);
    }
  });

});

app.get("/sentiments", function (request, response, next) {

  sync.fiber(function() {
    var sentiments = [];
    try {
      sentiments = datastore.get("sentiments");
    } catch (err) {
      handleError(err, response);
    }
    response.send(JSON.stringify(sentiments));
  });

});

// listen for requests :)
listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.delete("/sentiments/delete/:token", function (request, response) {
  // Let's make sure it's Slack sending us this message
  if (request.params.token !== process.env.SLACK_TOKEN) {
    response.status(404).send("Unauthorized");
    return;
  }
  
  datastore.set('sentiments', []);
  response.status(200).send("OK");
});

function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
} 