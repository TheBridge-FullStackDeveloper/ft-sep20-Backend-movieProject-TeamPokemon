const validator = require("../lib/validatorMovies.class");

//TEST USER PHONE NUMBER
describe("Test user phone number validation", () => {
	const strRegEx = /^(\+34 )*\d{9}$/;
	test("Test format +34 123456789", () => {
		expect(validator.ValidatePhone("+34 123456789", strRegEx)).toEqual(true);
	});
	test("Test format 34 123456789", () => {
		expect(validator.ValidatePhone("34 123456789", strRegEx)).toEqual(false);
	});
	test("Test format +33 123456789", () => {
		expect(validator.ValidatePhone("+33 123456789", strRegEx)).toEqual(false);
	});
	test("Test format +34 12345678", () => {
		expect(validator.ValidatePhone("+34 12345678", strRegEx)).toEqual(false);
	});
	test("Test format +34 -123456789", () => {
		expect(validator.ValidatePhone("+34 -123456789", strRegEx)).toEqual(false);
	});
	test("Test format +34 1 23456789", () => {
		expect(validator.ValidatePhone("+34 1 23456789", strRegEx)).toEqual(false);
	});
	test("Test format +34 123-456-789", () => {
		expect(validator.ValidatePhone("+34 123-456-789", strRegEx)).toEqual(false);
	});
	test("Test format +34 123/456/789", () => {
		expect(validator.ValidatePhone("+34 123/456/789", strRegEx)).toEqual(false);
	});
	test("Test format +34 12345i789", () => {
		expect(validator.ValidatePhone("+34 12345i789", strRegEx)).toEqual(false);
	});
	test("Test format +34 12345i789", () => {
		expect(validator.ValidatePhone("+34 12345i789", strRegEx)).toEqual(false);
	});
});
//Test Birth Date
describe("Check Birth Date", () => {
	//Test ALL
	test("test ALL [have 2 digits for day between 01-31, 2 digits for month between 01-12, 4 digits for year. All separated by /]", () => {
		expect(validator.ValidateDate("01/01/2000")).toEqual(true);
	});

	//Test Day
	test("test DAY [contains 2 digits between 01-30]", () => {
		expect(validator.ValidateDate("50/01/2000")).toEqual(false);
	});

	//Test Month
	test("test MONTH [contains 2 digits between 01-12]", () => {
		expect(validator.ValidateDate("01/50/2000")).toEqual(false);
	});

	//Test Year
	test("test YEAR [contains 4 digits starting from 19 or 20]", () => {
		expect(validator.ValidateDate("01/01/5555")).toEqual(false);
	});

	//Test separation
	test("test SLASH [Day, month and year are separated by a /]", () => {
		expect(validator.ValidateDate("01-01-2000")).toEqual(false);
	});

	//Test with text
	test("test TEXT [There should not be any text]", () => {
		expect(validator.ValidateDate("test")).toEqual(false);
	});

	//Test days of the month
	//Test January
	test("test January [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/01/2000")).toEqual(false);
	});

	//Test February
	test("test February [There should be max. 28 days]", () => {
		expect(validator.ValidateDate("30/02/2000")).toEqual(false);
	});

	//Test March
	test("test March [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/03/2000")).toEqual(false);
	});

	//Test April
	test("test April [There should be max. 30 days]", () => {
		expect(validator.ValidateDate("31/04/2000")).toEqual(false);
	});

	//Test May
	test("test May [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/05/2000")).toEqual(false);
	});

	//Test June
	test("test June [There should be max. 30 days]", () => {
		expect(validator.ValidateDate("31/06/2000")).toEqual(false);
	});

	//Test July
	test("test July [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/07/2000")).toEqual(false);
	});

	//Test August
	test("test August [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/08/2000")).toEqual(false);
	});

	//Test September
	test("test September [There should be max. 30 days]", () => {
		expect(validator.ValidateDate("31/09/2000")).toEqual(false);
	});

	//Test October
	test("test October [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/10/2000")).toEqual(false);
	});

	//Test November
	test("test November [There should be max. 30 days]", () => {
		expect(validator.ValidateDate("31/11/2000")).toEqual(false);
	});

	//Test December
	test("test December [There should be max. 31 days]", () => {
		expect(validator.ValidateDate("32/12/2000")).toEqual(false);
	});

	//Test leap-year
	test("test leap-year [There should be max. 29 days in february]", () => {
		expect(validator.ValidateDate("29/02/2000")).toEqual(true);
	});
});

//TEST EMAIL
describe("email_tests", () =>{
	//res TRUE
	test("email format niceandsimple@example.com", () =>{
		expect(validator.ValidateEmail("niceandsimple@example.com")).toEqual(true);
	});
	test("email format very.common@example.com", () =>{
		expect(validator.ValidateEmail("very.common@example.com")).toEqual(true);
	});
	test("email format a.little.lengthy.but.fine@dept.example.com", () =>{
		expect(validator.ValidateEmail("a.little.lengthy.but.fine@dept.example.com")).toEqual(true);
	});
	test("email format disposable.style.email.with+symbol@example.com", () =>{
		expect(validator.ValidateEmail("disposable.style.email.with+symbol@example.com")).toEqual(true);
	});
	test("email format other.email-with-dash@example.com", () =>{
		expect(validator.ValidateEmail("other.email-with-dash@example.com")).toEqual(true);
	});
	test("email format !#$%&'*+-/=?^_`{}|~@example.org", () =>{
		expect(validator.ValidateEmail("!#$%&'*+-/=?^_`{}|~@example.org")).toEqual(true);
	});

	//res FALSE
	test("email format user@[IPv6:2001:db8:1ff::a0b:dbd0]", () =>{
		expect(validator.ValidateEmail("user@[IPv6:2001:db8:1ff::a0b:dbd0]")).toEqual(false);
	});
	test("email format \"much.more unusual\"@example.com", () =>{
		expect(validator.ValidateEmail("\"much.more unusual\"@example.com")).toEqual(false);
	});
	test("email format \"very.unusual.@.unusual.com\"@example.com", () =>{
		expect(validator.ValidateEmail("\"very.unusual.@.unusual.com\"@example.com")).toEqual(false);
	});
	test("email format \"very.(),:;<>[]\".VERY.\"very@\\", () =>{
		expect(validator.ValidateEmail("very.common@example.com")).toEqual(false);
	});
	test("email format \"very\".unusual\"@strange.example.com", () =>{
		expect(validator.ValidateEmail("\"very\".unusual\"@strange.example.com")).toEqual(false);
	});
	test("email format postbox@com", () =>{
		expect(validator.ValidateEmail("postbox@com")).toEqual(false);
	});
	test("email format admin@mailserver1", () =>{
		expect(validator.ValidateEmail("admin@mailserver1")).toEqual(false);
	});
	test("email format \"()<>[]:,;@\\\"!#$%&'*+-/=?^_`{}| ~.a\"@example.org", () =>{
		expect(validator.ValidateEmail("\"()<>[]:,;@\\\"!#$%&'*+-/=?^_`{}| ~.a\"@example.org")).toEqual(false);
	});
	test("email format \" \"@example.org", () =>{
		expect(validator.ValidateEmail("\" \"@example.org")).toEqual(false);
	});
	test("email format üñîçø∂é@example.com", () =>{
		expect(validator.ValidateEmail("üñîçø∂é@example.com")).toEqual(false);
	});
});


// validator dni
describe("Filter DNI numbers and let letter", () => {
	//  1  españoles mayores 14
	test("test format 12345678Z", () => {

		expect(validator.ValidateNIF("12345678Z")).toEqual(true);

	});

	test(" test format A12345678", () => {

		expect(validator.ValidateNIF("A12345678")).toEqual(false);

	});

	//  Extranjeros residentes en España e identificados por la Policía con un NIE, asignado hasta el 15 de julio de 2008. Los NIE, según la Orden de 7 de febrero de 1997, inicialmente constaban de X + 8 números + dígito de control, la Orden INT/2058/2008 redujo de 8 a 7 los números para que tuvieran la misma longitud que los NIF y CIF, pero esta Orden mantiene la validez de los NIE X de 8 dígitos anteriores ya asignados.

	test("test format X1234567L", () => {

		expect(validator.ValidateNIF("X1234567L")).toEqual(true);

	});

	test("test format X1234567A", () => {

		expect(validator.ValidateNIF("X1234567A")).toEqual(false);

	});

	//   Extranjeros identificados por la Policía con un NIE, asignado desde el 16 de julio de 2008 (Orden INT/2058/2008, BOE del 15 de julio )

	test("test format Y1234567X", () => {

		expect(validator.ValidateNIF("Y1234567X")).toEqual(true);

	});

	test("test format Y1234567A", () => {

		expect(validator.ValidateNIF("Y1234567A")).toEqual(false);

	});

	//  Letra reservada para cuando se agoten los 'Y' para Extranjeros identificados por la Policía con un NIE


	test("test format Z1234567R", () => {

		expect(validator.ValidateNIF("Z1234567R")).toEqual(true);

	});

	test("test format Z1234567A", () => {

		expect(validator.ValidateNIF("Z1234567A")).toEqual(false);

	});

	//////////////////////////////////////////


});

//Validation Password
describe("Comprobar password", () => {
	const strRegEx = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/;
	test("Test format abcdefghe4 [have alpha, numbers, less than 10 characters and more than 3]", () => {

		expect(validator.ValidatePass("abcdefghe4", strRegEx)).toEqual(true);

	});
	test("Test format ab [have alpha, doesn't have numbers, less than 3 length", () => {

		expect(validator.ValidatePass("ab", strRegEx)).toEqual(false);

	});
	test("Test format Abbcc [have alpha, doesn't have numbers, starts with a capital letter] ", () => {

		expect(validator.ValidatePass("Abbcc", strRegEx)).toEqual(false);

	});
	test("Test format abcdCfghesdsaf [more than 10 length] ", () => {

		expect(validator.ValidatePass("abcdCfghesdsaf", strRegEx)).toEqual(false);

	});
	test("Test format 34566 [only number]", () => {

		expect(validator.ValidatePass("34566", strRegEx)).toEqual(false);

	});
	test("Test format adcdef*[contains *] ", () => {

		expect(validator.ValidatePass("adcdef*", strRegEx)).toEqual(false);

	});
	test("Test format absc_b [contains _]", () => {

		expect(validator.ValidatePass("absc_b", strRegEx)).toEqual(false);

	});
	test("Test format absc-b [contains -] ", () => {

		expect(validator.ValidatePass("absc-b", strRegEx)).toEqual(false);

	});
	test("Test format absc.b [contains .] ", () => {

		expect(validator.validatePass("absc.b", strRegEx)).toEqual(false);

	});
	test("Test format absc,b [contains ,]", () => {

		expect(validator.validatePass("absc,b", strRegEx)).toEqual(false);

	});
	test("Test format absc b [contains space]", () => {

		expect(validator.validatePass("absc b", strRegEx)).toEqual(false);

	});
});