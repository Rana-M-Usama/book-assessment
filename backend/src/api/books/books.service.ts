import { PrismaClient } from "@prisma/client";
import { CreateBookDTO, BookFilters } from "./books.schema";
import { AppError } from "../../utils/appError";

const prisma = new PrismaClient();

export class BookService {
  async createBook(bookData: CreateBookDTO) {
    try {
      const book = await prisma.book.create({
        data: {
          ...bookData,
          isbn: bookData.isbn ?? "",
        },
      });
      return book;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new AppError("ISBN already exists", 400);
      }
      throw error;
    }
  }

  async getBooks(filters: BookFilters = {}) {
    try {
      const page = Number(filters.page) || 1;
      const limit = Number(filters.limit) || 10;
      const { title, author, search } = filters;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (title?.trim()) {
        where.title = {
          contains: title.trim(),
        };
      }

      if (author?.trim()) {
        where.author = {
          contains: author.trim(),
        };
      }

      if (search?.trim()) {
        where.OR = [
          { title: { contains: search.trim() } },
          { author: { contains: search.trim() } },
          { isbn: { contains: search.trim() } },
        ];
      }

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.book.count({ where }),
      ]);

      return { data: books, total, page, limit };
    } catch (error) {
      throw error;
    }
  }

  async updateBook(id: number, bookData: CreateBookDTO) {
    try {
      return await prisma.book.update({
        where: { id: Number(id) },
        data: bookData,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteBook(id: string): Promise<void> {
    await prisma.book.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}
