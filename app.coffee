express = require('express')
io      = require('socket.io')
fs      = require('fs')
app     = express.createServer()

app.use(express.static("#{__dirname}/public"))
app.use(app.router)
app.get('/', (request, response) ->
  response.sendfile(__dirname + '/index.html')
)

socket = io.listen(app)

app.listen(2488)

socket.on 'connection', (socket) ->

  socket.on 'publish',   (message) ->
    io.sockets.send message

  socket.on 'broadcast', (message) ->
    socket.broadcast.send message

  socket.on 'whisper',   (message) ->
    socket.broadcast.emit 'secret', message

  socket.on 'move',      (message) ->
    #Make_Move()
    socket.broadcast.send message
