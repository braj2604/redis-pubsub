import redis from 'redis';

export function redisClient(){
  const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    auth_pass: 'redis',
  });

  client.on('connect', () => {
    console.log(`Redis connected`);
  })

  client.on('error', (err) => {
    console.log(`Error in redis connection ${err}`)
  })

  return client;
}
