import { kafka, topic } from '../config/kafka.config';

const producer = kafka.producer();

const run = async () => {
  try {
    await producer.connect();

    const message = {
      topic: topic,
      messages: [
        { value: 'Hello, Kafka!' } 
      ]
    };

    await producer.send(message);
    console.log('Message sent successfully');

  } catch (error) {
    console.error('Error producing message:', error);
  } finally {
    await producer.disconnect();
  }
};

export default run;
