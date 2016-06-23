# Trello Webhook Server

- Registers and outputs Trello webhooks resulting from activity on our example [Trello board](https://trello.com/invite/b/yq3o4Y1u/80930e588269335357e6d176f28496c7/hyperdev-trello-webhook-server-example)

- based on the [Trello Webhook Server](https://github.com/18F/trello-webhook-server) by 18F.

- When remixing, you'll need to supply your own Trello credentials and config details in .env:

- HOST=your webhook url endpoint, e.g. https://zinc-chopper.hyperdev.space

- TRELLO_API_KEY=your Trello API key from https://trello.com/app-key

- TRELLO_API_TOKEN=your Trello API token, generate on https://trello.com/app-key 

- TRELLO_CLIENT_SECRET=your Trello client secret from https://trello.com/app-key

- PORT=Server port no. e.g. 3000

- MODEL_ID=Trello model ID, for details see https://developers.trello.com/get-started/start-building e.g. xxxxxxxxxxxxxxxxxxxxxxxx

For more HyperDev examples, check out the [Gallery](https://cosmic-flower.hyperdev.space/)