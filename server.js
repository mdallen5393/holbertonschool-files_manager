const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable JSON request body parsing
app.use(express.json());

// Load routes from routes/index.js
const routes = require('./routes/index');

app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
