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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe("App", () => {
    it("should handle 404 errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/nonexistent-route");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: "error",
            message: "Not found",
        });
    }));
    it("should handle CORS", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .options("/api/books")
            .set("Origin", "http://localhost:3000");
        expect(response.headers["access-control-allow-origin"]).toBe("*");
        expect(response.headers["access-control-allow-methods"]).toBeDefined();
    }));
    it("should parse JSON bodies", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/books")
            .send({ title: "Test" });
        expect(response.status).toBe(400); // Validation error, but proves JSON parsing works
    }));
    it("should serve swagger documentation", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/api-docs/swagger.json");
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    }));
});
