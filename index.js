//------------------ GLOBALS -------------------//

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
const mongo = require("mongodb");

const MongoClient = mongo.MongoClient;
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
	//PHONE
	validatorOutput = validator.ValidatePhone(data.phone, /^(\+34 )*\d{9}$/);
	if (!validatorOutput.ret){
		return validatorOutput.msg;
	}
	return true;
};

//------------------ ROUTING -------------------//
//REGISTER USER (POST)
serverObj.post("/register", (req, res) => {
	//Validate new user data
	const validationResults = validateRegisterData(req.body);
	if (validationResults !== true) {
		res.send({"res" : 0, "msg" : validationResults.msg});
	} else {
		//Check out if user is already registered TODO
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
						//eslint-disable-next-line no-console
						console.log("error de conexión a la bd");
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
					//eslint-disable-next-line no-console
					console.log("Could not connect to data base");
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
				//eslint-disable-next-line no-console
				console.log("Could not connect to data base");
			});
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
				if (FronTitle === data.Title) {

					let moviesFromObdb = {
						"Title" : data.Title,
						"Year" : data.Year,
						"imdbID" : data.imdbID,
						"Poster" : data.Poster
					};

					res.send({"msg" : "Movie Omdb Found", "MovieOmdb": moviesFromObdb});
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

//LOGOUT (POST)
serverObj.post("/logout", (req, res) => {
	//TODO
});