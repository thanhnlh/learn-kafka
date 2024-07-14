import { getKafka } from '../config/kafka.config';

const group = 'purchase-group';
const newKafka = getKafka('purchase-processor');
const consumer = newKafka.consumer({ groupId: group });
const producer = newKafka.producer();

const inputTopic = 'user-purchases';
const outputTopic = 'user-spending';

const run = async () => {
  try {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic: inputTopic, fromBeginning: true });

    const userSpending: { [key: string]: number } = {};

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
        const { user, amount } = JSON.parse(message.value.toString());
        userSpending[user] = (userSpending[user] || 0) + amount;
        console.log(`[Processor] ${user} spent ${amount}, total: ${userSpending[user]}`);

        await producer.send({
          topic: outputTopic,
          messages: [
            {
              key: user,
              value: JSON.stringify({ user, totalSpent: userSpending[user] }),
            },
          ],
        });
      }}
    });

  } catch (error) {
    console.error('Error producing message:', error);
  }  
};

run().catch(console.error);
