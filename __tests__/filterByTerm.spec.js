//const validator = require("../js/filterByTerm.js");

//TEST USER PHONE NUMBER
describe("Test user phone number validation", () => {
	test("Test format +34 123456789", () => {
		expect(validator.ValidatePhone("+34 123456789")).toEqual(true);
	});
	test("Test format 34 123456789", () => {
		expect(validator.ValidatePhone("34 123456789")).toEqual(false);
	});
	test("Test format +33 123456789", () => {
		expect(validator.ValidatePhone("+33 123456789")).toEqual(false);
	});
	test("Test format +34 12345678", () => {
		expect(validator.ValidatePhone("+34 12345678")).toEqual(false);
	});
	test("Test format +34 -123456789", () => {
		expect(validator.ValidatePhone("+34 -123456789")).toEqual(false);
	});
	test("Test format +34 1 23456789", () => {
		expect(validator.ValidatePhone("+34 1 23456789")).toEqual(false);
	});
	test("Test format +34 123-456-789", () => {
		expect(validator.ValidatePhone("+34 123-456-789")).toEqual(false);
	});
	test("Test format +34 123/456/789", () => {
		expect(validator.ValidatePhone("+34 123/456/789")).toEqual(false);
	});
	test("Test format +34 12345i789", () => {
		expect(validator.ValidatePhone("+34 12345i789")).toEqual(false);
	});
	test("Test format +34 12345i789", () => {
		expect(validator.ValidatePhone("+34 12345i789")).toEqual(false);
	});
});