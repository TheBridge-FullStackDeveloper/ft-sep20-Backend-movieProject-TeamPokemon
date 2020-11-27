//REGISTER USER (POST)
serverObj.post("AUTH", (req, res) => {
	//Validate new user with AUTH
	const validationResults = req.body;
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
	}
});