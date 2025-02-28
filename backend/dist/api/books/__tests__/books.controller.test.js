"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const books_controller_1 = require("../books.controller");
const books_service_1 = require("../books.service");
const appError_1 = require("../../../utils/appError");
// Mock BookService
jest.mock("../books.service");
describe("BookController", () => {
    let bookController;
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        bookController = new books_controller_1.BookController();
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
        const bookData = {
            title: "Test Book",
            author: "Test Author",
            isbn: "1234567890",
            publishedYear: 2024,
        };
        it("should create a book successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = bookData;
            const mockBook = Object.assign(Object.assign({ id: 1 }, bookData), { createdAt: new Date() });
            jest
                .spyOn(books_service_1.BookService.prototype, "createBook")
                .mockResolvedValue(mockBook);
            yield bookController.createBook(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "success",
                data: mockBook,
            });
        }));
        it("should handle validation errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new appError_1.AppError("Validation failed", 400);
            jest.spyOn(books_service_1.BookService.prototype, "createBook").mockRejectedValue(error);
            yield bookController.createBook(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(error);
        }));
    });
    describe("getBooks", () => {
        it("should get books with pagination", () => __awaiter(void 0, void 0, void 0, function* () {
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
                ],
                total: 1,
                page: 1,
                limit: 10,
            };
            mockRequest.query = { page: "1", limit: "10" };
            jest
                .spyOn(books_service_1.BookService.prototype, "getBooks")
                .mockResolvedValue(mockBooks);
            yield bookController.getBooks(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "success",
                data: mockBooks,
            });
        }));
        it("should handle errors in getBooks", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            jest.spyOn(books_service_1.BookService.prototype, "getBooks").mockRejectedValue(error);
            yield bookController.getBooks(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(error);
        }));
    });
    describe("updateBook", () => {
        const bookData = {
            title: "Updated Book",
            author: "Updated Author",
            isbn: "0987654321",
            publishedYear: 2024,
        };
        it("should update a book successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: "1" };
            mockRequest.body = bookData;
            const mockUpdatedBook = Object.assign(Object.assign({ id: 1 }, bookData), { createdAt: new Date() });
            jest
                .spyOn(books_service_1.BookService.prototype, "updateBook")
                .mockResolvedValue(mockUpdatedBook);
            yield bookController.updateBook(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "success",
                data: mockUpdatedBook,
            });
        }));
        it("should handle errors in updateBook", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Update failed");
            jest.spyOn(books_service_1.BookService.prototype, "updateBook").mockRejectedValue(error);
            yield bookController.updateBook(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(error);
        }));
    });
    describe("deleteBook", () => {
        it("should delete a book successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: "1" };
            jest
                .spyOn(books_service_1.BookService.prototype, "deleteBook")
                .mockResolvedValue(undefined);
            yield bookController.deleteBook(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        }));
        it("should handle errors in deleteBook", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Delete failed");
            jest.spyOn(books_service_1.BookService.prototype, "deleteBook").mockRejectedValue(error);
            yield bookController.deleteBook(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(error);
        }));
    });
});
