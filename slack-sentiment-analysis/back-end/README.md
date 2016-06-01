## Sentiment analysis of Slack channel

### What is it?

A sentiment analysis tool for Slack channels. When an Outgoing Slack Webhook is pointed at the /sentiment endpoint, chat messages are sent to HyperDev and analyzed with the [sentiment](https://github.com/thisandagain/sentiment) project. A score is stored for each message, and the average sentiment of recent messages is shown on the web site.

### How do I set it up?

 - Remix this project
 - On your Slack team, configure an outgoing webhook and point it to the /sentiment endpoint of this project (https://<project>.hyperdev.com/sentiment)
 - Take the Slack token for the web hook and drop it into the SLACK_TOKEN variable in .env.
 - Start chatting in your integrated channel, and visit the project page (https://<project>.hyperdev.com/)
 - If you want to configure multiple channels, make sure that all of your outgoing webhooks POST to /sentiment and that they are all configured with the same SLACK_TOKEN

### Endpoints

#### /sentiment

##### POST /sentiment

Slack integration point, where we receive the sentiment. Slack sends a token in their payload, which is set in .env

#### /sentiments

##### GET /sentiments

Gets the current list of sentiments

##### DELETE /sentiments/delete/<token>

Delete all currently stored sentiments, for troubleshooting. Requires valid Slack webhook integration token.

For more HyperDev examples, check out the [Gallery](https://hyperdev.com/community/)