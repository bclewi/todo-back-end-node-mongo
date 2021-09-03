import Todo from "../models/Todo";
import ITodo from "../types/ITodo";
import * as validator from "../validators/todoValidator";

const create = async (textBody: string): Promise<ITodo> => {
  validateTextBody(textBody);
  return await new Todo({ textBody, isComplete: false }).save();
};

const readById = async (id: string): Promise<ITodo | null> => {
  validateId(id);
  return await Todo.findById(id);
};

const readAll = async (): Promise<ITodo[]> => {
  return await Todo.find();
};

const updateCompleteById = async (id: string): Promise<ITodo | null> => {
  validateId(id);
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
  validateId(id);
  validateTextBody(textBody);
  return await Todo.findByIdAndUpdate(
    id,
    { textBody }, // update
    { returnOriginal: false, upsert: false } // options
    // callback
  );
};

const deleteById = async (id: string): Promise<ITodo | null> => {
  validateId(id);
  return await Todo.findByIdAndDelete(id);
};

const validateId = (id: string) => {
  if (validator.isValidId(id)) {
    throw new Error("Todo.id must be a valid mongoose ObjectId");
  }
};

const validateTextBody = (textBody: string) => {
  if (textBody === "") {
    throw new Error("Todo.textBody cannot be an empty string");
  } else if (textBody.length > 255) {
    throw new Error("Todo.textBody cannot be over 255 characters long");
  }
};

export {
  create,
  readById,
  readAll,
  updateCompleteById,
  updateTextById,
  deleteById,
};
