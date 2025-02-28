export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  createdAt: string;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
}

export interface BookFilters {
  author?: string;
  publishedYear?: number;
  search?: string;
}
