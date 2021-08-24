import ITodo from "../types/ITodo";
import { model, Schema } from "mongoose";

const todoSchema: Schema = new Schema(
  {
    textBody: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 300,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
