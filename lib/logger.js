'use strict';

module.exports = async (ctx, next) => {
    const start = new Date
    await next()
    console.log(start.toLocaleTimeString('en-gb'), ctx.code, ctx.method, ctx.url);
  }