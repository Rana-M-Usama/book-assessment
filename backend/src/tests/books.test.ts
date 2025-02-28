import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app";

const prisma = new PrismaClient();

describe("Books API", () => {
  beforeAll(async () => {
    await prisma.book.deleteMany();

    // Setup test data with unique ISBNs
    await prisma.book.createMany({
      data: Array.from({ length: 15 }, (_, i) => ({
        title: `Book ${i + 1}`,
        author: `Author ${i + 1}`,
        isbn: `ISBN${i + 1}`,
        publishedYear: 2024,
      })),
    });
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.$disconnect();
  });

  it("should create a book", async () => {
    const response = await request(app)
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
  });

  it("should list books with pagination", async () => {
    const response = await request(app)
      .get("/api/books")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.data.data)).toBe(true);
    expect(response.body.data.data.length).toBeLessThanOrEqual(10);
    expect(typeof response.body.data.total).toBe("number");
  });

  it("should filter books by title", async () => {
    const uniqueBook = await prisma.book.create({
      data: {
        title: "Test Book",
        author: "Test Author",
        isbn: "TEST123UNIQUE",
        publishedYear: 2024,
      },
    });

    const response = await request(app)
      .get("/api/books?title=Test")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.data.data)).toBe(true);
    expect(response.body.data.data.length).toBeGreaterThan(0);
    expect(response.body.data.data[0].title).toContain("Test");

    await prisma.book.delete({ where: { id: uniqueBook.id } });
  });

  it("should update a book", async () => {
    const book = await prisma.book.create({
      data: {
        title: "Update Test Book",
        author: "Update Test Author",
        isbn: "UPDATE123",
        publishedYear: 2024,
      },
    });

    const response = await request(app)
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

    await prisma.book.delete({ where: { id: book.id } });
  });

  it("should delete a book", async () => {
    const book = await prisma.book.create({
      data: {
        title: "Delete Test Book",
        author: "Delete Test Author",
        isbn: "DELETE123",
        publishedYear: 2024,
      },
    });

    await request(app).delete(`/api/books/${book.id}`).expect(204);

    const deletedBook = await prisma.book.findUnique({
      where: { id: book.id },
    });
    expect(deletedBook).toBeNull();
  });
});
