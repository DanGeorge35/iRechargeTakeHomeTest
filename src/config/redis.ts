import * as redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const {
  REDIS_HOST,
  REDIS_PORT
} = process.env

const RH = REDIS_HOST ?? 'redis'
const RP = Number(REDIS_PORT) ?? 6379

const redisClient = redis.createClient({
  host: RH, // This should match the service name defined in your Docker Compose file
  port: RP // Redis default port
} as any)

// Connect to Redis
redisClient.on('connect', () => {
  console.log('Redis connected successfully.')
})

// Handle Redis connection errors
redisClient.on('error', (error) => {
  console.error('Unable to connect to Redis server:', error)
})

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
