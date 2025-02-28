"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest_1 = require("../validateRequest");
const zod_1 = require("zod");
const appError_1 = require("../../utils/appError");
describe("validateRequest", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
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
        const schema = zod_1.z.object({
            name: zod_1.z.string(),
        });
        mockRequest.body = { name: "Test" };
        const middleware = (0, validateRequest_1.validateRequest)(schema);
        middleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(nextFunction).not.toHaveBeenCalledWith(expect.any(appError_1.AppError));
    });
    it("should throw AppError for invalid request body", () => {
        const schema = zod_1.z.object({
            name: zod_1.z.string(),
        });
        mockRequest.body = { name: 123 };
        const middleware = (0, validateRequest_1.validateRequest)(schema);
        middleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(appError_1.AppError));
    });
});
