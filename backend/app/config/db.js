import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "193.203.184.248",
  user: "u955243699_whizlancer",
  password: "~I*c3gsv1H",
  database: "u955243699_whizlancer",
  waitForConnections: true,
  connectionLimit: 20,
  connectTimeout: 3000,  
  acquireTimeout: 3000,  
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

