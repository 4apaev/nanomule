'use strict';

module.exports = ({ message, stack, name }) => {
  return {
    ok: false, message, stack, name
  }
}