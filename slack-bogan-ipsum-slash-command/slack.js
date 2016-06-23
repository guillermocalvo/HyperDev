var rq = require('request');

module.exports = {
  oauth: oauth,
  respond: respond
};

// https://api.slack.com/methods/oauth.access
function oauth(code, uri) {
  return post({
      url: 'https://slack.com/api/oauth.access',
      // normally we'd just send json instead of form, but for some reason that results in the client_id being unrecognized
      transform: JSON.parse,
      form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: code
      }
    });
}

// respond to a slash command; visible to all in the channel
// https://api.slack.com/slash-commands#responding_to_a_command
function respond(message, url) {
  return post({
    url: url,
    // response is supposed to be just "ok"... turn that into the standard API response format
    transform: function(body) {
      if (body === 'ok') {
        return {ok: true};
      }
      return body;
    },
    json: {
      response_type: "in_channel",
      text: message
    }
  });
}

// teensy conversion to Promise-based API
function post(options) {
  return new Promise(function(resolve, reject) {
    rq.post(options, function(error, response, body) {
        if (error) {
          console.log('http error');
          reject(error);
        }
        if (options.transform) {
          body = options.transform(body);
        }
        if (body.ok) {
          console.log('success');
          resolve(body);
        } else {
          console.log('API error');
          reject(body.error || body);
        }
      });
  });
}