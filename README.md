# Redis Notifications

Redis pub-sub features are pretty well advertised. But maybe less well known is Redis' ability to publish messages about internal events. For example, you can listen for key is delete or expire events and then take action based on that.

This repo simulates a self-updating cache using Javascript (Node.js).

Here's the gist of it:

* Redis is setup to listen for expiration events (subscribed).
* The latest 5 posts on Reddit are fetched and stored in Redis with an expiration.
* When that key expires, the expiration event is published.
* The subscriber gets that event, refetches the latest from Reddit.
* The result is stored again in Redis with an expiration.
* rinse/repeat

### Setup

Install Redis (below is for MacOS/Homebrew):

```
brew install redis
```

Edit redis.conf to notify/publish key events. This is disabled by default since it does require some overhead.

```
# this file is in /usr/local/etc/redis.conf for MacOS using Homebrew

#
#  By default all notifications are disabled because most users don't need
#  this feature and the feature has some overhead. Note that if you don't
#  specify at least one of K or E, no events will be delivered.
#  notify-keyspace-events ""

notify-keyspace-events Ex
```

Make sure to restart Redis:

```
brew services restart redis
```

Install all the js modules:

```
yarn
```

### Usage

Run the project:

```
yarn start
```
