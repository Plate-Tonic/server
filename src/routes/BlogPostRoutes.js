const express = require("express");
const { createBlogPost, getBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost } = require("../controllers/BlogPostController");

const router = express.Router();

// Get all blog posts
router.get("/blog", getAllBlogPosts);

// Get one blog post by ID
router.get("/blog/:blogPostId", getBlogPost);

// Create a blog post
router.post("/blog", createBlogPost);

// Update a blog post
router.put("/blog/:blogPostId", updateBlogPost);

// Delete a blog post
router.delete("/blog/:blogPostId", deleteBlogPost);

module.exports = router;