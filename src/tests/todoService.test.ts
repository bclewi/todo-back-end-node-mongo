import * as TodoService from "../services/todoService";
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
    expect(actual).toHaveProperty("_id", expected._id);
    expect(actual).toHaveProperty("textBody", expected.textBody);
    expect(actual).toHaveProperty("isComplete", expected.isComplete);
    expect(actual).toHaveProperty("createdAt", expected.createdAt);
    expect(actual).toHaveProperty("updatedAt", expected.updatedAt);
  });

  it("should fetch all todos", async () => {
    const testDataA = { textBody: "testA" };
    const testDataB = { textBody: "testB" };
    const testDataC = { textBody: "testC" };
    const todoA = await TodoService.create(testDataA.textBody);
    const todoB = await TodoService.create(testDataB.textBody);
    const todoC = await TodoService.create(testDataC.textBody);

    const allTodos = await TodoService.readAll();
    expect(allTodos).toHaveLength(3);
    expect(allTodos[0].toJSON).toEqual(todoA.toJSON);
    expect(allTodos[1].toJSON).toEqual(todoB.toJSON);
    expect(allTodos[2].toJSON).toEqual(todoC.toJSON);
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
    expect(updatedTodo).toHaveProperty("isComplete", true);
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
    expect(deletedTodo).toHaveProperty("_id", originalTodo._id);
    expect(deletedTodo).toHaveProperty("textBody", originalTodo.textBody);
    expect(deletedTodo).toHaveProperty("isComplete", originalTodo.isComplete);
    expect(deletedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
    expect(deletedTodo).toHaveProperty("updatedAt", originalTodo.createdAt);

    const allTodos = await TodoService.readAll();
    expect(allTodos).toHaveLength(0);
  });

  it("should throw an error when trying to fetch a todo with an invalid id format", async () => {
    try {
      await TodoService.readById("1");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when trying to update the text of a todo with an invalid id format", async () => {
    try {
      await TodoService.updateTextById("1", updateData.textBody);
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when trying to update the completion status of a todo with an invalid id format", async () => {
    try {
      await TodoService.updateCompleteById("1");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should throw an error when trying to delete a todo with an invalid id format", async () => {
    try {
      await TodoService.deleteById("1");
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });

  it("should return null when fetching a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.readById(expected._id);
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should return null when updating a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.updateTextById(
      expected._id,
      updateData.textBody
    );
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should return null when deleting a todo and no todo is found", async () => {
    const expected = await TodoService.create(testData.textBody);
    await TodoService.deleteById(expected._id);
    const actual = await TodoService.deleteById(expected._id);
    expect(Object.is(actual, null)).toBe(true);
  });

  it("should return an empty array when trying to fetch all todos and no todos are found", async () => {
    const allTodos = await TodoService.readAll();
    expect(Object.is(allTodos, null)).toBe(false);
    expect(allTodos).toHaveLength(0);
    expect(allTodos).toStrictEqual([]);
  });

  it("should throw an error when creating a todo with an empty string", async () => {
    try {
      await TodoService.create("");
    } catch (err) {
      expect(err).toHaveProperty(
        "message",
        "Todo.textBody cannot be an empty string"
      );
    }
  });

  it("should throw an error when updating a todo with an empty string", async () => {
    try {
      const originalTodo = await TodoService.create(testData.textBody);
      await TodoService.updateTextById(originalTodo._id, "");
    } catch (err) {
      expect(err).toHaveProperty(
        "message",
        "Todo.textBody cannot be an empty string"
      );
    }
  });

  it("should throw an error when creating a todo with a string over 255 characters long", async () => {
    try {
      await TodoService.create(
        "11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111"
      );
    } catch (err) {
      expect(err).toHaveProperty(
        "message",
        "Todo.textBody cannot be over 255 characters long"
      );
    }
  });

  it("should throw an error when updating a todo with a string over 255 characters long", async () => {
    try {
      const originalTodo = await TodoService.create(testData.textBody);
      await TodoService.updateTextById(
        originalTodo._id,
        "11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111 11111111111111111111111111111111111111111111111111"
      );
    } catch (err) {
      expect(err).toHaveProperty(
        "message",
        "Todo.textBody cannot be over 255 characters long"
      );
    }
  });
});
