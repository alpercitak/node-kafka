import { kafkaClient } from '@node-kafka/kafka-client';

const consumer = kafkaClient.consumer({ groupId: 'test-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('Consumed:', message.value?.toString());
    },
  });

  const shutdown = async () => {
    await consumer.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

run().catch(console.error);
