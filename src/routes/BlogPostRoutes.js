const express = require("express");
const asyncHandler = require("express-async-handler");
const { validateToken } = require("../middlewares/authMiddleware");
const { createBlogPost, getBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost } = require("../controllers/BlogPostController");

const router = express.Router();

// Get all blog posts
router.get("/", asyncHandler(getAllBlogPosts));

// Get a blog post by ID
router.get("/:blogId", asyncHandler(getBlogPost));

// Apply validateToken middleware to the following routes in this file
router.use(validateToken);

// Create a blog post
router.post("/", asyncHandler(createBlogPost));

// Update a blog post
router.put("/:blogId", asyncHandler(updateBlogPost));

// Delete a blog post
router.delete("/:blogId", asyncHandler(deleteBlogPost));

module.exports = router;