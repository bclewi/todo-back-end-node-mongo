import * as todoService from "../services/todoService";
import {
  ITodo,
  CreateProps,
  ReadProps,
  UpdateProps,
  DeleteProps,
  CreateResponse,
  ReadResponse,
  ReadAllResponse,
  UpdateResponse,
  DeleteResponse,
} from "../types";

const createTodo = async (props: CreateProps): Promise<CreateResponse> => {
  const todo = await todoService.create({ textBody: props.textBody });
  const todos = await todoService.readAll();
  return {
    todo,
    todos,
  };
};

const readTodo = async (props: ReadProps): Promise<ReadResponse> => {
  const todo = await todoService.readById({ id: props.id });
  return { todo };
};

const readTodos = async (): Promise<ReadAllResponse> => {
  const todos = await todoService.readAll();
  return { todos };
};

const updateTodo = async (props: UpdateProps): Promise<UpdateResponse> => {
  const { id, textBody } = props;
  let todo: ITodo = null;
  let message: string = "";

  if (!textBody) {
    todo = await todoService.updateCompleteById({ id });
    message = "Todo completion status updated";
  } else {
    todo = await todoService.updateTextById({ id, textBody });
    message = "Todo text updated";
  }
  const todos = await todoService.readAll();

  return { message, todo, todos };
};

const deleteTodo = async (props: DeleteProps): Promise<DeleteResponse> => {
  const todo = await todoService.deleteById({ id: props.id });
  const todos = await todoService.readAll();
  return {
    todo,
    todos,
  };
};

export { createTodo, readTodo, readTodos, updateTodo, deleteTodo };
