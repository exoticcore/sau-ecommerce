import { createClient } from 'redis';

export const redis = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});
