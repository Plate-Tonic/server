require('dotenv').config();
const bcrypt = require("bcrypt");
const { dbConnect, dbDisconnect } = require("./database");
const { BlogPost } = require("../models/BlogPostModel");
const { MealPlan } = require("../models/MealPlanModel");
const { User } = require("../models/UserModel");

// Function to seed the database
async function seed() {
    await dbConnect();
    console.log("Database connected. Seeding now.");

    // Seed blog posts
    const blogPosts = [
        {
            title: "Benefits of Meal Prepping",
            author: "Van Nguyen",
            content: `Meal prepping is a powerful tool for anyone looking to maintain a healthy lifestyle or save time during the week. The benefits of meal prepping are vast and can make a significant impact on your overall health and well-being.\n\n
            One of the key advantages of meal prepping is that it helps you control portion sizes, ensuring you're consuming the right amount of nutrients without overeating. By preparing your meals ahead of time, you can avoid unhealthy temptations and fast food, making it easier to stick to your dietary goals.\n\n
            Another benefit of meal prepping is time management. Instead of spending hours in the kitchen every day, meal prepping allows you to efficiently prepare all your meals for the week in one go. This saves valuable time and energy, leaving you with more time to focus on other aspects of your life.\n\n
            Lastly, meal prepping helps reduce food waste by allowing you to buy ingredients in bulk and plan meals around what you already have. This ensures you use all your groceries before they spoil and helps you save money in the long run.`,
            tags: ["Nutrition", "Meal Prep"]
        },
        {
            title: "Understanding caloric deficit",
            author: "Jane Doe",
            content: `A caloric deficit is a key concept in weight loss and refers to the state in which you consume fewer calories than your body needs to maintain its current weight. When you’re in a caloric deficit, your body starts to use stored fat for energy, leading to fat loss over time.\n\n
            The amount of calories you need to maintain your weight is determined by your Total Daily Energy Expenditure (TDEE), which includes your Basal Metabolic Rate (BMR) and the calories burned through physical activity. To achieve a caloric deficit, you must consume fewer calories than your TDEE.\n\n
            It's important to approach a caloric deficit in a sustainable way. Extreme calorie restriction can slow down your metabolism and lead to muscle loss, so it's recommended to aim for a modest deficit of around 500 calories per day. This typically results in a weight loss of about 1 pound per week, which is considered a healthy and sustainable rate.\n\n
            Remember, a caloric deficit alone won't guarantee success. Pairing it with a balanced diet that includes all the essential nutrients and regular exercise will help you achieve your weight loss goals while maintaining overall health.`,
            tags: ["Weight Management", "Nutrition"]
        },
        {
            title: "The Importance of Protein in Your Diet",
            author: "Van Nguyen",
            content: `Protein is one of the most important macronutrients for the body, playing a vital role in muscle growth, repair, and overall health. It’s often associated with building muscle, but protein is essential for so much more. It supports immune function, helps produce enzymes and hormones, and is involved in repairing tissues and cells.\n\n
            Including adequate protein in your diet is crucial, especially for those who are active or looking to lose weight. Protein helps keep you feeling full and satisfied, making it easier to stick to a healthy eating plan without feeling hungry all the time. It also helps preserve lean muscle mass during weight loss, ensuring that you lose fat and not muscle.\n\n
            Good sources of protein include lean meats, poultry, fish, eggs, dairy products, and plant-based options such as legumes, tofu, and quinoa. For those looking to build muscle or maintain their weight, it's recommended to consume protein at each meal to support muscle repair and growth.\n\n
            Remember, balance is key. While protein is essential, it’s important to include a variety of macronutrients in your diet, such as healthy fats and carbohydrates, to ensure you're meeting all your nutritional needs.`,
            tags: ["Nutrition", "Healthy Eating"]
        },
        {
            title: "Healthy Snack Ideas for Weight Management",
            author: "Emily Tran",
            content: `When it comes to weight management, choosing the right snacks can make a significant difference. Healthy snacks are a great way to keep your energy levels stable throughout the day and prevent overeating during main meals. The key is to choose snacks that are nutrient-dense and provide a good balance of protein, healthy fats, and fiber.\n\n
            Some great snack options include fresh fruits like apples or berries paired with a handful of nuts, which provide a satisfying mix of natural sugars and healthy fats. Greek yogurt with a drizzle of honey and a sprinkle of chia seeds is another excellent choice, offering a protein-packed snack that also contains probiotics for digestive health.\n\n
            If you're craving something savory, try roasted chickpeas, hummus with raw veggies, or a small portion of cheese with whole-grain crackers. These snacks are high in fiber and healthy fats, keeping you full and energized until your next meal.\n\n
            When selecting snacks, aim for whole foods that are minimally processed and free from added sugars. Proper portion control is also important – even healthy snacks can add up in calories if consumed in large amounts. Keep your snacks balanced and satisfying, and they will contribute positively to your weight management goals.`,
            tags: ["Healthy Eating", "Weight Management"]
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
            description: `1. Heat a non-stick pan over medium heat and add 1 tsp of olive oil.\n\n
            2. Crack 2 eggs into the pan, season with salt and pepper, and scramble them until fully cooked.\n\n
            3. While the eggs cook, warm the whole wheat tortilla in the same pan for a few seconds.\n\n
            4. Place the scrambled eggs in the center of the warm tortilla and add a slice of cheddar cheese.\n\n
            5. Fold the tortilla over the eggs, making a wrap, and enjoy!\n\n
            Optional: Add salsa, spinach, or avocado for extra flavor!`,
            ingredients: ["2 eggs", "1 whole wheat tortilla (8-inch)", "1 slice of cheddar cheese", "1 tsp olive oil", "Salt and pepper", "Optional: salsa, spinach, avocado"],
            preference: ["vegetarian", "nut-free", "none"],
            calories: 350,
            protein: 20,
            fat: 21,
            carbs: 25,
            mealImage: `/uploads/egg_cheese_wrap.png`
        },
        {
            name: "Grilled Chicken Salad",
            description: `1. Grill the chicken breast on medium heat for 6-8 minutes per side, until fully cooked and golden brown.\n\n
            2. Slice the chicken into strips once it's done.\n\n
            3. In a large bowl, combine 2 cups of mixed salad greens, 1/2 cucumber (sliced), 1/2 bell pepper (sliced), 1/4 red onion (thinly sliced), and 1/4 avocado (sliced).\n\n
            4. Drizzle with 2 tbsp of olive oil and 1 tbsp of balsamic vinaigrette.\n\n
            5. Toss everything together, then top with the grilled chicken strips and serve immediately!`,
            ingredients: ["1 boneless, skinless chicken breast", "2 cups mixed salad greens", "1/2 cucumber", "1/2 bell pepper", "1/4 red onion", "1/4 avocado", "2 tbsp olive oil", "Salt and pepper", "1 tbsp balsamic vinaigrette"],
            preference: ["gluten-free", "nut-free", "none"],
            calories: 400,
            protein: 35,
            fat: 20,
            carbs: 15,
            mealImage: `/uploads/grilled_chicken_salad.png`
        },
        {
            name: "Avocado Toast with Cherry Tomatoes",
            description: `1. Toast the whole-grain bread until golden and crispy.\n\n
            2. While the bread is toasting, mash 1/2 ripe avocado in a bowl with salt, pepper, and optional red pepper flakes or lemon juice.\n\n
            3. Once the toast is ready, spread the mashed avocado evenly on top.\n\n
            4. Halve 5 cherry tomatoes and arrange them on top of the avocado.\n\n
            5. Drizzle with 1/2 tsp of olive oil, and season with salt and pepper to taste.\n\n
            Optional: Add red pepper flakes or a squeeze of lemon juice for extra flavor.`,
            ingredients: ["1 slice whole-grain bread", "1/2 ripe avocado", "5 cherry tomatoes (halved)", "1/2 tsp olive oil", "Salt and pepper", "Optional: red pepper flakes, lemon juice"],
            preference: ["vegetarian", "vegan", "nut-free", "none"],
            calories: 300,
            protein: 6,
            fat: 20,
            carbs: 25,
            mealImage: `/uploads/avocado_toast.png`
        },
        {
            name: "Quinoa & Black Bean Bowl",
            description: `1. Cook 1/2 cup of quinoa according to package instructions and set aside.\n\n
            2. In a large bowl, combine the cooked quinoa, 1/2 cup black beans (rinsed), 1/4 cup halved cherry tomatoes, and 1/4 cup corn.\n\n
            3. Drizzle with 1 tbsp of olive oil and 1 tbsp of lime juice.\n\n
            4. Add 1/2 tsp of cumin, salt, and pepper to taste, and toss everything together until well mixed.\n\n
            5. Serve in bowls and enjoy a nutritious, filling meal!`,
            ingredients: ["1/2 cup cooked quinoa", "1/2 cup black beans (cooked or canned, rinsed)", "1/4 cup cherry tomatoes (halved)", "1/4 cup corn", "1 tbsp olive oil", "1 tbsp lime juice", "1/2 tsp cumin", "Salt and pepper to taste"],
            preference: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"],
            calories: 400,
            protein: 15,
            fat: 14,
            carbs: 50,
            mealImage: `/uploads/quinoa_black_bean.png`
        },
        {
            name: "Garlic Lemon Salmon with Roasted Vegetables",
            description: `1. Preheat the oven to 400°F (200°C).\n\n
            2. Coat the salmon fillet with 1 tbsp of olive oil, 1 tbsp of lemon juice, 1 minced clove of garlic, 1/2 tsp of dried oregano, and season with salt and pepper.\n\n
            3. On a baking sheet, arrange the salmon fillet, 1/2 cup broccoli florets, 1/2 cup sliced bell pepper, and 1/2 cup sliced zucchini.\n\n
            4. Roast everything in the oven for 15-20 minutes, or until the salmon is cooked through and flakes easily with a fork.\n\n
            5. Serve the salmon with the roasted vegetables for a complete, healthy meal.`,
            ingredients: ["1 salmon fillet (4-6 oz)", "1 tbsp olive oil", "1 tbsp lemon juice", "1 clove garlic (minced)", "1/2 tsp dried oregano", "Salt and pepper to taste", "1/2 cup broccoli florets", "1/2 cup bell pepper (sliced)", "1/2 cup zucchini (sliced)"],
            preference: ["gluten-free", "nut-free", "none"],
            calories: 400,
            protein: 35,
            fat: 25,
            carbs: 15,
            mealImage: `/uploads/garlic_lemon_salmon.png`
        },
        {
            name: "Stir-Fried Tofu & Vegetables",
            description: `1. Heat 1 tbsp of sesame oil in a pan over medium heat. Add cubed firm tofu and fry until golden and crispy on all sides.\n\n
            2. Remove the tofu from the pan and set aside.\n\n
            3. In the same pan, stir-fry 1/2 cup sliced bell pepper, 1/2 cup broccoli florets, and 1/4 cup julienned carrots for 3-4 minutes until tender.\n\n
            4. Add 1 minced clove of garlic and 1/2 tsp of grated ginger, cooking for another minute.\n\n
            5. Return the tofu to the pan, add 1 tbsp of soy sauce, and stir everything together until the tofu is coated with the sauce. Serve hot!`,
            ingredients: ["1/2 block firm tofu (cubed)", "1 tbsp soy sauce (or tamari for gluten-free)", "1 tsp sesame oil", "1/2 cup bell pepper (sliced)", "1/2 cup broccoli florets", "1/4 cup carrots (julienned)", "1 clove garlic (minced)", "1/2 tsp ginger (grated)", "1 tbsp olive oil"],
            preference: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"],
            calories: 300,
            protein: 15,
            fat: 13,
            carbs: 20,
            mealImage: `/uploads/stir_fried_tofu.png`
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
            password: bcrypt.hashSync("admintest", 10),
            isAdmin: true,
            securityQuestion: "What was the name of your first pet?",
            securityAnswer: bcrypt.hashSync("Doggo", 10),
            macroTracker: {
                age: 28,
                gender: "female",
                height: 167,
                weight: 50,
                activity: "Moderately active (moderate exercise 3-5 days/week)",
                goal: "Maintain Weight",
                calories: 1926,
                protein: 144,
                fat: 75,
                carbs: 169
            },
            selectedMealPlan: [mealItemIds[0]._id, mealItemIds[1]._id]
        },
        {
            name: "Lily Walker",
            email: "lily@example.com",
            password: bcrypt.hashSync("lilyuser", 10),
            isAdmin: false,
            securityQuestion: "What is the name of the city where you were born?",
            securityAnswer: bcrypt.hashSync("Sydney", 10),
            macroTracker: {
                age: 28,
                weight: 60,
                height: 160,
                gender: "female",
                activity: "Super active (very intense exercise, physical job, etc.)",
                goal: "Maintain Weight",
                calories: 2241,
                protein: 168,
                fat: 87,
                carbs: 196
            },
            selectedMealPlan: []
        },
        {
            name: "James Patel",
            email: "james@example.com",
            password: bcrypt.hashSync("jamesuser", 10),
            isAdmin: false,
            securityQuestion: "What is the name of the city where you were born?",
            securityAnswer: bcrypt.hashSync("Melbourne", 10),
            macroTracker: {
            },
            selectedMealPlan: []
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