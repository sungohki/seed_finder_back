import mariadb, { Connection } from 'mysql2';

// // Connection for Localhost
// export const connection: Connection = mariadb.createConnection({
//   // host: 'localhost',
//   host: '127.0.0.1',
//   port: 3306,
//   user: 'root',
//   password: 'root',
//   database: 'seedfinder',
//   dateStrings: true,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Connection for aws ec2
export const connection: Connection = mariadb.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'seedfinder',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
