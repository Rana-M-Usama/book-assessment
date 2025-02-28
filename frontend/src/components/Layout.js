import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, AppBar, Toolbar, Typography, Container } from "@mui/material";
export const Layout = ({ children }) => {
    return (_jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(AppBar, { position: "static", children: _jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 }, children: "Book Management" }) }) }), _jsx(Container, { maxWidth: "lg", sx: { mt: 4 }, children: children })] }));
};
