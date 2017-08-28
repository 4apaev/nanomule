'use strict';

const { MongoClient } = require('mongodb');
const Collection = require('./collection');

module.exports = class DB {

  async connect(name) {
    this.db = await MongoClient.connect(`mongodb://localhost:27017/` + name);
    return this;
  }
  async define(name, validator) {
    if (name in this)
      await this.db.dropCollection(name);
    const col = await this.db.collection(name, { validator });
    return this[ name ] = new Collection(name, col);
  }
}