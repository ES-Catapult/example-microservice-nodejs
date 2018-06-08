const test = require('tape');
const echo = require('../../src/echo')

test('echos name', t => {

  t.equals(echo('Deyna'), 'Hello Deyna!')

  t.end();

})

test('handles empty argument', t => {

  t.equals(echo(), 'Hello there stranger!')

  t.end();

})