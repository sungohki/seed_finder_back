import mariadb, { Connection } from 'mysql2';

export const connection: Connection = mariadb.createConnection({
  host: 'localhost',
  // host: '127.0.0.1',
  port: 3308,
  user: 'root',
  password: '9604',
  database: 'seedfinder',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
