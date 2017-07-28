'use strict';

const { ObjectID } = require('mongodb');
const makerr = require('./makerr');

class Model {
  constructor(name, col) {
    this.col = col
    this.name = name
  }

  async list(query) {
     const cursor = this.col.find(query)
     const total = await cursor.count()
     const result = await cursor.toArray()
     return { ok: true, result, total }
  }

  async find(id) {
     const result = await this.col.findOne(ObjectID(id))
     return { ok: true, result }
  }

  async remove(id) {
     try {
       const result = await this.col.remove({ _id: ObjectID(id) })
       return { ok: true, result }
     } catch (e) {
       return makerr(e)
     }
  }

  async create(doc) {
    try {
      const { ops } = await this.col.insertOne(doc)
      const [ result ] = ops
      return { ok: true, result }
    } catch (e) {
      return makerr(e)
    }
  }

  static make(model, method, prop) {
    return async ctx => {
      const body = await model[ method ](ctx[ prop ] || ctx.pathname.split('/').pop())
      ctx.code = body.ok ? 200 : 400
      ctx.type = 'json'
      ctx.body = body
    }
  }
}

async function Route(DB, name) {
  const col = await DB.collection(name)
  const model = new Model(name, col)
  return {
    col, model,
    remove: Model.make(model, 'remove'),
    find: Model.make(model, 'find'),
    list: Model.make(model, 'list', 'query'),
    create: Model.make(model, 'create', 'payload'),
  }
}


module.exports = { Model, Route }
