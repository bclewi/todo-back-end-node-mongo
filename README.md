# Todo Web-app Back-end (Mongo/Express/Node)

A todo app REST API to perform basic CRUD operations on a MongoDB document database. Created as a part of a MERN full-stack web-app.

## API Project Scope

- manage one todo list
- validate and sanitize input
- unit test core business logic
- end-to-end integration testing

## Environment Configuration

Include a `.env` environment config file in the project root directory with the contents below, replacing the values with your actual mongodb settings.

```
PORT=#####
MONGO_USER=username
MONGO_PASSWORD=password
MONGO_CLUSTER=cluster#.#####.mongodb.net
MONGO_DEV_DB=mongoDevDb
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode on [http://localhost:4000](http://localhost:4000).

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run test`

### `npm t`

Builds the app and then runs all test suites ending in `.test.ts` with jest.
