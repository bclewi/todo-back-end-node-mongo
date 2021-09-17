import { ConnectOptions } from "mongoose";

export default interface IMongoConfig {
  uri: string;
  options: ConnectOptions;
}
