//------------------ GLOBALS -------------------//

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://PokemonTeam:5pokemon@pokemon.afmh3.mongodb.net?retryWrites=true&w=majority";
const client = new MongoClient(uri, { "useNewUrlParser": true, "useUnifiedTopology": true });
client.connect(err => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});


//------------------ MODULES -------------------//
const express = require("express");
const bodyParser = require("body-parser");
const corsEnable = require("cors");
const cookieParser = require("cookie-parser");
const validatorNode = require("./lib/validatorMoviesNode.class.js");
//Se puede usar tambien el paquete npm request
const fetch = require("node-fetch");

//const JWT = require("./lib/jwt.js");
const url = "mongodb://localhost:27017/";
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

// eslint-disable-next-line no-console
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

serverObj.get("/loginG", (req, res) => {
	res.redirect(getGoogleAuthURL());
});

serverObj.get("/login", async (req, res) => {
	const {code} = req.query;
	if (code) {
		const user = await getGoogleUser(code);
		// eslint-disable-next-line no-console
		console.log(user);
		res.redirect("/");
		// res.send(user);
	}
});

serverObj.get("/SearchMovies/:Title", (req, res) =>{

	let FronTitle = req.params.Title;
	// let Director = req.params.Director;
	// let Year = req.params.Year;
	// let Genre = req.params.Genre;
	if (FronTitle !== null) {

		//s= devuelve listado de peliculas que contienen esapalabra que buscaste
		fetch(`http://www.omdbapi.com/?s=${FronTitle}&apikey=4c909483`)
			.then(res => res.json())
			.then(data => {

				//QUESTION s= me da un listado de toda las peliculas que contengan  mi palabra, entonces como hago esta comparacion, esto esta bien asi?
				if (data.Search) {
					res.send({"msg" : "Movies Omdb Found", "MovieOmdb": data.Search});

				} else {

					try {
						MongoClient.connect(url, (err, db) => {

							if (err) {
								throw err;
							}

							let ObjectDB = db.db("MyOwnMovies");

							ObjectDB.collection("Movies").find({"title": {"$regex": `.*${FronTitle}.*`}}, (err, result) => {

								if (err) {
									throw err;
								}

								let myMongoData = {

									"Title" : result.Title,
									"Director" : result.Director,
									"Actors" : result.Actors,
									"Genre" : result.Genre,
									"Plot" : result.Plot,
									"Runtime" : result.Runtime,
									"Language" : result.Language,
									"Released" : result.Released,
								};

								if (result){
									res.send({"msg" : "Movie Found in Mongo", "resMongoDB" : myMongoData});
								} else {
									res.send({"msg": "This movie does not exist in Mongo"});
								}

								// eslint-disable-next-line no-console
								// console.log(result.name);


								db.close();

							});
						});


					} catch (e) {
						return {"msg" : "MongoDB error connection"};
					}
				}
			})


			.catch({"msg" : "ErrorConnection with Omdb"});
	} else {

		res.send({"msg" : "Empty Title"});
	}


});

// serverObj.get();

//LOGOUT (POST)
//
serverObj.post("/logout", (req, res) => {
	//TODO
});


//OAUTH
const {google} = require("googleapis");
//import { google } from 'googleapis';
let GOOGLE_CLIENT_SECRET="hgQOLqZ2MPLH-r0B9Glq5TdW";
let GOOGLE_CLIENT_ID = "892702418247-bgj3ovrtauoh0i2ru4qs0j9tbg1rn1ma.apps.googleusercontent.com";
const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	/*
   * This is where Google will redirect the user after they
   * give permission to your application
   */
	"http://localhost:8888/login"
);
function getGoogleAuthURL() {
	/*
     * Generate a url that asks permissions to the user's email and profile
     */
	const scopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	];
	return oauth2Client.generateAuthUrl({
		"access_type": "offline",
		"prompt": "consent",
		// If you only need one scope you can pass it as string
		"scope": scopes
	});
}

async function getGoogleUser(code) {
	if (code) {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);
		if (tokens.id_token && tokens.access_token) {
			// Fetch the user's profile with the access token and bearer
			try {

				const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
					"headers": {
						"Authorization": `Bearer ${tokens.id_token}`
					}
				});
				const googleUser = await res.json();
				return googleUser;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
				// throw new Error(error.message);
			}
		}
	}
	return null;
}

// eslint-disable-next-line no-console
// console.log(getGoogleAuthURL());