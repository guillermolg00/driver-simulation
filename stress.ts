import * as mqtt from "mqtt";
import { mqttVariables } from "./const";
const poly = require('./decode');


const createMqttClient = (driverId) => {
  const client = mqtt.connect(mqttVariables.host, {
    username: mqttVariables.username,
    password: mqttVariables.password,
    clientId: `stress_test_${driverId}`
  });

  return client;
}

const startSimulation = (client, driverId) => {
  client.on("connect", () => {
    console.log(`Client ${driverId} connected`);
    client.subscribe(driverId, (err) => {
      if (!err) {
        console.log(`Client ${driverId} subscribed to channel`);
      }
    });

    let increment = 0;
    setInterval(() => {
      let message = { 
        lat: 25.740005 + increment, 
        lon: -80.237815 + increment, 
        angle: 0 
      };

      increment += 0.0001;
      client.publish(driverId, JSON.stringify(message));
    }, 500);
  });
}

const main = () => {
  for (let j = 1; j <= 1000; j++) {
    const driverId = `driver/position/driverTest${j}`;
    const client = createMqttClient(driverId);
    startSimulation(client, driverId);
  }
}

const startObserver = (topic) => {
  const client = mqtt.connect(mqttVariables.host, {
    username: mqttVariables.username,
    password: mqttVariables.password,
    clientId: `observer_${topic}`
  });

  let lastMessageTime = null;

  client.on("connect", () => {
    console.log(`Observer connected and subscribed to ${topic}`);
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Observer subscribed to ${topic}`);
      }
    });
  });

  client.on("message", (topic, message) => {
    const currentTime = Date.now();
    const interval = lastMessageTime ? currentTime - lastMessageTime : 0;
    console.log(`Message received on ${topic}. Interval since last message: ${interval} ms`);
    lastMessageTime = currentTime;
  });
}

main()
// startObserver("driver/position/driverTest1");

