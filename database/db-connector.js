/*
    Filename: db-connector.js
    Author: Akaash Bella, Raahi Vaidya
    Date: August 10, 2023
    Language: JavaScript
    Description:
        This module sets up a connection pool to a MySQL database using the 'mysql' library.
        It provides a way to interact with the database by exporting the connection pool for use
        in other parts of the application. The module contains database credentials and configuration.
*/

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : '',
    password        : '',
    database        : ''
})

// Export it for use in our application
module.exports.pool = pool;