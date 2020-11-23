
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