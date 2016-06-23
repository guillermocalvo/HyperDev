module.exports = function(app) {
  
  var boganisms = require('./boganisms'),
      slack = require('./slack');
  
  // the main page
  app.get("/", function (request, response) {
    response.render('index', {
      title: boganisms.one()
    });
  });
  
  // the examples on the main page
  app.get("/quotes", function (request, response) {
    response.send(boganisms.heaps(3));
  });
  
  // "Add to Slack" action
  app.get('/auth', function (request, response) {
    response.redirect('https://slack.com/oauth/authorize?scope=chat:write:bot,commands&client_id=' + process.env.SLACK_CLIENT_ID);
  });
  
  // https://api.slack.com/docs/oauth
  app.get('/auth/grant', function (request, response) {
    // get the code, turn it into a token
    var code = request.query.code;
    slack.oauth(code).then(function(body) {
      /* {
        ok: true,
        access_token: for posting without being asked,
        scope: 'identify,commands,chat:write:bot',
        user_id: user id,
        team_name: team name,
        team_id: team id
      } */
      // TODO: stash the creds somewhere permanent so we can use the token later
      // TODO: a confirmation page!?
      response.redirect('/');
    }).catch(function(error) {
      console.log(error);
      response.send(error);
    });
  });
  
  app.get('/bogan', function (request, response) {
    response.send(boganisms.one());
  });
  
  // https://api.slack.com/slash-commands
  app.post('/bogan', function (request, response) {
    /* { 
      token: for verification,
      team_id: team id,
      team_domain: <domain>.slack.com,
      channel_id: channel id,
      channel_name: e.g., general,
      user_id: user id,
      user_name: no @,
      command: '/bogan',
      text: whatever they typed after bogan,
      response_url: to post more in the channel
    } */
    if (request.body.token == process.env.SLACK_TOKEN) {
      slack.respond(boganisms.one(), request.body.response_url) // follow up in the channel for all to see
        .then(function(body) {
          response.send(''); // Empty 200 prevents the "only you can see this" response
        }).catch(function(error) {
          response.status(500).send(error);
        });
    } else {
      response.status(400).send('nope');
    }
  });

};