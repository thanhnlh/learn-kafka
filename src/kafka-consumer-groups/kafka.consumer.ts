import { getKafka, topic } from '../config/kafka.config';

const group = 'tomyum-group-2';
const consumer = getKafka('consumer-1').consumer({groupId: group });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`[${group}][Consumer 1] Received message: ${message.value?.toString()}`);  
      },
    });

    consumer.on('consumer.crash', async (event) => {
      console.error('Consumer crashed', event);
    });

    consumer.on('consumer.disconnect', async () => {
      console.log('Consumer disconnected');
    });

    consumer.on('consumer.connect', async () => {
      console.log('Consumer connected');
    });

    process.on('SIGINT', async () => {
      try {
        await consumer.disconnect();
      } finally {
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error running consumer:', error);
    process.exit(1);
  }
};

run().catch(console.error);
//export default run;
