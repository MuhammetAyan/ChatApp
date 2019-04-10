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
    if(req.body.username == "admin" && req.body.password == "1234"){
        res.sendStatus(200)
    }else{
        res.statusMessage="Kullanici adi veya parola hatali!"
        res.sendStatus(403)
    }
})

io.on('connection', client => {

    //users.push({'id': client.id, 'username': req.body.username})
    console.log("bağlantı var:" + client.id)

    client.on('disconnect', function () {
        var i = users.filter((x, i) => x.id == client.id, i)
        console.log(i)
        users.splice(i, 1)
    })
})

//html requests
app.get("/index", function(req, res){
    res.sendFile("/index.html", {root: viewsPath});
});


server.listen(80)