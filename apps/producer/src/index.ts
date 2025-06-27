import { kafkaClient } from '@node-kafka/kafka-client';

const producer = kafkaClient.producer();

async function run() {
  await producer.connect();
  setInterval(async () => {
    const message = { value: `Hello Kafka at ${new Date().toISOString()}` };
    await producer.send({
      topic: 'test-topic',
      messages: [message],
    });
    console.log('Produced:', message.value);
  }, 3000);
}

run().catch(console.error);
