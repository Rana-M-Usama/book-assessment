import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  Suspense,
} from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import { booksApi, BookFilters, Book } from "../api/books";
import { lazy } from "react";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Lazy load dialogs
const AddBookDialog = lazy(() => import("./AddBookDialog"));
const EditBookDialog = lazy(() => import("./EditBookDialog"));

export const BookList = () => {
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    limit: 10,
    title: "",
    author: "",
    search: "",
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  // Cache filter changes with useRef
  const filterTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoize filter handler
  const handleFilterChange = useCallback(
    (field: keyof BookFilters) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }

      filterTimeoutRef.current = setTimeout(() => {
        setFilters((prev) => ({ ...prev, [field]: e.target.value }));
      }, 300);
    },
    []
  );

  // Memoize handlers
  const handlers = useMemo(
    () => ({
      handleDelete: async (id: number) => {
        try {
          await booksApi.deleteBook(id);
          await fetchBooks();
        } catch (err) {
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
    }),
    []
  );

  // Memoize table headers
  const tableHeaders = useMemo(
    () => (
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Author</TableCell>
          <TableCell>ISBN</TableCell>
          <TableCell>Published Year</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
    ),
    []
  );

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await booksApi.getBooks(filters);
      setBooks(response.data || []);
      setTotal(response.total || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBooks([]);
      setTotal(0);
    } finally {
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

    return books.map((book) => (
      <TableRow key={book.id}>
        <TableCell>{book.title}</TableCell>
        <TableCell>{book.author}</TableCell>
        <TableCell>{book.isbn}</TableCell>
        <TableCell>{book.publishedYear}</TableCell>
        <TableCell>
          <Tooltip title="Edit book">
            <IconButton onClick={() => setEditBook(book)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete book">
            <IconButton
              color="error"
              onClick={() => handlers.handleDelete(book.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ));
  }, [books, handlers.handleDelete]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            <TextField
              label="Title"
              defaultValue={filters.title}
              onChange={handleFilterChange("title")}
            />
            <TextField
              label="Author"
              defaultValue={filters.author}
              onChange={handleFilterChange("author")}
            />
          </Stack>

          <TextField
            label="Search"
            defaultValue={filters.search}
            onChange={handleFilterChange("search")}
          />
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            {tableHeaders}
            <TableBody>{tableRows}</TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total || 0}
            page={filters.page - 1}
            onPageChange={(_, newPage) =>
              setFilters((prev) => ({ ...prev, page: newPage + 1 }))
            }
            rowsPerPage={filters.limit || 10}
            onRowsPerPageChange={(event) => {
              setFilters((prev) => ({
                ...prev,
                limit: parseInt(event.target.value, 10),
                page: 1,
              }));
            }}
            rowsPerPageOptions={[10]}
          />
        </TableContainer>
      </Stack>

      <Fab
        color="primary"
        onClick={handlers.handleOpenAdd}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handlers.handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handlers.handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Suspense fallback={null}>
        {openAdd && (
          <AddBookDialog open={openAdd} onClose={handlers.handleCloseAdd} />
        )}
        {editBook && (
          <EditBookDialog
            book={editBook}
            open={true}
            onClose={handlers.handleCloseEdit}
          />
        )}
      </Suspense>
    </Box>
  );
};
