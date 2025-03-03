const { dbConnect, dbDisconnect } = require("./database");
const { createBlogPost } = require("../controllers/BlogPostController");
const { createMealPlan } = require("../controllers/MealPlanController");

async function seed() {
    await dbConnect();
    console.log("Database connected. Seeding now.");

    const blogPosts = [
        {
            title: "Blog Post 1",
            author: "JohnDoe",
            content: "Content for blog post 1.",
            tags: ["tag1", "tag2"]
        },
        {
            title: "Blog Post 2",
            author: "JaneDoe",
            content: "Content for blog post 2.",
            tags: ["tag1", "tag3"]
        }
    ];

    for (let post of blogPosts) {
        await createBlogPost(post.title, post.author, post.content, post.tags);
    }

    const mealPlans = [
        {
            name: "Meal Plan 1",
            imageUrl: null,
            description: "Description for meal plan 1.",
            ingredients: ["ingredient1", "ingredient2", "ingredient 3"],
            allergens: ["vegetarian"],
            calories: 200,
            protein: 20,
            fat: 10,
            carbs: 30,
        },
        {
            name: "Meal Plan 2",
            imageUrl: null,
            description: "Description for meal plan 2.",
            ingredients: ["ingredient1", "ingredient2"],
            allergens: ["none"],
            calories: 300,
            protein: 30,
            fat: 15,
            carbs: 40,
        }
    ];

    for (let meal of mealPlans) {
        await createMealPlan(meal.name, meal.imageUrl, meal.description, meal.ingredients, meal.allergens, meal.calories, meal.protein, meal.fat, meal.carbs);
    }

    console.log("Seeding complete. Disconnecting.");

    await dbDisconnect();
    console.log("Database disconnected.");
};

seed();