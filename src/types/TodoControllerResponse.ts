import ITodo from "./ITodo";

interface CreateProps {
  textBody: string;
  [x: string]: any;
}

interface ReadProps {
  id: string;
}

interface UpdateProps {
  id: string;
  textBody: string | null;
  [x: string]: any;
}

interface DeleteProps {
  id: string;
  [x: string]: any;
}

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
  CreateProps,
  ReadProps,
  UpdateProps,
  DeleteProps,
  CreateResponse,
  ReadResponse,
  ReadAllResponse,
  UpdateResponse,
  DeleteResponse,
};
