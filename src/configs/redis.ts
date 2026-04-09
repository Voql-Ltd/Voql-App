import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_PUBLIC_URL as string
});

redisClient.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});


export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;