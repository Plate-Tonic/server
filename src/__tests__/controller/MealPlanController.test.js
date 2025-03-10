const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { app } = require('../../server');
const { MealPlan } = require('../../models/MealPlanModel');

let adminToken;
let mealPlanId;
let mealPlanData;

beforeAll(async () => {
    mealPlanData = {
        name: "Vegan Protein Packed Meal",
        description: "A high protein, vegan meal plan.",
        ingredients: ["Tofu", "Spinach", "Lentils", "Chickpeas"],
        preference: ["vegan"],
        calories: 200,
        protein: 40,
        fat: 15,
        carbs: 60,
        mealImage: "uploads/mockedMealImage.jpg"
    };

    // Connect to test DB
    await mongoose.connect("mongodb://127.0.0.1:27017/server_test", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();

    // Create a mock admin token
    process.env.JWT_SECRET = 'secret-key';
    adminToken = jwt.sign({ userId: 'mockUserId', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a meal plan to be used in update and delete tests
    const mealPlan = await MealPlan.create(mealPlanData);
    mealPlanId = mealPlan._id.toString();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('MealPlan Controller Tests', () => {
    // Helper function to create mock file
    const createMockFile = () => {
        const mockFileBuffer = Buffer.from('file data representing meal image content');
        return {
            fieldname: 'mealImage',
            originalname: 'mockedMealImage.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: mockFileBuffer,
            size: mockFileBuffer.length,
        };
    };

    // Test GET all meal plans
    it('should fetch all meal plans', async () => {
        const res = await request(app).get('/meal-plan');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Meal items retrieved successfully');
        expect(res.body.data).toBeInstanceOf(Array);
    });

    // Test GET a single meal plan by ID
    it('should fetch a meal plan by ID', async () => {
        const res = await request(app).get(`/meal-plan/${mealPlanId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Meal item retrieved successfully');
        expect(res.body.data._id).toBe(mealPlanId);
    });

    it('should return 404 if meal plan not found by ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/meal-plan/${nonExistentId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe(`Meal ID ${nonExistentId} not found`);
    });

    // Test CREATE meal plan
    it('should create a new meal plan (with admin)', async () => {
        const newMealPlan = { ...mealPlanData, name: "New Vegan Meal Plan" };
        const mockFile = createMockFile();

        const res = await request(app)
            .post('/meal-plan')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', newMealPlan.name)
            .field('description', newMealPlan.description)
            .field('ingredients', JSON.stringify(newMealPlan.ingredients))
            .field('preference', newMealPlan.preference)
            .field('calories', newMealPlan.calories)
            .field('protein', newMealPlan.protein)
            .field('fat', newMealPlan.fat)
            .field('carbs', newMealPlan.carbs)
            .attach('mealImage', mockFile.buffer, mockFile.originalname);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('New meal item created');
        expect(res.body.data.name).toBe(newMealPlan.name);
        expect(res.body.data.mealImage).toBeDefined();
    });

    it('should return 403 if not admin when creating meal plan', async () => {
        const nonAdminToken = jwt.sign({ userId: 'mockUserId', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newMealPlan = { ...mealPlanData, name: "Non-Admin Meal Plan" };
        const mockFile = createMockFile();

        const res = await request(app)
            .post('/meal-plan')
            .set('Authorization', `Bearer ${nonAdminToken}`)
            .field('name', newMealPlan.name)
            .field('description', newMealPlan.description)
            .field('ingredients', JSON.stringify(newMealPlan.ingredients))
            .field('preference', newMealPlan.preference)
            .field('calories', newMealPlan.calories)
            .field('protein', newMealPlan.protein)
            .field('fat', newMealPlan.fat)
            .field('carbs', newMealPlan.carbs)
            .attach('mealImage', mockFile.buffer, mockFile.originalname);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Forbidden: Only admins can create meal items');
    });

    it('should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/meal-plan')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: "Incomplete Meal Plan" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });

    it('should return 409 if meal plan with duplicate name exists', async () => {
        const duplicateMealPlan = { ...mealPlanData, name: "Vegan Protein Packed Meal" };

        const mockFile = createMockFile();

        const res = await request(app)
            .post('/meal-plan')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', duplicateMealPlan.name)
            .field('description', duplicateMealPlan.description)
            .field('ingredients', JSON.stringify(duplicateMealPlan.ingredients))
            .field('preference', duplicateMealPlan.preference)
            .field('calories', duplicateMealPlan.calories)
            .field('protein', duplicateMealPlan.protein)
            .field('fat', duplicateMealPlan.fat)
            .field('carbs', duplicateMealPlan.carbs)
            .attach('mealImage', mockFile.buffer, mockFile.originalname);

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Meal item Vegan Protein Packed Meal already exists');
    });

    // Test UPDATE meal plan
    it('should update an existing meal plan (with admin)', async () => {
        const updatedMealPlan = { ...mealPlanData, name: "Updated Vegan Protein Packed Meal" };
        const mockFile = createMockFile();

        const res = await request(app)
            .put(`/meal-plan/${mealPlanId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', updatedMealPlan.name)
            .field('description', updatedMealPlan.description)
            .field('ingredients', JSON.stringify(updatedMealPlan.ingredients))
            .field('preference', updatedMealPlan.preference)
            .field('calories', updatedMealPlan.calories)
            .field('protein', updatedMealPlan.protein)
            .field('fat', updatedMealPlan.fat)
            .field('carbs', updatedMealPlan.carbs)
            .attach('mealImage', mockFile.buffer, mockFile.originalname);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`Meal item ${updatedMealPlan.name} updated successfully`);
        expect(res.body.data.name).toBe(updatedMealPlan.name);

        // Store the updated name in a variable (for DELETE test)
        currentName = updatedMealPlan.name;
    });

    it('should return 403 if not admin when updating meal plan', async () => {
        const nonAdminToken = jwt.sign({ userId: 'mockUserId', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const updatedMealPlan = { ...mealPlanData, name: "Non-Admin Update" };

        const res = await request(app)
            .put(`/meal-plan/${mealPlanId}`)
            .set('Authorization', `Bearer ${nonAdminToken}`)
            .send(updatedMealPlan);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Forbidden: Only admins can update meal items');
    });

    it('should return 409 if updating to a duplicate meal plan name', async () => {
        const duplicateMealPlan = await MealPlan.create({ ...mealPlanData, name: "Another Vegan Meal Plan" });

        const updatedMealPlan = { name: "Another Vegan Meal Plan" };

        const res = await request(app)
            .put(`/meal-plan/${mealPlanId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatedMealPlan);

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Meal item Another Vegan Meal Plan already exists');
    });

    // Test DELETE meal plan
    it('should delete an existing meal plan (with admin)', async () => {
        const res = await request(app)
            .delete(`/meal-plan/${mealPlanId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`Meal item ${currentName} deleted successfully`);
    });

    it('should return 403 if not admin when deleting meal plan', async () => {
        const nonAdminToken = jwt.sign({ userId: 'mockUserId', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .delete(`/meal-plan/${mealPlanId}`)
            .set('Authorization', `Bearer ${nonAdminToken}`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Forbidden: Only admins can delete meal items');
    });
});
