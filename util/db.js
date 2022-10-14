const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'neobanking',
  password: 'root',
  port: 3308
});
connection.connect(function(err) {
  if (err) {
      console.error('Error connecting to MySql Database: ' + err.stack);
      return;
  }
  console.log('Connected as id ' + connection.threadId);
});
module.exports = connection.promise();