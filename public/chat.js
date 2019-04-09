var app = angular.module('myApp', []);
app.controller('chat', function($scope, $http) {
    $scope.socket = io.connect();
    $scope.username = "";

    $scope.writemessage = function(message, source, nowtext){
        if(message != ""){
            var classvalue = ""
            switch (source) {
                case "Siz":
                    classvalue = "alert-success text-right";
                    break;
                case "":
                    classvalue = "alert-secondary text-center";
                    break;
                default:
                    classvalue = "alert-warning";
                    break;
            }
            html = '<div class="' + classvalue + '">' +
            '<div class="badge badge-dark">' + source + '</div>' +
            '<div class="badge badge-secondary">'+ nowtext +'</div>'+
            '<p class="mb-1">' + message + '</p>'+
            '</div>';
            $('#globalpanel').append(html);
        }
    }

    $scope.writeuser = function(id, username){
        html= '<div class="list-group-item" id="' + id + '">' + username +'</div>'
        $('#userspanel').append(html);
    }

    $scope.deleteuser = function(id){
        $('#' + id).remove();
    }

    $('#myModal').on('click', function () {
        setTimeout(function (){
          if ($scope.username == "")
            $('#myModal').modal('show');
          }, 500);
    });

    $scope.login = function () {
        if ($scope.username != ""){
            $scope.loginsubmit();
        }else{
            alert("Lütfen kullanıcı adı giriniz.");
        }
    }    
    
    //Kullanıcıları getir
    $scope.userlist = function () {    
        $scope.socket.emit('reqgetusers', function(data){
            $('#userspanel').empty();
            $('#globalpanel').empty();
            var tokens = data.split("|")
            for(var i in tokens){
                if (tokens[i] != undefined && tokens[i] != ""){
                var t  = tokens[i].split(":");
                $scope.writeuser(t[0]/*id*/, t[1]/*username*/)
                }
            }
        }); 
    }
    $scope.loginsubmit = function () {
        $scope.socket.emit('reqlogin', $scope.username, function (status, message) {
            if (status){
                $('#myModal').modal('hide');
                $('#input').focus();
                $scope.userlist();
            }else{
                alert(message)
            }
        })
    }
    
    $scope.herkeseMesajGonder = function (message) {
        $scope.socket.emit('reqglobal', message, $scope.username, function(data){
             var now = new Date();
             var nowtext = now.getHours() + ":" + now.getMinutes()
             $scope.writemessage(message, 'Siz', nowtext)
        })
        var now = new Date();
        var nowtext = now.getHours() + ":" + now.getMinutes()
        $scope.writemessage(message, 'Siz', nowtext)
        $scope.text = ""
    }

    $scope.OdayaMesajGonder = function (room, message) {
        socket.to(room).emit('oda' + room, message)
    }

    $scope.OzelMesajGonder = function (id, message) {
        socket.to(id).emit('ozel' + id, message)
    }

    // Arkayüzden tetiklenen mesajları yakalamak için
    $scope.socket.on('resglobal', function(data, source, date) {
        $scope.writemessage(data, source, date)
    })

    $scope.socket.on('resuserlist', function(status, id, username) {
        if (status == "login"){
            $scope.writeuser(id, username);
            $scope.writemessage(username + " adlı kullanıcı giriş yaptı.", '', '');
        }
        if (status == "logout"){
            $scope.writemessage(username + " adlı kullanıcı ayrıldı.", '', '');
            $scope.deleteuser(id);
        }
            
    })
});