const server = require('./app');

server.listen(8484, () => {
  console.log('Todo API server is listening on port 8484');
});
