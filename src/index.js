require("dotenv").config();
const { app } = require("./server.js");
const { dbConnect } = require("./utils/database");

// Start the server
const PORT = process.env.PORT || 8008;

app.listen(PORT, async() => {
    await dbConnect();
    console.log(`Server running on port ${PORT}`);
});