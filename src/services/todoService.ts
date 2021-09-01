import Todo from "../models/todoModel";
import ITodo from "../types/ITodo";
import * as mongoose from "mongoose";

const create = async (textBody: string): Promise<ITodo> => {
  if (textBody === "") {
    throw new Error("Todo.textBody cannot be an empty string");
  } else if (textBody.length > 255) {
    throw new Error("Todo.textBody cannot be over 255 characters long");
  }

  return await new Todo({ textBody, isComplete: false }).save();
};

const readById = async (id: string): Promise<ITodo | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Todo.id must be a valid mongoose ObjectId");
  }

  return await Todo.findById(id);
};

const readAll = async (): Promise<ITodo[]> => {
  return await Todo.find();
};

const updateCompleteById = async (id: string): Promise<ITodo | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Todo.id must be a valid mongoose ObjectId");
  }

  const originalTodo = await Todo.findById(id);
  if (!originalTodo) return null;
  return await Todo.findByIdAndUpdate(
    id,
    { isComplete: !originalTodo.isComplete }, // update
    { returnOriginal: false, upsert: false } // options
    // callback
  );
};

const updateTextById = async (
  id: string,
  textBody: string
): Promise<ITodo | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Todo.id must be a valid mongoose ObjectId");
  }
  if (textBody === "") {
    throw new Error("Todo.textBody cannot be an empty string");
  }

  return await Todo.findByIdAndUpdate(
    id,
    { textBody }, // update
    { returnOriginal: false, upsert: false } // options
    // callback
  );
};

const deleteById = async (id: string): Promise<ITodo | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Todo.id must be a valid mongoose ObjectId");
  }

  return await Todo.findByIdAndDelete(id);
};

export {
  create,
  readById,
  readAll,
  updateCompleteById,
  updateTextById,
  deleteById,
};
