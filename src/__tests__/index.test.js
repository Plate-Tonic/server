const { app } = require("../server");
const { dbConnect } = require("../utils/database");

jest.mock("../utils/database");

let server;

beforeAll(async () => {
    dbConnect.mockResolvedValueOnce(true);
    server = app.listen(8008, async () => {
        await dbConnect();
    });
});

afterAll(() => {
    server.close();
});

describe("Test server and database connection", () => {
    it("should connect to the database and start the server", async () => {
        await dbConnect();

        expect(dbConnect).toHaveBeenCalledTimes(1);
    });
});