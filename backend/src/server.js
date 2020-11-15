'use strict';

const cors = require('cors');
const express = require('express');

const tasksAPI = require('./task/api');
const sql = require('./sql');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Create app
const app = express();

async function start() {
    // Initialize SQL service
    await sql.init(process.env.DB_USER, process.env.DB_HOST, process.env.DB_NAME);

    // Setup cors
    app.use(cors())

    // Setup routes
    app.use('/tasks', tasksAPI.router(express));

    // Setup models
    require('./task/model').init();

    // Start server
    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
}

start();