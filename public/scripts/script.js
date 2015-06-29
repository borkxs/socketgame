var socket = io.connect()

$(document).ready(function(){

    socket.on('moveGet', function(message) {
        console.log('moveGet', message)
        handlePositionChange( message.left, message.top )
    })

    var target = $('<span>').addClass('target actor'),
        player = $('<span>').addClass('player actor')

    $('body')
        .append(target)
        .append(player)

    $('html')
        .mousemove(handleMouseEvent);

    function handleMouseEvent ( mouseEvent ) {
        return handlePositionChange( mouseEvent.clientX, mouseEvent.clientY )
    }

    function handlePositionChange ( x, y ) {

        var d = elementDistance( target, player ),
            scaled = scale( d )

        player.css({
            width: scaled,
            height: scaled,
            'border-radius': scaled,

            top: y - scaled / 2, // center on mouse
            left: x - scaled / 2
        })

        socket.emit('moveSend', {
            top: parseInt( player.css('top') ),
            left: parseInt( player.css('left') )
        })
    }

    function elementDistance ( elem1, elem2 ) {
        var px = elem1.css('top'),
            py = elem1.css('left'),
            bx = elem2.css('top'),
            by = elem2.css('left');

        return distance( px, py, bx, by )
    }

    function distance ( px, py, bx, by ) {
        px = norm(px)
        py = norm(py)
        bx = norm(bx)
        by = norm(by)

        // console.log( 'px, py, bx, by:', px, py, bx, by );
        return Math.floor( Math.sqrt( Math.pow(px - bx, 2) + Math.pow(py - by, 2) ) )

        function norm ( v ) { return parseInt(v) }
    }

    function scale ( v ) {
        return 1.0 * v
    }
})