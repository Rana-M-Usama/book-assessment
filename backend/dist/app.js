"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const books_routes_1 = __importDefault(require("./api/books/books.routes"));
const swagger_1 = require("./swagger/swagger");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
// Routes
app.use("/api/books", books_routes_1.default);
// Add 404 handler before error handler
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Not found",
    });
});
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({
        status: "error",
        message: message,
    });
};
app.use(errorHandler);
exports.default = app;
