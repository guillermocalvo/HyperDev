// init project
var express = require('express'),
    app = express(),
    nunjucks = require('nunjucks'),
    bodyparser = require('body-parser');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// nunjucks templating
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
app.engine('html', nunjucks.render) ;
app.set('view engine', 'html') ;

// Slash command POSTS a form, and we need this to parse the body
app.use(bodyparser.urlencoded({extended: true}));

// Load all our routes
require('./routes')(app);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});