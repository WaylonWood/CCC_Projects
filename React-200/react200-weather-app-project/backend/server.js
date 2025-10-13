import express from 'express';
import axios from 'axios';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.WEATHER_API_KEY;

app.get('/api/search/:city', (req, res) => {
    const cityName = req.params.city;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
            .then(response => res.send(response.data))
            .catch(err => console.log());
});

export default app;