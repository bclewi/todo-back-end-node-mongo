import { Router } from "express";
import * as controller from "../controllers/todoController";
import * as validator from "../middleware/validator";
import {
  getValidations,
  postValidations,
  putValidations,
  deleteValidations,
} from "../middleware/todoRouteValidations";

const router: Router = Router();

router
  .route("/todos")
  .post(validator.validate(postValidations), controller.createTodo)
  .get(controller.readTodos)

  // Not implemented - let validator respond with 400
  .put(validator.validate(putValidations))
  .delete(validator.validate(deleteValidations));

router
  .route("/todos/:id")
  .get(validator.validate(getValidations), controller.readTodo)
  .put(validator.validate(putValidations), controller.updateTodo)
  .delete(validator.validate(deleteValidations), controller.deleteTodo)

  // Not implemented - let validator respond with 400
  .post(validator.validate(postValidations));

export default router;
