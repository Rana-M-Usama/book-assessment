import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { Layout } from "./components/Layout";
import { BookList } from "./components/BookList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <BookList />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
