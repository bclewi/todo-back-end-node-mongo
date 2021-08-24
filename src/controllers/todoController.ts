import { Response, Request } from "express";
import * as TodoService from "../services/todoMongooseService";
// import { logRequest } from "../services/logger";
import * as mongoose from "mongoose";
import Todo from "../models/todoModel";

const createTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    // logRequest(req);
    const { textBody, isComplete } = req.body;

    const todo = await TodoService.create(textBody, isComplete);
    const todos = await TodoService.readAll();
    // let error = todo.validateSync();
    // console.log("todo.textBody error: ", error.errors["textBody"].message);
    // console.log("todo.isComplete error: ", error.errors["isComplete"].message);
    return res.status(201).json({
      message: "Todo added",
      todo,
      todos,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const readTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    // logRequest(req);
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   return res.status(400).json({
    //     message: "Bad request",
    //   });
    // }

    const todo = await TodoService.readById(req.params.id);
    // if (!todo) {
    //   return res.status(404).json({
    //     message: "Todo not found",
    //   });
    // }
    return res.status(200).json({ todo });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const readTodos = async (req: Request, res: Response): Promise<Response> => {
  try {
    // logRequest(req);
    const todos = await TodoService.readAll();
    return res.status(200).json({ todos });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    // logRequest(req);
    const { textBody, isComplete } = req.body;
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   console.log("_id is an invalid ObjectId");
    //   return res.status(400).json({
    //     message: "Bad request",
    //   });
    // } else if (!textBody && !isComplete) {
    //   console.log("textBody or isComplete required to update resource");
    //   return res.status(400).json({
    //     message: "Bad request",
    //   });
    // }

    const todo = await TodoService.updateById(
      req.params.id,
      textBody,
      isComplete
    );
    // if (!updatedTodo) {
    //   return res.status(404).json({
    //     message: "Todo not found",
    //   });
    // }
    const todos = await TodoService.readAll();
    return res.status(200).json({
      message: "Todo updated",
      todo,
      todos,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    // logRequest(req);
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   return res.status(400).json({
    //     message: "Bad request",
    //   });
    // }
    const todo = await TodoService.deleteById(req.params.id);
    // if (!deletedTodo) {
    //   return res.status(404).json({
    //     message: "Todo not found",
    //   });
    // }
    const todos = await TodoService.readAll();
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
};

export { createTodo, readTodo, readTodos, updateTodo, deleteTodo };
