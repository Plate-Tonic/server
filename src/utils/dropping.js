require('dotenv').config();
const { dbConnect, dbDisconnect, dbDrop } = require("./database");

// Function to drop the database
async function drop() {
    await dbConnect();
    console.log("Database connected. Dropping now.");

    await dbDrop();

    await dbDisconnect();
    console.log("Database disconnected.");
};

drop();