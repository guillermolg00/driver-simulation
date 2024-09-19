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
export const end: { lat: number; lon: number } = { lat: 25.777918705484037, lon: -80.1875042347 }; //bayfront park  25.777918705484037, -80.1875042347
export const start: { lat: number; lon: number } = { lat: 25.832414560113364, lon: -80.20902644748736 }; //6200 NW 7th Ave, Miami,  FL 33150

// ID of the driver
// export const driverId = "driver/position/659f2a4e67a3b30e09ce415e";
export const driverId = "driver/position/649c375081bf341741a583d7";

// Speed of the mobile in km/h
export const speed: number = 180;