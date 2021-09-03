import * as TodoService from "../services/todoService";
import ITodo from "../types/ITodo";
import * as db from "./testDb";

describe("Todo service", () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.close();
  });

  const testData = {
    textBody: "test",
  };

  const updateData = {
    textBody: "update",
  };

  const longTextBody =
    "11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111";

  it("should create a todo", async () => {
    const todo = await TodoService.create(testData.textBody);
    expect(Object.is(todo, null)).toBe(false);
    expect(todo).toHaveProperty("_id");
    expect(todo).toHaveProperty("textBody", testData.textBody);
    expect(todo).toHaveProperty("isComplete", false);
    expect(todo).toHaveProperty("createdAt");
    expect(todo).toHaveProperty("updatedAt");

    const todos = await TodoService.readAll();
    expect(todos).toHaveLength(1);
  });

  it("should fetch a todo", async () => {
    const expected = await TodoService.create(testData.textBody);
    const actual = await TodoService.readById(expected._id);
    expectToHaveSameProperties(actual, expected);
  });

  it("should fetch all todos", async () => {
    const TODOS_COUNT = 3;
    const testData = [
      { textBody: "testA" },
      { textBody: "testB" },
      { textBody: "testC" },
    ];

    let expected = [];
    for (let i = 0; i < TODOS_COUNT; i++) {
      expected[i] = await TodoService.create(testData[i].textBody);
    }

    const actual = await TodoService.readAll();
    expect(actual).toHaveLength(TODOS_COUNT);
    for (let i = 0; i < TODOS_COUNT; i++) {
      expect(actual[i].toJSON).toEqual(expected[i].toJSON);
    }
  });

  it("should fetch all todos as an empty array if no todos are found", async () => {
    const allTodos = await TodoService.readAll();
    expect(Object.is(allTodos, null)).toBe(false);
    expect(allTodos).toHaveLength(0);
    expect(allTodos).toStrictEqual([]);
  });

  it("should update the text of a todo", async () => {
    const originalTodo = await TodoService.create(testData.textBody);
    const updatedTodo = await TodoService.updateTextById(
      originalTodo._id,
      updateData.textBody
    );
    expect(Object.is(updatedTodo, null)).toBe(false);
    expect(updatedTodo).toHaveProperty("_id", originalTodo._id);
    expect(updatedTodo).toHaveProperty("textBody", updateData.textBody);
    expect(updatedTodo).toHaveProperty("isComplete", originalTodo.isComplete);
    expect(updatedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
    expect(updatedTodo).toHaveProperty("updatedAt");
    expect(updatedTodo.updatedAt).not.toBe(originalTodo.updatedAt);

    const todos = await TodoService.readAll();
    expect(todos).toHaveLength(1);
  });

  it("should update the completion status of a todo", async () => {
    const originalTodo = await TodoService.create(testData.textBody);
    const updatedTodo = await TodoService.updateCompleteById(originalTodo._id);
    expect(Object.is(updatedTodo, null)).toBe(false);
    expect(updatedTodo).toHaveProperty("_id", originalTodo._id);
    expect(updatedTodo).toHaveProperty("textBody", originalTodo.textBody);
    expect(updatedTodo).toHaveProperty("isComplete", !originalTodo.isComplete);
    expect(updatedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
    expect(updatedTodo).toHaveProperty("updatedAt");
    expect(updatedTodo.updatedAt).not.toBe(originalTodo.updatedAt);

    const todos = await TodoService.readAll();
    expect(todos).toHaveLength(1);
  });

  it("should delete a todo", async () => {
    const originalTodo = await TodoService.create(testData.textBody);
    const deletedTodo = await TodoService.deleteById(originalTodo._id);
    expect(Object.is(deletedTodo, null)).toBe(false);
    expectToHaveSameProperties(deletedTodo, originalTodo);

    const allTodos = await TodoService.readAll();
    expect(allTodos).toHaveLength(0);
  });

  it("should return null when fetching a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.readById(expected._id);
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should return null when updating the text of a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.updateTextById(
      expected._id,
      updateData.textBody
    );
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should return null when updating the completion status of a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.updateCompleteById(expected._id);
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should return null when deleting a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.deleteById(expected._id);
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should throw an error when creating a todo with an empty string", async () => {
    try {
      await TodoService.create("");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when creating a todo with a string over 255 characters long", async () => {
    try {
      await TodoService.create(longTextBody);
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when fetching a todo with an invalid id format", async () => {
    try {
      await TodoService.readById("1");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when updating the text of a todo with an invalid id format", async () => {
    try {
      await TodoService.updateTextById("1", updateData.textBody);
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when updating the completion status of a todo with an invalid id format", async () => {
    try {
      await TodoService.updateCompleteById("1");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when updating a todo with an empty string", async () => {
    try {
      const originalTodo = await TodoService.create(testData.textBody);
      await TodoService.updateTextById(originalTodo._id, "");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when updating a todo with a string over 255 characters long", async () => {
    try {
      const originalTodo = await TodoService.create(testData.textBody);
      await TodoService.updateTextById(originalTodo._id, longTextBody);
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when deleting a todo with an invalid id format", async () => {
    try {
      await TodoService.deleteById("1");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });
});

const expectToHaveSameProperties = (actual: ITodo, expected: ITodo) => {
  expect(actual).toHaveProperty("_id", expected._id);
  expect(actual).toHaveProperty("textBody", expected.textBody);
  expect(actual).toHaveProperty("isComplete", expected.isComplete);
  expect(actual).toHaveProperty("createdAt", expected.createdAt);
  expect(actual).toHaveProperty("updatedAt", expected.updatedAt);
};
