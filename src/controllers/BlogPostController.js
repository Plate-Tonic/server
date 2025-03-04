const asyncHandler = require("express-async-handler");

const { BlogPost } = require("../models/BlogPostModel");

// Create a blog post
const createBlogPost = asyncHandler(async (req, res) => {
    const { title, author, content, tags = [] } = req.body;

    // Confirm required fields are provided
    if (!title || !author || !content || !tags) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate blog post
    const duplicate = await BlogPost.findOne({ title }).exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate blog post title" });
    }

    // Create and store new blog post
    const blogPost = await BlogPost.create({
        title, author, content, tags
    });

    // Success or error message
    if (blogPost) {
        res.status(201).json({ message: "New blog post created" });
    } else {
        res.status(500).json({ message: "Error creating blog post" });
    }
});

// Get a blog post
const getBlogPost = asyncHandler(async (req, res) => {
    // Extract blog ID from request parameters
    const { blogID } = req.params;

    // Fetch blog post by ID
    const blogPost = await BlogPost.findById(blogID);

    // Check if blog post exists
    if (!blogPost) {
        return res.status(404).json({ message: `Blog ID ${blogID} not found` });
    }

    // Return blog post
    res.json(blogPost);
});

// Get all blog posts
const getAllBlogPosts = asyncHandler(async (req, res) => {
    // Fetch blog posts from the database
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
    // Check if blog posts exists
    if (!blogPosts || blogPosts.length === 0) {
        return res.status(404).json({ message: "No blog posts found" });
    }

    // Return blog posts
    res.json(blogPosts);
});


// Update a blog post
const updateBlogPost = asyncHandler(async (req, res) => {
    const { title, author, content, tags = [] } = req.body;

    // Extract blog ID from the request parameters
    const { blogID } = req.params;

    // Confirm required fields are provided
    if (!title || !author || !content || !tags) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch blog post by ID
    const blogPost = await BlogPost.findById(blogID).exec();

    // Check if blog post exists
    if (!blogPost) {
        return res.status(404).json({ message: `Blog ID ${blogID} not found` });
    }

    // Check for duplicate blog post
    const duplicate = await BlogPost.findOne({ title }).exec()

    // Update blog post if no duplicate exists, or it's the same blog post
    if (duplicate && duplicate?._id.toString() !== blogID) {
        return res.status(409).json({ message: "Duplicate blog post" })
    }

    // Update blog post with new data
    blogPost.title = title
    blogPost.author = author
    blogPost.content = content
    blogPost.tags = tags
    
    // Save updated blog post
    const updatedBlogPost = await blogPost.save()

    // Success message
    res.json({ message: `Updated ${updatedBlogPost.name}` })
});

// Delete a blog post
const deleteBlogPost = asyncHandler(async (req, res) => {
    // Extract blog ID from request parameters
    const { blogID } = req.params

    // Check if blog ID is provided
    if (!blogID) {
        return res.status(400).json({ message: "Blog ID required" });
    }

    // Delete blog post
    const blogPost = await BlogPost.findByIdAndDelete(blogID).exec();

    if (!blogPost) {
        return res.status(404).json({ message: `Blog ID ${blogID} not found` });
    }

    // Success message
    res.json({ message: `Deleted ${blogPost.name}` });
})

// Export controller functions
module.exports = {
    createBlogPost,
    getBlogPost,
    getAllBlogPosts,
    updateBlogPost,
    deleteBlogPost
}