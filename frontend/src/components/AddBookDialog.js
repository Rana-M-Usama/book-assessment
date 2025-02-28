import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert, } from "@mui/material";
import { useState, useCallback, memo } from "react";
import { booksApi } from "../api/books";
const AddBookDialogComponent = memo(({ open, onClose }) => {
    const [book, setBook] = useState({
        title: "",
        author: "",
        isbn: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleClose = useCallback(() => {
        setBook({ title: "", author: "", isbn: "" });
        onClose();
    }, [onClose]);
    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            await booksApi.createBook(data);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create book");
        }
        finally {
            setLoading(false);
        }
    };
    const handleChange = useCallback((field) => (e) => {
        setBook((prev) => ({
            ...prev,
            [field]: field === "publishedYear"
                ? parseInt(e.target.value)
                : e.target.value,
        }));
    }, []);
    return (_jsxs(Dialog, { open: open, onClose: handleClose, children: [_jsx(DialogTitle, { children: "Add New Book aaa" }), _jsxs(DialogContent, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs(Stack, { spacing: 2, sx: { mt: 1 }, children: [_jsx(TextField, { label: "Title", value: book.title, onChange: handleChange("title"), disabled: loading }), _jsx(TextField, { label: "Author", value: book.author, onChange: handleChange("author"), disabled: loading }), _jsx(TextField, { label: "ISBN", value: book.isbn, onChange: handleChange("isbn"), disabled: loading }), _jsx(TextField, { label: "Published Year", type: "number", value: book.publishedYear || "", onChange: handleChange("publishedYear"), disabled: loading })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleClose, disabled: loading, children: "Cancel" }), _jsx(Button, { onClick: () => handleSubmit(book), variant: "contained", disabled: loading, children: "Add" })] })] }));
});
AddBookDialogComponent.displayName = "AddBookDialog";
export default AddBookDialogComponent;
