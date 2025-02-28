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
const client_1 = require("@prisma/client");
const appError_1 = require("../../utils/appError");
const prisma = new client_1.PrismaClient();
class BookService {
    createBook(bookData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const book = yield prisma.book.create({
                    data: Object.assign(Object.assign({}, bookData), { isbn: (_a = bookData.isbn) !== null && _a !== void 0 ? _a : "" }),
                });
                return book;
            }
            catch (error) {
                if (error.code === "P2002") {
                    throw new appError_1.AppError("ISBN already exists", 400);
                }
                throw error;
            }
        });
    }
    getBooks() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                const page = Number(filters.page) || 1;
                const limit = Number(filters.limit) || 10;
                const { title, author, search } = filters;
                const skip = (page - 1) * limit;
                const where = {};
                if (title === null || title === void 0 ? void 0 : title.trim()) {
                    where.title = {
                        contains: title.trim(),
                    };
                }
                if (author === null || author === void 0 ? void 0 : author.trim()) {
                    where.author = {
                        contains: author.trim(),
                    };
                }
                if (search === null || search === void 0 ? void 0 : search.trim()) {
                    where.OR = [
                        { title: { contains: search.trim() } },
                        { author: { contains: search.trim() } },
                        { isbn: { contains: search.trim() } },
                    ];
                }
                const [books, total] = yield Promise.all([
                    prisma.book.findMany({
                        where,
                        skip,
                        take: limit,
                        orderBy: { createdAt: "desc" },
                    }),
                    prisma.book.count({ where }),
                ]);
                return { data: books, total, page, limit };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateBook(id, bookData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.book.update({
                    where: { id: Number(id) },
                    data: bookData,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.book.delete({
                where: { id: parseInt(id, 10) },
            });
        });
    }
}
exports.BookService = BookService;
