import * as z from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().optional(),
  publishedYear: z.number().int().min(1000).max(9999).optional(),
});

export const bookFiltersSchema = z
  .object({
    title: z.string().optional(),
    author: z.string().optional(),
    search: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    publishedYear: z.number().optional(),
  })
  .optional();

export const bookResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().nullable(),
  publishedYear: z.number().nullable(),
  createdAt: z.date(),
});

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
}

export type BookFilters = z.infer<typeof bookFiltersSchema>;
