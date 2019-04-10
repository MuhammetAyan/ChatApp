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

var users = [];


//login yapma
app.post("/login", function (req, res) {
    //if(req.body.username == "admin" && req.body.password == "1234"){
        res.sendStatus(200)
    //}else{
    //    res.statusMessage="Kullanici adi veya parola hatali!"
    //    res.sendStatus(403)
    //}
})

io.on('connection', client => {

    //soket giriş yapma
    client.on('reqsignin', function (username) {
        console.log(username + " bağlandı.")
        users.push({'id': client.id, 'username': username})
        client.broadcast.emit("resuserchange", "login", client.id, username)
    })

    //soket çıkış yapma
    client.on('disconnect', function () {
        var user = users.filter((x, i) => x.id == client.id)
        if(user === undefined || user[0] === undefined || user[0]['username'] === undefined) return
        var username = user[0]['username']
        console.log(username + " ayrıldı.")
        client.broadcast.emit("resuserchange", "logout", client.id, username)
        users = users.filter((x) => x.id != client.id)
    })

    //Kullanıcı listesi isteği
    client.on('reqgetuserlist', function (callback) {
        //Yetkisi varsa
        kullanicilar = users.filter(x=>x.id != client.id)
        data = kullanicilar.map(x=>{return {'id': x.id, 'username': x.username, 'type': "user"}})
        callback(data)
    })

    //Gelen mesajlar
    client.on('reqmessage', function (message, type, name) {
        //Yetkisi varsa
        username = getUsername(client.id)
        if (type == "all"){
            client.broadcast.emit('resmessage', message, username, type, name, Now())
        }else if(type =="room" || type == "user"){
            socket.to(name).emit('resmessage', message, username, type, name, Now(), function () {})
        }
    })

    //Toplu mesaj gönderme
    client.on('reqgetmessage', function (type, name, callback) {
        //Yetkisi varsa
        callback({'message':'', 'sender':'test', 'date': Now()})
    })
})

//html requests
app.get("/index", function(req, res){
    res.sendFile("/index.html", {root: viewsPath});
});



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

server.listen(80)