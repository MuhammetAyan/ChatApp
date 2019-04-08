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

var users = [];

io.on('connection', client => {
    users.push(client.id)
  
    client.on('disconnect', function () {
        for(var i =0; i < users.length; i++){
            if(users[i] == client.id){
                users.splice(i, 1);
                break;
            }
        }
    });
    
    client.join('room', () => {
        let rooms = Object.keys(client.rooms)
        console.log("[" + rooms[0] + "]:'" +  rooms[1] + "' odasına bağlandı.")
    })
    
    client.on('reqgetusers',function(){
        var temp = ""
        for(var clientid in users){
            temp+=clientid+"|"
        }
        temp +="\b";
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