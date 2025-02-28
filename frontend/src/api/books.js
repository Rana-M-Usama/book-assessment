import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);
// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// Add request interceptor for debugging
apiClient.interceptors.request.use((request) => {
    console.log("Request URL:", request.url);
    console.log("Request Method:", request.method);
    console.log("Request Data:", request.data);
    return request;
});
export const booksApi = {
    async getBooks(filters) {
        try {
            const { data: response } = await apiClient.get("/books", {
                params: filters,
            });
            return response.data;
        }
        catch (error) {
            console.error("Error fetching books:", error);
            throw error;
        }
    },
    createBook: async (book) => {
        try {
            const { data } = await apiClient.post("/books", book);
            return data.data;
        }
        catch (error) {
            console.error("Error creating book:", error);
            throw error;
        }
    },
    updateBook: async (id, book) => {
        try {
            const { data } = await apiClient.put(`/books/${id}`, book);
            return data.data;
        }
        catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    },
    deleteBook: async (id) => {
        try {
            await apiClient.delete(`/books/${id}`);
        }
        catch (error) {
            console.error("Error deleting book:", error);
            throw error;
        }
    },
};
