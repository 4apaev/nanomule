'use strict';
const Url = require('url');
const Mim = require('./types');

class Context {
  constructor(req, res) {
    const { url, method } = req
    const { path, pathname, search, query, href } = Url.parse(url, true)
    Object.assign(this, { req, res, url, method, path, pathname, search, query, href })
  }

  get body() { return this._body }
  set body(x) { return this._body = x }

  get code() { return this.res.statusCode }
  set code(x) { return this.res.statusCode = x }

  get type() { return this.get('content-type') }
  set type(a) { return this.set('content-type', Mim.get(a)) }

  get length() { return this.get('content-length') }
  set length(a) { return this.set('content-length', a) }

  get cookie() { return this.get('cookie') }
  set cookie(a) { return this.set('cookie', a) }

  is(a) {
    return this.type === Mim.get(a);
  }
  get(a) {
    return this.req.headers[ a.toLowerCase() ];
  }
  set(a, b) {
    if (this.res.headersSent)
      return this;

    if (b != null) {
      this.res.removeHeader(a);
      this.res.setHeader(a, b);
    } else {
      for (let k in a)
        this.set(k, a[ k ]);
    }
    return this
  }
}