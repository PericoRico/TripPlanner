## Description

The Trip Planner API allows users to search for trips from a specified origin to a destination and sort the results based on two available strategies: fastest or cheapest. This provides flexibility in choosing the best option based on either the shortest travel duration or the lowest cost.

The API integrates with a 3rd party service to fetch trip data, using the following endpoint: https://xxx.amazonaws.com/default/trips

**Note**: All requests to this API require an authentication key provided in the header `x-api-key`.

For interactive API documentation and testing, Swagger is available at:: http://localhost:3000/api

- When opening Swagger in the browser, use the **Authorize** button in the top-right corner to enter the API key from your `.env` file. Swagger will then automatically include this key in the `x-api-key` header for all requests.


## Installation


### Requirements

- Node.js v20.18 or later

### Setup

1. Clone the repository:
   
```bash
   git clone https://github.com/PericoRico/TripPlanner
 ```

2. Install dependencies:

```bash
$ npm install
```
3. Set up environment variables:

Before running the app, ensure that all required environment variables are set correctly. 
You can do this by creating a `.env` file in the root directory based on `.env.example`. This file includes all necessary variables the application needs to function properly.

## Running the app


Ensure that all required environment variables are set correctly in the .env file.


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Test

The project includes unit tests for critical components metioned on the assingment, as well as e2e tests for validation and integration purposes.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

## Extra features

### Saving, list and deleting trips

The CRUD functionalities for saving and deleting trips are currently operational thanks to a free-tier database that has been set up to support these features. Plase take this into consideration while using the application.

In this exercise, the implemented API allows any user to save or delete trip entries without specific user restrictions or ownership verification. This approach meets the exercise requirements but may not reflect typical production standards, where strict access controls would likely be in place. In a production-ready application, each trip entry would ideally be linked to a unique user identifier, with appropriate authorization measures to ensure only the owner of a trip entry can modify or delete it.

This design is intended solely for demonstration purposes and should not be assumed as secure or privacy-compliant for production environments.


### Cache Manager

A cache manager has been implemented to enhance the performance of the API by reducing the response time for frequently accessed data.

### Stopover trips

The API supports searching for trips, among the database saved ones, that may include a stopover. When querying for trips, users can specify an origin and a destination, and the API will return not only direct routes but also options that involve up to one stopover.

The logic for identifying stopover trips involves two main steps:

1. **First Leg:** The API filters available trips to find potential routes from the specified origin to a stopover city.
2. **Second Leg:** It then searches for routes from that stopover city to the final destination.


Stopover trips "type" is determined by  the transport type of the first leg, which may not always be accurate for combined transport options. Future improvements could include more precise classification for multi-leg journeys.

In a production environment, it would be beneficial to implement additional filters or criteria for searching trips, enhancing the user experience and providing more tailored results.

