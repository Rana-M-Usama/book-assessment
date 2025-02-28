import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../errorHandler";
import { AppError } from "../../utils/appError";

describe("errorHandler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should handle AppError correctly", () => {
    const error = new AppError("Test error", 400);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Test error",
    });
  });

  it("should handle generic errors with 500 status", () => {
    const error = new Error("Generic error");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal server error",
    });
  });
});
