/*
static server
    index := send html with client app scripts
client app
    send join to socket server
socket server
    add user to room
    send joinResult
client app
    create player
    start emitting socket message for mouse movement

other user joining:

*/

var socketio = require('socket.io'),
    _ = require('underscore'),
    fs = require('fs'),
    io,
    guestNumber = 1;//,
    // nickNames = {},
    // namesUsed = [],
    // currentRoom = {}

exports.listen = function(server) {
    io = socketio.listen(server);
    // io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        // guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
        handleJoin(socket)
        handleMoves(socket)
    })
}

function handleMoves(socket, nickNames) {
    socket.on('moveSend', function(message) {
        socket.broadcast.emit('moveGet', {
            top: parseInt(message.top),
            left: parseInt(message.left),
            id: parseInt(message.id)
        })
    })
}

function handleJoin(socket, nickNames) {
    socket.on('join', function(message) {
        // console.log('join',guestNumber++)
        var id = guestNumber++,
            message = { id: id }

        socket.emit('selfJoin', message)
        socket.broadcast.emit('otherJoin', message)
    })
}

// function joinRoom(socket, room) {
//     socket.join(room)
//     currentRoom[socket.id] = room
//     socket.emit('joinResult', {
//         room: room
//     })
//     socket.broadcast.to(room).emit('message', {
//         text: nickNames[socket.id] + ' has joined ' + room + '.'
//     })

//     var usersInRoom = findClientsSocket(room)
//     if (usersInRoom.length > 1) {
//         var usersInRoomSummary = 'users currently in ' + room + ': '
//         for (var index in usersInRoom) {
//             var userSocketId = usersInRoom[index].id
//             if (userSocketId != socket.id)
//                 if (index > 0)
//                     usersInRoomSummary += ', '
//             usersInRoomSummary += nickNames[userSocketId]
//         }
//         usersInRoomSummary += '.'
//         socket.emit('message', {
//             text: usersInRoomSummary
//         })
//     }

//     function findClientsSocket(roomId, namespace) {
//         var res = []
//         , ns = io.of(namespace ||"/");    // the default namespace is "/"

//         if (ns) {
//             for (var id in ns.connected) {
//                 if(roomId) {
//                     var index = ns.connected[id].rooms.indexOf(roomId) ;
//                     if(index !== -1) {
//                         res.push(ns.connected[id]);
//                     }
//                 } else {
//                     res.push(ns.connected[id]);
//                 }
//             }
//         }
//         return res;
//     }
// }