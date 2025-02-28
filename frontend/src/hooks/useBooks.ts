import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  // add other book properties
}

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<Book[]> => {
      const { data } = await axios.get("/api/books");
      return data;
    },
  });
}; 