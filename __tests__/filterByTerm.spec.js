<<<<<<< HEAD
//Test Birth Date
describe("Check Birth Date", () => {

	//Test ALL
	test("test ALL [have 2 digits for day between 01-31, 2 digits for month between 01-12, 4 digits for year. All separated by /]", () => {
		expect(validator.birthDate("01/01/2000")).toEqual(true);
	});

	//Test Day
	test("test DAY [contains 2 digits between 01-30]", () => {
		expect(validator.birthDate("50/01/2000")).toEqual(false);
	});

	//Test Month
	test("test MONTH [contains 2 digits between 01-12]", () => {
		expect(validator.birthDate("01/50/2000")).toEqual(false);
	});

	//Test Year
	test("test YEAR [contains 4 digits starting from 19 or 20]", () => {
		expect(validator.birthDate("01/01/5555")).toEqual(false);
	});

	//Test separation
	test("test SLASH [Day, month and year are separated by a /]", () => {
		expect(validator.birthDate("01-01-2000")).toEqual(false);
	});

	//Test with text
	test("test TEXT [There should not be any text]", () => {
		expect(validator.birthDate("test")).toEqual(false);
	});

	//Test days of the month
	//Test January
	test("test January [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/01/2000")).toEqual(false);
	});

	//Test February
	test("test February [There should be max. 28 days]", () => {
		expect(validator.birthDate("30/02/2000")).toEqual(false);
	});

	//Test March
	test("test March [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/03/2000")).toEqual(false);
	});

	//Test April
	test("test April [There should be max. 30 days]", () => {
		expect(validator.birthDate("31/04/2000")).toEqual(false);
	});

	//Test May
	test("test May [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/05/2000")).toEqual(false);
	});

	//Test June
	test("test June [There should be max. 30 days]", () => {
		expect(validator.birthDate("31/06/2000")).toEqual(false);
	});

	//Test July
	test("test July [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/07/2000")).toEqual(false);
	});

	//Test August
	test("test August [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/08/2000")).toEqual(false);
	});

	//Test September
	test("test September [There should be max. 30 days]", () => {
		expect(validator.birthDate("31/09/2000")).toEqual(false);
	});

	//Test October
	test("test October [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/10/2000")).toEqual(false);
	});

	//Test November
	test("test November [There should be max. 30 days]", () => {
		expect(validator.birthDate("31/11/2000")).toEqual(false);
	});

	//Test December
	test("test December [There should be max. 31 days]", () => {
		expect(validator.birthDate("32/12/2000")).toEqual(false);
	});

	//Test leap-year
	test("test leap-year [There should be max. 29 days in february]", () => {
		expect(validator.birthDate("29/02/2000")).toEqual(true);
	});

=======

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
>>>>>>> 2770686f0f7459100976b0d734aecf577416d7be
});