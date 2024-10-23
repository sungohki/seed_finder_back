import mariadb, { Connection } from 'mysql2';

interface IConn extends mariadb.ConnectionOptions {}

export const connInfo: IConn = {
  host: 'localhost',
  // host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'seedfinder',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const connection: Connection = mariadb.createConnection(connInfo);
