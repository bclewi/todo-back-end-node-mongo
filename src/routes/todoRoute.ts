import { Router, Request, Response } from "express";
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
  .post(
    validator.validate(postValidations),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { todo, todos } = await controller.createTodo(req.body.textBody);
        return res.status(201).json({
          message: "Todo created",
          todo,
          todos,
        });
      } catch (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  )
  .get(async (req: Request, res: Response): Promise<Response> => {
    try {
      const { todos } = await controller.readTodos();
      return res.status(200).json({ todos });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  });

router
  .route("/todos/:id")
  .get(
    validator.validate(getValidations),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { todo } = await controller.readTodo(req.params.id);
        if (!todo) {
          return res.status(404).json({
            message: "Todo not found",
          });
        }
        return res.status(200).json({ todo });
      } catch (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  )
  .put(
    validator.validate(putValidations),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { message, todo, todos } = await controller.updateTodo(
          req.params.id,
          req.body.textBody
        );
        if (!todo) {
          return res.status(404).json({
            message: "Todo not found",
            todos,
          });
        }
        return res.status(200).json({
          message,
          todo,
          todos,
        });
      } catch (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  )
  .delete(
    validator.validate(deleteValidations),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { todo, todos } = await controller.deleteTodo(req.params.id);
        if (!todo) {
          return res.status(404).json({
            message: "Todo not found",
          });
        }
        return res.status(200).json({
          message: "Todo deleted",
          todo,
          todos,
        });
      } catch (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  );

export default router;
