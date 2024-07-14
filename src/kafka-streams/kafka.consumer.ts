import { getKafka } from '../config/kafka.config';

const topic = 'user-spending';
const group = 'spending-group';
const consumer = getKafka('spending-consumer').consumer({groupId: group});

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if(message.value)
        {
          const { user, totalSpent } = JSON.parse(message.value.toString());
          console.log(`[Consumer] ${user} has spent a total of ${totalSpent}`);
        }        
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
