'use strict';

module.exports = (x) => {

  if (!(x instanceof Error))
    x = new Error(x)

  const { message, stack, name } = x
  return {
    ok: false, message, stack, name
  }
}