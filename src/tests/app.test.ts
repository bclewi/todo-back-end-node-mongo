import app from "../app";
import * as db from "./testDb";
import * as request from "supertest";
import { ITodo } from "../types";

describe("Todo List REST API", () => {
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

  describe("POST /todos/{id}", () => {
    describe("success", () => {
      it("should create a todo", async () => {
        const res = await request(app).post("/todos").send(testData);
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 201);
        expect(res).toHaveProperty("body");

        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("todo");
        expect(res.body).toHaveProperty("todos");
        const { todo, todos } = res.body;

        expect(todo).toHaveProperty("_id");
        expect(todo).toHaveProperty("textBody", testData.textBody);
        expect(todo).toHaveProperty("isComplete", false);
        expect(todo).toHaveProperty("createdAt");
        expect(todo).toHaveProperty("updatedAt");
        expect(todos).toHaveLength(1);
      });
    });
    describe("failure", () => {
      it("should 400 requests with no textBody", async () => {
        const res = await request(app).post("/todos");
        expectStatusCode(res, 400);
      });

      it("should 400 requests with an empty string", async () => {
        const res = await request(app).post("/todos").send({ textBody: "" });
        expectStatusCode(res, 400);
      });

      it("should 400 requests with a textBody over 255 characters long", async () => {
        const res = await request(app).post("/todos").send({
          textBody: longTextBody,
        });
        expectStatusCode(res, 400);
      });
    });
  });

  describe("GET /todos", () => {
    describe("success", () => {
      it("should fetch all todos", async () => {
        const testDataA = { textBody: "testA" };
        const testDataB = { textBody: "testB" };
        const testDataC = { textBody: "testC" };
        const postResA = await request(app).post("/todos").send(testDataA);
        const postResB = await request(app).post("/todos").send(testDataB);
        const postResC = await request(app).post("/todos").send(testDataC);
        const expectedA: ITodo = postResA.body.todo;
        const expectedB: ITodo = postResB.body.todo;
        const expectedC: ITodo = postResC.body.todo;

        const res = await request(app).get("/todos");
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 200);
        expect(res).toHaveProperty("body");
        expect(res.body).not.toHaveProperty("message");
        expect(res.body).toHaveProperty("todos");
        const { todos: actual } = res.body;

        expect(actual).toHaveLength(3);
        expect(actual[0].toJSON).toEqual(expectedA.toJSON);
        expect(actual[1].toJSON).toEqual(expectedB.toJSON);
        expect(actual[2].toJSON).toEqual(expectedC.toJSON);
      });

      it("should fetch an empty array if no todos are found", async () => {
        const res = await request(app).get("/todos");
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 200);
        expect(res).toHaveProperty("body");
        expect(res.body).toHaveProperty("todos");
        const { todos } = res.body;
        expect(todos).toHaveLength(0);
        expect(todos).toStrictEqual([]);
      });
    });
    describe("failure", () => {});
  });

  describe("GET /todos/{id}", () => {
    describe("success", () => {
      it("should fetch a todo", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const expected = postRes.body.todo;

        const res = await request(app).get(`/todos/${expected._id}`);
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 200);
        expect(res).not.toHaveProperty("message");
        expect(res).toHaveProperty("body");
        expect(res.body).toHaveProperty("todo");
        const { todo: actual } = res.body;

        expect(actual).toHaveProperty("_id", expected._id);
        expect(actual).toHaveProperty("textBody", expected.textBody);
        expect(actual).toHaveProperty("isComplete", expected.isComplete);
        expect(actual).toHaveProperty("createdAt", expected.createdAt);
        expect(actual).toHaveProperty("updatedAt", expected.updatedAt);
      });

      it("should 404 when no todo is found", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;
        await request(app).delete(`/todos/${originalTodo._id}`);

        const res = await request(app).get(`/todos/${originalTodo._id}`);
        expectStatusCode(res, 404);
      });
    });
    describe("failure", () => {
      it("should 400 requests with an invalid id format", async () => {
        const res = await request(app).get("/todos/1");
        expectStatusCode(res, 400);
      });
    });
  });

  describe("PUT /todos/{id}", () => {
    describe("success", () => {
      it("should update the text of a todo", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app)
          .put(`/todos/${originalTodo._id}`)
          .send({ textBody: updateData.textBody });
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 200);
        expect(res).toHaveProperty("body");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("todo");
        expect(res.body).toHaveProperty("todos");
        const { todo: updatedTodo, todos } = res.body;

        expect(updatedTodo).toHaveProperty("_id", originalTodo._id);
        expect(updatedTodo).toHaveProperty("textBody", updateData.textBody);
        expect(updatedTodo).toHaveProperty(
          "isComplete",
          originalTodo.isComplete
        );
        expect(updatedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
        expect(updatedTodo).toHaveProperty("updatedAt");
        expect(updatedTodo.updatedAt).not.toBe(originalTodo.updatedAt);
        expect(todos).toHaveLength(1);
      });

      it("should update the completion status of a todo if no text is provided", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app).put(`/todos/${originalTodo._id}`);
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 200);
        expect(res).toHaveProperty("body");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("todo");
        expect(res.body).toHaveProperty("todos");
        const { todo: updatedTodo, todos } = res.body;

        expect(updatedTodo).toHaveProperty("_id", originalTodo._id);
        expect(updatedTodo).toHaveProperty("textBody", originalTodo.textBody);
        expect(updatedTodo).toHaveProperty(
          "isComplete",
          !originalTodo.isComplete
        );
        expect(updatedTodo).toHaveProperty("createdAt", originalTodo.createdAt);
        expect(updatedTodo).toHaveProperty("updatedAt");
        expect(updatedTodo.updatedAt).not.toBe(originalTodo.updatedAt);
        expect(todos).toHaveLength(1);
      });
    });
    describe("failure", () => {
      it("should 404 requests to update the text of a todo if no todo is found", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;
        await request(app).delete(`/todos/${originalTodo._id}`);

        const res = await request(app)
          .put(`/todos/${originalTodo._id}`)
          .send(updateData);
        expectStatusCode(res, 404);
      });

      it("should 404 requests to update the completion status of a todo if no todo is found", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;
        await request(app).delete(`/todos/${originalTodo._id}`);

        const res = await request(app).put(`/todos/${originalTodo._id}`);
        expectStatusCode(res, 404);
      });

      it("should 404 requests with no id", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app).put("/todos");
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 404);
      });

      it("should 400 requests to update the text of a todo with an invalid id format", async () => {
        const res = await request(app).put("/todos/1").send(updateData);
        expectStatusCode(res, 400);
      });

      it("should 400 requests to update the completion status of a todo with an invalid id format", async () => {
        const res = await request(app).put("/todos/1");
        expectStatusCode(res, 400);
      });

      it("should 400 requests to update the text of a todo with an empty string", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app)
          .put(`/todos/${originalTodo._id}`)
          .send({ textBody: "" });
        expectStatusCode(res, 400);
      });

      it("should 400 requests with a textBody over 255 characters long", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app).put(`/todos/${originalTodo._id}`).send({
          textBody: longTextBody,
        });
        expectStatusCode(res, 400);
      });
    });
  });

  describe("DELETE /todos/{id}", () => {
    describe("success", () => {
      it("should delete a todo", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app).delete(`/todos/${originalTodo._id}`);
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 200);
        expect(res).toHaveProperty("body");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("todo");
        expect(res.body).toHaveProperty("todos");
        const { todo, todos } = res.body;

        expect(todo).toHaveProperty("_id", originalTodo._id);
        expect(todo).toHaveProperty("textBody", originalTodo.textBody);
        expect(todo).toHaveProperty("isComplete", originalTodo.isComplete);
        expect(todo).toHaveProperty("createdAt", originalTodo.createdAt);
        expect(todo).toHaveProperty("updatedAt", originalTodo.updatedAt);
        expect(todos).toHaveLength(0);
      });
    });
    describe("failure", () => {
      it("should 404 when no todo is found", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;
        await request(app).delete(`/todos/${originalTodo._id}`);

        const res = await request(app).delete(`/todos/${originalTodo._id}`);
        expectStatusCode(res, 404);
      });

      it("should 404 requests with no id", async () => {
        const postRes = await request(app).post("/todos").send(testData);
        const originalTodo = postRes.body.todo;

        const res = await request(app).delete("/todos");
        expect(Object.is(res, null)).toBe(false);
        expect(res).toHaveProperty("statusCode", 404);
      });

      it("should 400 requests with an invalid id format", async () => {
        const res = await request(app).delete("/todos/1");
        expectStatusCode(res, 400);
      });
    });
  });
});

const expectStatusCode = (res: request.Response, statusCode: number): void => {
  expect(Object.is(res, null)).toBe(false);
  expect(res).toHaveProperty("statusCode", statusCode);
  expect(res).toHaveProperty("body");

  if (statusCode === 404) {
    expect(res.body).toHaveProperty("message");
  }

  if (statusCode === 400) {
    // expect errors in express-validator format
    expect(res.body).toHaveProperty("errors");
    const { errors } = res.body;
    expect(errors.length).toBeGreaterThan(0);
    for (let i = 0; i < errors.length; i++) {
      expect(errors[i]).toHaveProperty("location");
      expect(errors[i]).toHaveProperty("msg");
      expect(errors[i]).toHaveProperty("param");
    }
  }
};
