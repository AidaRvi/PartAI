export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
  },
  database: {
    url: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    name: process.env.MONGODB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
