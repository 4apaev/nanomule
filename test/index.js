global.log = console.log;
global.Mule = require('../lib/app')
global.chai = require('chai');
global.should = chai.should();

chai.use(require('chai-http'));

require('./use');
require('./base');
require('./params');
require('./db');
require('./geo');