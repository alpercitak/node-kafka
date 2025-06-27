import { Kafka } from 'kafkajs';

export const kafkaClient = new Kafka({
  clientId: 'node-kafka',
  brokers: ['kafka:29092'], // Docker host
});
