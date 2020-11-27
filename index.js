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
const mysql = require("mysql");
const bodyParser = require("body-parser");
const corsEnable = require("cors");
const cookieParser = require("cookie-parser");
const validatorNode = require("./lib/validatorMoviesNode.class.js");
const JWT = require("./lib/jwt.js");
//Se puede usar tambien el paquete npm request
const fetch = require("node-fetch");
const uri = "mongodb+srv://PokemonTeam:5pokemon@pokemon.afmh3.mongodb.net?retryWrites=true&w=majority";
const client = new MongoClient(uri, { "useNewUrlParser": true });
client.connect(err => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});
//const url = "mongodb://localhost:27017/";
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
serverObj.listen(listeningPort);

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
	//PHONE
	validatorOutput = validator.ValidatePhone(data.phone, /^(\+34 )*\d{9}$/);
	if (!validatorOutput.ret){
		return validatorOutput.msg;
	}
	return true;
};

//------------------ ROUTING -------------------//
//REGISTER USER (POST)
serverObj.post("register", (req, res) => {
	//Validate new user data
	const validationResults = validateRegisterData(req.body);
	if (validationResults !== true) {
		res.send({"res" : 0, "msg" : validationResults.msg});
	} else {
		const conectionDB = mysql.createConnection({
			"host": "localhost",
			"user": "root",
			"password": "root",
			"database": "movieprojectdb"
		});

		if (conectionDB){
			const prom = new Promise((resolve, reject) => {
				conectionDB.connect(function(err) {
					if (err) {
						reject(err);
					}
					resolve();
				});
			});
			prom.then(() => {
				const sql = `SELECT USRID FROM users WHERE EMAIL LIKE '${req.body.email}'`;
				conectionDB.query(sql, function (err, result) {
					if (err){
						throw err;
					} else if (result.length){
						//User found already in db
						res.send({"res" : "0", "msg" : "Usuario ya registrado!"});
					} else {
						//Proceed to store user in db table
						const sql = `INSERT INTO users VALUES (NULL, '${req.body.email}', '${req.body.password}', '${req.body.profile}', '${req.body.dateBirth}', '${req.body.nif}', '${req.body.phone}')`;
						conectionDB.query(sql, function (err, result) {
							if (err){
								throw err;
							} else {
								res.send({"res" : "1", "msg" : "Usuario registrado!"});
								
							}
						});
					}
				});
			})
				.catch((fail) => {
					res.send({"res" : "0", "msg" : "Error connection to database"});
				});
		}
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
	//Look for the user name among current users
	const conectionDB = mysql.createConnection({
		"host": "localhost",
		"user": "root",
		"password": "root",
		"database": "movieprojectdb"
	});

	if (conectionDB){
		const prom = new Promise((resolve, reject) => {
			conectionDB.connect(function(err) {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
		prom.then(() => {
			const sql = `SELECT USRID, PASS, USER_PROFILE FROM users WHERE EMAIL LIKE '${req.body.user}'`;
			conectionDB.query(sql, function (err, result) {
				if (err){
					throw err;
				} else if (result.length){
					if (result[0].PASS === req.body.pass){
						//Generate JWT
						const Payload = {
							"user" : req.body.user,
							"profile" : result[0].USER_PROFILE,
							"iat" : new Date()
						};
						const jwt = JWT(Payload);
						//Grant access based on profile
						switch (result[0].USER_PROFILE) {
						case "admin":
						{
							//Access as administrator
							res.cookie("JWT", jwt, {"httpOnly" : true})
								.send({"res" : "1", "msg" : "admin"});
							break;
						}
						case "user":
						{
							//Access as player
							res.cookie("JWT", jwt, {"httpOnly" : true})
								.send({"res" : "1", "msg" : "usuario"});
							break;
						}
						}
					} else {
						res.send({"res" : "0", "msg" : "Contraseña inválida!"});
					}
				} else {
					res.send({"res" : "0", "msg" : "Usuario no registrado!"});
				}
			});
		})
			.catch((fail) => {
				res.send({"res" : "0", "msg" : "Unable to connect to database"});
			});
	}
});

serverObj.get("/loginG", (req, res) => {
	res.redirect(getGoogleAuthURL());
});

serverObj.get("/login", async (req, res) => {
	const {code} = req.query;
	if (code) {
		const user = await getGoogleUser(code);
		res.redirect("/");
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
