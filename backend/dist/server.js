"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const app_1 = __importDefault(require("./app"));
function createServer() {
    const server = app_1.default.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
    server.on("error", (error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
    return server;
}
if (require.main === module) {
    createServer();
}
