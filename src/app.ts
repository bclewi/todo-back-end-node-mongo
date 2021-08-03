import "dotenv/config";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import todoRoutes from "./routes/todo";

const app = express();
const PORT: string | number = process.env.PORT || 4000;
const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(todoRoutes);

const uri: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};
mongoose.set("useFindAndModify", false);

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

mongoose.connect(uri, options).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
