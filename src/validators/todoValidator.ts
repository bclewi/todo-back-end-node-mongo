import { Types } from "mongoose";

const isValidId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

const isValidTextBody = (textBody: string): boolean => {
  return textBody !== "" && textBody.length <= 255;
};

const validateId = (id: string) => {
  if (!isValidId(id)) {
    throw new Error("Todo.id must be a valid mongoose ObjectId");
  }
};

const validateTextBody = (textBody: string) => {
  if (!isValidTextBody(textBody)) {
    throw new Error(
      "Todo.textBody must be a non-empty string of at most 255 characters"
    );
  }
};

export { isValidId, isValidTextBody, validateId, validateTextBody };
