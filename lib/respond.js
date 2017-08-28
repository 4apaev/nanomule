'use strict';
const Mim = require('./types');
const Stream = require('stream');

module.exports = function respond(ctx) {
  let { res, body } = ctx;

  if (null == body)
    return res.end();

  if (body instanceof Stream)
    return body.pipe(res);

  let isBuf = Buffer.isBuffer(body);

  if (!isBuf && 'object' === typeof body) {
    if (Mim.json != res.getHeader('content-type'))
      ctx.type = 'json';

    body = JSON.stringify(body);
  }
  if (isBuf || 'string' == typeof body)
    ctx.length = Buffer.byteLength(body);
  return res.end(body);
}