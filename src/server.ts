import "dotenv/config";
import app from "./app";
import * as mongoose from "mongoose";
import IMongoConfig from "./types/IMongoConfig";
import mongoTestConfig from "./config/mongoTestConfig";
import mongoDevConfig from "./config/mongoDevConfig";
import mongoProdConfig from "./config/mongoProdConfig";

const PORT: string | number = process.env.PORT || 4000;
const db: mongoose.Connection = mongoose.connection;

db.on("open", () => {
  console.log("Mongoose connected to MongoDB");
});

db.on("error", () => {
  console.error.bind(console, "connection error:");
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("Mongoose disconnecting from MongoDB");
    process.exit(0);
  });
});

const startServer = (mongoConfig: IMongoConfig): void => {
  const { uri, options } = mongoConfig;
  mongoose.connect(uri, options).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    return mongoose.connection;
  });
};

switch (process.env.NODE_ENV) {
  case "test":
    startServer(mongoTestConfig);
    break;
  case "development":
    startServer(mongoDevConfig);
    break;
  case "production":
    startServer(mongoProdConfig);
    break;
  default:
    break;
}
