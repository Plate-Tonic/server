const express = require("express");
const asyncHandler = require("express-async-handler");

const { createBlogPost, getBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost } = require("../controllers/BlogPostController");

const router = express.Router();

// Get all blog posts
router.get("/", asyncHandler(getAllBlogPosts));

// Get one blog post by ID
router.get("/:blogID", asyncHandler(getBlogPost));

// Create a blog post
router.post("/", asyncHandler(createBlogPost));

// Update a blog post
router.put("/:blogID", asyncHandler(updateBlogPost));

// Delete a blog post
router.delete("/:blogID", asyncHandler(deleteBlogPost));

module.exports = router;