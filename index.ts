import dotenv from 'dotenv';
import app from './app';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger/swagger';

// Load environment variables
dotenv.config();

// Retrieve the port number
const port = process.env.PORT || 3000;
const host = process.env.DOMAIN || 'localhost';

// swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Open server with port number
app.listen(port, () => {
  console.log(`Server is open at http://${host}:${port}`);
});
