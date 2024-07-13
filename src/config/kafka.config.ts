import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const topic = 'tomyum-topic';  // Your Kafka topic name

export { kafka, topic };