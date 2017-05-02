import redis from 'redis'
export { redis }

export default function createClient (name) {
  const client = redis.createClient()

  client.on('connect', () => {
    console.info(`Redis client (${name}) connected.`)
  })

  client.on('error', err => {
    console.warn('Redis error: ', err)
  })

  return client
}
