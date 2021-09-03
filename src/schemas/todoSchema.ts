import { Schema } from "mongoose";

const todoSchema: Schema = new Schema(
  {
    textBody: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default todoSchema;
