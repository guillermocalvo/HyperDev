Bogan for your Slack Team
=========================

Silly little slash command integration which sends some
[bogan ipsum](https://github.com/rvagg/node-boganipsum)
into the channel.  Remixing isn't necessary if you only
want to turn on the slash command for your team.

To Configure
------------

You'll need a [Slack App](https://api.slack.com/apps/new):
 - Use your remixed urls; redirect_uri should be `/auth/grant`
 - Drop your app and slash command credentials in .env
 - The end :)

---

We're requesting the extra scope "chat:write:bot" so you could extend this to dump bogan ipsum into other channels or /msg other users... depends on how much trolling you feel like enabling.
