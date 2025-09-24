const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Logs all incoming requests to console and CSV file
app.use((req, res, next) => {
  const agent = req.get('User-Agent') || '';
  const time = new Date().toISOString();
  const method = req.method;
  const resource = req.url;
  const version = `HTTP/${req.httpVersion}`;
  const status = 200;
  
  const cleanAgent = agent.replace(/,/g, ' ');
  const logLine = `${cleanAgent},${time},${method},${resource},${version},${status}\n`;
  
  console.log(logLine.trim());
  
  const logPath = path.join(__dirname, 'log.csv');
  fs.appendFile(logPath, logLine, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

// Returns all logged requests as JSON
app.get('/logs', (req, res) => {
  const logPath = path.join(__dirname, 'log.csv');
  
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read log file' });
    }
    
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const logs = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const logEntry = {};
        headers.forEach((header, index) => {
          logEntry[header] = values[index];
        });
        logs.push(logEntry);
      }
    }
    
    res.json(logs);
  });
});

module.exports = app;
