"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof appError_1.AppError) {
        return res.status(err.status).json({
            status: "error",
            message: err.message,
        });
    }
    console.error("Error:", err);
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
