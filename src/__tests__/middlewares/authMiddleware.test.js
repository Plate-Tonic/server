require('dotenv').config();
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/authMiddleware"); // Updated path to authMiddleware

// Set up a mock Express app
const app = express();
app.use(express.json());

// Dummy route to test middleware
app.get("/secure", validateToken, (req, res) => {
    res.status(200).json({ message: "Success" });
});

describe("validateToken Middleware", () => {
    let token;

    beforeEach(() => {
        // Create a valid token for testing
        token = jwt.sign({ userId: "12345", isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app).get("/secure");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Access denied. No token provided.");
    });

    it("should return 400 if the token is invalid", async () => {
        const res = await request(app).get("/secure").set("Authorization", "Bearer invalid_token");
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid token.");
    });

    it("should return 400 if user data is missing in the token", async () => {
        // Create a token without user data
        const invalidToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        const res = await request(app).get("/secure").set("Authorization", `Bearer ${invalidToken}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User data is missing in the token.");
    });

    it("should allow access if the token is valid and contains user data", async () => {
        const res = await request(app).get("/secure").set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success");
    });
});
