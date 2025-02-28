"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../appError");
describe("AppError", () => {
    it("should create an error with status and message", () => {
        const error = new appError_1.AppError("Test error", 400);
        expect(error.message).toBe("Test error");
        expect(error.status).toBe(400);
        expect(error instanceof Error).toBe(true);
    });
    it("should use default status 500 if not provided", () => {
        const error = new appError_1.AppError("Test error");
        expect(error.status).toBe(500);
    });
});
