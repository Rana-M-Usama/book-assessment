"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
describe("Server", () => {
    let server;
    beforeEach(() => {
        jest.clearAllMocks();
        server = null;
    });
    afterEach(() => {
        return new Promise((resolve) => {
            if (server === null || server === void 0 ? void 0 : server.listening) {
                server.close(() => {
                    server = null;
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    });
    it("should create and start a server", () => {
        const mockConsoleLog = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });
        server = (0, server_1.createServer)();
        expect(server).toBeDefined();
        mockConsoleLog.mockRestore();
    });
    it("should handle server errors", () => {
        const mockExit = jest
            .spyOn(process, "exit")
            .mockImplementation(() => undefined);
        const mockConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });
        const mockConsoleLog = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });
        server = (0, server_1.createServer)();
        server.emit("error", new Error("Test error"));
        expect(mockConsoleError).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
        mockConsoleLog.mockRestore();
    });
    it("should use configured port", () => {
        const mockConsoleLog = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });
        process.env.PORT = "4000";
        server = (0, server_1.createServer)();
        expect(server).toBeDefined();
        delete process.env.PORT;
        mockConsoleLog.mockRestore();
    });
});
