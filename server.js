require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const journalRoutes = require('./routes/journal.routes');
const errorMiddleware = require('./middleware/error.middleware');
const sequelize = require('./config/db.config');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const app = express();
const port = process.env.PORT || 3000;

const swaggerDocument = yaml.load(path.join(__dirname, 'docs/swagger.yaml'));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({ message: 'Journal Microservice is running' });
});
app.use('/auth', authRoutes);
app.use('/journals', journalRoutes);
app.use(errorMiddleware);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`API docs available at http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
