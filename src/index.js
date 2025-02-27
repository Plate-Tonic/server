const { app } = require("./server.js");
const { dbConnect } = require("./utils/database");

require("dotenv").config();

const PORT = process.env.PORT || 8008;

app.listen(PORT, async() => {
    await dbConnect();
    console.log(`Server running on port ${PORT}`);
});