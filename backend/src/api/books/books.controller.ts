import { Request, Response, NextFunction } from "express";
import { BookService } from "./books.service";
import { CreateBookDTO, BookFilters } from "./books.schema";
import { AppError } from "../../utils/appError";

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  createBook = async (
    req: Request<{}, {}, CreateBookDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookData = req.body;
      const book = await this.bookService.createBook(bookData);
      res.status(201).json({
        status: "success",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  };

  getBooks = async (
    req: Request<{}, {}, {}, BookFilters>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filters = req.query;
      const books = await this.bookService.getBooks(filters);
      res.status(200).json({
        status: "success",
        data: books,
      });
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (
    req: Request<{ id: string }, any, CreateBookDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id, 10);
      const bookData = req.body;
      const updatedBook = await this.bookService.updateBook(id, bookData);
      res.status(200).json({
        status: "success",
        data: updatedBook,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.bookService.deleteBook(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
