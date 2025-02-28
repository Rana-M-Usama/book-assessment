import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import bookRoutes from "./api/books/books.routes";
import { swaggerDocument } from "./swagger/swagger";
import { Request, Response } from "express";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/books", bookRoutes);

// Add 404 handler before error handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Not found",
  });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    status: "error",
    message: message,
  });
};

app.use(errorHandler);

export default app;
