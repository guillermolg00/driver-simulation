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
export const start: { lat: number; lon: number } = { lat: 25.77457383659246, lon: -80.13193667897372 }; //Ocean Dr, South Beach, Miami, FL 
export const end: { lat: number; lon: number } = { lat: 25.78449511622547, lon: -80.13769594701915 }; //Pérez Art Museum, Miami, FL 25.78449511622547, -80.13769594701915

// MQTT Topic to pub position message
export const driverId = "driver/position/123456";

// Speed of the mobile in km/h
export const speed: number = 150;