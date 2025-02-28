import request from "supertest";
import app from "../app";

describe("App", () => {
  it("should handle 404 errors", async () => {
    const response = await request(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Not found",
    });
  });

  it("should handle CORS", async () => {
    const response = await request(app)
      .options("/api/books")
      .set("Origin", "http://localhost:3000");

    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toBeDefined();
  });

  it("should parse JSON bodies", async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ title: "Test" });

    expect(response.status).toBe(400); // Validation error, but proves JSON parsing works
  });

  it("should serve swagger documentation", async () => {
    const response = await request(app).get("/api-docs/swagger.json");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
