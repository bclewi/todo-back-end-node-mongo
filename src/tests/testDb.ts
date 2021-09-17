import "dotenv/config";
import * as mongoose from "mongoose";
import { mongoConfig } from "../config";
import { MongoMemoryServer } from "mongodb-memory-server";

const odm = mongoose.connection;
let mongo: MongoMemoryServer;

const connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  const { options } = mongoConfig;
  await mongoose.connect(uri, options);
};

const clear = async () => {
  for (const key in odm.collections) {
    const collection = odm.collections[key];
    await collection.deleteMany({});
  }
};

const close = async () => {
  await odm.dropDatabase();
  await odm.close();
  await mongo.stop();
};

export { connect, clear, close };
