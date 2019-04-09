var express = require('express'); 
var path = require('path');
var session = require('express-session'); 
var logger = require('morgan');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

rootPath = __dirname ;
viewsPath = __dirname + "/views/";
//app.use(logger('dev'));

//static files
app.get(/^\/public\/.*$/, function(req, res){
    res.sendFile(req.url, {root: rootPath});
});

app.get("/", function (req, res) {
    res.redirect("/chat.html")
})

//html requests
app.get(/.*\.html$/, function(req, res){
     res.sendFile(req.url, {root: viewsPath});
});


function selectElement(array, key, data) {
    for (let i = 0; i < array.length; i++) {
        if(array[i][key] == data){
            return i;
        }
    }
    return -1;
}
function removeElement(array, element) {
    for (let i = 0; i < array.length; i++) {
        if(array[i] == element){
            delete array.splice(i, 1);
        }
    }
    return array;
}


var users = [];

io.on('connection', client => {
    client.on('disconnect', function () {
        var i = selectElement(users, "id", client.id)
        
        if(i != -1){
            username = users[i]['username']
            //console.log(users[i] + " " + i)
            client.broadcast.emit("resuserlist", "logout", client.id, username)
            users.splice(i, 1);
        }
    });
    /*
    client.join('room', () => {
        let rooms = Object.keys(client.rooms)
        console.log("[" + rooms[0] + "]:'" +  rooms[1] + "' odasına bağlandı.")
    })
    */
    client.on('reqgetusers',function(callback){
        var temp = ""
        for(var i in users){
            if(users[i]['id'] != client.id)
                temp+=users[i]["id"] + ":" + users[i]["username"]+"|"
        }
        temp = temp.substr(0, temp.length - 1);
        callback(temp)
    })
    
    client.on('reqlogin', function(username, callback){
        var control = false;
        for(var i in users){
            if(users[i]['username'] == username){
            control = true;
            break;
            }
        }
        
        if (username == "")
            callback(false, "Kullanıcı adı boş girmeyiniz.")
        else if (control)
            callback(false, "Böyle bir kullanıcı zaten var!")
        else{
            users.push({'id': client.id, 'username': username})
            callback(true, "")
            var i = selectElement(users, "id", client.id)
            client.broadcast.emit("resuserlist", "login", client.id, users[i]['username'])
        }
    })

    client.on('reqglobal', function(data, source, callback){
        
        if (data == 0 || data =="" ){
            callback("Lütfen boş mesaj girmeyiniz!")
        }
        else{
            var message = data.trim();
            var now = new Date();
            var nowtext = now.getHours() + ":" + now.getMinutes()
            client.broadcast.emit('resglobal', message, source, nowtext, client.id);
            //console.log("[" + source + " " + nowtext +"] " + message);
        }
        
    })
    
})


server.listen(3000)