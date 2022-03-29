const mysql = require("mysql");

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  charset: "utf8mb4"
});

conn.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Mysql connected!", conn.threadId);
  }
});

module.exports = conn;
