//------------------ MODULES -------------------//
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const corsEnable = require("cors");
const cookieParser = require("cookie-parser");
const validatorNode = require("./lib/validatorMoviesNode.class.js");
const JWT = require("./lib/jwt.js");
require("dotenv").config();
//Se puede usar tambien el paquete npm request
const fetch = require("node-fetch");

const MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
const uri = "mongodb+srv://PokemonTeam:5pokemon@pokemon.afmh3.mongodb.net?retryWrites=true&w=majority";
const client = new MongoClient(uri, { "useNewUrlParser": true, "useUnifiedTopology": true });

const {google} = require("googleapis");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET= process.env.GOOGLE_CLIENT_SECRET;
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


//OAUTH


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
	//JWT
}

//REGISTER USER OAUTH (POST)
serverObj.post("registerGoogle", (req, res) => {
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
				const sql = "SELECT USRID, IDAUTH, TOKEN FROM oauth2 WHERE EMAIL LIKE ?";
				conectionDB.query(sql, [req.body.email], function (err, result) {
					if (err){
						throw err;
					} else if (result.length){
						//User found already in db
						res.send({"res" : "0", "msg" : "Usuario ya registrado!"});
					} else {
						//Proceed to store user in db table
						const [values] = req.body;
						const sql = "INSERT INTO oauth2 VALUES (NULL, ?, ?, ?, ?, ?, ?)";
						conectionDB.query(sql, values, function (err) {
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
				.catch(() => {
					res.send({"res" : "0", "msg" : "Error connection to database"});
				});
		}
	}
});

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
				client.connect((err, db) => {
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
	//!JWT.checkJWT(req.cookies("JWT"))) {
	if (false){
		res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	} else {
		//Validate movie data
		const validationResults = validateMovieData(req.body);
		if (validationResults !== true) {
			res.send({"res" : 0, "msg" : validationResults.msg});
		} else {
			try {
				client.connect((err, db) => {
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
				client.connect((err, db) => {
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


serverObj.get("/redirectGoogle", (req, res) => {
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
		if (FronTitle !== null) {
			//s= devuelve listado de peliculas que contienen esapalabra que buscaste
			fetch(`http://www.omdbapi.com/?s=${FronTitle}&apikey=${process.env.OmdbApiKey}`)
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
							client.connect((err, db) => {
								if (err) {
									throw err;
								}
								let ObjectDB = db.db("MyOwnMovies");
								//$options : "i" key insensitive le da igual mayuscula o minuscula
								//$regex : .${FronTitle}. puede contener algo o no por delante y por detras
								ObjectDB.collection("Movies").find(`{"Title": {"$regex": .*${FronTitle}.*, "$options": "i"}}`)
									.toArray((err, result) => {
										if (result.length && !err){
											let myMongoData = result.map(film =>{
												return {
													// eslint-disable-next-line no-underscore-dangle
													"Id": `M_${film._id}`,
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
					}
				})
				.catch({"msg" : "ErrorConnection with Omdb"});
		} else {
			res.send({"msg" : "Empty Title"});
		}
	}

});

function findMovieById(movieSelected) {
	return new Promise((resolve) => {
		if (movieSelected !== null){
			const cropPosition = 2;
			const id = movieSelected.substr(cropPosition);
			if (movieSelected[0] === "O"){

				fetch(`http://www.omdbapi.com/?i=${id}&apikey=${process.env.OmdbApiKey}`)
					.then(res => res.json())
					.then(data =>{


						if (data) {
							const {Title, Director, Actors, Genre, Plot, Runtime, Language, Released} = data;
							resolve({Title, Director, Actors, Genre, Plot, Runtime, Language, Released, "Id": movieSelected});
						} else {
							resolve({"msg" : "NoData"});
						}
					})
					.catch(() => resolve({"msg" : "Error"}));

			} else if (movieSelected[0] === "M"){

				try {
					client.connect((err, db) => {

						if (err) {
							throw err;
						}

						let ObjectDB = db.db("MyOwnMovies");
						ObjectDB.collection("Movies").findOne({"_id": ObjectId(id)}, (err, result) => {
							if (result && !err){
								const {Title, Director, Actors, Genre, Plot, Runtime, Language, Released} = result;
								resolve({Title, Director, Actors, Genre, Plot, Runtime, Language, Released, "Id": movieSelected});
							} else {
								resolve({"msg": "NotExist"});
							}

							db.close();
						});
					});

				} catch (e) {
					resolve({"msg" : "ErrorConnection with MongoDB"});
				}
			} else {
				resolve({"msg" : "IncorrectId"});
			}
		} else {
			resolve({"msg" : "NoId"});
		}
	});
}


serverObj.get("/FoundMovie/:Movie", async (req, res) => {
	res.send(await findMovieById(req.params.Movie));
});
// serverObj.get();

//LOGOUT (POST)
//
// serverObj.get("/logout", (req, res) => {
// 	//TODO
// });

serverObj.post("/AddMovieFav/:UserId/:IdMovie", (req, res) => {

	// if (!JWT.checkJWT(req.cookies("JWT"))) {
	// 	res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	// } else {

	let movieId = req.params.IdMovie;
	let ExtUserId = req.params.UserId;

	if (movieId !== null && ExtUserId !== null){

		const conectionDB = mysql.createConnection({
			"host": "34.89.115.151",
			"user": "root",
			"password": "JhMcl9BlvHNnF2v8",
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
				//req.params no es iterable por tanto hay que convertirlo a array
				const values = Object.values(req.params);
				const sql = "SELECT EXT_USRID FROM bookmarks WHERE EXT_USRID LIKE ? AND REFID LIKE ?";

				conectionDB.query(sql, values, (err, result) => {
					if (err){
						throw err;
					} else if (result.length){
						//Movie found already in db
						res.send({"res" : "0", "msg" : "Movie already added in fav"});
					} else {
						//Proceed to store user in db table
						const values = Object.values(req.params);
						//QUESTION Debo poner las interrogaciones aqui? que es exactamente el sql inyection
						const sql = "INSERT INTO bookmarks(EXT_USRID, REFID) VALUES (?, ?)";

						conectionDB.query(sql, values, (err) => {
							if (err){
								throw err;
							} else {

								res.send({"res" : "1", "msg" : "Movie added to favourites"});
							}

						});
					}

					conectionDB.end();
				});
			})

				.catch((err) => {
				// eslint-disable-next-line no-console
					console.log(err);
					res.send({"res" : "0", "msg" : "Error connection to database"});
				});
		}
	}

	// }
});

serverObj.delete("/DeleteMovieFav/:UserId/:IdMovie", (req, res) =>{

	// if (!JWT.checkJWT(req.cookies("JWT"))) {
	// 	res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	// } else {

	const movieId = req.params.IdMovie;
	const ExtUserId = req.params.UserId;

	if (movieId !== null && ExtUserId !== null){

		const conectionDB = mysql.createConnection({
			"host": "34.89.115.151",
			"user": "root",
			"password": "JhMcl9BlvHNnF2v8",
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
				//req.params no es iterable por tanto hay que convertirlo a array
				const values = Object.values(req.params);
				const sql = "SELECT EXT_USRID FROM bookmarks WHERE EXT_USRID LIKE ? AND REFID LIKE ?";

				conectionDB.query(sql, values, (err, result) => {
					if (err){
						throw err;
					} else if (result.length){

						const values = Object.values(req.params);
						const sql = "DELETE FROM bookmarks WHERE EXT_USRID = ? AND REFID = ? ";
						conectionDB.query(sql, values, (err) => {
							if (err){
								throw err;
							} else {
								res.send({"res" : "1", "msg" : "Movie deleted from favourites"});
							}
						});

					} else {
						res.send({"res" : "0", "msg" : "Movie not added to favourites yet"});
					}

					conectionDB.end();
				});
			});
		}
	}
	// }

});

serverObj.get("/GetMoviesFav/:UserId", (req, res) =>{

	// if (!JWT.checkJWT(req.cookies("JWT"))) {
	// 	res.send({"res" : 0, "msg" : "Access with credentials not allowed!"});
	// } else {

	const ExtUserId = req.params.UserId;

	if (ExtUserId !== null){

		const conectionDB = mysql.createConnection({
			"host": "34.89.115.151",
			"user": "root",
			"password": "JhMcl9BlvHNnF2v8",
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
				const [values] = Object.values(req.params);
				//QUESTION Debo poner las interrogaciones aqui? que es exactamente el sql inyection
				const sql = "SELECT REFID FROM bookmarks WHERE EXT_USRID LIKE ?";

				conectionDB.query(sql, values, async (err, result) => {
					if (err){
						throw err;
					} else if (result.length) {
						const Favourites = [];
						for (let i = 0; i < result.length; i++) {
							const {Id, Title, Released, Poster} = await findMovieById(result[i].REFID);
							Favourites.push({Id, Title, Released, Poster});
						}

						res.send({"res" : "1", "msg" : "Your fav movies", Favourites});
					} else {
						res.send({"msg": "User doesn't have fav films"});
					}
					conectionDB.end();
				});
			})
				.catch(() => {
					res.send({"res" : "0", "msg" : "Error connection to database"});
				});
		}
	}
	// }
});