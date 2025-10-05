import request from "supertest";
import { Express } from "express";
import createApp from "../src/app";

let app: Express;

beforeAll(async () => {
    app = createApp;
});

describe("API documentation", () => {
    it("should redirect /api-docs to Swagger UI", async () => {
        const res = await request(app).get("/api-docs");

        expect(res.statusCode).toBe(301);
        expect(res.headers.location).toContain("/api-docs/");
    });

    it("should serve Swagger UI HTML", async () => {
        const res = await request(app).get("/api-docs/");

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("<html");
        expect(res.text).toMatch(/URL Shortener API Documentation/i);
    });
});
