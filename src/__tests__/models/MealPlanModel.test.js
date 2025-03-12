const mongoose = require("mongoose");
const { MealPlan } = require("../../models/MealPlanModel");

beforeAll(async () => { // Connect to the test database
    await mongoose.connect("mongodb://127.0.0.1:27017/server", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();
});

afterAll(async () => { // Disconnect from the test database
    await mongoose.connection.close();
});

describe("MealPlan Model Structure", () => {
    let mealPlan;

    beforeEach(async () => {
        mealPlan = new MealPlan({
            name: "Vegan Protein Packed Meal",
            description: "A high protein, vegan meal plan.",
            ingredients: ["Tofu", "Spinach", "Lentils", "Chickpeas"],
            preference: ["vegan"],
            calories: 200,
            protein: 40,
            fat: 15,
            carbs: 60,
            mealImage: "https://example.com/meal.jpg"
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should have the correct fields and types", () => {
        // Check the structure of the MealPlan model
        expect(mealPlan).toHaveProperty("name");
        expect(typeof mealPlan.name).toBe("string");

        expect(mealPlan).toHaveProperty("description");
        expect(typeof mealPlan.description).toBe("string");

        expect(mealPlan).toHaveProperty("ingredients");
        expect(Array.isArray(mealPlan.ingredients)).toBe(true);
        expect(mealPlan.ingredients.every(item => typeof item === "string")).toBe(true);

        expect(mealPlan).toHaveProperty("preference");
        expect(Array.isArray(mealPlan.preference)).toBe(true);
        expect(mealPlan.preference.every(item => ["vegetarian", "vegan", "gluten-free", "nut-free", "none"].includes(item))).toBe(true);

        expect(mealPlan).toHaveProperty("calories");
        expect(typeof mealPlan.calories).toBe("number");

        expect(mealPlan).toHaveProperty("protein");
        expect(typeof mealPlan.protein).toBe("number");

        expect(mealPlan).toHaveProperty("fat");
        expect(typeof mealPlan.fat).toBe("number");

        expect(mealPlan).toHaveProperty("carbs");
        expect(typeof mealPlan.carbs).toBe("number");

        expect(mealPlan).toHaveProperty("mealImage");
        expect(typeof mealPlan.mealImage).toBe("string");
    });

    it("should validate preference array correctly", () => {
        // Check the preference array only contains valid values
        const validPreferences = ["vegetarian", "vegan", "gluten-free", "nut-free", "none"];
        mealPlan.preference.forEach(pref => {
            expect(validPreferences).toContain(pref);
        });
    });
});
