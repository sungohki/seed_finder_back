import dotenv from 'dotenv';
import app from './app';

// Load environment variables
dotenv.config();

// Retrieve the port number
const port = process.env.PORT || 3000;
const host = process.env.DOMAIN || "localhost";

// Open server with port number
app.listen(port, () => {
  console.log(`Server is open at http://${host}:${port}`);
});
