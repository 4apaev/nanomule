'use strict';

const parse = (buf, x) => {
    let [ a, ...b ] = x.split('=');
    buf[ a ] = b.join('=');
    return buf
  }


module.exports = str => str.split('; ').reduce(parse, {})