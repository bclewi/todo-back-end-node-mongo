export default interface IMongoConfig {
  uri: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    connectTimeoutMS: number;
    socketTimeoutMS: number;
  };
}
