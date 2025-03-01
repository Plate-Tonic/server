const { dbConnect, dbDisconnect } = require("./database");
const { createBlogPost } = require("../controllers/BlogPostController");

async function seed() {
    await dbConnect();
    console.log("Database connected. Seeding now.");

    await createBlogPost("Blog Post 1", "JohnDoe", "Content for blog post 1.", ["tag1", "tag2"]);
    await createBlogPost("Blog Post 2", "JaneDoe", "Content for blog post 2.", ["tag1", "tag3"]);
    console.log("Seeding complete. Disconnecting.");

    await dbDisconnect();
    console.log("Database disconnected.");
};

seed();