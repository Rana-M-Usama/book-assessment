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
const books_service_1 = require("./books.service");
class BookController {
    constructor() {
        this.createBook = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bookData = req.body;
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
                const filters = req.query;
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
        this.updateBook = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const bookData = req.body;
                const updatedBook = yield this.bookService.updateBook(id, bookData);
                res.status(200).json({
                    status: "success",
                    data: updatedBook,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteBook = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bookService.deleteBook(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
        this.bookService = new books_service_1.BookService();
    }
}
exports.BookController = BookController;
