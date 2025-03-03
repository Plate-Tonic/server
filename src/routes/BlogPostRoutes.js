const express = require("express");
const { createBlogPost, getBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost } = require("../controllers/BlogPostController");

const router = express.Router();

// Get all blog posts
router.get("/", getAllBlogPosts);

// Get one blog post by ID
router.get("/:blogID", getBlogPost);

// Create a blog post
router.post("/", createBlogPost);

// Update a blog post
router.put("/:blogID", updateBlogPost);

// Delete a blog post
router.delete("/:blogID", deleteBlogPost);

module.exports = router;