'use strict';
const makerr = require('./makerr');

module.exports = (ctx, next) => {
  return new Promise((done, fail) => {
    let body = '';
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', x => body += x);
    ctx.req.once('end', x => done(body));
    ctx.req.once('error', fail);
  })
    .then(x => next(ctx.payload = JSON.parse(x)))
    .catch(e => {
      ctx.code = 400;
      ctx.body = makerr(e);
    })
}