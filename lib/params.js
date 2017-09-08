'use strict';
const rgxTerm = /\/:(\w+)/g;
const strTerm = String.raw`\/(\w+)`;

module.exports = function params(str) {
  const terms = [];
  const tmpl = str.replace(rgxTerm, (chunk, term) => {
    terms.push(term);
    return strTerm;
  });

  if (terms.length === 0)
    return ctx => ctx.pathname === str;

  const rgx = new RegExp(tmpl);
  return ctx => {
    const match = ctx.pathname.match(rgx);
    if (match)
      terms.forEach((name, i) => ctx.params[ name ] = match[ i + 1 ]);
    return !!match;
  }
}