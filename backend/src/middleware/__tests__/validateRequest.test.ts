import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../validateRequest";
import { z } from "zod";
import { AppError } from "../../utils/appError";

describe("validateRequest", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should validate request body successfully", () => {
    const schema = z.object({
      name: z.string(),
    });

    mockRequest.body = { name: "Test" };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should throw AppError for invalid request body", () => {
    const schema = z.object({
      name: z.string(),
    });

    mockRequest.body = { name: 123 };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
  });
});
