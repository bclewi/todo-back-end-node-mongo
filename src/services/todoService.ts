import Todo from "../models/Todo";
import * as validator from "../validators/todoValidator";
import { ITodo } from "../types";

const create = async (textBody: string): Promise<ITodo> => {
  validator.validateTextBody(textBody);
  return await new Todo({ textBody, isComplete: false }).save();
};

const readAll = async (): Promise<ITodo[]> => {
  return await Todo.find();
};

const readById = async (id: string): Promise<ITodo | null> => {
  validator.validateId(id);
  return await Todo.findById(id);
};

const updateCompleteById = async (id: string): Promise<ITodo | null> => {
  validator.validateId(id);
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
  validator.validateId(id);
  validator.validateTextBody(textBody);
  return await Todo.findByIdAndUpdate(
    id,
    { textBody }, // update
    { returnOriginal: false, upsert: false } // options
    // callback
  );
};

const deleteById = async (id: string): Promise<ITodo | null> => {
  validator.validateId(id);
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
