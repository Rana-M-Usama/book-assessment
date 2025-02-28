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
exports.BookService = void 0;
const appError_1 = require("../utils/appError");
class BookService {
    constructor(db) {
        this.db = db;
    }
    createBook(bookData) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `
        INSERT INTO books (title, author, isbn, publishedYear)
        VALUES (?, ?, ?, ?)
      `;
                const db = this.db;
                this.db.run(query, [
                    bookData.title,
                    bookData.author,
                    bookData.isbn,
                    bookData.publishedYear,
                ], function (err) {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed")) {
                            reject(new appError_1.AppError("ISBN already exists", 400));
                        }
                        else {
                            reject(err);
                        }
                        return;
                    }
                    db.get("SELECT * FROM books WHERE id = ?", [this.lastID], (err, row) => {
                        if (err)
                            reject(err);
                        else
                            resolve(row);
                    });
                });
            });
        });
    }
    getBooks(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let query = "SELECT * FROM books WHERE 1=1";
                const params = [];
                if (filters.author) {
                    query += " AND author LIKE ?";
                    params.push(`%${filters.author}%`);
                }
                if (filters.publishedYear) {
                    query += " AND publishedYear = ?";
                    params.push(filters.publishedYear);
                }
                if (filters.search) {
                    query += " AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)";
                    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
                }
                this.db.all(query, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        });
    }
    getBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(row || null);
                    }
                });
            });
        });
    }
}
exports.BookService = BookService;
