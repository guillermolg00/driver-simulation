"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.speed = exports.driverId = exports.end = exports.start = exports.mqttVariables = void 0;
// Mqtt client variables
exports.mqttVariables = {
    host: "mqtt://172.31.25.238:1883",
    username: "mqtt_api_898989",
    password: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXF0dF9hcGlfODk4OTg5IiwiaWQiOiI2MzBlN2NkMzIwZGZiMTAwMTEzNTI3ZjkiLCJpYXQiOjE2NjE4OTM4NDMsImV4cCI6MTcyNTAwOTA0M30.2MQzJOnfjTNuKAZbzbpW5rUfmAAaaVYdGkuRV0Xm9L0",
};
// Coordinates of the starting and ending points
exports.start = { lat: 25.740005, lon: -80.237815 };
exports.end = { lat: 25.971434, lon: -80.246684 };
// ID of the driver
exports.driverId = "test-driver";
// Speed of the mobile in km/h
exports.speed = 100;
//# sourceMappingURL=const.js.map