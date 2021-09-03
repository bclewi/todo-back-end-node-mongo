import { model } from "mongoose";
import ITodo from "../types/ITodo";
import todoSchema from "../schemas/todoSchema";

const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
