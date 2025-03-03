const { BlogPostModel } = require("../models/BlogPostModel");

// Create a blog post
async function createBlogPost(title, author, content, tags = []) {
    try {
        const blogPost = await BlogPostModel.create({
            title,
            author,
            content,
            tags
        });

        return blogPost;
    } catch (error) {
        console.error("Error creating blog post: ", error);
        throw new Error(error.message);
    }
}

// Get a blog post
async function getBlogPost(request, response) {
    try {
        const blogPost = await BlogPostModel.findById(request.params.id);
        if (!blogPost) {
            return response.status(404).json({ message: "Blog post not found." });
        }

        response.json(blogPost);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Get all blog posts
async function getAllBlogPosts(request, response) {
    try {
        const blogPosts = await BlogPostModel.find({});

        response.json(blogPosts);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Update a blog post
async function updateBlogPost(request, response) {
    try {
        const blogPost = await BlogPostModel.findById(request.params.id);
        if (!blogPost) {
            return response.status(404).json({ message: "Blog post not found." });
        }

        blogPost.title = request.body.title;
        blogPost.author = request.body.author;
        blogPost.content = request.body.content;
        blogPost.tags = request.body.tags;

        await blogPost.save();

        response.json(blogPost);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Delete a blog post
async function deleteBlogPost(request, response) {
    try {
        const blogPost = await BlogPostModel.findByIdAndDelete(request.params.id);
        if (!blogPost) {
            return response.status(404).json({ message: "Blog post not found." });
        }

        response.json({ message: "Blog post deleted." });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Export controller functions
module.exports = {
    createBlogPost,
    getBlogPost,
    getAllBlogPosts,
    updateBlogPost,
    deleteBlogPost
}