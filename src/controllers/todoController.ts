import { Response, Request } from "express";
import ITodo from "../types/ITodo";
import * as todoService from "../services/todoService";

const createTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const todo = await todoService.create(req.body.textBody);
    const todos = await todoService.readAll();
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
    const todo = await todoService.readById(req.params.id);

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
    const todos = await todoService.readAll();
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
    let message: string = "";

    if (!textBody) {
      todo = await todoService.updateCompleteById(id);
      message = "Todo completion status updated";
    } else {
      todo = await todoService.updateTextById(id, textBody);
      message = "Todo text updated";
    }
    const todos = await todoService.readAll();

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
};

const deleteTodo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const todo = await todoService.deleteById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const todos = await todoService.readAll();
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
