'use strict';
const makerr = require('./makerr');

module.exports = (ctx, next) => {
  let body=''
  return new Promise((done, fail) => {
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', x => body += x);
    ctx.req.on('end', done)
    ctx.req.on('error', fail)
  })
    .then(() => next(ctx.payload = JSON.parse(body)))
    .catch(e => {
        ctx.code = 400
        ctx.body = makerr(e)
      })
}
