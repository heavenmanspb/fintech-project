# Backend Fintech Project (Node.js)

This project is a backend application for a fintech application developed in Node.js.

## Description

The application utilizes the etherscan.io API to retrieve transaction information from the Ethereum network based on block numbers. It includes a cron-job service that continuously saves transaction data into a PostgreSQL database in real-time, with a frequency of once per minute. Additionally, it provides an API endpoint to retrieve the address with the largest balance change in the last 100 blocks.

## Installation

1. Clone this repository.
2. Run `npm install` to install the required dependencies.

## Usage

### Run in dev mode
1. Clone .env `cp .env.sample .env`
2. Run db `npm run db:start`
3. Run migrations `npm run migration:run`
4. Run in dev mode `npm run start:dev`

### Run in docker
1. Clone .env `cp .env.prod.sample .env.prod`
2. Run db `docker compose up`

## Swagger

- `GET /docs`: Swagger API Documentation

## API Endpoint

- `GET /top-changed-address`: Retrieve the address with the largest balance change in the last 100 blocks.
