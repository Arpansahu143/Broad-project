import request from "supertest";
import app from "../app.js";
import prisma from "../core/prisma/prisma.js";

// Unique per test run so repeated runs never collide on the unique
// email constraint, and so tests never touch real seeded accounts.
const testEmail = `smoke.test.${Date.now()}@example.com`;
const testPassword = "SmokeTest123";
const newPassword = "SmokeTestNew123";

let accessToken;
let userId;

describe("Auth flow", () => {

    afterAll(async () => {
        // Clean up whatever this run created, so tests never leave
        // permanent junk in the database.
        if (userId) {
            await prisma.refreshToken.deleteMany({ where: { userId } });
            await prisma.user.delete({ where: { id: userId } }).catch(() => {});
        }
        await prisma.$disconnect();
    });

    test("register creates a STUDENT by default", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "Smoke",
                lastName: "Test",
                email: testEmail,
                password: testPassword,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.role).toBe("STUDENT");

        userId = res.body.data.user.id;
    });

    test("login with wrong password is rejected generically", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: testEmail, password: "WrongPassword123" });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        // Must not leak whether the email exists vs password is wrong.
        expect(res.body.message.toLowerCase()).toContain("invalid");
    });

    test("login with correct credentials succeeds and issues tokens", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(200);
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();

        accessToken = res.body.data.accessToken;
    });

    test("a STUDENT token is rejected on an ADMIN-only route", async () => {
        const res = await request(app)
            .post("/api/v1/departments")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "Should Not Be Created", code: "NOPE" });

        expect(res.status).toBe(403);
    });

    test("a request with no token is rejected on a protected route", async () => {
        const res = await request(app).get("/api/v1/students");

        expect(res.status).toBe(401);
    });

    test("change-password rejects an incorrect current password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/change-password")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ currentPassword: "TotallyWrong123", newPassword });

        expect(res.status).toBe(401);
    });

    test("change-password succeeds with the correct current password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/change-password")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ currentPassword: testPassword, newPassword });

        expect(res.status).toBe(200);
    });

    test("login works with the new password after changing it", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: testEmail, password: newPassword });

        expect(res.status).toBe(200);
    });
});
