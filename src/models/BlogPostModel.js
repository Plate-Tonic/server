const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minLength: 10
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    }
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = {
    BlogPost
};