CREATE DATABASE IF NOT EXISTS movieprojectdb;
USE movieprojectdb;

CREATE TABLE IF NOT EXISTS users (
	USRID smallint NOT NULL AUTO_INCREMENT,
    EMAIL varchar(100) NOT NULL,
    PASS varchar(50) NOT NULL,
    USER_PROFILE varchar(5) NOT NULL DEFAULT 'user',
    DOBIRTH date,
    NIF varchar(9),
    PHONE varchar(13),
    PRIMARY KEY(USRID)
);

CREATE TABLE IF NOT EXISTS bookmarks (
	EXT_USRID smallint NOT NULL,
    REFID varchar(100) NOT NULL,
    PRIMARY KEY(EXT_USRID, REFID),
    FOREIGN KEY (EXT_USRID)
        REFERENCES users(USRID)
        ON DELETE CASCADE
);

<<<<<<< HEAD
-- TABLA DE DATOS DE OAUTH 2.0
=======
-- BASE DE DATOS DE OAUTH2.0
>>>>>>> 328016ee0ee251ad9ccf446f89145cafada15803
CREATE TABLE IF NOT EXISTS oauth2 (
	USRID  smallint NULL AUTO_INCREMENT ,
    `NAME` varchar(50) NOT NULL,
    EMAIL varchar(100) NOT NULL,
    TOKEN varchar(100) NOT NULL,
    IDOAUTH varchar(100) NOT NULL,
    PRIMARY KEY(USRID)
);

DELETE FROM users;
DELETE FROM bookmarks;

ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE bookmarks AUTO_INCREMENT = 1;

INSERT INTO users VALUES (NULL, 'corsarionegro@gmail.com', 'testing6', 'admin', '1977-06-18', '12345678X', '+34 900100200'); 
INSERT INTO users VALUES (NULL, 'usuario@gmail.com', 'testing6', 'user', '1987-06-18', '87654321Z', '+34 123456789');