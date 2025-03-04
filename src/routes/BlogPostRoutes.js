const express = require("express");
const asyncHandler = require("express-async-handler");
const { validateToken } = require("../middleware/validateToken");
const { createBlogPost, getBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost } = require("../controllers/BlogPostController");

const router = express.Router();

// Get all blog posts
router.get("/", asyncHandler(getAllBlogPosts));

// Get one blog post by ID
router.get("/:blogID", asyncHandler(getBlogPost));

// Apply validateToken middleware to following routes in this file
router.use(validateToken);

// Create a blog post
router.post("/", asyncHandler(createBlogPost));

// Update a blog post
router.put("/:blogID", asyncHandler(updateBlogPost));

// Delete a blog post
router.delete("/:blogID", asyncHandler(deleteBlogPost));

module.exports = router;