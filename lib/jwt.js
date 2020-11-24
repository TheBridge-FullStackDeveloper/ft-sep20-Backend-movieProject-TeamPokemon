//MODULES REQUIRED
const base64 = require("base-64");
const crypto = require("crypto");

/*
JWT stands for Javascript Web Token and essentially is a string that is created by the
server, then sent to the browser and stored in it, usually as a cookie.
The magic is hidden inside itself as it has been encrypted using a special data called "secret"
only known by the server. Those data can be used to verify the integrity of the token in order
to reject it in case of change or manipulation.
The structure of the JWT is B64U(HEADER).B64U(PAYLOAD).B64U(SIGNATURE):
  - HEADER: json object encoded with base64url
      {
        "alg": "HS256", encryption algorithm
        "typ": "JWT" type of token
      }
  - PAYLOAD: json object encoded with base64url. Any set of data but there are some usual included such as "iat"
      {
        "user" : "mmm",
        "profile" : "mmmm",
        "iat" : new Date() current time used to control token expiration
      }
  - SIGNATURE: string encrypted with "secret": "HEADER BASE64URLENCODED.PAYLOAD BASE64URLENCODED"
*/
//HEADER.PAYLOAD.SIGNATURE
//const SECRET = crypto.randomBytes(32).toString("hex");
const SECRET = "c1841be5e43746a2dd4b8915f439fe6c31d124a89829b40bca504f305291b170";
const Header = {
	"alg": "HS256",
	"typ": "JWT"
};
/*
In common situations we use a keyboard to enter string characters.
Nevertheless, computers only understand binary digits (0/1). They simply don´t know what a "s" or "%"
characters are. So, there has to be a method to represent all those characters in terms of binary digits
for computer understanding. This is called "encoding".
In early days, the American Standard Code for Information Interchange (ASCII) coding was created.
This, uses 7 bits to encode, and with these 7 bits 2^7 = 128 characters can be encoded. There is one character
from 0 to 127. The last eighth bit was not use for encoding but for error detection as a parity bit.
At that time, this ASCII code was enough for typical english language characters, the numbers, some punctuation
and usual symbols. But some time later, with the expansion of computing, these 128 characters became unsufficient
as there were many other characters mainly from european languages that were not represented among those initial
128 ASCII codes. There were accented letters, special characters as "ñ", "ç" and so on.
A way to cope with this situation was to use the additional parity bit for enconding as well, so the number of
possible codes got doubled to 256.
In order to send data between computers and been able to handle those data, it became useful to change the encoding in order to transform all the data series into a writable string. So, it is necessary to encode using only writable characters from the ASCII table. This is because inside the ASCII table are many characters that
cannot be written such as "space", "back", "carriage return" and some others.
In order to use only writable characters, a set of 6-bit characters were taken from the ASCII table.
With these 6 bits 2^6 = 64 characters can be coded, and that is the origin of Base64 encoding scheme.
These characters are all latin letters a-z, A-Z, the numbers 0-9, the "+" and "/" symbols and the "=" symbol
which has a special use in the encoding.
Using this encoding, any stream of bytes can be encoded with writable characters. For example, an image can be
encoded and transmitted using this scheme.
The encoding is simple, just group the bits into groups of 6 bits, and assign a character to them. If the final
set of bits is less than 6, null (0) characters (represented by "=") are added to complete.
Later, with the use of URL and HTML documents, the special characters "+" and "/" had a special meaning so a
slightly modification was made to change the "+" character into "-", the "/" into "_" and trimming the final "="
padding characters. This became the Base64Url encoding used in JWT.
*/
const base64Encode = (strTarget) => {
	return base64ToUrl(base64.encode(strTarget));
};

const base64ToUrl = (strTarget) => {
	return strTarget.replace(/=/g, "").replace(/\+/g, "-")
		.replace(/\//g, "_");
};

const base64Decode = (str64Target) => {
	return base64.decode(str64Target);
};

/*
The signature is created by encrypting the header and the payload altogheter separated by a point, using the
algorithm indicated in the header with the "secret". This secret is a string stored in the server and is utilized
in every JWT generated.
createHmac generates an HMAC object based on algorithm and key. Update applies the passed string to the HMAC.
It can be called multiple times as long as new string data is given. When the complete stream is finished, the
call to digest creates the final encryption.
*/
const encrypt = (str, key) => {
	return base64ToUrl(crypto.createHmac("SHA256", key).update(str)
		.digest("base64"));
};

const buildJWT = (payload) => {
	const jwtData = `${base64Encode(JSON.stringify(Header))}.${base64Encode(JSON.stringify(payload))}`;
	return `${jwtData}.${encrypt(jwtData, SECRET)}`;
};

module.exports = buildJWT;