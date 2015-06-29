var socket = io.connect()

var colors = [
    '#FF8508',
    '#BB53A2',
    '#38B0C4',
    '#6493A8',
    '#6C5A80',
    '#351725',
    '#1592CC'
]

var players = []

var actor = function ( color ) {
    return $('<span>')
                .addClass('actor')
                .css('background', color)
}
var color = function () {
    return colors[ Math.floor( Math.random() * colors.length ) ]
}

$(document).ready(function() {

    socket.on('moveGet', function(message) {
        console.log('moveGet', message)
        handlePositionChange(message.user, message.left, message.top)
    })

    socket.on('joinResult', function(message) {

    })

    var player = actor(color()), // self/player
        target = actor(color())

    $('body')
        .append(target)
        .append(player)

    $('html')
        .mousemove(handleMouseEvent);

    function handleMouseEvent(mouseEvent) {

        var x = mouseEvent.clientX,
            y = mouseEvent.clientY

        // todo how to throttle
        socket.emit('moveSend', {
            top: y,
            left: x
        })

        return handlePositionChange(x, y)
    }

    function handlePositionChange(x, y) {

        var d = elementDistance(target, player),
            scaled = scale(d)

        return player.css({
            width: scaled,
            height: scaled,
            'border-radius': scaled,

            top: y - scaled / 2, // center on mouse
            left: x - scaled / 2
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

    function scale(v) {
        return 1.0 * v
    }
})