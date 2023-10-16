import { createClient } from 'redis';

const redis = createClient({
  socket: {
    host: <string>process.env.REDIS_HOST,
    port: parseInt(<string>process.env.REDIS_PORT),
  },
});

redis.on('error', (error) => console.log(`Error : ${error}`));

export default redis;
