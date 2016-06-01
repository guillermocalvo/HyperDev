// server.js
// where your node app starts

// init
var H = require('hyperweb');
app = H.blastOff();

var datastore = require('./datastore');

// initial data
var scores = [
    {
      name: "Anon",
      score: "10"
    }, {
      name: "Duder",
      score: "23"
    }
];

// routes (using Express)
app.get('/', function(request, response) {
  datastore.get("scores")
  .then(function (storedScores) {
    response.render('index.html', {
      title: "Welcome To HyperDev",
      scores: storedScores || scores
    });
  })
  .catch(function (err) {
      response.json(err);
  });
});

post('/scores', function(data) {
  scores.push(data);

  datastore.set("scores", scores)
  .then(function(){
    return scores;
  });
});
