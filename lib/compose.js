'use strict';
module.exports = arr => (ctx, next) => {
  let j = -1;
  return dispatch(0);
  function dispatch(i) {

    let fn = arr[ j = i ];
    if (i === arr.length)
      fn = next;
    return Promise.resolve(fn && fn(ctx, function next() {
      return dispatch(i + 1);
    }));
  }
}