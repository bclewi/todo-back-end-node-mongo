import { Router } from "express";
import {
  createTodo,
  readTodo,
  readTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
// import { body } from "express-validator";

// TODO - implement validation middleware

const router: Router = Router();

router
  .route("/todos")
  .post(
    // body("textBody").trim().escape(),
    // body("isComplete").toBoolean(),
    createTodo
  )
  .get(readTodos);

router
  .route("/todos/:id")
  .get(readTodo)
  .put(
    // body("textBody").trim().escape(),
    // body("isComplete").toBoolean(),
    updateTodo
  )
  .delete(deleteTodo);

export default router;
