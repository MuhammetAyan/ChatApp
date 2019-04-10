var username = ""

$(window).ready(function () {
    $('#input').on('keypress', function (e) {
        if(e.which == 13){
            var message = $('#input').val()
            msgparser(message)
            $('#input').val('')
        }
    })
})

function writeMessage(message, sender, targets, date) {
    var html = "";
    switch (sender) {
        case "Siz":
        html = '<div class="alert-info"><span class="badge badge-success">' + sender + '</span>==>' +
        '<span class="badge badge-warning">' + targets + '</span>' +
        '<span class="badge badge-secondary">' + date + '</span>' + message + '</div>'
            break;
        case "Sistem":
        html = '<div class="bg-dark text-center text-light" >' +
        '<span class="badge badge-secondary">' + date + '</span>' + message + '</div>'
        break;
        default:
        html = '<div class="alert-warning" ><span class="badge badge-warning">' + sender + '</span>==>' +
        '<span class="badge badge-success">' + targets + '</span>' +
        '<span class="badge badge-secondary">' + date + '</span>' + message + '</div>'
            classinfo = "alert-warning"
            break;
    }
    $('#chatarea').append(html)
}

function Now() {
    var now = new Date();
    return now.getHours() + ":" + now.getMinutes()
}


function msgparser(code) {
    if (code == '') return
    var tokens = code.split('#')
    switch (tokens[0]) {
        case 'msg':
            var message = tokens[2]
            var targets = tokens[1].split("@")
            writeMessage(message, 'Siz', targets, Now())
            sendmessage(message, targets)
            break
        case 'all':
            var message = code.substring(4)
            writeMessage(message, 'Siz', "all", Now())
            sendall(message)
            break
        case 'login':
            logout(function () {
                writeMessage("Çıkış yapıldı.", 'Sistem', '', Now())
            })
            var name = tokens[1]
            login(name, function (status, errmsg) {
                if (status){
                    username = name
                    writeMessage("Giriş yapıldı: " + name, 'Sistem', '', Now())
                }else{
                    writeMessage("Giriş yapılamadı: " + errmsg, 'Sistem', '', Now())
                }
            })
            break
        case 'logout':
            logout(function () {
                writeMessage("Çıkış yapıldı.", 'Sistem', '', Now())
            })
            break
        default:
            writeMessage("Bilinmeyen komut: " + tokens[0], 'Sistem', '', Now())
            break
    }
}
//soket----------------------------------------------------------------------------------
var socket = io.connect();

function sendmessage(message, targets) {
    socket.emit("reqmessage", message, targets)
}

function sendall(message) {
    socket.emit("reqmessage", message, "all")
}

function login(name, callback) {
    socket.emit("reqlogin", name, callback)
}

function logout(callback) {
    socket.emit("reqlogout", callback)
}

socket.on('resmessage', function (message, sender, targets, date) {
    writeMessage(message, sender, targets, date)
})

socket.on('resnotification', function (message) {
    writeMessage(message, 'Sistem', '', Now())
})