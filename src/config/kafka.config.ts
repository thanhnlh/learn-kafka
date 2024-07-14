import { Kafka } from 'kafkajs';


function getKafka(clientId: string) {
  return  new Kafka({
    clientId: clientId,
    brokers: ['localhost:9092'],
  });
}

const topic = 'tomyum-topic';  // Your Kafka topic name

export { topic, getKafka };