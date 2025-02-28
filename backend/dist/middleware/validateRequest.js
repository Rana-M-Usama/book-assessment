"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const appError_1 = require("../utils/appError");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            next(new appError_1.AppError("Validation failed", 400));
        }
    };
};
exports.validateRequest = validateRequest;
