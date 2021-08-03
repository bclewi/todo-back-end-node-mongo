import { Response, Request } from "express";
import { ITodo } from "../types/todo";
import Todo from "../models/todo";

const logRequest = (req: Request): void => {
  console.log(`${req.method} ${req.url}`);
};

const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    logRequest(req);
    const { textBody, isCompleted } = req.body;
    const todo: ITodo = new Todo({ textBody, isCompleted });
    const newTodo: ITodo = await todo.save();
    const allTodos: ITodo[] = await Todo.find();
    res.status(201).json({
      message: "Todo added",
      todo: newTodo,
      todos: allTodos,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const readTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    logRequest(req);
    const todos: ITodo[] = await Todo.find();
    res.status(200).json({ todos });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    logRequest(req);
    console.log(`req.body: ${JSON.stringify(req.body)}`);
    const updatedTodo: ITodo | null = await Todo.findByIdAndUpdate(
      { _id: req.params.id }, // filter
      req.body, // update
      { returnOriginal: false } // options
      // callback
    );
    const allTodos: ITodo[] = await Todo.find();
    res.status(200).json({
      mesage: "Todo updated",
      todo: updatedTodo,
      todos: allTodos,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    logRequest(req);
    const deletedTodo: ITodo | null = await Todo.findByIdAndDelete(
      req.params.id
    );
    const allTodos: ITodo[] = await Todo.find();
    res.status(200).json({
      message: "Todo deleted",
      todo: deletedTodo,
      todos: allTodos,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export { createTodo, readTodos, updateTodo, deleteTodo };
