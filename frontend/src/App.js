import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { Layout } from "./components/Layout";
import { BookList } from "./components/BookList";
function App() {
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(BrowserRouter, { children: _jsx(Layout, { children: _jsx(BookList, {}) }) })] }));
}
export default App;
