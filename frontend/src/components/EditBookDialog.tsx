import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { useState, useEffect, useCallback, memo } from "react";
import { booksApi, Book, CreateBookDTO } from "../api/books";

interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onClose: () => void;
}

const EditBookDialogComponent = memo(
  ({ book, open, onClose }: EditBookDialogProps) => {
    const [editedBook, setEditedBook] = useState<CreateBookDTO>({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setEditedBook({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
      });
    }, [book]);

    const handleSubmit = useCallback(async () => {
      setLoading(true);
      try {
        await booksApi.updateBook(book.id, editedBook);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update book");
      } finally {
        setLoading(false);
      }
    }, [editedBook, book.id, onClose]);

    const handleChange = useCallback(
      (field: keyof CreateBookDTO) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setEditedBook((prev) => ({
            ...prev,
            [field]:
              field === "publishedYear"
                ? parseInt(e.target.value)
                : e.target.value,
          }));
        },
      []
    );

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editedBook.title}
              onChange={handleChange("title")}
              disabled={loading}
            />
            <TextField
              label="Author"
              value={editedBook.author}
              onChange={handleChange("author")}
              disabled={loading}
            />
            <TextField
              label="ISBN"
              value={editedBook.isbn}
              onChange={handleChange("isbn")}
              disabled={loading}
            />
            <TextField
              label="Published Year"
              type="number"
              value={editedBook.publishedYear || ""}
              onChange={handleChange("publishedYear")}
              disabled={loading}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

EditBookDialogComponent.displayName = "EditBookDialog";

export default EditBookDialogComponent;
