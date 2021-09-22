import { mocked } from "ts-jest/utils";

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

const createSpy = jest.spyOn(todoService, "create");
const readAllSpy = jest.spyOn(todoService, "readAll");
const readSpy = jest.spyOn(todoService, "readById");
const updateCompleteSpy = jest.spyOn(todoService, "updateCompleteById");
const updateTextSpy = jest.spyOn(todoService, "updateTextById");
const deleteSpy = jest.spyOn(todoService, "deleteById");

describe("todoService", () => {
  beforeEach(() => {
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
      it("should fetch a todo", async () => {
        const expected = await todoService.create(testData.textBody);
        const actual = await todoService.readById(expected._id);
        expectToHaveSameProperties(actual, expected);
      });
    });
    describe("failure", () => {
      it("should return null when fetching a todo and no todo is found", async () => {
        const expected = await todoService.create(testData.textBody);
        await todoService.deleteById(expected._id);
        const actual = await todoService.readById(expected._id);
        expect(Object.is(actual, null)).toBe(true);
      });

      it("should throw an error when fetching a todo with an invalid id format", async () => {
        try {
          await todoService.readById("1");
        } catch (err) {
          expect(err).toHaveProperty("message");
        }
      });
    });
  });

  describe(".updateCompleteById(id: string)", () => {
    describe("success", () => {
      it("should update the completion status of a todo", async () => {
        const originalTodo = await todoService.create(testData.textBody);
        const updatedTodo = await todoService.updateCompleteById(
          originalTodo._id
        );
        expect(Object.is(updatedTodo, null)).toBe(false);
        expect(updatedTodo).toHaveProperty("_id", originalTodo._id);
        expect(updatedTodo).toHaveProperty("textBody", originalTodo.textBody);
        expect(updatedTodo).toHaveProperty(
          "isComplete",
          !originalTodo.isComplete
        );
        expect(updatedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
        expect(updatedTodo).toHaveProperty("updatedAt");
        expect(updatedTodo.updatedAt).not.toBe(originalTodo.updatedAt);

        const todos = await todoService.readAll();
        expect(todos).toHaveLength(1);
      });
    });
    describe("failure", () => {
      it("should return null when updating the completion status of a todo and no todo is found", async () => {
        const expected = await todoService.create(testData.textBody);
        await todoService.deleteById(expected._id);
        const actual = await todoService.updateCompleteById(expected._id);
        expect(Object.is(actual, null)).toBe(true);
      });

      it("should throw an error when updating the completion status of a todo with an invalid id format", async () => {
        try {
          await todoService.updateCompleteById("1");
        } catch (err) {
          expect(err).toHaveProperty("message");
        }
      });
    });
  });

  describe(".updateTextById(id: string, textBody: string)", () => {
    describe("success", () => {
      it("should update the text of a todo", async () => {
        const originalTodo = await todoService.create(testData.textBody);
        const updatedTodo = await todoService.updateTextById(
          originalTodo._id,
          updateData.textBody
        );
        expect(Object.is(updatedTodo, null)).toBe(false);
        expect(updatedTodo).toHaveProperty("_id", originalTodo._id);
        expect(updatedTodo).toHaveProperty("textBody", updateData.textBody);
        expect(updatedTodo).toHaveProperty(
          "isComplete",
          originalTodo.isComplete
        );
        expect(updatedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
        expect(updatedTodo).toHaveProperty("updatedAt");
        expect(updatedTodo.updatedAt).not.toBe(originalTodo.updatedAt);

        const todos = await todoService.readAll();
        expect(todos).toHaveLength(1);
      });
    });
    describe("failure", () => {
      it("should return null when updating the text of a todo and no todo is found", async () => {
        const expected = await todoService.create(testData.textBody);
        await todoService.deleteById(expected._id);
        const actual = await todoService.updateTextById(
          expected._id,
          updateData.textBody
        );
        expect(Object.is(actual, null)).toBe(true);
      });

      it("should throw an error when updating the text of a todo with an invalid id format", async () => {
        try {
          await todoService.updateTextById("1", updateData.textBody);
        } catch (err) {
          expect(err).toHaveProperty("message");
        }
      });

      it("should throw an error when updating a todo with an empty string", async () => {
        try {
          const originalTodo = await todoService.create(testData.textBody);
          await todoService.updateTextById(originalTodo._id, "");
        } catch (err) {
          expect(err).toHaveProperty("message");
        }
      });

      it("should throw an error when updating a todo with a string over 255 characters long", async () => {
        try {
          const originalTodo = await todoService.create(testData.textBody);
          await todoService.updateTextById(originalTodo._id, longTextBody);
        } catch (err) {
          expect(err).toHaveProperty("message");
        }
      });
    });
  });

  describe(".deleteById(id: string)", () => {
    describe("success", () => {
      it("should delete a todo", async () => {
        const originalTodo = await todoService.create(testData.textBody);
        const deletedTodo = await todoService.deleteById(originalTodo._id);
        expect(Object.is(deletedTodo, null)).toBe(false);
        expectToHaveSameProperties(deletedTodo, originalTodo);

        const allTodos = await todoService.readAll();
        expect(allTodos).toHaveLength(0);
      });
    });
    describe("failure", () => {
      it("should return null when deleting a todo and no todo is found", async () => {
        const expected = await todoService.create(testData.textBody);
        await todoService.deleteById(expected._id);
        const actual = await todoService.deleteById(expected._id);
        expect(Object.is(actual, null)).toBe(true);
      });

      it("should throw an error when deleting a todo with an invalid id format", async () => {
        try {
          await todoService.deleteById("1");
        } catch (err) {
          expect(err).toHaveProperty("message");
        }
      });
    });
  });
});

const expectToHaveSameProperties = (actual: ITodo, expected: ITodo) => {
  expect(actual).toHaveProperty("_id", expected._id);
  expect(actual).toHaveProperty("textBody", expected.textBody);
  expect(actual).toHaveProperty("isComplete", expected.isComplete);
  expect(actual).toHaveProperty("createdAt", expected.createdAt);
  expect(actual).toHaveProperty("updatedAt", expected.updatedAt);
};
