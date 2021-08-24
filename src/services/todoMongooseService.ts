import Todo from "../models/todoModel";
import ITodo from "../types/ITodo";

const create = async (
  textBody: string,
  isComplete: boolean
): Promise<ITodo> => {
  return await new Todo({ textBody, isComplete }).save();
};

const readById = async (id: string): Promise<ITodo | null> => {
  return await Todo.findById(id);
};

const readAll = async (): Promise<ITodo[]> => {
  return await Todo.find();
};

const updateById = async (
  id: string,
  textBody: string,
  isComplete: boolean
): Promise<ITodo | null> => {
  return await Todo.findByIdAndUpdate(
    { _id: id }, // filter
    { textBody, isComplete }, // update
    { returnOriginal: false, upsert: false } // options
    // callback
  );
};

const deleteById = async (id: string): Promise<ITodo | null> => {
  return await Todo.findByIdAndDelete(id);
};

export { create, readById, readAll, updateById, deleteById };
