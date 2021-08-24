import { Document } from "mongoose";

export default interface ITodo extends Document {
  textBody: string;
  isComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}
