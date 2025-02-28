"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Book API",
        version: "1.0.0",
        description: "API for managing books",
    },
    paths: {
        "/api/books": {
            post: {
                tags: ["Books"],
                summary: "Create a new book",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "author"],
                                properties: {
                                    title: { type: "string", description: "Book title" },
                                    author: { type: "string", description: "Book author" },
                                    isbn: { type: "string", description: "Book ISBN" },
                                    publishedYear: {
                                        type: "integer",
                                        description: "Year of publication",
                                        minimum: 1000,
                                        maximum: 9999,
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Book created successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Book" },
                            },
                        },
                    },
                    400: {
                        description: "Bad request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
            get: {
                tags: ["Books"],
                summary: "Get all books",
                parameters: [
                    {
                        in: "query",
                        name: "author",
                        schema: { type: "string" },
                        description: "Filter by author",
                    },
                    {
                        in: "query",
                        name: "publishedYear",
                        schema: { type: "integer", minimum: 1000, maximum: 9999 },
                        description: "Filter by published year",
                    },
                    {
                        in: "query",
                        name: "search",
                        schema: { type: "string" },
                        description: "Search in title, author, or ISBN",
                    },
                ],
                responses: {
                    200: {
                        description: "List of books",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Book" },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/books/{id}": {
            get: {
                tags: ["Books"],
                summary: "Get book by ID",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "integer" },
                        description: "Book ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Book details",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Book" },
                            },
                        },
                    },
                    404: {
                        description: "Book not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Books"],
                summary: "Update book by ID",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "integer" },
                        description: "Book ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string", description: "Book title" },
                                    author: { type: "string", description: "Book author" },
                                    isbn: { type: "string", description: "Book ISBN" },
                                    publishedYear: {
                                        type: "integer",
                                        description: "Year of publication",
                                        minimum: 1000,
                                        maximum: 9999,
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Book updated successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Book" },
                            },
                        },
                    },
                    400: {
                        description: "Bad request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    404: {
                        description: "Book not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Books"],
                summary: "Delete book by ID",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "integer" },
                        description: "Book ID",
                    },
                ],
                responses: {
                    200: { description: "Book deleted successfully" },
                    404: {
                        description: "Book not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Book: {
                type: "object",
                properties: {
                    id: { type: "integer", description: "Book ID" },
                    title: { type: "string", description: "Book title" },
                    author: { type: "string", description: "Book author" },
                    isbn: { type: "string", nullable: true, description: "Book ISBN" },
                    publishedYear: {
                        type: "integer",
                        nullable: true,
                        description: "Year of publication",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "Creation timestamp",
                    },
                },
            },
            Error: {
                type: "object",
                properties: {
                    status: { type: "string", example: "error" },
                    message: { type: "string" },
                },
            },
        },
    },
};
