import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
import * as morgan from "morgan";
import todoRoutes from "./routes/todoRoute";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

switch (process.env.NODE_ENV) {
  case "test":
    // no logger during jest testing
    break;
  case "development":
    app.use(morgan("dev"));
    break;
  case "production":
    app.use(morgan("common"));
    break;
  default:
    break;
}

app.use(todoRoutes);

export default app;
