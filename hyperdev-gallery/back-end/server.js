// server.js
// where your node app starts

// init project
// https://www.npmjs.com/package/hyperweb-init

var hw = require("hyperweb-init");
app = hw.init();

var cors = require('cors');
app.use(cors());

var routes = require('./routes.coffee')(app);

