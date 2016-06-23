var H = require("hyperweb");
var app = H.blastOff();

app.get("/", function (request, response, next) {
  "use strict";
  response.render('index.html', {});
});

app.use(function(err, req, response, next) {
  "use strict";
  response
  .status(500)
  .send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
});
