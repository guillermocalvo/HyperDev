// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var corser = require("corser");

// CORS
app.use(corser.create());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
  ];

app.get('/api/fontawesome.json', function (req, res) {
  getCached('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css', function (err, faCSS) {
    if (err) {
      res2.error(500, err);
      return;
    }
  
    getCached('http://fontawesome.io/icons/', function (err, body) {
      if (err) {
        res.error(500, err);
        return;
      }
      
      var $ = cheerio.load(body);
      var icons = [];
      $('.fa-hover').each(function () {
        var icon = { 
          name: $(this).text().replace('Example of', '').trim(), 
          icon: $(this).find('i').attr('class'),
          group: $(this).parents('section').find('h2').text().trim()
        };
        var reCode = new RegExp(icon.name.replace('(alias)', '').trim()+':before[^"]+"([^"]+)"');
        icon.unicode = faCSS.match(reCode) ? faCSS.match(reCode)[1] : null;
        icons.push(icon);
      });
      res.json(icons);
    });
  });
});

var cached = {};

function getCached(url, cb) {
  if (cached[url]) {
    cb(null, cached[url]);
    return;
  }
  request.get(url, function (err, res2, body) {
    if (!err) {
      cached[url] = body;  
    }
    cb(err, body);
  });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});