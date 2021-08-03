import { Router } from "express";
import {
  createTodo,
  readTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todo";

const router: Router = Router();

router.route("/todos").post(createTodo).get(readTodos);

router.route("/todos/:id").put(updateTodo).delete(deleteTodo);

export default router;
