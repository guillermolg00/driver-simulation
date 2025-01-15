import * as mqtt from "mqtt";
import {
  mqttVariables,
  driverId,
  start,
  end,
  speed,
  hereApiKey,
  hereRoutingBaseUrl,
  transportMode,
} from "./const";
const axios = require("axios");
const poly = require("./decode");

const startPoint = `${start.lat},${start.lon}`;
const endPoint = `${end.lat},${end.lon}`;
const queryParams = new URLSearchParams({
  transportMode: transportMode,
  origin: startPoint,
  destination: endPoint,
  lang: "en-US",
  apiKey: hereApiKey,
  return: "polyline",
});
const url = `${hereRoutingBaseUrl}?${queryParams.toString()}`;

async function getDecodedPolyline() {
  try {
    const response = await axios.get(url);
    const polyline = await response.data.routes[0].sections[0].polyline;
    return await polyline;
  } catch (error) {
    console.error(error);
  }
}

getDecodedPolyline().then((originalPolyline) => {
  const decodedPolyline = poly.decode(originalPolyline);
  const polyline = decodedPolyline.polyline.map(([lat, lon]) => ({
    lat: lat,
    lon: lon,
  }));

  if (mqttVariables.host === undefined) {
    throw new Error("MQTT_HOST is not defined");
  }

  // Connect to the MQTT broker
  const client: mqtt.MqttClient = mqtt.connect(mqttVariables.host, {
    username: mqttVariables.username,
    password: mqttVariables.password,
  });

  interface ICoord {
    lat: number;
    lon: number;
  }

  // Haversine formula to calculate the distance between two points in km
  const haversineDistance = (startCoords: ICoord, endCoords: ICoord) => {
    function toRad(x) {
      return (x * Math.PI) / 180;
    }

    const startLat = startCoords.lat;
    const startLon = startCoords.lon;

    const endLat = endCoords.lat;
    const endLon = endCoords.lon;

    const R = 6371; // Earth's radius in km

    const x1 = endLat - startLat;
    const dLat = toRad(x1);
    const x2 = endLon - startLon;
    const dLon = toRad(x2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(startLat)) *
        Math.cos(toRad(endLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
  };

  const calculateAngle = (startCoords: ICoord, endCoords: ICoord) => {
    const deltaLon = endCoords.lon - startCoords.lon;
    const deltaLat = endCoords.lat - startCoords.lat;
  
    let angle = Math.atan2(deltaLon, deltaLat);
    angle = (angle * 180) / Math.PI;
  
    if (angle < 0) {
      angle += 360;
    }
  
    return angle;
  };
  
  // Calculate the current position of the mobile
  const getMobilePosition = (startCoords, endCoords, speed, time) => {
    const distance = haversineDistance(startCoords, endCoords) * 1000;
    const speedInMps = speed / 3.6;
    const distanceTraveled = speedInMps * time;
    const proportionTraveled = distanceTraveled / distance;
    const deltaLat = endCoords.lat - startCoords.lat;
    const deltaLon = endCoords.lon - startCoords.lon;
    const lat = startCoords.lat + proportionTraveled * deltaLat;
    const lon = startCoords.lon + proportionTraveled * deltaLon;
    const finalPosition = { lat: lat, lon: lon };
    return finalPosition;
  };

  client.on("connect", () => {
    // Subscribe to the "driver/location" channel
    client.subscribe(driverId, (err) => {
      if (!err) {
        console.log("Subscribed to driverId channel");
      }
    });

    let i = 0;
    let time = 0;

    // Start the simulation loop
    const positionInterval = setInterval(() => {
      if (i >= polyline.length - 1) {
        clearInterval(positionInterval);
        console.log("The simulation has ended. Please restart if you wish to begin again.");
        return;
      }


      let startCoords: ICoord = polyline[i];
      let endCoords: ICoord = polyline[i + 1];

      const currentPosition = getMobilePosition(
        startCoords,
        endCoords,
        speed,
        (time += 1)
      );

      // Just used for logs purpose, comment if you dont needed
      console.log("currentPosition", currentPosition);
      console.log("driverId", driverId)
      console.log("endCoords", endCoords)
      console.log("distance to end: " + haversineDistance(currentPosition, endCoords) + " km")
      console.log("--------------------------------------------------")

      // Calculate the angle based on the direction of movement
      const angle = calculateAngle(startCoords, endCoords);

      // Create the message to be published
      let message = {
        lon: currentPosition.lon,
        lat: currentPosition.lat,
        angle: angle,
      };

      // Publish the current position to the MQTT broker
      client.publish(driverId, JSON.stringify(message));

      // If the mobile has reached the end of the route, set startCoords and endCoords to the next route in the decodedPolyline array
      if (haversineDistance(currentPosition, endCoords) < 0.1) {
        i = i < polyline.length - 1 ? i + 1 : polyline.length - 1;
        time = 0;
      }
    }, 1000);
  });

  // Handle incoming messages on the "driverId" topic (Just used for logs purpose, comment if you dont needed)
  client.on("message", (topic, message) => {
    if (topic === driverId) {
      console.log(`Received location update: ${message.toString()}`);
      console.log("--------------------------------------------------");
    }
  });
});
