'use strict';
const Fs = require('fs');
const Url = require('url');
const Mim = require('./types');
const Err = require('./makerr');

module.exports = class Context {
  constructor(req, res) {
    const { url, method } = req
    const { path, pathname, search, query, href } = Url.parse(url, true)
    Object.assign(this, { req, res, url, method, path, pathname, search, query, href, params:{ } })
    this.throws = this.throws.bind(this)
  }

  get body() { return this._body }
  set body(x) { return this._body = x }

  get code() { return this.res.statusCode }
  set code(x) { return this.res.statusCode = x }

  get type() { return this.get('content-type') }
  set type(a) { return this.set('content-type', Mim.get(a)) }

  get length() { return this.get('content-length') }
  set length(a) { return this.set('content-length', a) }

  cookie(name, value, opts) {
    if (value!=null) {

      const buf = [ `${ name }=${ value }` ]
      if (opts!=null) {
        const { path, expires, maxage } = opts
        path && buf.push(`Path=` + path)
        expires && buf.push(`Expires=` + expires)
        maxage && buf.push(`Max-Age=` + maxage)
        return this.set('Set-Cookie', buf.join('; '))
      }
    }
    const x = this.get('cookie').split(';').find(x => x.trim().startsWith(name))
    return x ? x.split('=').slice(1).jpin('=') : x;
  }

  throws(code, msg) {
    if (code instanceof Error) {
      msg = code
      code = 500
    }
    this.json(code, Err(msg))
  }

  json(code, data) {
    this.code = code
    this.body = data
    this.type = 'json'
  }

  html(code, data) {
    this.code = code
    this.body = Fs.createReadStream(data)
    this.type = 'html'
  }

  redirect(code, location) {
    this.code = code
    this.set('location', location);
  }

  is(a) {
    return this.type === Mim.get(a);
  }
  get(a) {
    return this.req.headers[ a.toLowerCase() ];
  }
  set(a, b) {
    if (!this.res.headersSent) {
      this.res.removeHeader(a);
      this.res.setHeader(a, b);
    }
    return this
  }
}