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
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBooks = void 0;
const prisma_1 = require("../config/prisma");
const getBooks = (filters, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.book.findMany({
        where: filters,
        take: limit,
        skip: (page - 1) * limit,
    });
});
exports.getBooks = getBooks;
const createBook = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.book.create({ data });
});
exports.createBook = createBook;
const updateBook = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.book.update({ where: { id }, data });
});
exports.updateBook = updateBook;
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.book.delete({ where: { id } });
});
exports.deleteBook = deleteBook;
