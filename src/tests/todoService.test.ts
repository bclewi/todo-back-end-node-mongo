import { mocked } from "ts-jest/utils";
import { v4 as uuidv4 } from "uuid";

// Mock Todo model class constructor and ITodo object instance function calls
// https://jestjs.io/docs/es6-class-mocks#in-depth-understanding-mock-constructor-functions
// https://stackoverflow.com/questions/58273544/how-to-properly-use-axios-get-mockresolvedvalue-for-async-calls-in-jest
// https://stackoverflow.com/questions/61374288/typescript-jest-mock-xx-default-is-not-a-constructor-unable-to-instanciate-m
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const TodoMocked = jest.fn().mockImplementation(() => {
  return {
    save: mockSave,
    find: mockFind,
    findById: mockFindById,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findByIdAndDelete: mockFindByIdAndDelete,
  };
});
jest.mock("../models/Todo", () => {
  return {
    __esModule: true,
    default: TodoMocked,
  };
});

// Mock module deeply with TypeScript support
// https://kulshekhar.github.io/ts-jest/docs/guides/test-helpers
// https://github.com/tbinna/ts-jest-mock-examples
import * as validator from "../validators/todoValidator";
jest.mock("../validators/todoValidator");
const validatorMocked = mocked(validator, true);

import * as todoService from "../services/todoService";
import { ITodo } from "../types";
import { notify } from "superagent";

const createSpy = jest.spyOn(todoService, "create");
const readAllSpy = jest.spyOn(todoService, "readAll");
const readSpy = jest.spyOn(todoService, "readById");
const updateCompleteSpy = jest.spyOn(todoService, "updateCompleteById");
const updateTextSpy = jest.spyOn(todoService, "updateTextById");
const deleteSpy = jest.spyOn(todoService, "deleteById");

describe("todoService", () => {
  beforeEach(() => {});
  afterEach(() => {
    jest.clearAllMocks();
    TodoMocked.mockClear();
    createSpy.mockClear();
    readAllSpy.mockClear();
    readSpy.mockClear();
    updateCompleteSpy.mockClear();
    updateTextSpy.mockClear();
    deleteSpy.mockClear();
  });
  const testData = {
    textBody: "test",
  };

  const updateData = {
    textBody: "update",
  };

  const longTextBody =
    "11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111";

  describe(".create(textBody: string)", () => {
    describe("success", () => {
      describe("when given a valid textBody", () => {
        it("should call create with textBody", async () => {
          const todoValue = {
            _id: "1",
            textBody: testData.textBody,
            isComplete: false,
            createdAt: "now",
            updatedAt: "now",
          };
          mockSave.mockResolvedValue(todoValue);

          const result = await todoService.create(testData.textBody);

          expect(createSpy).toHaveBeenCalledTimes(1);
          expect(createSpy).toHaveBeenCalledWith(testData.textBody);
          expect(validatorMocked.validateTextBody).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateTextBody).toHaveBeenCalledWith(
            testData.textBody
          );
          expect(TodoMocked).toHaveBeenCalledTimes(1);
          expect(TodoMocked).toHaveBeenCalledWith({
            textBody: testData.textBody,
            isComplete: false,
          });
          expect(mockSave).toHaveBeenCalledTimes(1);
          expect(result).toBe(todoValue);
        });
      });
    });

    describe("failure", () => {
      describe("when given an empty string", () => {
        it("should throw an error", async () => {
          try {
            await todoService.create("");
            expect("this line").toBe("never executed");
          } catch (err) {
            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith("");
            expect(err).toHaveProperty("message");
          }
        });
      });

      describe("when given a string with over 255 characters", () => {
        it("should throw an error", async () => {
          try {
            await todoService.create(longTextBody);
            expect("this line").toBe("never executed");
          } catch (err) {
            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith(longTextBody);
            expect(err).toHaveProperty("message");
          }
        });
      });
    });
  });

  describe(".readAll()", () => {
    describe("success", () => {
      describe("when todos exist", () => {
        it("should fetch all todos", async () => {
          const TODOS_COUNT = 3;
          let todoValues = [];
          for (let i = 0; i < TODOS_COUNT; i++) {
            todoValues[i] = {
              _id: i.toString(),
              textBody: `test ${i.toString()}`,
              isComplete: false,
              createdAt: "now",
              updateAt: "now",
            };
          }
          mockFind.mockResolvedValue(todoValues);

          await todoService.readAll();

          expect(readAllSpy).toBeCalledTimes(1);
          expect(mockFind).toBeCalledTimes(1);
          expect(mockFind).toReturnWith(todoValues);
        });
      });

      describe("when no todos exist", () => {
        it("should fetch an empty array", async () => {
          mockFind.mockResolvedValue([]);

          await todoService.readAll();

          expect(readAllSpy).toBeCalledTimes(1);
          expect(mockFind).toBeCalledTimes(1);
          expect(mockFind).toReturnWith([]);
        });
      });
    });
    describe("failure", () => {});
  });

  describe(".readById(id: string)", () => {
    describe("success", () => {
      describe("when a valid id is given", () => {
        it("should return a todo", async () => {
          const todoValue = {
            _id: uuidv4(),
            textBody: testData.textBody,
            isComplete: false,
            createdAt: "now",
            updatedAt: "now",
          };
          mockFindById.mockResolvedValue(todoValue);

          const result = await todoService.readById(todoValue._id);

          expect(readSpy).toHaveBeenCalledTimes(1);
          expect(readSpy).toHaveBeenCalledWith(todoValue._id);
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(
            todoValue._id
          );
          expect(mockFindById).toHaveBeenCalledTimes(1);
          expect(mockFindById).toHaveBeenCalledWith(todoValue._id);
          expect(result).toBe(todoValue);
        });
      });
    });
    describe("failure", () => {
      describe("when fetching a todo and no todo is found", () => {
        it("should return null", async () => {
          mockFindById.mockResolvedValue(null);
          const id = uuidv4();

          const result = await todoService.readById(id);

          expect(readSpy).toHaveBeenCalledTimes(1);
          expect(readSpy).toHaveBeenCalledWith(id);
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(id);
          expect(mockFindById).toHaveBeenCalledTimes(1);
          expect(mockFindById).toHaveBeenCalledWith(id);
          expect(Object.is(result, null)).toBe(true);
        });
      });

      describe("when fetching a todo with an invalid id format", () => {
        it("should throw an error ", async () => {
          const invalidId = "1";
          try {
            await todoService.readById(invalidId);

            expect("this line").toBe("never executed");
          } catch (err) {
            expect(err).toHaveProperty("message");
            expect(readSpy).toHaveBeenCalledTimes(1);
            expect(readSpy).toHaveBeenCalledWith(invalidId);
            expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateId).toHaveBeenCalledWith(invalidId);
            expect(mockFindById).not.toHaveBeenCalled();
            expect(mockFindById).not.toHaveReturned();
          }
        });
      });
    });
  });

  describe(".updateCompleteById(id: string)", () => {
    describe("success", () => {
      describe("when given a valid id", () => {
        it("should update the completion status", async () => {
          const originalTodo = {
            _id: uuidv4(),
            textBody: testData.textBody,
            isComplete: false,
            createdAt: "earlier",
            updatedAt: "earlier",
          };
          const updatedTodo = {
            _id: originalTodo._id,
            textBody: testData.textBody,
            isComplete: true,
            createdAt: "earlier",
            updatedAt: "now",
          };
          mockFindById.mockResolvedValue(originalTodo);
          mockFindByIdAndUpdate.mockResolvedValue(updatedTodo);

          const result = await todoService.updateCompleteById(updatedTodo._id);

          expect(updateCompleteSpy).toHaveBeenCalledTimes(1);
          expect(updateCompleteSpy).toHaveBeenCalledWith(updatedTodo._id);
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(
            updatedTodo._id
          );
          expect(mockFindById).toHaveBeenCalledTimes(1);
          expect(mockFindById).toHaveBeenCalledWith(updatedTodo._id);
          expect(mockFindById).toHaveReturnedWith(originalTodo);
          expect(!originalTodo).toBe(false);
          expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
          expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            updatedTodo._id,
            { isComplete: !originalTodo.isComplete },
            { returnOriginal: false, upsert: false }
          );
          expect(result).toBe(updatedTodo);
        });
      });
    });
    describe("failure", () => {
      describe("when updating the completion status of a todo and no todo is found", () => {
        it("should return null ", async () => {
          const newId = uuidv4();
          mockFindById.mockResolvedValue(null);

          const result = await todoService.updateCompleteById(newId);

          expect(updateCompleteSpy).toHaveBeenCalledTimes(1);
          expect(updateCompleteSpy).toHaveBeenCalledWith(newId);
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(newId);
          expect(mockFindById).toHaveBeenCalledTimes(1);
          expect(mockFindById).toHaveBeenCalledWith(newId);
          expect(mockFindById).toHaveReturnedWith(null);
          expect(updateCompleteSpy).toHaveReturnedWith(null);
          expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
        });
      });

      describe("when updating the completion status of a todo with an invalid id format", () => {
        it("should throw an error", async () => {
          const invalidId = "1";
          try {
            await todoService.updateCompleteById(invalidId);

            expect("this line").toBe("never executed");
          } catch (err) {
            expect(err).toHaveProperty("message");
            expect(updateCompleteSpy).toHaveBeenCalledTimes(1);
            expect(updateCompleteSpy).toHaveBeenCalledWith(invalidId);
            expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateId).toHaveBeenCalledWith(invalidId);
            expect(mockFindById).not.toHaveBeenCalled();
            expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
            expect(updateCompleteSpy).not.toHaveReturned();
          }
        });
      });
    });
  });

  describe(".updateTextById(id: string, textBody: string)", () => {
    describe("success", () => {
      describe("when given a valid id and text", () => {
        it("should update the text of a todo", async () => {
          const updatedTodo = {
            _id: uuidv4(),
            textBody: updateData.textBody,
            isComplete: false,
            createdAt: "earlier",
            updatedAt: "now",
          };
          mockFindByIdAndUpdate.mockResolvedValue(updatedTodo);

          const result = await todoService.updateTextById(
            updatedTodo._id,
            updateData.textBody
          );

          expect(updateTextSpy).toHaveBeenCalledTimes(1);
          expect(updateTextSpy).toHaveBeenCalledWith(
            updatedTodo._id,
            updateData.textBody
          );
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(
            updatedTodo._id
          );
          expect(validatorMocked.validateTextBody).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateTextBody).toHaveBeenCalledWith(
            updatedTodo.textBody
          );
          expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
          expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            updatedTodo._id,
            { textBody: updatedTodo.textBody },
            { returnOriginal: false, upsert: false }
          );
          expect(mockFindByIdAndUpdate).toHaveReturnedWith(updatedTodo);
          expect(result).toBe(updatedTodo);
        });
      });
    });
    describe("failure", () => {
      describe("when updating the text of a todo and no todo is found", () => {
        it("should return null", async () => {
          const newId = uuidv4();
          mockFindByIdAndUpdate.mockResolvedValue(null);

          const result = await todoService.updateTextById(
            newId,
            updateData.textBody
          );

          expect(updateTextSpy).toHaveBeenCalledTimes(1);
          expect(updateTextSpy).toHaveBeenCalledWith(
            newId,
            updateData.textBody
          );
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(newId);
          expect(validatorMocked.validateTextBody).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateTextBody).toHaveBeenCalledWith(
            updateData.textBody
          );
          expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
          expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            newId,
            { textBody: updateData.textBody },
            { returnOriginal: false, upsert: false }
          );
          expect(mockFindByIdAndUpdate).toHaveReturnedWith(null);
          expect(result).toBe(null);
        });
      });

      describe("when updating the text of a todo with an invalid id format", () => {
        it("should throw an error", async () => {
          const invalidId = "1";
          try {
            await todoService.updateTextById(invalidId, updateData.textBody);

            expect("this line").toBe("never executed");
          } catch (err) {
            expect(err).toHaveProperty("message");
            expect(updateTextSpy).toHaveBeenCalledTimes(1);
            expect(updateTextSpy).toHaveBeenCalledWith(
              invalidId,
              updateData.textBody
            );
            expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateId).not.toHaveReturned();
            expect(validatorMocked.validateTextBody).not.toHaveBeenCalled();
            expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
            expect(updateTextSpy).not.toHaveReturned();
          }
        });
      });

      describe("when updating a todo with an empty string", () => {
        it("should throw an error", async () => {
          const id = uuidv4();
          const invalidTextBody = "";
          try {
            await todoService.updateTextById(id, invalidTextBody);

            expect("this line").toBe("never executed");
          } catch (err) {
            expect(err).toHaveProperty("message");
            expect(updateTextSpy).toHaveBeenCalledTimes(1);
            expect(updateTextSpy).toHaveBeenCalledWith(id, invalidTextBody);
            expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateId).toHaveBeenCalledWith(id);
            expect(validatorMocked.validateTextBody).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateTextBody).toHaveBeenCalledWith(
              invalidTextBody
            );
            expect(validatorMocked.validateTextBody).not.toHaveReturned();
            expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
            expect(updateTextSpy).not.toHaveReturned();
          }
        });
      });

      describe("when updating a todo with a string over 255 characters long", () => {
        it("should throw an error", async () => {
          const id = uuidv4();
          try {
            await todoService.updateTextById(id, longTextBody);

            expect("this line").toBe("never executed");
          } catch (err) {
            expect(err).toHaveProperty("message");
            expect(updateTextSpy).toHaveBeenCalledTimes(1);
            expect(updateTextSpy).toHaveBeenCalledWith(id, longTextBody);
            expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateId).toHaveBeenCalledWith(id);
            expect(validatorMocked.validateTextBody).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateTextBody).toHaveBeenCalledWith(
              longTextBody
            );
            expect(validatorMocked.validateTextBody).not.toHaveReturned();
            expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
            expect(updateTextSpy).not.toHaveReturned();
          }
        });
      });
    });
  });

  describe(".deleteById(id: string)", () => {
    describe("success", () => {
      describe("when given a valid id", () => {
        it("should delete a todo", async () => {
          const todoValue = {
            _id: uuidv4(),
            textBody: testData.textBody,
            isComplete: false,
            createdAt: "before",
            updatedAt: "before",
          };
          mockFindByIdAndDelete.mockResolvedValue(todoValue);

          const deletedTodo = await todoService.deleteById(todoValue._id);

          expect(deleteSpy).toHaveBeenCalledTimes(1);
          expect(deleteSpy).toHaveBeenCalledWith(todoValue._id);
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(
            todoValue._id
          );
          expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
          expect(mockFindByIdAndDelete).toHaveBeenCalledWith(todoValue._id);
          expect(mockFindByIdAndDelete).toHaveReturnedWith(todoValue);
          expect(deleteSpy).toHaveReturnedWith(todoValue);
          expect(deletedTodo).toBe(todoValue);
        });
      });
    });
    describe("failure", () => {
      describe("when deleting a todo and no todo is found", () => {
        it("should return null", async () => {
          const id = uuidv4();
          mockFindByIdAndDelete.mockResolvedValue(null);

          const result = await todoService.deleteById(id);

          expect(deleteSpy).toHaveBeenCalledTimes(1);
          expect(deleteSpy).toHaveBeenCalledWith(id);
          expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
          expect(validatorMocked.validateId).toHaveBeenCalledWith(id);
          expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
          expect(mockFindByIdAndDelete).toHaveBeenCalledWith(id);
          expect(mockFindByIdAndDelete).toHaveReturnedWith(null);
          expect(deleteSpy).toHaveReturnedWith(null);
          expect(result).toBe(null);
        });
      });

      describe("when deleting a todo with an invalid id format", () => {
        it("should throw an error", async () => {
          const invalidId = "1";
          try {
            await todoService.deleteById(invalidId);

            expect("this line").toBe("never executed");
          } catch (err) {
            expect(err).toHaveProperty("message");
            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(invalidId);
            expect(validatorMocked.validateId).toHaveBeenCalledTimes(1);
            expect(validatorMocked.validateId).toHaveBeenCalledWith(invalidId);
            expect(validatorMocked.validateId).not.toHaveReturned();
            expect(mockFindByIdAndDelete).not.toHaveBeenCalled();
            expect(deleteSpy).not.toHaveReturned();
          }
        });
      });
    });
  });
});
