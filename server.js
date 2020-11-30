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

const MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId; 
const uri = "mongodb+srv://PokemonTeam:5pokemon@pokemon.afmh3.mongodb.net?retryWrites=true&w=majority";
const client = new MongoClient(uri, { "useNewUrlParser": true, "useUnifiedTopology": true });
client.connect(err => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});

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
	if (data === undefined || data === null) {
		return {"ret" : false, "msg" : "Datos de registro no definidos!"};
	}
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

const validateMovieData = (data) => {
	if (data === undefined || data === null) {
		return {"ret" : false, "msg" : "Datos de la película no definidos!"};
	}
	//ID
	const validator = new validatorNode();
	let validatorOutput = validator.ValidateString(data.id, "id", /^M_[a-zA-Z0-9]+$/, true);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//PHOTO
	validatorOutput = validator.ValidateString(data.photo, "carátula", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//TITLE
	validatorOutput = validator.ValidateString(data.title, "title", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//DIRECTOR
	validatorOutput = validator.ValidateString(data.director, "director", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//ACTORS
	validatorOutput = validator.ValidateString(data.actors, "actors", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//GENRE
	validatorOutput = validator.ValidateString(data.genre, "genre", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//YEAR
	validatorOutput = validator.ValidateString(data.year, "year", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//DURATION
	validatorOutput = validator.ValidateString(data.duration, "duration", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//LANGUAGE
	validatorOutput = validator.ValidateString(data.language, "language", "");
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//PLOT
	validatorOutput = validator.ValidateString(data.plot, "plot", "");
	if (!validatorOutput.ret) {
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
				const sql = "SELECT USRID FROM users WHERE EMAIL LIKE ?";
				conectionDB.query(sql, [req.body.email], function (err, result) {
					if (err){
						throw err;
					} else if (result.length){
						//User found already in db
						res.send({"res" : "0", "msg" : "Usuario ya registrado!"});
					} else {
						//Proceed to store user in db table
						const [values] = req.body;
						const sql = "INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?)";
						conectionDB.query(sql, values, function (err, result) {
							if (err){
								throw err;
							} else {
								res.send({"res" : "1", "msg" : "Usuario registrado!"});

							}
						});
					}
				});
				conectionDB.close();
			})
				.catch((fail) => {
					res.send({"res" : "0", "msg" : "Error connection to database"});
				});
		}
	}
});

//REGISTER USER (POST)
serverObj.post("AUTH", (req, res) => {
	const conectionDB = mysql.createConnection({
		"host": "localhost",
		"user": "root",
		"password": "root",
		"database": "movieprojectdb"});


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
			const sql = `SELECT USRID FROM Oauth2 WHERE EMAIL LIKE '${req.body.email}'`;
			conectionDB.query(sql, function (err, result) {
				if (err){
					throw err;
				} else if (result.length){
					//User found already in db
					res.send({"res" : "0", "msg" : "Usuario ya registrado!"});
				} else {
					//Proceed to store user in db table
					const sql = `INSERT INTO users VALUES (NULL, '${req.body.email}', '${req.body.name}', '${req.body.token}', '${req.body.id_auth}')`;
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
			const sql = "SELECT USRID, PASS, USER_PROFILE FROM users WHERE EMAIL LIKE ?";
			conectionDB.query(sql, [req.body.user], function (err, result) {
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
						const jwt = JWT.buildJWT(Payload);
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
			conectionDB.close();
		})
			.catch((fail) => {
				res.send({"res" : "0", "msg" : "Unable to connect to database"});
			});
	}
});

//CREATION OF MOVIE IN MONGO (POST)
serverObj.post("/createMovie", (req, res) => {
	//Secure end point
	if (false){//!JWT.checkJWT(req.cookies("JWT"))) {
		res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	} else {
		//Validate new movie data
		const validationResults = validateMovieData(req.body);
		if (validationResults !== true) {
			res.send({"res" : 0, "msg" : validationResults.msg});
		} else {
			try {
				MongoClient.connect(uri, (err, db) => {
					if (err) {
						throw err;
					}
					let ObjectDB = db.db("MyOwnMovies");
					ObjectDB.collection("Movies").insertOne(
						{
							"Title" : req.body.title,
							"Director" : req.body.director,
							"Actors" : req.body.actors,
							"Genre" : req.body.genre,
							"Plot" : req.body.plot,
							"Runtime" : req.body.duration,
							"Language" : req.body.language,
							"Released" : req.body.year,
							"Poster" : req.body.photo
						}, (err, result) => {
							if (err) {
								throw err;
							}
							if (result){
								res.send({"msg" : "Movie inserted in Mongo"});
							} else {
								res.send({"msg": "Could not insert movie in Mongo"});
							}
							db.close();
						}
					);
				});
			} catch (e) {
				return {"msg" : "MongoDB error connection"};
			}
		}
	}
});

//EDITION OF MOVIE IN MONGO (POST)
serverObj.post("/editMovie", (req, res) => {
	//Secure end point
	if (false){//!JWT.checkJWT(req.cookies("JWT"))) {
		res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	} else {
		//Validate movie data
		const validationResults = validateMovieData(req.body);
		if (validationResults !== true) {
			res.send({"res" : 0, "msg" : validationResults.msg});
		} else {
			try {
				MongoClient.connect(uri, (err, db) => {
					if (err) {
						throw err;
					}
					let ObjectDB = db.db("MyOwnMovies");
					ObjectDB.collection("Movies").updateOne(
						{"_id" : new ObjectId(req.body.id.substring(2))},
						{
							"$set" : {
								"Title" : req.body.title,
								"Director" : req.body.director,
								"Actors" : req.body.actors,
								"Genre" : req.body.genre,
								"Plot" : req.body.plot,
								"Runtime" : req.body.duration,
								"Language" : req.body.language,
								"Released" : req.body.year,
								"Poster" : req.body.photo
							}
						}, (err, result) => {
							if (err) {
								throw err;
							}
							if (result){
								res.send({"msg" : "Movie edited in Mongo"});
							} else {
								res.send({"msg": "Could not edit movie in Mongo"});
							}
							db.close();
						}
					);
				});
			} catch (e) {
				return {"msg" : "MongoDB error connection"};
			}
		}
	}
});

//DELETION OF MOVIE IN MONGO (POST)
serverObj.post("/deleteMovie", (req, res) => {
	//Secure end point
	if (false){//!JWT.checkJWT(req.cookies("JWT"))) {
		res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	} else {
		//Validate movie title data
		const validator = new validatorNode();
		let validatorOutput = validator.ValidateString(req.body.title, "title", "");
		if (!validatorOutput.ret) {
			return validatorOutput.msg;
		} else {
			try {
				MongoClient.connect(uri, (err, db) => {
					if (err) {
						throw err;
					}
					let ObjectDB = db.db("MyOwnMovies");
					ObjectDB.collection("Movies").deleteOne(
						{"_id" : new ObjectId(req.body.id.substring(2))}
						, (err, result) => {
							if (err) {
								throw err;
							}
							if (result){
								res.send({"msg" : "Movie deleted in Mongo"});
							} else {
								res.send({"msg": "Could not delete movie in Mongo"});
							}
							db.close();
						}
					);
				});
			} catch (e) {
				return {"msg" : "MongoDB error connection"};
			}
		}
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
	//Secure end point
	if (!JWT.checkJWT(req.cookies("JWT"))) {
		res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	} else {
		let FronTitle = req.params.Title;
		// let Director = req.params.Director;
		// let Year = req.params.Year;
		// let Genre = req.params.Genre;
		if (FronTitle !== null) {

	let FronTitle = req.params.Title;
	if (FronTitle !== null) {

		//s= devuelve listado de peliculas que contienen esapalabra que buscaste
		fetch(`http://www.omdbapi.com/?s=${FronTitle}&apikey=4c909483`)
			.then(res => res.json())
			.then(data => {

				let Movies = Object.values(data);
				if (Movies[0] !== "False"){

					Movies[0].map(film => {
						return {
							// eslint-disable-next-line no-underscore-dangle
							"Id": `O_${film._id}`,
							"Title" : film.Title,
							"Released" : film.Released,
							"Poster": film.Poster
						};

					});
					res.send({"Movies": Movies[0]});
				} else {

					try {
						MongoClient.connect(uri, (err, db) => {
							if (err) {
								throw err;
							}
							let ObjectDB = db.db("MyOwnMovies");

							//$options : "i" key insensitive le da igual mayuscula o minuscula
							//$regex : .*${FronTitle}.* puede contener algo o no por delante y por detras
							ObjectDB.collection("Movies").find({"Title": {"$regex": `.*${FronTitle}.*`, "$options": "i"}})
								.toArray((err, result) => {

									if (result.length && !err){
										let myMongoData = result.map(film =>{
											return {
												// eslint-disable-next-line no-underscore-dangle
												"_Id": `M_${film._id}`,
												"Title" : film.Title,
												"Released" : film.Released,
												"Poster": film.Poster
											};
										});
										res.send({"Movies" : myMongoData});
									} else {
										res.send({"msg": "NotExist"});
									}

									db.close();
								});
						});
					} catch (e) {
						return {"msg" : "ErrorConnection with MongoDB"};
					}
				})
				.catch({"msg" : "ErrorConnection with Omdb"});
		} else {
			res.send({"msg" : "Empty Title"});
		}
	}
});

serverObj.get("/FoundMovie/:Movie", (req, res) => {

	let movieSelected = req.params.Movie;

	if (movieSelected !== null){
		if (movieSelected[0] === "O"){

			const cropPosition = 2;
			const id = movieSelected.substr(cropPosition);

			fetch(`http://www.omdbapi.com/?i=${id}&apikey=4c909483`)
				.then(res => res.json())
				.then(data =>{

					if (data) {
						res.send(data);
					} else {
						res.send({"msg" : "NoData"});
					}
				})
				.catch(() => res.send({"msg" : "Error"}));

		} else if (movieSelected[0] === "M"){

			try {
				MongoClient.connect(uri, (err, db) => {

					if (err) {
						throw err;
					}

					let ObjectDB = db.db("MyOwnMovies");
					ObjectDB.collection("Movies").find({"_Id": {"$regex": `M_${movieSelected}`}})
						.toArray((err, result) => {

							if (result.length && !err){
								res.send(result);
							} else {
								res.send({"msg": "NotExist"});
							}

							db.close();
						});
				});

			} catch (e) {
				res.send({"msg" : "ErrorConnection with MongoDB"});
			}
		} else {
			res.send({"msg" : "IncorrectId"});
		}
	} else {
		res.send({"msg" : "NoId"});
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
	/*id_token
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
serverObj.post("/login", (req, res) => {
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
			const sql = "SELECT USRID, IDAUTH, TOKEN FROM oauth2 WHERE EMAIL LIKE ?";
			conectionDB.query(sql, [req.body.user], function (err, result) {
				if (err){
					throw err;
				} else if (result.length){
					if (result[0].PASS === req.body.pass){
						//Generate JWT
						const Payload = {
							"user" : req.body.user,
							"profile" : result[0].IDAUTH,
							"iat" : new Date()
						};
						const jwt = JWT.buildJWT(Payload);
						//Grant access based on profile
						switch (result[0].IDAUTH) {
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
			conectionDB.close();
		})
			.catch((fail) => {
				res.send({"res" : "0", "msg" : "Unable to connect to database"});
			});
	}
});
	}
	return null;
	//JWT

}