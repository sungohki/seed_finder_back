// Import node module
import app from './app';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

// Import local module
import { swaggerOptions } from './swagger/swagger';

// Setting PORT number
const port = process.env.PORT || 3000;
const host = process.env.DOMAIN || 'localhost';

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Open server with port number
app.listen(port, () => {
  console.log(`Server is open at http://${host}:${port}`);
});
