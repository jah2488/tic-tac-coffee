(function() {
  var app, express, fs, io, socket;

  express = require('express');

  io = require('socket.io');

  fs = require('fs');

  app = express.createServer();

  app.use(express.static("" + __dirname + "/public"));

  app.use(app.router);

  app.get('/', function(request, response) {
    return response.sendfile(__dirname + '/index.html');
  });

  socket = io.listen(app);

  app.listen(2488);

  socket.on('connection', function(socket) {
    socket.on('publish', function(message) {
      return io.sockets.send(message);
    });
    socket.on('broadcast', function(message) {
      return socket.broadcast.send(message);
    });
    socket.on('whisper', function(message) {
      return socket.broadcast.emit('secret', message);
    });
    return socket.on('move', function(message) {
      return socket.broadcast.send(message);
    });
  });

}).call(this);
