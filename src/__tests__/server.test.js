const mongoose = require('mongoose');
const request = require('supertest');
const { app } = require("../server");
const { BlogPost } = require('../models/BlogPostModel');
const { MealPlan } = require('../models/MealPlanModel');

let blogPostData;
let blogPostId;
let mealPlanData;
let mealPlanId;

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect("mongodb://127.0.0.1:27017/server_test", { useNewUrlParser: true, useUnifiedTopology: true, });
  await mongoose.connection.dropDatabase();

  // Create a blog post
  blogPostData = {
    title: "Vegan Lifestyle",
    author: "John Doe",
    content: "A deep dive into veganism, its benefits, and how to start.",
    tags: ["vegan", "health", "lifestyle"]
  };

  const blogPost = await BlogPost.create(blogPostData);
  blogPostId = blogPost._id.toString();

  // Create a meal plan
  mealPlanData = {
    name: "Vegan Protein Packed Meal",
    description: "A high protein, vegan meal plan.",
    ingredients: ["Tofu", "Spinach", "Lentils", "Chickpeas"],
    preference: ["vegan"],
    calories: 200,
    protein: 40,
    fat: 15,
    carbs: 60,
    mealImage: "uploads/mockedMealImage.jpg"
  };

  const mealPlan = await MealPlan.create(mealPlanData);
  mealPlanId = mealPlan._id.toString();
});

afterAll(async () => {
  // Close connection from test DB
  await mongoose.connection.close();
});

describe("Server Routes Tests", () => {

  // Test the test route
  it("should return a test message from the root route", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Test!");
  });

  // Test the auth prefix
  it("should respond to a known auth prefix", async () => {
    const res = await request(app).get("/questions");
    expect(res.status).not.toBe(404);
  });

  // Test the user prefix
  it("should respond to the root user prefix", async () => {
    const res = await request(app).get("/user");
    expect(res.status).not.toBe(404);
  });

  // Test the blog prefix
  it("should access a known route under the blog prefix", async () => {
    const res = await request(app).get('/blog');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Blog posts retrieved successfully');
    expect(res.body.data).toBeInstanceOf(Array);
  });

  // Test the meal-plan prefix
  it("should access a known route under the meal-plan prefix", async () => {
    const res = await request(app).get("/meal-plan");
    expect(res.status).not.toBe(404);
  });

  // Test static file serving for /uploads
  it("should respond with 404 for non-existing file in /uploads", async () => {
    const res = await request(app).get("/uploads/non-existing-file.jpg");
    expect(res.status).toBe(404);
  });

});