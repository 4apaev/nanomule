'use strict';
const { ObjectID } = require('mongodb')
const { assign } = Object

const oid = x => 'string'===typeof x ? ObjectID(x) : x
const qid = x => 'string'===typeof x ? { _id: ObjectID(x) } : x

class Collection {
  constructor(name, collection) {
    this.name = name
    this.$ = collection
  }

  get defs() {
    return { returnOriginal: false }
  }

  index(...args) {
    return this.$.createIndex(...args)
  }

  list(...args) {
    return this.$.find(...args).toArray()
  }

  find(q, o) {
    return this.$.findOne(oid(q), assign(this.defs, o))
  }

  remove(q, o) {
    return this.$.findOneAndDelete(qid(q), assign(this.defs, o))
                  .then(x => x.value)
  }

  update(q, doc, o) {
    return this.$.findOneAndUpdate(qid(q), doc, assign(this.defs, o))
                  .then(x => x.value)
  }

  create(doc, o) {
    return this.$.insertOne(doc, assign(this.defs, o))
                .then(x => x.ops[ 0 ])
  }

  route(func, cb) {
    return async ctx => {
      try {
        const result = await this[ func ](cb(ctx))
        ctx.json(200, { result })
      } catch (e) {
        ctx.throws(500, e)
      }
    }
  }
}


module.exports =  Collection