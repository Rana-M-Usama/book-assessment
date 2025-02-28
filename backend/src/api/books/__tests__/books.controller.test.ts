import { Request, Response, NextFunction } from "express";
import { Book } from "@prisma/client";
import { BookController } from "../books.controller";
import { BookService } from "../books.service";
import { CreateBookDTO } from "../books.schema";
import { AppError } from "../../../utils/appError";

// Mock BookService
jest.mock("../books.service");

describe("BookController", () => {
  let bookController: BookController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    bookController = new BookController();
    mockRequest = {
      params: { id: "1" },
      body: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe("createBook", () => {
    const bookData: Required<CreateBookDTO> = {
      title: "Test Book",
      author: "Test Author",
      isbn: "1234567890",
      publishedYear: 2024,
    };

    it("should create a book successfully", async () => {
      mockRequest.body = bookData;

      const mockBook: Book = {
        id: 1,
        ...bookData,
        createdAt: new Date(),
      };

      jest
        .spyOn(BookService.prototype, "createBook")
        .mockResolvedValue(mockBook);

      await bookController.createBook(
        mockRequest as Request<{}, {}, Required<CreateBookDTO>>,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockBook,
      });
    });

    it("should handle validation errors", async () => {
      const error = new AppError("Validation failed", 400);
      jest.spyOn(BookService.prototype, "createBook").mockRejectedValue(error);

      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe("getBooks", () => {
    it("should get books with pagination", async () => {
      const mockBooks = {
        data: [
          {
            id: 1,
            title: "Book 1",
            author: "Author 1",
            isbn: "123",
            publishedYear: 2024,
            createdAt: new Date(),
          },
        ] as Book[],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockRequest.query = { page: "1", limit: "10" };

      jest
        .spyOn(BookService.prototype, "getBooks")
        .mockResolvedValue(mockBooks);

      await bookController.getBooks(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockBooks,
      });
    });

    it("should handle errors in getBooks", async () => {
      const error = new Error("Database error");
      jest.spyOn(BookService.prototype, "getBooks").mockRejectedValue(error);

      await bookController.getBooks(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe("updateBook", () => {
    const bookData: Required<CreateBookDTO> = {
      title: "Updated Book",
      author: "Updated Author",
      isbn: "0987654321",
      publishedYear: 2024,
    };

    it("should update a book successfully", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = bookData;

      const mockUpdatedBook: Book = {
        id: 1,
        ...bookData,
        createdAt: new Date(),
      };

      jest
        .spyOn(BookService.prototype, "updateBook")
        .mockResolvedValue(mockUpdatedBook);

      await bookController.updateBook(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockUpdatedBook,
      });
    });

    it("should handle errors in updateBook", async () => {
      const error = new Error("Update failed");
      jest.spyOn(BookService.prototype, "updateBook").mockRejectedValue(error);

      await bookController.updateBook(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteBook", () => {
    it("should delete a book successfully", async () => {
      mockRequest.params = { id: "1" };
      jest
        .spyOn(BookService.prototype, "deleteBook")
        .mockResolvedValue(undefined);

      await bookController.deleteBook(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should handle errors in deleteBook", async () => {
      const error = new Error("Delete failed");
      jest.spyOn(BookService.prototype, "deleteBook").mockRejectedValue(error);

      await bookController.deleteBook(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });
});
