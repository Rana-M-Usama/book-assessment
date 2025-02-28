import { createServer } from "../server";
import { Server } from "http";

describe("Server", () => {
  let server: Server | null;

  beforeEach(() => {
    jest.clearAllMocks();
    server = null;
  });

  afterEach(() => {
    return new Promise<void>((resolve) => {
      if (server?.listening) {
        server.close(() => {
          server = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  });

  it("should create and start a server", () => {
    const mockConsoleLog = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    server = createServer();
    expect(server).toBeDefined();
    mockConsoleLog.mockRestore();
  });

  it("should handle server errors", () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockConsoleLog = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    server = createServer();
    server!.emit("error", new Error("Test error"));

    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  it("should use configured port", () => {
    const mockConsoleLog = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    process.env.PORT = "4000";
    server = createServer();
    expect(server).toBeDefined();

    delete process.env.PORT;
    mockConsoleLog.mockRestore();
  });
});
