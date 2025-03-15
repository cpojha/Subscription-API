import { redisClient, connectRedis } from './config/redis.js';

async function testRedis() {
  try {
    // Connect to Redis
    await connectRedis();

    console.log('\n----- Basic Operations -----');
    
    // Test 1: String operations
    console.log('\nTest 1: String Operations');
    await redisClient.set('test:string', 'Hello from Redis!');
    const stringValue = await redisClient.get('test:string');
    console.log('String Test:', stringValue === 'Hello from Redis!' ? 'PASSED ✓' : 'FAILED ✗');
    
    // Test 2: Expiration
    console.log('\nTest 2: Expiration');
    await redisClient.setEx('test:expiry', 5, 'This will expire in 5 seconds');
    const ttl = await redisClient.ttl('test:expiry');
    console.log(`TTL test: ${ttl} seconds remaining`);
    console.log('Expiration Test:', ttl > 0 && ttl <= 5 ? 'PASSED ✓' : 'FAILED ✗');
    
    // Test 3: JSON data
    console.log('\nTest 3: JSON Data');
    const user = { 
      id: '12345', 
      name: 'Test User', 
      email: 'test@example.com', 
      roles: ['user', 'admin'] 
    };
    await redisClient.set('test:user', JSON.stringify(user));
    const userJson = await redisClient.get('test:user');
    const parsedUser = JSON.parse(userJson);
    console.log('JSON Test:', parsedUser.name === 'Test User' ? 'PASSED ✓' : 'FAILED ✗');
    
    // Test 4: Increment
    console.log('\nTest 4: Increment');
    await redisClient.set('test:counter', 10);
    const newValue = await redisClient.incrBy('test:counter', 5);
    console.log('Increment Test:', newValue === 15 ? 'PASSED ✓' : 'FAILED ✗');
    
    // Test 5: Lists
    console.log('\nTest 5: Lists');
    await redisClient.del('test:list');
    await redisClient.rPush('test:list', ['item1', 'item2', 'item3']);
    const listLength = await redisClient.lLen('test:list');
    const listItems = await redisClient.lRange('test:list', 0, -1);
    console.log('List Items:', listItems);
    console.log('List Test:', listLength === 3 ? 'PASSED ✓' : 'FAILED ✗');
    
    // Test 6: Hash
    console.log('\nTest 6: Hash');
    await redisClient.hSet('test:hash', { 
      field1: 'value1', 
      field2: 'value2',
      field3: 'value3'
    });
    const hashValue = await redisClient.hGetAll('test:hash');
    console.log('Hash Values:', hashValue);
    console.log('Hash Test:', hashValue.field2 === 'value2' ? 'PASSED ✓' : 'FAILED ✗');
    
    // Clean up
    console.log('\nCleaning up test keys...');
    await redisClient.del('test:string', 'test:expiry', 'test:user', 'test:counter', 'test:list', 'test:hash');
    console.log('All test keys removed');

    // Disconnect
    await redisClient.quit();
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Redis test failed:', error);
  }
}

testRedis();