import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;


// export const db = mysql.createPool({
//   host: "193.203.184.248",
//   user: "u955243699_whizlancer",
//   password: "~I*c3gsv1H",
//   database: "u955243699_whizlancer",
//   waitForConnections: true,
//   connectionLimit: 10,
// });

