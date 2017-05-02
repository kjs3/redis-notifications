import 'isomorphic-fetch'
import createClient from './redis'

start()

async function start () {
  const commandClient = createClient('command')
  const pubSubClient = createClient('pubsub')

  subscribeToEvents(pubSubClient)
  setupMessageHandler(pubSubClient, commandClient)

  await latestFromReddit(commandClient)
  pollRedis(commandClient)
}

function latestFromReddit (commandClient) {
  return fetch('http://www.reddit.com/new.json?limit=5')
  .then(res => res.json())
  .then(res => res.data.children)
  .then(posts => {
    commandClient.set('latest', JSON.stringify(posts), 'EX', 5)
  })
}

function pollRedis (commandClient) {
  latestFromRedis(commandClient)
  setInterval(() => {
    latestFromRedis(commandClient)
  }, 3000)
}

function latestFromRedis (commandClient) {
  commandClient.get('latest', (err, reply) => {
    if(!reply) {
      console.log('REDIS IS EMPTY')
      return
    }

    const posts = JSON.parse(reply)

    posts.forEach(post => {
      console.log(post.data.title)
    })
  })
}

function setupMessageHandler (pubSubClient, commandClient) {
  pubSubClient.on('pmessage', (pattern, channel, message) => {
    console.info(pattern)
    console.info(channel)
    console.info(message)

    latestFromReddit(commandClient)
  })
}

function subscribeToEvents (pubSubClient) {
  pubSubClient.psubscribe('*')
}
