'use strict';

const Fs = require('fs');
const Path = require('path');
const Mim = require('./types');

module.exports = statiq;
function statiq(basedir=process.cwd(), moc={}) {
  return ctx => new Promise(done => {
    const path = Path.join(basedir, moc[ ctx.pathname ] || ctx.pathname);

    Fs.stat(path, (err, stats) => {
      if (err || !stats.isFile())
        return done(ctx.code = 404);
      ctx.code = 200
      ctx.set('last-modified', stats.mtime.toUTCString())
      ctx.type = Mim.ext(path)
      ctx.body = Fs.createReadStream(path)
      done()
    })
  })
}