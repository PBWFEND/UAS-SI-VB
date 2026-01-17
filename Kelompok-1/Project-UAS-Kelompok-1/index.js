const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

const apiRoutes = require('./routes');

app.use('/api', apiRoutes);

