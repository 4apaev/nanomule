'use strict';
const makerr = require('./makerr');
module.exports = (ctx, next) => ctx.is('json')
  ? new Promise((done, fail) => {
      ctx.payload = '';
      ctx.req.setEncoding('utf8');
      ctx.req.on('data', x => ctx.payload += x);
      ctx.req.once('end', done);
      ctx.req.once('error', fail);
    })
      .then(() => next(ctx.payload = JSON.parse(ctx.payload)))
      .catch(e => {
        ctx.code = e.code = 400;
        ctx.body = makerr(e);
      })
  : next();