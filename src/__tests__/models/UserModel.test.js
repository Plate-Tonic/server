const mongoose = require("mongoose");
const { User } = require("../../models/UserModel");
const { MealPlan } = require("../../models/MealPlanModel");
const { securityQuestions } = require("../../utils/securityQuestions");

beforeAll(async () => { // Connect to the test database
    await mongoose.connect("mongodb://127.0.0.1:27017/server", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();
});

afterAll(async () => { // Disconnect from the test database
    await mongoose.connection.close();
});

describe("User Model Structure", () => {
    let user;

    beforeEach(async () => {
        const mealItemIds = [
            { _id: 'mock-id-1' },
            { _id: 'mock-id-2' }
        ];

        user = new User({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
            isAdmin: false,
            securityQuestion: securityQuestions[0],
            securityAnswer: "My answer",
            macroTracker: {
                age: 30,
                gender: "male",
                height: 175,
                weight: 70,
                activity: "Moderately active (moderate exercise 3-5 days/week)",
                goal: "Maintain Weight",
                calories: 2000,
                protein: 100,
                fat: 50,
                carbs: 200
            },
            selectedMealPlan: [mealItemIds[0]._id, mealItemIds[1]._id]
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("should have the correct fields and types", () => {
        // Check the structure of the User model
        expect(user).toHaveProperty("name");
        expect(typeof user.name).toBe("string");

        expect(user).toHaveProperty("email");
        expect(typeof user.email).toBe("string");

        expect(user).toHaveProperty("password");
        expect(typeof user.password).toBe("string");

        expect(user).toHaveProperty("isAdmin");
        expect(typeof user.isAdmin).toBe("boolean");

        expect(user).toHaveProperty("securityQuestion");
        expect(typeof user.securityQuestion).toBe("string");

        expect(user).toHaveProperty("securityAnswer");
        expect(typeof user.securityAnswer).toBe("string");

        expect(user).toHaveProperty("macroTracker");
        expect(user.macroTracker).toBeDefined();
        expect(typeof user.macroTracker).toBe("object");

        expect(user).toHaveProperty("selectedMealPlan");
        expect(Array.isArray(user.selectedMealPlan)).toBe(true);
    });

    it("should have correct structure for macroTracker", () => {
        // Check structure of macroTracker sub-document
        expect(user.macroTracker).toHaveProperty("age");
        expect(user.macroTracker.age).toBeDefined();
        expect(typeof user.macroTracker.age).toBe("number");

        expect(user.macroTracker).toHaveProperty("gender");
        expect(user.macroTracker.gender).toBeDefined();
        expect(typeof user.macroTracker.gender).toBe("string");

        expect(user.macroTracker).toHaveProperty("height");
        expect(user.macroTracker.height).toBeDefined();
        expect(typeof user.macroTracker.height).toBe("number");

        expect(user.macroTracker).toHaveProperty("weight");
        expect(user.macroTracker.weight).toBeDefined();
        expect(typeof user.macroTracker.weight).toBe("number");

        expect(user.macroTracker).toHaveProperty("activity");
        expect(user.macroTracker.activity).toBeDefined();
        expect(typeof user.macroTracker.activity).toBe("string");

        expect(user.macroTracker).toHaveProperty("goal");
        expect(user.macroTracker.goal).toBeDefined();
        expect(typeof user.macroTracker.goal).toBe("string");

        expect(user.macroTracker).toHaveProperty("calories");
        expect(user.macroTracker.calories).toBeDefined();
        expect(typeof user.macroTracker.calories).toBe("number");

        expect(user.macroTracker).toHaveProperty("protein");
        expect(user.macroTracker.protein).toBeDefined();
        expect(typeof user.macroTracker.protein).toBe("number");

        expect(user.macroTracker).toHaveProperty("fat");
        expect(user.macroTracker.fat).toBeDefined();
        expect(typeof user.macroTracker.fat).toBe("number");

        expect(user.macroTracker).toHaveProperty("carbs");
        expect(user.macroTracker.carbs).toBeDefined();
        expect(typeof user.macroTracker.carbs).toBe("number");
    });

    it("should have correct structure for selectedMealPlan", () => {
        // Check structure of selectedMealPlan array of objects
        expect(user.selectedMealPlan).toBeDefined();
        expect(Array.isArray(user.selectedMealPlan)).toBe(true);

        if (user.selectedMealPlan.length > 0) {
            const selectedMeal = user.selectedMealPlan[0];

            expect(selectedMeal).toHaveProperty("dietaryPreference");
            expect(typeof selectedMeal.dietaryPreference).toBe("string");

            expect(selectedMeal).toHaveProperty("_id");
            expect(mongoose.Types.ObjectId.isValid(selectedMeal._id)).toBe(true);
        }
    });
});