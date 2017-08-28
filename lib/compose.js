'use strict';
module.exports = arr => (ctx, next) => {
  let j = -1;
  return dispatch(0);
  function dispatch(i) {
    if (i <= j)
      return Promise.reject(new Error('next() called multiple times'));
    let fn = arr[ j = i ];
    if (i === arr.length)
      fn = next;
    if (!fn)
      return Promise.resolve();
    try {
      return Promise.resolve(fn(ctx, function next() {
        return dispatch(i + 1);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}