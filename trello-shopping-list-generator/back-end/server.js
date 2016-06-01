// server.js
// where your node app starts

// init project
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  fs.readFile('views/index.html', 'utf-8', function(err, content) {
    if (err) {
      response.end('error occurred');
      return;
    }
    var renderedHtml = ejs.render(content, {
                                            trelloAppKey: process.env.TRELLO_APPLICATION_KEY, 
                                            trelloList: process.env.TRELLO_LIST
                                            });  //get redered HTML code
    response.end(renderedHtml);
  });
});

// listen for requests :)
listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});