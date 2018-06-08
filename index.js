require('dotenv').config({ silent: true });
const { app } = require('./server');

const server = app.listen(process.env.PORT, () => {
  console.log('Server running on port %d', process.env.PORT);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close();
});
