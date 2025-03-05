const bcrypt = require("bcrypt");

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
            title: "Benefits of Meal Prepping",
            author: "Van Nguyen",
            content: `Meal prepping is a powerful tool for anyone looking to maintain a healthy lifestyle or save time during the week. The benefits of meal prepping are vast and can make a significant impact on your overall health and well-being. 

            One of the key advantages of meal prepping is that it helps you control portion sizes, ensuring you're consuming the right amount of nutrients without overeating. By preparing your meals ahead of time, you can avoid unhealthy temptations and fast food, making it easier to stick to your dietary goals.

            Another benefit of meal prepping is time management. Instead of spending hours in the kitchen every day, meal prepping allows you to efficiently prepare all your meals for the week in one go. This saves valuable time and energy, leaving you with more time to focus on other aspects of your life.

            Lastly, meal prepping helps reduce food waste by allowing you to buy ingredients in bulk and plan meals around what you already have. This ensures you use all your groceries before they spoil and helps you save money in the long run.`,
            tags: ["Nutrition", "Meal Prep"]
        },
        {
            title: "Understanding caloric deficit",
            author: "Jane Doe",
            content: `A caloric deficit is a key concept in weight loss and refers to the state in which you consume fewer calories than your body needs to maintain its current weight. When you’re in a caloric deficit, your body starts to use stored fat for energy, leading to fat loss over time.

            The amount of calories you need to maintain your weight is determined by your Total Daily Energy Expenditure (TDEE), which includes your Basal Metabolic Rate (BMR) and the calories burned through physical activity. To achieve a caloric deficit, you must consume fewer calories than your TDEE.

            It's important to approach a caloric deficit in a sustainable way. Extreme calorie restriction can slow down your metabolism and lead to muscle loss, so it's recommended to aim for a modest deficit of around 500 calories per day. This typically results in a weight loss of about 1 pound per week, which is considered a healthy and sustainable rate.

            Remember, a caloric deficit alone won't guarantee success. Pairing it with a balanced diet that includes all the essential nutrients and regular exercise will help you achieve your weight loss goals while maintaining overall health.`,
            tags: ["Weight Management", "Nutrition"]
        },
        {
            title: "The Importance of Protein in Your Diet",
            author: "Van Nguyen",
            content: `Protein is one of the most important macronutrients for the body, playing a vital role in muscle growth, repair, and overall health. It’s often associated with building muscle, but protein is essential for so much more. It supports immune function, helps produce enzymes and hormones, and is involved in repairing tissues and cells.
    
                Including adequate protein in your diet is crucial, especially for those who are active or looking to lose weight. Protein helps keep you feeling full and satisfied, making it easier to stick to a healthy eating plan without feeling hungry all the time. It also helps preserve lean muscle mass during weight loss, ensuring that you lose fat and not muscle.
    
                Good sources of protein include lean meats, poultry, fish, eggs, dairy products, and plant-based options such as legumes, tofu, and quinoa. For those looking to build muscle or maintain their weight, it's recommended to consume protein at each meal to support muscle repair and growth.
    
                Remember, balance is key. While protein is essential, it’s important to include a variety of macronutrients in your diet, such as healthy fats and carbohydrates, to ensure you're meeting all your nutritional needs.`,
            tags: ["Nutrition", "Healthy Eating"]
        },
        {
            title: "Healthy Snack Ideas for Weight Management",
            author: "Emily Tran",
            content: `When it comes to weight management, choosing the right snacks can make a significant difference. Healthy snacks are a great way to keep your energy levels stable throughout the day and prevent overeating during main meals. The key is to choose snacks that are nutrient-dense and provide a good balance of protein, healthy fats, and fiber.
    
                Some great snack options include fresh fruits like apples or berries paired with a handful of nuts, which provide a satisfying mix of natural sugars and healthy fats. Greek yogurt with a drizzle of honey and a sprinkle of chia seeds is another excellent choice, offering a protein-packed snack that also contains probiotics for digestive health.
    
                If you're craving something savory, try roasted chickpeas, hummus with raw veggies, or a small portion of cheese with whole-grain crackers. These snacks are high in fiber and healthy fats, keeping you full and energized until your next meal.
    
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
            imageUrl: "http://example.com/eggcheesewrap.jpg",
            description: "A delicious wrap filled with scrambled eggs and melted cheese, perfect for a quick meal.",
            ingredients: ["2 eggs", "1 whole wheat tortilla (8-inch)", "1 slice of cheddar cheese", "1 tsp olive oil", "Salt and pepper", "Optional: salsa, spinach, avocado"],
            preference: ["vegetarian", "nut-free", "none"],
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
            preference: ["gluten-free", "nut-free", "none"],
            calories: 300,
            protein: 35,
            fat: 18,
            carbs: 10
        },
        {
            name: "Avocado Toast with Cherry Tomatoes",
            imageUrl: "http://example.com/avocadotoast.jpg",
            description: "A nutritious and delicious avocado toast topped with cherry tomatoes and a sprinkle of seasonings.",
            ingredients: ["1 slice whole-grain bread", "1/2 ripe avocado", "5 cherry tomatoes (halved)", "1/2 tsp olive oil", "Salt and pepper", "Optional: red pepper flakes, lemon juice"],
            preference: ["vegetarian", "vegan", "nut-free", "none"],
            calories: 250,
            protein: 6,
            fat: 15,
            carbs: 25
        },
        {
            name: "Quinoa & Black Bean Bowl",
            imageUrl: "http://example.com/quinoabowl.jpg",
            description: "A protein-packed quinoa bowl with black beans, colorful veggies, and a zesty lime dressing.",
            ingredients: ["1/2 cup cooked quinoa", "1/2 cup black beans (cooked or canned, rinsed)", "1/4 cup cherry tomatoes (halved)", "1/4 cup corn", "1 tbsp olive oil", "1 tbsp lime juice", "1/2 tsp cumin", "Salt and pepper to taste"],
            preference: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"],
            calories: 350,
            protein: 14,
            fat: 10,
            carbs: 50
        },
        {
            name: "Garlic Lemon Salmon with Roasted Vegetables",
            imageUrl: "http://example.com/garliclemonsalmon.jpg",
            description: "A flavorful and nutritious baked salmon dish with roasted vegetables, perfect for a healthy dinner.",
            ingredients: ["1 salmon fillet (4-6 oz)", "1 tbsp olive oil", "1 tbsp lemon juice", "1 clove garlic (minced)", "1/2 tsp dried oregano", "Salt and pepper to taste", "1/2 cup broccoli florets", "1/2 cup bell pepper (sliced)", "1/2 cup zucchini (sliced)"],
            preference: ["gluten-free", "nut-free", "none"],
            calories: 420,
            protein: 40,
            fat: 22,
            carbs: 15
        },
        {
            name: "Stir-Fried Tofu & Vegetables",
            imageUrl: "http://example.com/tofuveggiestirfry.jpg",
            description: "A delicious plant-based stir-fry with crispy tofu and colorful vegetables in a savory sauce.",
            ingredients: ["1/2 block firm tofu (cubed)", "1 tbsp soy sauce (or tamari for gluten-free)", "1 tsp sesame oil", "1/2 cup bell pepper (sliced)", "1/2 cup broccoli florets", "1/4 cup carrots (julienned)", "1 clove garlic (minced)", "1/2 tsp ginger (grated)", "1 tbsp olive oil"],
            preference: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"],
            calories: 350,
            protein: 25,
            fat: 18,
            carbs: 30
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
            securityAnswer: "Doggo",
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
            name: "Lily Walker",
            email: "lily@example.com",
            password: bcrypt.hashSync("lilyuser", 10),
            isAdmin: false,
            securityQuestion: "What is the name of the city where you were born?",
            securityAnswer: "Sydney",
            macroTracker: {
                age: 28,
                gender: "female",
                height: 160,
                weight: 60,
                activity: "extra active",
                goal: "maintain weight",
                calorie: 2241,
                protein: 168,
                fat: 87,
                carbs: 196
            },
            selectedMealPlan: null
        },
        {
            name: "James Patel",
            email: "james@example.com",
            password: bcrypt.hashSync("jamesuser", 10),
            isAdmin: false,
            securityQuestion: "What is the name of the city where you were born?",
            securityAnswer: "Melbourne",
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