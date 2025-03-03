const { dbConnect, dbDisconnect } = require("./database");
const { createBlogPost } = require("../controllers/BlogPostController");
const { MealPlan } = require("../models/MealPlanModel");

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
            name: "Egg & Cheese Wrap",
            imageUrl: "http://example.com/eggcheesewrap.jpg",
            description: "A delicious wrap filled with scrambled eggs and melted cheese, perfect for a quick meal.",
            ingredients: ["2 eggs", "1 whole wheat tortilla (8-inch)", "1 slice of cheddar cheese", "1 tsp olive oil", "Salt and pepper", "Optional: salsa, spinach, avocado"],
            preference: ["vegetarian", "nut-free"],
            calories: 350,
            protein: 22,
            fat: 21,
            carbs: 20
        },
        {
            name: "Grilled Chicken Salad",
            imageUrl: "",
            description: "A refreshing and nutritious salad topped with grilled chicken breast, fresh vegetables, and a light balsamic vinaigrette.",
            ingredients: ["1 boneless, skinless chicken breast", "2 cups mixed salad greens", "1/2 cucumber", "1/2 bell pepper", "1/4 red onion", "1/4 avocado", "2 tbsp olive oil", "Salt and pepper", "1 tbsp balsamic vinaigrette"],
            preference: ["gluten-free", "nut-free"],
            calories: 300,
            protein: 35,
            fat: 18,
            carbs: 10
        }
    ];

    for (let meal of mealPlans) {
        try {
            const mealItem = await MealPlan.create(meal);
            console.log(`Created meal item: ${mealItem.name}`);
        } catch (err) {
            console.error(`Error creating meal item: ${err.message}`);
        }
    }

    console.log("Seeding complete. Disconnecting.");

    await dbDisconnect();
    console.log("Database disconnected.");
};

seed();