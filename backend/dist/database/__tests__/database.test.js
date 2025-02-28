"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
describe("Database", () => {
    let mockConnect;
    beforeEach(() => {
        jest.resetModules();
        mockConnect = jest.fn();
    });
    afterEach(() => {
        jest.resetModules();
    });
    it("should connect to the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockConsoleLog = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });
        expect(database_1.prisma).toBeDefined();
        yield expect((0, database_1.connectDatabase)()).resolves.not.toThrow();
        expect(mockConsoleLog).toHaveBeenCalledWith("Database connected successfully");
        mockConsoleLog.mockRestore();
    }));
    it("should disconnect from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, database_1.disconnectDatabase)()).resolves.not.toThrow();
    }));
    it("should handle connection errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockConnect = jest.spyOn(database_1.prisma, "$connect");
        mockConnect.mockRejectedValueOnce(new Error("Connection failed"));
        const mockExit = jest
            .spyOn(process, "exit")
            .mockImplementation(() => undefined);
        const mockConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });
        yield (0, database_1.connectDatabase)();
        expect(mockConsoleError).toHaveBeenCalledWith("Database connection failed:", expect.any(Error));
        expect(mockExit).toHaveBeenCalledWith(1);
        mockConnect.mockRestore();
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
    }));
    it("should handle module execution", () => {
        const mockConsoleLog = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });
        // Mock PrismaClient before requiring the module
        const mockPrismaClient = jest.fn().mockImplementation(() => ({
            $connect: mockConnect,
        }));
        jest.mock("@prisma/client", () => ({
            PrismaClient: mockPrismaClient,
        }));
        // Mock process.env to simulate direct execution
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = "test";
        jest.isolateModules(() => {
            // Import will trigger the module code
            const { connectDatabase } = require("../database");
            connectDatabase();
        });
        // Restore env
        process.env.NODE_ENV = originalEnv;
        // Verify the database was initialized
        expect(mockPrismaClient).toHaveBeenCalled();
        expect(mockConnect).toHaveBeenCalled();
        mockConsoleLog.mockRestore();
    });
});
