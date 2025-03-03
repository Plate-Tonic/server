const { dbConnect, dbDisconnect } = require("./database");
const { createBlogPost } = require("../controllers/BlogPostController");

async function seed() {
    await dbConnect();
    console.log("Database connected. Seeding now.");

    const blogPosts = [
        { title: "Blog Post 1", author: "JohnDoe", content: "Content for blog post 1.", tags: ["tag1", "tag2"] },
        { title: "Blog Post 2", author: "JaneDoe", content: "Content for blog post 2.", tags: ["tag1", "tag3"] }
    ];

    for (let post of blogPosts) {
        await createBlogPost(post.title, post.author, post.content, post.tags);
    }
    console.log("Seeding complete. Disconnecting.");

    await dbDisconnect();
    console.log("Database disconnected.");
};

seed();