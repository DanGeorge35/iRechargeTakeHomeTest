import * as redis from 'redis'
const redisClient = redis.createClient()

redisClient.connect()
  .then((result) => { console.log('Redis Connected successfully.', result) })
  .catch((error) => { console.error('Unable to connect to Redis Server:', error) })

async function getOrSetCache (key: string, ttl: number, cb: any): Promise<any> {
  return await new Promise((resolve, reject) => {
    redisClient.get(key)
      .then(async (data) => {
        if (data != null) {
          resolve(JSON.parse(data))
        } else {
          const newdata = await cb()
          await redisClient.setEx(key, ttl, JSON.stringify(newdata))
          resolve(newdata)
        }
      })
      .catch((error) => { reject(error) })
  })
}

export { getOrSetCache, redisClient }
