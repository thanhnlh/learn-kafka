import { getKafka } from '../config/kafka.config';

const producer = getKafka('purchase-producer').producer();
const topic = 'user-purchases';

const run = async () => {
  try {
    await producer.connect();

    const users = ['user1', 'user2', 'user3'];
    setInterval(async () => {
      const user = users[Math.floor(Math.random() * users.length)];
      const amount = Math.floor(Math.random() * 100) + 1;
      const message = { user, amount };
      console.log('Producing:', message);
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    }, 5000); // Producing an event every 5 seconds

  } catch (error) {
    console.error('Error producing message:', error);
  }  
};

run().catch(console.error);
