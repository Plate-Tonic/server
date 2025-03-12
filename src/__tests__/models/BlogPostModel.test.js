const mongoose = require("mongoose");
const { BlogPost } = require("../../models/BlogPostModel");

beforeAll(async () => { // Connect to the test database
    await mongoose.connect("mongodb://127.0.0.1:27017/server", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();
});

afterAll(async () => { // Disconnect from the test database
    await mongoose.connection.close();
});

describe("BlogPost Model Structure", () => {
    let blogPost;

    beforeEach(async () => {
        blogPost = new BlogPost({
            title: "The Benefits of Plant-Based Eating",
            author: "Jane Doe",
            content: "Plant-based eating has a variety of benefits...",
            tags: ["health", "vegan", "nutrition"]
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should have the correct fields and types", () => {
        // Check the structure of the BlogPost model
        expect(blogPost).toHaveProperty("title");
        expect(typeof blogPost.title).toBe("string");

        expect(blogPost).toHaveProperty("author");
        expect(typeof blogPost.author).toBe("string");

        expect(blogPost).toHaveProperty("content");
        expect(typeof blogPost.content).toBe("string");

        expect(blogPost).toHaveProperty("tags");
        expect(Array.isArray(blogPost.tags)).toBe(true);
        expect(blogPost.tags.every(item => typeof item === "string")).toBe(true);
    });

    it("should validate the required fields", async () => {
        const missingTitle = new BlogPost({
            author: "Jane Doe",
            content: "Content without a title.",
            tags: ["test"]
        });

        const missingAuthor = new BlogPost({
            title: "Title without author",
            content: "Content without an author.",
            tags: ["test"]
        });

        const missingContent = new BlogPost({
            title: "Title without content",
            author: "Jane Doe",
            tags: ["test"]
        });

        await expect(missingTitle.save()).rejects.toThrow();
        await expect(missingAuthor.save()).rejects.toThrow();
        await expect(missingContent.save()).rejects.toThrow();
    });

    it("should default tags to an empty array", async () => {
        const blogPostWithoutTags = new BlogPost({
            title: "Title without tags",
            author: "John Doe",
            content: "This post has no tags."
        });

        expect(blogPostWithoutTags.tags).toEqual([]);
    });

    it("should validate that title is unique", async () => {
        const duplicateTitlePost = new BlogPost({
            title: "The Benefits of Plant-Based Eating",  // Same title as the initial blog post
            author: "Alice Smith",
            content: "Content with a duplicate title.",
            tags: ["duplicate"]
        });

        // Save the original post to set the unique title
        await blogPost.save();

        // Try saving the duplicate post and expect it to throw an error
        try {
            await duplicateTitlePost.save();
        } catch (error) {
            expect(error).toBeDefined();  // Check that an error was thrown
            expect(error.name).toBe("MongoError");  // Check for a MongoDB error
            expect(error.code).toBe(11000);  // MongoDB error code for duplicate key error
        }
    });
});
