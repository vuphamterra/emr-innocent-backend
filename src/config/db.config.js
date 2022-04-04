// Deprecated file - Not needed

'use strict';
const logger = require("../config/logger")
const mysql = require("mysql")
 //local mysql db connection
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'openemr'
});
dbConn.connect(function (err) {
    if (err) throw err;
    logger.debug("Database Connected!");
});
module.exports = dbConn;
