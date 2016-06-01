// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var GoogleSpreadsheets = require("google-spreadsheets");
var charts;

GoogleSpreadsheets({
    key: "1wz29qFmSVUoUpcxZzwPgyamrfXTjN8cnqydPW8N6XAg"
}, function(err, spreadsheet) {
    spreadsheet.worksheets[0].cells({
        // grab all the data
        range: "R1C1:R21C10"
    }, function(err, result) {
    	// Put in-memory store for now
      charts = result.cells;
    });
});

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/charts", function (request, response) {
  response.send(charts);
});

// listen for requests :)
listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});