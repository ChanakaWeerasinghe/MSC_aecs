
// Importing MySQL module
const mysql = require("mysql");

// Creating connection

let db_con = mysql.createConnection({
    host: "database-1.cadc4yc6usnh.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "IT13055004",
    database: "aecs_db"
});



// Connect to MySQL server
db_con.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !!!", err);
    } else {
        console.log("connected to Database");
    }
});

module.exports = db_con;
