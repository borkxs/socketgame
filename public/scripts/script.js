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
        $html = $('html')

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
        join(message.id, true)
    })

    socket.on('otherJoin', function(message) {
        join(message.id)
    })

    function join(id, self) {
        // console.log('join id self', id, self)
        var player = actor(id, color())
        
        players[id] = player
        if (self) players.self = player

        $body.append(player)
        return player
    }

    socket.emit('join', {
        newRoom: 'home'
    })

    $html.mousemove(handleMouseEvent);

    function handleMouseEvent(mouseEvent) {

        var x = mouseEvent.clientX,
            y = mouseEvent.clientY

        // todo how to throttle
        socket.emit('moveSend', {
            top: y,
            left: x,
            id: players.self && players.self.id
        })

        return handlePositionChange(x, y)
    }

    function handlePositionChange(x, y, id) {

        var player = players[id] || players.self
            // var d = elementDistance(target, player),
            // scaled = scale(d)

        // console.log('handle x y id', x, y, id)
        return player && player.css({
            // width: 50,
            // height: 50,
            // 'border-radius': scaled,

            // top: y - scaled / 2, // center on mouse
            // left: x - scaled / 2
            top: y - 25,
            left: x - 25
        })
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
