import "dotenv/config";
import app from "./app";
import * as mongoose from "mongoose";
import { mongoConfig } from "./config";

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

const startServer = (uri: string, options: mongoose.ConnectOptions): void => {
  mongoose.connect(uri, options).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    return mongoose.connection;
  });
};

startServer(mongoConfig.uri, mongoConfig.options);
