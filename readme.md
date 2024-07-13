## 1. Apache Kafka

### 1.1 Introduction

**What is event streaming?**
Event streaming is akin to the central nervous system of the digital world, serving as the backbone for real-time data flows. It captures data from various sources in real-time, stores these data streams, processes and reacts to them both in real-time and retrospectively, and routes them to the appropriate destinations. This ensures timely and accurate information delivery.

**Applications of event streaming:**

* Real-time financial transactions in stock exchanges and banks.
* Monitoring vehicles and shipments in logistics.
* Capturing and analyzing sensor data in IoT devices.
* Reacting to customer interactions in retail and travel industries.
* Monitoring patients in healthcare for timely treatment.
* Integrating data across different company divisions.
* Building data platforms, event-driven architectures, and microservices.

**Apache Kafka® as an event streaming platform:**
Kafka provides three main capabilities:

1. Publishing and subscribing to event streams.
2. Storing event streams durably.
3. Processing event streams in real-time or retrospectively.

Kafka is distributed, highly scalable, fault-tolerant, and secure. It can be deployed in various environments and managed either by the user or through fully managed services.

**How Kafka works:**
Kafka consists of servers (brokers) and clients:

* **Servers:** Form the storage layer, continuously import/export data, and ensure high availability and fault tolerance.
* **Clients:** Allow distributed applications to read, write, and process events at scale.

**Main Concepts and Terminology:**

* **Event:** Records something that happened, consisting of a key, value, timestamp, and optional metadata.
* **Producers:** Applications that publish events to Kafka.
* **Consumers:** Applications that subscribe to and process events from Kafka.
* **Topics:** Organized and durable storage for events, partitioned for scalability.
* **Replication:** Ensures fault-tolerance and high availability by replicating data across multiple brokers.

**Kafka APIs:**

1. **Admin API:** Manages Kafka objects.
2. **Producer API:** Publishes events to topics.
3. **Consumer API:** Subscribes to and processes events from topics.
4. **Kafka Streams API:** Implements stream processing applications.
5. **Kafka Connect API:** Builds connectors for data import/export to integrate with Kafka.

**Further Learning:**

* For detailed information and to cite the original source, please refer to the [Apache Kafka documentation](https://kafka.apache.org/documentation/#gettingStarted). This page provides comprehensive insights into getting started with Kafka, including its key concepts, use cases, and APIs.

### 1.2 Use Cases

**Messaging:**
Kafka serves as a high-throughput, fault-tolerant replacement for traditional message brokers like ActiveMQ or RabbitMQ, ideal for large-scale message processing applications.

**Website Activity Tracking:**
Kafka captures user activity on websites in real-time, enabling monitoring, processing, and analysis of high-volume activity data.

**Metrics:**
Kafka aggregates and centralizes operational monitoring data from distributed applications.

**Log Aggregation:**
Kafka abstracts log data into streams, allowing lower-latency processing and easier support for multiple data sources compared to systems like Scribe or Flume.

**Stream Processing:**
Kafka supports complex data processing pipelines, transforming raw input into enriched output for further consumption, facilitated by the Kafka Streams library.

**Event Sourcing:**
Kafka logs state changes as a time-ordered sequence of records, making it suitable for applications designed in the event sourcing style.

**Commit Log:**
Kafka acts as an external commit-log for distributed systems, aiding in data replication and re-syncing failed nodes. Its log compaction feature supports this use case, similar to the Apache BookKeeper project.

## 2. Kafka Setup with Docker

#### Prerequisites

* Docker installed on your machine.

#### 2.1: Create a Docker Compose file

Create a `docker-compose.yml` file in your project root directory with the following content:

```
version: '2'

services:
  zookeeper:
    image: wurstmeister/zookeeper:latest
    ports:
      - "2181:2181"

  kafka:
    image: wurstmeister/kafka:latest
    ports:
      - "9092:9092"
    expose:
      - "9093"
    environment:
      KAFKA_ADVERTISED_LISTENERS: INSIDE://kafka:9093,OUTSIDE://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INSIDE:PLAINTEXT,OUTSIDE:PLAINTEXT
      KAFKA_LISTENERS: INSIDE://0.0.0.0:9093,OUTSIDE://0.0.0.0:9092
      KAFKA_INTER_BROKER_LISTENER_NAME: INSIDE
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_CREATE_TOPICS: "tomyum-topic:1:1"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

#### 2.2: Run Kafka

To download Docker imagess and start the Kafka and Zookeeper services in detached mode 
```
docker-compose up -d
```

To check the Kafka and Zookeeper containers status
```
docker ps
```

To stop and remove the Kafka and Zookeeper containers
```
docker-compose down
```

## 3. Using KafkaJS with TypeScript

### 3.1 Introduction to KafkaJS

KafkaJS is a modern client library for Apache Kafka that is written in JavaScript. It provides a simple and intuitive API to interact with Kafka, making it an excellent choice for Node.js applications. KafkaJS supports both JavaScript and TypeScript, allowing for type-safe Kafka applications.

### 3.2 Setting Up KafkaJS

To get started with KafkaJS in a TypeScript project, you need to install the necessary packages:

```
npm install kafkajs
npm install --save-dev @types/kafkajs typescript
```

### 3.3 Connecting to Kafka

Create a Kafka client and connect to your Kafka brokers:

```
import { Kafka } from 'kafkajs';
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});const consumer = kafka.consumer({ groupId: 'test-group' });
```

### 3.4 Consuming Messages

Kafka consumers read messages from Kafka topics. Here’s how you can set up a consumer to read messages from a topic:

```
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};run().catch(console.error);
```

KafkaJS provides robust error handling mechanisms. You can handle errors during message consumption by attaching error handlers:

```
consumer.on('consumer.crash', async event => {
  console.error('Consumer crashed', event);
});

consumer.on('consumer.disconnect', async () => {
  console.log('Consumer disconnected');
});

consumer.on('consumer.connect', async () => {
  console.log('Consumer connected');
});
```

### 3.6 Graceful Shutdown

To handle graceful shutdown of the consumer, ensure that the consumer disconnects properly when the application is terminated:

```
process.on('SIGINT', async () => {
  try {
    await consumer.disconnect();
  } finally {
    process.exit(0);
  }
});
```

### 3.7 Using TypeScript Types

KafkaJS comes with built-in TypeScript definitions, which makes it easy to write type-safe code. You can define types for your Kafka messages to ensure type safety:

```
interface KafkaMessage {
  key: string;
  value: string;
  headers?: Record<string, any>;
}

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const kafkaMessage: KafkaMessage = {
        key: message.key?.toString(),
        value: message.value.toString(),
        headers: message.headers,
      };

    console.log(kafkaMessage);
    },
  });
};

run().catch(console.error);
```

### 3.8 Code Examples

Within the src folder, you'll find code examples demonstrating how consumers and producers interact with Kafka.

In your package.json, you have defined scripts to manage Docker containers and run Kafka consumers and producers using TypeScript with ts-node:

```
"scripts": {
  "dev:consumer": "ts-node src/consumer.index.ts",
  "dev:producer": "ts-node src/producer.index.ts",
  "kafka:state": "docker ps",
  "kafka:start": "docker-compose up -d",
  "kafka:stop": "docker-compose down"
}
```

Explanation:

`dev:consumer`: Runs the Kafka consumer located at src/consumer.index.ts using TypeScript and ts-node.

`dev:producer`: Runs the Kafka producer located at src/producer.index.ts using TypeScript and ts-node.

`kafka:state`: Checks the status of Docker containers running Kafka (docker ps).

`kafka:start`: Starts Docker containers for Kafka using docker-compose up -d.

`kafka:stop`: Stops and removes Docker containers for Kafka using docker-compose down.

These scripts facilitate the setup, execution, and management of Kafka consumers and producers in your development environment.