import ITodo from "./ITodo";

interface CreateResponse {
  todo: ITodo;
  todos: ITodo[];
}

interface ReadResponse {
  todo: ITodo;
}

interface ReadAllResponse {
  todos: ITodo[];
}

interface UpdateResponse {
  message: string;
  todo: ITodo;
  todos: ITodo[];
}

interface DeleteResponse {
  todo: ITodo;
  todos: ITodo[];
}

export {
  CreateResponse,
  ReadResponse,
  ReadAllResponse,
  UpdateResponse,
  DeleteResponse,
};
