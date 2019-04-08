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

//html requests
app.get(/.*\.html$/, function(req, res){
     res.sendFile(req.url, {root: viewsPath});
});

/*
app.get("", function (req, res) {
    
})*/

io.on('connection', client => {
    
    client.join('room', () => {
      let rooms = Object.keys(client.rooms)
      console.log("[" + rooms[0] + "]:'" +  rooms[1] + "' odasına bağlandı.")
    })

    client.on('reqglobal', function(data, source, callback){
        var message = data.trim();
        if (data == ""){
            callback("Lütfen boş mesaj girmeyiniz!")
        }
        else{
            var now = new Date();
            var nowtext = now.getHours() + ":" + now.getMinutes()
            client.broadcast.emit('resglobal', message, source, nowtext, client.id);
            //console.log("[" + source + " " + nowtext +"] " + message);
        }
        
    })
})




server.listen(3000)