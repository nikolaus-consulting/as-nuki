'use strict';
// Configuration
global.config = require('./config/config');

// Logging
const  {systemLogger, accessLogger} = require('./utils/logger') 

// Nuki Service
let nuki = require('./services/nuki/nuki');