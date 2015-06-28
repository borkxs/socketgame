var socketio    = require('socket.io'),
    _           = require('underscore'),
    fs          = require('fs'),    
    io,
    guestNumber     = 1,
    nickNames       = {},
    namesUsed       = [],
    currentRoom     = {}

exports.listen = function(server) {
    io = socketio.listen(server);
    // io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        // guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
        handleMoves(socket)
    })
}


function handleMoves(socket, nickNames) {
    socket.on('message', function(message) {
        socket.emit('message', message )
    })
}