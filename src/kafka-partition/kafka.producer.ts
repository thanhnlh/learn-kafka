import { getKafka, topic } from '../config/kafka.config';

const producer = getKafka('producer').producer();

const run = async () => {
  try {
    await producer.connect();

    setInterval(async () => {
      const message = { value: `Event produced at ${new Date().toISOString()}` };
      console.log('Producing:', message);
      await producer.send({
        topic: topic,
        messages: [message],
      });
    }, 5000); // Producing an event every 5 seconds

  } catch (error) {
    console.error('Error producing message:', error);
  }  
};

run().catch(console.error);
