import { ConnectOptions } from "mongoose";

export default interface MongoConfig {
  uri: string;
  options: ConnectOptions;
}
