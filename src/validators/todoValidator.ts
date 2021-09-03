import * as mongoose from "mongoose";

const isValidId = (id: string): boolean => {
  return !mongoose.Types.ObjectId.isValid(id);
};

export { isValidId };
