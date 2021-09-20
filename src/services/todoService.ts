import Todo from "../models/Todo";
import * as validator from "../validators/todoValidator";
import { ITodo, CreateData, ReadData, UpdateData, DeleteData } from "../types";

const create = async (data: CreateData): Promise<ITodo> => {
  const { textBody } = data;
  validator.validateTextBody(textBody);
  return await new Todo({ textBody, isComplete: false }).save();
};

const readById = async (data: ReadData): Promise<ITodo | null> => {
  const { id } = data;
  validator.validateId(id);
  return await Todo.findById(id);
};

const readAll = async (): Promise<ITodo[]> => {
  return await Todo.find();
};

const updateCompleteById = async (data: UpdateData): Promise<ITodo | null> => {
  const { id } = data;
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

const updateTextById = async (data: UpdateData): Promise<ITodo | null> => {
  const { id, textBody } = data;
  validator.validateId(id);
  validator.validateTextBody(textBody);
  return await Todo.findByIdAndUpdate(
    id,
    { textBody }, // update
    { returnOriginal: false, upsert: false } // options
    // callback
  );
};

const deleteById = async (data: DeleteData): Promise<ITodo | null> => {
  const { id } = data;
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
