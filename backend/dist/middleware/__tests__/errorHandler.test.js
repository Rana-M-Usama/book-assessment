"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../errorHandler");
const appError_1 = require("../../utils/appError");
describe("errorHandler", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });
    it("should handle AppError correctly", () => {
        const error = new appError_1.AppError("Test error", 400);
        (0, errorHandler_1.errorHandler)(error, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: "error",
            message: "Test error",
        });
    });
    it("should handle generic errors with 500 status", () => {
        const error = new Error("Generic error");
        (0, errorHandler_1.errorHandler)(error, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: "error",
            message: "Internal server error",
        });
    });
});
