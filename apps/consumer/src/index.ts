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
}

run().catch(console.error);
