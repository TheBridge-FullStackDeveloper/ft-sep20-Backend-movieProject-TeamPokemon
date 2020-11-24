//------------------ GLOBALS -------------------//

//------------------ MODULES -------------------//
const express = require("express");
const bodyParser = require("body-parser");
const corsEnable = require("cors");
const cookieParser = require("cookie-parser");
const validatorNode = require("./lib/validatorMoviesNode.class.js");
//const JWT = require("./lib/jwt.js");

//Creation of Express server
const serverObj = express();

//Express server setup
//Definition of listening port
const listeningPort = 8888;

//------------------ MIDDLEWARES -------------------//
//Setup the public (Frontend) folder
const publicFiles = express.static("public");
serverObj.use(publicFiles);
//Setup body parser for json use
serverObj.use(bodyParser.urlencoded({"extended" : false}));
serverObj.use(bodyParser.json());
serverObj.use(corsEnable());
serverObj.use(cookieParser());

//Raise Express server
serverObj.listen(listeningPort, () => console.log(`Server started listening on ${listeningPort}`));

const validateRegisterData = (data) => {
	//EMAIL
	const validator = new validatorNode();
	let validatorOutput = validator.ValidateEmail(data.email);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}

	//PASSWORD
	validatorOutput = validator.ValidatePassword(data.password, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}

	//BIRTHDAY
	validatorOutput = validator.ValidateDate(data.dateBirth);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}

	//NIF/NIE
	validatorOutput = validator.ValidateNIF(data.nif);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}

	return true;
};
/*
const adultCheck = (date) => {
	//Check out if new user is adult
	let ret = {
		"result" : false,
		"msg" : []
	};

	const today = Date();
	const todayMilliseconds = Date.parse(today);
	const splitDate = date.split("-");
	const adult = new Date(parseInt(splitDate[0]) + 18, parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
	const adultMilliseconds = Date.parse(adult);
	const diff = todayMilliseconds - adultMilliseconds;
	if (diff >= 0) {
		ret.result = true;
	} else {
		ret.msg.push({
			"caption" : "Lo sentimos, pero debes ser mayor de edad para registrarte",
			"class" : "highText"
		});
	}
	return ret;
};*/
//------------------ ROUTING -------------------//
//REGISTER USER (POST)
serverObj.post("register", (req, res) => {
	//Validate new user data
	const validationResults = validateRegisterData(req.body);
	if (validationResults !== true) {
		res.send({"res" : 0, "msg" : validationResults.msg});
	} else {
		//Check out if user is already registered TODO
	}
});

//CREDENTIALS CHECKOUT (POST)
serverObj.post("/login", (req, res) => {
	//Validate credentials
	//EMAIL
	const validator = new validatorNode();
	if (!validator.ValidateEmail(req.body.user)) {
		res.send({"res" : "0", "msg" : "Email no válido"});
	}
	//PASSWORD
	if (!validator.ValidatePassword(req.body.pass, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)) {
		res.send({"res" : "0", "msg" : "Contraseña no válida"});
	}
	//Search the email among the users TODO
});

//LOGOUT (POST)
serverObj.post("/logout", (req, res) => {
	//TODO
});