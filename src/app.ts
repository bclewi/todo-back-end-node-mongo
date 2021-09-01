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
app.use(morgan("dev"));
app.use(todoRoutes);

export default app;
