require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));

const cache = {};

// Checks if cached data is older than one day
const isStale = (timestamp) => {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return (Date.now() - timestamp) > ONE_DAY;
};

// Fetches movie data from OMDb API with caching
app.get('/', async (req, res) => {
  const { i, t } = req.query;

  const key = i || t;
  if (!key) return res.status(400).send({ error: 'Provide ?i=ID or ?t=TITLE' });

  if (cache[key] && !isStale(cache[key].timestamp)) {
    return res.json({ ...cache[key].data, cached: true });
  }

  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: process.env.OMDB_API_KEY,
        i,
        t
      }
    });

    cache[key] = {
      data: response.data,
      timestamp: Date.now()
    };

    res.json({ ...response.data, cached: false });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch data' });
  }
});

module.exports = app;
