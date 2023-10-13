import { createClient } from '../../node_modules/redis/dist/index.js';

export const redis = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});
