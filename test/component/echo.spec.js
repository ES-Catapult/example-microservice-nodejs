const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const request = require('supertest');
const nock = require('nock');
const { app } = require('../../server');

test('handles strangers', (t) => {

  request(app)
    .get('/echo')
    .set('Content-type', 'application/json')
    .end((err, res) => {

      t.equals(res.status, 200);
      t.equals(res.body.message, 'Hello there stranger!')

      t.end();
    });

});

test('handles friends', (t) => {

  request(app)
    .get('/echo?name=Deyna')
    .set('Content-type', 'application/json')
    .end((err, res) => {

      t.equals(res.status, 200);
      t.equals(res.body.message, 'Hello Deyna!')

      t.end();
    });

});
