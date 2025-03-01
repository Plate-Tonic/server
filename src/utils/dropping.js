const { dbConnect, dbDisconnect, dbDrop } = require("./database");

async function drop() {
    await dbConnect();
    console.log("Database connected. Dropping now.");

    await dbDrop();

    await dbDisconnect();
    console.log("Database disconnected.");
};

drop();