const { BlogPostModel } = require("../models/BlogPostModel");

// Create a blog post
async function createBlogPost(request, response) {
    try {
        const { title, author, content, tags = [] } = request.body;

        const blogPost = await BlogPostModel.create({
            title,
            author,
            content,
            tags
        });

        response.json(blogPost);
    } catch (error) {
        console.error("Error creating blog post: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Get a blog post
async function getBlogPost(request, response) {
    try {
        const blogPost = await BlogPostModel.findById(request.params.blogID);
        if (!blogPost) {
            return response.status(404).json({ message: "Blog post not found." });
        }

        response.json(blogPost);
    } catch (error) {
        console.error("Error fetching blog post: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Get all blog posts
async function getAllBlogPosts(request, response) {
    try {
        const blogPosts = await BlogPostModel.find({});

        response.json(blogPosts);
    } catch (error) {
        console.error("Error fetching blog posts: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update a blog post
async function updateBlogPost(request, response) {
    try {
        const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
            request.params.blogID,
            request.body,
            { new: true }
        );

        if (!updatedBlogPost) {
            return response.status(404).json({ message: "Blog post not found." });
        }

        response.json(updatedBlogPost);
    } catch (error) {
        console.error("Error updating blog post: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Delete a blog post
async function deleteBlogPost(request, response) {
    try {
        const blogPost = await BlogPostModel.findByIdAndDelete(request.params.blogID);
        if (!blogPost) {
            return response.status(404).json({ message: "Blog post not found." });
        }

        response.json({ message: "Blog post deleted." });
    } catch (error) {
        console.error("Error deleting blog post: ", error);
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