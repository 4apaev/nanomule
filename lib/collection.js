'use strict';
const { ObjectID } = require('mongodb')


module.exports = class Collection {
  constructor(name, collection) {
    this.name = name
    this.$ = collection
  }

  index(...args) {
    return this.$.createIndex(...args)
  }

  near(...args) {
    return this.$.geoNear(...args)
  }

  list(query) {
    return this.$.find(query).toArray()
  }

  find(id) {
    return this.$.findOne(ObjectID(id))
  }

  update(doc) {
    const oid = { _id: ObjectID(doc._id) }
    delete doc._id
    return this.$.update(oid, doc)
  }

  remove(id) {
    return this.$.remove({ _id: ObjectID(id) })
  }

  create(doc) {
    return this.$.insertOne(doc).then(x => x.ops[ 0 ])
  }

  fill(docs) {
    return this.$.insertMany(docs)
  }

  route(func, cb) {
    return async ctx => {
      try {
        const result = await this[ func ](cb(ctx))
        ctx.json({ ok: true, result })
      } catch (e) {
        ctx.throws(500, e)
      }
    }
  }
}