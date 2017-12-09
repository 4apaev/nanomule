'use strict';
const { MongoClient } = require('mongodb');
const Collection = require('./collection');

module.exports = class DB {
  async connect(name) {
    const client = await MongoClient.connect(`mongodb://localhost:27017/`);
    this.db = client.db(name)
    return this;
  }
  async define(name, validator) {
    if (name in this)
      await this.db.dropCollection(name);
    const col = await this.db.collection(name, { validator });
    return this[ name ] = new Collection(name, col);
  }
}