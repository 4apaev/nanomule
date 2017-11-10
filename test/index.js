global.log = console.log;

global.Mule = require('../lib/app')
global.ReqBody = require('../lib/body')

global.chai = require('chai');
global.should = chai.should();

chai.use(require('chai-http'));

require('./use');
require('./base');
require('./params');
require('./types');
require('./errors');
require('./static');
require('./db');


