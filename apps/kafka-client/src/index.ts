import { Kafka } from 'kafkajs';

export const kafkaClient = new Kafka({
  clientId: 'node-kafka',
  brokers: ['kafka:9092'], // Docker host
});
