var app = angular.module('myApp', []);
app.controller('chat', function($scope, $http) {
    $scope.socket = io.connect();
    $scope.username = "";
    $scope.globalMessages = []; //Global mesajlar
    $scope.roomsMessages = {}; //Oda mesajları
    //{}.degiskenadi = "abc"; delete {"degiskenadi": "abc"};
    $scope.usersMessage = {};

    $scope.rooms = []; //Açık odalar
    $scope.users = []; //Açık kullanıcılar


    $('#myModal').on('click', function () {
        setTimeout(function (){
          if ($scope.username == "")
            $('#myModal').modal('show');
          }, 500);
    });

    $scope.login = function () {
        if ($scope.username != ""){
            $('#myModal').modal('hide');
            $('#input').focus();
        }else{
            alert("Lütfen kullanıcı adı giriniz.");
        }
    }

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
    
    
    //Kullanıcıları getir
    $scope.socket.emit('reqgetusers', function(data){
        $scope.users = data.split("|")
        $scope.$apply();
    }); 
    
    $scope.herkeseMesajGonder = function (message) {
        $scope.socket.emit('reqglobal', message, $scope.username, function(data){
             var now = new Date();
             var nowtext = now.getHours() + ":" + now.getMinutes()
             $scope.globalMessages.push({'index':$scope.globalMessages.length, 'source':'Siz', 'message':data, 'date':nowtext})
        })
        var now = new Date();
        var nowtext = now.getHours() + ":" + now.getMinutes()
        $scope.globalMessages.push({'index':$scope.globalMessages.length, 'source':'Siz', 'message':message, 'date':nowtext})
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
        $scope.globalMessages.push({'index':$scope.globalMessages.length, 'source': source, 'message':data, 'date': date})
        $scope.$apply();
    })

});