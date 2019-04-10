var express = require('express'); 
var path = require('path');
var session = require('express-session'); 
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(bodyParser.json());

rootPath = __dirname ;
viewsPath = __dirname + "/views/";
//app.use(logger('dev'));


//static files
app.get(/^\/public\/.*$/, function(req, res){
    res.sendFile(req.url, {root: rootPath});
});

app.get("/", function (req, res) {
    res.redirect("/index")
})

//html requests
app.get("/index", function(req, res){
    res.sendFile("/index.html", {root: viewsPath});
});

server.listen(80)


var users = []



io.on('connection', client => {

    //soket giriş yapma
    client.on('reqlogin', function (username, callback) {
        username = username.trim()
        if(username == ""){
            callback(false, "Lütfen bir kullanıcı adı giriniz.")
        }else if(username.includes('#') || username.includes('@') || username.includes(',')){
            callback(false, "Kullanıcı adı $ @ , gibi karakterler içeremez")
        }else if(username == "Siz" || username == "Sistem"){
            callback(false, "Geçersiz kullanıcı adı")
        }else{
            console.log(username + " bağlandı.")
            users.push({'id': client.id, 'username': username})
            client.broadcast.emit('resnotification', "'" + username + "' adlı kullanıcı bağlandı.")
            callback(true, "")
        }
    })

    //soket çıkış yapma
    client.on('reqlogout', function (callback) {
        var user = users.filter((x, i) => x.id == client.id)
        if(user === undefined || user[0] === undefined || user[0]['username'] === undefined) return
        var username = user[0]['username']
        console.log(username + " ayrıldı.")
        client.broadcast.emit('resnotification', "'" + username + "' adlı kullanıcı ayrıldı.")
        users = users.filter((x) => x.id != client.id)
        callback()
    })

    //soket çıkış yapma
    client.on('disconnect', function () {
        var user = users.filter((x, i) => x.id == client.id)
        if(user === undefined || user[0] === undefined || user[0]['username'] === undefined) return
        var username = user[0]['username']
        console.log(username + " ayrıldı.")
        client.broadcast.emit('resnotification', "'" + username + "' adlı kullanıcı ayrıldı.")
        users = users.filter((x) => x.id != client.id)
    })

    //Gelen mesajlar
    client.on('reqmessage', function (message, targets) {
        //Yetkisi varsa
        username = getUsername(client.id)
        if (targets == "all"){
            client.broadcast.emit('resmessage', message, username, targets, Now())
        }else{
            targets.forEach(target => {
                client.to(getUserId(target)).emit('resmessage', message, username, targets, Now())
            });
        }
    })

})





function Now() {
    var now = new Date();
    return now.getHours() + ":" + now.getMinutes()
}

function getUsername(id) {
    var user = users.filter(x=>x.id == id)
    if (user === undefined) return null;
    if (user[0] === undefined) return null;
    if (user[0]['username'] === undefined) return null;
    return user[0]['username']
}

function getUserId(name) {
    var user = users.filter(x=>x.username == name)
    if (user === undefined) return null;
    if (user[0] === undefined) return null;
    if (user[0]['id'] === undefined) return null;
    return user[0]['id']
}
