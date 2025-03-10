const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { app } = require('../../server');
const { BlogPost } = require('../../models/BlogPostModel');

let adminToken;
let blogPostId;
let blogPostData;

beforeAll(async () => {
    blogPostData = {
        title: "Vegan Lifestyle",
        author: "John Doe",
        content: "A deep dive into veganism, its benefits, and how to start.",
        tags: ["vegan", "health", "lifestyle"]
    };

    // Connect to test DB
    await mongoose.connect("mongodb://127.0.0.1:27017/server_test", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();

    // Create a mock admin token
    process.env.JWT_SECRET = 'secret-key';
    adminToken = jwt.sign({ userId: 'mockUserId', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a blog post to be used in update and delete tests
    const blogPost = await BlogPost.create(blogPostData);
    blogPostId = blogPost._id.toString();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('BlogPost Controller Tests', () => {
    // Test GET all blog posts
    it('should fetch all blog posts', async () => {
        const res = await request(app).get('/blog');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Blog posts retrieved successfully');
        expect(res.body.data).toBeInstanceOf(Array);
    });

    // Test GET a single blog post by ID
    it('should fetch a blog post by ID', async () => {
        const res = await request(app).get(`/blog/${blogPostId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Blog post retrieved successfully');
        expect(res.body.data._id).toBe(blogPostId);
    });

    it('should return 404 if blog post not found by ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/blog/${nonExistentId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe(`Blog ID ${nonExistentId} not found`);
    });

    // Test CREATE blog post
    it('should create a new blog post (with admin)', async () => {
        const newBlogPost = { ...blogPostData, title: "New Vegan Post" };

        const res = await request(app)
            .post('/blog')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newBlogPost);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('New blog post created');
        expect(res.body.data.title).toBe(newBlogPost.title);
    });

    it('should return 403 if not admin when creating blog post', async () => {
        const nonAdminToken = jwt.sign({ userId: 'mockUserId', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newBlogPost = { ...blogPostData, title: "Non-Admin Post" };

        const res = await request(app)
            .post('/blog')
            .set('Authorization', `Bearer ${nonAdminToken}`)
            .send(newBlogPost);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Forbidden: Only admins can create blog posts');
    });

    it('should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/blog')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: "Incomplete Blog Post" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });

    it('should return 409 if blog post with duplicate title exists', async () => {
        const duplicatePost = { ...blogPostData, title: "Vegan Lifestyle" };

        const res = await request(app)
            .post('/blog')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(duplicatePost);

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Duplicate blog post title');
    });

    // Test UPDATE blog post
    it('should update an existing blog post (with admin)', async () => {
        const updatedBlogPost = { ...blogPostData, title: "Updated Vegan Lifestyle" };

        const res = await request(app)
            .put(`/blog/${blogPostId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatedBlogPost);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`Blog post "${updatedBlogPost.title}" updated successfully`);
        expect(res.body.data.title).toBe(updatedBlogPost.title);

        // Store the updated title in a variable (for DELETE test)
        currentTitle = updatedBlogPost.title;
    });
});

it('should return 403 if not admin when updating blog post', async () => {
    const nonAdminToken = jwt.sign({ userId: 'mockUserId', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const updatedBlogPost = { ...blogPostData, title: "Non-Admin Update" };

    const res = await request(app)
        .put(`/blog/${blogPostId}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(updatedBlogPost);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Only admins can update blog posts');
});

it('should return 409 if updating to a duplicate blog post title', async () => {
    const duplicatePost = await BlogPost.create({ ...blogPostData, title: "Another Vegan Post" });

    const updatedBlogPost = { title: "Another Vegan Post" };

    const res = await request(app)
        .put(`/blog/${blogPostId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedBlogPost);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Duplicate blog post title');
});

// Test DELETE blog post
it('should delete an existing blog post (with admin)', async () => {
    const res = await request(app)
        .delete(`/blog/${blogPostId}`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Blog post "${currentTitle}" deleted successfully`);
});

it('should return 403 if not admin when deleting blog post', async () => {
    const nonAdminToken = jwt.sign({ userId: 'mockUserId', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
        .delete(`/blog/${blogPostId}`)
        .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Only admins can delete blog posts');
});
