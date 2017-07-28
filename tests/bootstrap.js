global.log = console.log


const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
chai.use(chaiHttp)



const Srv = require('../lib/base')
const Body = require('../lib/body')
const { MongoClient } = require('mongodb');


module.exports = { chai, should, expect, Srv, Body, MongoClient }
