'use strict';
const { STATUS_CODES } = require('http');

module.exports = class EpicFail extends Error {
  constructor(code, message) {
    super(message);
    Error.captureStackTrace(this, EpicFail);
    this.code = code;
  }
  get json() {
    const { message, stack, name, code } = this
    return { message, stack, name, code, ok:false }
  }

  static make(code, message) {
    if (typeof code==='string' || code instanceof Error)
      return new EpicFail(500, code)

    return new EpicFail(code=500, message=STATUS_CODES[ code ])
  }
}

