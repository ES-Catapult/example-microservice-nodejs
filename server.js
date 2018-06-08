const express = require('express');
const bodyParser = require('body-parser');
const echo = require('./src/echo');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const app = express();

const { CONTEXT_ROUTE = '' } = process.env

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
})

// Runs before each requests
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
})

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get(`${CONTEXT_ROUTE}/`, (req, res) => {
  return res.sendStatus(204);
})

app.get(`${CONTEXT_ROUTE}/metrics`, (req, res) => {
  return res.send(client.register.metrics())
})

app.get(`${CONTEXT_ROUTE}/error`, (req, res, next) => {
  next(new Error('Something went wrong :()'))
})

app.get(`${CONTEXT_ROUTE}/echo`, (req, res, next) => {
  const name = req.query.name;

  setTimeout(() => {
    res.json({message: echo(name)});
    return next()
 }, Math.round(Math.random() * 200))
});

// Error handler
app.use((err, req, res, next) => {
  res.statusCode = 500
  // Do not expose your error in production
  res.json({ error: err.message })
  next()
})

// Runs after each requests
app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch

  httpRequestDurationMicroseconds
    .labels(req.method, req.route.path, res.statusCode)
    .observe(responseTimeInMs)

  next()
})

module.exports = {
  app,
};
