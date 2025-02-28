import { AppError } from "../appError";

describe("AppError", () => {
  it("should create an error with status and message", () => {
    const error = new AppError("Test error", 400);
    expect(error.message).toBe("Test error");
    expect(error.status).toBe(400);
    expect(error instanceof Error).toBe(true);
  });

  it("should use default status 500 if not provided", () => {
    const error = new AppError("Test error");
    expect(error.status).toBe(500);
  });
});
