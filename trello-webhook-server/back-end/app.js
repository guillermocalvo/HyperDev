'use strict';
const restify = require('restify');
const TrelloWebhookServer = require('./webhook-server');
const restifyServer = restify.createServer({ name: 'Restify Server' });
var trello_link = "https://trello.com";
var output=[];

const trelloWHServer = new TrelloWebhookServer({
  server: restifyServer,
  hostURL: `${process.env.HOST}/trello`,
  apiKey: process.env.TRELLO_API_KEY,
  apiToken: process.env.TRELLO_API_TOKEN,
  clientSecret: process.env.TRELLO_CLIENT_SECRET
});

var createCardText = function(action) {
  return (cardLink(action.data.card)) + " added by " + action.memberCreator.fullName;
};

var commentCardText = function(action) {
  return "New comment on " + (cardLink(action.data.card)) + " by " + action.memberCreator.fullName + "\n" + action.data.text;
};

var updateCardText = function(action) {
  if ("closed" in action.data.card) {
    if (action.data.card.closed) {
      return (cardLink(action.data.card)) + " archived by " + action.memberCreator.fullName;
    } else {
      return (cardLink(action.data.card)) + " un-archived by " + action.memberCreator.fullName;
    }
  } else if ("listAfter" in action.data && "listBefore" in action.data) {
    return (cardLink(action.data.card)) + " moved to " + action.data.listAfter.name + " by " + action.memberCreator.fullName;
  } else {
    return ("I don't know what to do with this:" + JSON.stringify(action));
  }
};

var cardLink = function(card) {
  return "<a href='" + trello_link + "/c/" + card.shortLink + "' target='_new'>" + card.name + "</a>";
};

var boardLink = function(board) {
  return "<a href='" + trello_link + "/b/" + board.shortLink + "' target='_new'>" + board.name + "</a>";
};

var msgText = function(action) {
  switch (action.type) {
    case 'createCard':
      return createCardText(action);
    case 'commentCard':
      return commentCardText(action);
    case 'updateCard':
      return updateCardText(action);
    default:
      return action.type + " not understood";
  }
};

restifyServer.head("/", function (req, res, next) {
    res.end();
    return next();
});

restifyServer.get("/webhooks", function (req, res, next) {
  res.send(output);
  return next();
});

restifyServer.get(/\//, restify.serveStatic({
    directory: __dirname + '/public',
    default: 'index.html'
}));

restifyServer.listen(process.env.PORT, () => {
  console.log('Listening on: ' + process.env.PORT);
  trelloWHServer.start(process.env.MODEL_ID)
    .then(webhookID => {
      console.log(`Webhook ID: ${webhookID}`);
      trelloWHServer.on('data', event => {
        console.log(msgText(event.action));
        output.push(msgText(event.action));
      });
    });
});