import { ITodo } from "../types/todo";
import { model, Schema } from "mongoose";

const todoSchema: Schema = new Schema(
  {
    textBody: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ITodo>("Todo", todoSchema);
