import "dotenv/config";
import * as mongoose from "mongoose";
import IMongoConfig from "../types/IMongoConfig";

const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_PROD_DB } =
  process.env;

const uri: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_PROD_DB}?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};
mongoose.set("useFindAndModify", false);

const mongoProdConfig: IMongoConfig = {
  uri,
  options,
};

export default mongoProdConfig;
