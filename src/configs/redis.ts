import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_PUBLIC_URL as string);

redisClient.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

export const connectRedis = async (): Promise<void> => {
  // ioredis connects automatically, but we can ensure connection
  if (redisClient.status !== 'ready') {
    await redisClient.connect();
  }
};

export default redisClient;