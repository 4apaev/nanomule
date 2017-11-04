'use strict';
const Http = require('http');
const Emitter = require('events');
const Compose = require('./compose');
const Context = require('./context');
const Respond = require('./respond');
const Params = require('./params');


module.exports = class App extends Emitter {
  constructor() {
    super();
    this.middleware = [  ];
  }

  static async fail(ctx, next) {
    try {
      await next();
    } catch (e) {
      let { code=500 } = ctx
      ctx.throws(code < 400 ? 500 : code, e)
    }
  }

  init() {
    const fn = Compose(this.middleware);
    return async (req, res) => {
      const ctx = this.ctx = new Context(req, res);
      await fn(ctx);
      Respond(ctx);
    }
  }

  listen(...args) {
    return Http.createServer(this.init()).listen(...args);
  }

  use(m, u, cb) {
    if ('function' === typeof m) {
      this.middleware.push(m);
      return this;
    }
    const terms = [];
    if ('string' === typeof m)
      terms.push(x => m === x.method);
    if ('function' === typeof u)
      cb = u, u = null;
    else if ('string' === typeof u)
      terms.push(Params(u));
    else if (u instanceof RegExp)
      terms.push(x => u.test(x.pathname));
    this.middleware.push((ctx, next) => terms.every(fnc => fnc(ctx)) ? cb(ctx, next) : next());
    return this;
  }

  get(url, cb) {
    return this.use('GET', url, cb);
  }

  post(url, cb) {
    return this.use('POST', url, cb);
  }

  del(url, cb) {
    return this.use('DELETE', url, cb);
  }

  put(url, cb) {
    return this.use('PUT', url, cb);
  }
}
