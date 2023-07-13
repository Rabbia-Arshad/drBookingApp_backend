var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'username', //Your Database User Name
	password: 'password', // Your Database Password
	database:'booking_app'
});
connection.connect(function(error){
	if(error) {
		console.log(error);
        throw error;
	} else {
		console.log('Database Connected Successfully..!!');
	}
});

module.exports = connection;
