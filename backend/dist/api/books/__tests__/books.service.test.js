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
const books_service_1 = require("../books.service");
const appError_1 = require("../../../utils/appError");
// Mock the PrismaClient constructor first
jest.mock("@prisma/client", () => {
    const mockPrismaClient = {
        book: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrismaClient) };
});
// Get the mocked client after mocking
const mockPrismaClient = new (jest.requireMock("@prisma/client").PrismaClient)();
const { create: mockCreate, findMany: mockFindMany, count: mockCount, update: mockUpdate, delete: mockDelete, } = mockPrismaClient.book;
describe("BookService", () => {
    let bookService;
    beforeEach(() => {
        jest.clearAllMocks();
        bookService = new books_service_1.BookService();
    });
    describe("createBook", () => {
        const mockBookData = {
            title: "Test Book",
            author: "Test Author",
            isbn: "1234567890",
            publishedYear: 2024,
        };
        it("should create a book successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedBook = Object.assign(Object.assign({ id: 1 }, mockBookData), { createdAt: new Date() });
            mockCreate.mockResolvedValue(expectedBook);
            const result = yield bookService.createBook(mockBookData);
            expect(result).toEqual(expectedBook);
            expect(mockCreate).toHaveBeenCalledWith({
                data: mockBookData,
            });
        }));
        it("should throw AppError when ISBN already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            mockCreate.mockRejectedValue({ code: "P2002" });
            yield expect(bookService.createBook(mockBookData)).rejects.toThrow(new appError_1.AppError("ISBN already exists", 400));
        }));
        it("should throw original error for non-P2002 errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            mockCreate.mockRejectedValue(error);
            yield expect(bookService.createBook(mockBookData)).rejects.toThrow(error);
        }));
    });
    describe("getBooks", () => {
        const mockBooks = [
            {
                id: 1,
                title: "Book 1",
                author: "Author 1",
                isbn: "123",
                publishedYear: 2024,
                createdAt: new Date(),
            },
            {
                id: 2,
                title: "Book 2",
                author: "Author 2",
                isbn: "456",
                publishedYear: 2024,
                createdAt: new Date(),
            },
        ];
        it("should return books with pagination", () => __awaiter(void 0, void 0, void 0, function* () {
            mockFindMany.mockResolvedValue(mockBooks);
            mockCount.mockResolvedValue(2);
            const result = yield bookService.getBooks({ page: 1, limit: 10 });
            expect(result).toEqual({
                data: mockBooks,
                total: 2,
                page: 1,
                limit: 10,
            });
        }));
        it("should use default pagination values when not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const emptyBooks = [];
            mockFindMany.mockResolvedValue(emptyBooks);
            mockCount.mockResolvedValue(0);
            yield bookService.getBooks({});
            expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 10,
            }));
        }));
        it("should apply filters correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            const filters = {
                title: "Test",
                author: "Author",
                search: "Search",
            };
            mockFindMany.mockResolvedValue([]);
            mockCount.mockResolvedValue(0);
            yield bookService.getBooks(filters);
            expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    title: { contains: "Test" },
                    author: { contains: "Author" },
                    OR: [
                        { title: { contains: "Search" } },
                        { author: { contains: "Search" } },
                        { isbn: { contains: "Search" } },
                    ],
                }),
            }));
        }));
        it("should handle database errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            mockFindMany.mockRejectedValue(error);
            yield expect(bookService.getBooks({})).rejects.toThrow(error);
        }));
        it("should handle empty filters", () => __awaiter(void 0, void 0, void 0, function* () {
            mockFindMany.mockResolvedValue([]);
            mockCount.mockResolvedValue(0);
            const result = yield bookService.getBooks({});
            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
        }));
        it("should handle whitespace in filters", () => __awaiter(void 0, void 0, void 0, function* () {
            mockFindMany.mockResolvedValue([]);
            mockCount.mockResolvedValue(0);
            yield bookService.getBooks({
                title: "  Test  ",
                author: "  Author  ",
                search: "  Search  ",
            });
            expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    title: { contains: "Test" },
                    author: { contains: "Author" },
                    OR: [
                        { title: { contains: "Search" } },
                        { author: { contains: "Search" } },
                        { isbn: { contains: "Search" } },
                    ],
                }),
            }));
        }));
        it("should handle undefined filters", () => __awaiter(void 0, void 0, void 0, function* () {
            mockFindMany.mockResolvedValue([]);
            mockCount.mockResolvedValue(0);
            yield bookService.getBooks({
                title: undefined,
                author: undefined,
                search: undefined,
            });
            expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {},
            }));
        }));
    });
    describe("updateBook", () => {
        const mockBookData = {
            title: "Updated Book",
            author: "Updated Author",
            isbn: "0987654321",
        };
        it("should update a book successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedBook = Object.assign(Object.assign({ id: 1 }, mockBookData), { createdAt: new Date() });
            mockUpdate.mockResolvedValue(expectedBook);
            const result = yield bookService.updateBook(1, mockBookData);
            expect(result).toEqual(expectedBook);
            expect(mockUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: mockBookData,
            });
        }));
        it("should handle database errors during update", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Update failed");
            mockUpdate.mockRejectedValue(error);
            yield expect(bookService.updateBook(1, mockBookData)).rejects.toThrow(error);
        }));
    });
    describe("deleteBook", () => {
        it("should delete a book successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockDelete.mockResolvedValue({});
            yield bookService.deleteBook("1");
            expect(mockDelete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        }));
        it("should handle database errors during deletion", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Deletion failed");
            mockDelete.mockRejectedValue(error);
            yield expect(bookService.deleteBook("1")).rejects.toThrow(error);
        }));
    });
});
