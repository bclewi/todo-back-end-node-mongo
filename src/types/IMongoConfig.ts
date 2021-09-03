import * as mongoose from "mongoose";

export default interface IMongoConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}
