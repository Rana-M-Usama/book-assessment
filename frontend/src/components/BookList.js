import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef, useEffect, Suspense, } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Stack, Alert, Snackbar, CircularProgress, IconButton, Tooltip, Fab, } from "@mui/material";
import { booksApi } from "../api/books";
import { lazy } from "react";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, } from "@mui/icons-material";
// Lazy load dialogs
const AddBookDialog = lazy(() => import("./AddBookDialog"));
const EditBookDialog = lazy(() => import("./EditBookDialog"));
export const BookList = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        title: "",
        author: "",
        search: "",
    });
    const [books, setBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [editBook, setEditBook] = useState(null);
    // Cache filter changes with useRef
    const filterTimeoutRef = useRef();
    // Memoize filter handler
    const handleFilterChange = useCallback((field) => (e) => {
        if (filterTimeoutRef.current) {
            clearTimeout(filterTimeoutRef.current);
        }
        filterTimeoutRef.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, [field]: e.target.value }));
        }, 300);
    }, []);
    // Memoize handlers
    const handlers = useMemo(() => ({
        handleDelete: async (id) => {
            try {
                await booksApi.deleteBook(id);
                await fetchBooks();
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            }
        },
        handleOpenAdd: () => setOpenAdd(true),
        handleCloseAdd: async () => {
            setOpenAdd(false);
            await fetchBooks();
        },
        handleCloseEdit: async () => {
            setEditBook(null);
            await fetchBooks();
        },
        handleCloseError: () => setError(null),
    }), []);
    // Memoize table headers
    const tableHeaders = useMemo(() => (_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Author" }), _jsx(TableCell, { children: "ISBN" }), _jsx(TableCell, { children: "Published Year" }), _jsx(TableCell, { children: "Actions" })] }) })), []);
    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const response = await booksApi.getBooks(filters);
            setBooks(response.data || []);
            setTotal(response.total || 0);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setBooks([]);
            setTotal(0);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchBooks();
    }, [filters]);
    const tableRows = useMemo(() => {
        if (!books || !Array.isArray(books)) {
            return [];
        }
        return books.map((book) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: book.title }), _jsx(TableCell, { children: book.author }), _jsx(TableCell, { children: book.isbn }), _jsx(TableCell, { children: book.publishedYear }), _jsxs(TableCell, { children: [_jsx(Tooltip, { title: "Edit book", children: _jsx(IconButton, { onClick: () => setEditBook(book), children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Delete book", children: _jsx(IconButton, { color: "error", onClick: () => handlers.handleDelete(book.id), children: _jsx(DeleteIcon, {}) }) })] })] }, book.id)));
    }, [books, handlers.handleDelete]);
    if (isLoading) {
        return _jsx(CircularProgress, {});
    }
    if (error) {
        return _jsx(Alert, { severity: "error", children: error });
    }
    return (_jsxs(Box, { sx: { position: "relative", minHeight: "100vh" }, children: [_jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", justifyContent: "space-between", children: [_jsxs(Stack, { direction: "row", spacing: 2, children: [_jsx(TextField, { label: "Title", defaultValue: filters.title, onChange: handleFilterChange("title") }), _jsx(TextField, { label: "Author", defaultValue: filters.author, onChange: handleFilterChange("author") })] }), _jsx(TextField, { label: "Search", defaultValue: filters.search, onChange: handleFilterChange("search") })] }), _jsxs(TableContainer, { component: Paper, children: [_jsxs(Table, { children: [tableHeaders, _jsx(TableBody, { children: tableRows })] }), _jsx(TablePagination, { component: "div", count: total || 0, page: filters.page - 1, onPageChange: (_, newPage) => setFilters((prev) => ({ ...prev, page: newPage + 1 })), rowsPerPage: filters.limit || 10, onRowsPerPageChange: (event) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        limit: parseInt(event.target.value, 10),
                                        page: 1,
                                    }));
                                }, rowsPerPageOptions: [10] })] })] }), _jsx(Fab, { color: "primary", onClick: handlers.handleOpenAdd, sx: {
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                }, children: _jsx(AddIcon, {}) }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: handlers.handleCloseError, anchorOrigin: { vertical: "top", horizontal: "right" }, children: _jsx(Alert, { onClose: handlers.handleCloseError, severity: "error", children: error }) }), _jsxs(Suspense, { fallback: null, children: [openAdd && (_jsx(AddBookDialog, { open: openAdd, onClose: handlers.handleCloseAdd })), editBook && (_jsx(EditBookDialog, { book: editBook, open: true, onClose: handlers.handleCloseEdit }))] })] }));
};
