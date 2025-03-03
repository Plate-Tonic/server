const { dbConnect, dbDisconnect } = require("./database");
const { BlogPost } = require("../models/BlogPostModel");
const { MealPlan } = require("../models/MealPlanModel");
const { User } = require("../models/UserModel");

async function seed() {
    await dbConnect();
    console.log("Database connected. Seeding now.");

    // Seed blog posts
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

    for (let blog of blogPosts) {
        try {
            const blogPost = await BlogPost.create(blog);
            console.log(`Created blog post: ${blogPost.title}`);
        } catch (err) {
            console.error(`Error creating blog post: ${err.message}`);
        }
    }
    // Seed meal items
    const mealItems = [
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

    const mealItemIds = [];
    for (let meal of mealItems) {
        try {
            const mealItem = await MealPlan.create(meal);
            console.log(`Created meal item: ${mealItem.name}`);
            mealItemIds.push(mealItem._id);
        } catch (err) {
            console.error(`Error creating meal item: ${err.message}`);
        }
    }

    // Seed users
    const users = [
        {
            name: "Veronica Chung",
            email: "admin@platetonic.com",
            password: "admintest",
            isAdmin: true,
            macroTracker: {
                age: 28,
                gender: "female",
                height: 167,
                weight: 50,
                activity: "moderately active",
                goal: "maintain weight",
                calorie: 1926,
                protein: 144,
                fat: 75,
                carbs: 169
            },
            selectedMealPlan: [mealItemIds[0]._id, mealItemIds[1]._id]
        },
        {
            name: "James Patel",
            email: "user@platetonic.com",
            password: "usertest",
            isAdmin: false,
            macroTracker: {
                age: 37,
                gender: "male",
                height: 175,
                weight: 80,
                activity: "sedentary",
                goal: "lose weight",
                calorie: 2057,
                protein: 154,
                fat: 80,
                carbs: 180
            },
            selectedMealPlan: null
        }
    ];

    for (let user of users) {
        try {
            const newUser = await User.create(user);
            console.log(`Created user: ${newUser.name}`);
        } catch (err) {
            console.error(`Error creating user: ${err.message}`);
        }
    }

    console.log("Seeding complete. Disconnecting.");

    await dbDisconnect();
    console.log("Database disconnected.");
};

seed();