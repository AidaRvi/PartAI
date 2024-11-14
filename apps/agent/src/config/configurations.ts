export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
  },
  agentId: process.env.AGENT_ID,
  eventGenerationDuration: process.env.EVENT_DURATION || 1000,
});
