var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "123456",
  database: "blog"
});

exports.query = sqlStr => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) return reject(err);
      // Use the connection
      connection.query(sqlStr, function(error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) return reject(error);
        // Don't use the connection here, it has been returned to the pool.
        resolve(results);
      });
    });
  });
};
