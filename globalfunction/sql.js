const sqlQuery = (connection, sql, val_arr) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, val_arr, (err, object) => {
            if (err) {
                reject(err)
            } else {
                resolve(object);
            }
        })
    })
}

module.exports = sqlQuery;