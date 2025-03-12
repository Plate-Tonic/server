const { dbConnect, dbDisconnect } = require("../../utils/database");

// Mock the module
jest.mock("../../utils/database", () => ({
    dbConnect: jest.fn(),
    dbDisconnect: jest.fn()
}));

// Simulate the seed function
const seed = async () => {
    try {
        await dbConnect();
    } finally {
        await dbDisconnect();
    }
};

describe("seed function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call dbConnect and dbDisconnect in order", async () => {
        await seed();

        // Ensure each function was called once
        expect(dbConnect).toHaveBeenCalledTimes(1);
        expect(dbDisconnect).toHaveBeenCalledTimes(1);

        // Verify the order of calls
        const dbConnectCallOrder = dbConnect.mock.invocationCallOrder[0];
        const dbDisconnectCallOrder = dbDisconnect.mock.invocationCallOrder[0];

        expect(dbConnectCallOrder).toBeLessThan(dbDisconnectCallOrder);
    });

    it("should handle errors during dbConnect", async () => {
        // Simulate an error in dbConnect
        dbConnect.mockRejectedValueOnce(new Error("Connection failed"));

        // Expect the seed function to throw an error
        await expect(seed()).rejects.toThrow("Connection failed");

        // Ensure dbDisconnect was called
        expect(dbDisconnect).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during dbDisconnect", async () => {
        // Simulate an error in dbDisconnect
        dbDisconnect.mockRejectedValueOnce(new Error("Disconnection failed"));

        // Expect the seed function to throw an error
        await expect(seed()).rejects.toThrow("Disconnection failed");

        // Ensure dbConnect was called
        expect(dbConnect).toHaveBeenCalledTimes(1);
    });
});