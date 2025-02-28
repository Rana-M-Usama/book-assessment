import { Book as PrismaBook } from "@prisma/client";

export type Book = PrismaBook;

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
}

export interface BookFilters {
  author?: string;
  publishedYear?: number;
  search?: string;
}
