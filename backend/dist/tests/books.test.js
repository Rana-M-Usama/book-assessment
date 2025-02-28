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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const client_1 = require("@prisma/client");
const app_1 = __importDefault(require("../app"));
const prisma = new client_1.PrismaClient();
describe("Books API", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.book.deleteMany();
        // Setup test data with unique ISBNs
        yield prisma.book.createMany({
            data: Array.from({ length: 15 }, (_, i) => ({
                title: `Book ${i + 1}`,
                author: `Author ${i + 1}`,
                isbn: `ISBN${i + 1}`,
                publishedYear: 2024,
            })),
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.book.deleteMany();
        yield prisma.$disconnect();
    }));
    it("should create a book", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/books")
            .send({
            title: "New Test Book",
            author: "New Test Author",
            isbn: "NEW123TEST",
            publishedYear: 2024,
        })
            .expect("Content-Type", /json/)
            .expect(201);
        expect(response.body.status).toBe("success");
        expect(response.body.data.title).toBe("New Test Book");
    }));
    it("should list books with pagination", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/api/books")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body.status).toBe("success");
        expect(Array.isArray(response.body.data.data)).toBe(true);
        expect(response.body.data.data.length).toBeLessThanOrEqual(10);
        expect(typeof response.body.data.total).toBe("number");
    }));
    it("should filter books by title", () => __awaiter(void 0, void 0, void 0, function* () {
        const uniqueBook = yield prisma.book.create({
            data: {
                title: "Test Book",
                author: "Test Author",
                isbn: "TEST123UNIQUE",
                publishedYear: 2024,
            },
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/api/books?title=Test")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body.status).toBe("success");
        expect(Array.isArray(response.body.data.data)).toBe(true);
        expect(response.body.data.data.length).toBeGreaterThan(0);
        expect(response.body.data.data[0].title).toContain("Test");
        yield prisma.book.delete({ where: { id: uniqueBook.id } });
    }));
    it("should update a book", () => __awaiter(void 0, void 0, void 0, function* () {
        const book = yield prisma.book.create({
            data: {
                title: "Update Test Book",
                author: "Update Test Author",
                isbn: "UPDATE123",
                publishedYear: 2024,
            },
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/books/${book.id}`)
            .send({
            title: "Updated Book",
            author: "Updated Author",
            isbn: "UPDATED123",
        })
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.title).toBe("Updated Book");
        yield prisma.book.delete({ where: { id: book.id } });
    }));
    it("should delete a book", () => __awaiter(void 0, void 0, void 0, function* () {
        const book = yield prisma.book.create({
            data: {
                title: "Delete Test Book",
                author: "Delete Test Author",
                isbn: "DELETE123",
                publishedYear: 2024,
            },
        });
        yield (0, supertest_1.default)(app_1.default).delete(`/api/books/${book.id}`).expect(204);
        const deletedBook = yield prisma.book.findUnique({
            where: { id: book.id },
        });
        expect(deletedBook).toBeNull();
    }));
});
