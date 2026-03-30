import { kafkaClient } from '@node-kafka/kafka-client';

const producer = kafkaClient.producer();

async function run() {
  await producer.connect();

  const interval = setInterval(async () => {
    const message = { value: `Hello Kafka at ${new Date().toISOString()}` };
    await producer.send({
      topic: 'test-topic',
      messages: [message],
    });
    console.log('Produced:', message.value);
  }, 3000);

  const shutdown = async () => {
    clearInterval(interval);
    await producer.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

run().catch(console.error);
