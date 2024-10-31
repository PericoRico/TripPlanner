## Description

The Trip Planner API allows users to search for trips from a specified origin to a destination and sort the results based on two available strategies: fastest or cheapest. This provides flexibility in choosing the best option based on either the shortest travel duration or the lowest cost.

The API integrates with a 3rd party service to fetch trip data, using the following endpoint: https://xxx.amazonaws.com/default/trips
Requests to the API must include an authentication key using the header x-api-key.

Swagger documentation with the main application details is available at: http://localhost:3000/api


## Installation


Requirements: 

- node 20.18


Install node modules:

```bash
$ npm install
```

## Running the app

Before running the app, ensure that all required environment variables are set correctly. 
You can do this by creating a `.env` file in the root directory based on `.env.example`. This file includes all necessary variables the application needs to function properly.


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Unit test are defined for the trips controller and service. 
E2e test are written for validation purposes.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

