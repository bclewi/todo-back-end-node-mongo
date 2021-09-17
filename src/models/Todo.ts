import { model } from "mongoose";
import { ITodo } from "../types";
import todoSchema from "../schemas/todoSchema";

const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
