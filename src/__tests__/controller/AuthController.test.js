const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const request = require('supertest');
const { app } = require("../../server");
const { User } = require("../../models/UserModel");

let userToken;

beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/server_test", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await mongoose.connection.dropDatabase();

    // Create a test user and admin user
    const hashedPassword = await bcrypt.hash("TestPassword123", 10);
    const hashedAnswer = await bcrypt.hash("TestAnswer", 10);

    testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        securityQuestion: "What is your mother’s maiden name?",
        securityAnswer: hashedAnswer,
    });

    // Create a mock user token
    process.env.JWT_SECRET = 'secret-key';
    userToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth Controller Tests", () => {

    // Get security questions
    it("should fetch security questions", async () => {
        const res = await request(app).get("/questions");
        expect(res.status).toBe(200);
        expect(res.body.securityQuestions).toBeInstanceOf(Array);
    });

    // Register user successfully
    it("should register a new user", async () => {
        const newUser = {
            name: "New User",
            email: "newuser@example.com",
            password: "NewUser123!",
            securityQuestion: "What was the name of your first pet?",
            securityAnswer: "Fluffy",
        };

        const res = await request(app).post("/register").send(newUser);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    // Register duplicate user
    it("should return 400 for duplicate user registration", async () => {
        const duplicateUser = {
            name: "Test User",
            email: "test@example.com",
            password: "ValidPassword123!",
            securityQuestion: "What is the name of the city where you were born?",
            securityAnswer: "Sydney",
        };

        const res = await request(app).post("/register").send(duplicateUser);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

    // Register with a short password
    it("should return 400 for short password", async () => {
        const shortUser = {
            name: "Short User",
            email: "short@example.com",
            password: "short",
            securityQuestion: "What was the name of your first pet?",
            securityAnswer: "Pizza",
        };

        const res = await request(app).post("/register").send(shortUser);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password must be at least 8 characters long.");
    });

    // Login with valid credentials
    it("should login successfully", async () => {
        const loginData = { email: "test@example.com", password: "TestPassword123" };

        const res = await request(app).post("/login").send(loginData);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.token).toBeDefined();
    });

    // Login with incorrect credentials
    it("should return 401 for invalid credentials", async () => {
        const wrongLoginData = { email: "test@example.com", password: "WrongPassword" };

        const res = await request(app).post("/login").send(wrongLoginData);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

    // Get security question for a valid user
    it("should retrieve security question for existing user", async () => {
        const res = await request(app).post("/question").send({ email: "test@example.com" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Security question retrieved");
        expect(res.body.securityQuestion).toBe("What is your mother’s maiden name?");
    });

    // Get security question for a non-existent user
    it("should return 404 for non-existent user", async () => {
        const res = await request(app).post("/question").send({ email: "doesnotexist@example.com" });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    // Answer security question correctly
    it("should verify correct security answer", async () => {
        const res = await request(app).post("/answer").send({
            email: "test@example.com",
            securityAnswer: "TestAnswer",
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Answer verified. Proceed to reset password");
    });

    // Answer security question incorrectly
    it("should return 400 for incorrect security answer", async () => {
        const res = await request(app).post("/answer").send({
            email: "test@example.com",
            securityAnswer: "WrongAnswer",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Incorrect answer");
    });

    // Reset password successfully
    it("should reset password successfully", async () => {
        const res = await request(app).post("/reset-password").send({
            email: "test@example.com",
            newPassword: "NewValidPassword123!",
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Password reset successful");
    });

    // Reset password with a short password
    it("should return 400 for short password reset", async () => {
        const res = await request(app).post("/reset-password").send({
            email: "test@example.com",
            newPassword: "short",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password must be at least 8 characters long.");
    });
}, 10000);
