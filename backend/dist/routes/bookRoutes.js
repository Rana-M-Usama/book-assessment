"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_controller_1 = require("../api/books/books.controller");
const router = (0, express_1.Router)();
const bookController = new books_controller_1.BookController();
router.post("/", bookController.createBook);
router.get("/", bookController.getBooks);
exports.default = router;
