/*
- player
    - not necessarily ip unique, could allow multiple windows
    - 
*/

var socket = io.connect()

var colors = [
    '#1592CC',
    '#351725',
    '#38B0C4',
    '#6493A8',
    '#6C5A80',
    '#BB53A2',
    '#FF8508'
]

var players = {}

var actor = function(id, color) {
    return makeActor(color)

    function makeActor(color) {
        var inst = $('<span>')
                     .addClass('actor')
                     .css('background', color)
        inst.id = id
        return inst
    }
}
var color = function() {
    return colors[Math.floor(Math.random() * colors.length)]
}

var buffer = (function() {

    var myBuffer = []

    function buffer_interface(cb) {
        myBuffer.push(cb)
    }
    buffer_interface.shift = function() {
        return myBuffer.shift.apply(myBuffer, arguments)
    }
    buffer_interface.len = function() {
        return myBuffer.length
    }
    return buffer_interface
}())

$(document).ready(function() {
    var $body = $('body'),
        $html = $('html'),
        selfId

    socket.on('moveGet', function(message) {
        // console.log('moveGet', message)
        // handlePositionChange(message.left, message.top, message.id)
        buffer(function() {
            handlePositionChange(message.left, message.top, message.id)
        })
    })

    requestAnimationFrame(function frame(timestamp) {
        if (buffer.len())
            buffer.shift()()
        requestAnimationFrame(frame);
    })

    socket.on('selfJoin', function(message) {
        // join(message.id, true)
        selfId = message.id
    })

    // socket.on('otherJoin', function(message) {
    //     join(message.id)
    // })

    // function join(id, self){
    //     console.log('join id self',id,self)
    //     var player = actor(color())
    //     player.id = id
    //     $body.append(player)
    //     players[id] = player
    //     if (self)
    //         players.self = player
    //     return player
    // }

    socket.emit('join', {
        newRoom: 'home'
    })

    $html.mousemove(handleMouseEvent);

    document.ontouchmove = function (e) {
        e.preventDefault()

        var touch
        touch = e.changedTouches[0]
        socket.emit('moveSend', { top: touch.clientY, left: touch.clientX, id: selfId })
        handlePositionChange( touch.clientX, touch.clientY, selfId )
    }

    function handleMouseEvent(mouseEvent) {

        var x = mouseEvent.clientX,
            y = mouseEvent.clientY

        // todo how to throttle
        socket.emit('moveSend', {
            top: y,
            left: x,
            id: selfId
        })

        return handlePositionChange(x, y)
    }

    function handlePositionChange(x, y, id) {

        return playerById(id).css({
            top: y - 25,
            left: x - 25
        })
    }

    function playerById(id) {
        var player = players[id]
        if (!player) {
            player = players[id] = actor(color())
            player.id = id
            $body.append(player)
            if (player.id == selfId)
                players.self = player
        }
        return player
    }

    function elementDistance(elem1, elem2) {
        var px = elem1.css('top'),
            py = elem1.css('left'),
            bx = elem2.css('top'),
            by = elem2.css('left');

        return distance(px, py, bx, by)
    }

    function distance(px, py, bx, by) {
        px = norm(px)
        py = norm(py)
        bx = norm(bx)
        by = norm(by)

        // console.log( 'px, py, bx, by:', px, py, bx, by );
        return Math.floor(Math.sqrt(Math.pow(px - bx, 2) + Math.pow(py - by, 2)))

        function norm(v) {
            return parseInt(v)
        }
    }

    function two_norm () {
        return _n_norm(2)
    }

    function _n_norm (n) {
        return function () {

        }
    }

    function scale(v) {
        return 1.0 * v
    }
})
