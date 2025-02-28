import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert, } from "@mui/material";
import { useState, useEffect, useCallback, memo } from "react";
import { booksApi } from "../api/books";
const EditBookDialogComponent = memo(({ book, open, onClose }) => {
    const [editedBook, setEditedBook] = useState({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
    });
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update book");
        }
        finally {
            setLoading(false);
        }
    }, [editedBook, book.id, onClose]);
    const handleChange = useCallback((field) => (e) => {
        setEditedBook((prev) => ({
            ...prev,
            [field]: field === "publishedYear"
                ? parseInt(e.target.value)
                : e.target.value,
        }));
    }, []);
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: "Edit Book" }), _jsxs(DialogContent, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs(Stack, { spacing: 2, sx: { mt: 1 }, children: [_jsx(TextField, { label: "Title", value: editedBook.title, onChange: handleChange("title"), disabled: loading }), _jsx(TextField, { label: "Author", value: editedBook.author, onChange: handleChange("author"), disabled: loading }), _jsx(TextField, { label: "ISBN", value: editedBook.isbn, onChange: handleChange("isbn"), disabled: loading }), _jsx(TextField, { label: "Published Year", type: "number", value: editedBook.publishedYear || "", onChange: handleChange("publishedYear"), disabled: loading })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: loading, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", disabled: loading, children: "Save" })] })] }));
});
EditBookDialogComponent.displayName = "EditBookDialog";
export default EditBookDialogComponent;
