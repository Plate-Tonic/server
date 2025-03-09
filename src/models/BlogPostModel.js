const mongoose = require("mongoose");

// Schema for blog posts
const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true,
        default: []

    }
});

// Model for blog posts
const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = {
    BlogPost
};