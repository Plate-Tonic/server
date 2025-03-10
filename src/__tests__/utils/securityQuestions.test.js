const { securityQuestions } = require("../../utils/securityQuestions"); // Adjust the path based on your file structure

describe("securityQuestions", () => {
    // Test if the array contains three questions
    it("should contain 3 security questions", () => {
        expect(securityQuestions.length).toBe(3);
    });

    // Test if the array contains the correct questions
    it("should contain the correct security questions", () => {
        expect(securityQuestions[0]).toBe("What is your mother’s maiden name?");
        expect(securityQuestions[1]).toBe("What was the name of your first pet?");
        expect(securityQuestions[2]).toBe("What is the name of the city where you were born?");
    });

    // Test if the array is not empty
    it("should not be an empty array", () => {
        expect(securityQuestions).not.toHaveLength(0);
    });
    
    // Test if the array contains only strings
    it("should contain only strings", () => {
        securityQuestions.forEach(question => {
            expect(typeof question).toBe("string");
        });
    });
});
