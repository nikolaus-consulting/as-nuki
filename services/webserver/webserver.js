// Logging
const {systemLogger, accessLogger} = require('../../utils/logger')

// Configuration
var config = global.config

// Webserver
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');

// Global Variable
const wsport = config.webserver.port || 3100

// Start Webserver
server.listen( wsport, () => {
    systemLogger.info('Webserver - Running at port ' + wsport)
})

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
var nukiRoutes = require('../../routes/nukiRoutes');
app.use('/nuki', nukiRoutes);