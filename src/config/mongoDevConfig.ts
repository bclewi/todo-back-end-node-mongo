import "dotenv/config";
import * as mongoose from "mongoose";
import IMongoConfig from "../types/IMongoConfig";

const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DEV_DB } = process.env;

const uri: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DEV_DB}?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};
mongoose.set("useFindAndModify", false);

const mongoDevConfig: IMongoConfig = {
  uri,
  options,
};

export default mongoDevConfig;
