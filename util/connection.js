const {createPool} = require('mysql2');
require('dotenv').config();

var pool = null;
function getDBPool() {
  if(pool && !pool._closed) return pool;
    
	//New production
  pool = createPool({
    connectTimeout: 1500,
    host: 'localhost',
    user: 'root',
    database: 'neobanking',
    password: 'root',
    port: 3308,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
  });

  return pool;
}

module.exports = getDBPool;