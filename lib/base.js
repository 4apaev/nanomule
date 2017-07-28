const { log } = console

const Emitter = require('events');
const Compose = require('./compose');
const Context = require('./context');
const Respond = require('./respond');
const makerr = require('./makerr');
const Mim = require('./types');

class App  extends Emitter {
  constructor() {
    super()
    this.middleware = [ ]
  }

  init() {
    const fn = Compose(this.middleware);

    return (req, res) => {

      const ctx = this.ctx = new Context(req, res)
      ctx.code = 404;

      return fn(ctx)
              .then(() => Respond(ctx))
              .catch(e => {
                ctx.code = 500
                ctx.body = makerr(e)
                Respond(ctx)
              })
    }
  }

  use(m, u, cb) {

    if ('function'===typeof m) {
      this.middleware.push(m)
      return this
    }

    const terms=[ ]

    if ('string'===typeof m)
      terms.push(x => m===x.method)

    if ('function'===typeof u)
      cb = u, u = null;

    else if ('string'===typeof u)
      terms.push(x => u === x.pathname)

    else if (u instanceof RegExp)
      terms.push(x => u.test(x.pathname))

    this.middleware.push((ctx, next) => {
      if (terms.every(fx => fx(ctx))) {
        //log(cb.toString())
        return cb(ctx, next)
      }
      else
        return next()
    })
    return this
  }

  get(url, cb) {
    return this.use('GET', url, cb)
  }

  post(url, cb) {
    return this.use('POST', url, cb)
  }
  del(url, cb) {
    return this.use('DELETE', url, cb)
  }

}

module.exports = App

