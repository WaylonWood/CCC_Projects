const express = require('express');
const morgan = require('morgan');
const path = require('path');

const topSpots = require('./data.json');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));

// Serves the main page with top spots information
app.get('/', (req, res) => {
    res.status(200).send("Top Spots Data");
});

// Returns the top spots data as JSON
app.get('/data', (req, res) => {
  res.json(topSpots);
});

module.exports = app;
