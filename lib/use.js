'use strict';

const { METHODS } = require('http')

module.exports = use

function use(m, u, cb) {
  if ('function'===typeof m)
    return m

  const terms=[ ]

  if ('string'===typeof m)
    terms.push(x => m===x.method)

  if ('function'===typeof u)
    cb = u, u = null;

  else if ('string'===typeof u)
    terms.push(x => u === x.pathname)

  else if (u instanceof RegExp)
    terms.push(x => u.test(x.pathname))

  return (req, res, next) => {
    if (terms.every(fx => fx(req)))
      cb(req, res, next)
    else
      next()
  }
}

function use(...args) {
  let cb, terms = []

  args.forEach(x => {
    if (['GET','POST','PUT'].includes(x))
      terms.push(ctx => x===ctx.method)
    else if (x instanceof RegExp)
      terms.push(ctx => x.test(ctx.pathname))
    else if ('string'===typeof x)
      terms.push(ctx => x===ctx.pathname)
    else if ('function'===typeof x)
      cb = x
  })

  if ('function'!=typeof cb)
    throw new Error('missing callback')

  return terms.length ? (ctx, next) => {
      if (terms.every(fx => fx(ctx)))
        return cb(ctx, next)
      else
        return next()
    } : cb
}

