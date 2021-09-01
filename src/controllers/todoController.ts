import { Response, Request } from "express";
import * as TodoService from "../services/todoService";
import ITodo from "../types/ITodo";
import * as mongoose from "mongoose";

// TODO - Extract validation logic into middleware

const createTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { textBody } = req.body;
    if (!textBody) {
      return res.status(400).json({
        message: "textBody is required",
      });
    }

    const todo = await TodoService.create(textBody);
    const todos = await TodoService.readAll();
    let error = todo.validateSync();
    // console.log("todo.textBody error: ", error.errors["textBody"].message);
    // console.log("todo.isComplete error: ", error.errors["isComplete"].message);
    return res.status(201).json({
      message: "Todo added",
      todo,
      todos,
    });
  } catch (err) {
    if (err.message === "Todo.textBody cannot be an empty string") {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};

const readTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const todo = await TodoService.readById(req.params.id);
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
};

const readTodos = async (req: Request, res: Response): Promise<Response> => {
  try {
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
    const { id } = req.params;
    const { textBody } = req.body;
    let todo: ITodo = null;

    // validation
    if (!id) {
      return res.status(400).json({
        message: "id param is required to update a Todo",
      });
    } else if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid id param",
      });
    }

    if (!textBody) {
      todo = await TodoService.updateCompleteById(id);
    } else {
      todo = await TodoService.updateTextById(id, textBody);
    }

    const todos = await TodoService.readAll();

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
        todos,
      });
    }

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
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   return res.status(400).json({
    //     message: "Bad request",
    //   });
    // }
    const todo = await TodoService.deleteById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
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
