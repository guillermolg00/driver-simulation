# HERE Route Position Emulator with MQTT Publishing

This repository contains a small Node.js application that simulates a driver's movement along a route obtained from the HERE Routing API. The application periodically publishes the current position (latitude, longitude, and heading angle) to an MQTT broker. This is useful for testing real-time location data consumption without needing a physical moving device.

## Features

- Retrieves a route between a start and end point using the HERE Routing API.
- Decodes the provided polyline into an array of intermediate coordinates.
- Simulates movement at a configurable speed (in km/h).
- Calculates the current position based on elapsed time and speed.
- Publishes the position (lat, lon, angle) to an MQTT topic.
- Easily adjust variables such as MQTT credentials, speed, start/end points, HERE API key, and more.

## General Architecture

1. **Route Retrieval**: Sends a request to the HERE Routing API, using an `apiKey` and the defined parameters (`start`, `end`, `transportMode`, etc.).
2. **Polyline Decoding**: The route returned by HERE is provided as a polyline. Using a decoding library, the polyline is transformed into latitude/longitude coordinates.
3. **Movement Simulation**: Iterates through the array of coordinates, using elapsed time, distance, and speed to calculate the current position.
   - Applies the haversine formula to calculate distances between geographic points.
   - Increments time every second to compute the intermediate lat/lon.
4. **Angle Calculation**: Determines the heading angle of the "car" based on the vector formed by the start-end coordinates of each segment.
5. **MQTT Publishing**: At fixed intervals (1 second), publishes the current position to the MQTT topic defined by `driverId`.

## Prerequisites

- Node.js (version 14 or higher recommended)
- NPM or Yarn
- A HERE Routing API Key (obtainable from the [HERE Developer Portal](https://developer.here.com/))
- An accessible MQTT broker (e.g., Mosquitto, HiveMQ, EMQX, etc.)

## Variables and Configuration

Most variables and configurations are stored in the `const.ts` file, and the MQTT and HERE credentials should be placed in the `.env` file.

## Running the Application

You can run the application using:

```bash
npm run start
```

Alternatively, you can use the docker-compose.yml provided in the repository:

```bash
docker-compose up
```