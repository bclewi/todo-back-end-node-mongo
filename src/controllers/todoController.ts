import * as todoService from "../services/todoService";
import { ITodo } from "../types";
import {
  CreateResponse,
  ReadResponse,
  ReadAllResponse,
  UpdateResponse,
  DeleteResponse,
} from "../types/TodoControllerResponse";

const createTodo = async (textBody: string): Promise<CreateResponse> => {
  const todo = await todoService.create(textBody);
  const todos = await todoService.readAll();
  return {
    todo,
    todos,
  };
};

const readTodo = async (id: string): Promise<ReadResponse> => {
  const todo = await todoService.readById(id);
  return { todo };
};

const readTodos = async (): Promise<ReadAllResponse> => {
  const todos = await todoService.readAll();
  return { todos };
};

const updateTodo = async (
  id: string,
  textBody: string | null
): Promise<UpdateResponse> => {
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

  return { message, todo, todos };
};

const deleteTodo = async (id: string): Promise<DeleteResponse> => {
  const todo = await todoService.deleteById(id);
  const todos = await todoService.readAll();
  return {
    todo,
    todos,
  };
};

export { createTodo, readTodo, readTodos, updateTodo, deleteTodo };
