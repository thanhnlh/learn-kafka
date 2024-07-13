import { kafka, topic } from '../config/kafka.config';

const consumer = kafka.consumer({ groupId: 'tomyum-group' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });        
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

export default run;
