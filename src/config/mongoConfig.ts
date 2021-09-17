import "dotenv/config";
import * as mongoose from "mongoose";
import { IMongoConfig } from "../types";

const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;
let mongoDb: string = "";
let options: mongoose.ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};
mongoose.set("useFindAndModify", false);

if (process.env.NODE_ENV === "development") {
  mongoDb = process.env.MONGO_DEV_DB;
} else if (process.env.NODE_ENV === "production") {
  throw new Error("mongoose is not configured for production");
}

const uri: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${mongoDb}?retryWrites=true&w=majority`;

const mongoConfig: IMongoConfig = {
  uri,
  options,
};

export default mongoConfig;
