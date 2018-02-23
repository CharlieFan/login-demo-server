const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'charliefan.com',
    user: 'root',
    password: 'efemme123',
    database: 'user_info'
});

connection.connect();

// connection