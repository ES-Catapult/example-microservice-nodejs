function echo(name = '') {
  return name === '' ? 'Hello there stranger!' : `Hello ${name}!`;
}

module.exports = echo;
