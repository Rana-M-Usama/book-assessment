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
exports.BookController = void 0;
const bookService_1 = require("../services/bookService");
const appError_1 = require("../utils/appError");
const database_1 = require("../database/database");
class BookController {
    constructor() {
        this.createBook = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bookData = req.body;
                if (!bookData.title || !bookData.author) {
                    throw new appError_1.AppError("Title and author are required", 400);
                }
                const book = yield this.bookService.createBook(bookData);
                res.status(201).json({
                    status: "success",
                    data: book,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getBooks = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {
                    author: req.query.author,
                    publishedYear: req.query.publishedYear
                        ? parseInt(req.query.publishedYear)
                        : undefined,
                    search: req.query.search,
                };
                const books = yield this.bookService.getBooks(filters);
                res.status(200).json({
                    status: "success",
                    data: books,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.bookService = new bookService_1.BookService((0, database_1.getDatabase)());
    }
}
exports.BookController = BookController;
