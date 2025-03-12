const mongoose = require("mongoose");
const { dbConnect, dbDisconnect, dbDrop } = require("../../utils/database");

// Mock mongoose functions to avoid actual database calls
jest.mock("mongoose", () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    connection: {
        db: {
            dropDatabase: jest.fn()
        }
    }
}));

describe("Database Connection", () => {
    let originalExit;

    beforeAll(() => {
        originalExit = process.exit;
        process.exit = jest.fn(); // Mock process.exit to prevent termination during testing
        originalConsoleError = console.error;
        console.error = jest.fn(); // Mock console.error to capture errors
    });

    afterAll(() => {
        process.exit = originalExit; // Restore process.exit
        console.error = originalConsoleError; // Restore console.error
    });

    it("should handle successful database connection", async () => {
        // Simulate a successful connection
        mongoose.connect.mockResolvedValueOnce(true);

        // Call dbConnect and check if it resolves without throwing an error
        await expect(dbConnect()).resolves.not.toThrow();

        // Ensure mongoose.connect was called
        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://127.0.0.1:27017/server");
    });

    it("should handle failed database connection", async () => {
        // Simulate a failed connection
        const errorMessage = 'Database connection failed';
        mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

        // Mock process.exit and console.error
        const mockExit = jest.fn();
        process.exit = mockExit;
        const mockError = jest.fn();
        console.error = mockError;

        // Call dbConnect and check if it throws an error
        await expect(dbConnect()).resolves.not.toThrow();

        // Ensure mongoose.connect was called
        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://127.0.0.1:27017/server");

        // Ensure process.exit was called
        expect(mockExit).toHaveBeenCalledWith(1);

        // Ensure console.error was called
        expect(mockError).toHaveBeenCalledWith("Database connection error: ", expect.any(Error));
    });
});

describe("Database Disconnection", () => {
    it("should disconnect from the database", async () => {
        // Simulate a successful disconnection
        mongoose.disconnect.mockResolvedValueOnce(true);

        // Call dbDisconnect and check if it resolves without throwing an error
        await expect(dbDisconnect()).resolves.not.toThrow();

        // Ensure mongoose.disconnect was called
        expect(mongoose.disconnect).toHaveBeenCalled();
    });
});

describe("Database Dropping", () => {
    it("should drop the database", async () => {
        // Simulate a successful drop database operation
        mongoose.connection.db.dropDatabase.mockResolvedValueOnce(true);

        // Call dbDrop and check if it resolves without throwing an error
        await expect(dbDrop()).resolves.not.toThrow();

        // Ensure mongoose.connection.db.dropDatabase was called
        expect(mongoose.connection.db.dropDatabase).toHaveBeenCalled();
    });
});