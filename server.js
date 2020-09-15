'use strict';

const express = require('express');
const fs = require('fs');

const tasksAPI = require('./task/api');
const sql = require('./sql');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Create app
const app = express();

// Initialize SQL service
sql.init(process.env.DB_USER, process.env.DB_HOST, process.env.DB_NAME);

// Setup routes
app.use('/tasks', tasksAPI.router(express));

// Setup models
require('./task/model').init();

// Start server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);