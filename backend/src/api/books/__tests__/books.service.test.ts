import { Book } from "@prisma/client";
import { BookService } from "../books.service";
import { CreateBookDTO } from "../books.schema";
import { AppError } from "../../../utils/appError";

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
const mockPrismaClient = new (jest.requireMock(
  "@prisma/client"
).PrismaClient)();
const {
  create: mockCreate,
  findMany: mockFindMany,
  count: mockCount,
  update: mockUpdate,
  delete: mockDelete,
} = mockPrismaClient.book;

describe("BookService", () => {
  let bookService: BookService;

  beforeEach(() => {
    jest.clearAllMocks();
    bookService = new BookService();
  });

  describe("createBook", () => {
    const mockBookData: Required<CreateBookDTO> = {
      title: "Test Book",
      author: "Test Author",
      isbn: "1234567890",
      publishedYear: 2024,
    };

    it("should create a book successfully", async () => {
      const expectedBook: Book = {
        id: 1,
        ...mockBookData,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(expectedBook);

      const result = await bookService.createBook(mockBookData);
      expect(result).toEqual(expectedBook);
      expect(mockCreate).toHaveBeenCalledWith({
        data: mockBookData,
      });
    });

    it("should throw AppError when ISBN already exists", async () => {
      mockCreate.mockRejectedValue({ code: "P2002" });
      await expect(bookService.createBook(mockBookData)).rejects.toThrow(
        new AppError("ISBN already exists", 400)
      );
    });

    it("should throw original error for non-P2002 errors", async () => {
      const error = new Error("Database error");
      mockCreate.mockRejectedValue(error);
      await expect(bookService.createBook(mockBookData)).rejects.toThrow(error);
    });
  });

  describe("getBooks", () => {
    const mockBooks: Book[] = [
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

    it("should return books with pagination", async () => {
      mockFindMany.mockResolvedValue(mockBooks);
      mockCount.mockResolvedValue(2);

      const result = await bookService.getBooks({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: mockBooks,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it("should use default pagination values when not provided", async () => {
      const emptyBooks: Book[] = [];
      mockFindMany.mockResolvedValue(emptyBooks);
      mockCount.mockResolvedValue(0);

      await bookService.getBooks({});
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        })
      );
    });

    it("should apply filters correctly", async () => {
      const filters = {
        title: "Test",
        author: "Author",
        search: "Search",
      };

      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await bookService.getBooks(filters);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: "Test" },
            author: { contains: "Author" },
            OR: [
              { title: { contains: "Search" } },
              { author: { contains: "Search" } },
              { isbn: { contains: "Search" } },
            ],
          }),
        })
      );
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockFindMany.mockRejectedValue(error);
      await expect(bookService.getBooks({})).rejects.toThrow(error);
    });

    it("should handle empty filters", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      const result = await bookService.getBooks({});
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("should handle whitespace in filters", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await bookService.getBooks({
        title: "  Test  ",
        author: "  Author  ",
        search: "  Search  ",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: "Test" },
            author: { contains: "Author" },
            OR: [
              { title: { contains: "Search" } },
              { author: { contains: "Search" } },
              { isbn: { contains: "Search" } },
            ],
          }),
        })
      );
    });

    it("should handle undefined filters", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await bookService.getBooks({
        title: undefined,
        author: undefined,
        search: undefined,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });
  });

  describe("updateBook", () => {
    const mockBookData = {
      title: "Updated Book",
      author: "Updated Author",
      isbn: "0987654321",
    };

    it("should update a book successfully", async () => {
      const expectedBook = { id: 1, ...mockBookData, createdAt: new Date() };
      mockUpdate.mockResolvedValue(expectedBook);

      const result = await bookService.updateBook(1, mockBookData);
      expect(result).toEqual(expectedBook);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockBookData,
      });
    });

    it("should handle database errors during update", async () => {
      const error = new Error("Update failed");
      mockUpdate.mockRejectedValue(error);
      await expect(bookService.updateBook(1, mockBookData)).rejects.toThrow(
        error
      );
    });
  });

  describe("deleteBook", () => {
    it("should delete a book successfully", async () => {
      mockDelete.mockResolvedValue({});
      await bookService.deleteBook("1");
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should handle database errors during deletion", async () => {
      const error = new Error("Deletion failed");
      mockDelete.mockRejectedValue(error);
      await expect(bookService.deleteBook("1")).rejects.toThrow(error);
    });
  });
});
