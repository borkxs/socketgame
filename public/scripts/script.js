$(document).ready(function() {

    var socket = io.connect(),

        players = {},

        actor = function(id, color) {
            return makeActor(color)

            function makeActor(color) {
                var inst = $('<span>')
                    .addClass('actor')
                    .css('background', color)
                inst.id = id
                return inst
            }
        },

        selfId = undefined,

        color = (function() {
            var colors = [
                '#1592CC',
                '#351725',
                '#38B0C4',
                '#6493A8',
                '#6C5A80',
                '#BB53A2',
                '#FF8508'
            ]
            return function get_color() {
                return colors[Math.floor(Math.random() * colors.length)]
            }
        }()),

        buffer = (function() {

            var buff = [ /* id: [] */ ]

            function buf_inst(id, cb) {
                var idBuff = buff[id] = buff[id] || []
                idBuff.push(cb)
            }
            buf_inst.shave = function() {
                Object.keys(buff).map(function(id) {
                    var f = buff[id].shift()
                    if ( f && typeof f == 'function' )
                        f()
                })
            }
            return buf_inst
        }())


    //////////
    requestAnimationFrame(function frame(timestamp) {
        buffer.shave()
        requestAnimationFrame(frame)
    })
    socket.on('moveGet', function(message) {
        buffer(message.id, function() {
            move(message.id, message.left, message.top)
        })
    })
    socket.on('selfJoin', function(message) {
        selfId = message.id
    })
    socket.emit('join', {
        newRoom: 'home'
    })
    $('html').mousemove(mouse)
    document.ontouchmove = touch
    ///////////

    function touch (event) {
        event.preventDefault()
        mouse(event.changedTouches[0])
    }
    function mouse (event) {
        return change(selfId, event.clientX, event.clientY)
    }
    function change (id, x, y){
        send(id, x, y)
        move(id, x, y)
    }
    function send(id, x, y){
        socket.emit('moveSend', {
            id: id,
            top: y,
            left: x
        })
    }
    function move(id, x, y){
        player(id).css({
            top: y - 25,
            left: x - 25
        })
    }
    function player(id) {
        // console.log('player(id)', id)
        var player = players[id]
        if (!player) {
            player = players[id] = actor(id,color())
            player.id = id
            $('body').append(player)
            if (player.id == selfId)
                players.self = player
        }
        return player
    }
})
