function herkeseMesajGonder(message) {
    socket.emit('reqglobal', message, username, function(data){
         var now = new Date();
         var nowtext = now.getHours() + ":" + now.getMinutes()
         writemessage(message, 'Siz', nowtext, "globalPanel")
    })
    var now = new Date();
    var nowtext = now.getHours() + ":" + now.getMinutes()
    writemessage(message, 'Siz', nowtext, "globalPanel")
}

//Herkesten mesaj al
function globallistener(){
    socket.on('resglobal', function(data, source, date) {
        writemessage(data, source, date, "globalPanel")
    }
)}

//kullanıcı değişikliklerini algıla
function userlistlistener(){
    socket.on('resuserlist', function(status, id, username) {
        if (status == "login"){
            //writeuser(id, username);
            writemessage("'" + username + "' adlı kullanıcı giriş yaptı.", '', '');
        }
        if (status == "logout"){
            writemessage("'" + username + "' adlı kullanıcı ayrıldı.", '', '');
            //deleteuser(id);
        }
    })
}


$(document).ready(function () {
    
    //kullanıcı listesi isteği
    $('#users').click(function () {
        if (username != ""){
            socket.emit('reqgetusers', function(data){
                $('#userlist').html('');
                var tokens = data.split("|")
                for(var i in tokens){
                    if (tokens[i] != undefined && tokens[i] != ""){
                    var t  = tokens[i].split(":");
                        writeuser(t[0]/*id*/, t[1]/*username*/)
                    }
                }
            }); 
        }else{
            $('#btn-navlogin').click()
        }
    })

    //mesajı gönder
    $('#send-btn').click(function () {
        if(username != ""){
            herkeseMesajGonder($('#input-chat').val())
            $('#input-chat').val('')
        }else{
            $('#btn-navlogin').click()
        }
    });

});

