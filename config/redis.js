import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 3000),
  //  tls: true,
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

const connectRedis = async () => {
    try {
      await redisClient.connect();
      console.log('Successfully connected to Redis Cloud');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  };
  

export { redisClient, connectRedis };