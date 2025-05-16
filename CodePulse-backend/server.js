const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
require('dotenv').config();

// Initialize app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ extended: false, limit: '50mb' }));
app.use(cors());
app.use(morgan('dev'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/projects', require('./routes/api/projects'));
app.use('/api/entities', require('./routes/api/entities'));
app.use('/api/tech', require('./routes/api/tech'));
app.use('/api/structure', require('./routes/api/structure'));
app.use('/api/code', require('./routes/api/code'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));