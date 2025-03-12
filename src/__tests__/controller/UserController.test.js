const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const request = require('supertest');
const { app } = require('../../server');
const { User } = require('../../models/UserModel');
const { MealPlan } = require('../../models/MealPlanModel');
const { calculateCalories, calculateProtein, calculateFat, calculateCarbs } = require('../../utils/calculator');

let adminToken;
let userToken;
let userId;
let adminId;
let mealPlan1;
let mealPlan2;

beforeAll(async () => {
    // Create a test user and admin user
    const hashedPassword = await bcrypt.hash("TestPassword123", 10);
    const hashedAnswer = await bcrypt.hash("TestAnswer", 10);

    // Setup mock users and meal plans
    const adminUser = {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
        securityQuestion: "What is your mother’s maiden name?",
        securityAnswer: hashedAnswer,
    };

    const regularUser = {
        name: "Regular User",
        email: "user@example.com",
        password: hashedPassword,
        isAdmin: false,
        securityQuestion: "What is your mother’s maiden name?",
        securityAnswer: hashedAnswer,
        macroTracker: {
            age: 25,
            gender: 'male',
            height: 175,
            weight: 70,
            activity: "Moderately active (moderate exercise 3-5 days/week)",
            goal: "Gain Muscle",
            calories: 2594,
            protein: 195,
            fat: 101,
            carbs: 227
        }
    };

    // Connect to test DB
    await mongoose.connect("mongodb://127.0.0.1:27017/server_test", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();

    // Create mock users
    const createdAdmin = await User.create(adminUser);
    const createdUser = await User.create(regularUser);

    adminId = createdAdmin._id;
    userId = createdUser._id;

    // Create a mock meal plan
    mealPlan1 = await MealPlan.create({
        name: "Vegan Meal Plan",
        description: "A vegan-friendly meal plan",
        ingredients: ["Tofu", "Rice", "Spinach", "Avocado"], // Example ingredients
        preference: ["vegan"], // Add preference field
        carbs: 50,
        fat: 20,
        protein: 30,
        calories: 600,
        mealImage: "https://example.com/meal.jpg"
    });

    mealPlan2 = await MealPlan.create({
        name: "Gluten-Free Meal Plan",
        description: "A gluten-free meal plan",
        ingredients: ["Chicken", "Quinoa", "Broccoli", "Almonds"], // Example ingredients
        preference: ["gluten-free"], // Add preference field
        carbs: 60,
        fat: 15,
        protein: 35,
        calories: 650,
        mealImage: "https://example.com/meal2.jpg"
    });

    // Add meal plan to regular user
    await User.findByIdAndUpdate(userId, { selectedMealPlan: [mealPlan1._id] });

    // Create mock tokens
    process.env.JWT_SECRET = 'secret-key';
    adminToken = jwt.sign({ userId: adminId, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    userToken = jwt.sign({ userId: userId, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });


    console.log('User ID:', userId); // Log the user ID being used
    console.log('Token:', userToken); // Log the token being used
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Controller Tests', () => {
    // Test GET user by ID
    it('should fetch user by ID', async () => {
        const res = await request(app)
            .get(`/user/${userId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User retrieved successfully');
        expect(res.body.data._id).toBe(userId.toString());
    });

    it('should return not found for invalid user ID', async () => {
        const invalidUserId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/user/${invalidUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe(`User ID ${invalidUserId} not found`);
    });

    // Test update user profile
    it('should update user name', async () => {
        const updatedName = { name: 'Updated Name' };
        const res = await request(app)
            .put(`/user/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(updatedName);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Name updated successfully');
    });

    it('should return forbidden when updating other user profile', async () => {
        const res = await request(app)
            .put(`/user/${adminId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'New Name' });

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Forbidden: You can only update your own profile');
    });

    // Test add meal plan
    it('should add meal plan to user', async () => {
        const res = await request(app)
            .post(`/user/${userId}/meal-plan`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ selectedMealPlan: [mealPlan2._id] });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Meal item added successfully');
        expect(res.body.data.selectedMealPlan).toContain(mealPlan2._id.toString());
    });

    // Test delete meal plan
    it('should delete meal plan from user', async () => {
        const res = await request(app)
            .delete(`/user/${userId}/meal-plan/${mealPlan2._id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Meal item deleted successfully');
    });

    // Test delete user profile (admin only)
    it('should delete user by ID (admin)', async () => {
        const res = await request(app)
            .delete(`/user/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`User ${userId} deleted successfully`);
    });

    it('should return forbidden for non-admin when deleting a user', async () => {
        const res = await request(app)
            .delete(`/user/${userId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Forbidden: Only admins can delete users');
    });
});
