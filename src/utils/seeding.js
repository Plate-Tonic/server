const { dbConnect, dbDisconnect } = require("./database");
const { createBlogPost } = require("../controllers/BlogPostController");

async function seed() {
    await dbConnect();
    console.log("Database connected. Seeding now.");

    await createBlogPost("Blog Post 1", "Content for blog post 1.");
    console.log("Seeding complete. Disconnecting.");

    await dbDisconnect();
    console.log("Database disconnected.");
};

seed();