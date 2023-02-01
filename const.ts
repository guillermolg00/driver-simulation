import * as dotenv from "dotenv"
dotenv.config()

interface MqttVariables {
  host: string | undefined;
  username: string | undefined;
  password: string | undefined;
}

// Mqtt client variables
export const mqttVariables: MqttVariables = {
  host: process.env.MQTT_HOST,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Here API key
export const hereApiKey = process.env.HERE_API_KEY

// Here API routing base URL
export const hereRoutingBaseUrl = "https://router.hereapi.com/v8/routes";

export const transportMode = "car";

// Coordinates of the starting and ending points
export const start: { lat: number; lon: number } = { lat: 25.740005, lon: -80.237815 };
export const end: { lat: number; lon: number } = { lat: 25.971434, lon: -80.246684 };

// ID of the driver
export const driverId = "test-driver";

// Speed of the mobile in km/h
export const speed: number = 90;