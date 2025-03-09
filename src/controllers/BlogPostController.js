const asyncHandler = require("express-async-handler");
const { BlogPost } = require("../models/BlogPostModel");

// Get all blog posts
const getAllBlogPosts = asyncHandler(async (req, res) => {
    // Fetch blog posts from the database
    const blogPosts = await BlogPost.find();

    // Check if blog posts exists
    if (!blogPosts || blogPosts.length === 0) {
        return res.status(404).json({ message: "No blog posts found" });
    }

    // Success message
    res.json({ message: "Blog posts retrieved successfully", data: blogPosts });
});

// Get a blog post
const getBlogPost = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    // Fetch blog post by ID
    const blogPost = await BlogPost.findById(blogId);

    if (!blogPost) {
        return res.status(404).json({ message: `Blog ID ${blogId} not found` });
    }

    // Success message
    res.json({ message: "Blog post retrieved successfully", data: blogPost });
});

// Create a blog post
const createBlogPost = asyncHandler(async (req, res) => {
    const { title, author, content, tags = [] } = req.body;

    // Admin check
    if (!req.authUserData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can create blog posts" });
    }

    // Check if required fields are provided
    if (!title || !author || !content || !tags) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate blog posts
    const duplicate = await BlogPost.findOne({ title }).exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate blog post title" });
    }

    // Create and store new blog post
    const blogPost = await BlogPost.create({
        title,
        author,
        content,
        tags
    });

    // Success message
    res.status(201).json({ message: "New blog post created", data: blogPost });
});

// Update a blog post
const updateBlogPost = asyncHandler(async (req, res) => {
    const { title, author, content, tags = [] } = req.body;
    const { blogId } = req.params;

    // Admin check
    if (!req.authUserData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can update blog posts" });
    }

    // Check for duplicate blog post
    const duplicate = await BlogPost.findOne({ title }).exec()

    if (duplicate && duplicate?._id.toString() !== blogId) {
        return res.status(409).json({ message: "Duplicate blog post title" });
    }

    // Prepare update data
    const updateData = {
        title,
        author,
        content,
        tags,
    };

    // Update the blog post
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(blogId, updateData, {
        new: true,
        runValidators: true,
    });

    // Check if the blog post was found and updated
    if (!updatedBlogPost) {
        return res.status(404).json({ message: `Blog ID ${blogId} not found` });
    }

    // Success response
    res.json({ message: `Blog post "${updatedBlogPost.title}" updated successfully`, data: updatedBlogPost });
});

// Delete a blog post
const deleteBlogPost = asyncHandler(async (req, res) => {
    const { blogId } = req.params

    // Admin check
    if (!req.authUserData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can delete blog posts" });
    }

    // Delete blog post
    const blogPost = await BlogPost.findByIdAndDelete(blogId).exec();

    // Check if blog post was found and deleted
    if (!blogPost) {
        return res.status(404).json({ message: `Blog ID ${blogId} not found` });
    }

    // Success message
    res.json({ message: `Blog post "${blogPost.title}" deleted successfully` });
})

// Export controller functions
module.exports = {
    getAllBlogPosts,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
}