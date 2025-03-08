const mongoose = require("mongoose");

// Function to connect to the database
async function dbConnect() {
    let databaseUrl = process.env.DATABASE_URL; // || `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;

    try {
        console.log("Connecting to database:", databaseUrl);
        await mongoose.connect(databaseUrl);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error: ", error);
        process.exit(1);
    }
};

// Function to disconnect from the database
async function dbDisconnect() {
    await mongoose.disconnect();
};

// Function to drop the database
async function dbDrop() {
    await mongoose.connection.db.dropDatabase();
};

module.exports = {
    dbConnect,
    dbDisconnect,
    dbDrop
};