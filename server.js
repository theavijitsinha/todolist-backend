'use strict';

const express = require('express');
const bodyParser = require('body-parser');
require('express-resource');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json());
app.resource('tasks', require('./task'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);