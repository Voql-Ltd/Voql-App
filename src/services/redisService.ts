import redisClient from '../configs/redis';

const setRd = async (key: string, value: string | any | Buffer, ttl?: number): Promise<void> => {
  try {
    const stringValue = Array.isArray(value) ? JSON.stringify(value) : value;
    if (ttl) {
      await redisClient.setex(key, ttl, stringValue);
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

const readBufferRd = async (key: string): Promise<Buffer | null> => {
  try {
    const result = await redisClient.getBuffer(key);
    return result;
  } catch (error) {
    console.error('Redis read error:', error);
    throw error;
  }
};

const getAllMatchingKeys = async (pattern: string): Promise<string[]> => {
  try {
    const keys = await redisClient.keys(pattern);
    return keys;
  } catch (error) {
    console.error('Redis keys error:', error);
    throw error;
  }
};

const getAllMatchingValues = async (pattern: string): Promise<{key: string, value: string}[]> => {
  try {
    const keys = await redisClient.keys(pattern);
    const results = [];
    
    for (const key of keys) {
      const value = await redisClient.get(key);
      if (value) {
        results.push({ key, value });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Redis pattern matching error:', error);
    throw error;
  }
};

const modifyRd = async (key: string, value: string | any[], ttl?: number): Promise<void> => {
  try {
    const exists = await redisClient.exists(key);
    if (!exists) {
      throw new Error(`Key '${key}' does not exist`);
    }
    
    const stringValue = Array.isArray(value) ? JSON.stringify(value) : value;
    if (ttl) {
      await redisClient.setex(key, ttl, stringValue);
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
  readBufferRd,
  modifyRd,
  delRd,
  getAllMatchingKeys,
  getAllMatchingValues
};

export default redisService;
