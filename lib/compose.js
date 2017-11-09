'use strict';

module.exports = arr => (ctx, next) => {
  let j=-1
  return dispatch(0);
  function dispatch(i) {
    let fn = i === arr.length
      ? next
      : arr[ j = i ];
    return Promise.resolve(fn && fn(ctx, () => dispatch(i + 1)));
  }
}