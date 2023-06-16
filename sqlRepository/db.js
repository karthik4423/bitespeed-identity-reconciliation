const mysql = require('mysql');
const util = require('util');
const dbConfig = require('../config');
const connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
  if (err) {
    console.log('error occurred while connecting', err);
  } else {
    console.log('connection created with Mysql successfully');
  }
});

const query = util.promisify(connection.query).bind(connection);

module.exports = query;
