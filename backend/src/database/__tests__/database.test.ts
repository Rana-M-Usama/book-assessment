import { prisma, connectDatabase, disconnectDatabase } from "../database";

describe("Database", () => {
  let mockConnect: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    mockConnect = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should connect to the database", async () => {
    const mockConsoleLog = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    expect(prisma).toBeDefined();
    await expect(connectDatabase()).resolves.not.toThrow();

    expect(mockConsoleLog).toHaveBeenCalledWith(
      "Database connected successfully"
    );
    mockConsoleLog.mockRestore();
  });

  it("should disconnect from the database", async () => {
    await expect(disconnectDatabase()).resolves.not.toThrow();
  });

  it("should handle connection errors", async () => {
    const mockConnect = jest.spyOn(prisma, "$connect");
    mockConnect.mockRejectedValueOnce(new Error("Connection failed"));

    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await connectDatabase();

    expect(mockConsoleError).toHaveBeenCalledWith(
      "Database connection failed:",
      expect.any(Error)
    );
    expect(mockExit).toHaveBeenCalledWith(1);

    mockConnect.mockRestore();
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  it("should handle module execution", () => {
    const mockConsoleLog = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

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
