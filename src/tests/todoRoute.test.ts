import app from "../app";
import * as request from "supertest";
import * as db from "./testDb";
import ITodo from "../types/ITodo";

describe("Todo route", () => {
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
    isComplete: false,
  };

  const updateData = {
    textBody: "updated test",
    isComplete: true,
  };

  it("should create a todo", async () => {
    console.log(testData);
    const res = await request(app).post("/todos").send(testData);
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Todo added");
    expect(res.body).toHaveProperty("todo");
    expect(res.body).toHaveProperty("todos");
    const { todo, todos } = res.body;

    expect(todo).toHaveProperty("_id");
    expect(todo).toHaveProperty("textBody", testData.textBody);
    expect(todo).toHaveProperty("isComplete", testData.isComplete);
    expect(todo).toHaveProperty("createdAt");
    expect(todo).toHaveProperty("updatedAt");
    expect(todos).toHaveLength(1);
  });

  it("should fetch one todo", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;

    const res = await request(app).get(`/todos/${testTodo._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("todo");
    const { todo } = res.body;

    expect(todo).toHaveProperty("_id", testTodo._id);
    expect(todo).toHaveProperty("textBody", testTodo.textBody);
    expect(todo).toHaveProperty("isComplete", testTodo.isComplete);
    expect(todo).toHaveProperty("createdAt", testTodo.createdAt);
    expect(todo).toHaveProperty("updatedAt", testTodo.updatedAt);
  });

  it("should fetch all todos", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;

    const res = await request(app).get("/todos");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("todos");

    expect(res.body.todos).toHaveLength(1);
    expect(res.body.todos[0]).toEqual(testTodo);
  });

  it("should update a todo", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;

    const res = await request(app)
      .put(`/todos/${testTodo._id}`)
      .send(updateData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("todo");
    expect(res.body).toHaveProperty("todos");
    const { todo, todos } = res.body;

    expect(todo).toHaveProperty("_id");
    expect(todo).toHaveProperty("textBody", updateData.textBody);
    expect(todo).toHaveProperty("isComplete", updateData.isComplete);
    expect(todo).toHaveProperty("createdAt");
    expect(todo).toHaveProperty("updatedAt");
    expect(todo.createdAt).toEqual(testTodo.createdAt);
    expect(todo.updatedAt != testTodo.updatedAt).toBeTruthy;
    expect(todos).toHaveLength(1);
  });

  it("should delete a todo", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;

    const res = await request(app).delete(`/todos/${testTodo._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("todo");
    expect(res.body).toHaveProperty("todos");
    const { todo, todos } = res.body;

    expect(todo).toHaveProperty("_id");
    expect(todo).toHaveProperty("textBody", testTodo.textBody);
    expect(todo).toHaveProperty("isComplete", testTodo.isComplete);
    expect(todo).toHaveProperty("createdAt", testTodo.createdAt);
    expect(todo).toHaveProperty("updatedAt");
    expect(todo.updatedAt != testTodo.updatedAt).toBeTruthy;
    expect(todos).toHaveLength(0);
  });

  it("should respond with 404 on GET requests if resource not found", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;
    await request(app).delete(`/todos/${testTodo._id}`);

    const res = await request(app).get(`/todos/${testTodo._id}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
  });

  it("should respond with 404 on PUT requests if resource not found", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;
    await request(app).delete(`/todos/${testTodo._id}`);

    const res = await request(app)
      .put(`/todos/${testTodo._id}`)
      .send(updateData);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
  });

  it("should respond with 404 on DELETE requests if resource not found", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;
    await request(app).delete(`/todos/${testTodo._id}`);

    const res = await request(app).delete(`/todos/${testTodo._id}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
  });

  it("should respond with 400 on POST requests if body is not a todoModel", async () => {
    const res = await request(app).post("/todos").send({
      textBody: "test",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should respond with 400 on PUT requests if body is not a todoModel", async () => {
    const postRes = await request(app).post("/todos").send(testData);
    const testTodo = postRes.body.todo;

    const res = await request(app).put(`/todos/${testTodo._id}`).send({
      invalidProperty: "value",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });
});
