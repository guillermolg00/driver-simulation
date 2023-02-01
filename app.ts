import * as mqtt from "mqtt";
import { mqttVariables, driverId, start, end, speed } from "./const";


if (mqttVariables.host === undefined) {
  throw new Error("MQTT_HOST is not defined");
}

// Connect to the MQTT broker
const client = mqtt.connect(mqttVariables.host, {
  username: mqttVariables.username,
  password: mqttVariables.password,
});

interface ICoord { lat: number; lon: number }

// Haversine formula to calculate the distance between two points in km
const haversineDistance = (startCoords: ICoord, endCoords: ICoord) => {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  const  startLat = startCoords.lat;
  const  startLon = startCoords.lon;

  const  endLat = endCoords.lat;
  const  endLon = endCoords.lon;

  const  R = 6371; // Earth's radius in km

  const  x1 = endLat - startLat;
  const  dLat = toRad(x1);
  const  x2 = endLon - startLon;
  const  dLon = toRad(x2)
  const  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(startLat)) * Math.cos(toRad(endLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const  d = R * c;

  return d;
}

// Calculate the current position of the mobile
const getMobilePosition = (startCoords, endCoords, speed, time) => {
  const distance = haversineDistance(startCoords, endCoords) * 1000;
  const speedInMps = speed / 3.6;
  const distanceTraveled = speedInMps * time;
  const proportionTraveled = distanceTraveled / distance;
  const deltaLat = endCoords.lat - startCoords.lat;
  const deltaLon = endCoords.lon - startCoords.lon;
  const lat = startCoords.lat + (proportionTraveled * deltaLat);
  const lon = startCoords.lon + (proportionTraveled * deltaLon);
  const finalPosition = {lat: lat, lon: lon};
  return finalPosition;
}


client.on("connect", () => {
  // Subscribe to the "driver/location" channel
  client.subscribe(driverId, (err) => {
    if (!err) {
      console.log("Subscribed to driverId channel");
    }
  });
  
  let startCoords = start;
  let endCoords = end;
  let time = 0;

  // Start the simulation loop
  setInterval(() => {
    const currentPosition = getMobilePosition(startCoords, endCoords, speed, time += 1);
    console.log(currentPosition);
    console.log("distance to end: " + haversineDistance(currentPosition, endCoords) + " km")
    console.log("--------------------------------------------------")
    
    // If the mobile has reached the end of the route, reverse the route
    if (haversineDistance(currentPosition, endCoords) < 0.5) {
      startCoords === start ? startCoords = end : startCoords = start;
      endCoords === end ? endCoords = start : endCoords = end;
      time = 0;
    }

    // Create the message to be published
    let message = {
      lon: currentPosition.lon,
      lat: currentPosition.lat,
      angle: 0,
    };

    // Publish the current position to the MQTT broker
    client.publish(driverId, JSON.stringify(message));
  
  }, 1000);
});

// Handle incoming messages on the "driverId" channel
client.on("message", (topic, message) => {
  if (topic === driverId) {
    console.log(`Received location update: ${message.toString()}`);
    console.log("--------------------------------------------------");
  }
});