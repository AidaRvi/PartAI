# Project Overview

This project consists of three microservices:

- A `process` service
- Three `agent` services, each identified by a unique `agentId` for generating reports.

## Functionality

### Agent Services

- Each `agent` generates events at configurable intervals (Intervals can be adjusted via `docker-compose` environment variables).
- Events are sent to the `process` service using RabbitMQ.

### Process Service

- **Event Handling**:

  - Stores all received events in Redis.
  - Every 10 seconds, retrieves and then deletes events from Redis and persists them in MongoDB.

- **Rule Management**:

  - Supports the creation and modification of rules.
  - Rules are stored in Redis after creation, update, or deletion.
  - Rules will never be deleted; instead, their `isActive` property will be changed to ‍‍‍`false`, which make them inactive in the system.

- **Event-Rule Matching**:
  - After retrieving events every 10 seconds, rules are also fetched from Redis.
  - Events and rules will be compared with each other and the matching results will be stored in another collection.

## How to Run

To run the project, use the following command:

```bash
docker-compose -f ./devops-files/docker-compose.yml up -d
```

All APIs are available in the provided Postman collection in the project's root.
