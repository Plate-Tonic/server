const { dbConnect, dbDisconnect, dbDrop } = require("../../utils/database");

// Mock the module
jest.mock("../../utils/database", () => ({
    dbConnect: jest.fn(),
    dbDisconnect: jest.fn(),
    dbDrop: jest.fn(),
}));

// Simulate the drop function
const drop = async () => {
    await dbConnect();
    await dbDrop();
    await dbDisconnect();
};

describe("drop function", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it("should call dbConnect, dbDrop, and dbDisconnect in order", async () => {
        await drop();

        // Ensure each function was called once
        expect(dbConnect).toHaveBeenCalledTimes(1);
        expect(dbDrop).toHaveBeenCalledTimes(1);
        expect(dbDisconnect).toHaveBeenCalledTimes(1);

        // Verify the order of calls
        const dbConnectCallOrder = dbConnect.mock.invocationCallOrder[0];
        const dbDropCallOrder = dbDrop.mock.invocationCallOrder[0];
        const dbDisconnectCallOrder = dbDisconnect.mock.invocationCallOrder[0];

        expect(dbConnectCallOrder).toBeLessThan(dbDropCallOrder);
        expect(dbDropCallOrder).toBeLessThan(dbDisconnectCallOrder);
    });

    it("should handle errors during dbConnect", async () => {
        // Simulate an error in dbConnect
        dbConnect.mockRejectedValueOnce(new Error("Connection failed"));

        // Expect the drop function to throw an error
        await expect(drop()).rejects.toThrow("Connection failed");

        // Ensure dbDrop and dbDisconnect were not called
        expect(dbDrop).not.toHaveBeenCalled();
        expect(dbDisconnect).not.toHaveBeenCalled();
    });

    it("should handle errors during dbDrop", async () => {
        // Simulate an error in dbDrop
        dbDrop.mockRejectedValueOnce(new Error("Drop failed"));

        // Expect the drop function to throw an error
        await expect(drop()).rejects.toThrow("Drop failed");

        // Ensure dbConnect was called
        expect(dbConnect).toHaveBeenCalledTimes(1);

        // Ensure dbDisconnect was not called
        expect(dbDisconnect).not.toHaveBeenCalled();
    });

    it("should handle errors during dbDisconnect", async () => {
        // Simulate an error in dbDisconnect
        dbDisconnect.mockRejectedValueOnce(new Error("Disconnection failed"));

        // Expect the drop function to throw an error
        await expect(drop()).rejects.toThrow("Disconnection failed");

        // Ensure dbConnect and dbDrop were called
        expect(dbConnect).toHaveBeenCalledTimes(1);
        expect(dbDrop).toHaveBeenCalledTimes(1);
    });
});