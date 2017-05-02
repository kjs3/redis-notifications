# Redis Notifications

Redis pub-sub features are pretty well advertised. But maybe less well known is that you can setup Redis to publish messages about internal events. For example, you can listen for key is delete or expire events and then take action based on that.

This repo simulates a self-updating cache using Javascript (Node.js).

Here's the gist of it:

* Redis is setup to listen for expiration events (subscribed).
* The latest 5 posts on Reddit are fetched and stored in Redis with an expiration.
* When that key expires, the expiration event is published.
* The subscriber gets that event, refetches the latest from Reddit.
* The result is stored again in Redis with an expiration.
* rinse/repeat

