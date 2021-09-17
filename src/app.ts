import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import { corsConfig, loggerConfig } from "./config";
import todoRoutes from "./routes/todoRoute";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(loggerConfig.preset));
app.use(cors(corsConfig));
app.use(todoRoutes);

export default app;
