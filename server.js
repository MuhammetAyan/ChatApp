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
    res.redirect("/login.html")
})

//login yapma
app.post("/login", function (req, res) {
    if(req.body.username == "admin" && req.body.password == "1234"){
        res.sendStatus(200)
    }else{
        res.statusMessage="Kullanici adi veya parola hatali!"
        res.sendStatus(403)
    }
})

//html requests
app.get(/.*\.html$/, function(req, res){
    res.sendFile(req.url, {root: viewsPath});
});


server.listen(80)