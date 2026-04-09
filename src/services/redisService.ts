import redisClient from '../configs/redis';

const setRd = async (key: string, value: string | any[], ttl?: number): Promise<void> => {
  try {
    const stringValue = Array.isArray(value) ? JSON.stringify(value) : value;
    if (ttl) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (error) {
    console.error('Redis set error:', error);
    throw error;
  }
};

const readRd = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis read error:', error);
    throw error;
  }
};

const modifyRd = async (key: string, value: string | any[], ttl?: number): Promise<void> => {
  try {
    const exists = await redisClient.exists(key);
    if (exists === 0) {
      throw new Error(`Key '${key}' does not exist`);
    }
    
    const stringValue = Array.isArray(value) ? JSON.stringify(value) : value;
    if (ttl) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (error) {
    console.error('Redis modify error:', error);
    throw error;
  }
};

const delRd = async (key: string): Promise<number> => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
    throw error;
  }
};

export const redisService = {
  setRd,
  readRd,
  modifyRd,
  delRd
};

export default redisService;
